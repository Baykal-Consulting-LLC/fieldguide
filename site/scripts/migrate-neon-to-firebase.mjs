// Private snapshots are ignored by Git and must never be placed in dist/.
// Run only for Fieldguide's explicitly approved migration.
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {firebaseAdmin} from './firebase-admin.mjs';
import {encodeGuide,decodeGuide} from '../backend/firebase-guide-store.js';
const projectId=JSON.parse(await readFile('.firebaserc','utf8')).projects.default;
if(projectId!=='fieldguide-personal-d3b71')throw Error('Wrong migration project.');
const {request,assertNoBilling,assertPersonalProject}=await firebaseAdmin(projectId);
await assertPersonalProject();
await assertNoBilling();
const rows=JSON.parse(await readFile('.cache/migration/neon-guides.json','utf8'));
const users=JSON.parse(await readFile('.cache/migration/neon-users.json','utf8'));
const base=`https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;
const identity=`https://identitytoolkit.googleapis.com/v1/projects/${projectId}`;
const hash=value=>createHash('sha256').update(JSON.stringify(value)).digest('hex');
const fields=object=>Object.fromEntries(Object.entries(object).map(([k,v])=>[k,Number.isInteger(v)?{integerValue:String(v)}:{stringValue:String(v)}]));
const values=document=>Object.fromEntries(Object.entries(document.fields||{}).map(([k,v])=>[k,'integerValue'in v?Number(v.integerValue):v.stringValue]));
async function maybeDocument(path){try{return await request(base+'/'+path);}catch(e){if(e.status===404)return null;throw e;}}
// Import identity-only accounts; no passwords, sessions, OTPs, or signing secrets are copied.
// Existing UIDs keep both saved results and browser account caches associated correctly.
const existing=await request(identity+'/accounts:batchGet?maxResults=1000');
for(const user of users){const collision=(existing.users||[]).find(x=>x.email?.toLowerCase()===user.email.toLowerCase()||x.localId===user.uid);if(collision&&(collision.localId!==user.uid||collision.email.toLowerCase()!==user.email.toLowerCase()))throw Error('Identity collision: migration stopped without overwriting an account.');}
const missing=users.filter(u=>!(existing.users||[]).some(x=>x.localId===u.uid));
if(missing.length){const imported=await request(identity+'/accounts:batchCreate',{method:'POST',body:{users:missing.map(u=>({localId:u.uid,email:u.email,emailVerified:Boolean(u.email_verified),displayName:u.name||'',createdAt:String(Math.round(Number(u.created_at)))}))}});if(imported.error?.length)throw Error('Account import failed. Neon must be retained.');}
const report={projectId,startedAt:new Date().toISOString(),accounts:users.length,guides:[],billing:await assertNoBilling()};
for(const row of rows){
 if(!users.some(u=>u.uid===row.user_id))throw Error('Saved guide has no matching identity.');
 const path='studentGuides/'+row.user_id;
 const chunks=encodeGuide(row.bundle);
 const previous=await maybeDocument(path);
 if(!previous){
  const root={version:1,revision:row.revision,chunkCount:chunks.length,updatedAt:row.updated_at};
  const writes=[{update:{name:`projects/${projectId}/databases/(default)/documents/${path}`,fields:fields(root)},currentDocument:{exists:false}},...chunks.map((payload,index)=>({update:{name:`projects/${projectId}/databases/(default)/documents/${path}/chunks/${index}`,fields:fields({index,revision:row.revision,payload})},currentDocument:{exists:false}}))];
  await request(base+':commit',{method:'POST',body:{writes}});
 }
 const actual=values(await maybeDocument(path));
 const stored=await Promise.all(Array.from({length:actual.chunkCount},async(_,i)=>values(await maybeDocument(path+'/chunks/'+i))));
 const restored=decodeGuide(actual,stored);
 assert.deepEqual(restored,row.bundle,'Every saved field must match before Neon can be removed.');
 assert.equal(actual.revision,row.revision);
 report.guides.push({bundleSHA256:hash(restored),bytes:new TextEncoder().encode(JSON.stringify(restored)).length,revision:actual.revision,verified:true});
}
const importedUsers=await request(identity+'/accounts:batchGet?maxResults=1000');
for(const user of users)assert.ok(importedUsers.users?.some(x=>x.localId===user.uid&&x.email.toLowerCase()===user.email.toLowerCase()),'Identity import must be verified.');
report.finishedAt=new Date().toISOString();report.billing=await assertNoBilling();
await writeFile('.cache/migration/firebase-verification.json',JSON.stringify(report,null,2),{mode:0o600});
console.log(JSON.stringify({accounts:report.accounts,savedGuides:report.guides.length,allFieldsVerified:true,billing:report.billing}));
