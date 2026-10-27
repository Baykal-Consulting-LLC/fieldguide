// JSON chunks keep nested student data below Firestore's document and nesting limits.
export const MAX_GUIDE_BYTES=8_000_000;
export const CHUNK_CHARACTERS=200_000;
export const MAX_CHUNKS=40;
const failure=(message,status)=>Object.assign(Error(message),{status});
export function encodeGuide(bundle){
 if(bundle?.version!==1||bundle.draft?.version!==1||!Array.isArray(bundle.guides)||bundle.guides.length>100)throw failure('This saved guide cannot be read.',400);
 const json=JSON.stringify(bundle);
 if(new TextEncoder().encode(json).length>MAX_GUIDE_BYTES)throw failure('Your saved guides are too large. Export older guides first.',413);
 const chunks=[];
 for(let start=0;start<json.length;){let end=Math.min(start+CHUNK_CHARACTERS,json.length);if(end<json.length&&/[\uD800-\uDBFF]/.test(json[end-1]))end--;chunks.push(json.slice(start,end));start=end;}
 return chunks;
}
export function decodeGuide(root,chunks){
 if(!Number.isInteger(root?.chunkCount)||root.chunkCount<1||root.chunkCount>MAX_CHUNKS||chunks.length!==root.chunkCount)throw failure('Your saved guide could not be read. Please retry.',503);
 const parts=chunks.map((chunk,index)=>{if(chunk?.revision!==root.revision||chunk.index!==index||typeof chunk.payload!=='string')throw failure('Your saved guide changed. Please retry.',503);return chunk.payload;});
 let bundle;try{bundle=JSON.parse(parts.join(''));}catch{throw failure('Your saved guide could not be read. Please retry.',503);}
 encodeGuide(bundle);return bundle;
}
// All reads/writes occur in a Firestore transaction; retries cannot overwrite a newer revision.
export function createGuideStore({transaction,now=()=>new Date().toISOString()}){
 return async function guide(method,body){return transaction(async tx=>{
  const root=await tx.root();
  if(method==='GET'){
   if(!root)return {record:null};
   const chunks=await Promise.all(Array.from({length:root.chunkCount},(_,i)=>tx.chunk(i)));
   return {record:{revision:root.revision,updatedAt:root.updatedAt,bundle:decodeGuide(root,chunks)}};
  }
  if(!['PUT','DELETE'].includes(method))throw failure('Unsupported action.',405);
  if(!Number.isInteger(body?.revision)||body.revision<0)throw failure('Invalid save version.',400);
  if(body.revision!==(root?.revision||0))throw failure('Your saved guide changed on another device. Choose which copy to keep.',409);
  if(method==='DELETE'){for(let i=0;i<(root?.chunkCount||0);i++)tx.deleteChunk(i);tx.deleteRoot();return {deleted:true};}
  const chunks=encodeGuide(body.bundle),revision=body.revision+1,updatedAt=now();
  tx.setRoot({version:1,revision,chunkCount:chunks.length,updatedAt});
  chunks.forEach((payload,index)=>tx.setChunk(index,{index,revision,payload}));
  for(let i=chunks.length;i<(root?.chunkCount||0);i++)tx.deleteChunk(i);
  return {record:{revision,updatedAt,bundle:body.bundle}};
 });};
}
