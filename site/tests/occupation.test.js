import test from 'node:test';
import assert from 'node:assert/strict';
import {occupations,occupationById,getCareerFacts,workActivityOptions,settingOptions,directoryOccupations} from '../dist/occupation-data.js';
import {occupationCatalogPage,occupationPage,careerComparisonPage} from '../dist/occupation-ui.js';

test('reviewed occupation records preserve stable identity, sourced work, and preparation groups',()=>{
 assert.equal(occupations.length,117);
 assert.equal(new Set(occupations.map(o=>o.id)).size,117);
 assert.equal(new Set(occupations.map(o=>o.soc)).size,117);
 assert.deepEqual(new Set(occupations.map(o=>o.preparation.zoneGroup).filter(Boolean)),new Set(['1–2','3','4','5']));
 for(const o of occupations){
  assert.ok(o.sources.length,`${o.id} sources`);assert.ok(o.preparation.checkedAt,`${o.id} preparation date`);
  assert.equal(o.tasks.every(t=>t.id&&t.text&&t.source),true,`${o.id} task source`);
  if(o.context?.items?.length)assert.ok(o.context.items.some(x=>x.name==='Work Schedules'),`${o.id} context distributions`);
 }
 assert.ok(occupations.filter(o=>o.context?.items?.length).length>=60);
 assert.ok(occupations.filter(o=>o.preparation.educationDistribution.length).length>=60);
 assert.ok(occupations.filter(o=>o.preparation.relatedExperience.length||o.preparation.onTheJobTraining.length).length>=60);
});

test('the three mental health careers are distinct, sourced records with supported search paths',()=>{
 const aide=occupationById('psychiatric-aide'),tech=occupationById('psychiatric-technician'),psych=occupationById('clinical-psychologist');
 assert.equal(aide.soc,'31-1133.00');assert.equal(tech.soc,'29-2053.00');assert.equal(psych.soc,'19-3033.00');
 assert.notEqual(aide.summary,tech.summary);assert.notEqual(tech.summary,psych.summary);
 assert.ok(aide.tasks.length&&tech.tasks.length&&psych.tasks.length);
 assert.ok(aide.aliases.some(x=>x.toLowerCase()==='mental health worker'));
 assert.notDeepEqual(aide.knowledge,tech.knowledge);assert.notDeepEqual(tech.skills,psych.skills);
 const page=occupationCatalogPage({type:'occupations',search:'help people with mental health'});
 for(const x of [aide,tech,psych])assert.ok(page.includes(`#/career/${x.id}`),x.id);
 assert.match(page,/Curated search match|Also called/);
});

test('official directory distinguishes reviewed local records from external-only profiles',()=>{
 assert.equal(directoryOccupations.length,923);
 assert.equal(new Set(directoryOccupations.map(o=>o.soc)).size,923);
 assert.ok(directoryOccupations.every(o=>o.sourceURL.includes('/profile/summary/')));
 const reviewed=new Set(occupations.map(o=>o.soc)), external=directoryOccupations.find(o=>!reviewed.has(o.soc));
 const page=occupationCatalogPage({type:'occupations',coverage:'directory',search:external.title});
 assert.match(page,/OFFICIAL EXTERNAL PROFILE/);assert.match(page,/not reviewed local education, cost, licensing/);
 const local=occupationCatalogPage({type:'occupations',coverage:'directory',search:'Psychiatric Aides'});
 assert.match(local,/FIELDGUIDE REVIEWED/);assert.match(local,/#\/career\/psychiatric-aide/);
});

test('career details preserve unknown local facts and embed finance sections under one heading',()=>{
 const aide=getCareerFacts('psychiatric-aide');assert.equal(aide.finance,null);assert.match(aide.requirements.summary,/supervised patient care/);assert.ok(aide.requirements.sourceURLs.length>=2);
 const page=occupationPage('psychiatric-aide');assert.match(page,/Local facts have not been reviewed/);
 assert.match(page,/Work Schedules/);assert.match(page,/Education reported by workers/);assert.match(page,/sampled worker|not an entry requirement|not an entry requirement/i);
 assert.match(page,/#\/career-reflection\/psychiatric-aide/);assert.match(page,/Add experiment to my plan/);
 const finance=occupationPage('software');
 assert.equal((finance.match(/<h1\b/g)||[]).length,1,'embedded finance detail must not add a second page heading');
 assert.match(finance,/Representative tasks/);assert.match(finance,/EDUCATION & TRAINING/);assert.match(finance,/AUSTIN|Austin/);
 const tattoo=occupationPage('tattoo');assert.match(tattoo,/broader O\*NET occupation Artists/);assert.match(tattoo,/no occupation-level record for tattoo-specific work context/);
});

test('context response categories marked Recommend Suppress are not presented as complete distributions',()=>{
 const technician=occupationById('psychiatric-technician');
 const pressure=technician.context.items.find(x=>x.name==='Time Pressure');
 const unpleasant=technician.context.items.find(x=>x.name==='Dealing With Unpleasant, Angry, or Discourteous People');
 assert.equal(pressure.distributionStatus,'partial_recommended_suppression');
 assert.equal(pressure.suppressedCategoryCount,3);
 assert.deepEqual(pressure.responses.map(x=>x.category),['2','4']);
 assert.ok(pressure.responses.reduce((sum,x)=>sum+x.percent,0)<10);
 assert.equal(unpleasant.suppressedCategoryCount,2);
 assert.ok(!technician.settings.includes('outdoors'));
 assert.equal(technician.settingEvidence.status.outdoors,'not_derived_recommended_suppression');
 const page=occupationPage('psychiatric-technician');
 assert.match(page,/these displayed shares are partial, not a complete or ranked distribution/);
 assert.match(page,/outdoor setting exposure was not inferred/);
 const compare=careerComparisonPage({exploration:{compareCareers:['psychiatric-technician']}});
 assert.match(compare,/partial, O\*NET marks 3 categories Recommend Suppress/);
 assert.match(compare,/n=21, 08\/2023/);
});

test('comparison retains source populations, contexts, preparation, saved questions, and no winner',()=>{
 const compare=careerComparisonPage({exploration:{compareCareers:['software','psychiatric-aide','clinical-psychologist'],careerQuestions:{'psychiatric-aide':'What shifts are common?'}}});
 assert.match(compare,/No overall rating/);assert.match(compare,/Not available/);
 assert.match(compare,/Work Schedules/);assert.match(compare,/Education reported by workers/);
 assert.match(compare,/sampled|n=/i);assert.match(compare,/May 2025/);assert.match(compare,/Austin metro employees/);
 assert.match(compare,/Remove from comparison/);assert.match(compare,/What shifts are common\?/);
 assert.match(compare,/O\*NET 31\.0/);assert.match(compare,/href="https:\/\/www\.mynextmove\.org\/profile\/summary/);
});

test('facets are limited to sourced values and active selections are visible',()=>{
 assert.ok(workActivityOptions.some(x=>x.id==='helping'));
 assert.ok(settingOptions.some(x=>x.id==='indoors'&&x.label.includes('40% threshold')));
 const page=occupationCatalogPage({type:'occupations',activity:'helping',setting:'indoors',level:'4'});
 assert.match(page,/Active filters/);assert.match(page,/Activity: Helping/);assert.match(page,/Indoor exposure reported/);assert.match(page,/Preparation: Job Zone 4/);
});
