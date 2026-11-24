"""Allowlisted deterministic commands for the supervised factory."""
import os, subprocess
from pathlib import Path
COMMANDS={'test':['npm','test'],'typecheck':['npm','run','typecheck'],'build':['npm','run','build'],'tsf':['python3','-m','unittest','discover','-s','.tsf/tests','-v']}
def checks(root:Path,name:str):
    if name not in COMMANDS: raise ValueError('Command not allowed')
    env={k:v for k,v in os.environ.items() if k in {'PATH','LANG','TMPDIR'}}
    env['PATH']=str(root/'node_modules/node/bin')+':'+env.get('PATH','/usr/bin:/bin')
    return subprocess.run(COMMANDS[name],cwd=root,env=env,capture_output=True,text=True,timeout=180)
