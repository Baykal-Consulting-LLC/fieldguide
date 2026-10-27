import fs from 'node:fs';
import assert from 'node:assert/strict';
import {modelMatchAudit,auditCounts} from '../dist/model-match-audit.js';
import {professionSuggestions,journeyInterestPicture} from '../dist/profile-journey.js';
import {careerCheckSpec,updateCareerCheck,finishCareerCheckQuestion} from '../dist/career-check-questions.js';
import {educationRoutesFor} from '../dist/education-routes.js';
import {occupationById} from '../dist/occupation-data.js';
const baseline=JSON.parse(fs.readFileSync('research/broader-professions-039/baseline.json')),{version}=JSON.parse(fs.readFileSync('package.json')),rows=[],changes=[];
let pendingDegreeForNondegreeTop=0;
const degree=id=>educationRoutesFor(occupationById(id)).some(x=>['college','graduate'].includes(x.key));
for(const old of baseline.rows){
 const c=JSON.parse(fs.readFileSync('validation/blind-2026-10-18/'+old.id+'.json')),before=JSON.stringify(c),r=modelMatchAudit(c);
 assert.equal(JSON.stringify(c),before);assert.deepEqual(journeyInterestPicture(c.experimentState).raw,c.results.rawScores);assert.deepEqual(professionSuggestions(c.experimentState).top.map(r=>r.o.id),c.results.professions.map(r=>r.id));
 assert.ok(r.top.length<=3);const top=r.top.map(r=>r.id);if(JSON.stringify(top)!==JSON.stringify(old.top))changes.push({id:r.id,before:old.top,after:top});
 if(top.length&&!top.some(degree)&&r.explorations.some(x=>degree(x.id)))pendingDegreeForNondegreeTop++;
 rows.push(r);
}
const hypotheticals=[];
for(const [id,career]of [['gap-021','human-resources'],['gap-014','accounting'],['legacy-014','electrical-engineering']]){
 const c=JSON.parse(fs.readFileSync('validation/blind-2026-10-18/'+id+'.json')),s=structuredClone(c.experimentState),before=modelMatchAudit(c),spec=careerCheckSpec(career),selected=[];
 for(const q of spec.questions){const opt=q.options.find(o=>o.careerIds.includes(career));assert.ok(opt);if(!s.profileJourney.depth?.[spec.family]?.[q.id]?.includes(opt.id))updateCareerCheck(s,{careerId:career,questionId:q.id,optionId:opt.id});finishCareerCheckQuestion(s,career,q.id);selected.push({questionId:q.id,optionId:opt.id});}
 const after=modelMatchAudit({...c,experimentState:s});assert.ok(after.top.some(x=>x.id===career));assert.deepEqual(after.scores,before.scores);assert.equal(s.profileJourney.family,c.experimentState.profileJourney.family);
 hypotheticals.push({id,career,classification:'Hypothetical additional work answers in an isolated copy; not authored model behavior.',selected,beforeTop:before.top.map(r=>r.id),afterTop:after.top.map(r=>r.id),officialScoresUnchanged:true,firstFieldUnchanged:true});
}
const counts=auditCounts(rows),report={version,generatedAt:new Date().toISOString(),scope:'148 frozen public fictional profiles; current presentation replay. Six owner-only profiles remain excluded from static data.',baselineSourceCommit:baseline.sourceCommit,originalCounts:baseline.counts,counts,answersUnchanged:true,sixScoresUnchanged:true,originalEngineMatchesUnchanged:true,publicModels:rows.length,privateCasesBundled:0,modelsWithDegreeTop:rows.filter(r=>r.top.some(t=>degree(t.id))).length,modelsWithPendingComparisons:rows.filter(r=>r.explorations.length).length,pendingDegreeForNondegreeTop,topListsChanged:changes.length,changes,hypotheticals,limitations:['Reused fictional models are regression examples, not independent holdout validation of these rules.','No unanswered comparison is promoted to a Top match or counted as a lifestyle option.','Short comparisons reuse four existing task questions and any relevant route question. Original task/profile and clinical gates still apply.','Task support is compared by answered-question coverage across different question counts; education and first-paid-stage pay order only close evidence groups.','Related work experience is required before some professional roles; that pay does not receive an entry-level financial ranking preference.']};
fs.writeFileSync('validation/broader-professions-039.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify({counts,topChanges:changes.length,degreeTop:report.modelsWithDegreeTop,pending:report.modelsWithPendingComparisons,pendingDegreeForNondegreeTop,hypotheticalChecks:hypotheticals.length}));
