import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const root='research/coverage-050/',read=f=>JSON.parse(fs.readFileSync(f)),sha=f=>createHash('sha256').update(fs.readFileSync(f)).digest('hex');
const map=read(root+'answer-map.json'),byToken=new Map(map.map(a=>[a.token,a])),rows={},seen=new Set();
for(const phase of['development','holdout']){
 const file=root+phase+'-answers.json';if(!fs.existsSync(file)){if(process.argv.includes('--allow-partial'))continue;throw Error('Missing frozen '+phase+' reflection answers');}
 const data=read(file),packet=read(root+'blind-'+phase+'-input.json'),expected=new Set(packet.profiles.flatMap(p=>p.questions.map(q=>q.token)));
 for(const p of data.profiles){const original=packet.profiles.find(x=>x.token===p.token);assert.ok(original,'Unknown anonymous profile');for(const a of p.answers){assert.ok(expected.has(a.token));assert.ok(!seen.has(a.token));assert.ok(original.questions.some(q=>q.token===a.token));seen.add(a.token);assert.ok(['yes','no','unsure','unfamiliar'].includes(a.response));assert.ok(['low','medium','high'].includes(a.confidence));assert.ok(a.evidence?.trim());assert.ok(Array.isArray(a.biographyPaths));if(a.response==='yes')assert.equal(a.constructSupport,'direct','Plausible transfer cannot establish a new interest');const m=byToken.get(a.token);rows[m.modelId]??={version:'0.50.0',phase:m.phase,answers:[]};rows[m.modelId].answers.push({...a,...m});}}
 assert.ok([...expected].every(token=>seen.has(token)),'Missing reflection response');
}
if(fs.existsSync(root+'answer-freeze.json')){const frozen=read(root+'answer-freeze.json');for(const phase of['development','holdout'])assert.equal(sha(root+phase+'-answers.json'),frozen[phase+'SHA256'],'Frozen '+phase+' reflections changed');}
// Paired diagnostic controls reuse the exact parent's reflection; they are not new observations.
for(const c of read('validation/cohort-049/index.json').cases){if(c.phase!=='diagnostic049')continue;const source=read('validation/cohort-049/'+c.id+'.json'),parent=rows[source.cohort049.baseId];if(parent)rows[c.id]={...structuredClone(parent),phase:'diagnostic049',inheritedFrom:source.cohort049.baseId};}
const examples=read(root+'exploration-copy.json'),freeze=read(root+'question-freeze.json');assert.equal(sha(root+'exploration-copy.json'),freeze.copySHA256);assert.equal(sha(root+'invitations.json'),freeze.selectionSHA256);
fs.writeFileSync('dist/exploration-examples.js','// Frozen neutral examples, authored without biographies or matching results.\nexport const explorationExamples='+JSON.stringify(Object.fromEntries(examples.questions.map(q=>[q.id,q])))+';\n');
fs.writeFileSync('dist/coverage-050-responses.js','// Public fictional profile simulations; original histories remain unchanged.\nexport const coverage050Responses='+JSON.stringify(rows)+';\n');
if(seen.size===map.length&&!fs.existsSync(root+'answer-freeze.json'))fs.writeFileSync(root+'answer-freeze.json',JSON.stringify({frozenAt:new Date().toISOString(),responses:map.length,models:Object.values(rows).filter(r=>r.phase!=='diagnostic049').length,developmentSHA256:sha(root+'development-answers.json'),holdoutSHA256:sha(root+'holdout-answers.json'),questionFreezeSHA256:sha(root+'question-freeze.json'),rulesFreezeSHA256:sha(root+'rule-freeze.json'),rawAnswersPreserved:true,diagnosticResponses:'Copied exactly from parent, excluded from independent model totals'},null,2)+'\n');
console.log(JSON.stringify({reflections:seen.size,models:Object.keys(rows).length,complete:seen.size===map.length}));
