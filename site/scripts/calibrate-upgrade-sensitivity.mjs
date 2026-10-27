import fs from 'node:fs';import assert from 'node:assert/strict';
import {expandedStoryState} from './calibrate-expanded-students.mjs';
import {storyState} from './calibrate-student-stories.mjs';
import {studentStories} from '../calibration/student-stories.js';
import {expandedStudentStories} from '../calibration/expanded-students.js';
import {onetQuestions} from '../dist/onet-assessment.js';
import {broadSuggestions,professionSuggestions,journeyInterestPicture} from '../dist/profile-journey.js';
import {salaryAtStage} from '../dist/salary-progression.js';
const cases=[...studentStories.map(spec=>({spec,original:true})),...expandedStudentStories.map(spec=>({spec,original:false}))];
const report={release:'0.31.0',engine:'3.3.0',generatedAt:new Date().toISOString(),scope:'One-step answer changes around 54 authored fictional student narratives. This tests local software sensitivity, not representative student outcomes or predictive validity.',students:[],perturbations:0,pathwayChanges:0,careerChanges:0,lossOfAllPathways:[],invariantFailures:[]};
for(const {spec,original} of cases){const s=original?storyState(spec):expandedStoryState(spec),base=journeyInterestPicture(s),fields=broadSuggestions(s).fields.map(f=>f.id),roles=professionSuggestions(s).top.map(r=>r.o.id),beforePay=salaryAtStage('physician'),row={id:spec.id,changes:0,perturbations:0,maxRawDelta:0};
 for(const q of onetQuestions){const value=s.profileJourney.officialInterest.answers[q.id];for(const delta of [-1,1]){const next=value+delta;if(next<1||next>5)continue;s.profileJourney.officialInterest.answers[q.id]=next;const profile=journeyInterestPicture(s),b=broadSuggestions(s).fields.map(f=>f.id),r=professionSuggestions(s).top.map(x=>x.o.id);report.perturbations++;row.perturbations++;const rawDelta=profile.raw.reduce((n,v,i)=>n+Math.abs(v-base.raw[i]),0);row.maxRawDelta=Math.max(row.maxRawDelta,rawDelta);assert.equal(rawDelta,1);if(JSON.stringify(b)!==JSON.stringify(fields)){report.pathwayChanges++;row.changes++;if(fields.length&&!b.length)report.lossOfAllPathways.push({student:spec.id,question:q.id,from:value,to:next});}if(JSON.stringify(r)!==JSON.stringify(roles))report.careerChanges++;assert.equal(salaryAtStage('physician'),beforePay);s.profileJourney.officialInterest.answers[q.id]=value;}}
 assert.deepEqual(journeyInterestPicture(s).raw,base.raw);report.students.push(row);
}
fs.writeFileSync('validation/upgrade-sensitivity-2026-10-17.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({students:report.students.length,perturbations:report.perturbations,pathwayChanges:report.pathwayChanges,careerChanges:report.careerChanges,lossOfAllPathways:report.lossOfAllPathways.length,failures:report.invariantFailures.length}));
