// Local emulators only. Mock Google credentials can never authenticate with production.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {initializeApp,deleteApp} from 'firebase/app';
import {getAuth,connectAuthEmulator,GoogleAuthProvider,signInWithCredential,signOut} from 'firebase/auth';
import {getFirestore,connectFirestoreEmulator,doc,setDoc,terminate} from 'firebase/firestore';
import {initializeTestEnvironment} from '@firebase/rules-unit-testing';
import {createFirebaseGuideRequest} from '../backend/firebase-browser-client.js';
import {encodeGuide} from '../backend/firebase-guide-store.js';
import {freshState} from '../dist/model.js';
const projectId='demo-fieldguide',uid='legacy-neon-student';
const env=await initializeTestEnvironment({projectId,firestore:{host:'127.0.0.1',port:8089,rules:await readFile('firestore.rules','utf8')}});
const app=initializeApp({projectId,apiKey:'fake-api-key',authDomain:'localhost'},'google-migration-test');
const auth=getAuth(app);connectAuthEmulator(auth,'http://127.0.0.1:9099',{disableWarnings:true});
const db=getFirestore(app);connectFirestoreEmulator(db,'127.0.0.1',8089);
const draft=freshState();draft.evidence.reflection='My earlier medicine and graphic-design interests and notes.';
draft.profile.nickname='Earlier student';
const bundle={version:1,draft,guides:[{id:'previous',savedAt:'2026-10-17',data:freshState()}]};
try{
 const response=await fetch(`http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/projects/${projectId}/accounts:batchCreate`,{method:'POST',headers:{Authorization:'Bearer owner','Content-Type':'application/json'},body:JSON.stringify({users:[{localId:uid,email:'migration@example.com',emailVerified:false}]})});
 assert.equal(response.status,200);assert.equal((await response.json()).error?.length||0,0);
 await env.withSecurityRulesDisabled(async ctx=>{const chunks=encodeGuide(bundle),ref=doc(ctx.firestore(),'studentGuides',uid);await setDoc(ref,{version:1,revision:7,chunkCount:chunks.length,updatedAt:'2026-10-17'});await Promise.all(chunks.map((payload,index)=>setDoc(doc(ref,'chunks',String(index)),{payload,index,revision:7})));});
 const result=await signInWithCredential(auth,GoogleAuthProvider.credential(JSON.stringify({sub:'mock-google-subject',email:'migration@example.com',email_verified:true})));
 assert.equal(result.user.uid,uid,'Google login must reuse the imported identity.');
 const request=createFirebaseGuideRequest(auth,db);
 assert.deepEqual((await request('GET',undefined,uid)).record.bundle,bundle);
 const changed=structuredClone(bundle);changed.draft.evidence.reflection+=' New activity completed.';
 assert.equal((await request('PUT',{revision:7,bundle:changed},uid)).record.revision,8);
 assert.deepEqual((await request('GET',undefined,uid)).record.bundle,changed);
 await signOut(auth);
 await assert.rejects(request('GET',undefined,uid),e=>e.status===401);
 await signInWithCredential(auth,GoogleAuthProvider.credential(JSON.stringify({sub:'other-google-subject',email:'other@example.com',email_verified:true})));
 await assert.rejects(request('PUT',{revision:8,bundle:changed},uid),e=>e.status===401);
 assert.deepEqual(await request('GET',undefined,auth.currentUser.uid),{record:null});
 console.log('PASS imported identity → Google sign-in → original notes/history → save/reload → sign-out → different account isolation');
}finally{await terminate(db);await deleteApp(app);await env.cleanup();}
