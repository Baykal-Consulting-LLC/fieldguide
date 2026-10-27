import {escapeHTML as h} from './model.js?v=0.31.0';
import {careerCandidates,selectedFollowUps} from './exploration.js?v=0.31.0';
import {getCareerFacts,occupationById} from './occupation-data.js?v=0.31.0';

const categoryLabel={
  'student-choice':'Student-selected career',
  'official-return':'Official provider-returned career',
  editorial:'Fieldguide editorial connection',
  related:'Related occupation',
  discovery:'A new possibility to investigate',
};
function candidateCategoryLabel(candidate,state){
 if(candidate?.category==='student-choice'){
   const choice=state?.exploration?.careerChoices?.[candidate.id];
   if(choice==='questions')return 'Student-selected career · questions';
 }
 return categoryLabel[candidate?.category]||'Possibility to investigate';
}
const evidenceLabel={
  interest:'Interest evidence', experience:'Experience evidence', followUp:'Your reflection',
  'student-choice':'Your choice', choice:'Your choice', activity:'Activity connection','official-return':'Provider-returned career',
  task:'Work activity', related:'Related occupation',
};
const safeArray=value=>Array.isArray(value)?value:[];
const escUrl=value=>typeof value==='string'&&/^https:\/\//.test(value)?value:'#';
const sourcesOf=career=>safeArray(career?.sources);

