import{fileURLToPath}from'node:url';import fs from'node:fs';import path from'node:path';import assert from'node:assert/strict';import{createHash}from'node:crypto';import{gunzipSync}from'node:zlib';
const sha=b=>createHash('sha256').update(b).digest('hex');
// Historical payloads remain byte-identical inside gzip containers. A tiny
// receipt at the former URL identifies the full payload and its original hash.
export function readChartBytes(file,depth=0){file=file instanceof URL?fileURLToPath(file):file;assert.ok(depth<4,'Recursive JSON receipt');let raw=fs.readFileSync(file);if(raw[0]===31&&raw[1]===139)raw=gunzipSync(raw);if(raw.subarray(0,80).toString().startsWith('{"$compressedJSON":"gzip-v1"')){const receipt=JSON.parse(raw),payload=readChartBytes(path.resolve(path.dirname(file),receipt.payloadURL),depth+1);assert.equal(sha(payload),receipt.sha256,file+' archived payload hash');assert.equal(payload.length,receipt.uncompressedBytes);return payload;}return raw;}
export const readChartJSON=file=>JSON.parse(readChartBytes(file));
// Read every public row from the same historical manifest. No private rows.
export function readMatchChart(file='dist/developer/model-match-chart-data.json'){
 const snapshot=readChartJSON(file),rows=[...snapshot.rows];for(const part of snapshot.rowParts||[]){const raw=readChartBytes(path.resolve(path.dirname(file),part.url)),data=JSON.parse(raw);assert.equal(sha(raw),part.sha256);assert.equal(data.version,snapshot.version);assert.equal(data.generatedAt,snapshot.generatedAt);assert.equal(data.rows.length,part.rows);rows.push(...data.rows);}assert.equal(new Set(rows.map(r=>r.id)).size,rows.length);assert.ok(rows.every(r=>!r.id.startsWith('private-')));return{...snapshot,rows};
}
