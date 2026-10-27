import os,subprocess
jobs=[]
for mode in ['fixed','hybrid2','hybrid3']:
 for i in range(2):
  log=open('/tmp/develop103-'+mode+'-'+str(i)+'.log','w');env=dict(os.environ,MODE103=mode,SHARDS103='2',SHARD103=str(i));jobs.append((subprocess.Popen(['node','scripts/develop-evidence-103.mjs'],env=env,stdout=log,stderr=subprocess.STDOUT),log))
for p,l in jobs:
 code=p.wait();l.close()
 if code:raise SystemExit(code)
subprocess.run(['node','scripts/select-evidence-103.mjs'],check=True)
