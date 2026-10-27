import{answer100}from'../evidence-100/answer.mjs';import{decide078}from'../simulator-078/bindings-002.mjs';
const prompts={
'architecture-interest-044-1':'Would you like to learn to develop drawings and models that show how a building could be designed for the people who will use it as a regular part of your work?',
'architecture-interest-044-2':"Would you like to learn to design buildings that meet users' needs while taking safety, environmental conditions, and building rules into account as a regular part of your work?"};
// Exact research-only simulator correction. Existing building-layout evidence can
// answer the first question. Generic spaces/design/shop safety cannot supply
// either building-design preference or building-code responsibility preference.
// No profile is assigned the new responsibility feature: absent stays unknown.
export function answer103(p,q,id){const old=answer100(p,q,id);if(id!=='architecture'||!prompts[q.id]||q.prompt!==prompts[q.id]||old.reviewHold||old.response==='no')return old;
 const rule={id:q.id,any:q.id.endsWith('-1')?[['s:spatial-design']]:[['s:spatial-design','s:building-regulations-design']],block:[],reason:'Building drawings and building-specific responsibilities need explicit scoped preferences; furniture layout and workshop safety alone are insufficient.'},next=decide078(p||{},rule),refs=next.evidenceRefs.flatMap(e=>p?.evidence098?p.evidence098.filter(f=>f.feature===e.feature&&f.value==='yes'&&f.simulatorEligible!==false).map(f=>({feature:f.feature,path:f.sourcePath,quote:f.quote,sourceText:f.sourceText})):[e]);return{...next,evidenceRefs:refs,bindingMissing:false,bindingSource:'research-building-specific-103',unknownReason:next.response==='unfamiliar'?'unmeasured-preference':null,reviewHold:old.reviewHold||null};}