function candidateFacts(candidate){
 return candidate?.career||getCareerFacts(candidate?.id)||occupationById(candidate?.id)||{};
}
function candidateEvidence(candidate,includeNotes,counselor=false){
 return safeArray(candidate?.evidence).map((e,index)=>{
   const type=String(e?.type||'evidence'),id=String(e?.id||`${candidate.id}:${type}:${index+1}`);
   const knownLabel=evidenceLabel[type]||'Student evidence recorded';
   const generated=['interest','choice','activity','official-return'].includes(type);
   const label=(includeNotes||generated)&&typeof e?.label==='string'?e.label:knownLabel;
   const reference=includeNotes&&typeof e?.reference==='string'?e.reference:'';
   return {id,type,label,reference};
 });
}
function followUpEvidence(state,candidate,includeNotes){
 const answers=state?.exploration?.followUps?.[candidate?.id]||{};
 const prompts=new Map(selectedFollowUps(state,candidate?.id).map(prompt=>[prompt.id,prompt]));
 return Object.entries(answers).filter(([id,a])=>prompts.has(id)&&a&&typeof a==='object'&&(a.response||a.evidence||a.status||a.exposure||a.confidence!==null&&a.confidence!==undefined)).map(([id,a])=>{
   const prompt=prompts.get(id),detail=[a.response,a.evidence].filter(x=>typeof x==='string'&&x.trim()).join(' · ');
   return {id:`follow-up:${candidate.id}:${id}`,type:'followUp',label:includeNotes?`${prompt.title}: ${detail||a.status||'response recorded'}`:'You reflected on this work question.',reference:includeNotes?`Prompt: ${prompt.text}${a.date?` · ${a.date}`:''}`:''};
 });
}
function factSource(career){
 const sources=sourcesOf(career);
 return sources.find(s=>s.field==='summary')||sources[0]||null;
}
function firstTask(career){return safeArray(career?.tasks)[0]||null;}
function jobZoneLabel(career){
 const zone=Number(career?.jobZone),g=String(career?.preparation?.zoneGroup||'');
 if(g==='1–2'||g==='1-2'||zone===1||zone===2)return 'Job Zone 1–2';
 return [3,4,5].includes(zone)?`Job Zone ${zone}`:'Preparation group not reported';
}
function preparationStatusLabel(status){
 const labels={
   sourced:'Source data is available to investigate; program and employer requirements can vary.',
   partially_sourced:'Some preparation details are available; others remain unknown.',
   not_available:'Preparation details are not available in the reviewed sources.',
   review:'Preparation details need source review.',
 };
 return labels[status]||'Detailed preparation data not recorded.';
}
function candidateData(state){
 const includeNotes=state?.results?.includeNotes===true;
 return safeArray(careerCandidates(state)).slice(0,5).map(candidate=>{
   const career=candidateFacts(candidate),source=factSource(career),evidence=[...candidateEvidence(candidate,includeNotes),...followUpEvidence(state,candidate,includeNotes)];
   return {
     id:String(candidate?.id||career?.id||''),title:String(career?.title||candidate?.id||'Occupation'),soc:String(career?.soc||''),
     category:candidateCategoryLabel(candidate,state),selected:candidate?.selected===true,
     evidence:evidence.map(e=>({id:e.id,type:e.type,label:e.label,reference:e.reference||undefined})),
     occupationSource:source?{publisher:source.publisher||'',url:source.url||'',release:source.release||'',checkedAt:source.checkedAt||''}:null,
     unknowns:[...safeArray(candidate?.unknowns),...(career?.context?.status==='not_available'?[career.context.reason||'Work context is not available in the reviewed source.']:[])],
     experiment:candidate?.experiment||career?.experiment||null,
   };
 });
}
function occupationCard(candidate,state,mode){
 const career=candidateFacts(candidate),includeNotes=state?.results?.includeNotes===true;
 const evidence=[...candidateEvidence(candidate,includeNotes,mode==='counselor'),...followUpEvidence(state,candidate,includeNotes)];
 const task=firstTask(career),source=task?.source||factSource(career)?.url||career?.url;
 const preparation=career?.preparation||{};
 const experiment=candidate?.experiment||career?.experiment||{};
 const unknowns=[...safeArray(candidate?.unknowns)];
 if(career?.context?.status==='not_available')unknowns.push(career.context.reason||'Work setting and schedule are not available in reviewed data.');
 if(!career?.requirements)unknowns.push('Location-specific legal requirements have not been added to this career record.');
 const uniqueUnknowns=[...new Set(unknowns.filter(x=>typeof x==='string'&&x.trim()))];
 const factId=String(candidate?.id||career?.id||'');
 const evidenceMarkup=evidence.length?evidence.map(e=>`<li><span>${h(evidenceLabel[e.type]||'Evidence')}</span><p>${h(e.label)}</p>${e.reference?`<small>${h(e.reference)}</small>`:includeNotes?'<small>No source reference recorded.</small>':'<small>Personal detail is hidden by the report privacy setting.</small>'}<small class="career-evidence-id">Evidence ID: ${h(e.id)}</small></li>`).join(''):'<li><p>No supporting evidence is recorded. This remains available as a possibility to explore.</p></li>';
 const sourceMarkup=sourcesOf(career).slice(0,4).map(s=>`<li><a href="${escUrl(s.url)}" target="_blank" rel="noopener noreferrer">${h(s.publisher||'Occupation source')} · ${h(s.field||'profile')} ↗</a>${s.release?` <small>${h(s.release)}</small>`:''}</li>`).join('');
 return `<article class="career-brief-card" id="career-brief-${h(factId)}"><header><span class="career-candidate-kind">${h(candidateCategoryLabel(candidate,state))}</span><h2>${h(career?.title||factId||'Occupation')}</h2><span class="career-choice-state">${candidate?.selected?'Student selected':'Not selected yet'}</span></header><div class="career-brief-body"><p class="career-summary">${h(career?.summary||'Summary not available in the reviewed collection.')}</p><section><h3>Why this is here</h3><p class="career-connection">${candidate?.category==='student-choice'?'Your choice brought this occupation into view. The evidence below shows what you chose to explore or ask about.':candidate?.category==='official-return'?'This occupation appeared in the assessment provider’s returned career list.':candidate?.reason?h(candidate.reason):candidate?.category==='related'?'This role is related to another occupation you are exploring.':'A Fieldguide editorial connection is a prompt for exploration, not a match or prediction.'}</p><ul class="career-evidence-list">${evidenceMarkup}</ul></section><section><h3>Relevant work</h3>${task?`<blockquote>${h(task.text)}</blockquote><small>Occupation fact · <a href="${escUrl(source)}" target="_blank" rel="noopener noreferrer">source ↗</a></small>`:'<p>Task detail is not available in this reviewed record yet.</p>'}</section><section><h3>Preparation to investigate</h3><p>${h(jobZoneLabel(career))} · ${safeArray(preparation.typicalEducation).length?h(preparation.typicalEducation.join(', ')):'Typical education not reported.'}</p><p>${h(preparationStatusLabel(preparation.status))}</p></section>${uniqueUnknowns.length?`<section class="career-unknowns"><h3>What remains unknown</h3><ul>${uniqueUnknowns.map(x=>`<li>${h(x)}</li>`).join('')}</ul></section>`:''}<section class="career-experiment"><h3>One small experiment</h3><b>${h(experiment.title||'Learn more about the work')}</b><p>${h(experiment.detail||'Write down three questions and look for a safe way to learn about this occupation.')}</p>${experiment.notice?`<small>${h(experiment.notice)}</small>`:''}<button class="button secondary no-print" data-action="career-experiment" data-id="${h(factId)}">Add experiment to my plan +</button></section><div class="career-report-controls no-print"><label for="career-choice-${h(factId)}">My choice</label><select id="career-choice-${h(factId)}" data-career-choice="${h(factId)}"><option value="" ${!state?.exploration?.careerChoices?.[factId]?'selected':''}>Not decided</option><option value="explore" ${state?.exploration?.careerChoices?.[factId]==='explore'?'selected':''}>I want to explore this</option><option value="questions" ${state?.exploration?.careerChoices?.[factId]==='questions'?'selected':''}>I have questions</option><option value="later" ${state?.exploration?.careerChoices?.[factId]==='later'?'selected':''}>Maybe later</option></select><button class="text-link" data-action="career-first" data-id="${h(factId)}">Move to the front ↑</button><a class="text-link" href="#/career-reflection/${encodeURIComponent(factId)}">Answer a few optional questions ↗</a></div>${sourceMarkup?`<details class="career-sources"><summary>Occupation sources</summary><ul>${sourceMarkup}</ul></details>`:''}<a class="text-link no-print" href="#/career/${encodeURIComponent(factId)}">Open occupation profile ↗</a></div></article>`;
}

