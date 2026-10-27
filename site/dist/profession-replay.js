import {careerCheckSpec,updateCareerCheck,finishCareerCheckQuestion} from './career-check-questions.js';
// Apply additional authored work answers to a copy; never replace a frozen answer.
export function professionReplayState(c,replay=c.professionReplay){
 const state=structuredClone(c.experimentState);if(!replay)return state;
 if(replay.id!==c.id||replay.version!==1||!Array.isArray(replay.comparisons)||!Array.isArray(replay.answers))throw Error('Invalid profession comparison replay.');
 const specs=replay.comparisons.map(r=>careerCheckSpec(r.id,{legacy:true}));if(specs.some(x=>!x)||new Set(specs.map(s=>s.id)).size!==specs.length)throw Error('Invalid comparison list.');
 const questions=new Map();for(const spec of specs)for(const q of spec.questions)questions.set(q.id,{spec,q});
 const answers=new Map();for(const a of replay.answers){if(answers.has(a.questionId)||!questions.has(a.questionId))throw Error('Invalid comparison answer.');answers.set(a.questionId,a);}
 if(answers.size!==questions.size)throw Error('Incomplete comparison answer set.');
 for(const [id,{spec,q}]of questions){const a=answers.get(id),existing=state.profileJourney.depth?.[spec.family]?.[id];
  if(!Array.isArray(a.selected)||new Set(a.selected).size!==a.selected.length||a.selected.some(v=>!q.options.some(o=>o.id===v)))throw Error('Invalid work option.');
  if(Array.isArray(existing)){if(a.source!=='original-answer'||JSON.stringify(existing)!==JSON.stringify(a.selected))throw Error('A frozen work answer cannot be replaced.');continue;}
  if(a.source!=='profile-inferred'||!['high','medium','low'].includes(a.confidence)||typeof a.evidence!=='string'||!a.evidence.trim())throw Error('Missing inferred-answer provenance.');
  if(a.selected.length){if(a.feedback!==null)throw Error('Work selection conflicts with feedback.');for(const optionId of a.selected)updateCareerCheck(state,{careerId:spec.id,questionId:id,optionId});}
  else{if(!['unfamiliar','not-interested','unsure'].includes(a.feedback))throw Error('Missing uncertain response.');updateCareerCheck(state,{careerId:spec.id,questionId:id,feedback:a.feedback});}
 }
 for(const spec of specs)for(const q of spec.questions)finishCareerCheckQuestion(state,spec.id,q.id);
 return state;
}
