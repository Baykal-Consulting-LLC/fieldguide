import os,subprocess
jobs=[]
for mode in ['context','context-finish','finish']:
 for i in range(2):
  log=open('/tmp/develop101-'+mode+'-'+str(i)+'.log','w');env=dict(os.environ,MODE101=mode,SHARDS101='2',SHARD101=str(i));jobs.append((subprocess.Popen(['node','scripts/develop-evidence-101.mjs'],env=env,stdout=log,stderr=subprocess.STDOUT),log))
for p,l in jobs:
 code=p.wait();l.close()
 if code:raise SystemExit(code)
subprocess.run(['node','scripts/select-evidence-101.mjs'],check=True)