export function careerBriefReport(state,{mode='student'}={}){
 const candidates=safeArray(careerCandidates(state)).slice(0,5);
 const html=candidates.map(c=>occupationCard(c,state,mode)).join('');
 const shortlist=candidates.map((candidate,index)=>{const career=candidateFacts(candidate);return `<li><span>${String(index+1).padStart(2,'0')}</span><b>${h(career?.title||candidate.id||'Occupation')}</b><small>${h(candidateCategoryLabel(candidate,state))}${candidate?.selected?' · student selected':''}</small></li>`;}).join('');
 return `<section class="career-brief-report" aria-labelledby="career-brief-title"><div class="report-section-label"><span id="career-brief-title">OCCUPATIONS TO INVESTIGATE</span><span>${candidates.length} starting points · no ranking</span></div><p class="career-brief-intro">Each possibility remains a prompt for exploration. Open a card to trace student evidence to actual work, open questions, and a safe next step.</p>${shortlist?`<ol class="career-brief-shortlist">${shortlist}</ol>`:'<div class="career-brief-empty"><h2>Choose a career to investigate</h2><p>No occupation candidates are recorded yet. Browse the reviewed career collection or add a role you already have in mind.</p><a class="button secondary no-print" href="#/catalog">Browse careers ↗</a></div>'}${html?`<details class="career-candidate-details" ${mode==='counselor'?'open':''}><summary>Inspect work, evidence & next steps</summary><div class="career-brief-grid">${html}</div></details>`:''}</section>`;
}

export function careerBriefExport(state){
 const includeNotes=state?.results?.includeNotes===true;
 return candidateData(state).map(item=>({
   ...item,
   evidence:item.evidence.map(e=>({id:e.id,type:e.type,...(includeNotes?{label:e.label,...(e.reference?{reference:e.reference}:{})}:{label:evidenceLabel[e.type]||'Student evidence recorded'})})),
   ...(item.experiment?{experiment:{title:item.experiment.title||'',detail:includeNotes?item.experiment.detail||'':'',notice:item.experiment.notice||''}}:{}),
 }));
}
