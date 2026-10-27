import test from 'node:test';import assert from 'node:assert/strict';
import {occupations,occupationById} from '../dist/occupation-data.js';
import {careerEducationSummary,collegeBenefit,plainEducation} from '../dist/career-presentation.js';
import {careerLibraryPage} from '../dist/career-library-ui.js';
import {freshState} from '../dist/model.js';
import {freshLifestyle} from '../dist/lifestyle.js';
import {lifestyleRoom} from '../dist/lifestyle-story.js';

test('education summaries remove classification jargon across the catalog and preserve the named nursing license',()=>{
 for(const o of occupations){const text=careerEducationSummary(o);assert.ok(text.length>0,o.id);assert.doesNotMatch(text,/Postsecondary nondegree award|No formal educational credential|or equivalent|is the national typical-entry route/);assert.ok(collegeBenefit(o).copy,o.id);}
 assert.match(careerEducationSummary(occupationById('vocational-nurse')),/Approved nursing program.*Texas LVN license/);
 assert.match(plainEducation('Postsecondary nondegree award'),/certificate or diploma/);
 const html=careerLibraryPage('learn/career/vocational-nurse',freshState());assert.match(html,/Registered nurses generally earn more/);assert.match(html,/after licensing/);assert.doesNotMatch(html,/Postsecondary nondegree award|College courses in a related subject/);
});
test('lifestyle verdicts say directly whether costs fit and track the actual budget calculation',()=>{
 for(const gross of ['25000','50000','80000','150000']){const room=lifestyleRoom({...freshLifestyle(),gross});assert.equal(room.key==='tradeoffs',room.result.remaining<0);assert.match(room.title,room.key==='tradeoffs'?/does not cover/:/covers/);}
 const trade=collegeBenefit(occupationById('electrician'));assert.match(trade.copy,/construction-management degree/);assert.match(trade.copy,/supervised work and licensing/);assert.doesNotMatch(trade.copy,/guarantee|will earn more/);
});

test('the plan groups visible pay milestones under each career and preserves saved work',async()=>{
 const {walkthroughState}=await import('../dist/journey-walkthroughs.js');const {personalPlanPage}=await import('../dist/guide-ui.js');
 const s=walkthroughState('medicine',{plan:true});s.actions[0].notice='I liked explaining the science.';s.actions[0].done=true;
 const before=JSON.stringify(s),html=personalPlanPage(s);assert.match(html,/(First|Top) matches/);assert.match(html,/Estimated yearly pay/);assert.match(html,/Paid residency/);assert.match(html,/\$190K/);assert.doesNotMatch(html,/More info · starting pay and future pay|See the lifestyle/);assert.equal(JSON.stringify(s),before);assert.match(html,/I liked explaining the science/);
});

test('library salary examples are explicitly separate from a student’s chosen lifestyle',()=>{
 const s=freshState(),before=JSON.stringify(s),html=careerLibraryPage('learn/salary/vocational-nurse/entry',s),picture=html.match(/<section class="lifestyle-picture[\s\S]*?<\/section>/)?.[0];assert.ok(picture);assert.match(picture,/AN AUSTIN EXAMPLE/);assert.match(picture,/this example/);assert.doesNotMatch(picture,/your lifestyle|your choices|your costs|your take-home/);assert.equal(JSON.stringify(s),before);
});
