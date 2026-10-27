import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState, sanitizeState} from '../dist/model.js';
import {themes, interestStatus, analyze, freshResults, cleanResults} from '../dist/analysis.js';
import {updateResult, reportExport, visualReport, counselorEvidenceReport} from '../dist/results-ui.js';
import {careerBriefReport} from '../dist/career-report.js';

const rawMini = () => ({
  ...freshResults().interest,
  form:'onet-30-online', representation:'raw', source:'Official result page', date:'2026-10-10',
  min:'0', max:'20', verified:true, suitable:true,
  scores:{R:'0',I:'2',A:'4',S:'20',E:'1',C:'0'}
});
const entered = interest => {const state=freshState();state.results.interest=interest;return state;};

test('raw Mini-IP totals are distinct from provider 0–10 display values',()=>{
  const raw=rawMini();
  assert.equal(interestStatus(raw).kind,'ready');
  assert.deepEqual(interestStatus(raw).top,['S']);
  const display={...raw,representation:'provider-display',min:'0',max:'10',scores:{R:'4',I:'4',A:'4',S:'10',E:'4',C:'4'}};
  assert.equal(interestStatus(display).kind,'display-only');
  assert.deepEqual(interestStatus(display).top,[]);
  assert.match(interestStatus(display).issues[0],/rounded displays cannot be converted back/);
});

test('raw scale/form pairs are checked and transformed values are preserved verbatim',()=>{
  const wrongRange=rawMini();wrongRange.max='10';assert.notEqual(interestStatus(wrongRange).kind,'ready');
  const paper=rawMini();paper.form='onet-60-paper';paper.max='10';paper.scores.S='10';assert.equal(interestStatus(paper).kind,'ready');
  const shown=rawMini();shown.representation='provider-display';shown.rawScores={R:'0',I:'1',A:'2',S:'20',E:'0',C:'0'};shown.displayScores={R:'4',I:'4',A:'4',S:'10',E:'4',C:'4'};
  const clean=cleanResults({interest:shown}).interest;
  assert.deepEqual(clean.rawScores,shown.rawScores);assert.deepEqual(clean.displayScores,shown.displayScores);assert.deepEqual(clean.scores,shown.scores);
});

test('old records migrate to unknown representation without reconstructing raw totals',()=>{
  const state=sanitizeState({version:1,results:{interest:{form:'onet-30-online',min:'0',max:'10',scores:{R:'4',I:'4',A:'4',S:'10',E:'4',C:'4'}}}});
  assert.equal(state.results.interest.representation,'unknown');
  assert.equal(state.results.interest.scores.S,'10');
  assert.equal(interestStatus(state.results.interest).kind,'review');
  assert.deepEqual(interestStatus(state.results.interest).top,[]);
});

test('partial and blank imports remain unknown while zero is a valid raw score',()=>{
  const incomplete=rawMini();incomplete.scores.C='';assert.equal(interestStatus(incomplete).kind,'incomplete');
  const zeros=rawMini();zeros.scores={R:'0',I:'0',A:'0',S:'0',E:'0',C:'0'};assert.equal(interestStatus(zeros).kind,'flat');
  const oneZero=rawMini();oneZero.scores.R='0';assert.equal(interestStatus(oneZero).kind,'ready');
});

test('zero scores are not promoted into a second interest level or editorial evidence',()=>{
  const social=rawMini();social.scores={R:'0',I:'0',A:'0',S:'20',E:'0',C:'0'};
  assert.equal(interestStatus(social).kind,'ready');
  assert.deepEqual(interestStatus(social).top,['S']);
  const analysis=analyze(entered(social));
  const interestEvidence=analysis.items.flatMap(item=>item.evidence.filter(e=>e.source==='interest'));
  assert.ok(interestEvidence.length>0);
  assert.ok(interestEvidence.every(e=>/Social/.test(e.label)));
  assert.ok(interestEvidence.every(e=>!/Realistic|Investigative|Artistic|Enterprising|Conventional/.test(e.label)));
  assert.match(interestEvidence[0].label,/highest raw score level above the form minimum/);
  assert.equal(analysis.version,'1.4.0');
});

test('flat profiles and ties stay visible without creating ranked aptitude or probability',()=>{
  const flat=rawMini();flat.scores=Object.fromEntries(themes.map(t=>[t.id,'7']));assert.equal(interestStatus(flat).kind,'flat');
  const tied=rawMini();tied.scores={R:'8',I:'9',A:'9',S:'8',E:'3',C:'2'};assert.deepEqual(interestStatus(tied).top,['I','A']);
  const a=analyze(entered(tied));assert.ok(a.items.every(x=>!x.evidence.some(e=>e.source==='aptitude')));
});

test('changing form clears entered values and raw/display companions and invalidates verification',()=>{
  const state=entered(rawMini());state.results.interest.rawScores.R='19';state.results.interest.displayScores.R='10';
  updateResult(state,{dataset:{result:'interest.form'},type:'select-one',value:'onet-60-paper'});
  assert.equal(state.results.interest.scores.S,'');assert.equal(state.results.interest.rawScores.R,'');assert.equal(state.results.interest.displayScores.R,'');
  assert.equal(state.results.interest.verified,false);assert.equal(state.results.interest.suitable,false);
});

test('representation and bounds edits invalidate the old source check',()=>{
  const state=entered(rawMini());
  updateResult(state,{dataset:{result:'interest.representation'},type:'select-one',value:'provider-display'});
  assert.equal(state.results.interest.verified,false);
  state.results.interest.verified=true;
  updateResult(state,{dataset:{result:'interest.max'},type:'number',value:'19'});
  assert.equal(state.results.interest.verified,false);
  assert.notEqual(interestStatus(state.results.interest).kind,'ready');
});

