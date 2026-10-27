import fs from'node:fs';
export function newCohortCases(){const file='validation/cohort-049/index.json';if(!fs.existsSync(file))return[];return JSON.parse(fs.readFileSync(file)).cases.map(r=>JSON.parse(fs.readFileSync('validation/cohort-049/'+r.id+'.json')));}
