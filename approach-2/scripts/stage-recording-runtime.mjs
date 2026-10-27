import {mkdir,cp,rm,readdir} from 'node:fs/promises';
export async function stageRuntime(){
 const root=new URL('../',import.meta.url),runtime=new URL('runtime/',root),pub=new URL('public/',runtime);
 await rm(pub,{recursive:true,force:true});await mkdir(pub,{recursive:true});
 for(const entry of await readdir(new URL('dist/',root))){if(['server','client','.openai'].includes(entry))continue;await cp(new URL('dist/'+entry,root),new URL(entry,pub),{recursive:true});}
 await mkdir(new URL('.openai/',runtime),{recursive:true});await cp(new URL('.openai/hosting.json',root),new URL('.openai/hosting.json',runtime));
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href)await stageRuntime();
