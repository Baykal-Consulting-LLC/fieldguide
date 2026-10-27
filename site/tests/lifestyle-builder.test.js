import test from 'node:test';
import assert from 'node:assert/strict';
import {freshState,sanitizeState} from '../dist/model.js';
import {lifestyleChoices,freshLifestyleBuilder,cleanLifestyleBuilder,builderReady,buildLifestyleInputs,lifestyleTally} from '../dist/lifestyle-builder.js';
import {lifestyleIncomeRange,careerLifestyleFit,lifestyleStory} from '../dist/lifestyle-story.js';
import {calculateLifestyle,employeeTaxes} from '../dist/lifestyle.js';
import {guidePage} from '../dist/guide-ui.js';
import {salaryCareerIds} from '../dist/salary-progression.js';
import {careerLanguage} from '../dist/career-language.js';
import {analyze} from '../dist/analysis.js';
const complete=(level=2,mode='rent')=>({...freshLifestyleBuilder(),homeMode:mode,complete:true,choices:Object.fromEntries(lifestyleChoices.map(c=>[c.id,level]))});

test('nine independent choices cover home, travel, weekly dinners, entertainment, recreation, and saving',()=>{
 assert.equal(lifestyleChoices.length,9);for(const c of lifestyleChoices){assert.equal(c.options.length,5);for(const o of c.options){assert.ok(o.title&&o.copy);assert.doesNotMatch(o.title+o.copy,/\$/);}}
 assert.ok(lifestyleChoices.some(c=>c.id==='entertainment'));assert.ok(lifestyleChoices.some(c=>c.id==='recreation'));
 const dinners=lifestyleChoices.find(c=>c.id==='dining');for(const [index,frequency]of [[0,.25],[1,1],[2,2.5],[3,4.5],[4,6.5]]){const o=dinners.options[index].inputs;assert.ok(Math.abs((Number(o.quickCount)+Number(o.casualCount)+Number(o.specialCount))*12/52-frequency)<1e-10);}
});
test('selection screens never show prices, subtotals, or income impacts, even while revisiting a saved picture',()=>{
 const s=freshState();s.guide.lifestyleBuilder=complete();for(let i=0;i<lifestyleChoices.length;i++){s.guide.lifestyleBuilder.step=i;const page=guidePage('guide/lifestyle',s);assert.doesNotMatch(page,/\$/);assert.doesNotMatch(page,/Income to support|monthly total|monthly tally/);assert.match(page,new RegExp('data-id="'+lifestyleChoices[i].id+'"'));}
});
test('all frugal-to-lavish endpoint combinations make valid, reconciled rental and ownership budgets',()=>{
 for(const mode of ['rent','own'])for(let mask=0;mask<512;mask++){const b=complete(0,mode);lifestyleChoices.forEach((c,i)=>b.choices[c.id]=(mask>>i)&1?4:0);const p=buildLifestyleInputs(b),r=calculateLifestyle(p),t=lifestyleTally(p,b);assert.equal(r.status,'illustration');assert.equal(t.total,t.rows.reduce((n,r)=>n+r.display,0));assert.ok(Math.abs(t.rawTotal-t.total)<=t.rows.length*5);assert.equal(Number(p.recreation),Number(lifestyleChoices.find(c=>c.id==='entertainment').options[b.choices.entertainment].inputs.recreation)+Number(lifestyleChoices.find(c=>c.id==='recreation').options[b.choices.recreation].inputs.recreation));}
});
test('income range covers costs at its lower end and leaves modeled breathing room at the upper end',()=>{
 for(const mode of ['rent','own'])for(let level=0;level<5;level++){const p=buildLifestyleInputs(complete(level,mode)),range=lifestyleIncomeRange(p),r=calculateLifestyle(p);assert.ok(range.high>=range.low);assert.ok(range.low>=range.minimum);for(const [gross,buffer]of [[range.low,0],[range.high,.2]]){const rate=Math.min(Number(p.retirement),Math.floor(24500/gross*100*1e8)/1e8);const net=employeeTaxes(gross,rate).monthly-Number(p.health);assert.ok(net*(1-buffer)>=r.spending-.000001);}}
});
test('summary reveals the item tally before the sum and income band; separate fun categories do not double count',()=>{
 const s=freshState(),b=complete();s.guide.lifestyleBuilder=b;s.finance.lifestyle=buildLifestyleInputs(b);const html=guidePage('guide/lifestyle-summary',s);assert.ok(html.indexOf('Your monthly tally')<html.indexOf('Your monthly total'));assert.ok(html.indexOf('Your monthly total')<html.indexOf('Income needed for your choices'));assert.match(html,/<dt>Entertainment<\/dt>/);assert.match(html,/<dt>Recreation &amp; hobbies<\/dt>/);assert.ok(!lifestyleTally(s.finance.lifestyle,b).rows.some(r=>r.label==='Recreation'));assert.match(html,/2–3 dinners a week/);
});
test('unfinished choices stay unfinished and drafts restore choices without changing older answers or budgets',()=>{
 assert.equal(builderReady(freshLifestyleBuilder()),false);assert.equal(buildLifestyleInputs(freshLifestyleBuilder()),null);const b=cleanLifestyleBuilder({step:999,homeMode:'evil',choices:{home:99,transport:2},complete:true});assert.equal(b.step,8);assert.equal(b.complete,false);assert.equal(b.homeMode,'rent');
 const s=freshState();s.curiosity['curiosity-1']=5;s.guide.lifestyleBuilder=complete();s.guide.lifestylePreset='custom';s.finance.lifestyle.debt='321';const restored=sanitizeState(s);assert.deepEqual(restored.guide.lifestyleBuilder,s.guide.lifestyleBuilder);assert.equal(restored.finance.lifestyle.debt,'321');assert.equal(restored.curiosity['curiosity-1'],5);
});
test('all reviewed careers get honest budget outlooks without probabilities or changes to interest analysis',()=>{
 const s=freshState(),before=analyze(s);s.guide.lifestylePreset='custom';s.finance.lifestyle=buildLifestyleInputs(complete());for(const id of salaryCareerIds){const fit=careerLifestyleFit(s,id);assert.ok(['early','tight','later','tradeoffs'].includes(fit.key),id);assert.equal(fit.stages.length,['physician','electrician','police','firefighter'].includes(id)?5:4);assert.doesNotMatch(fit.title,/\d+%/);assert.ok(careerLanguage[id]?.length===2,id);for(const line of careerLanguage[id])assert.ok(line.split(/\s+/).length<=20,id);}
 assert.deepEqual(analyze(s),before);assert.equal(careerLifestyleFit(s,'software').key,'tight');assert.equal(careerLifestyleFit(s,'tattoo').key,'tradeoffs');
});
test('visible lifestyle stories use broad pictures and weekly dinners, with exact budget detail preserved separately',()=>{
 const p=buildLifestyleInputs(complete()),story=lifestyleStory(p);assert.ok(story.tiles.length>=6);assert.match(story.tiles.find(t=>t.label==='Dinners out').title,/2–3 dinners a week/);for(const t of story.tiles)assert.doesNotMatch(t.title+t.copy,/\$|\d+\.\d+/);
});

 test('editing a lifestyle keeps existing pay and preserves separate entertainment and recreation choices',()=>{const b=complete(),old={gross:'123456',careerId:'software',band:'custom',netMode:'estimate',health:'310',retirement:'8',debt:'240'},p=buildLifestyleInputs(b,old);assert.equal(p.gross,'123456');assert.equal(p.careerId,'software');assert.equal(p.debt,'240');assert.equal(p.health,'310');assert.equal(lifestyleTally(p,b).total,lifestyleTally(p,b).rows.reduce((n,r)=>n+r.display,0));});

test('each new lifestyle question starts unselected while earlier choices remain available on Back',()=>{
 const s=freshState(),b=s.guide.lifestyleBuilder;
 for(let step=0;step<lifestyleChoices.length;step++){
  b.step=step;const html=guidePage('guide/lifestyle',s);
  assert.equal((html.match(/class="builder-option selected"/g)||[]).length,0,lifestyleChoices[step].id);
  assert.equal((html.match(/data-action="builder-pick"[^>]*aria-pressed="false"/g)||[]).length,5);
  assert.doesNotMatch(html,/Choose this|class="builder-pick"|More lavish|Keep it simple →|Safety first →/);
  b.choices[lifestyleChoices[step].id]=1;
 }
 b.step=3;const revisit=guidePage('guide/lifestyle',s);assert.equal((revisit.match(/class="builder-option selected"/g)||[]).length,1);assert.equal((revisit.match(/data-action="builder-pick"[^>]*aria-pressed="true"/g)||[]).length,1);assert.equal(b.choices.home,1);
});
