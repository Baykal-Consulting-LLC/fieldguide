import test from 'node:test';
import assert from 'node:assert/strict';
import {explorerCatalog} from '../dist/open-explorer.js';
import {salaryProgression} from '../dist/salary-progression.js';
import {completeSalaryProgression084} from '../dist/complete-salaries-084.js';
import {boardOffer} from '../dist/results-board-data.js';
import {expandedPayPanel} from '../dist/expanded-pay-ui.js';
import {degreeCard} from '../dist/degree-inventory-ui.js';
import {degreeInventory} from '../dist/degree-inventory-data.js';
import {freshState} from '../dist/model.js';
import {explorerBudget} from '../dist/explorer-053-budget.js';
test('every one of 457 careers has finite salary scenarios and attributable sources on the results board',()=>{
 assert.equal(explorerCatalog.length,457);
 for(const o of explorerCatalog){const p=completeSalaryProgression084(o),b=boardOffer(o);assert.ok(p,o.id);assert.equal(p.stages.length,4);for(const s of p.stages)assert.ok(Number.isFinite(s.amount)&&s.amount>0,o.id);assert.equal(b.entry,p.stages[0].amount,o.id);assert.equal(b.year5,p.stages[1].amount,o.id);assert.ok(b.paySources.length&&b.paySources.every(s=>s.url.startsWith('https://')),o.id);if(p.planningOnly){assert.ok(p.notes.some(n=>n.includes('not measured starting pay')));assert.ok(p.notes.some(n=>n.includes('first-paid-stage lifestyle coverage')));}}
});
test('existing salary schedules remain exact and fallback display cannot establish supported lifestyle coverage',()=>{
 const s=freshState();for(const o of explorerCatalog){const original=salaryProgression(o.id),before=explorerBudget(s,o);if(original)assert.deepEqual(completeSalaryProgression084(o),original);completeSalaryProgression084(o);assert.deepEqual(explorerBudget(s,o),before);}
});
test('all 404 degree-inventory entries resolve their own or guided salary identity',()=>{assert.equal(degreeInventory.length,404);for(const o of degreeInventory){assert.ok(completeSalaryProgression084(o),o.id);assert.match(degreeCard(o,false),/Qualified-role estimate/,o.id);}});
test('formerly blank specialist pages and inventory cards show estimates and disclose the basis',()=>{
 for(const id of ['degree-19201100','degree-29102300','degree-29201101','degree-13202200']){const o=explorerCatalog.find(o=>o.id===id),html=expandedPayPanel(freshState(),o);assert.match(html,/\$[\d,]+/);assert.match(html,/Estimate basis and source/);const card=degreeCard(degreeInventory.find(o=>o.id===id),false);assert.match(card,/Qualified-role estimate/);assert.match(card,/Pay source/);}
 assert.equal(completeSalaryProgression084('degree-29201101').sharedWageScope,'Broader occupation wage group; specialist earnings can differ.');
 assert.equal(completeSalaryProgression084('degree-29102300').geography,'United States');
});
