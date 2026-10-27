import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
function files(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]);}
const rows=files('dist').map(file=>({file,bytes:fs.statSync(file).size})),total=rows.reduce((n,r)=>n+r.bytes,0)+fs.statSync('.openai/hosting.json').size;
// Leave room for archive entry metadata and hosting packaging overhead.
assert.ok(total<240*1024*1024,'Static publication exceeds the 240 MiB payload budget for the 256 MiB hosting archive limit.');
assert.ok(rows.every(r=>r.bytes<25*1024*1024),'A static file exceeds 25 MiB.');
console.log(JSON.stringify({staticBytes:total,staticMiB:Math.round(total/1048576*100)/100,largest:rows.sort((a,b)=>b.bytes-a.bytes)[0]}));
