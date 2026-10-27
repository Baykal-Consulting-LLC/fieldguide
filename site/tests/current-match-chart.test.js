import{readChartJSON}from'../scripts/read-match-chart.mjs';
import {gunzipSync} from 'node:zlib';
import test from'node:test';import assert from'node:assert/strict';import fs from'node:fs';
import{currentOffers,filterCurrentRows,currentOutcome,currentCSV}from'../dist/current-match-chart.js';
import{educationRoutesFor}from'../dist/education-routes.js';
import{explorerCatalog,explorerDegree,explorerEducation}from'../dist/open-explorer.js';
const historical=JSON.parse(fs.readFileSync('dist/developer/explorer-053-data.json'));
const data=historical.historical?JSON.parse(gunzipSync(fs.readFileSync('dist/developer/explorer-053-data.json.gz'))):historical,reviews=new Map(readChartJSON('dist/developer/calibration-054-data.json').rows.map(r=>[r.id,r])),catalog=new Map(explorerCatalog.map(o=>[o.id,{degree:explorerDegree(o),education:explorerEducation(o)==='Graduate / professional'?'graduate':explorerDegree(o)?'college':'other',routes:educationRoutesFor(o).map(r=>r.key)}]));
test('main chart uses the exact current supported Top and capped discovery window for every public model',()=>{
 const before=JSON.stringify(data);for(const row of data.rows){const offers=currentOffers(row,{},catalog);assert.deepEqual(offers.top,row.top);assert.deepEqual(offers.other,row.first12.filter(p=>!row.top.some(t=>t.id===p.id)));assert.deepEqual(offers.sustaining,row.first12.filter(p=>p.supported&&p.budget.covers===true));assert.ok(offers.top.length<=3);assert.ok(offers.top.every(p=>p.supported&&!p.contrary.length));assert.equal(new Set([...offers.top,...offers.other].map(p=>p.id)).size,row.first12.length);}
 assert.equal(JSON.stringify(data),before);assert.deepEqual(data.rows.find(r=>r.id==='life-025').top.map(p=>p.id),['mechanical-engineering']);assert.equal(data.rows.find(r=>r.id==='life-038').top.length,0);
});
test('education and field filters narrow existing offers without promoting a lower ranked career',()=>{
 for(const education of['degree','college','graduate'])for(const row of data.rows){const picked=currentOffers(row,{education},catalog);for(const p of [...picked.top,...picked.other,...picked.sustaining]){assert.ok(catalog.get(p.id).routes.some(k=>['college','graduate'].includes(k)));if(education!=='degree')assert.ok(catalog.get(p.id).routes.includes(education));}assert.ok(picked.top.every(p=>row.top.some(t=>t.id===p.id)));}
 for(const f of data.rows[0].fieldCounts){const rows=filterCurrentRows(data.rows,{field:f.id},catalog,reviews);assert.ok(rows.length);for(const row of rows)assert.ok([...row.offers.top,...row.offers.other].every(p=>p.fields.includes(f.id)));}
});
test('holdouts retain separate cohorts, diagnostic variants are opt-in, review flags do not demote Top',()=>{
 const base=filterCurrentRows(data.rows,{},catalog,reviews);assert.equal(base.length,172);assert.equal(filterCurrentRows(data.rows,{cohort:'all-rows'},catalog).length,184);assert.equal(filterCurrentRows(data.rows,{cohort:'holdout'},catalog).length,30);assert.equal(filterCurrentRows(data.rows,{cohort:'holdout049'},catalog).length,12);assert.equal(filterCurrentRows(data.rows,{cohort:'diagnostic049'},catalog).length,12);
 const flagged=filterCurrentRows(data.rows,{review:'clarification'},catalog,reviews);assert.ok(flagged.length);for(const row of flagged)assert.deepEqual(row.offers.top,row.top);
 assert.equal(base.filter(r=>r.offers.top.length).length,153);assert.equal(base.filter(r=>r.offers.top.some(p=>p.degree)).length,132);
});
test('lifestyle classification requires support as well as pay; missing pay remains unknown',()=>{
 const p={id:'x',title:'x',fields:['health'],degree:true,supported:false,budget:{covers:true}};let row={top:[],first12:[p]};assert.equal(currentOffers(row).sustaining.length,0);assert.equal(currentOutcome(currentOffers(row)),'not-assessed');row={top:[{...p,supported:true,budget:{covers:null}}],first12:[]};assert.equal(currentOutcome(currentOffers(row)),'not-assessed');row.top[0].budget.covers=false;assert.equal(currentOutcome(currentOffers(row)),'none-cover');row.top[0].budget.covers=true;assert.equal(currentOutcome(currentOffers(row)),'top-covers');
});
test('current CSV and fresh matrix retain current-only offers and no obsolete question disclosures',()=>{
 const csv=currentCSV(filterCurrentRows(data.rows,{query:'life-025'},catalog),reviews);assert.match(csv,/Mechanical engineers/);assert.match(csv,/"Original development","Mechanical engineers","Agricultural Engineers/);assert.doesNotMatch(csv,/Historical|Before core|Ask next|Question to resolve/i);
 // The old URL is now an explicit accumulated-answer archive; the current entry is the requested fresh fit matrix.
 const html=fs.readFileSync('dist/developer/student-matrix-104.html','utf8'),source=fs.readFileSync('dist/model-match-chart-controller.js','utf8');assert.match(html,/Student match matrix/);assert.equal((html.match(/<th>/g)||[]).length,6);assert.match(fs.readFileSync('dist/student-matrix-104.js','utf8'),/model-results-104/);assert.doesNotMatch(html+source,/Historical 0\.52|Before core checks|Question to resolve this offer|mountExplorer053Review|oldTop|followupBody/);assert.match(source,/loadCurrentCohort/);assert.doesNotMatch(source,/fetch\('\.\/model-match-chart-data.json/);assert.match(source,/detail-content'\)\.replaceChildren/);assert.doesNotMatch(source,/localStorage|setDoc|saveGuide/);assert.ok(data.rows.every(r=>r.phase!=='private'&&!r.id.startsWith('private-')));
});
