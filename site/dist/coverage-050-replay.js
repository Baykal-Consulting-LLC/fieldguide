import {coverage050Responses} from './coverage-050-responses.js';
export function applyCoverageExploration(state,id){
 const s=structuredClone(state),record=coverage050Responses[id];if(!record)return s;
 for(const a of record.answers){
  const key=a.expanded?'expandedInterests':'coreWork',old=s.profileJourney?.[key]?.[a.questionId];
  // Preserve declines and supported answers. New reflections only clarify an unresolved answer.
  if(old?.response==='no'||old?.response==='yes'&&!old.reviewHold&&['high','medium'].includes(old.confidence))continue;
  if(!['yes','no','unsure','unfamiliar'].includes(a.response)||!['high','medium','low'].includes(a.confidence)||!a.evidence?.trim())throw Error('Invalid exploration response');
  s.profileJourney[key]??={};
  s.profileJourney[key][a.questionId]={response:a.response,confidence:a.confidence,source:'profile-inferred',evidence:a.evidence,...(old?.reviewHold&&(a.response!=='yes'||a.confidence==='low')?{reviewHold:old.reviewHold,...(old.reviewFollowup?{reviewFollowup:old.reviewFollowup}:{})}:{}),explorationVersion:'0.50.0',priorReflection:old?{response:old.response,confidence:old.confidence,reviewHold:old.reviewHold||null}:null};
 }
 return s;
}
export const coverageExplorationRecord=id=>coverage050Responses[id]||null;
