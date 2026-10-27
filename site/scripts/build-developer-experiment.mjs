import {build}from'esbuild';import path from'node:path';
await build({entryPoints:['dist/developer-experiment-controller.js'],outfile:'dist/developer/experiment-035.js',bundle:true,minify:true,format:'esm',platform:'browser',target:'es2022',plugins:[{name:'one-module-identity',setup(b){b.onResolve({filter:/^\.\/.*\?v=/},args=>({path:path.resolve(args.resolveDir,args.path.split('?')[0])}));}}],legalComments:'eof'});
console.log('Developer experiments bundled separately from student app.');
