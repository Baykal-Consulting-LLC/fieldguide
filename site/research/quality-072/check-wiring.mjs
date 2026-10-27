// Isolated read-only interface probes, not added cohort profiles or model answers.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {researchRows071,evidenceQuestions071,specialtyQuestions071,activityBank071} from '../../prototypes/evidence-071/engine.mjs';
const empty={yes:{},no:{}},answer=q=>({selected:[q.options[0].id],feedback:null,source:'student',confidence:'high',evidence:'Explicit choice in an isolated interface probe'});
const row=(id,guard=false)=>({id,specific:{supported:guard,specificDomains:['domain','method'],taskDomains:[],taskDomainCount:0,evidence:[],contrary:[],missing:guard?[]:[{id:'unresolved'}],requirement:'Three distinct defining interests'}});
const evidence=evidenceQuestions071.map(q=>{const rs=[row(q.careerIds[0])],before=researchRows071(rs,{},empty,{}),after=researchRows071(rs,{[q.id]:answer(q)},empty,{});assert.deepEqual(after,before);return{id:q.id,positiveChoiceConsumed:false};});
const contexts=specialtyQuestions071.map(q=>{const rs=[row(q.careerIds[0],true)],before=researchRows071(rs,{},empty,{}),after=researchRows071(rs,{[q.id]:answer(q)},empty,{});assert.equal(before[0].specific.supported,false);assert.equal(after[0].specific.supported,true);return{id:q.id,positiveChoiceConsumed:true};});
const activities=activityBank071.map(q=>{const rs=[row(q.careerIds[0])],after=researchRows071(rs,{[q.id]:answer(q)},empty,{});assert.ok(after[0].specific.taskDomains.includes(q.domain));return{id:q.id,positiveChoiceConsumed:true};});
fs.writeFileSync(new URL('./wiring-check.json',import.meta.url),JSON.stringify({scope:'Isolated interface probes only; no cohort inputs changed',evidence,contexts,activities},null,2));
console.log({evidenceIgnored:evidence.length,contextsConsumed:contexts.length,activitiesConsumed:activities.length});
