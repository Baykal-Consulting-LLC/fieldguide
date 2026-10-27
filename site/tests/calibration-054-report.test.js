import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {calibration054Rows,calibration054Case} from '../dist/calibration-054-ui.js';
const read=p=>JSON.parse(fs.readFileSync(p)),data=read('validation/calibration-054.json'),source=read('validation/explorer-053.json');
test('expanded audit covers all160 non-fresh base profiles, all307 Top claims twice and all1920 discovery entries',()=>{
 assert.equal(data.rows.length,184);assert.equal(data.summary.reviewed,160);assert.equal(data.summary.topClaims,307);
 const rows=data.rows.filter(r=>r.reviewed);assert.ok(rows.every(r=>!['holdout049','diagnostic049'].includes(r.phase)));
 assert.equal(rows.reduce((n,r)=>n+r.discovery.length,0),1920);
 for(const r of rows){for(const p of r.top){assert.equal(p.first.id,p.id);assert.equal(p.second.id,p.id);assert.ok(p.verdict);if(p.reviewerDisagreement)assert.ok(p.adjudication);assert.ok(p.questions.length);}assert.ok(r.discovery.every(p=>p.judgment));}
 assert.equal(rows.flatMap(r=>r.top).filter(p=>p.reviewerDisagreement).length,data.summary.agreement.disagree);
});
test('calibration review preserves original current engine lists and never changes a synthetic answer',()=>{
 for(const r of data.rows)assert.deepEqual(r.top.map(p=>p.id),source.rows.find(x=>x.id===r.id).top.map(p=>p.id));
 for(const [file,hash] of Object.entries(data.hashes))assert.equal(createHash('sha256').update(fs.readFileSync(file)).digest('hex'),hash,file);
 const runtime=read('research/explorer-053-runtime-freeze.json');for(const[file,hash]of Object.entries(runtime.rules))assert.equal(createHash('sha256').update(fs.readFileSync(file)).digest('hex'),hash,file);
 assert.ok(!JSON.stringify(data).includes('@gmail.com'));
});
test('fresh holdout stays qualitatively sealed and diagnostics remain paired controls, outside review counts',()=>{
 const fresh=data.rows.filter(r=>r.phase==='holdout049');assert.equal(fresh.length,12);
 for(const r of fresh){assert.equal(r.reviewed,false);assert.equal(r.noTop,null);assert.equal(r.summary,null);assert.deepEqual(r.missingDirections,[]);assert.ok(r.top.every(p=>p.verdict===null));}
 assert.equal(calibration054Rows(data).length,172);assert.equal(calibration054Rows(data,{cohort:'all'}).length,184);
 assert.equal(data.sensitivity.pairs.length,12);assert.ok(data.sensitivity.pairs.every(p=>p.interestUnchanged));
});
test('noTop triage distinguishes missing exploration from reasonable uncertainty without inventing a match',()=>{
 const rows=calibration054Rows(data,{issue:'no-top'});assert.equal(rows.length,19);
 assert.equal(rows.filter(r=>r.noTop).length,18);assert.ok(rows.every(r=>r.top.length===0));
 const counts=rows.filter(r=>r.noTop).reduce((a,r)=>(a[r.noTop.status]=(a[r.noTop.status]||0)+1,a),{});
 assert.deepEqual(counts,{'exploration-gap':6,mixed:7,'reasonable-uncertainty':5});
});
test('degree and uncertainty filters refer to the same claim, with cohort denominators kept intact',()=>{
 const rs=calibration054Rows(data,{issue:'clarify',education:'degree'});
 assert.ok(rs.length);assert.ok(rs.every(r=>r.top.some(p=>p.degree&&p.verdict==='needs-clarification')));
 assert.equal(data.summary.degreeNeedsClarification,64);assert.equal(data.summary.majority['needs-clarification'],82);
 const r=data.rows.find(r=>r.id==='life-038'),html=calibration054Case(r,{open:true});assert.match(html,/repeatable/);assert.match(html,/Next question/);assert.match(html,/No current Top/);
 assert.equal(calibration054Rows(data,{query:'life-038'}).length,1);
 const escaped=calibration054Case({...r,name:'<script>bad</script>'});assert.ok(!escaped.includes('<script>'));assert.match(escaped,/&lt;script&gt;/);
});
test('external comparison reports actual limited commercial sessions and uncertainty, not fabricated equivalence',()=>{
 assert.equal(data.external.cases.length,2);for(const c of data.external.cases){assert.equal(c.responses,94);assert.ok(c.neutralProxyCount>40);assert.ok(c.careers.length>10);assert.match(c.url,/www\.truity\.com/);}
 assert.equal(data.inventory.length,13);assert.ok(data.inventory.every(o=>!o.existing457Scope.exactSOCpresent&&o.sourceUrl&&o.neutralFollowup));
 assert.equal(data.inventory.filter(o=>o.decision==='add-discovery-content').length,7);
 assert.ok(data.remaining.some(x=>/counselor/.test(x.task)&&/not executed/.test(x.status)));
});
