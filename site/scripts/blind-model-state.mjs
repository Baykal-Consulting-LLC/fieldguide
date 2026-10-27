import assert from 'node:assert/strict';
import {priorities} from '../dist/content.js';
import {lifestyleChoices} from '../dist/lifestyle-builder.js';
import {freshState} from '../dist/model.js';import {onetQuestions} from '../dist/onet-assessment.js';
import {profileQuestions,skillResponseOptions,saveProfileAnswer,profileComplete} from '../dist/profile-journey.js';
import {professionQuestions} from '../dist/profession-questions.js';import {careerFamilies} from '../dist/guide-state.js';
import {buildLifestyleInputs,builderReady} from '../dist/lifestyle-builder.js';
export function validateResponse(r){
 assert.equal(r.official.length,60,r.id);assert.ok(r.official.every(v=>Number.isInteger(v)&&v>=1&&v<=5),r.id);
 assert.equal(r.fields.length,36,r.id);assert.ok(r.fields.every(v=>Number.isInteger(v)&&v>=1&&v<=5),r.id);
 assert.equal(r.experience.length,12,r.id);assert.ok(r.experience.every(v=>skillResponseOptions.some(o=>o.id===v)),r.id);
 assert.ok(careerFamilies.some(f=>f.id===r.selectedFamily),r.id);assert.ok(Array.isArray(r.priorities)&&r.priorities.length<=3,r.id);assert.ok(r.priorities.every(id=>priorities.some(p=>p.id===id)));assert.equal(new Set(r.priorities).size,r.priorities.length);
 for(const q of profileQuestions.filter(q=>q.kind==='context')){const v=r.context[q.id];assert.ok(q.multi?Array.isArray(v)&&v.every(id=>q.options.some(o=>o[0]===id)):q.options.some(o=>o[0]===v),r.id+' context '+q.id);}
 assert.ok(['rent','own'].includes(r.lifestyle.homeMode));for(const q of lifestyleChoices)assert.ok(Number.isInteger(r.lifestyle.choices[q.id])&&r.lifestyle.choices[q.id]>=0&&r.lifestyle.choices[q.id]<5,r.id+' lifestyle '+q.id);
 const covered=r.responseRationales.flatMap(x=>x.items).filter(id=>id.startsWith('onet-sf-'));assert.equal(covered.length,60,r.id+' official evidence groups');assert.equal(new Set(covered).size,60,r.id+' duplicate official evidence');
 for(const q of onetQuestions)assert.ok(covered.includes(q.id),r.id+' '+q.id);
 for(const q of professionQuestions[r.selectedFamily]){assert.ok(Array.isArray(r.depth[q.id]),r.id+' '+q.id);assert.ok(r.depth[q.id].every(id=>q.options.some(o=>o.id===id)),r.id+' '+q.id);}
 return true;
}
export function blindModelState(bio,r){
 validateResponse(r);const s=freshState(),j=s.profileJourney;s.profile.nickname=bio.name;s.profile.grade='11';j.started=true;j.introSeen=true;j.followupIntroSeen=true;
 for(const [i,q]of onetQuestions.entries())assert.ok(saveProfileAnswer(s,{...q,kind:'interest'},r.official[i]));
 for(const [i,q]of profileQuestions.filter(q=>q.kind==='pathway').entries())assert.ok(saveProfileAnswer(s,q,r.fields[i]));
 for(const [i,q]of profileQuestions.filter(q=>q.kind==='skill').entries())assert.ok(saveProfileAnswer(s,q,r.experience[i]));
 s.priorities=[...r.priorities];j.answers.values=true;
 for(const q of profileQuestions.filter(q=>q.kind==='context')){const value=r.context[q.id];if(q.multi){assert.ok(Array.isArray(value));assert.ok(value.every(v=>q.options.some(o=>o[0]===v)));j.answers[q.id]=[...value];}else assert.ok(saveProfileAnswer(s,q,value),r.id+' '+q.id);}
 j.family=r.selectedFamily;j.families=[r.selectedFamily];j.depth[r.selectedFamily]=structuredClone(r.depth);j.professionIntrosSeen=[r.selectedFamily];
 s.guide.lifestyleBuilder={...s.guide.lifestyleBuilder,...structuredClone(r.lifestyle),complete:true};assert.ok(builderReady(s.guide.lifestyleBuilder));s.finance.lifestyle=buildLifestyleInputs(s.guide.lifestyleBuilder,s.finance.lifestyle);s.guide.entry='assessment';s.guide.lifestylePreset='custom';assert.ok(profileComplete(s));return s;
}
