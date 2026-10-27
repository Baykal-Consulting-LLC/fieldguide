import subprocess,os,sys
jobs=[]
for i in range(4):
 log=open('/tmp/fresh101-shard-'+str(i)+'.log','w');env=dict(os.environ,SHARDS101='4',SHARD101=str(i));jobs.append((subprocess.Popen(['node','scripts/rerun-evidence-101.mjs'],env=env,stdout=log,stderr=subprocess.STDOUT),log))
codes=[]
for p,log in jobs:codes.append(p.wait());log.close()
if any(codes):raise SystemExit('Replay shard failed: '+str(codes))
subprocess.run(['node','scripts/merge-evidence-101.mjs'],check=True)
