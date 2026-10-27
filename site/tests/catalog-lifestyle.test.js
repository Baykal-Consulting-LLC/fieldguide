import {texasRequirements} from '../dist/texas-requirements.js';
const careerTex=id=>texasRequirements[id];
import test from 'node:test';
import assert from 'node:assert/strict';
import {directions} from '../dist/content.js';
import {careers,pathCareers} from '../dist/finance-data.js';
import {majors} from '../dist/catalog-data.js';
import {catalog} from '../dist/analysis.js';
import {catalogPage,majorPage} from '../dist/catalog-ui.js';
import {freshState,sanitizeState} from '../dist/model.js';
import {financialExport,linkedPlans,newCollegePlan} from '../dist/finance.js';
import {freshLifestyle,calculateLifestyle,employeeTaxes,loanPayment} from '../dist/lifestyle.js';
import {lifestylePage,lifestyleOutput} from '../dist/lifestyle-ui.js';
const near=(actual,expected)=>assert.ok(Math.abs(actual-expected)<.0001,`${actual} versus ${expected}`);
test('expanded catalog has broad coverage, stable unique IDs and real linked occupation examples',()=>{
 assert.ok(directions.length>=26);assert.ok(majors.length>=68);assert.ok(careers.length>=62);
 const all=[...directions,...majors,...careers];assert.equal(new Set(all.map(x=>x.id)).size,all.length);
 for(const d of directions){assert.ok(catalog[d.id].themes.length);assert.match(catalog[d.id].soc,/^\d{2}-\d{4}\.\d{2}$/);assert.ok(pathCareers[d.id].length);}
 for(const m of majors){assert.ok(m.paths.length);for(const id of m.careers)assert.ok(careers.some(c=>c.id===id));const html=majorPage(m.slug,freshState());for(const key of ['educationRoutes','requirements','educationCosts','earnings'])assert.match(html,new RegExp(`data-coverage="${key}"`));}
 for(const subject of ['Mechanical engineering','Electrical engineering','Biomedical engineering','Industrial engineering'])assert.ok(majors.some(m=>m.title===subject));
});
test('training and professional routes keep role prerequisites and source links visible',()=>{
 for(const id of ['electrician','plumbing','hvac','carpentry','automotive','emt','chef','dental-assisting']){const c=careers.find(c=>c.id===id);assert.equal(c.credentialLevel,'training');assert.match(c.requirements.sourceURL,/texas.gov|tdlr.texas.gov|tsbde.texas.gov/);assert.match(c.skillsURL,/onetonline.org/);assert.ok(c.requirements.training.length>20);}
 for(const id of ['law','pharmacy','physical-therapy','school-psychology','veterinary'])assert.equal(careers.find(c=>c.id===id).credentialLevel,'graduate');
 assert.match(careers.find(c=>c.id==='chef').requirements.typicalEntry+' '+careerTex('chef').detail,/not the same wage category as a first line-cook/);
 assert.match(careerTex('emt').detail,/different from advanced EMT or paramedic/);
});
test('catalog filters combine search, pathway and preparation without ranking by income',()=>{
 const html=catalogPage({type:'careers',search:'electric',path:'skilled-trades',level:'training'});assert.match(html,/1 career/);assert.match(html,/#\/career\/electrician/);assert.doesNotMatch(html,/#\/career\/electrical-engineering/);
 assert.match(catalogPage({type:'careers',search:'no-such-career-xyz'}),/No matches yet/);
});
test('college plans can link a field of study and survive restore',()=>{
 const s=freshState(),m=majors.find(m=>m.title==='Nursing');const p=newCollegePlan('nursing-plan');p.entityLinks=[m.id];s.finance.plans=[p];const restored=sanitizeState(s);assert.deepEqual(restored.finance.plans[0].entityLinks,[m.id]);assert.equal(linkedPlans(restored.finance,'nursing').length,1);
});
test('2026 single employee tax arithmetic uses marginal brackets and pretax retirement correctly',()=>{
 const t=employeeTaxes(75000,8);near(t.federal,6350);near(t.social,4650);near(t.medicare,1087.5);near(t.retirement,6000);near(t.monthly,56912.5/12);
 const high=employeeTaxes(250000);near(high.social,11439);near(high.medicare,4075);assert.equal(employeeTaxes(0).federal,0);
});
test('zero-interest and regular loans amortize independently of operating costs',()=>{
 near(loanPayment(12000,0,60),200);near(loanPayment(0,7,60),0);near(loanPayment(18000,7,60),356.4215737);
 const p=freshLifestyle(),r=calculateLifestyle(p);near(r.transport,r.carPayment+120+180+100+20);
});
test('monthly budget reconciles, retains shortfalls, and funds discretionary items once',()=>{
 const p=freshLifestyle(),r=calculateLifestyle(p);assert.equal(r.status,'illustration');near(r.takeHome,56912.5/12-250);near(r.takeHome-r.spending,r.remaining);near(r.dining,170);near(r.trips,1.5);near(r.items,22.5);
 p.rent='10000';const loss=calculateLifestyle(p);assert.ok(loss.remaining<0);assert.match(lifestyleOutput(p),/monthly shortfall/);assert.match(lifestyleOutput(p),/wish list/);
 p.gross='0';p.health='0';p.retirement='0';assert.equal(calculateLifestyle(p).status,'illustration');
});
test('ownership includes taxes insurance HOA maintenance utilities and upfront cash',()=>{
 const p={...freshLifestyle(),housingMode:'own',mortgageRate:'0',homePrice:'360000',downPercent:'20'};const r=calculateLifestyle(p);near(r.mortgage,800);near(r.property,600);near(r.maintenance,300);near(r.housing,800+600+300+250+75+180);near(r.upfront,72000+10800+(r.essential+Number(p.health))*6);near(r.upfrontGap,r.upfront);
});
test('inactive fields do not block manual take-home or transit while active blanks are unknown',()=>{
 const p={...freshLifestyle(),netMode:'manual',manualNet:'4200',gross:'',health:'',retirement:'',carMode:'transit',carPrice:'',carMonths:'',homePrice:''};let r=calculateLifestyle(p);assert.equal(r.status,'illustration');assert.equal(r.taxes,null);near(r.takeHome,4200);near(r.transport,141.25);
 p.groceries='';r=calculateLifestyle(p);assert.equal(r.status,'incomplete');assert.ok(r.issues.includes('groceries'));p.groceries='0';assert.equal(calculateLifestyle(p).status,'illustration');
});
test('invalid loan assumptions, over-limit retirement and missing empirical income cannot yield a budget',()=>{
 for(const changes of [{mortgageYears:'0',housingMode:'own'},{carDown:'99999'},{carMonths:'0'},{gross:'Infinity'},{gross:''},{gross:'300000',retirement:'10'},{carRate:'-1'}])assert.equal(calculateLifestyle({...freshLifestyle(),...changes}).status,'incomplete');
});
test('travel and clothing conversion handles zero target without division by zero',()=>{
 const r=calculateLifestyle({...freshLifestyle(),tripPrice:'0',itemPrice:'0',outingPrice:'0'});assert.equal(r.trips,null);assert.equal(r.items,null);assert.equal(r.outings,null);assert.ok(Number.isFinite(r.remaining));
});
test('lifestyle migration is private by default and never enters general report export',()=>{
 const s=freshState();s.finance.lifestyle.notes='private lifestyle note';s.finance.lifestyle.rent='1234';const restored=sanitizeState(s);assert.equal(restored.finance.lifestyle.rent,'1234');assert.equal(sanitizeState({version:1}).finance.lifestyle.rent,'1350');
 for(const optIn of [false,true]){s.finance.includeInReport=optIn;assert.doesNotMatch(JSON.stringify(financialExport(s.finance)),/private lifestyle note/);}
 const html=lifestylePage(s);assert.match(html,/editable assumptions/);assert.match(html,/Austin metro/);assert.doesNotMatch(lifestyleOutput({...freshLifestyle(),notes:'<script>bad</script>'}),/<script>/);
});
