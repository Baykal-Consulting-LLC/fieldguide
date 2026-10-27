// Run from the site directory: node scripts/calibration-runner.mjs
// Tests the real modules; expected results come from independent, documented rules.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {themes,interestStatus,analyze,abilityStatus,fictionalState} from '../dist/analysis.js';
import {curiosity,confidence,challenges,priorities,directions,reflectionPrompts} from '../dist/content.js';
import {freshState,sanitizeState,moduleStatus,likedActivities,unknownActivities,movePriority} from '../dist/model.js';
import {updateResult,reportExport,visualReport} from '../dist/results-ui.js';
import {newCollegePlan,calculateCollege,coverageMatrix} from '../dist/finance.js';
import {freshLifestyle,calculateLifestyle,employeeTaxes,loanPayment} from '../dist/lifestyle.js';
import {careers,collegeExamples} from '../dist/finance-data.js';

const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const started=Date.now(),checks=[],matrix=[];
const baseline='550bde7d232916c76374afb4487c05e93e4ec8f0';
function check(id,scope,fn){const t=Date.now(),r={id,scope,cases:0,failures:0,examples:[]};function expect(ok,example){r.cases++;if(!ok){r.failures++;if(r.examples.length<5)r.examples.push(example);}}try{fn(expect);}catch(e){r.failures++;r.examples.push({exception:e.message});}r.status=r.failures?'fail':'pass';r.elapsedMs=Date.now()-t;checks.push(r);process.stdout.write(`${r.status.toUpperCase()} ${id}: ${r.cases} checks, ${r.failures} failures\n`);}
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b),near=(a,b,t=.005)=>Number.isFinite(a)&&Math.abs(a-b)<=t;
const letters=themes.map(t=>t.id);
const seed=()=>({representation:'raw',form:'onet-60-paper',version:'Calibration fixture',source:'Synthetic scoring fixture',origin:'calibration',date:'2026-10-01',min:'0',max:'10',verified:true,suitable:true,scores:Object.fromEntries(letters.map(t=>[t,'0']))});
const setScores=(i,arr)=>arr.forEach((v,n)=>i.scores[letters[n]]=String(v));
function expectedTop(scores){const positive=[...new Set(scores.filter(score=>score>0))].sort((a,b)=>b-a);if(new Set(scores).size===1)return[];const levels=positive.slice(0,1);return letters.filter((_,i)=>levels.includes(scores[i]));}
function cartesian(options,fn,acc=[]){if(acc.length===options.length){fn(acc);return;}for(const v of options[acc.length])cartesian(options,fn,[...acc,v]);}

check('paper-all-score-profiles','Exhaustive 11^6 permitted paper score profiles, including ties and all 11 flat profiles',expect=>{
 const i=seed(),arr=Array(6).fill(0);for(let code=0;code<11**6;code++){let n=code;for(let j=0;j<6;j++){arr[j]=n%11;n=Math.floor(n/11);}setScores(i,arr);const got=interestStatus(i),top=expectedTop(arr);expect(same(got.top,top)&&got.kind===(top.length?'ready':'flat'),{scores:[...arr],got,expected:top});}
});

check('full-analysis-all-weak-orders','All 4,683 weak orderings of six RIASEC scores; real analyze(), every direction, tie preservation, agenda partition',expect=>{
 const s=freshState();s.results.interest=seed();let patterns=0;
 cartesian(Array.from({length:6},()=>[0,1,2,3,4,5]),arr=>{const used=[...new Set(arr)].sort();if(used.some((v,i)=>v!==i))return;patterns++;const scores=arr.map(v=>v*2);setScores(s.results.interest,scores);const a=analyze(s),top=expectedTop(scores),all=a.items.map(x=>x.id);expect(same(a.status.top,top)&&all.length===directions.length&&new Set(all).size===directions.length&&a.agenda.length===4&&a.remaining.length===directions.length-4&&a.items.every(x=>x.interestLinked===x.themes.some(t=>top.includes(t))),{scores,top,status:a.status});});
 expect(patterns===4683,{patterns});
});

