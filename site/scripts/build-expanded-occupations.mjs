import fs from'node:fs';import{degreeInventory}from'../dist/degree-inventory-data.js';
const records=degreeInventory.filter(o=>!o.guidedId).map(o=>({id:o.id,title:o.title,soc:o.soc,summary:o.summary,url:o.url,sourceURL:o.url,vector:o.vector,expandedDegree:true,fieldIds:o.families.map(f=>f.id),pathIds:[],requiresExperience:o.requiresExperience,experience:o.relatedExperience,preparation:{typicalEducation:[o.education],sourceURL:o.educationURL,mapping:o.educationMapping},educationGroup:o.educationGroup,jobZone:o.jobZone,tasks:o.tasks.map(t=>({text:t.text,source:o.url})),knowledge:o.knowledge.slice(0,4).map(x=>x.name),skills:o.skills.slice(0,4).map(x=>x.name),abilities:o.abilities.slice(0,3).map(x=>x.name),sources:[{url:o.url},{url:o.educationURL}],relatedIds:[],finance:null}));
fs.writeFileSync('dist/expanded-occupation-data.js','export const expandedOccupations='+JSON.stringify(records)+';\nexport const expandedOccupationById=id=>expandedOccupations.find(o=>o.id===id)||null;\n');
// Runtime questions and review holds always derive from the frozen research records.
const bank=JSON.parse(fs.readFileSync('research/expanded-top-047/question-bank.json'));
fs.writeFileSync('dist/expanded-question-bank.js','export const expandedQuestionBank='+JSON.stringify(Object.fromEntries(bank.rows.map(b=>[b.id,b])))+';\n');
const review=JSON.parse(fs.readFileSync('research/expanded-top-047/inference-review.json'));
fs.writeFileSync('dist/expanded-top-review-data.js','export const expandedInferenceReviewHolds='+JSON.stringify(review.holds)+';\n');
fs.appendFileSync('dist/expanded-top-review-data.js','export const expandedScopeReviews='+JSON.stringify(review.scopeReviews||[])+';\n');
