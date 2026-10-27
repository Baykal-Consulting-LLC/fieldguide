import subprocess,os,sys
jobs=[]
for i in range(4):
 log=open('/tmp/fresh104-shard-'+str(i)+'.log','w');env=dict(os.environ,SHARDS104='4',SHARD104=str(i));jobs.append((subprocess.Popen(['node','scripts/rerun-evidence-104.mjs'],env=env,stdout=log,stderr=subprocess.STDOUT),log))
codes=[]
for p,log in jobs:codes.append(p.wait());log.close()
if any(codes):raise SystemExit('Replay shard failed: '+str(codes))
subprocess.run(['node','scripts/merge-evidence-104.mjs'],check=True)
