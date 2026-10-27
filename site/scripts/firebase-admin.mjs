// Uses the owner's existing Firebase CLI authorization. Never prints or persists tokens.
import {createRequire} from 'node:module';
import {readdir,readFile} from 'node:fs/promises';
import {homedir} from 'node:os';
import {join} from 'node:path';
const require=createRequire(import.meta.url);
export async function firebaseAdmin(projectId){
 let root=process.env.FIREBASE_TOOLS_ROOT;
 if(!root){const cache=join(homedir(),'.npm','_npx');for(const folder of await readdir(cache)){const candidate=join(cache,folder,'node_modules','firebase-tools');try{await readFile(join(candidate,'package.json'));root=candidate;break;}catch{}}}
 if(!root)throw Error('Install and sign into the official Firebase CLI first.');
 const {configstore}=require(join(root,'lib/configstore.js'));
 const {getAccessToken}=require(join(root,'lib/auth.js'));
 const refresh=configstore.get('tokens')?.refresh_token;
 if(!refresh)throw Error('Sign into the Firebase CLI first.');
 const token=await getAccessToken(refresh,['https://www.googleapis.com/auth/cloud-platform','https://www.googleapis.com/auth/firebase']);
 async function request(url,{method='GET',body}={}){
  const response=await fetch(url,{method,headers:{Authorization:'Bearer '+token.access_token,...(body?{'Content-Type':'application/json'}:{})},body:body?JSON.stringify(body):undefined});
  const data=await response.json();if(!response.ok)throw Object.assign(Error(data.error?.message||'Firebase request failed'),{status:response.status});return data;
 }
 async function assertNoBilling(){const info=await request(`https://cloudbilling.googleapis.com/v1/projects/${projectId}/billingInfo`);if(info.billingEnabled||info.billingAccountName)throw Error('STOP: Fieldguide must have no linked billing account.');return {billingEnabled:false,billingAccountLinked:false};}
 async function assertPersonalProject(){const info=await request(`https://cloudresourcemanager.googleapis.com/v1/projects/${projectId}`);if(info.parent)throw Error('STOP: Fieldguide must be outside a company organization or folder.');if(info.lifecycleState!=='ACTIVE')throw Error('Fieldguide project is not active.');return {organizationLinked:false,projectId:info.projectId};}
 return {request,assertNoBilling,assertPersonalProject};
}
