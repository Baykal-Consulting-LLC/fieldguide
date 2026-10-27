import {educationTradeoff,careerScopeNotes,careerTrial} from './career-review-logic.js';
import {orderedProfileQuestions,skillResponseOptions,professionSuggestions} from './profile-journey.js?v=0.31.0';
import {onetResponseOptions} from './onet-assessment.js?v=0.31.0';
import {priorities,preferenceOptions} from './content.js?v=0.31.0';
import {professionQuestions} from './profession-questions.js?v=0.31.0';
import {lifestyleChoices} from './lifestyle-builder.js?v=0.31.0';
import {personalPlanExport} from './guide-state.js?v=0.31.0';
import {personalPlanPage,guidePage} from './guide-ui.js?v=0.31.0';
import {journeyPlanContext} from './profile-journey-ui.js?v=0.31.0';
import {lifestyleRoom,lifestyleIncomeRange} from './lifestyle-story.js?v=0.31.0';
// The same authored state used by the scorer. No answers are inferred from the resulting career.
export function studentReviewInputs(s){
 const j=s.profileJourney;
 const profile=orderedProfileQuestions(s).map((q,index)=>{
  let options=[],values=[],answer='Not answered';
  if(q.kind==='interest'){options=onetResponseOptions.map(o=>({value:o.value,label:o.label}));values=[j.officialInterest.answers[q.id]];}
  if(q.kind==='pathway'){options=preferenceOptions.filter(o=>Number.isInteger(o.value)).map(o=>({value:o.value,label:o.label}));values=[j.fieldPreferences[q.id]];if(values[0]==='untried')answer='Not sure / earlier unfamiliar response';}
  if(q.kind==='skill'){options=skillResponseOptions.map(o=>({value:o.id,label:o.label}));const v=j.skills[q.id];values=[v?.level];if(!v?.level&&v)answer='Earlier response: experience '+v.practice+'; confidence '+v.confidence+'. Not converted into a new answer.';}
  if(q.kind==='values'){options=priorities.map(o=>({value:o.id,label:o.title}));values=s.priorities;answer=values.length?'':'Still exploring';}
  if(q.kind==='context'){options=q.options.map(([value,label])=>({value,label}));values=Array.isArray(j.answers[q.id])?j.answers[q.id]:[j.answers[q.id]];}
  options=options.map(o=>({...o,selected:values.includes(o.value)}));const selected=options.filter(o=>o.selected).map(o=>o.label);
  return {id:q.id,number:index+1,kind:q.kind,section:q.section,prompt:q.prompt,answer:selected.length?selected.join(' · '):answer,values:values.filter(v=>v!==undefined),options};
 });
 const lifestyle=lifestyleChoices.map((q,index)=>{const b=s.guide.lifestyleBuilder,options=q.id==='home'&&b.homeMode==='own'?q.ownOptions:q.options,value=b.choices[q.id];return {id:q.id,number:index+1,prompt:q.question,answer:options[value]?[options[value].title,options[value].copy].join(' — '):'Not answered',values:value===undefined?[]:[value],options:options.map((o,i)=>({value:i,label:o.title+' — '+o.copy,selected:i===value}))};});
 const followups=(professionQuestions[j.family]||[]).map((q,index)=>{const values=j.depth[j.family]?.[q.id],options=q.options.map(o=>({value:o.id,label:o.text,selected:values?.includes(o.id)||false}));return {id:q.id,number:index+1,prompt:q.prompt,kind:q.kind||'task',values:values||[],answer:values===undefined?'Not answered':values.length?options.filter(o=>o.selected).map(o=>o.label).join(' · '):'Not sure yet · no options selected',options};});
 const r=professionSuggestions(s,j.family);
 return {family:j.family,lifestyle,profile,followups,professionStatus:r.status,professionRows:r.rows.map(x=>({id:x.o.id,title:x.o.finance?.title||x.o.title,r:x.interestMatch.r,label:x.interestMatch.label,taskSupport:x.score,taskTotal:x.taskTotal,focusedSupport:x.focusedSupport,refinementSupport:x.refinementSupport,roleSpecificSupport:x.specificSupport,preparationConflict:!!x.routeConflict,educationTradeoff:educationTradeoff(s,x.o),scopeNotes:careerScopeNotes(x.o.id),needsRoleDetail:!!x.needsRoleDetail,fieldConflict:!!x.fieldContrast,basis:x.basis||null,sharedWork:x.sharedWork,comparisonOnly:x.comparisonOnly,sharedTaskAlternatives:x.sharedTaskAlternatives,featured:r.top.some(t=>t.o.id===x.o.id),taskLead:r.taskLeads.some(t=>t.o.id===x.o.id),reasons:x.reasons})),lifestyleSummaryText:plainLines(guidePage('guide/lifestyle-summary',s))};
}
export function plainLines(html){return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,'').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi,'').replace(/<(?:br|\/p|\/h[1-6]|\/li|\/div|\/section|\/article|\/summary|\/dt|\/dd|\/tr|\/label|\/a|\/button)[^>]*>/gi,'\n').replace(/<[^>]+>/g,' ').replace(/&(?:amp|lt|gt|quot|#39);/g,x=>({'&amp;':'&','&lt;':'<','&gt;':'>','&quot;':'"','&#39;':"'"}[x])).split('\n').map(s=>s.replace(/\s+/g,' ').trim()).filter(Boolean);}
export function studentReviewPlan(s){const e=personalPlanExport(s),room=lifestyleRoom(s.finance.lifestyle);return {career:e.primaryCareer,preparation:e.preparation,preparationDetails:e.preparationDetails,studyFocus:e.studyFocus,salaryStage:e.salaryStage,selectedSalary:e.selectedSalary,salaryStages:e.salary?.stages||[],paidTraining:e.salary?.paidTraining||null,aptitude:e.guidedProfile?.aptitude,steps:e.nextSteps.map(a=>a.id==='guide-'+e.primaryCareer?.id+'-try'&&careerTrial(e.primaryCareer?.id)?{...a,detail:careerTrial(e.primaryCareer.id)}:a),educationBudgets:s.finance.plans,incomeRange:lifestyleIncomeRange(s.finance.lifestyle),lifestyle:{title:room.title,copy:room.copy,result:room.result},fullText:plainLines(personalPlanPage(s)+journeyPlanContext(s))};}
