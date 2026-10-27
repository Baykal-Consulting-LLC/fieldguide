import {build} from 'esbuild';
import fs from 'node:fs';
const snapshot=JSON.parse(fs.readFileSync('resources/snapshot.json'));
await build({entryPoints:['src/app.js'],bundle:true,outfile:'dist/app.js',format:'esm',target:['es2022'],minify:true,legalComments:'eof',metafile:true}).then(r=>{
 const bad=Object.keys(r.metafile.inputs).filter(p=>p.includes('research/')||p.includes('model-results')||p.includes('draft-session')||p.includes('recording'));
 if(bad.length)throw new Error('Forbidden runtime input: '+bad.join(', '));
 fs.mkdirSync('docs',{recursive:true});fs.writeFileSync('docs/build-inputs.json',JSON.stringify(Object.keys(r.metafile.inputs),null,2));
});
for(const name of ['index.html','styles.css'])fs.copyFileSync('src/'+name,'dist/'+name);
fs.writeFileSync('dist/resources.json',JSON.stringify({version:'0.1.0',sharedPin:snapshot.sharedPin,commits:snapshot.commits,officialQuestions:60,adaptiveMaximum:24,careerInventory:473,pathways:36,occupationReferenceTitles:1016,sourceSnapshot:snapshot.snapshot,privacy:'Independent browser storage. No account or original-app draft import.'},null,2));
console.log('Built Approach 3 from local pinned resources. Original apps untouched.');
