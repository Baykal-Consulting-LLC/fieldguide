import {initializeApp} from 'firebase/app';
import {getAuth,GoogleAuthProvider,signInWithPopup,signOut,onAuthStateChanged} from 'firebase/auth';
import {getFirestore,doc,runTransaction,collection,getDocs} from 'firebase/firestore';
import {accountConfig} from '../dist/account-config.js';
import {createGuideStore} from './firebase-guide-store.js';
const configured=Boolean(accountConfig.firebase?.projectId);
const app=configured?initializeApp(accountConfig.firebase):null;
const auth=app?getAuth(app):null,db=app?getFirestore(app):null;
const userShape=user=>user?{id:user.uid,email:user.email}:null;
export const authClient={
 async getSession(){if(!auth)return {data:{user:null}};await auth.authStateReady();return {data:{user:userShape(auth.currentUser)}};},
 async googleSignIn(){if(!auth)throw Error('Sign-in is being prepared. Your browser draft is safe.');const provider=new GoogleAuthProvider();provider.setCustomParameters({prompt:'select_account'});const result=await signInWithPopup(auth,provider);return {data:{user:userShape(result.user)}};},
 async signOut(){if(auth)await signOut(auth);return {data:{success:true}};},
 watch(listener){return auth?onAuthStateChanged(auth,user=>listener(userShape(user))):()=>{};}
};
export function createFirebaseGuideRequest(auth,db){return async function guideRequest(method,body,expectedUserId){
 if(!auth?.currentUser||!expectedUserId||auth.currentUser.uid!==expectedUserId)throw Object.assign(Error('Please sign in again.'),{status:401});
 const uid=auth.currentUser.uid,rootRef=doc(db,'studentGuides',uid);
 const guide=createGuideStore({transaction:fn=>runTransaction(db,tx=>fn({
  root:async()=>{const s=await tx.get(rootRef);return s.exists()?s.data():null;},
  chunk:async i=>{const s=await tx.get(doc(rootRef,'chunks',String(i)));return s.exists()?s.data():null;},
  setRoot:data=>tx.set(rootRef,data),setChunk:(i,data)=>tx.set(doc(rootRef,'chunks',String(i)),data),
  deleteRoot:()=>tx.delete(rootRef),deleteChunk:i=>tx.delete(doc(rootRef,'chunks',String(i)))
 }))});
 try{return await guide(method,body);}catch(error){if(error.code==='permission-denied'||error.code==='unauthenticated')throw Object.assign(Error('Please sign in again.'),{status:401});throw error;}
};}
export const guideRequest=createFirebaseGuideRequest(auth,db);

// Owner-only synthetic histories. Firestore rules enforce this boundary on the server.
export async function getPrivateReviewCases(){if(!auth||!db)return [];await auth.authStateReady();if(!auth.currentUser)throw Error('Sign in to view the six private models.');const rows=await getDocs(collection(db,'developerReviews'));return rows.docs.map(d=>{const data=d.data(),c=JSON.parse(data.payload);if(data.professionReplay)c.professionReplay=JSON.parse(data.professionReplay);if(data.professionConfirmation)c.professionConfirmation=JSON.parse(data.professionConfirmation);if(data.professionInterest)c.professionInterest=JSON.parse(data.professionInterest);if(data.expandedInterest)c.expandedInterest=JSON.parse(data.expandedInterest);if(data.confirmationOfferReview)c.confirmationOfferReview=JSON.parse(data.confirmationOfferReview);return c;});}