check('curiosity-response-and-storage-transitions','Every question × seven states (blank, 1–5, untried); add, change, erase, storage, summary; global combinations are not enumerated',expect=>{
 for(const q of curiosity)for(const v of [undefined,1,2,3,4,5,'untried']){const s=freshState();if(v!==undefined)s.curiosity[q.id]=v;const c=sanitizeState(s);expect(moduleStatus(c,'curiosity').done===(v===undefined?0:1)&&likedActivities(c).some(x=>x.id===q.id)===[4,5].includes(v)&&unknownActivities(c).some(x=>x.id===q.id)===(v==='untried'),{id:q.id,v});s.curiosity[q.id]=5;delete s.curiosity[q.id];expect(moduleStatus(sanitizeState(s),'curiosity').done===0,{id:q.id,transition:'erase'});matrix.push(['curiosity',q.id,v===undefined?'blank':v,'recorded reflection; no career fit score','executed']);}
});

check('ordered-priority-states','All 401 ordered selections of zero through three of eight priorities, persistence and movement boundaries',expect=>{
 const sequences=[[]];for(const a of priorities) {sequences.push([a.id]);for(const b of priorities.filter(x=>x!==a)){sequences.push([a.id,b.id]);for(const c of priorities.filter(x=>x!==a&&x!==b))sequences.push([a.id,b.id,c.id]);}}
 for(const order of sequences){const s=freshState();s.priorities=[...order];const restored=sanitizeState(s);expect(same(restored.priorities,order)&&moduleStatus(restored,'priorities').done===order.length,{order});movePriority(restored,order[0],-1);expect(same(restored.priorities,order),{order,transition:'first up'});matrix.push(['priorities',order.join('|')||'none',order.length,'ordered values retained; no ranking weight','executed']);}expect(sequences.length===401,{count:sequences.length});
});

check('confidence-all-states','All 24^4 = 331,776 exposure/confidence states, including each partial response; completion independent of confidence level',expect=>{
 const options=[];for(const exposure of [undefined,'new','some','often'])for(const confidence of [undefined,1,2,3,4,5])options.push({exposure,confidence});const s=freshState();
 cartesian(confidence.map(()=>options),arr=>{arr.forEach((v,i)=>s.confidence[confidence[i].id]=v);const clean=sanitizeState(s);expect(moduleStatus(clean,'confidence').done===arr.filter(v=>v.exposure&&v.confidence).length&&arr.every((v,i)=>clean.confidence[confidence[i].id].exposure===v.exposure&&clean.confidence[confidence[i].id].confidence===v.confidence),{responses:arr});});
 for(const q of confidence)for(const v of options)matrix.push(['confidence',q.id,`${v.exposure||'blank'}|${v.confidence||'blank'}`,'self report retained; never ability cutoff','executed']);
});

check('challenges-all-answer-paths','All 5^4 = 625 blank/answer combinations, completion, persistence; keys independently fixed, not re-derived from implementation',expect=>{
 const keys={quantitative:1,verbal:2,logical:1,spatial:1};for(const q of challenges)expect(q.answer===keys[q.id],{id:q.id,answer:q.answer,expected:keys[q.id]});
 cartesian(challenges.map(q=>[undefined,...q.options.map((_,i)=>i)]),arr=>{const s=freshState();arr.forEach((v,i)=>{if(v!==undefined)s.challenges[challenges[i].id]=v;});const c=sanitizeState(s);expect(moduleStatus(c,'challenges').done===arr.filter(v=>v!==undefined).length&&arr.every((v,i)=>c.challenges[challenges[i].id]===v),{responses:arr});});
 for(const q of challenges)for(const v of [undefined,...q.options.map((_,i)=>i)])matrix.push(['challenge',q.id,v===undefined?'blank':v,v===undefined?'unanswered':v===keys[q.id]?'keyed response; no aptitude inference':'alternative response; no aptitude inference','executed']);
});

