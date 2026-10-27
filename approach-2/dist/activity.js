export const ACTIVITY_ID_KEY='fieldguide:approach-2:activity-identity:v1';
export async function acquireActivityIdentity({storage,locks,randomUUID=()=>crypto.randomUUID(),timeoutMs=1500}){
 const read=()=>{const value=storage.getItem(ACTIVITY_ID_KEY);if(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(value||''))return value;const id=randomUUID();storage.setItem(ACTIVITY_ID_KEY,id);return id;};
 let timer;try{if(!locks?.request)return randomUUID();const abort=new AbortController();timer=setTimeout(()=>abort.abort(),timeoutMs);return await locks.request(ACTIVITY_ID_KEY+':write',{signal:abort.signal},()=>{if(abort.signal.aborted)throw Error('Recording identity timed out');return read();});}catch{return randomUUID();}finally{clearTimeout(timer);}
}
export const ACTIVITY_KEY='fieldguide:approach-2:activity-outbox:v1';
export const RECORDING_RELEASE='0.17.0';
export const suggestionContext=(mode,paths)=>mode+'|'+paths.join(',');
export async function recordingJourney(activityId,source){
 if(source==='actual')return activityId;
 const hex=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(activityId+'|'+source)))).slice(0,16).map(x=>x.toString(16).padStart(2,'0')).join('');
 return [hex.slice(0,8),hex.slice(8,12),hex.slice(12,16),hex.slice(16,20),hex.slice(20)].join('-');
}
export function createActivityRecorder({storage,locks,request=(body)=>fetch('/api/activity',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}),onStatus=()=>{},randomUUID=()=>crypto.randomUUID(),now=Date.now}){
 let memory=[],draining=false,sessionOnly=false,status='ready',lastError='',lastContext=null;
 const seenLists=new Set(),baselines=new Set();
 const publish=(state,error='')=>{status=state;lastError=error;onStatus({status,error,sessionOnly});};
 const read=()=>{if(sessionOnly)return memory.slice();const raw=storage.getItem(ACTIVITY_KEY);if(raw===null)return[];const d=JSON.parse(raw);if(d?.version!==1||!Array.isArray(d.entries)||d.entries.length>500)throw Error('Unrecognized recording queue');return d.entries;};
 const write=entries=>{if(sessionOnly){memory=entries;return;}storage.setItem(ACTIVITY_KEY,JSON.stringify({version:1,entries}));};
 async function queueChange(fn){
  const work=()=>{let rows;try{rows=read();}catch{publish('blocked','The saved recording queue could not be read. It has been preserved.');throw Error(lastError);}
   const next=fn(rows);if(next.length>500){publish('blocked','Choice recording is full. Retry recording before continuing.');throw Error(lastError);}
   try{write(next);}catch{sessionOnly=true;memory=next;publish('pending','Recording is held in this tab until it can be sent.');}return next;
  };
  if(locks?.request)return locks.request(ACTIVITY_KEY+':write',work);
  sessionOnly=true;return work();
 }
 async function flush(){
  if(draining)return;draining=true;
  try{for(;;){const rows=await queueChange(r=>r);if(!rows.length){publish('recorded');break;}
   const first=rows[0],batch=rows.filter(r=>r.journeyId===first.journeyId&&r.source===first.source&&r.release===first.release).slice(0,8);publish('sending');
   let response;try{response=await request({schemaVersion:1,journeyId:first.journeyId,source:first.source,release:first.release,events:batch.map(r=>r.event)});}catch{publish('pending','Offline or unavailable. Choices remain queued; retry when connected.');break;}
   if(!response.ok){publish('pending',response.status===401?'Sign in to this Approach 2 Site, then retry recording.':'Choices remain queued. Retry recording when the service is available.');break;}
   let receipt;try{receipt=await response.json();}catch{publish('pending','Recording was not confirmed. The queue is retained for retry.');break;}
   if(!Array.isArray(receipt.accepted)||batch.some(r=>!receipt.accepted.includes(r.event.id))){publish('pending','Recording was not confirmed. The queue is retained for retry.');break;}
   const acknowledged=new Set(batch.map(r=>r.event.id));await queueChange(r=>r.filter(x=>!acknowledged.has(x.event.id)));
  }}catch{if(status!=='blocked')publish('pending','Recording is waiting. Retry to send pending choices.');}
  finally{draining=false;}
 }
 async function record(journeyId,source,kind,details={}){
  const entry={journeyId,source,release:RECORDING_RELEASE,event:{id:randomUUID(),kind,at:now(),...details}};
  await queueChange(rows=>[...rows,entry]);publish('pending');void flush();return entry.event.id;
 }
 return{
  get status(){return status;},get error(){return lastError;},get context(){return lastContext;},
  async baseline(journeyId,source,draft){const key=journeyId+'|'+source;if(baselines.has(key))return;await record(journeyId,source,'plan_baseline',{revision:draft.choiceRevision,baseline:{shortlist:draft.saved.map(pathId=>({pathId,code:''})),programs:draft.choices.programs,careers:draft.choices.careers}});baselines.add(key);},
  async suggestions(journeyId,source,mode,paths){const context=suggestionContext(mode,paths),key=journeyId+'|'+context;lastContext={journeyId,key:context};if(seenLists.has(key))return;await record(journeyId,source,'suggestions_shown',{suggestions:{mode,paths}});seenLists.add(key);},
  clearContext(){lastContext=null;},
  action:(journeyId,source,kind,details)=>record(journeyId,source,kind,{contextKey:lastContext?.journeyId===journeyId?lastContext.key:null,...details}),
  retry:flush,
  async pending(){return queueChange(r=>r);}
 };
}
