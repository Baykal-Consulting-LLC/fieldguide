import {readChartJSON}from'./read-match-chart.mjs';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {freshState} from '../dist/model.js';
import {journeyWalkthroughPage,walkthroughState} from '../dist/journey-walkthroughs.js';
import {profileJourneyHome,historicalProfileJourneyPage as profileJourneyPage,journeyPlanContext} from '../dist/profile-journey-ui.js';
import {transitionExamplePage} from '../dist/transition-example.js';
import {careerSwitchExamplePage} from '../dist/career-switch-example.js';
import {uncertaintyExamplesPage} from '../dist/uncertainty-examples.js';
import {sourceReviewPage} from '../dist/source-review.js';
import {catalogCoveragePage} from '../dist/catalog-coverage.js';
import {careerTreePage} from '../dist/career-tree.js';
import {profileQuestions,orderedProfileQuestions,makeJourneyPlan} from '../dist/profile-journey.js';
import {professionQuestions} from '../dist/profession-questions.js';
import {occupations} from '../dist/occupation-data.js';
import {careerLibraryPage} from '../dist/career-library-ui.js';
import {simpleCareerPage,personalPlanPage,guidePage,salaryPreviewPage} from '../dist/guide-ui.js';
import {salaryPreviewStages} from '../dist/salary-progression.js';
import {lifestyleChoices,buildLifestyleInputs} from '../dist/lifestyle-builder.js';
import {moneyPage} from '../dist/finance-ui.js';
export function auditStudentRendering(){
 const failures=[],counts={};let screens=0;
 function check(group,id,render){screens++;counts[group]=(counts[group]||0)+1;try{const html=render(),text=html.replace(/<[^>]*>/g,' ');if(!html.trim())throw Error('Empty screen');if(/\$\{|['"]\s*\+\s*(?:s\.|Object\.|h\()|\bundefined\b|\bNaN\b|\[object Object\]/.test(text))throw Error('Unrendered value or template expression');if(/(?:href|src)="(?:undefined|null|\[object Object\])/.test(html))throw Error('Invalid link');}catch(e){failures.push({group,id,message:e.message});}}
 check('start','blank',()=>profileJourneyHome(freshState()));
 check('plan','blank',()=>personalPlanPage(freshState()));
 for(const mode of ['college','training','saved'])check('library',mode,()=>careerLibraryPage('learn/'+mode,freshState()));
 for(const id of ['medicine','creative','trades']){const s=walkthroughState(id,{plan:true});
  for(let i=0;i<profileQuestions.length;i++){s.profileJourney.index=i;check('profile-question',id+'/'+orderedProfileQuestions(s)[i].id,()=>profileJourneyPage('journey/profile',s));}
  for(const part of ['profile-intro','pathways','professions','profile-review','research'])check('profile-results',id+'/'+part,()=>profileJourneyPage('journey/'+part,s));
  check('plan',id,()=>personalPlanPage(s)+journeyPlanContext(s));
  check('developer-walkthrough',id,()=>journeyWalkthroughPage(id));
 }
 for(const c of readChartJSON('dist/expanded-calibration.json').students){const s=walkthroughState(c.family==='creative'?'creative':'medicine');s.profileJourney.family=c.family;s.profileJourney.officialInterest.answers=structuredClone(c.answers);s.profileJourney.fieldPreferences=structuredClone(c.fieldWorkAnswers);s.profileJourney.depth[c.family]=structuredClone(c.followupAnswers);check('scenario-results',c.id,()=>profileJourneyPage('journey/pathways',s)+profileJourneyPage('journey/professions',s));}
 const s=walkthroughState('medicine');
 for(const [family,questions]of Object.entries(professionQuestions)){s.profileJourney.family=family;for(let i=0;i<questions.length;i++){s.profileJourney.depthIndexes[family]=i;check('profession-question',questions[i].id,()=>profileJourneyPage('journey/deeper',s));}}
 for(const o of occupations){check('career',o.id,()=>simpleCareerPage(o.id,s));check('library-career',o.id,()=>careerLibraryPage('learn/career/'+o.id,s));makeJourneyPlan(s,o.id);check('plan',o.id,()=>personalPlanPage(s));check('education',o.id,()=>guidePage('guide/education',s));for(const stage of salaryPreviewStages(o.id)){check('salary-lifestyle',o.id+'/'+stage.key,()=>salaryPreviewPage(o.id,stage.key,s,'plan'));check('library-salary',o.id+'/'+stage.key,()=>careerLibraryPage('learn/salary/'+o.id+'/'+stage.key,s));}}
 for(const homeMode of ['rent','own'])for(const c of lifestyleChoices){const options=homeMode==='own'&&c.ownOptions?c.ownOptions:c.options;for(let i=0;i<options.length;i++){const state=walkthroughState('creative'),b=state.guide.lifestyleBuilder;b.homeMode=homeMode;b.step=lifestyleChoices.indexOf(c);b.choices[c.id]=i;state.finance.lifestyle=buildLifestyleInputs(b,state.finance.lifestyle);check('lifestyle-choice',homeMode+'/'+c.id+'/'+i,()=>guidePage('guide/lifestyle',state)+guidePage('guide/lifestyle-summary',state));}}
 for(const [id,render]of [['transition',transitionExamplePage],['switch',careerSwitchExamplePage],['finance',sourceReviewPage],['coverage',catalogCoveragePage],['tree',careerTreePage],...['mixed','low-confidence','not-sure'].map(id=>[id,()=>uncertaintyExamplesPage(id)])])check('developer-review',id,render);
 for(const business of [false,true])check('finance',String(business),()=>moneyPage(freshState(),business));
 return {checkedAt:new Date().toISOString(),scope:'Rendered HTML values and links across enumerated student screens. Not a browser accessibility test or validation of career guidance.',screens,counts,failures};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){const report=auditStudentRendering();fs.writeFileSync('validation/student-rendering-audit-2026-10-17.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));if(report.failures.length)process.exitCode=1;}
