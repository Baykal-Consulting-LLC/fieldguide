// Research-only, manually reviewed question-ID rules. No title or prose classifier.
// Concrete contextual facts are distinct from broad topic ratings.
export const contextualTopics={mechanics:'mechanism-test',electronics:'circuit-test',computing:'code-test',chemistry:'materials-controls',plants:'growth-comparison',weather:'weather-observations',earth:'maps-water',statistics:'survey-design',finance:'financial-reconciliation',purchasing:'supplier-comparison',logistics:'delay-records',information:'checked-records',writing:'writing-revision',visual:'visual-composition',media:'shots-edit',spaces:'layout-comparison',learning:'learning-guide',history:'historical-records'};
export const activityContexts={
 'technology-approach-1':['code-test'],
 'technology-workday-1':['code-test'],
 'technology-refine-3-1':['code-test'],
 'technology-refine-4-1':['code-test'],
 'technology-refine-2-2':['statistical-limits'],
 'technology-refine-3-2':['statistical-limits'],
 'creative-refine-2-2':['screen-trial'],
 'creative-refine-4-2':['screen-trial']
};
export const eligible=a=>a&&!a.reviewHold&&(a.source!=='profile-inferred'||(['medium','high'].includes(a.confidence)&&a.evidence?.trim()));
export function ledgerFor(profile,state,bindings,spec){
 const ledger={yes:{},no:{}},add=(side,key,ref)=>{(ledger[side][key]??=[]).push(ref);};
 if(profile){for(const[k,pos,neg,list,path]of[['t',profile.positiveTopics,profile.negativeTopics,spec.topics,'positiveTopics'],['m',profile.positiveMethods,profile.negativeMethods,spec.methods,'positiveMethods'],['r',profile.responsibilities,[],spec.responsibilities,'responsibilities']]){
  for(const id of pos){const ref={source:'frozen-structured-profile',path,id,quote:list.find(x=>x.id===id)?.fact};add('yes',k+':'+id,ref);if(k==='t'&&contextualTopics[id])add('yes','f:'+contextualTopics[id],ref);if(k==='t'&&id==='statistics')add('yes','f:statistical-limits',ref);}
  for(const id of neg){const ref={source:'frozen-negative-choice',path:k==='t'?'negativeTopics':'negativeMethods',id,quote:'Explicit negative '+id+' preference'};add('no',k+':'+id,ref);if(k==='t'&&contextualTopics[id])add('no','f:'+contextualTopics[id],ref);}
 }for(const[id,value]of Object.entries(profile.specialtyPreferences060||{}))if(['yes','no'].includes(value))add(value,'s:'+id,{source:'frozen-specialty-choice',id,quote:bindings.specificFeatures060?.[id]||id});
 }else{
  for(const[id,a]of Object.entries(state.explorer053?.facetAnswers||{}))if(id.startsWith('topic056-')&&eligible(a)&&Number.isInteger(a.value)&&(a.value>=4||a.value<=2))add(a.value>=4?'yes':'no','t:'+id.slice(9),{source:'saved-topic-rating',questionId:id,quote:'Saved topic rating '+a.value+' / 5. A topic rating does not supply a concrete contextual fact.'});
  const answers=[];for(const field of new Set([...Object.keys(state.profileJourney?.depth||{}),...Object.keys(state.explorer053?.fieldAnswers||{})]))for(const[qid,raw]of Object.entries({...state.profileJourney?.depth?.[field],...state.explorer053?.fieldAnswers?.[field]}))answers.push([qid,Array.isArray(raw)?{selected:raw,source:'student',confidence:'high'}:raw]);
  for(const qs of Object.values(state.explorer053?.professionAnswers||{}))for(const[qid,a]of Object.entries(qs))if(a?.selected)answers.push([qid,a]);
  for(const[qid,a]of answers){if(!eligible(a)||a.feedback)continue;for(const optionId of a.selected||[]){const b=bindings.options[optionId];if(!b||b.questionId!==qid)continue;const ref={source:'saved-activity-option',questionId:qid,optionId,quote:b.text};for(const[k,key]of[['t','topicAll'],['m','methodAll']])for(const id of b[key]||[])add('yes',k+':'+id,ref);for(const id of activityContexts[optionId]||[])add('yes','f:'+id,ref);}}
 }
 return ledger;
}
const rules=[];
function add(careerId,suffix,all,reason,category='Context-specific method',any=[],block=[]){rules.push({careerId,questionId:careerId+(suffix.startsWith('-')?suffix:'-047-'+suffix),all,any,block,reason,category});}
const legacy=(id,n,all,reason,category,any=[],block=[])=>add(id,'-interest-044-'+n,all,reason,category,any,block);
// Keep engineering safety evidence. A concrete tested circuit/mechanism/material
// comparison can supply its own method context, without a second generic label.
for(const[id,topic,fact]of[['mechanical-engineering','mechanics','mechanism-test'],['electrical-engineering','electronics','circuit-test']]){
 legacy(id,1,['t:'+topic,'m:design','r:safety'],'The first question asks about designing; it does not also ask for a separate general testing preference. Safety remains required.');
 legacy(id,2,['f:'+fact,'m:design','r:safety'],'The frozen activity explicitly compares a mechanism/circuit and tests a change. Safety and design remain separate requirements.',undefined,[],['m:testing']);
}
for(const n of[1,2])legacy('architecture',n,['f:layout-comparison','m:design','r:safety'],'The question asks for drawings, models and user needs, not a preference for physical assembly. The layout fact is concrete; safety remains required.');
for(const[id,all,block]of[
 ['degree-17201100',['t:space','f:mechanism-test','m:design','m:quantitative'],['m:testing']],
 ['degree-17202100',['t:plants','f:mechanism-test','m:design','m:quantitative'],['m:testing']],
 ['degree-17204100',['f:materials-controls','m:design'],['m:testing']],
 ['degree-17213100',['f:materials-controls','m:design'],['m:testing']],
 ['degree-17207200',['f:circuit-test','m:design'],['m:testing']],
 ['degree-17205102',['t:infrastructure','t:ecology','f:materials-controls','m:design','m:quantitative'],['m:testing']]
])add(id,'method',all,'The named contextual fact already states a controlled comparison or test. Other subject, design, numerical and safety requirements are retained where asked.','Context-specific method',[],block);
add('degree-17205101','method',['t:infrastructure','t:logistics','m:design','m:quantitative'],'This question asks for traffic-pattern analysis and design calculations, not an additional experimental-testing preference.');
add('degree-17208100','method',['t:ecology','t:infrastructure','m:design','m:quantitative'],'Environmental measurements and comparison of design options can be supported by explicit quantitative and design interests. Engineering safety remains independently required.');
add('degree-17101200','method',['f:layout-comparison','t:plants','m:fieldwork'],'The layout fact already compares alternative spatial designs. Outdoor observation remains an explicit separate preference.');
add('degree-27102500','method',['f:layout-comparison','t:visual','m:design','r:safety'],'The method question concerns layout and access rather than personal artistic expression. Require explicit safety evidence before a new interior-design qualification.');
// Computing: debugging a specific program is not inferred from a broad technology rating.
for(const suffix of['method','responsibility'])add('degree-15125100',suffix,['f:code-test','m:precision'],'Writing a program, checking unexpected behavior and testing changes are explicitly stated. Precision remains independent; a separate generic computing/testing preference duplicates the context.','Context-specific method',[],['m:computing','m:testing']);
add('degree-15125300','method',['f:code-test','m:precision'],'A stated debugging context plus deliberate test/design interest supports systematic software checks. Accuracy and defect-reporting evidence remain separate.','Context-specific method',[['m:testing','m:design']],['m:computing','m:testing']);
add('degree-15124200','method',['f:code-test','t:information','m:investigation'],'The explicit program-test context supplies computational testing; reliable information and investigation remain required.','Context-specific method',[],['m:computing','m:testing']);
add('degree-15124200','responsibility',['f:code-test','t:information','m:organization','m:precision','r:safety'],'Permissions, backups and protected records need explicit safety/accountability, organization and accuracy; a generic research method is not the responsibility.');
add('degree-15124300','method',['f:code-test','t:information','m:design'],'Designing data structures uses explicit computational testing and design; a duplicate generic testing tag is not essential.','Context-specific method',[],['m:computing','m:testing']);
add('degree-15129902','method',['t:earth','f:code-test','m:quantitative','m:precision'],'Spatial subject interest, actual digital testing, quantitative evidence and precision are all present; a second generic computing tag adds no distinct context.','Context-specific method',[],['m:computing']);
add('degree-15209901','method',['t:biology','f:code-test','m:quantitative','m:organization'],'Biological records, computational comparisons, numerical evidence and organized steps remain required.','Context-specific method',[],['m:computing']);
add('degree-15129903','method',['t:computing','f:checked-records','m:organization'],'The information fact already states organizing reference materials and checking their accuracy. The question asks about categories and retrieval processes, not designing a scientific investigation.');
add('degree-15205101','method',['f:survey-design','t:enterprise','m:quantitative'],'The explicit survey/data fact already contains focused questions, comparison and bias checks. Organizational context and numerical interest remain required.');
// Business methods are kept separate from investment risk or legal representation.
add('degree-13104107','method',['t:law','f:checked-records','m:precision','m:organization'],'Checking technical records against rules is supported by explicit legal-source, record-accuracy and organization interests; a general investigation tag is redundant.');
add('degree-13108102','method',['f:delay-records','m:quantitative','m:organization'],'The logistics fact explicitly compares routes and checks changes after a delay; numerical and organizational interests remain separate.');
add('degree-13203100','method',['f:financial-reconciliation','m:precision','m:organization'],'Reconciling spending and distinguishing estimates from actuals directly supports this budget-comparison question. It does not establish investment interest.');
add('degree-13102300','method',['f:supplier-comparison','m:precision'],'The frozen supplier-offer fact explicitly compares hidden costs and agreed requirements. Precision remains required; a generic organization preference is not the comparison being asked.');
// Scientific communication is not automatically independent research leadership.
add('degree-15203100','method',['t:mathematics','t:enterprise','m:quantitative','m:design'],'Constructing and comparing decision models calls for numerical/design preferences, not a general office-organization preference.');
add('degree-15203100','responsibility',['t:mathematics','t:enterprise','m:quantitative','m:precision','m:explaining'],'The question asks to explain recommendations, assumptions and limits. Explicit numerical, accuracy and explanation interests can support that narrower responsibility.','Communication versus research');
for(const suffix of['domain','method','responsibility'])add('degree-15204101',suffix,['t:statistics',...(suffix==='method'?['m:quantitative','m:testing']:suffix==='responsibility'?['m:organization','m:precision','m:explaining']:[])],'The question explicitly allows health OR biological study. Preserve statistics and the independently required analytical/documentation interests; do not require both application subjects.','Conjunction versus alternatives',[['t:health','t:biology']]);
add('degree-19101300','method',['f:growth-comparison','m:precision'],'The question allows observations OR experiments. A stated growth comparison plus fieldwork or controlled-testing interest supports that alternative.','Conjunction versus alternatives',[['m:testing','m:fieldwork']]);
add('degree-19101300','responsibility',['f:growth-comparison','m:precision','m:explaining','r:safety'],'Evidence-based recommendations about growing conditions can use explicit careful explanation and accountability; general research-program leadership is not asked.','Communication versus research');
add('degree-19102100','method',['t:biology','f:materials-controls','m:testing'],'The chemistry fact explicitly records controlled school experiments; combined biological interest and testing remain necessary.','Context-specific method',[],['m:investigation']);
add('degree-19102100','responsibility',['t:biology','f:materials-controls','m:precision','m:explaining','r:safety'],'The question asks for checkable findings and limits. Require contextual controlled experiments, accuracy, explanation and accountable work.','Communication versus research');
add('degree-19102902','method',['t:biology','f:materials-controls','m:testing'],'Controlled comparisons are already present in the concrete chemistry fact. Biology and deliberate testing remain required.','Context-specific method',[],['m:investigation']);
add('degree-19102904','responsibility',['t:biology','t:ecology','m:fieldwork','m:precision','m:explaining'],'The responsibility is communicating findings and limits about living systems. Keep field evidence, accuracy and explanation; do not substitute an unstated research-leadership preference.','Communication versus research');
add('degree-19201200','responsibility',['t:space','m:testing','m:precision','m:explaining'],'Reporting assumptions and repeatable work can be evidenced by explicit test, accuracy and explanation preferences in the physical-science context.','Communication versus research');
add('degree-19202100','method',['f:weather-observations','m:quantitative'],'The weather fact already compares observations, maps and explanations. Explicit numerical interest supplies forecast/model comparison.','Context-specific method',[],['m:investigation']);
add('degree-19202100','responsibility',['f:weather-observations','m:precision','m:explaining','r:safety'],'Forecast communication and uncertainty are distinct from leading research. Require careful explanation and explicit accountability for consequential work.','Communication versus research');
add('degree-19203200','method',['f:materials-controls','m:testing'],'Controlled comparisons of materials are explicit in the topic fact; a second generic investigation tag is redundant.','Context-specific method',[],['m:investigation']);
add('degree-19203200','responsibility',['f:materials-controls','m:precision','m:explaining','r:safety'],'Communicating material findings and limits needs explicit careful explanation and accountable work, not an assumed research-leadership preference.','Communication versus research');
add('degree-19204300','method',['f:maps-water','m:quantitative'],'The question combines water measurements, maps and models; outdoor field collection is one route, not a necessary extra preference.');
add('degree-19204300','responsibility',['f:maps-water','m:quantitative','m:precision','m:explaining'],'Keep water-specific evidence, numerical uncertainty, accuracy and explanation before supporting dependable findings for decisions.','Communication versus research');
add('degree-19302200','method',['f:survey-design','m:design','m:precision'],'The concrete survey fact includes sample bias. Deliberate design and precision support comparing wording and sampling, rather than assuming an independent research program.');
add('degree-19302200','responsibility',['f:statistical-limits','m:precision','m:explaining'],'Explicit concern with biased samples/uncertain findings plus careful explanation supports reporting survey limitations.','Communication versus research');
// Creative method gaps: retain concrete original-making contexts and a separate
// intentional method; these do not imply management, clinical or teaching duties.
for(const n of[1,2])legacy('graphic-design',n,['f:visual-composition','m:design'],'The concrete visual fact already includes original composition and choosing how materials express an idea. Design remains an independent preference.',undefined,[],['m:expression']);
for(const n of[1,2])legacy('animation',n,['f:shots-edit','t:visual','m:design'],'The media fact explicitly includes edit/animation timing. Original visual interest and deliberate design remain necessary.',undefined,[],['m:expression']);
add('degree-27403100','method',['f:shots-edit','m:design','m:precision'],'Stated camera-angle/sequence choices plus deliberate design and precision can support comparing shots without requiring a separate expressive-art label.');
// Education retains adult learners, the subject and course-level assessment.
add('degree-13115100','method',['f:learning-guide','t:adults','m:explaining','r:assessment'],'The learning-guide fact explicitly revises examples and their sequence. Adult learning and assessment remain mandatory; generic design is not an extra prerequisite.','Teaching method versus research');
add('degree-25102100','method',['f:code-test','t:adults','f:learning-guide','m:explaining','r:assessment'],'Use explicit coding context and revision of teaching examples, while retaining adult learners and course assessment.','Teaching method versus research',[],['m:computing']);
add('degree-25102200','method',['t:mathematics','t:adults','f:learning-guide','m:explaining','r:assessment'],'The mathematical topic fact explicitly checks counterexamples and why a rule works. Adult-course assessment and explanation remain required.','Teaching method versus research',[],['m:formalproof']);
for(const[id,topic,context]of[['degree-25104200','biology',null],['degree-25104300','ecology',null],['degree-25112500','history','historical-records']])add(id,'method',['t:'+topic,'t:adults','f:learning-guide','m:explaining','r:assessment',...(context?['f:'+context]:['m:design'])],'Planning subject-specific explanations and learning activities is distinct from a generic investigation preference. Preserve adult learners, subject and course assessment.','Teaching method versus research');
add('degree-25105200','method',['f:materials-controls','t:adults','f:learning-guide','m:explaining','r:assessment','r:safety'],'The chemistry fact supplies controlled comparisons; retain adult learners, assessment and explicit laboratory safety before a new teaching connection.','Teaching method versus research',[],['m:testing']);
export const evidenceRules069=rules;
export function decide(ledger,rule){const chosen=[...rule.all];for(const group of rule.any){const key=group.find(k=>ledger.yes[k]?.length&&!ledger.no[k]?.length);if(key)chosen.push(key);}
 const missing=[...rule.all.filter(k=>!ledger.yes[k]?.length),...rule.any.filter(g=>!g.some(k=>ledger.yes[k]?.length&&!ledger.no[k]?.length)).map(g=>g.join(' OR '))];
 const blocked=[...new Set([...chosen,...rule.block].filter(k=>ledger.no[k]?.length))];
 return{response:missing.length||blocked.length?'unfamiliar':'yes',confidence:'medium',missing,blocked,evidence:chosen.flatMap(k=>(ledger.yes[k]||[]).map(ref=>({feature:k,...ref}))),reason:rule.reason,category:rule.category};
}
