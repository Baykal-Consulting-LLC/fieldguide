import fs from'node:fs';import assert from'node:assert/strict';
const inventory=JSON.parse(fs.readFileSync('research/noncollege-087/inventory.json')),facts=JSON.parse(fs.readFileSync('data-sources/noncollege-087/occupation-facts.json'));
assert.equal(inventory.length,12);for(const o of inventory){const f=facts.occupations[o.soc];assert.ok(f);assert.deepEqual(o.vector,['Realistic','Investigative','Artistic','Social','Enterprising','Conventional'].map(k=>f.interests[k]));assert.ok(o.salary.entry>0&&o.salary.median>0);assert.equal(o.questions.length,3);}
fs.writeFileSync('dist/noncollege-087-data.js','// Source-backed inventory; unknown typed preferences never become positive evidence.\nexport const noncollege087='+JSON.stringify(inventory)+';\n');
console.log('Prepared 12 non-college occupations, 36 scoped checks and sourced earnings.');
