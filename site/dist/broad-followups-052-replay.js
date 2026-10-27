import {broadFollowup052Responses} from './broad-followups-052-data.js';
import {beginBroadRound,broadRoundQuestion,answerBroadQuestion,broadExplorationPool,explorationQuestionAnswer} from './broad-exploration.js';

// Apply one frozen 0.51 round. Never replace an existing answer or make an
// inferred reflection look like a direct student response. Top rules are intact.
export function replayBroadFollowups052(state,id){
 const s=structuredClone(state),record=broadFollowup052Responses[id],trace=[];
 if(!record)return {state:s,trace,record:null};
 const baseline=broadExplorationPool(state),original=JSON.stringify(state);
 beginBroadRound(s);
 const authored=new Map(record.answers.map(a=>[a.questionId,a]));
 while(true){
  const next=broadRoundQuestion(s);if(!next)break;
  const a=authored.get(next.questionId);
  // Diagnostic variants reuse only a matching parent's authored questions.
  if(!a){trace.push({questionId:next.questionId,careerId:next.careerId,applied:false,reason:record.inheritedFrom?'No parent response for this diagnostic question':'No frozen authored answer'});s.profileJourney.broadRound.cursor=next.index+1;continue;}
  const row=baseline.rows.find(r=>r.id===next.careerId),q=row?.questions.find(q=>q.id===next.questionId);
  if(!q||explorationQuestionAnswer(state,row,q))throw Error('Attempt to replace frozen answer '+id+' '+next.questionId);
  if(!['yes','selected','no','unsure','unfamiliar'].includes(a.response)||!['high','medium','low'].includes(a.confidence)||!a.evidence?.trim())throw Error('Invalid frozen reflection');
  const positive=['yes','selected'].includes(a.response);
  if(positive&&(a.constructSupport!=='direct'||a.confidence==='low'))throw Error('Unsupported positive inference cannot be applied');
  const careerId=next.careerId;
  if(!answerBroadQuestion(s,{careerId,questionId:q.id,response:a.response,selected:a.selected||[]}))throw Error('Frozen response rejected '+id+' '+q.id);
  const provenance={source:'profile-inferred',confidence:a.confidence,evidence:a.evidence,biographyPaths:a.biographyPaths,constructSupport:a.constructSupport,reflectionVersion:'0.52.0'};
  if(next.expanded)s.profileJourney.expandedInterests[q.id]={...s.profileJourney.expandedInterests[q.id],...provenance};
  else if(q.kind==='core-work')s.profileJourney.coreWork[q.id]={...s.profileJourney.coreWork[q.id],...provenance};
  // Task option confidence is validated before application. The raw response
  // and option-level biography evidence remain in the separate replay record.
  trace.push({...a,careerId,applied:true});
  s.profileJourney.broadRound.cursor=next.index+1;
 }
 const used=new Set(trace.filter(a=>a.applied).map(a=>a.questionId));
 for(const a of record.answers)if(!used.has(a.questionId)&&!trace.some(t=>t.questionId===a.questionId))trace.push({...a,applied:false,reason:'Skipped by the frozen live-round scheduler after other responses; no invented replacement'});
 if(JSON.stringify(state)!==original)throw Error('Frozen baseline mutated');
 return {state:s,trace,record};
}
export const applyBroadFollowups052=(state,id)=>replayBroadFollowups052(state,id).state;
