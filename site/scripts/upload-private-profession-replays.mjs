import {createHash} from 'node:crypto';import fs from 'node:fs';import assert from 'node:assert/strict';
import {firebaseAdmin} from './firebase-admin.mjs';
const rows=JSON.parse(fs.readFileSync('../analysis/profession-replay-041/private-replays.json'));
assert.equal(rows.length,6);const project='fieldguide-personal-d3b71',admin=await firebaseAdmin(project),base='https://firestore.googleapis.com/v1/projects/'+project+'/databases/(default)/documents/developerReviews';
const checks=[];for(const replay of rows){assert.match(replay.id,/^private-00[1-6]$/);const url=base+'/'+replay.id,old=await admin.request(url),payload=old.fields.payload.stringValue;assert.equal(createHash('sha256').update(JSON.stringify(JSON.parse(payload))).digest('hex'),replay.sourceSHA256,'Private source differs from the authoring baseline');
 await admin.request(url+'?updateMask.fieldPaths=professionReplay&currentDocument.updateTime='+encodeURIComponent(old.updateTime),{method:'PATCH',body:{fields:{professionReplay:{stringValue:JSON.stringify(replay)}}}});
 const verified=await admin.request(url);assert.equal(verified.fields.payload.stringValue,payload);assert.deepEqual(JSON.parse(verified.fields.professionReplay.stringValue),replay);checks.push({id:replay.id,readback:true,originalPayloadUnchanged:true});}
fs.writeFileSync('../analysis/profession-replay-041/private-upload-receipt.json',JSON.stringify({at:new Date().toISOString(),project,ownerOnly:true,studentGuidesUnchanged:true,checks},null,2)+'\n');console.log({updated:checks.length,originalPayloadsUnchanged:true,studentGuidesUnchanged:true});
