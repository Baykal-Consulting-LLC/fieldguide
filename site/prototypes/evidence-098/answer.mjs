// Research-only exact-ID bindings. No profile prose, model identity, demographics,
// education aspiration or salary enters a rule. Narrow facts never grant generic methods.
import fs from'node:fs';const contract=JSON.parse(fs.readFileSync('prototypes/evidence-098/question-contract.json'));
import{answer097}from'../evidence-097/answer.mjs';
import{decide078}from'../simulator-078/bindings-002.mjs';
import{held093}from'../evidence-093/answer.mjs';
const rules={},options={};
const put=(dest,id,any,reason)=>dest[id]={id,any,block:[],reason};
const q=(id,any,reason)=>put(rules,id,any,reason),o=(id,any,reason)=>put(options,id,any,reason);
q('photographer-interest-044-1',[['s:photo-composition']],'Explicit photographic composition is separate from film, narration and general media.');
q('photographer-interest-044-2',[['s:photo-composition','s:photo-light']],'Taking composed photographs and deliberately attending to photographic light supply this photographic context; stage lighting alone does not.');
q('sound-technician-087-2',[['s:audio-timing-edit']],'Editing awkward pauses supplies the timing alternative; a second general expression label is redundant for this exact activity.');
q('writing-interest-044-1',[['s:dialogue-writing'],['s:exhibit-writing'],['s:writing-editing']],'Explicit authored dialogue, exhibit prose or news editing supports writing exploration; creative-writing specialization remains separate.');
q('writing-interest-044-2',[['s:dialogue-writing','s:writing-revision']],'A written scene revised after player misunderstanding supplies feedback-driven clarity revision. Editing alone does not establish responding to feedback.');
q('graphic-design-interest-044-1',[['s:visual-message-design']],'Designing and revising library signage explicitly supplies visual-message design; garment fit or spatial sketching alone does not.');
q('graphic-design-interest-044-2',[['s:visual-message-design','s:user-observation']],'Revising a visual message after observing how visitors interpret it directly supplies feedback-driven message improvement.');
q('architecture-interest-044-1',[['s:spatial-design']],'Deliberately drawing building spaces supports learning architectural drawings. Building safety, rules and environmental responsibilities stay independently required by the second question.');
q('degree-19309300-047-domain',[['t:history'],['s:historical-sources']],'Actual historical source investigation supplies historical subject interest; general story enjoyment does not.');
q('degree-19309300-047-method',[['s:historical-sources','s:source-comparison']],'Historical fact checking and comparing conflicting resident accounts support this method.');
q('degree-19309300-047-responsibility',[['t:history','m:precision','m:explaining']],'Keep careful explanation of interpretations and evidence limits separately required.');
q('degree-19101300-047-domain',[['s:plant-comparison'],['t:plants','m:investigation']],'Explicit comparative growing interest supports the plant-growth subject; general cooking, nature walks or liking flowers do not.');
q('degree-19101300-047-method',[['s:plant-comparison']],'Comparing growing conditions and responses directly supplies the observational alternative. Scientific recommendations and reporting remain separate.');
for(const id of ['creative-make-3'])o(id,[['s:photo-composition'],['s:dialogue-writing'],['s:exhibit-writing'],['s:writing-editing']],'A story through words or photographs permits these explicit forms; no film or animation interest is transferred.');
o('creative-refine-3-4',[['s:photo-composition','s:photo-light']],'Photographic composition and light supply the image alternative, without assuming film editing.');
o('creative-refine-3-3',[['s:historical-sources'],['s:source-checking'],['s:writing-editing']],'Checking words or a claim is supported by the stated checking activity.');
for(const id of ['building-design-3','building-refine-3-3'])o(id,[['s:spatial-design'],['t:spaces','m:design']],'Explicit spatial design supports buildings and spatial details; safety remains unknown.');
o('creative-make-1',[['s:visual-message-design']],'Revising library signage is specifically visual-message work.');
o('science-refine-3-4',[['s:plant-comparison']],'Comparing growing conditions supplies plant observations.');
function refs(p,a){if(!p?.evidence098)return a;return{...a,evidenceRefs:(a.evidenceRefs||[]).flatMap(ref=>p.evidence098.filter(f=>f.feature===ref.feature&&f.value==='yes'&&f.simulatorEligible!==false).map(f=>({feature:f.feature,path:f.sourcePath,quote:f.quote,sourceText:f.sourceText}))) };}
function resolved(p,rule){const a=refs(p,decide078(p,rule));return{...a,source:'profile-inferred',bindingMissing:false,bindingSource:'reviewed-exact-098',unknownReason:a.response==='unfamiliar'?'unmeasured-preference':null};}
export function answer098(p,q,careerId){const prior=answer097(p,q,careerId);if(!p||held093(p,q,careerId))return prior;if(careerId==='graphic-design'&&q.kind==='specific'&&p.specialtyPreferences060?.['garment-design']==='yes'&&p.specialtyPreferences060?.['visual-message-design']!=='yes')return{response:'unfamiliar',source:'profile-inferred',confidence:'low',bindingMissing:false,unknownReason:'unmeasured-preference',evidenceRefs:[],missing:[['s:visual-message-design']],evidence:'Functional clothing design does not establish poster, publication or digital-message design.'};if(q.kind==='specific'||!q.options){const rule=rules[q.id];if(!rule||contract.questions[q.id]?.careerId!==careerId||contract.questions[q.id]?.prompt!==q.prompt||prior.response!=='unfamiliar')return prior;const next=resolved(p,rule);return next.response==='yes'||prior.bindingMissing?next:prior;}
const audits=q.options.map((o,i)=>{const before=prior.optionAudits?.find(a=>a.optionId===o.id);if(!options[o.id]||contract.options[o.id]?.text!==o.text||before?.response==='yes'||before?.response==='no')return before||{optionId:o.id,response:'unfamiliar',bindingMissing:true};const after=resolved(p,options[o.id]);return after.response==='yes'?{...after,optionId:o.id}:before||{...after,optionId:o.id};});const yes=audits.filter(a=>a.response==='yes');if(!yes.length)return prior;return{...prior,response:'yes',selected:yes.map(a=>a.optionId),feedback:null,source:'profile-inferred',confidence:'medium',evidenceRefs:yes.flatMap(a=>a.evidenceRefs||[]),evidence:yes.flatMap(a=>a.evidenceRefs||[]).map(x=>x.quote||x.feature).join(' · '),optionAudits:audits,bindingMissing:false,unknownReason:null};}
export const reviewedRules098={questions:rules,options};
