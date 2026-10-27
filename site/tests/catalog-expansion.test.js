import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {occupations,directoryOccupations} from '../dist/occupation-data.js';
import {commonCareerSpecs} from '../dist/common-career-data.js';import {commonCostEvidence} from '../dist/common-cost-data.js';
import {groupedOccupations} from '../dist/catalog-grouping-data.js';import {careerTree,careerTreePage} from '../dist/career-tree.js';
import {freshState,sanitizeState,moduleStatus,isComplete} from '../dist/model.js';import {curiosity,QUESTIONNAIRE_VERSION} from '../dist/content.js';
import {interestPicture,fieldConnection,careerConnection,taskChoicesFor} from '../dist/matching.js';
import {startGuide,careerOptions,availableFamilies,selectedPaths,suggestedPaths,toggleGuideFamily,toggleGuidePath,selectCareer,applyGuidePay,createPlanActions} from '../dist/guide-state.js';
import {simpleCareerPage,guidePage,personalPlanPage} from '../dist/guide-ui.js';import {salaryProgression,salaryAtStage} from '../dist/salary-progression.js';import {salaryPanel} from '../dist/salary-ui.js';import {calculateLifestyle} from '../dist/lifestyle.js';
const audit=JSON.parse(readFileSync(new URL('../validation/commonness-directory-audit-2026-10-16.json',import.meta.url)));
const byId=id=>occupations.find(o=>o.id===id);
function interests(values){const s=freshState();for(const q of curiosity)s.curiosity[q.id]=values[q.theme]??'untried';return s;}
test('all857 baseline directory titles have unique sourced decisions, exactly50 additions and807 grouped',()=>{
 assert.equal(audit.records.length,857);assert.equal(new Set(audit.records.map(o=>o.soc)).size,857);assert.equal(audit.records.filter(o=>o.selectedId).length,50);assert.equal(commonCareerSpecs.length,50);assert.equal(groupedOccupations.length,807);
 for(const o of audit.records){assert.ok(o.primaryFamily&&o.path&&o.why);assert.ok(o.employment.national.sourceURL);if(o.employment.national.employment===null)assert.ok(o.employment.national.missingReason);}
 const exact=directoryOccupations.filter(d=>occupations.some(o=>o.soc===d.soc));assert.equal(exact.length,116);assert.equal(exact.length+groupedOccupations.length,923);assert.equal(new Set([...exact,...groupedOccupations].map(o=>o.soc)).size,923);
});
test('the whole tree reaches all117 profiles, all807 grouped titles, and12 broad fields',()=>{
 const tree=careerTree();assert.equal(tree.length,12);assert.equal(new Set(tree.flatMap(f=>f.branches.flatMap(b=>b.careers.map(o=>o.id)))).size,117);assert.equal(new Set(tree.flatMap(f=>f.branches.flatMap(b=>b.grouped.map(o=>o.soc)))).size,807);
 for(const word of ['dentist','doctor','surgeon','actor','cashier','truck','nurse','teacher'])assert.ok(careerTree(word).length,word);assert.match(careerTreePage('actor'),/Explore this field/);const dental=careerTree('dentist').flatMap(f=>f.branches.flatMap(b=>b.careers.map(o=>o.id)));assert.ok(dental.includes('dentist'));assert.ok(!dental.includes('pharmacy'));
});
test('every new profile has work, qualities, skills, requirements, appropriate cost evidence and a plan',()=>{
 for(const c of commonCareerSpecs){const o=byId(c.id),s=freshState(),html=simpleCareerPage(c.id,s);assert.ok(o.tasks.length&&o.skills.length&&o.workStyles.length,c.id);assert.ok(o.pathIds.length,c.id);assert.ok(commonCostEvidence[c.id].sourceURLs.length,c.id);for(const label of ['Why this matches you','How to get there','What training could cost','Estimated yearly pay'])assert.ok(html.includes(label),c.id+label);assert.doesNotMatch(html,/undefined|NaN/);selectCareer(s,c.id);applyGuidePay(s);createPlanActions(s);assert.match(personalPlanPage(s),/Top matches/);assert.equal(calculateLifestyle(s.finance.lifestyle).status,'illustration');}
});
test('combined wages, experienced roles, paid academies and variable hours remain explicit',()=>{
 for(const id of ['personal-care-aide','mental-health-counselor'])assert.match(salaryPanel(id),/broader occupation group/);
 for(const id of ['marketing-manager','general-operations-manager','restaurant-manager'])assert.match(salaryPanel(id),/related experience/);
 for(const id of ['cashier','hairdresser','photographer','food-counter'])assert.match(salaryPanel(id),/Fewer paid hours/);
 for(const id of ['police','firefighter'])assert.match(commonCostEvidence[id].amountLabel,/paid|salary/i);
 for(const id of ['teaching','elementary-teacher','high-school-teacher'])assert.deepEqual(salaryProgression(id).stages.map(s=>s.amount),[58069,59772,63944,68844]);
});
test('all30 reflection prompts cover six themes equally and preserve original12 IDs',()=>{assert.equal(curiosity.length,30);for(const t of ['R','I','A','S','E','C'])assert.equal(curiosity.filter(q=>q.theme===t).length,5);assert.equal(curiosity[0].text,'Build a small prototype that makes an everyday task easier.');assert.equal(QUESTIONNAIRE_VERSION,'2.0.0');});
test('six contrasting preference patterns yield sensible broad-field starting points without aptitude scores',()=>{
 for(const [theme,field] of [['R','trades'],['I','science'],['A','creative'],['S','education'],['E','business'],['C','sales-office']]){const s=interests({R:1,I:1,A:1,S:1,E:1,C:1,[theme]:5});assert.ok(fieldConnection(s,field).supported,theme);assert.ok(availableFamilies(s).some(f=>f.id===field));}
 assert.equal(fieldConnection(interests({R:5,I:1}),'science').supported,false);const s=interests({A:5,I:5,R:3,S:2,E:2,C:3});assert.ok(fieldConnection(s,'creative').supported);assert.ok(fieldConnection(s,'technology').supported);
});
test('flat, unknown and low-interest responses never invent a personalized winner',()=>{
 for(const v of [1,3,5,'untried']){const s=interests({R:v,I:v,A:v,S:v,E:v,C:v});assert.equal(interestPicture(s).positive.length,0);assert.equal(suggestedPaths(s).length,0);startGuide(s,'assessment');assert.ok(!guidePage('guide/paths',s).includes('guide-evidence-tag'));}
 const s=freshState();s.curiosity['curiosity-1']=5;assert.equal(interestPicture(s).positive.length,0);assert.equal(suggestedPaths(s).length,0);
});
test('literal dental, medical, pharmacy and rehabilitation tasks distinguish careers within fields',()=>{
 for(const [path,id,other] of [['medicines-nutrition','dentist','pharmacy'],['medicines-nutrition','physician','dentist'],['rehabilitation','physical-therapy','occupational-therapy'],['allied-health','radiologic-technologist','sonography']]){const s=freshState();s.guide.pathIds=[path];s.guide.taskInterests=['work:'+id];assert.equal(careerOptions(s)[0].id,id);assert.equal(careerConnection(s,byId(id)).taskCount,1);assert.equal(careerConnection(s,byId(other)).taskCount,0);assert.ok(careerConnection(s,byId(id)).reasons[0].length);}
});
test('mixed interests stay reachable; task choices are balanced across chosen fields',()=>{
 const s=interests({A:5,S:5,I:4,R:2,E:2,C:2});s.guide.pathIds=['medicines-nutrition','visual-arts','technology'];const options=careerOptions(s),tasks=taskChoicesFor(options,s.guide.pathIds).slice(0,12);for(const path of s.guide.pathIds)assert.ok(tasks.some(t=>byId(t.id.slice(5)).pathIds.includes(path)),path);s.guide.taskInterests=['work:dentist','work:graphic-design'];const top=careerOptions(s).slice(0,2).map(o=>o.id);assert.ok(top.includes('dentist')&&top.includes('graphic-design'));
});
test('confidence, income, lifestyle, and ability self-reports do not alter the interest picture',()=>{const s=interests({S:5,I:4,R:1,A:2,E:3,C:2}),before=interestPicture(s);s.confidence.data={exposure:'new',confidence:1};s.finance.lifestyle.rent='9000';s.guide.incomeTarget='300000';s.results.abilities=[{instrument:'Example',value:'1'}];assert.deepEqual(interestPicture(s),before);});
test('versioned answers, explicit skipped sections and task selections persist without return loops',()=>{
 const s=freshState();s.curiosity['curiosity-1']='untried';s.skippedModules=['curiosity','evidence'];s.guide.taskInterests=['work:dentist'];const clean=sanitizeState(s);assert.equal(clean.curiosity['curiosity-1'],'untried');assert.ok(isComplete(clean,'curiosity'));assert.equal(moduleStatus(clean,'evidence').skipped,true);assert.deepEqual(clean.guide.taskInterests,['work:dentist']);const legacy=sanitizeState({version:1,curiosity:{'curiosity-1':5}});assert.equal(legacy.questionnaireVersion,'1.0.0');assert.equal(legacy.curiosity['curiosity-1'],5);
});
test('changing fields prunes obsolete task likes; empty task flow has a direct recovery',()=>{
 const s=freshState();startGuide(s,'careers');toggleGuideFamily(s,'health');toggleGuidePath(s,'medicines-nutrition');s.guide.taskInterests=['work:dentist'];toggleGuideFamily(s,'health');assert.deepEqual(s.guide.taskInterests,[]);assert.match(guidePage('guide/work-fit',s),/Choose a field/);
});
test('all choices within every question retain numeric-versus-unknown meaning',()=>{for(const q of curiosity)for(const value of [1,2,3,4,5,'untried']){const s=freshState();s.curiosity[q.id]=value;assert.equal(sanitizeState(s).curiosity[q.id],value);}});
