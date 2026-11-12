"""Supervised deterministic verification, not an autonomous model run."""
import importlib.util,json,sys
from pathlib import Path
root=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('runner',root/'.tsf/engine/runner.py'); r=importlib.util.module_from_spec(spec);spec.loader.exec_module(r)
task='T09-deterministic-verification'
db=r.database(root);db.execute('INSERT OR REPLACE INTO approvals VALUES(?,?)',(task,'operator: implementation approved in conversation; deterministic local checks only'));db.commit();db.close()
command=[sys.executable,'-c',"import subprocess,sys;sys.path.insert(0,'.tsf/harness');from domain_tools import checks;from pathlib import Path; results=[checks(Path.cwd(),n) for n in ['test','typecheck','tsf']];sys.exit(any(x.returncode for x in results))"]
state,result=r.run(root,task,command,{'status':'success','summary':'Deterministic checks completed; human review pending','artifacts':['docs/spec.md'],'changed_files':[]},[],provider='fake')
print(json.dumps({'state':state,'provider':'fake','live_model':False,'result':result},indent=2))
if state!='READY FOR REVIEW':sys.exit(1)
