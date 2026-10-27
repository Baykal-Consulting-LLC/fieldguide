import test from 'node:test';
import assert from 'node:assert/strict';
import {careers,wageValue,wageCenter,wageOptions} from '../dist/finance-data.js';
import {AUSTIN_WAGE_RELEASE} from '../dist/austin-wages.js';
import {freshFinance,cleanFinance} from '../dist/finance.js';
import {freshLifestyle} from '../dist/lifestyle.js';
import {careerDetail} from '../dist/context-ui.js';
import {lifestyleScope} from '../dist/lifestyle-ui.js';
import {freshState} from '../dist/model.js';
test('every saved career wage band refreshes to Austin without overwriting personal spending or custom income',()=>{
 for(const c of careers)for(const band of ['p25','median','p75']){
  const f=cleanFinance({lifestyle:{...freshLifestyle(),careerId:c.id,band,gross:'999999',wageRelease:'',rent:'1234'}});
  assert.equal(f.lifestyle.gross,String(wageValue(c.earnings,c.id==='tattoo'?'median':band)));assert.equal(f.lifestyle.rent,'1234');assert.equal(f.lifestyle.wageRelease,AUSTIN_WAGE_RELEASE);
 }
 const f=cleanFinance({lifestyle:{...freshLifestyle(),careerId:'software',band:'custom',gross:'54321',wageRelease:''}});assert.equal(f.lifestyle.gross,'54321');
 const current=freshFinance();current.lifestyle.careerId='software';current.lifestyle.band='median';current.lifestyle.gross='134120';assert.deepEqual(cleanFinance(current),current);
});
test('all careers have a planning income, with explicit source types and no national fallback',()=>{
 assert.deepEqual(careers.filter(c=>c.earnings.status!=='sourced').map(c=>c.id),['tattoo']);
 for(const c of careers.filter(c=>c.earnings.status==='sourced')){assert.match(c.earnings.sourceURL,/\?(st=TX|zip=75201)$/);assert.match(c.earnings.geography,/Austin/);assert.equal(c.earnings.soc,c.soc);}
 for(const c of careers){assert.ok(wageCenter(c.earnings)>0);const html=careerDetail(c.id,freshState());assert.doesNotMatch(html,/check local|verify locally|select a jurisdiction/i);assert.match(html,/class="more-info"/);assert.match(html,/Texas requirements|TEXAS REQUIREMENTS/);}
});
test('posting averages and city alternatives remain distinct from observed Austin employee medians',()=>{
 const p={...freshLifestyle(),careerId:'software',gross:'80000'};assert.match(lifestyleScope(p),/Custom income/);assert.match(lifestyleScope(p),/\$80,000/);
 assert.match(lifestyleScope({...p,careerId:'tattoo',band:'median',gross:'65395'}),/Austin posting estimate/);
 const w=careers.find(c=>c.id==='tattoo').earnings;assert.deepEqual(wageOptions({earnings:w}).map(([id])=>id),['median','dallas','houston','custom']);assert.equal(wageValue(w,'dallas'),63259);assert.equal(wageValue(w,'houston'),62774);for(const band of ['dallas','houston']){const f=cleanFinance({lifestyle:{...freshLifestyle(),careerId:'tattoo',band,wageRelease:''}});assert.equal(f.lifestyle.gross,String(wageValue(w,band)));}
});
