import fs from'node:fs';import{gunzipSync}from'node:zlib';
export function cohort056Cases(){const file='validation/cohort-056/index.json';if(!fs.existsSync(file))return[];return JSON.parse(fs.readFileSync(file)).cases.map(r=>JSON.parse(gunzipSync(fs.readFileSync(r.file))));}
