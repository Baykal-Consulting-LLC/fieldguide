import test from 'node:test';
import assert from 'node:assert/strict';
import {occupations} from '../dist/occupation-data.js';
import {careerTree,careerTreePage} from '../dist/career-tree.js';
import {salaryProgression,salaryAtStage,salaryPreviewStages} from '../dist/salary-progression.js';
import {twcEntryWages,TWC_ENTRY_METADATA} from '../dist/twc-entry-wages.js';
import {salaryPanel} from '../dist/salary-ui.js';
import {freshState} from '../dist/model.js';
import {selectCareer,createPlanActions,applyGuidePay,availableFamilies,familyPaths,careerOptions,startGuide} from '../dist/guide-state.js';
import {guidePage,personalPlanPage,simpleCareerPage,salaryPreviewPage} from '../dist/guide-ui.js';
import {freshLifestyle,calculateLifestyle} from '../dist/lifestyle.js';
import {lifestyleChoices,buildLifestyleInputs,freshLifestyleBuilder} from '../dist/lifestyle-builder.js';
import {educationCostEvidence} from '../dist/education-cost-evidence.js';
import {professionalCostPanel} from '../dist/education-evidence-ui.js';
import {financialReview} from '../dist/source-review.js';
const flatten=tree=>tree.flatMap(f=>f.branches.flatMap(b=>b.careers));
test('the complete tree reaches every reviewed career, including doctor and dentist searches',()=>{
 assert.equal(occupations.length,117);assert.deepEqual(new Set(flatten(careerTree()).map(c=>c.id)),new Set(occupations.map(c=>c.id)));
 for(const [query,id]of [['doctor','physician'],['dentist','dentist'],['MD','physician'],['DMD','dentist']])assert.ok(flatten(careerTree(query)).some(c=>c.id===id),query);
 assert.equal(careerTree('nothing-like-this-occupation').length,0);assert.match(careerTreePage('nothing-like-this-occupation'),/Show the whole tree/);assert.doesNotMatch(careerTreePage('<img src=x>'),/<img src=x>/);
 for(const entry of ['college','careers','assessment','lifestyle','income']){const s=freshState();startGuide(s,entry);s.guide.family='health';s.guide.path='medicines-nutrition';const ids=careerOptions(s).map(c=>c.id);assert.ok(ids.includes('physician')&&ids.includes('dentist'));}
});
test('official TWC entry proxies replace unsupported entry multipliers without becoming measured experience data',()=>{
 assert.equal(Object.keys(twcEntryWages).length,116);assert.match(TWC_ENTRY_METADATA.entryDefinition,/lowest-paid one-third/);
 for(const [id,w]of Object.entries(twcEntryWages)){const p=salaryProgression(id);assert.ok(w.amount>0);assert.equal(w.measuredExperienceData,false);if(['teaching','elementary-teacher','high-school-teacher','police','firefighter'].includes(id))continue;assert.equal(p.stages[0].amount,w.amount,id);assert.equal(p.stages[0].evidence,'official_entry_proxy');assert.ok(p.stages.slice(1).every(s=>s.evidence==='illustration'));assert.match(salaryPanel(id),/rather than observed first-job pay/);}
 assert.equal(salaryAtStage('data-science'),77556);assert.equal(salaryAtStage('dentist'),121174);assert.equal(salaryAtStage('physician'),185725);assert.equal(twcEntryWages.tattoo,undefined);assert.match(salaryPanel('tattoo'),/Five postings cannot establish/);
});
test('medical training pay, professional costs, and debt assumptions stay visible in the plan',()=>{
 const s=freshState();selectCareer(s,'physician');applyGuidePay(s);createPlanActions(s);assert.equal(salaryProgression('physician').paidTraining.amount,69528);assert.match(salaryPanel('physician'),/Paid residency comes first/);const html=personalPlanPage(s);assert.match(html,/What these costs include/);assert.match(html,/240,919/);assert.doesNotMatch(html,/Training still needs funding/);
 assert.match(simpleCareerPage('dentist',s),/What training could cost|What these costs include/);assert.match(guidePage('guide/education',s),/medical-school tuition/);
 assert.equal(educationCostEvidence.dentist.amounts.firstYearTotalResident.value,95020);assert.equal(educationCostEvidence.dentist.yearRows.reduce((n,r)=>n+r.totalResident,0),354023);assert.match(professionalCostPanel('dentist'),/95,020/);assert.match(professionalCostPanel('occupational-therapy'),/2025/);assert.match(professionalCostPanel('physician-assistant'),/not stated|unspecified/i);
});
test('low-down-payment ownership includes PMI and medical emergency reserves while car deposits stay separate',()=>{
 const p={...freshLifestyle(),housingMode:'own',homePrice:'300000',downPercent:'5',pmiRate:'0.6'},r=calculateLifestyle(p),without=calculateLifestyle({...p,downPercent:'20'});
 assert.equal(r.pmi,142.5);assert.equal(without.pmi,0);assert.ok(Math.abs(r.housing-(r.mortgage+r.pmi+r.property+r.maintenance+Number(p.homeInsurance)+Number(p.hoa)+Number(p.utilities)))<1e-7);
 assert.equal(r.carUpfront,4000);assert.ok(Math.abs(r.upfront-(15000+9000+(r.essential+250)*6))<1e-7);assert.equal(calculateLifestyle({...p,pmiRate:''}).status,'incomplete');
 const b=freshLifestyleBuilder();for(const c of lifestyleChoices)b.choices[c.id]=0;const frugal=buildLifestyleInputs(b);assert.equal(frugal.groceries,'350');b.choices.transport=2;assert.equal(buildLifestyleInputs(b).carRate,'11.19');b.choices.transport=3;assert.equal(buildLifestyleInputs(b).carRate,'6.35');assert.equal(financialReview.benchmarks.length,7);
});

