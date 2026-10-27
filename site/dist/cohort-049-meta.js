// Reporting metadata only. These labels and populations do not enter matching.
export const newCohortLabels={'development049':'New 0.49 · development','holdout049':'Fresh 0.49 · holdout','diagnostic049':'Diagnostic variants · paired controls','development056':'Additional structured development','holdout056':'New holdout · fixed-rule evaluation'};
export const isDiagnostic=row=>row.phase==='diagnostic049'||row.cohort049?.kind==='diagnostic';
export function selectCohortPopulation(rows,cohort='all'){return rows.filter(r=>cohort==='all'?!isDiagnostic(r):cohort==='all-rows'?true:r.phase===cohort);}
export const experienceKeys=['reasoning','numbers','words','visual','practical','people','organizing','science','precision','collaboration','learning','digital'];
export function authoredExperience(c){return Array.isArray(c.response?.experience)&&c.response.experience.length===12?Object.fromEntries(experienceKeys.map((k,i)=>[k,c.response.experience[i]])):{};}
export const priorityLabels={curiosity:'Keep learning',creativity:'Make something original',impact:'Make a difference',independence:'Find my own way',community:'Feel connected',stability:'Build a steady foundation',variety:'Welcome variety',mastery:'Go deep'};