test('source/date corrections withdraw interest explanations and check flags',()=>{
  const state=entered(rawMini());
  assert.equal(analyze(state).status.kind,'ready');
  updateResult(state,{dataset:{result:'interest.date'},type:'date',value:'2026-10-11'});
  assert.equal(state.results.interest.verified,false);
  assert.ok(analyze(state).items.every(x=>!x.evidence.some(e=>e.source==='interest')));
});

test('same administration raw and display records retain the shared source reference',()=>{
  const record=rawMini();record.origin='school-2026-fall';record.displayScores={R:'4',I:'4',A:'4',S:'10',E:'4',C:'4'};
  const copy=cleanResults({interest:record}).interest;
  assert.equal(copy.origin,'school-2026-fall');assert.equal(copy.representation,'raw');
  assert.deepEqual(copy.rawScores,record.rawScores);assert.deepEqual(copy.displayScores,record.displayScores);
});

test('private experience and follow-up notes stay excluded from exports unless opted in',()=>{
  const state=entered(rawMini());state.results.includeNotes=false;
  state.results.abilities=[{id:'ability-1',instrument:'Example assessment',form:'A',date:'2026-10-01',source:'source',dimension:'memory',value:'Average',scale:'band',norms:'',interval:'',interpretation:'PRIVATE ABILITY INTERPRETATION',verified:true}];
  state.results.connections={design:{experience:'enjoyed',notes:'PRIVATE EXPERIENCE',preparation:'PRIVATE QUESTION',choice:'explore'}};
  state.results.valuesNotes='PRIVATE VALUES';state.results.nominationReason='PRIVATE NOMINATION';
  assert.doesNotMatch(JSON.stringify(reportExport(state)),/PRIVATE/);
  assert.doesNotMatch(visualReport(state),/PRIVATE EXPERIENCE|PRIVATE QUESTION|PRIVATE VALUES|PRIVATE NOMINATION|PRIVATE ABILITY INTERPRETATION/);
  state.results.includeNotes=true;assert.match(JSON.stringify(reportExport(state)),/PRIVATE EXPERIENCE/);assert.match(JSON.stringify(reportExport(state)),/PRIVATE ABILITY INTERPRETATION/);
});

test('student brief preserves uncertainty and counselor evidence view attributes source and notes',()=>{
  const state=entered(rawMini());state.results.connections={design:{experience:'new',notes:'PRIVATE STUDENT NOTE',preparation:'PRIVATE QUESTION',choice:'explore'}};
  const student=visualReport(state);assert.match(student,/YOUR EXPLORATION BRIEF/);assert.match(student,/marked unfamiliar/);
  const counselor=counselorEvidenceReport(state);assert.match(counselor,/Counselor evidence view/);assert.match(counselor,/Raw totals \/ paper counts/);assert.match(counselor,/design:choice:1/);
  state.results.includeNotes=false;assert.doesNotMatch(counselorEvidenceReport(state),/PRIVATE STUDENT NOTE|PRIVATE QUESTION/);
});

test('provider-returned careers are attributable, bounded, and separate from editorial ideas',async()=>{
  const {careerCandidates}=await import('../dist/exploration.js');
  const {providerReturnsStatus}=await import('../dist/analysis.js');
  const state=entered(rawMini());state.results.interest.representation='provider-display';
  state.results.providerReturns={ids:['psychiatric-aide'],source:'Provider result page',date:'2026-10-16',verified:true};
  assert.equal(providerReturnsStatus(state.results.providerReturns).kind,'ready');
  const before=careerCandidates(state);const imported=before.find(x=>x.category==='official-return');
  assert.equal(imported.id,'psychiatric-aide');assert.equal(imported.evidence[0].type,'official-return');
  const importedHtml=careerBriefReport(state);assert.match(importedHtml,/Official provider-returned career/);assert.match(importedHtml,/This occupation was returned by the assessment provider/);
  assert.equal(reportExport(state).providerReturns.source,'Provider result page');
  assert.doesNotMatch(JSON.stringify(before),/editorial connection/);
  const select={dataset:{result:'providerReturns.ids'},multiple:true,selectedOptions:Array.from({length:7},(_,n)=>({value:['psychiatric-aide','psychiatric-technician','clinical-psychologist','software','industrial-design','social-research','environmental-science'][n]}))};
  updateResult(state,select);assert.equal(state.results.providerReturns.ids.length,5);assert.equal(state.results.providerReturns.verified,false);
  state.results.providerReturns={ids:[],slots:['psychiatric-aide','','','clinical-psychologist',''],source:'Provider result page',date:'2026-10-16',verified:true};
  updateResult(state,{dataset:{result:'providerReturns.idSlots.3'},type:'select-one',value:'software'});
  assert.equal(state.results.providerReturns.slots[0],'psychiatric-aide');assert.equal(state.results.providerReturns.slots[3],'software');assert.deepEqual(state.results.providerReturns.ids,['psychiatric-aide','software']);
  state.results.providerReturns={ids:['psychiatric-aide'],source:'Provider result page',date:'2026-10-16',verified:true};
  updateResult(state,{dataset:{result:'providerReturns.source'},type:'text',value:'Corrected source'});
  assert.equal(state.results.providerReturns.verified,false);assert.equal(providerReturnsStatus(state.results.providerReturns).kind,'review');
});

test('generated interest theme labels remain visible without private references',async()=>{
  const {fictionalState}=await import('../dist/analysis.js');
  const state=fictionalState(freshState());state.results.includeNotes=false;
  const html=visualReport(state);
  assert.match(html,/Investigative/);
  assert.match(html,/This direction is an editorial connection/);
});
