import{followupAnswers063,followupReviewHolds063}from'./followup-063-data.js';
import{saveExplorerAnswer}from'./explorer-053-state.js';
import{professionQuestions}from'./profession-questions.js';
// Immutable supplemental simulation round. Real students keep their own answers.
export function applyFollowupRound063(state,modelId){
 const s=structuredClone(state);s.explorer053??={version:1,facetAnswers:{},fieldAnswers:{},professionAnswers:{},history:[]};
 for(const a of followupAnswers063.filter(a=>a.modelId===modelId)){
  const field=Object.keys(professionQuestions).find(field=>professionQuestions[field].some(q=>q.id===a.questionId));
  if(!field)throw Error('Unknown follow-up activity '+a.questionId);
  if(s.explorer053.fieldAnswers?.[field]?.[a.questionId]||s.profileJourney?.depth?.[field]?.[a.questionId])continue;
  const payload={selected:[...a.selected],source:'profile-inferred',confidence:a.confidence,evidence:a.evidence,simulationRound:'0.63',rationale:a.rationale,...(a.feedback?{feedback:a.feedback}:{})};
  saveExplorerAnswer(s,{kind:'field',scope:field,questionId:a.questionId,payload,at:'2026-10-21T00:00:00.000Z'});
 }
 for(const h of followupReviewHolds063.filter(h=>h.modelId===modelId)){
  const old=s.explorer053.professionAnswers?.[h.careerId]?.[h.questionId]||s.profileJourney?.expandedInterests?.[h.questionId]||s.profileJourney?.coreWork?.[h.questionId];
  if(!old||old.source!=='profile-inferred'||old.response!=='yes'||old.reviewHold)continue;
  saveExplorerAnswer(s,{kind:'profession',scope:h.careerId,questionId:h.questionId,payload:{...old,reviewHold:h.reason,reviewFollowup:h.followup,simulationReview:'0.63'},at:'2026-10-21T00:00:00.000Z'});
 }
 return s;
}
