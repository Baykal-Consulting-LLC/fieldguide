import os,subprocess
jobs=[]
for mode in ['current','activity1','activity3']:
 for i in range(2):
  log=open('/tmp/develop102-'+mode+'-'+str(i)+'.log','w');env=dict(os.environ,MODE102=mode,SHARDS102='2',SHARD102=str(i));jobs.append((subprocess.Popen(['node','scripts/develop-evidence-102.mjs'],env=env,stdout=log,stderr=subprocess.STDOUT),log))
for p,l in jobs:
 code=p.wait();l.close()
 if code:raise SystemExit(code)
subprocess.run(['node','scripts/select-evidence-102.mjs'],check=True)
