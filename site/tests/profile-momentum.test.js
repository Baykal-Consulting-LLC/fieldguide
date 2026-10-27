// Historical funnel UI assertions retained for pre-0.53 behavior; current flow is tested in open-explorer-053.test.js.
import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState} from '../dist/model.js';
import {walkthroughState} from '../dist/journey-walkthroughs.js';
import {profileQuestions,requiredProfileQuestions,questionAnswered} from '../dist/profile-journey.js';
import {profileMomentum,createMomentumMotion} from '../dist/profile-momentum.js';
import {historicalProfileJourneyPage as profileJourneyPage} from '../dist/profile-journey-ui.js';
function interests(n){const s=freshState(),example=walkthroughState('medicine');s.profileJourney.index=n;for(const q of profileQuestions.slice(0,n))s.profileJourney.officialInterest.answers[q.id]=example.profileJourney.officialInterest.answers[q.id];return s;}
test('milestones reflect completed activities rather than the current question index',()=>{
 const s=interests(30),m=profileMomentum(s);assert.equal(m.done,30);assert.equal(m.total,60);assert.equal(m.percent,50);assert.equal(m.boost.id,'interest-half');
 const empty=interests(0);empty.profileJourney.index=30;assert.equal(profileMomentum(empty).done,0);assert.equal(profileMomentum(empty).boost,null);
 const before=JSON.stringify(s);profileMomentum(s);profileJourneyPage('journey/profile',s);assert.equal(JSON.stringify(s),before);
});
test('encouragement does not interpret answer ratings or promise career results',()=>{
 const a=interests(30),b=interests(30);for(const key of Object.keys(a.profileJourney.officialInterest.answers)){a.profileJourney.officialInterest.answers[key]=1;b.profileJourney.officialInterest.answers[key]=5;}
 assert.deepEqual(profileMomentum(a),profileMomentum(b));
 for(const n of [0,6,15,30,45,60]){const m=profileMomentum(interests(n));assert.ok(m.percent>=0&&m.percent<=100);if(m.boost)assert.doesNotMatch(m.boost.title+' '+m.boost.copy,/score|smart|perfect career|guarantee|minutes left/i);}
});
test('focused follow-up progress uses the actual required questions, and completed profiles do not replay cheers',()=>{
 const s=walkthroughState('creative'),i=profileQuestions.findIndex(q=>q.kind==='pathway');s.profileJourney.index=i;
 const required=requiredProfileQuestions(s).filter(q=>q.kind==='pathway'),m=profileMomentum(s);assert.equal(m.total,required.length);assert.equal(m.done,required.filter(q=>questionAnswered(s,q)).length);assert.equal(m.boost,null);
 for(const n of [6,15,30,45,60,96,108]){s.profileJourney.index=n;assert.equal(profileMomentum(s).boost,null);}
});
test('Back and repeated renders do not replay a milestone animation; a fresh draft starts its own sequence',()=>{
 const motion=createMomentumMotion(),s=interests(30),m=profileMomentum(s);assert.equal(motion(s,m).animateBoost,true);assert.equal(motion(s,m).animateBoost,false);
 motion(s,{kind:'interest',percent:55,boost:null});assert.equal(motion(s,m).animateBoost,false);
 assert.equal(motion(interests(30),m).animateBoost,true);
});
test('encouragement follows the choices, with accessible part progress and no additional navigation',()=>{
 const html=profileJourneyPage('journey/profile',interests(30));assert.ok(html.indexOf('profile-answer-grid')<html.indexOf('data-profile-boost'));
 assert.match(html,/role="progressbar"[^>]*aria-label="Interests progress"[^>]*aria-valuemax="60"[^>]*aria-valuenow="30"/);
 assert.equal((html.match(/data-action="journey-answer"/g)||[]).length,5);assert.equal((html.match(/data-action="journey-instructions"/g)||[]).length,1);assert.doesNotMatch(html,/Continue|data-action="journey-profile-next"/);
});