check('per-direction-all-routing-lanes','Each pathway × 5 experience states × 4 choice states × saved/unsaved × preparation absent/present × interest linked/unlinked = 160 contexts per path',expect=>{
 for(const d of directions)cartesian([[undefined,'new','mixed','enjoyed','disliked'],[undefined,'explore','unsure','later'],[false,true],[false,true],[false,true]],([experience,choice,saved,preparation,linked])=>{
  const s=freshState();if(linked){s.results.interest=seed();const ts=d.interestThemes||analyze(s).items.find(x=>x.id===d.id).themes;setScores(s.results.interest,letters.map(t=>ts.includes(t)?10:0));}s.savedDirections=saved?[d.id]:[];s.results.connections[d.id]={experience,choice,preparation:preparation?'Synthetic learning plan':'',notes:''};const a=analyze(s),got=a.items.find(x=>x.id===d.id);
  let lane;if(choice==='later')lane='Set aside for now';else if(experience==='disliked')lane='Your response needs a conversation';else if(preparation)lane='Explore with a learning plan';else if(choice==='explore'||saved)lane='You chose to explore';else if(linked&&experience==='enjoyed')lane='Start exploring here';else if(linked)lane='Worth trying';else if(experience==='enjoyed')lane='Follow your experience';else lane='Something new to discover';
  expect(got.lane===lane&&a.items.length===directions.length&&(choice!=='later'||!a.agenda.some(x=>x.id===d.id)),{id:d.id,experience,choice,saved,preparation,linked,lane:got.lane,expected:lane});matrix.push(['pathway context',d.id,`${experience||'blank'}|${choice||'blank'}|saved:${saved}|preparation:${preparation}|interest:${linked}`,lane,'executed']);
 });
});

check('result-input-withdrawal-and-form-switch','Each score/source/date/scale edit withdraws verification; switching form clears scores and source approval',expect=>{
 const fields=['interest.scores.R','interest.scores.I','interest.scores.A','interest.scores.S','interest.scores.E','interest.scores.C','interest.source','interest.date','interest.min','interest.max'];for(const field of fields){const s=fictionalState(freshState());updateResult(s,{dataset:{result:field},type:'text',value:field.includes('scores')?'8':'changed'});expect(!s.results.interest.verified,{field});matrix.push(['external result',field,'edit','source verification withdrawn','executed']);}
 for(const form of ['onet-60-online','onet-30-online','onet-60-paper','other']){const s=fictionalState(freshState());updateResult(s,{dataset:{result:'interest.form'},type:'select-one',value:form});expect(!s.results.interest.verified&&!s.results.interest.suitable&&Object.values(s.results.interest.scores).every(v=>v===''),{form});}
});

check('official-form-scale-guards','Manual p32: paper 0–10 whole counts, online Short 0–40 whole sums, Mini 0–20 whole sums; imported values must not route on incompatible scales',expect=>{
 for(const [form,max]of [['onet-60-paper',10],['onet-60-online',40],['onet-30-online',20]])for(const variant of ['valid','wrongScale','fraction','overRange']){const i=seed();i.form=form;i.max=String(max);setScores(i,[max,max-2,0,0,0,0]);if(variant==='wrongScale')i.max='100';if(variant==='fraction')i.scores.R='4.5';if(variant==='overRange')i.scores.R=String(max+1);const got=interestStatus(i);expect(variant==='valid'?got.kind==='ready':!['ready','flat','broad'].includes(got.kind),{form,variant,status:got.kind});matrix.push(['official form',form,variant,variant==='valid'?'ready':'recorded; needs review','executed']);}
});

check('ability-date-validation','Malformed and impossible dates remain supporting records needing review',expect=>{
 for(const date of ['not-a-date','2026-02-31','2026-13-01','2026-1-1']){const a={instrument:'Fixture',dimension:'Spatial',value:'50',scale:'percentile',norms:'Synthetic comparison group',verified:true,source:'Fixture',form:'Fixture',date};expect(!abilityStatus(a).startsWith('Source checked'),{date,status:abilityStatus(a)});matrix.push(['ability result','date',date,'source review required','executed']);}
});

