import os,subprocess
jobs=[]
for mode in ['fixed','local','relevant','protected']:
 for i in range(2):
  log=open('/tmp/develop104-'+mode+'-'+str(i)+'.log','w');env=dict(os.environ,MODE104=mode,SHARDS104='2',SHARD104=str(i));jobs.append((subprocess.Popen(['node','scripts/develop-evidence-104.mjs'],env=env,stdout=log,stderr=subprocess.STDOUT),log))
for p,l in jobs:
 code=p.wait();l.close()
 if code:raise SystemExit(code)
subprocess.run(['node','scripts/select-evidence-104.mjs'],check=True)
