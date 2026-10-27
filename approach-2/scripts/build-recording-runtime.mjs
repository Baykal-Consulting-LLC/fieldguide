import {stageRuntime} from './stage-recording-runtime.mjs';
import {readFile,writeFile,mkdir,cp,rm,readdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
const root=new URL('../',import.meta.url),runtime=new URL('runtime/',root);
await stageRuntime();
const result=spawnSync(process.execPath,['scripts/run-framework.mjs','build'],{cwd:runtime,stdio:'inherit'});if(result.status!==0)process.exit(result.status||1);
for(const entry of ['server','client','.openai']){const target=new URL('dist/'+entry,root);await rm(target,{recursive:true,force:true});await cp(new URL('dist/'+entry,runtime),target,{recursive:true});}
console.log('Approach 2 recording runtime built; static source files retained.');
