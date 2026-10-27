const uuid=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const actions={shortlist_add:['shortlist',1],shortlist_remove:['shortlist',0],program_save:['program',1],program_remove:['program',0],career_save:['career',1],career_remove:['career',0]};
export class ActivityError extends Error{constructor(message,status=400){super(message);this.status=status;}}
const fail=m=>{throw new ActivityError(m);};
const exact=(o,keys)=>{if(!o||typeof o!=='object'||Array.isArray(o)||Object.keys(o).some(k=>!keys.includes(k)))fail('Unsupported recording fields');};
export const contextKey=(mode,paths)=>mode+'|'+paths.join(',');
export function validateBatch(body,catalog){
 exact(body,['schemaVersion','journeyId','source','release','events']);
 if(body.schemaVersion!==1||!uuid.test(body.journeyId)||!['actual','sample','qa'].includes(body.source)||!/^0\.\d+\.\d+$/.test(body.release)||!Array.isArray(body.events)||!body.events.length||body.events.length>8)fail('Unsupported recording batch');
 const by=new Map(catalog.pathways.map(p=>[p.id,p]));
 const entity=(kind,pathId,code)=>{const p=by.get(pathId);if(!p)fail('Unknown pathway');if(kind==='program'&&!p.programs.some(p=>p.cip===code))fail('Unknown program connection');if(kind==='career'&&!p.occupations.includes(code))fail('Unknown career connection');};
 const seen=new Map();
 const events=body.events.map(input=>{
  exact(input,['id','kind','at','pathId','code','revision','contextKey','suggestions','baseline']);
  if(!uuid.test(input.id)||!Number.isSafeInteger(input.at)||input.at<0)fail('Invalid event identifier or time');
  const e={id:input.id,kind:input.kind,at:input.at};
  if(input.kind==='suggestions_shown'){
   exact(input.suggestions,['mode','paths']);const {mode,paths}=input.suggestions;
   if(!['interests','subjects','none'].includes(mode)||!Array.isArray(paths)||paths.length>4||new Set(paths).size!==paths.length||paths.some(p=>!by.has(p)))fail('Invalid suggestions');
   e.suggestions={mode,paths};
  }else if(input.kind==='plan_baseline'){
   exact(input.baseline,['shortlist','programs','careers']);e.baseline={};
   for(const [key,kind,max]of [['shortlist','shortlist',3],['programs','program',24],['careers','career',24]]){
    const values=input.baseline[key];if(!Array.isArray(values)||values.length>max)fail('Invalid baseline');
    e.baseline[key]=values.map(v=>{exact(v,['pathId','code']);entity(kind,v.pathId,v.code);return{pathId:v.pathId,code:kind==='shortlist'?'':v.code};});
    if(new Set(e.baseline[key].map(v=>v.pathId+'|'+v.code)).size!==values.length)fail('Duplicate baseline choice');
   }
   e.revision=input.revision;
  }else if(actions[input.kind]||['pathway_open','program_open','career_open'].includes(input.kind)){
   const kind=actions[input.kind]?.[0]||({program_open:'program',career_open:'career'}[input.kind])||'shortlist';entity(kind,input.pathId,input.code);e.pathId=input.pathId;e.code=['program','career'].includes(kind)?input.code:'';
   if(input.contextKey!==null&&input.contextKey!==undefined&&(typeof input.contextKey!=='string'||input.contextKey.length>300))fail('Invalid suggestion context');e.contextKey=input.contextKey||null;
   if(actions[input.kind])e.revision=input.revision;
  }else if(input.kind==='journey_clear'){e.revision=input.revision;}
  else fail('Unknown recording action');
  if('revision'in e&&(!Number.isSafeInteger(e.revision)||e.revision<0))fail('Invalid choice revision');
  const value=JSON.stringify(e);if(seen.has(e.id)&&seen.get(e.id)!==value)fail('Conflicting event identifiers');seen.set(e.id,value);return e;
 });
 return{journeyId:body.journeyId,source:body.source,release:body.release,events:[...new Map(events.map(e=>[e.id,e])).values()]};
}
export async function writeBatch(db,actor,body,catalog,now=Date.now()){
 const b=validateBatch(body,catalog),existing=await db.prepare('SELECT actor,source FROM activity_journeys WHERE id=?').bind(b.journeyId).first();
 if(existing&&(existing.actor!==actor||existing.source!==b.source))throw new ActivityError('Journey belongs to another recording context',409);
 const ids=b.events.map(e=>e.id),prior=await db.prepare(`SELECT id,journey_id,payload_json FROM choice_events WHERE id IN (${ids.map(()=>'?').join(',')})`).bind(...ids).all();
 for(const row of prior.results||[]){if(row.journey_id!==b.journeyId||row.payload_json!==JSON.stringify(b.events.find(e=>e.id===row.id)))throw new ActivityError('Event identifier already used',409);}
 const statements=[db.prepare('INSERT INTO activity_journeys(id,actor,source,release,created_at,last_at) VALUES(?,?,?,?,?,?) ON CONFLICT(id) DO UPDATE SET last_at=excluded.last_at WHERE activity_journeys.actor=excluded.actor AND activity_journeys.source=excluded.source').bind(b.journeyId,actor,b.source,b.release,now,now)];
 const state=(kind,pathId,code,active,revision,origin)=>db.prepare(`INSERT INTO selection_states(journey_id,kind,path_id,code,active,revision,origin) SELECT ?,?,?,?,?,?,? FROM activity_journeys WHERE id=? AND actor=? AND source=? AND cleared_revision<? ON CONFLICT(journey_id,kind,path_id,code) DO UPDATE SET active=excluded.active,revision=excluded.revision,origin=excluded.origin WHERE excluded.origin='observed' AND (excluded.revision>selection_states.revision OR (excluded.revision=selection_states.revision AND selection_states.origin='imported'))`).bind(b.journeyId,kind,pathId,code,active,revision,origin,b.journeyId,actor,b.source,revision);
 let baselineApplied=!!existing;
 for(const e of b.events){
  if(e.kind==='plan_baseline'){if(baselineApplied)continue;baselineApplied=true;}
  statements.push(db.prepare('INSERT OR IGNORE INTO choice_events(id,journey_id,kind,path_id,code,context_key,revision,observed_at,received_at,payload_json) SELECT ?,?,?,?,?,?,?,?,?,? FROM activity_journeys WHERE id=? AND actor=? AND source=?').bind(e.id,b.journeyId,e.kind,e.pathId||null,e.code??null,e.contextKey||null,e.revision??null,e.at,now,JSON.stringify(e),b.journeyId,actor,b.source));
  if(e.kind==='suggestions_shown'){
   const key=contextKey(e.suggestions.mode,e.suggestions.paths),id=b.journeyId+'|'+key;
   statements.push(db.prepare('INSERT OR IGNORE INTO suggestion_sets(id,journey_id,context_key,mode,received_at) SELECT ?,?,?,?,? FROM activity_journeys WHERE id=? AND actor=? AND source=?').bind(id,b.journeyId,key,e.suggestions.mode,now,b.journeyId,actor,b.source));
   e.suggestions.paths.forEach((p,i)=>statements.push(db.prepare('INSERT OR IGNORE INTO suggestion_items(set_id,path_id,rank) SELECT ?,?,? FROM suggestion_sets s JOIN activity_journeys j ON j.id=s.journey_id WHERE s.id=? AND j.actor=? AND j.source=?').bind(id,p,i+1,id,actor,b.source)));
  }else if(actions[e.kind]){const[kind,active]=actions[e.kind];statements.push(state(kind,e.pathId,e.code,active,e.revision,'observed'));}
  else if(e.kind==='plan_baseline'){for(const[key,kind]of [['shortlist','shortlist'],['programs','program'],['careers','career']])for(const x of e.baseline[key])statements.push(state(kind,x.pathId,x.code,1,e.revision,'imported'));}
  else if(e.kind==='journey_clear'){
   statements.push(db.prepare('UPDATE activity_journeys SET cleared_revision=MAX(cleared_revision,?) WHERE id=? AND actor=? AND source=?').bind(e.revision,b.journeyId,actor,b.source));
   statements.push(db.prepare('UPDATE selection_states SET active=0,revision=MAX(revision,?) WHERE journey_id=? AND revision<=? AND EXISTS(SELECT 1 FROM activity_journeys WHERE id=? AND actor=? AND source=?)').bind(e.revision,b.journeyId,e.revision,b.journeyId,actor,b.source));
  }
 }
 await db.batch(statements);return{accepted:ids,receivedAt:now};
}
const rows=async(db,sql,source)=>(await db.prepare(sql).bind(source).all()).results||[];
export async function readStatistics(db,catalog,source='actual',now=Date.now()){
 if(!['actual','sample','qa'].includes(source))throw new ActivityError('Unknown activity population');
 const [journeys,events,offers,states,linked]=await Promise.all([
  rows(db,'SELECT COUNT(*) journeys,MIN(created_at) first_at,MAX(last_at) last_at FROM activity_journeys WHERE source=?',source),
  rows(db,`SELECT e.kind,e.path_id,e.code,COUNT(*) events,COUNT(DISTINCT e.journey_id) journeys FROM choice_events e JOIN activity_journeys j ON j.id=e.journey_id WHERE j.source=? GROUP BY e.kind,e.path_id,e.code`,source),
  rows(db,`SELECT i.path_id,COUNT(DISTINCT s.journey_id) journeys,COUNT(DISTINCT CASE WHEN i.rank=1 THEN s.journey_id END) first_journeys FROM suggestion_items i JOIN suggestion_sets s ON s.id=i.set_id JOIN activity_journeys j ON j.id=s.journey_id WHERE j.source=? GROUP BY i.path_id`,source),
  rows(db,`SELECT s.kind,s.path_id,s.code,s.origin,COUNT(*) choices,COUNT(DISTINCT s.journey_id) journeys FROM selection_states s JOIN activity_journeys j ON j.id=s.journey_id WHERE j.source=? AND s.active=1 GROUP BY s.kind,s.path_id,s.code,s.origin`,source),
  rows(db,`SELECT e.kind,e.path_id,COUNT(DISTINCT e.journey_id) journeys FROM choice_events e JOIN activity_journeys j ON j.id=e.journey_id WHERE j.source=? AND e.kind IN ('pathway_open','shortlist_add') AND EXISTS(SELECT 1 FROM suggestion_sets s JOIN suggestion_items i ON i.set_id=s.id WHERE s.id=e.journey_id||'|'||e.context_key AND i.path_id=e.path_id AND s.received_at<=e.received_at) GROUP BY e.kind,e.path_id`,source)
 ]);
 const totalKinds=await rows(db,`SELECT e.kind,COUNT(DISTINCT e.journey_id) journeys FROM choice_events e JOIN activity_journeys j ON j.id=e.journey_id WHERE j.source=? GROUP BY e.kind`,source),kindCount=k=>totalKinds.find(r=>r.kind===k)?.journeys||0;
 const get=(kind,pathId,code)=>events.filter(e=>e.kind===kind&&e.path_id===pathId&&(code===undefined||e.code===code)).reduce((a,e)=>a+e.journeys,0),active=(kind,pathId,code,origin)=>states.filter(e=>e.kind===kind&&e.path_id===pathId&&(code===undefined||e.code===code)&&(!origin||e.origin===origin)).reduce((a,e)=>a+e.choices,0);
 const pathways=catalog.pathways.map(p=>{const offered=offers.find(o=>o.path_id===p.id)?.journeys||0,after=linked.find(e=>e.kind==='shortlist_add'&&e.path_id===p.id)?.journeys||0;return{pathId:p.id,pathway:p.title,offeredJourneys:offered,firstJourneys:offers.find(o=>o.path_id===p.id)?.first_journeys||0,exploredJourneys:get('pathway_open',p.id),shortlistedJourneys:get('shortlist_add',p.id),exploredAfterOffer:linked.find(e=>e.kind==='pathway_open'&&e.path_id===p.id)?.journeys||0,shortlistedAfterOffer:after,offerToShortlistRate:offered?after/offered:null,currentShortlists:active('shortlist',p.id,'','observed'),importedShortlists:active('shortlist',p.id,'','imported'),removals:events.find(e=>e.kind==='shortlist_remove'&&e.path_id===p.id)?.events||0};});
 const lower=[];
 for(const p of catalog.pathways){for(const[kind,opts]of [['program',p.programs.map(x=>({code:x.cip,title:x.title}))],['career',p.occupations.map(code=>({code,title:catalog.occupationTitles?.[code]||code}))]])for(const o of opts){const saved=get(kind+'_save',p.id,o.code),cur=active(kind,p.id,o.code,'observed'),imp=active(kind,p.id,o.code,'imported');if(saved||cur||imp||get(kind+'_open',p.id,o.code))lower.push({pathId:p.id,pathway:p.title,kind,code:o.code,option:o.title,savedJourneys:saved,exploredJourneys:get(kind+'_open',p.id,o.code),currentChoices:cur,importedChoices:imp,removals:events.find(e=>e.kind===kind+'_remove'&&e.path_id===p.id&&e.code===o.code)?.events||0});}}
 return{schemaVersion:1,generatedAt:new Date(now).toISOString(),source,totals:{journeys:journeys[0]?.journeys||0,firstAt:journeys[0]?.first_at??null,lastAt:journeys[0]?.last_at??null,withSuggestions:(await rows(db,`SELECT COUNT(DISTINCT s.journey_id) n FROM suggestion_sets s JOIN suggestion_items i ON i.set_id=s.id JOIN activity_journeys j ON j.id=s.journey_id WHERE j.source=?`,source))[0]?.n||0,pathwayExplorers:kindCount('pathway_open'),shortlisters:kindCount('shortlist_add'),majorSavers:kindCount('program_save'),careerSavers:kindCount('career_save'),events:events.reduce((n,e)=>n+e.events,0)},pathways,lowerOptions:lower};
}
