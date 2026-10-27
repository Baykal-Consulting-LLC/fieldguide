import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const file=fileURLToPath(new URL('./run.mjs',import.meta.url));
const children=Array.from({length:4},(_,i)=>spawn(process.execPath,[file],{stdio:'inherit',env:{...process.env,A3_SHARD:String(i),A3_SHARDS:'4'}}));
const results=await Promise.all(children.map(child=>new Promise(resolve=>{child.on('exit',code=>resolve(code));child.on('error',()=>resolve(1));})));
if(results.some(code=>code!==0)){process.exitCode=1;console.error('A worker failed; do not summarize incomplete results.');}
