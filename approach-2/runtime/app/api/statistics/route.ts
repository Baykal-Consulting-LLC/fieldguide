import {env} from 'cloudflare:workers';
import {catalog} from '../../../lib/catalog';
import {ActivityError,readStatistics} from '../../../lib/activity-service.js';
export const dynamic='force-dynamic';
// This aggregate-only endpoint retains the Site's existing owner-private access boundary.
// It returns no journey identifiers, accounts, answers, budgets, notes or raw events.
export async function GET(request:Request){
 try{return Response.json(await readStatistics(env.DB,catalog,new URL(request.url).searchParams.get('source')||'actual'),{headers:{'Cache-Control':'private, no-store'}});}
 catch(error){return Response.json({error:'Statistics unavailable.'},{status:error instanceof ActivityError?error.status:503,headers:{'Cache-Control':'private, no-store'}});}
}
