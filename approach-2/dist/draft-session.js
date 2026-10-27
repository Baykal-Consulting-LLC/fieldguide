import {cleanDraft} from './engine.js?v=0.17.0';

// Current tabs share one protected key. Earlier releases retain their own key;
// copying their answers is explicit and never deletes their saved draft.
export function createDraftSession({storage,key,legacyKey=null,legacyFallbackKey=null,extraLegacyKeys=[],ids,locks,onStatus=()=>{},lockTimeoutMs=5000,now=Date.now}){
 let baseRaw,baseDraft,status='ready',blocked=false,needsAdoption=false,legacySeen=null,legacySource=legacyKey,legacySnapshot=new Map(),legacyChanged=false,seenProtected=false;
 let queued=null,working=false,drainPromise=Promise.resolve();
 const emit=value=>{status=value;onStatus(value);};
 const decode=raw=>{const value=JSON.parse(raw);if(value!==null&&(!value||value.version!==1))throw Error('Unsupported saved draft');return cleanDraft(value,ids);};
 function read(allowLegacy){
  const raw=storage.getItem(key);let draft=decode(raw),adopt=false;
  if(raw!==null)seenProtected=true;
  if(legacyKey){legacySnapshot=new Map([...new Set([legacyKey,legacyFallbackKey,...extraLegacyKeys].filter(Boolean))].map(k=>[k,storage.getItem(k)]));legacySource=[...legacySnapshot.keys()].find(k=>legacySnapshot.get(k)!==null)||legacyKey;legacySeen=legacySnapshot.get(legacySource);if(raw===null&&allowLegacy&&!seenProtected&&legacySeen!==null){draft=decode(legacySeen);adopt=true;}}
  return{raw,draft,adopt};
 }
 try{const initial=read(true);baseRaw=initial.raw;baseDraft=initial.draft;needsAdoption=initial.adopt;if(needsAdoption)status='migration';}
 catch{blocked=true;baseDraft=cleanDraft(null,ids);status='error';}
 if(!blocked&&!locks?.request)status='unsupported';
 async function commit(job){
  if(blocked){emit('error');return{status};}
  if(!locks?.request){emit('unsupported');return{status};}
  if(needsAdoption&&!job.adopt){emit('migration');return{status};}
  const abort=new AbortController(),deadline=now()+lockTimeoutMs,timer=setTimeout(()=>abort.abort(),lockTimeoutMs);
  try{return await locks.request(key+':write',{signal:abort.signal},()=>{
   // Also check elapsed time: a suspended tab's timeout callback may run late.
   if(abort.signal.aborted||now()>=deadline){emit('busy');return{status};}
   if(storage.getItem(key)!==baseRaw){emit('conflict');return{status};}
   if(needsAdoption&&[...legacySnapshot].some(([k,v])=>storage.getItem(k)!==v)){emit('conflict');return{status};}
   storage.setItem(key,job.value);baseRaw=job.value;baseDraft=decode(job.value);needsAdoption=false;seenProtected=true;
   emit('saved');return{status};
  });}
  catch(error){emit(error?.name==='AbortError'?'busy':['QuotaExceededError','NS_ERROR_DOM_QUOTA_REACHED'].includes(error?.name)?'quota':'error');return{status};}
  finally{clearTimeout(timer);}
 }
 async function drain(){
  while(queued){const job=queued;queued=null;working=true;const result=await commit(job);job.resolve(result);
   // After a failed write, do not let a queued older action save later by itself.
   if(result.status!=='saved'&&queued){queued.resolve(result);queued=null;}
  }
  working=false;
 }
 function enqueue(draft,adopt){
  const value=JSON.stringify(draft);
  if(queued){queued.value=value;queued.adopt=adopt;return queued.promise;}
  let resolve;const promise=new Promise(r=>{resolve=r;});queued={value,adopt,promise,resolve};
  if(!['conflict','error','unsupported','quota','busy','migration'].includes(status))emit('saving');
  if(!working)drainPromise=Promise.resolve().then(drain);
  return promise;
 }
 return{
  get draft(){return structuredClone(baseDraft);},get status(){return status;},get needsAdoption(){return needsAdoption;},get legacyChanged(){return legacyChanged;},
  get pendingSnapshots(){return Number(working)+Number(!!queued);},
  hasUnsaved(draft){return working||!!queued||JSON.stringify(cleanDraft(draft,ids))!==JSON.stringify(baseDraft);},
  checkForUpdates(){
   if(blocked)return status;
   try{if(storage.getItem(key)!==baseRaw){emit('conflict');return status;}
    if(legacyKey&&[...legacySnapshot].some(([k,v])=>storage.getItem(k)!==v)){if(needsAdoption)emit('conflict');else{legacyChanged=true;onStatus(status);}}
   }catch{emit('error');}
   return status;
  },
  save:draft=>enqueue(draft,false),adoptLegacy:draft=>enqueue(draft,true),
  async loadLatest(){
   await drainPromise;
   try{const latest=read(needsAdoption);baseRaw=latest.raw;baseDraft=latest.draft;needsAdoption=latest.adopt;blocked=false;legacyChanged=false;emit(!locks?.request?'unsupported':needsAdoption?'migration':'ready');return{status,draft:structuredClone(baseDraft)};}
   catch{emit('error');return{status};}
  }
 };
}
