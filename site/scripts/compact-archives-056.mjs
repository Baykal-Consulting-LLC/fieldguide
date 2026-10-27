import{readChartJSON}from'./read-match-chart.mjs';
// Retain complete historical downloads while avoiding duplicate expanded files.
import fs from'node:fs';import{gzipSync,gunzipSync}from'node:zlib';import{createHash}from'node:crypto';import assert from'node:assert/strict';
for(const name of['expanded-calibration-2026-10-17.json','expanded-calibration-before-033-2026-10-18.json','legacy24-candidate-033-2026-10-18.json','student-models-032-2026-10-18.json','student-models-032-before-review-2026-10-18.json','commonness-directory-audit-2026-10-16.json','holdout-students-031-2026-10-17.json']){const raw=fs.readFileSync('validation/'+name),out='dist/developer/validation/'+name,compressed=gzipSync(raw,{level:9});assert.ok(gunzipSync(compressed).equals(raw));fs.writeFileSync(out+'.gz',compressed);fs.writeFileSync(out,JSON.stringify({historical:true,downloadURL:'./'+name+'.gz',sourceSHA256:createHash('sha256').update(raw).digest('hex'),note:'Complete original historical JSON is preserved in the compressed download. Current model results are in current-cohort-data.json.'}));}

// Historical reports are download-only; link directly to the byte-identical gzip originals.
// This retained scan is linked as a historical download only; no runtime fetch uses it.
const scanName='no-match-catalog-scan-038.json',scan=fs.readFileSync('validation/'+scanName),scanGzip=gzipSync(scan,{level:9});assert.ok(gunzipSync(scanGzip).equals(scan));
for(const folder of ['dist/developer','dist/developer/validation']){fs.writeFileSync(folder+'/'+scanName+'.gz',scanGzip);fs.writeFileSync(folder+'/'+scanName,JSON.stringify({historical:true,downloadURL:'./'+scanName+'.gz',sourceSHA256:createHash('sha256').update(scan).digest('hex'),note:'Complete original retained in the compressed historical download. Current results are in current-cohort-data.json.'}));}
const compressedNames=['legacy24-candidate-033-2026-10-18.json','student-models-032-2026-10-18.json','student-models-032-before-review-2026-10-18.json','commonness-directory-audit-2026-10-16.json','holdout-students-031-2026-10-17.json',scanName];
for(const path of fs.readdirSync('dist',{recursive:true}).filter(p=>p.endsWith('.html'))){const full='dist/'+path,original=fs.readFileSync(full,'utf8');let text=original;for(const name of compressedNames)text=text.replaceAll(name+'"',name+'.gz"');if(text!==original)fs.writeFileSync(full,text);}

// Whitespace-only compaction of large public JSON. Keep every field/value and original source.
for(const file of ['dist/expanded-calibration.json','dist/catalog-directory-review.json',
 ...fs.readdirSync('dist/developer/lives').filter(n=>n.endsWith('.json')).map(n=>'dist/developer/lives/'+n)]){
 const before=readChartJSON(file);if(JSON.parse(fs.readFileSync(file)).$compressedJSON)continue;const compact=JSON.stringify(before);fs.writeFileSync(file,compact);assert.deepEqual(JSON.parse(fs.readFileSync(file)),before);
}

// Download-only catalog audit: retain the exact original as gzip plus a small receipt.
// No runtime consumes this JSON; the catalog itself uses its separate reference assets.
{
 const file='dist/catalog-directory-review.json',parsed=JSON.parse(fs.readFileSync(file));
 if(!parsed.downloadURL){const raw=fs.readFileSync(file),packed=gzipSync(raw,{level:9});assert.ok(gunzipSync(packed).equals(raw));fs.writeFileSync(file+'.gz',packed);fs.writeFileSync(file,JSON.stringify({historical:true,downloadURL:'./catalog-directory-review.json.gz',sourceSHA256:createHash('sha256').update(raw).digest('hex'),note:'Complete original catalog audit preserved byte-for-byte in the gzip download. No matching or career inventory data changed.'}));}
}
