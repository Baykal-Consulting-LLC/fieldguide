// Preserve the complete older study while avoiding an expanded duplicate in the
// static archive. The historical reader already uses the shared gzip loader.
import fs from 'node:fs';
import {gzipSync,gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const path='dist/developer/explorer-053-data.json',raw=fs.readFileSync(path),data=JSON.parse(raw);
if(!data.historical){const gz=gzipSync(raw,{level:9});assert.ok(gunzipSync(gz).equals(raw));fs.writeFileSync(path+'.gz',gz);fs.writeFileSync(path,JSON.stringify({historical:true,downloadURL:'./explorer-053-data.json.gz',sourceSHA256:createHash('sha256').update(raw).digest('hex'),note:'The complete original 0.53 study is retained in the compressed download. Current model results are in current-cohort-data.json.'}));}

const metadataPath="dist/developer/validation/explorer-053.json";
if(fs.existsSync(metadataPath)){const meta=JSON.parse(fs.readFileSync(metadataPath));meta.rowsURL="../explorer-053-data.json.gz";fs.writeFileSync(metadataPath,JSON.stringify(meta));}

// 0.73 retains the full earlier broad-exploration study as a byte-exact download.
// No current matching code reads this historical data file; its published
// validation metadata links to the compressed payload.
const broadPath='dist/developer/broad-exploration-051-data.json';
if(fs.existsSync(broadPath)){
 const original=fs.readFileSync(broadPath),parsed=JSON.parse(original);
 if(!parsed.historical){const compressed=gzipSync(original,{level:9});assert.ok(gunzipSync(compressed).equals(original));fs.writeFileSync(broadPath+'.gz',compressed);fs.writeFileSync(broadPath,JSON.stringify({historical:true,downloadURL:'./broad-exploration-051-data.json.gz',sourceSHA256:createHash('sha256').update(original).digest('hex'),note:'Complete historical 0.51 replay retained byte-for-byte in the compressed download.'}));}
 const metaPath='dist/developer/validation/broad-exploration-051.json';
 if(fs.existsSync(metaPath)){const meta=JSON.parse(fs.readFileSync(metaPath));meta.rowsURL='../broad-exploration-051-data.json.gz';fs.writeFileSync(metaPath,JSON.stringify(meta));}
}

// Preserve the complete historical 0.52 transcript byte-for-byte while making
// room for the separate blind cohort. Its live replay module is unrelated.
const followupPath='dist/developer/broad-followups-052-data.json';
if(fs.existsSync(followupPath)){
 const original=fs.readFileSync(followupPath),parsed=JSON.parse(original);
 if(!parsed.historical){const gz=gzipSync(original,{level:9});assert.ok(gunzipSync(gz).equals(original));fs.writeFileSync(followupPath+'.gz',gz);fs.writeFileSync(followupPath,JSON.stringify({historical:true,downloadURL:'./broad-followups-052-data.json.gz',sourceSHA256:createHash('sha256').update(original).digest('hex'),note:'Complete historical 0.52 replay retained byte-for-byte in the linked compressed download.'}));}
 const metaPath='dist/developer/validation/broad-followups-052.json';if(fs.existsSync(metaPath)){const meta=JSON.parse(fs.readFileSync(metaPath));meta.rowsURL='../broad-followups-052-data.json.gz';fs.writeFileSync(metaPath,JSON.stringify(meta));}
 const doc='dist/developer/docs/broad-followups-052-2026-10-19.md.html';if(fs.existsSync(doc)){let html=fs.readFileSync(doc,'utf8');const link='<p><a href="../broad-followups-052-data.json.gz">Download the complete historical 0.52 replay →</a></p>';if(!html.includes(link))fs.writeFileSync(doc,html.replace('<pre class="document">',link+'<pre class="document">'));}
}
