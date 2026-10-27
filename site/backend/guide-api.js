// This handler never accepts a student id from the browser.
export const MAX_BUNDLE_BYTES = 8_000_000;
export function validBundle(bundle) {
  return bundle && bundle.version === 1 && bundle.draft?.version === 1 &&
    Array.isArray(bundle.guides) && bundle.guides.length <= 100 &&
    bundle.guides.every(g => g && typeof g.id === 'string' && typeof g.savedAt === 'string' && g.data?.version === 1);
}
export function createGuideHandler({verify, repository, origins}) {
  return async function handle(request) {
    const origin = request.headers.get('origin');
    const allowed = !origin || origins.includes(origin);
    const headers = {'Cache-Control':'private, no-store', 'Vary':'Origin', 'X-Content-Type-Options':'nosniff'};
    if (origin && allowed) Object.assign(headers, {'Access-Control-Allow-Origin':origin,'Access-Control-Allow-Methods':'GET, PUT, DELETE, OPTIONS','Access-Control-Allow-Headers':'Authorization, Content-Type','Access-Control-Max-Age':'600'});
    const json = (body,status=200) => Response.json(body,{status,headers});
    if (!allowed) return json({error:'Origin not allowed'},403);
    if (request.method === 'OPTIONS') return new Response(null,{status:204,headers});
    if (new URL(request.url).pathname !== '/guide') return json({error:'Not found'},404);
    let userId;
    try {
      const bearer = request.headers.get('authorization');
      if (!bearer?.startsWith('Bearer ')) throw Error();
      userId = await verify(bearer.slice(7));
      if (!userId || typeof userId !== 'string') throw Error();
    } catch {return json({error:'Please sign in again.'},401);}
    try {
      if (request.method === 'GET') return json({record:await repository.read(userId)});
      if (!['PUT','DELETE'].includes(request.method)) return json({error:'Method not allowed'},405);
      if (!request.headers.get('content-type')?.startsWith('application/json')) return json({error:'Use JSON'},415);
      if (Number(request.headers.get('content-length')) > MAX_BUNDLE_BYTES) return json({error:'Your saved guides are too large. Export older guides first.'},413);
      const reader=request.body?.getReader(); if(!reader)return json({error:'Missing request'},400);
      const chunks=[];let size=0;
      while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>MAX_BUNDLE_BYTES){await reader.cancel();return json({error:'Your saved guides are too large. Export older guides first.'},413);}chunks.push(value);}
      const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}
      let body;try{body=JSON.parse(new TextDecoder().decode(bytes));}catch{return json({error:'Invalid JSON'},400);}
      if (!Number.isInteger(body.revision) || body.revision < 0) return json({error:'Invalid save version'},400);
      if (request.method === 'DELETE') {
        const removed=await repository.remove(userId,body.revision);
        return removed ? json({deleted:true}) : json({error:'Your saved guide changed on another device. Reload it first.'},409);
      }
      if (!validBundle(body.bundle)) return json({error:'This is not a valid Fieldguide guide.'},400);
      const record=await repository.write(userId,body.bundle,body.revision);
      if (!record) return json({error:'Your saved guide changed on another device. Choose which copy to keep.'},409);
      return json({record});
    } catch {return json({error:'We could not reach your saved guide. Your work is still on this device.'},503);}
  };
}