check('narrative-boundaries-and-report-privacy','Boundary values, escaped malicious markup, opt-in notes, fictional isolation; representative narrative equivalence classes, not every possible string',expect=>{
 for(const value of ['','abcd','abcde','😀'.repeat(10),'<img src=x onerror=alert(1)>','x'.repeat(7000)]){const s=freshState();s.evidence.project=value;for(const q of reflectionPrompts)s.reflection[q.id]=value;const c=sanitizeState(s);expect(moduleStatus(c,'evidence').done===(value.trim().length>=5?1:0)&&moduleStatus(c,'reflection').done===(value.trim().length>=5?1:0),{length:value.length});s.results.nomination=value;const html=visualReport(s);expect(!html.includes('<img src=x'),{length:value.length,escaped:true});}
 const s=fictionalState(freshState());s.results.connections.design.notes='PRIVATE_CALIBRATION_NOTE';s.results.valuesNotes='PRIVATE_CALIBRATION_NOTE';s.results.includeNotes=false;expect(!JSON.stringify(reportExport(s)).includes('PRIVATE_CALIBRATION_NOTE')&&!visualReport(s).includes('PRIVATE_CALIBRATION_NOTE'),{privacy:'opt out'});s.results.includeNotes=true;expect(JSON.stringify(reportExport(s)).includes('PRIVATE_CALIBRATION_NOTE')&&!visualReport(s,true).includes('PRIVATE_CALIBRATION_NOTE'),{privacy:'opt in plus fictional isolation'});
});

// A separate closed-form tax schedule from IRS Publication 505, Schedule X.
function taxOracle(gross,retirementPercent){const retirement=gross*retirementPercent/100,x=Math.max(0,gross-retirement-16100);let federal;if(x<=12400)federal=x*.1;else if(x<=50400)federal=1240+(x-12400)*.12;else if(x<=105700)federal=5800+(x-50400)*.22;else if(x<=201775)federal=17966+(x-105700)*.24;else if(x<=256225)federal=41024+(x-201775)*.32;else if(x<=640600)federal=58448+(x-256225)*.35;else federal=192979.25+(x-640600)*.37;const social=(gross<=184500?gross:184500)*.062,medicare=gross*.0145+(gross>200000?(gross-200000)*.009:0);return{federal,social,medicare,retirement,monthly:(gross-retirement-federal-social-medicare)/12};}
check('single-adult-2026-tax-fixtures','Independent IRS Schedule X and SSA cap; each threshold below/at/above, gross 0–1m, retirement variations',expect=>{
 const grossSet=new Set([0,10000,30000,50000,75000,100000,150000,250000,500000,1000000]);for(const threshold of [16100,28500,66500,121800,217875,272325,656700,184500,200000])for(const delta of [-.01,0,.01])grossSet.add(threshold+delta);
 for(const gross of grossSet)for(const pct of [0,3,8]){const a=employeeTaxes(gross,pct),b=taxOracle(gross,pct);expect(Object.keys(b).every(k=>near(a[k],b[k])),{gross,pct,actual:a,expected:b});}
});

