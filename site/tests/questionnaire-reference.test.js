import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {freshState,sanitizeState,nextModule} from '../dist/model.js';import {curiosity} from '../dist/content.js';
import {fieldConnection,interestPicture,careerConnection} from '../dist/matching.js';
import {suggestedPaths,selectCareer,careerOptions,startGuide} from '../dist/guide-state.js';
import {occupations} from '../dist/occupation-data.js';import {interestStatus} from '../dist/analysis.js';
const cases=JSON.parse(readFileSync(new URL('../validation/questionnaire-reference-cases-2026-10-16.json',import.meta.url))).cases;
const profile=values=>{const s=freshState();for(const q of curiosity)s.curiosity[q.id]=values[q.theme]??1;return s;};
const official=scores=>({...freshState().results.interest,form:'onet-30-online',representation:'raw',min:'0',max:'20',source:'Synthetic official-form fixture',date:'2026-10-16',verified:true,suitable:true,scores:Object.fromEntries(Object.entries(scores).map(([k,v])=>[k,String(v)]))});
const role=id=>occupations.find(o=>o.id===id);
const checks={
 'hands-on-repair':()=>{const s=profile({R:5,I:4});assert.ok(fieldConnection(s,'trades').supported);assert.ok(fieldConnection(s,'building').supported);},
 'care-and-science':()=>{const s=profile({S:5,I:4});assert.ok(fieldConnection(s,'health').supported);s.guide.taskInterests=['work:nursing'];assert.equal(careerConnection(s,role('nursing')).taskCount,1);},
 'teaching-not-clinical':()=>{const s=profile({S:5});s.guide.pathIds=['learning'];s.guide.taskInterests=['work:elementary-teacher'];assert.equal(careerOptions(s)[0].id,'elementary-teacher');assert.ok(fieldConnection(s,'education').supported);},
 'digital-design':()=>{const s=profile({A:5,I:4});assert.ok(fieldConnection(s,'creative').supported);assert.ok(fieldConnection(s,'technology').supported);s.guide.taskInterests=['work:web-interface-design'];assert.equal(careerConnection(s,role('web-interface-design')).taskCount,1);},
 'e-and-c':()=>{const s=profile({E:5,C:5});assert.ok(fieldConnection(s,'business').supported);assert.ok(fieldConnection(s,'sales-office').supported);},
 'science-no-care':()=>{const s=profile({I:5,S:1});assert.equal(fieldConnection(s,'health').supported,false);s.guide.pathIds=['physical-sciences'];s.guide.taskInterests=['work:chemistry'];assert.equal(careerOptions(s)[0].id,'chemistry');assert.equal(careerConnection(s,role('nursing')).taskCount,0);},
 'mixed-creative-social':()=>{const s=profile({A:5,S:5});assert.ok(fieldConnection(s,'creative').supported);assert.ok(fieldConnection(s,'education').supported);},
 'safety-practical':()=>{const s=profile({R:5,S:4});assert.ok(fieldConnection(s,'public-safety').supported);s.guide.pathIds=['public-safety'];s.guide.taskInterests=['work:firefighter'];assert.equal(careerOptions(s)[0].id,'firefighter');},
 'all-unknown':()=>{const s=profile({R:'untried',I:'untried',A:'untried',S:'untried',E:'untried',C:'untried'});assert.deepEqual(suggestedPaths(s),[]);assert.equal(interestPicture(s).unknown,30);},
 'all-low':()=>assert.deepEqual(suggestedPaths(profile({})),[]),
 'all-high':()=>assert.deepEqual(suggestedPaths(profile({R:5,I:5,A:5,S:5,E:5,C:5})),[]),
 'official-flat':()=>{const i=official({R:10,I:10,A:10,S:10,E:10,C:10});assert.equal(interestStatus(i).kind,'flat');assert.deepEqual(interestStatus(i).top,[]);},
 'official-tied-top':()=>{const i=official({R:20,I:20,A:1,S:1,E:1,C:1});assert.deepEqual(interestStatus(i).top,['R','I']);},
 'official-display-only':()=>{const i=official({R:10,I:8,A:4,S:2,E:2,C:3});i.representation='provider-display';assert.equal(interestStatus(i).kind,'display-only');assert.deepEqual(interestStatus(i).top,[]);},
 'partial-official':()=>{const i=official({R:20,I:15,A:5,S:5,E:5,C:5});i.scores.C='';assert.equal(interestStatus(i).kind,'incomplete');assert.deepEqual(interestStatus(i).top,[]);},
 'high-interest-low-confidence':()=>{const s=profile({S:5,I:4}),before=interestPicture(s);s.confidence.data={exposure:'new',confidence:1};assert.deepEqual(interestPicture(s),before);assert.ok(fieldConnection(s,'health').supported);},
 'high-confidence-low-interest':()=>{const s=profile({}),before=interestPicture(s);s.confidence.data={exposure:'often',confidence:5};assert.deepEqual(interestPicture(s),before);assert.deepEqual(suggestedPaths(s),[]);},
 'income-independent':()=>{const s=profile({A:5}),before=interestPicture(s);s.guide.incomeTarget='300000';s.finance.lifestyle.rent='8000';assert.deepEqual(interestPicture(s),before);},
 'explicit-choice':()=>{const s=profile({A:5});selectCareer(s,'dentist');assert.equal(s.guide.primaryCareer,'dentist');assert.ok(s.guide.careerIds.includes('dentist'));},
 'skip-and-resume':()=>{const s=freshState();s.skippedModules=['curiosity'];const clean=sanitizeState(s);assert.equal(nextModule(clean).id,'priorities');startGuide(clean,'assessment');assert.deepEqual(clean.skippedModules,['curiosity']);},
 'legacy-version':()=>{const s=sanitizeState({version:1,curiosity:{'curiosity-1':5}});assert.equal(s.questionnaireVersion,'1.0.0');assert.equal(s.curiosity['curiosity-1'],5);assert.equal(curiosity[0].text,'Build a small prototype that makes an everyday task easier.');}
};
for(const c of cases)test('reference case: '+c.label,()=>{assert.equal(typeof checks[c.id],'function',c.id);checks[c.id]();});
