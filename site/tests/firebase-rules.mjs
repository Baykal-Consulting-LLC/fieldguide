import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {initializeTestEnvironment,assertFails,assertSucceeds} from '@firebase/rules-unit-testing';
import {doc,getDoc,setDoc,deleteDoc,runTransaction} from 'firebase/firestore';
import {createGuideStore} from '../backend/firebase-guide-store.js';
import {freshState} from '../dist/model.js';
const projectId='demo-fieldguide';
const env=await initializeTestEnvironment({projectId,firestore:{host:'127.0.0.1',port:8089,rules:await readFile('firestore.rules','utf8')}});
const owner=env.authenticatedContext('student-a').firestore(),other=env.authenticatedContext('student-b').firestore(),guest=env.unauthenticatedContext().firestore();
const root=doc(owner,'studentGuides','student-a');
function guide(db,uid){const ref=doc(db,'studentGuides',uid);return createGuideStore({transaction:fn=>runTransaction(db,tx=>fn({root:async()=>{const s=await tx.get(ref);return s.exists()?s.data():null;},chunk:async i=>{const s=await tx.get(doc(ref,'chunks',String(i)));return s.exists()?s.data():null;},setRoot:data=>tx.set(ref,data),setChunk:(i,data)=>tx.set(doc(ref,'chunks',String(i)),data),deleteRoot:()=>tx.delete(ref),deleteChunk:i=>tx.delete(doc(ref,'chunks',String(i)))}))});}
try{
 const draft=freshState();draft.evidence.reflection='Saved notes survive the migration. '+ 'x'.repeat(900000);
 const bundle={version:1,draft,guides:[{id:'history',savedAt:'2026-10-17',data:freshState()}]};
 const mine=guide(owner,'student-a');
 await assertSucceeds(mine('PUT',{revision:0,bundle}));
 assert.deepEqual((await mine('GET')).record.bundle,bundle);
 console.log('PASS owner transaction saves and reloads a multi-document guide with history');
 for(const db of [other,guest]){
  for(const path of [['studentGuides','student-a'],['studentGuides','student-a','chunks','0']]){
   await assertFails(getDoc(doc(db,...path)));
   await assertFails(setDoc(doc(db,...path),{payload:'not mine'}));
   await assertFails(deleteDoc(doc(db,...path)));
  }
 }
 console.log('PASS other students and anonymous visitors cannot read, overwrite, or delete roots or chunks');
 await assertFails(setDoc(root,{version:1,revision:1,chunkCount:1,updatedAt:'invalid revision'}));
 await assertFails(setDoc(doc(root,'chunks','0'),{index:0,revision:999,payload:'wrong revision'}));
 await assertFails(setDoc(doc(root,'chunks','0'),{index:0,revision:1,payload:'x'.repeat(600001)}));
 console.log('PASS malformed metadata, stale revisions, oversized chunks rejected');
 await assert.rejects(mine('PUT',{revision:0,bundle}),e=>e.status===409);
 const small={version:1,draft:freshState(),guides:[]};
 await assertSucceeds(mine('PUT',{revision:1,bundle:small}));
 assert.deepEqual((await mine('GET')).record.bundle,small);
 assert.equal((await getDoc(doc(root,'chunks','1'))).exists(),false);
 await assertSucceeds(mine('DELETE',{revision:2}));
 assert.deepEqual(await mine('GET'),{record:null});
 console.log('PASS stale saves rejected, shrinking removes old chunks, deletion removes the complete guide');
}finally{await env.cleanup();}
