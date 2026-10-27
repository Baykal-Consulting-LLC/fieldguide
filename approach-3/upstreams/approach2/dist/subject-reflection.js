// Original Fieldguide exploration prompts. Separate from the official O*NET instrument.
const option=(id,label,paths)=>({id,label,paths:paths?paths.split(' '):[]});
export const subjectQuestions=[
 {id:'classes',text:'Which first-year classes would you like to sample?',options:[
  option('code','Programming and creative computing','software it data'),
  option('physical','Physics, circuits and how machines work','physical electrical mechanical engineering'),
  option('living','Biology, health and the living world','biology nursing allied health-professional environment'),
  option('studio','Design, drawing and making visual work','design architecture arts media'),
  option('people','Psychology, education and society','psychology education social society human-services'),
  option('business','Business, accounting and economics','management accounting finance marketing hospitality'),
  option('language','Languages, history and cultural study','humanities society'),
  option('civics','Law, justice and public policy','legal society public-service'),
  option('belief','Religion and belief traditions','faith humanities')
 ]},
 {id:'project',text:'Which small project would you try first?',options:[
  option('app','Build a simple app or interactive website','software it design'),
  option('device','Make a sensor, circuit or moving model','electrical mechanical engineering applied-technology'),
  option('field','Investigate a local habitat or water sample','environment biology physical'),
  option('story','Create a short film, performance or illustrated story','media arts design'),
  option('support','Create a useful learning or community resource','education social psychology human-services faith'),
  option('event','Plan an event, budget and outreach campaign','hospitality management accounting marketing public-service'),
  option('text','Write, translate or interpret a text or historical source','humanities society media'),
  option('policy','Compare proposals for a community or justice issue','legal society public-service'),
  option('lesson','Design a lesson or activity that helps someone learn','education'),
  option('community-access','Compare community services and ways to improve access','social society human-services public-service')
 ]},
 {id:'investigate',text:'Which question would you enjoy investigating?',options:[
  option('patterns','What patterns can data reveal?','data finance accounting interdisciplinary'),
  option('systems','Why does a technical system work or fail?','software it electrical mechanical applied-technology transport'),
  option('health','How do bodies move, recover or stay healthy?','biology nursing allied movement health-professional'),
  option('places','How could a place be safer or more sustainable?','civil environment architecture construction public-service'),
  option('communities','How do people learn and communities change?','education psychology social society human-services'),
  option('culture-study','How do language, history and culture shape meaning?','humanities society'),
  option('justice','How could laws or public decisions become fairer?','legal society public-service'),
  option('stories','How do images, performances and stories affect audiences?','arts media design'),
  option('belief','How do religious beliefs and traditions shape communities?','faith humanities society')
 ]},
 {id:'practice',text:'What kind of practice session sounds worth trying?',options:[
  option('debug','Debug a program and improve it step by step','software it data'),
  option('lab','Measure, calculate and repeat a lab experiment','physical electrical mechanical biology engineering'),
  option('studio','Make a draft, get feedback and revise a design','design architecture media arts'),
  option('care','Practice explaining, listening or coaching','education psychology nursing allied movement social'),
  {...option('care-health','Explain a health topic and practice care communication','nursing allied movement health-professional'),clarifies:'care'},
  {...option('care-learning','Explain a lesson and help someone learn','education psychology'),clarifies:'care'},
  {...option('care-community','Listen to community needs and explore support services','social society human-services'),clarifies:'care'},
  option('workshop','Use tools, plans or equipment in a supervised workshop','applied-technology construction civil transport'),
  option('business-case','Work through a business or budgeting case','management finance accounting marketing hospitality'),
  option('policy-case','Discuss law, fairness or a public-policy decision','legal society public-service'),
  option('text-study','Read, interpret and discuss a text or cultural question','humanities society'),
  option('hospitality-service','Plan a hospitality, food or guest-service experience','hospitality')
 ]},
 {id:'team',text:'Which contribution would you like to try in a group project?',options:[
  option('prototype','Build and test the working prototype','software electrical mechanical engineering applied-technology'),
  option('evidence','Check the evidence and analyze the results','data physical biology psychology finance accounting'),
  option('communicate','Shape the visuals, writing or presentation','design media arts humanities marketing'),
  option('include','Help others participate and understand','education social human-services nursing movement'),
  option('coordinate','Organize resources, schedules and practical details','management hospitality transport construction it public-service'),
  option('context','Research how the project affects people and places','society legal environment civil architecture health-professional allied interdisciplinary'),
  option('interpret','Compare sources and explain a text or cultural perspective','humanities society media')
 ]},
 {id:'quantitative',text:'Where would you be curious to use numbers or structured reasoning?',options:[
  option('logic','Algorithms, logic and data puzzles','software data it interdisciplinary'),
  option('models','Forces, energy, circuits and mathematical models','mechanical electrical physical engineering civil'),
  option('measure','Health, movement or environmental measurements','biology nursing allied movement health-professional environment'),
  option('space','Proportion, geometry and spatial design','architecture design construction applied-technology'),
  option('money','Budgets, markets and operational decisions','accounting finance management marketing hospitality transport'),
  option('evidence','Surveys, evidence and how claims are supported','')
 ]},
 {id:'reading',text:'Which reading or discussion topic would you choose?',options:[
  option('technology','How people create and use new technology','software it electrical engineering applied-technology data'),
  option('science','Discoveries in the physical and natural world','physical biology environment'),
  option('wellbeing','Health, care and human wellbeing','nursing allied movement health-professional psychology human-services'),
  option('arts-culture','Art, performance and visual storytelling','arts media design'),
  option('humanities','Language, history and cultural perspectives','humanities society'),
  option('public-issues','Law, justice and current public decisions','legal society public-service'),
  option('belief','Religious ideas, texts and belief traditions','faith humanities'),
  option('society','Learning, justice, communities and public decisions','education social society legal public-service interdisciplinary'),
  option('resources','How organizations, buildings and transport are planned','management marketing accounting finance hospitality architecture construction civil transport')
 ]},
 {id:'next',text:'Which next experience would help you learn more about yourself?',options:[
  option('digital','Try a beginner coding or data workshop','software data it'),
  option('build','Visit an engineering lab or supervised technical workshop','electrical mechanical engineering applied-technology construction transport'),
  option('nature','Join a field study or science demonstration','biology physical environment interdisciplinary'),
  option('create','Try a design, architecture, media or performance workshop','design architecture media arts'),
  option('serve','Observe a learning, care or community setting','education psychology social nursing allied movement health-professional human-services faith'),
  option('organize','Explore a business, civic or planning case study','management accounting finance marketing hospitality society legal public-service civil'),
  option('language','Try a writing, language or history discussion','humanities society media'),
  option('civic','Try a debate, community-policy or legal-studies workshop','legal society public-service'),
  option('belief','Visit a religious-studies seminar or discuss belief traditions','faith humanities')
 ]}
];
// Earlier broad choices remain readable, but are never silently narrowed.
const legacyChoices={
 classes:[option('organizations','Business, economics and public life','management accounting finance marketing hospitality legal public-service humanities faith interdisciplinary')],
 investigate:[option('meaning','How do language, belief and culture shape meaning?','humanities faith legal media arts')],
 practice:[option('case','Discuss an organizational, ethical or policy case','management legal society public-service finance hospitality humanities faith human-services interdisciplinary marketing accounting health-professional environment')],
 reading:[option('culture','Art, storytelling, language and belief','arts media humanities design faith')]
};
for(const q of subjectQuestions)q.legacyOptions=legacyChoices[q.id]||[];
export const allSubjectOptions=q=>[...q.options,...q.legacyOptions];
export const freshReflection=()=>({version:2,useForSuggestions:true,answers:{}});
export function cleanReflection(value){
 const result=freshReflection();
 if(![1,2].includes(value?.version)||!value.answers||typeof value.answers!=='object')return result;
 result.useForSuggestions=value.useForSuggestions!==false;
 for(const q of subjectQuestions){const a=value.answers[q.id];if(!a)continue;
  if(a.status==='unsure'||a.status==='skipped')result.answers[q.id]={status:a.status,choices:[]};
  else if(a.status==='selected'&&Array.isArray(a.choices)){
   const choices=[...new Set(a.choices)].filter(id=>allSubjectOptions(q).some(o=>o.id===id)).slice(0,2);
   if(choices.length)result.answers[q.id]={status:'selected',choices};
  }
 }
 return result;
}
export function setSubjectAnswer(draft,questionId,choice){
 const q=subjectQuestions.find(q=>q.id===questionId);if(!q)return false;
 if(choice==='unsure'||choice==='skipped'){draft.answers[q.id]={status:choice,choices:[]};return true;}
 const target=allSubjectOptions(q).find(o=>o.id===choice);if(!target)return false;
 const current=draft.answers[q.id]?.status==='selected'?draft.answers[q.id].choices:[];
 const family=target.clarifies||(q.options.some(o=>o.clarifies===target.id)?target.id:null);
 const relatives=family?current.filter(id=>id===family||q.options.some(o=>o.id===id&&o.clarifies===family)):[];
 // Only an explicit click replaces a family choice. Never infer a saved student's intent.
 const replacing=!current.includes(choice)&&relatives.length===1;
 if(!current.includes(choice)&&!replacing&&current.length===2)return false;
 const choices=current.includes(choice)?current.filter(x=>x!==choice):replacing?current.map(x=>x===relatives[0]?choice:x):[...current,choice];
 if(choices.length)draft.answers[q.id]={status:'selected',choices};else delete draft.answers[q.id];
 return true;
}
export function reflectionProgress(value){
 const d=cleanReflection(value),answers=Object.values(d.answers);
 return{recorded:answers.length,substantive:answers.filter(a=>a.status==='selected').length,unsure:answers.filter(a=>a.status==='unsure').length,skipped:answers.filter(a=>a.status==='skipped').length,
  directional:subjectQuestions.filter(q=>d.answers[q.id]?.status==='selected'&&q.options.some(o=>o.paths.length&&d.answers[q.id].choices.includes(o.id))).length,
  legacy:subjectQuestions.filter(q=>d.answers[q.id]?.status==='selected'&&q.legacyOptions.some(o=>d.answers[q.id].choices.includes(o.id))).length};
}
function explicitMixedAreas(paths,draft){
 const areaById=new Map(paths.map(p=>[p.id,p.area])),votes=new Map();
 for(const q of subjectQuestions){const a=draft.answers[q.id];if(a?.status!=='selected'||a.choices.length<2)continue;
  const areas=new Set(q.options.filter(o=>a.choices.includes(o.id)).map(o=>new Set(o.paths.map(id=>areaById.get(id)).filter(Boolean))).filter(s=>s.size===1).map(s=>[...s][0]));
  if(areas.size<2)continue;
  for(const area of areas)votes.set(area,(votes.get(area)||0)+1);
 }
 return [...votes].filter(([,n])=>n>=2).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])).slice(0,2).map(([area])=>area);
}
// Preserve repeated explicit directions even when an option spans broad areas.
// A group must recur in two different two-choice questions; unknowns add nothing.
function explicitMixedDirections(paths,draft){
 const paired=subjectQuestions.flatMap(q=>{const a=draft.answers[q.id],options=q.options.filter(o=>a?.status==='selected'&&a.choices.includes(o.id)&&o.paths.length);return options.length===2?[{id:q.id,sets:options.map(o=>new Set(o.paths))}]:[];});
 const counts=new Map(paths.map(p=>[p.id,p.subjectConnections])),candidates=new Map();
 const overlap=(set,ids)=>ids.some(id=>set.has(id));
 for(let i=0;i<paired.length;i++)for(let j=i+1;j<paired.length;j++)for(const flip of [0,1]){
  const left=[...paired[i].sets[0]].filter(id=>paired[j].sets[flip].has(id)),right=[...paired[i].sets[1]].filter(id=>paired[j].sets[1-flip].has(id));
  const groups=[left.filter(id=>!right.includes(id)),right.filter(id=>!left.includes(id))].map(g=>g.filter(id=>counts.get(id)>=2).sort()).sort((a,b)=>a.join('|').localeCompare(b.join('|')));
  if(groups.some(g=>!g.length))continue;
  const questions=paired.filter(q=>(overlap(q.sets[0],groups[0])&&overlap(q.sets[1],groups[1]))||(overlap(q.sets[1],groups[0])&&overlap(q.sets[0],groups[1]))).map(q=>q.id);
  if(questions.length<2)continue;
  const strength=groups.map(g=>Math.max(...g.map(id=>counts.get(id)))),key=groups.map(g=>g.join('|')).join(' / ');
  candidates.set(key,{groups,questions,weakest:Math.min(...strength),total:strength.reduce((a,b)=>a+b,0),key});
 }
 return [...candidates.values()].sort((a,b)=>b.questions.length-a.questions.length||b.weakest-a.weakest||b.total-a.total||a.key.localeCompare(b.key))[0]||null;
}
export function orderReflectedPathways(ranked,value){
 const d=cleanReflection(value),progress=reflectionProgress(d);
 let result=ranked.map((p,index)=>{
  const subjectReasons=subjectQuestions.flatMap(q=>{
   const a=d.answers[q.id];if(a?.status!=='selected')return[];
   const options=q.options.filter(o=>a.choices.includes(o.id)&&o.paths.includes(p.id));
   return options.length?[{question:q.id,labels:options.map(o=>o.label)}]:[];
  });
  return{...p,subjectConnections:subjectReasons.length,subjectReasons,subjectBaseOrder:index};
 });
 const sorted=result.slice().sort((a,b)=>b.subjectConnections-a.subjectConnections||a.subjectBaseOrder-b.subjectBaseOrder);
 const mixedAreas=explicitMixedAreas(ranked,d),directions=mixedAreas.length<2?explicitMixedDirections(sorted,d):null,tieCount=sorted.filter(p=>p.subjectConnections===sorted[0]?.subjectConnections).length;
 const reason=!d.useForSuggestions?'paused':progress.directional<2?'needs-answers':tieCount>4&&mixedAreas.length<2&&!directions?'broad-tie':'active';
 let diversified=false,diversityBasis=null;
 if(reason==='active'){
  result=sorted;
  if(mixedAreas.length===2){
   const chosen=mixedAreas.flatMap(area=>sorted.filter(p=>p.area===area&&p.subjectConnections>=2).slice(0,2));
   if(mixedAreas.every(area=>chosen.some(p=>p.area===area))){
    const selected=new Set(chosen.map(p=>p.id));
    for(const p of sorted){if(selected.size>=4)break;if(!mixedAreas.includes(p.area)&&p.subjectConnections>=2)selected.add(p.id);}
    result=[...sorted.filter(p=>selected.has(p.id)),...sorted.filter(p=>!selected.has(p.id))];diversified=true;diversityBasis='areas';
   }
  }else if(directions){
   const chosen=directions.groups.flatMap(g=>sorted.filter(p=>g.includes(p.id)).slice(0,2)),selected=new Set(chosen.map(p=>p.id));
   result=[...sorted.filter(p=>selected.has(p.id)),...sorted.filter(p=>!selected.has(p.id))];diversified=true;diversityBasis='directions';
  }
 }
 // A newly detected pair must not remove every strongest connected pathway.
 let strongestRestored=false;
 if(diversified&&!result.slice(0,4).some(p=>p.subjectConnections===sorted[0].subjectConnections)){
  const selected=result.slice(0,4),groups=diversityBasis==='areas'?mixedAreas.map(area=>sorted.filter(p=>p.area===area).map(p=>p.id)):directions.groups;
  const removable=selected.filter(p=>groups.every(g=>!g.includes(p.id)||selected.filter(x=>g.includes(x.id)).length>1)).sort((a,b)=>a.subjectConnections-b.subjectConnections||b.subjectBaseOrder-a.subjectBaseOrder)[0];
  if(removable){const keep=new Set(selected.filter(p=>p.id!==removable.id).map(p=>p.id));keep.add(sorted[0].id);result=[...sorted.filter(p=>keep.has(p.id)),...sorted.filter(p=>!keep.has(p.id))];strongestRestored=true;}
 }
 const startingIds=new Set((reason==='active'?result.filter(p=>p.subjectConnections>=2):result).slice(0,4).map(p=>p.id));
 return result.map(p=>({...p,subjectStartingPoint:startingIds.has(p.id),subjectStrongestRestored:strongestRestored,subjectActive:reason==='active' ,subjectStatus:reason,subjectTieCount:tieCount,subjectDiversified:diversified,subjectDiversityBasis:diversityBasis,subjectMixedAreas:diversityBasis==='areas'?mixedAreas:[],subjectMixedDirections:diversityBasis==='directions'?directions.groups:[],subjectMixedQuestions:diversityBasis==='directions'?directions.questions:[]}));
}
export function subjectSuggestions(ranked){return ranked.filter(p=>!p.subjectActive||p.subjectConnections>=2).slice(0,4);}
// Review is derived from saved tokens, without migrating an answer or adding a preference.
export function subjectReviewQueue(value){
 const d=cleanReflection(value);
 return subjectQuestions.flatMap((q,index)=>{const a=d.answers[q.id],earlier=q.legacyOptions.filter(o=>a?.status==='selected'&&a.choices.includes(o.id));return earlier.length?[{...q,index,earlier}]:[];});
}
// Sparse and broad-tie clues are separate unranked collections; starting-point order stays unchanged.
export function subjectEvidence(ranked,value){
 const d=cleanReflection(value),progress=reflectionProgress(d),rows=orderReflectedPathways(ranked,d),state=rows[0];
 const highest=Math.max(0,...rows.map(p=>p.subjectConnections)),startingIds=new Set(subjectSuggestions(rows).map(p=>p.id)),extras=state?.subjectActive?rows.filter(p=>p.subjectConnections>=2&&!startingIds.has(p.id)):[],repeated=rows.filter(p=>p.subjectConnections>=2),mixedTie=state?.subjectStatus==='broad-tie'&&repeated.some(p=>p.subjectConnections<highest),clueKind=state?.subjectStatus==='needs-answers'&&progress.directional===1?'single-answer':state?.subjectStatus==='broad-tie'&&highest>=2?(mixedTie?'broad-repeated':'broad-tie'):extras.length?'repeated-other':null;
 const clues=(clueKind==='single-answer'?rows.filter(p=>p.subjectConnections>0):clueKind==='broad-tie'?rows.filter(p=>p.subjectConnections===highest):clueKind==='broad-repeated'?repeated:clueKind==='repeated-other'?extras:[]).sort((a,b)=>a.title.localeCompare(b.title));
 const clueIds=new Set(clues.map(p=>p.id));
 const candidates=clues.length?subjectQuestions.flatMap((q,index)=>{
  if(d.answers[q.id])return[];
  const overlaps=new Set(q.options.filter(o=>!o.clarifies).map(o=>o.paths.filter(id=>clueIds.has(id)).sort().join('|')).filter(Boolean));
  return overlaps.size?[{id:q.id,index,text:q.text,relevance:overlaps.size}]:[];
 }).sort((a,b)=>b.relevance-a.relevance||a.index-b.index):[];
 return{clueKind,status:state?.subjectStatus||'needs-answers',basis:state?.subjectActive?'subjects':'broad-interests',progress,clues,followUp:candidates[0]||null};
}
// Current broad choices may be clarified; this is separate from legacy-answer review.
export function subjectDetailQueue(value){const d=cleanReflection(value);return subjectQuestions.flatMap((q,index)=>q.options.filter(o=>q.options.some(x=>x.clarifies===o.id)&&d.answers[q.id]?.status==='selected'&&d.answers[q.id].choices.includes(o.id)).map(o=>({question:q.id,index,option:o})));}
// Explicitly applied by the user inside the memory-only fictional journey.
export function jordanSubjectReflection(){const d=freshReflection();for(const [q,o]of Object.entries({classes:'code',project:'device',investigate:'systems',practice:'studio',team:'prototype',quantitative:'logic',reading:'technology',next:'create'}))setSubjectAnswer(d,q,o);return d;}