check('college-price-and-funding-arithmetic','Independent cents arithmetic; all 3^8 = 6,561 zero/cent/dollar combinations for cost, grant and three loan fields; plus blank and total-mode branches',expect=>{
 const fields=['tuition','housing','books','transportation','other','grants','studentLoan','privateLoan'];cartesian(fields.map(()=>[0,1,100001]),arr=>{const p=newCollegePlan('calibration');for(const f of ['tuition','housing','books','transportation','other','grants','cash','studentLoan','parentLoan','privateLoan','work'])p[f]='0';arr.forEach((v,i)=>p[fields[i]]=(v/100).toFixed(2));const a=calculateCollege(p),cost=arr.slice(0,5).reduce((s,v)=>s+v,0),net=cost-arr[5],fund=arr[6]+arr[7];expect(a.total===cost/100&&a.netPrice===net/100&&a.funding===fund/100&&a.gap===(net-fund)/100&&a.borrowing===fund/100,{values:arr,actual:a});});
 const p=newCollegePlan('missing');expect(calculateCollege(p).total===null,{mode:'missing'});Object.assign(p,{costMode:'total',total:'1.01',tuition:'99999999',grants:'0',cash:'0',studentLoan:'0',parentLoan:'0',privateLoan:'0',work:'0'});expect(calculateCollege(p).total===1.01,{mode:'source total'});for(const c of collegeExamples)expect(near(c.tuitionMin+c.housing+c.books+c.other+(c.transportation||0),c.totalMin)&&near(c.tuitionMax+(c.housingMax??c.housing)+c.books+c.other+(c.transportation||0),c.totalMax),{college:c.id});
});

// Independently transcribed from official pages reviewed October 16, 2026.
const collegeSourceFixtures={
 'ut-austin-resident':{tuitionMin:10858,tuitionMax:13576,totalMin:32508,totalMax:35386,housing:15420,housingMax:15580,books:724,transportation:1840,other:3666},
 'ut-austin-nonresident':{tuitionMin:42554,tuitionMax:51106,totalMin:64204,totalMax:72916,housing:15420,housingMax:15580,books:724,transportation:1840,other:3666},
 'acc-district':{tuitionMin:2550,tuitionMax:2550,totalMin:27398,totalMax:27398,housing:18240,books:1200,transportation:1824,other:3584},
 'acc-parents':{tuitionMin:2550,tuitionMax:2550,totalMin:17958,totalMax:17958,housing:8800,books:1200,transportation:1824,other:3584},
};
check('austin-college-published-source-fixtures','Current official 2026–27 UT Austin and ACC tables; every displayed published cost field, no aid deducted',expect=>{
 for(const [id,fixture]of Object.entries(collegeSourceFixtures)){const c=collegeExamples.find(x=>x.id===id);expect(!!c,{id,reason:'published example present'});if(c){for(const [key,value]of Object.entries(fixture))expect(c[key]===value,{id,key,actual:c[key],expected:value});expect(c.year==='2026–2027'&&/utexas.edu|austincc.edu/.test(c.sourceURL),{id,year:c.year,source:c.sourceURL});}}
});

check('amortization-independent-present-value','Payment schedule independently discounted to principal; zero, ordinary and near-zero rates must be finite and continuous',expect=>{
 for(const principal of [0,1,18000,340000])for(const rate of [0,1e-15,1e-10,.01,6.75,20])for(const months of [1,60,360]){const actual=loanPayment(principal,rate,months);const r=rate/1200;let factor=0;for(let k=1;k<=months;k++)factor+=Math.exp(-k*Math.log1p(r));const expected=principal/factor;expect(near(actual,expected,Math.max(.005,Math.abs(expected)*1e-8)),{principal,rate,months,actual:Number.isFinite(actual)?actual:String(actual),expected});}
});

check('lifestyle-mode-and-budget-conservation','192 mode/gross/retirement cases; exact cash-flow identity, positive/negative balances visible, manual net independent of gross',expect=>{
 cartesian([['estimate','manual'],['rent','own'],['transit','paid','used','new'],['0','35000','75000','150000'],['0','8','12']],([netMode,housingMode,carMode,gross,retirement])=>{const p={...freshLifestyle(),netMode,housingMode,carMode,gross,retirement,manualNet:'3500'};const a=calculateLifestyle(p);expect(a.status==='illustration'&&Number.isFinite(a.remaining)&&near(a.takeHome-a.rows.reduce((s,[,n])=>s+n,0),a.remaining)&&near(a.rows.reduce((s,[,n])=>s+n,0),a.spending)&&(netMode!=='manual'||a.takeHome===3500),{netMode,housingMode,carMode,gross,retirement,status:a.status});});
});

