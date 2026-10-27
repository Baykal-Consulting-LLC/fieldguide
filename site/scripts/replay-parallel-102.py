import subprocess,os,sys
jobs=[]
for i in range(4):
 log=open('/tmp/fresh102-shard-'+str(i)+'.log','w');env=dict(os.environ,SHARDS102='4',SHARD102=str(i));jobs.append((subprocess.Popen(['node','scripts/rerun-evidence-102.mjs'],env=env,stdout=log,stderr=subprocess.STDOUT),log))
codes=[]
for p,log in jobs:codes.append(p.wait());log.close()
if any(codes):raise SystemExit('Replay shard failed: '+str(codes))
subprocess.run(['node','scripts/merge-evidence-102.mjs'],check=True)
