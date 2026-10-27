import {expandedInterestStatus} from './expanded-interest.js';
import {coreWorkStatus} from './core-work.js';
import {careerCheckSpec,careerCheckComplete,taskEvidenceDomain} from './career-check-questions.js';
import {professionSuggestions} from './profile-journey.js';
import {directMatchCandidates} from './direct-match-candidates.js';
import {planMatchCandidates} from './plan-matches.js';

// Explain the actual evidence gates using the same questions and eligibility rows.
export function careerCheckReadiness(s,id,{includeRanking=true}={}){
 if(id.startsWith('degree-')){const c=expandedInterestStatus(s,id);return {...c,nextIndex:0,nextLabel:'Review the three interests'};}
 const spec=careerCheckSpec(id,{legacy:!!s._historicalMatchRules,coreVersion:s._coreWorkVersion});if(!spec)return null;
 const depth=s.profileJourney?.depth?.[spec.family]||{},feedback=s.profileJourney?.careerQuestionFeedback||{};
 const row=professionSuggestions(s,spec.family).rows.find(r=>r.o.id===id);
 const target=q=>q.kind==='core-work'?q.activity:q.options.find(o=>o.careerIds.includes(id))?.text||q.prompt;
 const result=(code,headline,detail,q)=>({code,headline,detail,nextIndex:q?spec.questions.indexOf(q):0,nextQuestionId:q?.id||spec.questions[0].id,nextLabel:q?'Revisit this question':'Review the work answers'});
 const unanswered=spec.questions.find(q=>q.kind==='core-work'?!s.profileJourney?.coreWork?.[q.id]:!Array.isArray(depth[q.id]));
 if(unanswered)return result('unanswered','Work still to explore','We have not asked enough about this work yet. Consider: “'+target(unanswered)+'”',unanswered);
 const core=coreWorkStatus(s,id);if(!s._historicalMatchRules&&!core.confirmed){const q=spec.questions.find(q=>q.id===core.nextQuestionId);return result(core.code,core.headline,core.detail+' Consider: “'+(q?.activity||'the defining activities')+'”',q);}
 const unfamiliar=spec.questions.find(q=>feedback[q.id]==='unfamiliar');
 const declined=spec.questions.filter(q=>feedback[q.id]==='not-interested');
 const direct=careerCheckComplete(s,id)&&directMatchCandidates(s).some(r=>r.id===id);
 if(direct){
  const top=includeRanking&&planMatchCandidates(s).top.some(r=>r.id===id);
  return result('supported',top?'Your answers support a Top match':'Your answers support this profession',top?'Several distinct work choices and your interest evidence support this match.':'This profession meets the work-evidence requirements. The leading list also compares the strength of work evidence, then your education preferences and first-paid-stage budget among close matches.');
 }
 if(row?.routeConflict){const q=spec.questions.find(q=>q.kind==='route');return result('route','Your preparation choices differ','The work you liked and the preparation route you selected point to different roles. Compare the training responsibilities before choosing.',q);}
 if(row?.roleFocusElsewhere||row?.needsRoleDetail){const q=spec.questions.find(q=>q.kind==='role-task'&&!depth[q.id]?.some(v=>q.options.find(o=>o.id===v)?.careerIds.includes(id)));return result('responsibility','Compare the professional responsibilities','Shared helping tasks are not enough to distinguish these roles. Consider: “'+(q?target(q):'the responsibilities and preparation of this profession')+'”',q);}
 if(unfamiliar)return result('unfamiliar','Unfamiliar work is still open','You said this work is unfamiliar: “'+target(unfamiliar)+'” Read about it or try a small activity before deciding whether it interests you. This does not count as disliking it.',unfamiliar);
 if(declined.length)return result('not-interested','Some of these tasks did not appeal','You chose “These activities do not interest me” for '+declined.length+' question'+(declined.length===1?'':'s')+'. That is different from unfamiliar work. You can keep exploring other roles or revisit that answer.',declined[0]);
 const taskQs=spec.questions.filter(q=>q.kind!=='route'),selected=taskQs.filter(q=>depth[q.id]?.some(v=>q.options.find(o=>o.id===v)?.careerIds.includes(id))),domains=new Set(selected.map(taskEvidenceDomain));
 const missing=taskQs.find(q=>!selected.includes(q));
 if(row?.comparisonOnly)return result('shared','The evidence overlaps with another role','The tasks selected also support another profession with more distinct work evidence. Explore a responsibility specific to this role before treating it as a separate strong match.',missing);
 if((row?.score||0)<3||domains.size<2)return result('tasks','More distinct work evidence is needed','A strong match needs interest in several different parts of the work. '+(missing?'Consider: “'+target(missing)+'”':'Review the full field to compare a wider range of tasks.'),missing);
 if(!row?.supported)return result('profile','The work answers and wider profile need another look','Some selected tasks connect with this profession, but the wider interest pattern or field preferences do not yet support a strong match. Explore the full field and try the work before deciding.',missing);
 return result('review','Review your saved work answers','These questions already have answers from earlier exploration. Review them together to confirm this profession comparison; your existing responses are shown.');
}
