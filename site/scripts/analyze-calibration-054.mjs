import fs from 'node:fs';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {currentModelStates} from './current-model-states.mjs';
import {applyBroadFollowups052} from '../dist/broad-followups-052-replay.js';
import {applyExplorerReviews053} from '../dist/explorer-053-replay.js';
import {explorerResults} from '../dist/open-explorer.js';
import {onetQuestions,riasecOrder,scoreOnetInterest,profileCorrelation} from '../dist/onet-assessment.js';
const read=p=>JSON.parse(fs.readFileSync(p));
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const old=read('validation/explorer-053.json');
const frozen=read('research/explorer-053-runtime-freeze.json');
for(const [file,digest] of Object.entries(frozen.rules))assert.equal(hash(file),digest,'053 rules must remain fixed for calibration');
const signatures=new Map(),records=[];
const sameSet=(a,b)=>a.size===b.size&&[...a].every(x=>b.has(x));
const topSet=rows=>{const sorted=[...rows].sort((a,b)=>b.r-a.r||a.id.localeCompare(b.id));const cut=sorted[Math.min(11,sorted.length-1)]?.r;return new Set(sorted.filter(x=>x.r>=cut-1e-12).map(x=>x.id));};
for(const {c,state} of currentModelStates()){
  const s=applyExplorerReviews053(applyBroadFollowups052(state,c.id),c.id),before=JSON.stringify(s);
  const result=explorerResults(s),original=old.rows.find(r=>r.id===c.id);
  assert.deepEqual(result.rows.filter(x=>x.specific.supported).slice(0,3).map(x=>x.id),original.top.map(x=>x.id));
  const signature=rows=>rows.map(x=>[x.id,x.r,x.specific.supported]);
  const baseline=signature(result.rows);signatures.set(c.id,baseline);
  const changed=structuredClone(s);
  changed.profile={nickname:'Synthetic invariance control',grade:'9',system:'Other'};
  changed.challenges={stress:4,health:'Different synthetic support context'};
  changed.guide.incomeTarget='999999';changed.finance.lifestyle.rent='50000';
  assert.deepEqual(signature(explorerResults(changed).rows),baseline,`${c.id}: context must not change interest support/order`);
  const score=scoreOnetInterest(s),vectors=result.rows.filter(x=>x.r!==null).map(x=>({id:x.id,vector:x.o.vector}));
  // Some legacy rows use the occupation-essential vector rather than o.vector.
  const {occupationEssentials}=await import('../dist/occupation-essentials.js');
  const {riasecNames}=await import('../dist/onet-assessment.js');
  for(const v of vectors)if(!v.vector)v.vector=riasecOrder.map(k=>occupationEssentials[result.rows.find(r=>r.id===v.id).o.soc]?.interests?.find(x=>x.name===riasecNames[k])?.value);
  const baseNumeric=vectors.map(v=>({id:v.id,r:profileCorrelation(score.raw,v.vector)})).filter(x=>x.r!==null),baseTop=topSet(baseNumeric),baseStrong=new Set(baseNumeric.filter(x=>x.r>=.608).map(x=>x.id));
  for(const v of baseNumeric)assert.ok(Math.abs(v.r-result.rows.find(r=>r.id===v.id).r)<1e-10,c.id+' vector reconstruction '+v.id);
  let scenarios=0,guarded=0,changedTop=0,changedStrong=0,maxStrongFlips=0,minTopJaccard=1,sumTopJaccard=0,largestRChange=0;
  if(score.complete&&!score.flat&&!score.nearFlat)for(const q of onetQuestions)for(const delta of[-1,1]){
    const value=s.profileJourney.officialInterest.answers[q.id]+delta;if(value<1||value>5)continue;
    scenarios++;const raw=[...score.raw];raw[riasecOrder.indexOf(q.theme)]+=delta;
    const counts=Object.values(s.profileJourney.officialInterest.answers).reduce((a,v)=>(a[v]=(a[v]||0)+1,a),{});counts[value-delta]--;counts[value]=(counts[value]||0)+1;
    if(Math.max(...raw)-Math.min(...raw)<=2||60-Math.max(...Object.values(counts))<3){guarded++;continue;}
    const numeric=vectors.map(v=>({id:v.id,r:profileCorrelation(raw,v.vector)})).filter(x=>x.r!==null),top=topSet(numeric),strong=new Set(numeric.filter(x=>x.r>=.608).map(x=>x.id));
    const intersection=[...baseTop].filter(id=>top.has(id)).length,j=intersection/new Set([...top,...baseTop]).size;
    sumTopJaccard+=j;minTopJaccard=Math.min(minTopJaccard,j);if(!sameSet(top,baseTop))changedTop++;
    const flips=[...baseStrong].filter(id=>!strong.has(id)).length+[...strong].filter(id=>!baseStrong.has(id)).length;
    if(flips)changedStrong++;maxStrongFlips=Math.max(maxStrongFlips,flips);
    numeric.forEach((r,i)=>{largestRChange=Math.max(largestRChange,Math.abs(r.r-baseNumeric[i].r));});
  }
  assert.equal(JSON.stringify(s),before);
  records.push({id:c.id,phase:c.phase,complete:score.complete,flat:score.flat,nearFlat:score.nearFlat,availableVectors:baseNumeric.length,baselineBroadStrong:baseStrong.size,baselineBroadTop12WithTies:baseTop.size,scenarios,guarded,changedTop,changedStrong,maxStrongFlips,minTopJaccard:scenarios>guarded?minTopJaccard:null,meanTopJaccard:scenarios>guarded?sumTopJaccard/(scenarios-guarded):null,largestRChange});
}
const pairs=[];
for(const {c} of currentModelStates().filter(x=>x.c.phase==='diagnostic049')){
  const parent=c.cohort049.baseId;assert.deepEqual(signatures.get(c.id),signatures.get(parent));pairs.push({id:c.id,parent,interestUnchanged:true});
}
const cohorts=[...new Set(records.map(x=>x.phase))].map(phase=>{const rs=records.filter(x=>x.phase===phase);return{phase,n:rs.length,scenarios:rs.reduce((n,r)=>n+r.scenarios,0),guardedScenarios:rs.reduce((n,r)=>n+r.guarded,0),profilesWithTop12Change:rs.filter(r=>r.changedTop>0).length,profilesWithStrongSetChange:rs.filter(r=>r.changedStrong>0).length,maximumStrongFlips:Math.max(...rs.map(r=>r.maxStrongFlips)),minimumTop12Jaccard:Math.min(...rs.map(r=>r.minTopJaccard).filter(x=>x!==null))};});
const out={version:'054',generatedAt:new Date().toISOString(),classification:'One-answer ±1 perturbation stress test of BROAD interest correlations only. Not test-retest data, probability, observed preference change, or supportedTop sensitivity. No changes to original answers, calibration rules, or production rankings.',rules:frozen.rules,guards:{all184ContextInvariant:true,all12DiagnosticInterestInvariant:true,originalStatesUnchanged:true,currentReplayReproduced:true},cohorts,pairs,records};
fs.writeFileSync('research/calibration-054/sensitivity.json',JSON.stringify(out,null,2)+'\n');console.log(JSON.stringify({guards:out.guards,cohorts},null,2));