test('paid residency has its own non-mutating lifestyle preview and stays distinct from practice pay',()=>{const s=freshState(),before=JSON.stringify(s);assert.equal(salaryAtStage('physician','residency'),69528);assert.equal(salaryPreviewStages('physician').length,5);const html=salaryPreviewPage('physician','residency',s);assert.match(html,/Published residency example/);assert.match(html,/First-year resident/);assert.equal(JSON.stringify(s),before);assert.equal(salaryAtStage('dentist','residency'),null);assert.equal(salaryProgression('teaching').entryProxy,null);assert.doesNotMatch(salaryPanel('teaching'),/lower-paid third/);});

test('catalog coverage inventory reconciles the official directory with current guided profiles',async()=>{
 const {catalogCoverage:c}=await import('../dist/catalog-coverage-data.js'),{directoryOccupations}=await import('../dist/directory-data.js'),{catalogCoveragePage}=await import('../dist/catalog-coverage.js');
 const reviewed=new Set(occupations.map(o=>o.soc)),exact=directoryOccupations.filter(o=>reviewed.has(o.soc));assert.equal(c.reviewedCount,occupations.length);assert.equal(c.directoryCount,directoryOccupations.length);assert.equal(c.exactReviewedInDirectory,exact.length);assert.equal(c.directoryOnlyCount,directoryOccupations.length-exact.length);assert.equal(c.majorGroupCoverage.filter(g=>g.reviewedProfiles===0).length,0);
 assert.equal(c.candidates.filter(x=>x.priority==='implemented').length,50);assert.equal(c.candidates.length,50);assert.ok(c.candidates.every(x=>reviewed.has(x.soc)&&directoryOccupations.some(d=>d.soc===x.soc)));assert.match(catalogCoveragePage(),/857 previously/);assert.match(catalogCoveragePage(),/807/);assert.match(catalogCoveragePage(),/narrow specialties/);
});
