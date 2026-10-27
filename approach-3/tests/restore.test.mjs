import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
test('standalone restore uses the exact pinned archive and rejects drift and active leases',()=>{
 const app=fs.mkdtempSync(path.join(os.tmpdir(),'fieldguide-a3-restore-'));
 try{
  const lock=JSON.parse(fs.readFileSync('shared-foundation.lock.json'));
  for(const file of ['shared-foundation.lock.json','AGENTS.md','.openai/hosting.json','scripts/shared-foundation.py',lock.archive]){const out=path.join(app,file);fs.mkdirSync(path.dirname(out),{recursive:true});fs.copyFileSync(file,out);}
  const run=()=>spawnSync('python3',['scripts/shared-foundation.py','restore'],{cwd:app,encoding:'utf8'});
  let out=run();assert.equal(out.status,0,out.stderr);assert.ok(fs.existsSync(path.join(app,'.cache/onet31/work_context.csv')));
  out=run();assert.equal(out.status,0,out.stderr);assert.match(out.stdout,/"restoredMissingFiles": 0/);
  const file=path.join(app,'.cache/onet31/job_zones.csv');fs.writeFileSync(file,'intentional test drift');out=run();assert.notEqual(out.status,0);assert.equal(fs.readFileSync(file,'utf8'),'intentional test drift');assert.match(out.stderr,/will not overwrite/);
  fs.mkdirSync(path.join(app,'.shared-foundation-use.lock'));out=run();assert.notEqual(out.status,0);assert.match(out.stderr,/build is active/);assert.ok(fs.existsSync(path.join(app,'.shared-foundation-use.lock')));
 }finally{fs.rmSync(app,{recursive:true,force:true});}
});
