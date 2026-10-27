import fs from 'node:fs';
import{execFileSync}from'node:child_process';
await import('./build-performance-snapshot.mjs');
const root=decodeURIComponent(new URL('../analytics/performance/',import.meta.url).pathname);
const snapshot=JSON.parse(fs.readFileSync(root+'src/data.json'));snapshot.buildStatus='complete';fs.writeFileSync(root+'src/data.json',JSON.stringify(snapshot));
const node='/Users/muratbaykal/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node',builder='/Users/muratbaykal/.codex/plugins/cache/openai-curated-remote/data-analytics/1.0.11/scripts/data-app.mjs';
execFileSync(node,[builder,'build','--project-dir',decodeURIComponent(root),'--separate-data'],{stdio:'inherit'});
const out='dist/developer/performance';fs.mkdirSync(out,{recursive:true});
const built=JSON.parse(fs.readFileSync(root+'dist/data-app-build.json'));
const files=['index.html','data-app-build.json',...fs.readFileSync(root+'dist/index.html','utf8').matchAll(/snapshot\.[a-f0-9]+\.json/g)].map(x=>Array.isArray(x)?x[0]:x).filter((x,i,a)=>a.indexOf(x)===i);
if(files.length!==3)throw Error('Expected one current split snapshot.');
// Only prune obsolete generated snapshot sidecars in this dashboard's own output.
for(const name of fs.readdirSync(out))if(/^snapshot\.[a-f0-9]+\.json$/.test(name)&&!files.includes(name))fs.unlinkSync(out+'/'+name);
for(const name of files)fs.copyFileSync(root+'dist/'+name,out+'/'+name);
// The shared hosted reader uses these read-only endpoints on chatgpt.site.
// This Site is static: serve the same verified public snapshot without enabling writes.
fs.mkdirSync('dist/api',{recursive:true});
fs.copyFileSync(root+'dist/'+built.snapshot.path,'dist/api/snapshot');
fs.writeFileSync('dist/api/presentation',JSON.stringify({presentation:{},revision:0,canEdit:false}));
console.log('Visual performance page rebuilt from the current frozen cohort.');
