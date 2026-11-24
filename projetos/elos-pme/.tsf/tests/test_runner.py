import importlib.util,json,sys,tempfile,unittest
from pathlib import Path
spec=importlib.util.spec_from_file_location('runner',Path(__file__).parents[1]/'engine/runner.py'); r=importlib.util.module_from_spec(spec); spec.loader.exec_module(r)
class RunnerTests(unittest.TestCase):
 def setUp(self):
  self.tmp=tempfile.TemporaryDirectory(); self.root=Path(self.tmp.name); (self.root/'.tsf').mkdir()
  (self.root/'.tsf/config.yaml').write_text(json.dumps({'worker_cap_usd':'0.25','daily_cap_usd':'1','protected':['tests/','.tsf/']}))
  db=r.database(self.root); db.execute('INSERT INTO approvals VALUES(?,?)',('T','test')); db.commit(); db.close()
  self.env={'status':'success','summary':'ok','artifacts':[],'changed_files':[]}
 def tearDown(self): self.tmp.cleanup()
 def test_success_persists(self):
  self.assertEqual(r.run(self.root,'T',[sys.executable,'-c','pass'],self.env,[])[0],'READY FOR REVIEW')
 def test_budget_and_unknown_provider_fail_closed(self):
  with self.assertRaises(r.Blocked): r.run(self.root,'T',[],self.env,[],reservation='.26')
  with self.assertRaises(r.Blocked): r.run(self.root,'T',[],self.env,[],provider='live')
 def test_unapproved(self):
  with self.assertRaises(r.Blocked): r.run(self.root,'NO',[],self.env,[])
 def test_invalid_envelope(self):
  self.assertEqual(r.run(self.root,'T',[sys.executable,'-c','pass'],dict(self.env,extra=True),[])[0],'FAILED')
 def test_permission_even_on_failure(self):
  state,_=r.run(self.root,'T',[sys.executable,'-c',"open('forbidden','w').write('x'); raise Exception()"],self.env,[])
  self.assertEqual(state,'BLOCKED')
 def test_timeout(self):
  self.assertEqual(r.run(self.root,'T',[sys.executable,'-c','import time;time.sleep(5)'],self.env,[],timeout=.05)[0],'FAILED')
 def test_hash_change_and_deletion(self):
  p=self.root/'a'; p.write_text('a'); before=r.snapshot(self.root); p.write_text('b')
  with self.assertRaises(r.PermissionBreach): r.verify_diff(before,r.snapshot(self.root),[],[])
  p.unlink(); self.assertEqual(r.verify_diff(before,r.snapshot(self.root),['a'],[]),['a'])
 def test_daily_budget_shared(self):
  for _ in range(4): r.run(self.root,'T',[sys.executable,'-c','pass'],self.env,[],reservation='.25')
  with self.assertRaises(r.Blocked): r.run(self.root,'T',[],self.env,[],reservation='.01')
 def test_traversal(self):
  self.assertEqual(r.run(self.root,'T',[sys.executable,'-c','pass'],dict(self.env,artifacts=['../bad']),[])[0],'FAILED')
if __name__=='__main__': unittest.main()

class LockTests(unittest.TestCase):
 setUp=RunnerTests.setUp
 tearDown=RunnerTests.tearDown
 def test_live_lease_blocks(self):
  import time
  db=r.database(self.root);db.execute('INSERT INTO leases VALUES(?,?,?)',('worker','other',time.time()+100));db.commit();db.close()
  with self.assertRaises(r.Blocked):r.run(self.root,'T',[],self.env,[])
 def test_restart_marks_expired_interrupted(self):
  db=r.database(self.root);db.execute("INSERT INTO runs VALUES('old','T','RUNNING',0,NULL,NULL)");db.execute("INSERT INTO leases VALUES('worker','old',0)");db.commit();db.close()
  self.assertEqual(r.run(self.root,'T',[sys.executable,'-c','pass'],self.env,[])[0],'READY FOR REVIEW')
  db=r.database(self.root);self.assertEqual(db.execute("SELECT state FROM runs WHERE id='old'").fetchone()[0],'INTERRUPTED');db.close()

class LiteralPathTests(unittest.TestCase):
 def test_next_dynamic_route_literal(self):
  name='src/app/p/[token]/page.tsx'
  self.assertEqual(r.verify_diff({}, {name:(420,'hash')},[name],[]),[name])
  with self.assertRaises(r.PermissionBreach):
   r.verify_diff({}, {'src/app/p/other/page.tsx':(420,'hash')},[name],[])

 def test_literal_brackets_never_authorize_single_character_route(self):
  with self.assertRaises(r.PermissionBreach):
   r.verify_diff({}, {'src/app/p/t/page.tsx':(420,'hash')},['src/app/p/[token]/page.tsx'],[])
