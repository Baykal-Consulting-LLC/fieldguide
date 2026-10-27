import {majors} from '../dist/catalog-data.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState,sanitizeState} from '../dist/model.js';
import {analyze,fictionalState} from '../dist/analysis.js';
import {careers,pathCareers,collegeExamples,FINANCE_RELEASE} from '../dist/finance-data.js';
import {newCollegePlan,calculateCollege,moneyValue,cleanFinance,businessScenario,financialExport,coverageMatrix,linkedPlans,requirementContext} from '../dist/finance.js';
import {pathDetail,careerDetail,moneyPage,collegeComparison,reportFinancialContext,earningsPanel} from '../dist/finance-ui.js';
import {visualReport,reportExport} from '../dist/results-ui.js';
import {directions} from '../dist/content.js';

function completePlan(){return {...newCollegePlan('plan-1'),institution:'QA College',program:'Design BA',year:'2026–2027',residency:'Resident',enrollment:'Full time',living:'On campus',source:'QA invented offer',checkedOn:'2026-10-16',tuition:'18000',housing:'14000',books:'1200',transportation:'1800',other:'2000',grants:'12000',pendingAid:'9000',cash:'15000',studentLoan:'5500',parentLoan:'0',privateLoan:'0',work:'0',reviewed:true};}
test('every pathway and career has all four coverage entries and valid child mappings',()=>{
 const rows=coverageMatrix();assert.equal(rows.length,directions.length+careers.length+majors.length);
 for(const r of rows){for(const key of ['educationRoutes','requirements','educationCosts','earnings'])assert.ok(r[key],`${r.id}: ${key}`);}
 for(const d of directions){assert.ok(pathCareers[d.id].length);for(const id of pathCareers[d.id])assert.ok(careers.some(c=>c.id===id));const html=pathDetail(d.id,freshState());for(const key of ['educationRoutes','requirements','educationCosts','earnings'])assert.match(html,new RegExp(`data-coverage="${key}"`));}
 for(const c of careers){const html=careerDetail(c.id,freshState());for(const key of ['educationRoutes','requirements','educationCosts','earnings'])assert.match(html,new RegExp(`data-coverage="${key}"`));}
});
test('wage snapshot preserves ordered quartiles, exact SOC mapping, scope, dates, currency and primary sources',()=>{
 for(const c of careers.filter(c=>c.earnings.status==='sourced')){const w=c.earnings;assert.ok(w.p25<w.median&&w.median<w.p75);assert.equal(w.referencePeriod,'May 2025');assert.equal(w.currency,'USD');assert.equal(w.checkedAt,FINANCE_RELEASE);assert.match(w.geography,/Austin/);assert.match(w.population,/self-employed.*excluded/);assert.match(w.sourceURL,/onetonline.org\/link\/localwages\//);assert.equal(w.soc,c.soc);}
 assert.deepEqual(careers.find(c=>c.id==='software').earnings.median,134120);
 assert.equal(careers[0].earnings.status,'sourced');assert.equal(careers[0].earnings.median,100520);
 const partial=structuredClone(careers.find(c=>c.id==='software'));partial.earnings.p25=null;const partialHtml=earningsPanel(partial);assert.match(partialHtml,/middle-half range is not published/);assert.doesNotMatch(partialHtml,/class="wage-track"/);assert.match(partialHtml,/\$134,120/);
});
test('tattoo uses an Austin posting average and never mislabels city comparisons as percentiles',()=>{
 const c=careers.find(c=>c.id==='tattoo');assert.equal(c.earnings.status,'posting_estimate');assert.equal(c.earnings.median,null);assert.equal(c.earnings.mapping,'title_posting_estimate');assert.equal(c.earnings.average,65395);assert.equal(c.earnings.sampleSize,5);const html=earningsPanel(c);assert.match(html,/Small sample/);assert.match(html,/City averages, not a wage range/);assert.doesNotMatch(html,/Lower quarter|Upper quarter/);assert.doesNotMatch(html,/\$71,240|wage-headline/);assert.match(c.educationBenefits,/college/);assert.match(requirementContext(c,freshState().finance).detail,/does not replace/);
});
test('net price subtracts grants only and borrowing/work finance the unchanged price',()=>{
 const p=completePlan();let c=calculateCollege(p);assert.equal(c.total,37000);assert.equal(c.netPrice,25000);assert.equal(c.borrowing,5500);assert.equal(c.gap,4500);assert.deepEqual(c.warnings,[]);
 p.studentLoan='10000';p.work='3000';p.pendingAid='50000';c=calculateCollege(p);assert.equal(c.netPrice,25000);assert.equal(c.gap,-3000);assert.ok(c.warnings.some(x=>x.includes('exceeds net price')));
});
test('source total mode cannot double count tuition or other itemized fields',()=>{
 const p={...completePlan(),costMode:'total',total:'40000',tuition:'999999'};assert.equal(calculateCollege(p).total,40000);assert.equal(calculateCollege(p).netPrice,28000);
});
test('missing values are distinct from zero and only block their dependent calculations',()=>{
 const p=completePlan();p.grants='';assert.equal(calculateCollege(p).total,37000);assert.equal(calculateCollege(p).netPrice,null);p.grants='0';p.cash='';assert.equal(calculateCollege(p).netPrice,37000);assert.equal(calculateCollege(p).gap,null);assert.equal(moneyValue('0'),0);for(const v of ['',null,undefined,false,{},'bad','Infinity','-1'])assert.equal(moneyValue(v),null);
});
test('negative net price and excess funding remain visible and flagged',()=>{
 const p=completePlan();p.grants='50000';const c=calculateCollege(p);assert.equal(c.netPrice,-13000);assert.ok(c.warnings.some(x=>x.includes('Grants exceed')));assert.ok(c.gap<0);
});
test('cost arithmetic uses cents without floating-point drift',()=>{
 const p={...completePlan(),tuition:'0.1',housing:'0.2',books:'0',transportation:'0',other:'0',grants:'0.05'};assert.equal(calculateCollege(p).total,.3);assert.equal(calculateCollege(p).netPrice,.25);
});
test('college examples reconcile to source totals but ranges are not personalized program prices',()=>{
 for(const e of collegeExamples){const other=e.housing+e.books+e.other+(e.transportation||0);assert.equal(e.tuitionMin+other,e.totalMin);assert.equal(e.tuitionMax+other+(e.housingMax?e.housingMax-e.housing:0),e.totalMax);assert.match(e.sourceURL,/utexas.edu|austincc.edu/);assert.equal(e.year,'2026–2027');}
});
test('comparison labels period differences and preserves source evidence types',()=>{
 const f=freshState().finance;f.plans=[completePlan(),{...completePlan(),id:'p2',period:'whole_program',evidenceType:'college_calculator'}];f.compare=['plan-1','p2'];const html=collegeComparison(f);assert.match(html,/different years or periods/);assert.match(html,/Whole program/);assert.match(html,/College net-price calculator/);assert.match(html,/scope="row"/);
});
test('all careers use researched Texas requirements with concrete entry rules and dated sources',()=>{
 const s=freshState();for(const c of careers){const t=requirementContext(c,s.finance);assert.equal(t.jurisdiction,'Texas');assert.ok(t.typicalEntry);assert.ok(t.summary);assert.ok(t.bullets.length<=3);assert.ok(t.sourceURLs.every(u=>u.startsWith('https://')));assert.match(careerDetail(c.id,s),/TEXAS REQUIREMENTS/);assert.doesNotMatch(t.summary+' '+t.detail,/check local|verify locally/i);}
 assert.match(requirementContext(careers.find(c=>c.id==='teaching'),s.finance).sourceURLs.join(),/tea.texas.gov/);assert.match(requirementContext(careers.find(c=>c.id==='tattoo'),s.finance).detail,/rather than issuing a separate individual artist license/);
});
test('financial facts and personal amounts cannot affect interest analysis or ranking',()=>{
 const s=fictionalState(freshState());const before=analyze(s);s.finance.plans=[completePlan()];s.finance.plans[0].cash='999999';s.finance.jurisdiction='IL';s.finance.includeInReport=true;assert.deepEqual(analyze(s),before);
});
test('new financial fields migrate safely and reject unknown links/duplicate compare records',()=>{
 const s=sanitizeState({version:1,profile:{nickname:'Existing'}});assert.equal(s.profile.nickname,'Existing');assert.deepEqual(s.finance.plans,[]);
 const f=cleanFinance({plans:[{...completePlan(),entityLinks:['design','unknown','design']}],compare:['plan-1','plan-1','bad'],jurisdiction:'wrong',includeInReport:'true'});assert.deepEqual(f.plans[0].entityLinks,['design']);assert.deepEqual(f.compare,['plan-1']);assert.equal(f.includeInReport,false);assert.equal(f.jurisdiction,'TX');
});
test('personal financial plans are opt-in for report and exports, with fictional report isolation',()=>{
 const s=freshState();s.finance.plans=[{...completePlan(),institution:'PRIVATE COLLEGE PLAN',entityLinks:['design']}];s.finance.business.notes='PRIVATE BUSINESS';assert.equal(reportFinancialContext(s),'');assert.doesNotMatch(JSON.stringify(reportExport(s)),/PRIVATE/);assert.doesNotMatch(visualReport(s),/PRIVATE/);
 s.finance.includeInReport=true;assert.match(reportFinancialContext(s),/PRIVATE COLLEGE PLAN/);assert.match(JSON.stringify(financialExport(s.finance)),/PRIVATE BUSINESS/);assert.match(reportFinancialContext(s),/PRIVATE BUSINESS/);assert.doesNotMatch(visualReport(s,true),/PRIVATE/);
});
test('business worksheet starts unknown and distinguishes revenue, expenses, profit, and a loss',()=>{
 assert.equal(businessScenario(freshState().finance.business).status,'incomplete');const b={appointments:'5',collected:'100',weeks:'40',share:'20',rent:'0',supplies:'10',annualFixed:'1000',unpaidHours:'10',notes:''};let r=businessScenario(b);assert.equal(r.revenue,20000);assert.equal(r.expenses,7000);assert.equal(r.profit,13000);b.rent='2000';r=businessScenario(b);assert.equal(r.profit,-11000);assert.match(r.issues.join(),/double-counting/);b.share='101';assert.equal(businessScenario(b).profit,null);
});
test('linked college plans work from both pathway and career context without making a curriculum claim',()=>{
 const f=freshState().finance;f.plans=[{...completePlan(),entityLinks:['design']}];assert.equal(linkedPlans(f,'industrial-design').length,1);f.plans[0].entityLinks=['industrial-design'];assert.equal(linkedPlans(f,'design').length,1);assert.equal(linkedPlans(f,'teaching').length,0);
});
test('student text is escaped in cost views, comparison and report',()=>{
 const s=freshState();s.finance.plans=[{...completePlan(),institution:'<img src=x onerror=alert(1)>',assumptions:'<script>bad()</script>'}];s.finance.compare=['plan-1'];assert.doesNotMatch(moneyPage(s),/<img src=x|<script>bad/);assert.match(moneyPage(s),/&lt;img/);
});
