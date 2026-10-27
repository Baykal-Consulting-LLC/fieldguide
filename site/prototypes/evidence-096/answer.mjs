// Research-only repaired dispatch. Frozen answers/profiles and the live resolver stay unchanged.
import fs from'node:fs';
import{answer093}from'../evidence-093/answer.mjs';
import{decide078}from'../simulator-078/bindings-002.mjs';
const catalog=JSON.parse(fs.readFileSync('calibration/cohort-056/question-bindings.json')).questions;
// Individually reviewed question families. All catalog predicates remain required;
// additional predicates below prevent broad activities from supplying a specialty.
export const reviewedCareers={
 'industrial-engineering':'Mechanical-process and organization activities plus numerical testing; no engineering preference is inferred from salary or education.',
 'urban-planning':'Explicit spatial layouts AND community-policy evidence, design, quantitative comparison and safety.',
 'social-research':'Community-evidence collection plus survey design for collection, and careful organized comparison for research findings.',
 'public-relations':'Audience-message planning is distinct from acting as an organization spokesperson.',
 'management-analyst':'Explicit organization investigation; implementing changes also needs design and coordination.',
 'personal-financial-advisor':'Financial records AND investment risk with listening, numerical evidence and responsibility for another person’s money.',
 'financial-analysis':'Explicit mock-company/investment analysis, quantitative investigation and financial-risk responsibility; price comparison is insufficient.',
 'general-operations-manager':'Whole-organization accountability stays separate from bounded task coordination.',
 'medical-services-manager':'Health AND organization interest with staff coordination, leadership and whole-organization accountability.',
 'office-clerk':'The reference-material activity already organizes and checks records; consistent organization and precision remain explicit.',
 'industrial-design':'Original visual composition AND mechanisms, deliberate design and physical making.',
 'web-interface-design':'Programming AND visual composition with deliberate design; user testing retains an explicit testing preference.',
 'human-resources':'Hiring requires a distinct personnel-selection preference; explaining workplace rules requires explicit rules and explanation.',
 'marketing-manager':'Actual audience-message activity, quantitative comparison, coordination and explicit leadership.',
 'cashier':'Customer assistance alone does not establish payment handling; retain actual financial-record interest.',
 'interpreting':'Written translation is not live interpreting; live delivery stays separately unknown.',
 'welder':'Mechanical making does not establish metal joining; keep the welding-specific activity unmeasured.',
 'hairdresser':'Hair OR fabric design is not specifically hair styling; salon hygiene needs its own safety responsibility.',
 'photographer':'Camera/sequence activity does not establish studio lighting; retain that unknown.',
 'clinical-psychologist':'Behavioral-support activity AND explicit clinical-treatment responsibility with listening and investigation establish the clinical context; ongoing care and serious-risk recognition require patient-care and safety responsibilities separately.',
 'mental-health-counselor':'Behavioral-support activity, listening, investigation and explicit clinical-treatment responsibility are jointly required. An ongoing counseling plan additionally requires stated patient-care follow-through; ordinary emotional support alone is insufficient.',
 'degree-27304305':'Original scenes/essays, language choices and repeated revisions directly support the creative-writing questions.',
 'degree-27101300':'Original visual artwork, deliberate design and expressive revision support visual art; no teaching role inferred.',
 'degree-27102500':'Spatial and visual design are explicit; communicating safety/accessibility plans retains separate safety and explanation.',
 'degree-25112300':'Writing AND adult learning AND learning materials; explanation, expression and explicit assessment stay separate.',
 'degree-25112400':'Language AND adult learning AND learning materials; explicit assessment, explanation and precision stay separate.',
 'degree-15125501':'Code and visual creativity alone do not establish an interest in game mechanics.'
};
// Subject teaching requires the subject, adult-learner activity and learning-material
// activity together. Existing assessment and method predicates are retained.
for(const code of ['25101100','25102100','25102200','25103100','25103200','25104100','25104200','25104300','25105100','25105200','25105300','25105400','25106400','25106500','25106600','25106700','25108100','25108200','25111200','25112100','25112200','25112500','25119300'])reviewedCareers['degree-'+code]='Subject-specific adult instruction: retain every authored subject, adult-learning, learning-material, method and assessment predicate. Explaining something alone is insufficient.';
reviewedCareers['industrial-machinery-mechanic']='Explicit mechanical construction and repeatable repair tests with hands-on making and safety; do not transfer to vehicle or HVAC specialties.';
reviewedCareers['landscaping-worker']='Actual plant-growing activity plus physical making and outdoor observation; no preference is inferred from rural background.';
const conflictBlocks={'financial-analysis-interest-044-2':['m:explaining'],'industrial-machinery-mechanic-interest-044-2':['m:precision'],'clinical-psychologist-interest-044-2':['m:precision']};
const extra={};const add=(id,...features)=>extra[id]=features;
for(const n of[1,2]){
 add('industrial-engineering-interest-044-'+n,'m:design');
 add('general-operations-manager-interest-044-'+n,'r:wholeorganization');
 add('medical-services-manager-interest-044-'+n,'r:wholeorganization');
 add('cashier-interest-044-'+n,'t:finance');
 add('interpreting-interest-044-'+n,'s:live-interpretation');
 add('welder-interest-044-'+n,'s:metal-joining');
 add('hairdresser-interest-044-'+n,'s:hair-styling',...(n===2?['r:safety']:[]));
 if(n===2){add('clinical-psychologist-interest-044-'+n,'r:patientcare','r:safety');add('mental-health-counselor-interest-044-'+n,'r:patientcare');}
}
add('social-research-interest-044-1','t:statistics');
add('social-research-interest-044-2','m:organization');
add('public-relations-interest-044-1','s:public-spokesperson');
add('management-analyst-interest-044-2','m:design','m:coordination');
add('human-resources-interest-044-1','s:personnel-selection');
add('human-resources-interest-044-2','t:law','m:explaining');
add('web-interface-design-interest-044-2','m:testing');
add('photographer-interest-044-2','s:photographic-lighting');
add('degree-27102500-047-responsibility','r:safety','m:explaining');
for(const suffix of['domain','method','responsibility'])add('degree-15125501-047-'+suffix,'s:game-mechanics');
function branches(b){let a=[[...(b.topicAll||[]).map(v=>'t:'+v),...(b.methodAll||[]).map(v=>'m:'+v),...(b.responsibilityAll||[]).map(v=>'r:'+v),...(b.specificAll||[]).map(v=>'s:'+v)]];for(const [groups,prefix]of[[b.topicAny||[],'t:'],[b.methodAny||[],'m:']])for(const group of groups)a=a.flatMap(branch=>group.map(v=>[...branch,prefix+v]));return a;}
export const repairedRules=Object.fromEntries(Object.values(catalog).filter(b=>reviewedCareers[b.careerId]).map(b=>[b.questionId,{id:b.questionId,careerId:b.careerId,prompt:b.prompt,any:branches(b).map(branch=>[...new Set([...branch,...(extra[b.questionId]||[])])]),block:conflictBlocks[b.questionId]||[],reason:reviewedCareers[b.careerId],source:b.source}]));
const value=(p,k)=>{const[type,id]=k.split(':');return type==='s'?p?.specialtyPreferences060?.[id]||'unknown':(type==='t'?p?.negativeTopics:type==='m'?p?.negativeMethods:[])?.includes(id)?'no':(type==='t'?p?.positiveTopics:type==='m'?p?.positiveMethods:p?.responsibilities)?.includes(id)?'yes':'unknown';};
export function reason096(p,a){if(a.response!=='unfamiliar')return null;if(!p)return'no-structured-profile';if(a.reviewHold)return'review-hold';if(a.conflicts?.length)return'conflicting-evidence';if(a.bindingMissing)return'missing-binding';if(a.missing?.some(branch=>branch.some(k=>value(p,k)==='no')))return'conflicting-evidence';return'unmeasured-preference';}
export function answer096(p,q,careerId){const before=answer093(p,q,careerId),rule=repairedRules[q.id];let a=before;if(p&&before.bindingMissing&&rule&&rule.careerId===careerId&&rule.prompt===q.prompt){a={...decide078(p,rule),bindingSource:'reviewed-exact-catalog-096',bindingMissing:false,conflicts:rule.block.filter(k=>value(p,k)==='no')};}return{...a,unknownReason:reason096(p,a)};}
