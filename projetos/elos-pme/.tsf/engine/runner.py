"""Local deterministic TSF verification runner. No live model adapter is enabled."""
import fnmatch, hashlib, json, os, sqlite3, stat, subprocess, sys, time, uuid
from decimal import Decimal
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'harness'))
from envelopes import BuildOutput
class Blocked(Exception): pass
class PermissionBreach(Blocked): pass

def snapshot(root):
    result={}
    for base, dirs, files in os.walk(root,followlinks=False):
        dirs[:]=[d for d in dirs if d not in {'.git','node_modules','.next','__pycache__'} and Path(base,d)!=root/'.tsf/state']
        for name in files + [d for d in dirs if Path(base,d).is_symlink()]:
            p=Path(base,name); rel=p.relative_to(root).as_posix()
            if rel=='.git': continue
            mode=p.lstat().st_mode
            data=os.readlink(p).encode() if stat.S_ISLNK(mode) else p.read_bytes()
            result[rel]=(stat.S_IMODE(mode),hashlib.sha256(data).hexdigest())
    return result

def verify_diff(before,after,allow,protected):
    changed=sorted(k for k in before.keys()|after.keys() if before.get(k)!=after.get(k))
    for name in changed:
        if any(name.startswith(p) for p in protected) or not any(name==p or (("*" in p or "?" in p) and fnmatch.fnmatchcase(name,p)) for p in allow):
            raise PermissionBreach(name)
    return changed

def database(root):
    state=root/'.tsf/state'; state.mkdir(parents=True,exist_ok=True)
    db=sqlite3.connect(state/'factory.db',timeout=2)
    db.executescript('''CREATE TABLE IF NOT EXISTS runs(id TEXT PRIMARY KEY, task TEXT, state TEXT, started REAL, ended REAL, result TEXT);
    CREATE TABLE IF NOT EXISTS usage_ledger(run_id TEXT PRIMARY KEY,day TEXT,reserved INTEGER,actual INTEGER);
    CREATE TABLE IF NOT EXISTS leases(name TEXT PRIMARY KEY,owner TEXT,expires REAL);
    CREATE TABLE IF NOT EXISTS feedback_loop(run_id TEXT,decision TEXT,notes TEXT,guardrail TEXT);
    CREATE TABLE IF NOT EXISTS approvals(task TEXT PRIMARY KEY,approved_by TEXT);
    CREATE TABLE IF NOT EXISTS steps(run_id TEXT,name TEXT,exit_code INTEGER);
    CREATE TABLE IF NOT EXISTS artifacts(run_id TEXT,path TEXT);
    CREATE TABLE IF NOT EXISTS envelopes(run_id TEXT,json TEXT);''')
    return db

def units(amount): return int(Decimal(str(amount))*1000000)

def run(root,task,command,envelope,allow,timeout=180,reservation='0',provider='fake'):
    if provider!='fake': raise Blocked('No validated live provider: cost/cancellation unavailable')
    if not 0<timeout<=180: raise Blocked('Invalid timeout')
    cfg=json.loads((root/'.tsf/config.yaml').read_text()); db=database(root)
    if not db.execute('SELECT 1 FROM approvals WHERE task=?',(task,)).fetchone():
        db.close(); raise Blocked('Task not approved')
    rid=str(uuid.uuid4()); now=time.time(); day=time.strftime('%Y-%m-%d',time.gmtime())
    db.execute('BEGIN IMMEDIATE')
    try:
        # Expired leases are recorded as interrupted; reservation remains spent conservatively.
        expired=db.execute('SELECT owner FROM leases WHERE expires<?',(now,)).fetchall()
        for (owner,) in expired: db.execute("UPDATE runs SET state='INTERRUPTED',ended=? WHERE id=? AND state='RUNNING'",(now,owner))
        db.execute('DELETE FROM leases WHERE expires<?',(now,))
        if db.execute('SELECT 1 FROM leases').fetchone(): raise Blocked('Busy')
        cost=units(reservation)
        spent=db.execute('SELECT COALESCE(SUM(reserved),0) FROM usage_ledger WHERE day=?',(day,)).fetchone()[0]
        if cost<0 or cost>units(cfg['worker_cap_usd']) or spent+cost>units(cfg['daily_cap_usd']): raise Blocked('Budget exceeded')
        db.execute('INSERT INTO leases VALUES(?,?,?)',('worker',rid,now+timeout+30))
        db.execute('INSERT INTO usage_ledger VALUES(?,?,?,NULL)',(rid,day,cost))
        db.execute('INSERT INTO runs VALUES(?,?,?,?,NULL,NULL)',(rid,task,'RUNNING',now)); db.commit()
    except Exception: db.rollback(); db.close(); raise
    before=snapshot(root); state='FAILED'; result={}
    try:
        # Only deterministic child commands; callers must provide an allowlisted task command.
        proc=subprocess.Popen(command,cwd=root,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL,start_new_session=True)
        try: code=proc.wait(timeout=timeout)
        except subprocess.TimeoutExpired:
            import signal
            os.killpg(proc.pid,signal.SIGKILL); proc.wait(); raise Blocked('Timeout')
        db.execute('INSERT INTO steps VALUES(?,?,?)',(rid,'subprocess',code))
        changed=verify_diff(before,snapshot(root),allow,cfg['protected'])
        if code: raise Blocked('Checks failed')
        output=BuildOutput.model_validate(envelope)
        if set(output.changed_files)!=set(changed): raise Blocked('Changed file envelope mismatch')
        for name in output.artifacts:
            path=(root/name).resolve()
            if not path.is_relative_to(root.resolve()) or not path.is_file(): raise Blocked('Unsafe/missing artifact')
        if output.status!='success': raise Blocked('Worker failed')
        result=output.model_dump(); state='READY FOR REVIEW'
        db.execute('INSERT INTO envelopes VALUES(?,?)',(rid,json.dumps(result)))
    except Exception as e: result={'error':type(e).__name__+': '+str(e)}
    finally:
        # Always inspect filesystem even when timeout/invalid output occurs.
        try: verify_diff(before,snapshot(root),allow,cfg['protected'])
        except PermissionBreach as e: state='BLOCKED'; result={'error':'PermissionBreach: '+str(e)}
        artifact=root/'.tsf/state/artifacts'/f'{rid}.json'; artifact.parent.mkdir(exist_ok=True)
        artifact.write_text(json.dumps({'schema_version':'1','started_at':now,'ended_at':time.time(),'base_sha':subprocess.check_output(['git','rev-parse','HEAD'],cwd=root,text=True).strip() if (root/'.git').exists() else None,'pre_manifest_hash':hashlib.sha256(json.dumps(before,sort_keys=True).encode()).hexdigest(),'post_manifest_hash':hashlib.sha256(json.dumps(snapshot(root),sort_keys=True).encode()).hexdigest(),'run_id':rid,'task':task,'provider':provider,'cost_usd':'0','reserved_usd':reservation,'state':state,'result':result},indent=2))
        db.execute('UPDATE runs SET state=?,ended=?,result=? WHERE id=?',(state,time.time(),json.dumps(result),rid))
        db.execute('UPDATE usage_ledger SET actual=0 WHERE run_id=?',(rid,))
        db.execute('INSERT INTO artifacts VALUES(?,?)',(rid,str(artifact)))
        db.execute('DELETE FROM leases WHERE owner=?',(rid,)); db.commit(); db.close()
    return state,result
