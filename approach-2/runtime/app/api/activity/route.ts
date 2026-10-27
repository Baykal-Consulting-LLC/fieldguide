import {env} from 'cloudflare:workers';
import {catalog} from '../../../lib/catalog';
import {ActivityError,writeBatch} from '../../../lib/activity-service.js';
export const dynamic='force-dynamic';
export async function POST(request:Request){
 const user=request.headers.get('oai-authenticated-user-id');
 if(!user)return Response.json({error:'Sign in to record choices.'},{status:401,headers:{'Cache-Control':'private, no-store'}});
 if(request.headers.get('origin')!==new URL(request.url).origin||request.headers.get('sec-fetch-site')==='cross-site')return Response.json({error:'Same-origin request required.'},{status:403});
 if(!request.headers.get('content-type')?.startsWith('application/json'))return Response.json({error:'JSON required.'},{status:415});
 try{
  const raw=await request.text();if(raw.length>100000)return Response.json({error:'Recording batch too large.'},{status:413});
  const actor=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(user)))).map(b=>b.toString(16).padStart(2,'0')).join('');
  return Response.json(await writeBatch(env.DB,actor,JSON.parse(raw),catalog),{headers:{'Cache-Control':'private, no-store'}});
 }catch(error){return Response.json({error:error instanceof ActivityError?error.message:'Choices could not be recorded. Try again.'},{status:error instanceof ActivityError?error.status:503,headers:{'Cache-Control':'private, no-store'}});}
}
