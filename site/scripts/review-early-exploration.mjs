import fs from 'node:fs';import {createHash} from 'node:crypto';import assert from 'node:assert/strict';
import {freshState} from '../dist/model.js';import {onetQuestions} from '../dist/onet-assessment.js';import {pathwayProfileQuestions} from '../dist/pathway-profile-bank.js';
import {careerCheckSpec,updateCareerCheck,finishCareerCheckQuestion} from '../dist/career-check-questions.js';import {careerComparisonOptions} from '../dist/career-comparisons.js';import {careerCheckReadiness} from '../dist/career-check-readiness.js';import {directMatchCandidates} from '../dist/direct-match-candidates.js';import {planMatchCandidates} from '../dist/plan-matches.js';import {journeyInterestPicture} from '../dist/profile-journey.js';
const source=fs.readFileSync('research/early-exploration-040/cases.json'),sha=createHash('sha256').update(source).digest('hex');
assert.equal(sha,'d78d41030494e06149e6715d3f75140314cf4ddc08bb95e5aa822c5cfa3f4ba0');
const fixture=JSON.parse(source),rows=[];
for(const c of fixture.cases){
 const s=freshState();s.profile.nickname=c.name;const j=s.profileJourney;j.started=true;j.family=c.family;j.families=[c.family];j.answers.education=['college','training'];
 for(const q of onetQuestions)j.officialInterest.answers[q.id]=c.themes[q.theme];
 for(const q of pathwayProfileQuestions)j.fieldPreferences[q.id]=c.fields[q.family]??2;
 const before={scores:journeyInterestPicture(s).raw,offers:planMatchCandidates(s).top.map(r=>r.id),invitations:careerComparisonOptions(s).rows.slice(0,3).map(r=>r.id)};
 for(const [careerId,answers] of Object.entries(c.checks)){const spec=careerCheckSpec(careerId);for(const q of spec.questions){assert.ok(q.id in answers);const value=answers[q.id];assert.ok(updateCareerCheck(s,{careerId,questionId:q.id,...(['unfamiliar','not-interested'].includes(value)?{feedback:value}:{optionId:value})}));finishCareerCheckQuestion(s,careerId,q.id);}}
 const supported=directMatchCandidates(s).map(r=>r.id),top=planMatchCandidates(s).top.map(r=>r.id),scoresUnchanged=JSON.stringify(before.scores)===JSON.stringify(journeyInterestPicture(s).raw),checks={scoresUnchanged,expectedWorkSupported:supported.includes(c.shouldSupport),unsupportedWorkNotPromoted:!c.shouldNotSupport||!supported.includes(c.shouldNotSupport)};
 rows.push({...c,before,after:{supported,top,explanations:Object.keys(c.checks).map(id=>({id,...careerCheckReadiness(s,id)}))},checks,passes:Object.values(checks).every(Boolean)});
}
fs.writeFileSync('validation/early-exploration-040.json',JSON.stringify({version:'0.40.0',generatedAt:new Date().toISOString(),fixtureSHA256:sha,classification:fixture.scope,scenarios:rows.length,passed:rows.filter(r=>r.passes).length,rows},null,2)+'\n');
console.log(rows.map(r=>({id:r.id,supported:r.after.supported,top:r.after.top,checks:r.checks})));
