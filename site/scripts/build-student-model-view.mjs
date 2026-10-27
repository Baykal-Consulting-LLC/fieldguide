import fs from 'node:fs';
import assert from 'node:assert/strict';
import{build}from'esbuild';import path from'node:path';
await build({entryPoints:['dist/student-model-view-controller.js'],outfile:'dist/assets/student-model-view.js',bundle:true,minify:true,format:'esm',platform:'browser',target:'es2022',plugins:[{name:'shared-account',setup(b){b.onResolve({filter:/firebase-client\.js/},()=>({path:'../firebase-client.js?v=0.47.0',external:true}));b.onResolve({filter:/^\.\/.*\?v=/},args=>({path:path.resolve(args.resolveDir,args.path.split('?')[0])}));}}],legalComments:'eof'});

assert.ok(fs.readFileSync('dist/assets/student-model-view.js','utf8').includes('Keep your possibilities open.'),'The model preview bundle must include the discovery UI.');
