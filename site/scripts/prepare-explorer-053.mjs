import fs from 'node:fs';import{createHash}from'node:crypto';import assert from'node:assert/strict';
import{occupations}from'../dist/occupation-data.js';import{expandedOccupations}from'../dist/expanded-occupation-data.js';
const bytes=fs.readFileSync('research/explorer-053-field-review.json'),hash=createHash('sha256').update(bytes).digest('hex');assert.equal(hash,'51d65ad8e6343cf4fcfb6f90f062c28b7014feaae36b5170c55efac8216d27f2');
const m=JSON.parse(bytes);assert.deepEqual(m.entries.map(x=>x.id).sort(),[...occupations,...expandedOccupations].map(x=>x.id).sort());
fs.writeFileSync('dist/explorer-053-membership-data.js','// Reviewed scope, frozen before outcome evaluation.\nexport const explorerMembership='+JSON.stringify(Object.fromEntries(m.entries.map(e=>[e.id,{fields:e.fields,reason:e.reason,ambiguous:e.ambiguous||false}])) )+';\n');
const facets=JSON.parse(fs.readFileSync('research/explorer-053-facet-review.json')).facets;
assert.equal(facets.length,12);assert.equal(facets.flatMap(f=>f.questions).length,24);
fs.writeFileSync('dist/explorer-053-questions.js','// Original exploratory reflections. These never change official interest scores or confirm a profession.\nexport const explorerFacets='+JSON.stringify(facets.map(f=>({id:f.id,title:f.title,questions:f.questions.map(q=>({...q,id:'explore053-'+q.id})),specificInterests:f.specificInterests})))+';\nexport const explorerQuestions=[0,1].flatMap(i=>explorerFacets.map(f=>({...f.questions[i],facet:f.id,facetTitle:f.title})));\n');
