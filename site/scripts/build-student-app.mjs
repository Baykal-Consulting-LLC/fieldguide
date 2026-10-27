import {execFileSync} from 'node:child_process';
await import('./build-expanded-occupations.mjs');
await import('./build-noncollege-087.mjs');
await import('./prepare-evidence-088.mjs');
await import('./prepare-live-explorer-087.mjs');
await import('./build-complete-salaries-084.mjs');
await import('./build-results-board.mjs');
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import {gzipSync} from 'node:zlib';
const {version}=JSON.parse(fs.readFileSync('package.json'));
const assetHash=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex').slice(0,12);
const out='dist/assets';fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});
const versionless={name:'one-module-identity',setup(b){b.onResolve({filter:/^\.\/.*\?v=/},args=>({path:path.resolve(args.resolveDir,args.path.split('?')[0])}));}};
const result=await build({entryPoints:{student:'dist/app.js'},outdir:out,bundle:true,minify:true,format:'esm',splitting:true,platform:'browser',target:'es2022',plugins:[versionless],metafile:true,chunkNames:'chunks/[name]-[hash]',entryNames:'[name]',legalComments:'eof'});
const styles=['styles','results','finance','catalog','lifestyle','readability','occupation','exploration','journey','guide','tone','color','profile-journey','account','upgrade','glyphs','opportunities','results-plan','degree-inventory'];
await build({stdin:{contents:styles.map(n=>'@import "./'+n+'.css";').join('\n'),resolveDir:path.resolve('dist'),loader:'css'},outfile:out+'/student.css',bundle:true,minify:true,loader:{'.woff2':'file'},assetNames:'fonts/[name]-[hash]',legalComments:'eof'});
const file='dist/index.html';let html=fs.readFileSync(file,'utf8');html=html.replace(/\s*<link rel="stylesheet"[^>]+>/g,'').replace(/<script type="module" src="[^"]+"><\/script>/,`<link rel="stylesheet" href="./assets/student.css?v=${assetHash(out+'/student.css')}">\n  <script type="module" src="./assets/student.js?v=${assetHash(out+'/student.js')}"></script>`);fs.writeFileSync(file,html);
const initial=new Set();function visit(file){if(initial.has(file))return;initial.add(file);for(const im of result.metafile.outputs[file]?.imports||[])if(im.kind!=='dynamic-import')visit(im.path);}visit('dist/assets/student.js');
const outputs=Object.keys(result.metafile.outputs).map(file=>({file,bytes:fs.statSync(file).size,gzipBytes:gzipSync(fs.readFileSync(file)).length}));
fs.writeFileSync('validation/student-build-2026-10-17.json',JSON.stringify({release:version,generatedAt:new Date().toISOString(),moduleInputs:Object.keys(result.metafile.inputs).length,outputs,initialOutputs:[...initial],initialBytes:outputs.filter(x=>initial.has(x.file)).reduce((n,x)=>n+x.bytes,0),initialGzipBytes:outputs.filter(x=>initial.has(x.file)).reduce((n,x)=>n+x.gzipBytes,0),cssBytes:fs.statSync(out+'/student.css').size,scope:'Build sizes, not observed loading or device performance.'},null,2)+'\n');console.log(JSON.stringify(outputs));

// Build the preview in an isolated process, with a fresh module graph.
execFileSync(process.execPath,['scripts/build-student-model-view.mjs'],{stdio:'inherit'});
const previewFile='dist/student-view.html';fs.writeFileSync(previewFile,fs.readFileSync(previewFile,'utf8').replace(/student\.css\?v=[^"]+/, 'student.css?v='+assetHash(out+'/student.css')).replace(/student-model-view\.js\?v=[^"]+/, 'student-model-view.js?v='+assetHash(out+'/student-model-view.js')));

// Keep the pinned chart and Developer page in the normal publication build.
await import('./build-developer.mjs');

await import('./package-research-history-071.mjs');
await import('./check-static-size.mjs');
