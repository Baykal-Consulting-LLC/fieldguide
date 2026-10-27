import fs from'node:fs';import{gunzipSync,gzipSync}from'node:zlib';
const review=JSON.parse(fs.readFileSync('research/executor-077/selected-review.json')),d=JSON.parse(gunzipSync(fs.readFileSync('research/executor-077/results.json.gz'))),summary=JSON.stringify(d.summary);
for(const r of d.rows)r.selectedReview=review.cases.filter(c=>c.modelId===r.id);
d.selectedReview={reviewType:review.reviewType,scope:review.scope,policy:review.policy};
if(JSON.stringify(d.summary)!==summary)throw Error('Selected review changed raw counts');
fs.writeFileSync('dist/developer/executor-comparison-077.json.gz',gzipSync(JSON.stringify(d),{level:9}));fs.writeFileSync('dist/developer/executor-selected-review-077.json',JSON.stringify(review));
console.log('Annotated selected primary cases; all raw answers, career lists and counts unchanged.');