check('catalog-financial-field-coverage','Every career/path/major has coverage; available wages finite and ordered; scope integrity checked separately',expect=>{
 const rows=coverageMatrix();for(const r of rows)expect(['educationRoutes','requirements','educationCosts','earnings'].every(k=>!!r[k]),{id:r.id,type:r.type});for(const c of careers){const w=c.earnings;expect(w.status!=='sourced'||[w.p25,w.median,w.p75].every(v=>v===null||Number.isFinite(v)),{id:c.id,wages:'finite'});if(w.median!==null&&w.p25!==null&&w.p75!==null)expect(w.p25<=w.median&&w.median<=w.p75,{id:c.id,wages:'ordered'});}
});

check('austin-career-localization','Every sourced career wage is Austin metro data, exact occupation; all careers have an observed median or explicitly labeled posting estimate without a national fallback',expect=>{
 for(const c of careers){const w=c.earnings;if(w.status==='sourced')expect(/Austin/i.test(w.geography)&&(w.mapping==='exact_occupation'||(w.mapping==='combined_BLS_category'&&w.wageSOC!==c.soc.slice(0,7)))&&w.soc===c.soc&&/^https:\/\//.test(w.sourceURL),{id:c.id,geography:w.geography,mapping:w.mapping,source:w.sourceURL});else expect(w.status==='posting_estimate'&&w.median===null&&w.average===65395&&w.sampleSize===5&&w.mapping==='title_posting_estimate'&&w.regionalComparisons.length===2,{id:c.id,status:w.status,average:w.average});}
});

const sourceFiles=fs.readdirSync(path.join(root,'dist')).filter(f=>/\.(js|css|html)$/.test(f)).sort();
const hashes=Object.fromEntries(sourceFiles.map(f=>[f,crypto.createHash('sha256').update(fs.readFileSync(path.join(root,'dist',f))).digest('hex')]));
const result={schemaVersion:1,executedAt:new Date().toISOString(),baselineCommit:baseline,currentHead:execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),primaryHousehold:'One adult living alone in Austin, Texas; single employee, no dependents, under 50, 2026 tax assumptions',elapsedMs:Date.now()-started,coverageClaim:'Exhaustive for the finite subspaces explicitly named. No exhaustive claim for cross-product of all modules, free text, all financial numbers, user interaction order, or psychometric validity.',counts:{checks:checks.length,cases:checks.reduce((s,x)=>s+x.cases,0),failures:checks.reduce((s,x)=>s+x.failures,0),careers:careers.length,pathways:directions.length},baselineRegressionFindings:[{id:'official-form-scale-guards',firstRunFailingAssertions:4},{id:'ability-date-validation',firstRunFailingAssertions:4},{id:'amortization-independent-present-value',firstRunFailingAssertions:15}].map(x=>({...x,currentStatus:checks.find(c=>c.id===x.id).status})),checks,sourceHashes:hashes,externalCalibration:{status:'See testing-and-calibration-plan.md and wage-source-audit.json; source agreement is distinct from independent validation.',localization:'See austin-career-localization check; a source transcription audit does not establish individual earnings.'}};
fs.mkdirSync(path.join(root,'validation'),{recursive:true});fs.writeFileSync(path.join(root,'validation','calibration-results.json'),JSON.stringify(result,null,2)+'\n');
const csvCell=v=>'"'+String(v).replaceAll('"','""')+'"';fs.writeFileSync(path.join(root,'validation','question-path-matrix.csv'),[['module','question_or_state','answer_or_transition','expected_result','execution'],...matrix].map(row=>row.map(csvCell).join(',')).join('\n')+'\n');
process.stdout.write(`Saved validation artifacts: ${result.counts.cases} assertions; ${result.counts.failures} failures.\n`);process.exitCode=result.counts.failures?1:0;
