import {build} from 'esbuild';
await build({entryPoints:['backend/firebase-browser-client.js'],outfile:'dist/firebase-client.js',bundle:true,minify:true,format:'esm',platform:'browser',target:'es2022',legalComments:'eof'});
