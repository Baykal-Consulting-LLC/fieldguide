import{readFile}from'node:fs/promises';import{initializeTestEnvironment,assertFails,assertSucceeds}from'@firebase/rules-unit-testing';import{doc,getDoc,setDoc,getDocs,collection}from'firebase/firestore';
const env=await initializeTestEnvironment({projectId:'demo-fieldguide',firestore:{host:'127.0.0.1',port:8089,rules:await readFile('firestore.rules','utf8')}});
try{await env.withSecurityRulesDisabled(async c=>setDoc(doc(c.firestore(),'developerReviews','case-a'),{payload:'private synthetic history'}));
 const owner=env.authenticatedContext('review-owner',{email:'murumoto@gmail.com',email_verified:true}).firestore();await assertSucceeds(getDoc(doc(owner,'developerReviews','case-a')));await assertSucceeds(getDocs(collection(owner,'developerReviews')));
 for(const db of[env.unauthenticatedContext().firestore(),env.authenticatedContext('other',{email:'someone@example.com',email_verified:true}).firestore(),env.authenticatedContext('unverified',{email:'murumoto@gmail.com',email_verified:false}).firestore()]){await assertFails(getDoc(doc(db,'developerReviews','case-a')));await assertFails(getDocs(collection(db,'developerReviews')));}
 await assertFails(setDoc(doc(owner,'developerReviews','case-a'),{payload:'changed'}));console.log('PASS verified owner read/list; guest, different account and unverified email denied; browser writes denied.');
}finally{await env.cleanup();}
