// Give each release a consistent module URL so an existing browser cannot mix old and new code.
import {readFile,writeFile,readdir} from 'node:fs/promises';
const root=new URL('../',import.meta.url),{version}=JSON.parse(await readFile(new URL('package.json',root),'utf8'));
for(const name of await readdir(new URL('dist/',root))){if(!name.endsWith('.js'))continue;const file=new URL('dist/'+name,root),text=await readFile(file,'utf8');const stamped=text.replace(/(['"])(\.\/[\w-]+\.js)(?:\?v=[\w.-]+)?\1/g,(_,quote,path)=>quote+path+'?v='+version+quote);if(stamped!==text)await writeFile(file,stamped);}
const index=new URL('dist/index.html',root),html=await readFile(index,'utf8');await writeFile(index,html.replace(/((?:href|src)="\.\/[\w-]+\.(?:css|js))(?:\?v=[\w.-]+)?"/g,(_,path)=>path+'?v='+version+'"'));
