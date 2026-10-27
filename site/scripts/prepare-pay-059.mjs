import fs from'node:fs';
import assert from'node:assert/strict';
import{createHash}from'node:crypto';
import{explorerCatalog}from'../dist/open-explorer.js';
import{qualifiedEntrySOCs059}from'../research/improvements-059/pay-policy.mjs';
const read=p=>JSON.parse(fs.readFileSync(p)),table=k=>new Map(read('data-sources/twc-2025-msa-'+k+'.json').map(r=>[r.soc,r]));
const entry=table('entrywg'),med=table('median'),out={};
for(const o of explorerCatalog.filter(o=>o.expandedDegree)){
 const soc=o.soc.slice(0,7),r=entry.get(soc),m=med.get(soc),area=r?.austin>0?'austin':r?.statewide>0?'statewide':null;if(!area)continue;
 const entryComparable=qualifiedEntrySOCs059.has(o.soc)&&!o.requiresExperience&&o.experience==='None'&&o.preparation.mapping==='exact detailed SOC';
 const note=entryComparable?'Qualified-entry planning proxy after the required education, any licensing and employer requirements. TWC lower-paid-third average is not an observed starting salary; paid study, internships and training costs are unassessed.':'Occupational wage context only. Specialty, experience or earlier paid preparation has not been established; do not use this amount as first-job income.';
 out[o.id]={amount:r[area],median:m?.[area]??null,p25:null,p10:null,geography:area==='austin'?'Austin metro':'Texas statewide',geographyFallback:area!=='austin',referencePeriod:'2025 annual wage estimates',method:'TWC mean of lowest-paid third',entryComparable,firstPaidStageVerified:false,trainingCostVerified:false,sourceURL:'https://texaswages.com/MSAWages/MSASocDetails?soc='+soc+'&wgeType=entrywg',methodologyURL:'https://texaswages.com/Home/About',wageSOC:soc,wageTitle:r.socTitle,mapping:o.soc.endsWith('.00')?'Exact detailed occupational wage group':'Broader SOC wage group; specialty pay not established',qualificationReview:{note,firstPaidStageVerified:false},limitations:[note,'Employee wages do not measure self-employment profit. Wage geography can differ from a model’s background; the replay retains its existing Austin budget scenario.'],checkedAt:'2026-10-20',policy:'pay-059'};
 assert.ok(!entryComparable||o.soc.endsWith('.00'));
}
const sourceFiles=['data-sources/twc-2025-msa-entrywg.json','data-sources/twc-2025-msa-median.json'];
fs.writeFileSync('dist/pay-059-data.js','// Official cached 2025 TWC wage evidence; authored proxy eligibility is explicit.\nexport const pay059Data='+JSON.stringify(out)+';\n');
fs.writeFileSync('research/improvements-059/pay-receipt.json',JSON.stringify({checkedAt:'2026-10-20',methodologyURL:'https://texaswages.com/Home/About',sourceFiles:Object.fromEntries(sourceFiles.map(p=>[p,createHash('sha256').update(fs.readFileSync(p)).digest('hex')])),contextualReferences:Object.keys(out).length,qualifiedEntryProxyCandidates:Object.values(out).filter(r=>r.entryComparable).length,policy:'Explicit allowlist, exact wage/education mapping, no related experience. Existing reviewed pay-050 evidence takes precedence. Context is not permission to claim entry coverage.',rows:out},null,2)+'\n');
console.log('Pay evidence 059:',Object.keys(out).length,'contextual references;',Object.values(out).filter(r=>r.entryComparable).length,'qualified-entry proxy candidates.');
