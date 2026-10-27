import fs from 'node:fs';
import assert from 'node:assert/strict';
import {explorerCatalog} from '../dist/open-explorer.js';
import {salaryProgression} from '../dist/salary-progression.js';
import {expandedPayEvidence} from '../dist/expanded-pay.js';
const table=k=>new Map(JSON.parse(fs.readFileSync('data-sources/twc-2025-msa-'+k+'.json')).map(r=>[r.soc,r]));
const med=table('median'),entry=table('entrywg');
// Explicit SOC aggregation crosswalks; never infer occupational identity from a title substring.
const crosswalk={'13-1021':'13-1020','13-1022':'13-1020','13-1023':'13-1020','13-2022':'13-2020','13-2023':'13-2020','21-1011':'21-1018','25-2055':'25-2052','25-2056':'25-2052','29-2011':'29-2010','29-2012':'29-2010'};
const national={
 '19-2011':{median:128820,url:'https://www.bls.gov/ooh/life-physical-and-social-science/physicists-and-astronomers.htm'},
 '19-3041':{median:106030,url:'https://www.bls.gov/ooh/life-physical-and-social-science/sociologists.htm'},
 '25-1043':{median:101420,url:'https://www.bls.gov/ooh/education-training-and-library/postsecondary-teachers.htm'},
 '29-1023':{median:289140,url:'https://www.bls.gov/ooh/healthcare/dentists.htm'},
 '29-1024':{median:311180,url:'https://www.bls.gov/ooh/healthcare/dentists.htm'}
};
const areas={austin:'Austin metro',statewide:'Texas statewide',dallas:'Dallas–Fort Worth metro',houston:'Houston metro',sanantonio:'San Antonio metro',lubbock:'Lubbock metro',beaumont:'Beaumont metro',corpus:'Corpus Christi metro',killeen:'Killeen metro',tyler:'Tyler metro'};
const out={};
for(const o of explorerCatalog){
 if(salaryProgression(o.id))continue;
 const e=expandedPayEvidence(o.id),soc=o.soc.slice(0,7),wageSOC=crosswalk[soc]||soc,m=med.get(wageSOC),w=entry.get(wageSOC),area=Object.keys(areas).find(k=>m?.[k]>0),n=national[soc];
 const median=e?.median>0?e.median:area?m[area]:n?.median;
 const amount=e?.amount>0?e.amount:area&&w?.[area]>0?w[area]:Number.isFinite(median)?Math.round(median*.68):null;
 assert.ok(amount>0&&median>0,'Missing sourced salary anchor: '+o.id);
 const modeledEntry=!(e?.amount>0||area&&w?.[area]>0),broader=!!crosswalk[soc]||!o.soc.endsWith('.00')||/broader/i.test(e?.mapping||'');
 out[o.id]={amount,median,modeledEntry,broader,wageSOC,wageTitle:e?.wageTitle||m?.socTitle||o.title,geography:e?.geography||(area?areas[area]:'United States'),referencePeriod:e?.referencePeriod||'May 2025',sourceURL:e?.sourceURL||(area?'https://texaswages.com/MSAWages/MSASocDetails?soc='+wageSOC+'&wgeType=median':n.url),publisher:e?.sourceURL?.includes('onet')?'U.S. Department of Labor':area?'Texas Workforce Commission':'U.S. Bureau of Labor Statistics',entryComparable:!!e?.entryComparable,checkedAt:'2026-10-21'};
}
fs.writeFileSync('dist/complete-salary-data-084.js','// Generated from official wage anchors; display estimates do not change match evidence or budget eligibility.\nexport const completeSalaryData084='+JSON.stringify(out)+';\n');
fs.mkdirSync('research/salary-084',{recursive:true});
fs.writeFileSync('research/salary-084/coverage.json',JSON.stringify({total:explorerCatalog.length,existingTimelines:explorerCatalog.length-Object.keys(out).length,addedTimelines:Object.keys(out).length,missing:0,modeledEntries:Object.entries(out).filter(([,v])=>v.modeledEntry).map(([id])=>id),crosswalk,national,rows:out},null,2)+'\n');
console.log('Complete salary coverage:',explorerCatalog.length,'/',explorerCatalog.length);
