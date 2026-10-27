import fs from 'node:fs';
import crypto from 'node:crypto';
import {careers} from '../dist/finance-data.js';
import {commonEntryWages} from '../dist/common-career-data.js';
import {twcEntryWages} from '../dist/twc-entry-wages.js';
const file='data-sources/twc-2025-msa-experience.json',data=JSON.parse(fs.readFileSync(file)),out={};
for(const c of careers){const entry=commonEntryWages[c.id]||twcEntryWages[c.id],soc=entry?.soc||c.earnings.wageSOC||c.soc?.slice(0,7),row=data.find(r=>r.soc===soc);const geography=c.earnings.geography?.startsWith('Dallas')?'dallas':c.earnings.geography?.startsWith('Houston')?'houston':'austin';const experienced=row?.[geography];if(experienced>0&&c.id!=='tattoo')out[c.id]={amount:experienced,soc,geography,method:'mean_upper_paid_two_thirds',sourceURL:'https://texaswages.com/MSAWages/MSASocDetails?soc='+soc+'&wgeType=experience',referencePeriod:'2025 annual wages',dollarYear:2025};}
fs.writeFileSync('dist/earnings-evidence.js','// Published occupation-specific TWC experienced-wage anchors; not exact-year earnings.\nexport const experiencedWages='+JSON.stringify(out)+';\nexport const experiencedMetadata='+JSON.stringify({publisher:'Texas Workforce Commission',dataURL:'https://texaswages.com/api/MSAAnnual/experience',definitionURL:'https://texaswages.com/Home/About',sourceSHA256:crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),checkedAt:'2026-10-17',records:Object.keys(out).length})+';\n');
console.log('Built '+Object.keys(out).length+' published experienced-wage anchors. Other careers use their sourced local median or posting benchmark.');
