import fs from 'node:fs';import {gunzipSync,gzipSync} from 'node:zlib';
const read=p=>JSON.parse(p.endsWith('.gz')?gunzipSync(fs.readFileSync(p)):fs.readFileSync(p)),d=read('dist/developer/evidence-benchmark-075.json.gz'),q=read('calibration/grok-075/quality.json'),contract=read('calibration/grok-075/generation-contract.json'),seal=read('calibration/grok-075/sealed.json');
const groups={all:'Original full cohort',development:'Original development',holdout:'Original holdout',holdout049:'Previously fresh holdout',holdout056:'Expanded holdout',grok075:'New independent Grok holdout'};
const table=Object.entries(groups).map(([g,label])=>{const s=d.summary[g];return `| ${label} | ${s.models} | ${s.beforeTop} / ${s.beforeDegree} | ${s.priorTop} → ${s.afterTop} | ${s.priorDegree} → ${s.afterDegree} | ${s.priorGraduate} → ${s.afterGraduate} | ${s.priorCovers} → ${s.afterCovers} |`;}).join('\n');
const text=`# Reviewed evidence and independent whole-profile holdout · 0.75

Research comparison only. The live student flow, current 0.63 outputs, scoring, ranking, three-Top cap, pay, budgets and education routes remain unchanged.

## Paired outcomes

| Cohort | Models | Current matcher Top / degree | Supported Top | Bachelor / graduate Top | Graduate Top | Top covers reference lifestyle |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
${table}

Every comparison uses the same frozen answers within its cohort. The new 1,000 are never added to the original 1,000 denominator. Bachelor/graduate means a recognized college or graduate route; associate/specialist routes remain separate. All education levels and existing earnings estimates are available in the chart.

## Why the original research counts fell

The audit narrowed ${d.optionAudit.filter(x=>x.correction).length} exact activity-option implications among ${d.optionAudit.length} reviewed options. Community planning no longer implies numerical analysis; a repeatable routine no longer implies lab procedures; digital changes do not imply writing code; useful-object design does not imply moving mechanisms; a disjunction including images, movement, light or sound does not establish filmed-media interest. Independently supplied, correctly scoped evidence survives.

Thirty previously supported original-cohort career claims relied on removed implications. Seven models lose all supported Top; ten lose a degree Top. This is an evidence correction, not weaker thresholds to preserve a target number. Original profiles and raw answer transcripts remain intact in the retained 0.73 download. The three reviewed disagreements (Evelyn, Alexei and Alex) now remain unresolved for the disputed profession.

## Narrower follow-ups

${d.questionBank.map(x=>'- '+x.prompt).join('\n')}

These are authored occupational-task diagnostic drafts, not independently validated scale items. At most four are offered. The second question in a pair is offered only after an interested first response. Explicit No, Unsure, review holds and contrary answers remain protected. Targeting cannot see a predicted answer, demographic, degree preference or pay.

Original cohort: ${d.summary.all.followups} offered, ${d.summary.all.positiveActivities} positive, ${d.summary.all.unknownActivities} unknown. None of the missing narrower interests was invented. New blind holdout: ${d.summary.grok075.followups} offered, ${d.summary.grok075.positiveActivities} positive, ${d.summary.grok075.unknownActivities} unknown, ${d.summary.grok075.neutralActivities} neutral, ${d.summary.grok075.negativeActivities} negative. Grok supplied all six responses before targeting; the selector only reads an answer when its item is selected.

## How the independent 1,000 were created

Installed Grok CLI, default configured model, independent one-turn sessions with tools, web and subagents disabled. It received a neutral questionnaire and fictional-profile contract. It received no repository, occupation inventory, matching rules, weights, prior profiles, recommendations or outcomes. Fifty twenty-profile groups were retained after structural validation. One partial group supplied seven profiles; an independent completion session authored the thirteen missing IDs, with both responses retained. Schema failures were retried or repaired by Grok without career feedback. Malformed general-answer arrays were re-answered by exact item ID from the same profile; uncertain interests stay unsure. The repair transcript is retained. Categorical schema repairs by Grok preserved the raw descriptions and all interest answers; ${q.categoryRepairs.length} categorical fields were repaired before sealing. The raw accepted generation responses and generation contract remain in the source repository.

Whole profiles vary interests, working methods, strengths/developing skills, confidence, exposure, motivations, education openness, preferred context, wellbeing/support, school and family opportunity, constraints and lifestyle aspirations together. Interests do not assert skill. Unfamiliar specialist preferences remain unknown. Demographic and mental-health prose never becomes career evidence through word matching. Qualitative strengths/context are inspectable, not turned into invented numerical aptitude scores.

The race/ethnicity marginal approximates US public-school enrollment, based on [NCES fall 2022 enrollment](https://ies.ed.gov/learn/press-release/public-school-fall-2022-enrollment-counts-remain-below-fall-2019). Ages and all other whole-profile distributions are design choices. This is diverse synthetic coverage, not a statistically representative joint US population or a prevalence study.

Before matching, the input-quality audit found ${q.checks.uniqueCompletePreferences} distinct complete preference transcripts and ${q.checks.uniqueNarratives} distinct narratives; ${q.checks.topicCoverage}/${q.checks.totalTopics} activity topics and ${q.checks.methodCoverage}/${q.checks.totalMethods} methods have positive examples. ${q.warnings.filter(w=>w.type.includes('coexists')).length} cross-answer flag and ${q.warnings.filter(w=>w.type==='Short whole-profile description').length} unspecified developing-skill descriptions are retained, not hidden. Before sealing, Grok reviewed ${q.coherenceClarifications.length} cross-answer conflicts; ${q.coherenceClarifications.filter(c=>c.value===0&&c.original>=4).length} unsupported positive answers became unknown, with original values and explanations retained. No positive interests were added by the coherence review. A deterministic semantic sample is separately documented. Automated checks cannot establish psychological validity.

Profile SHA-256: ${seal.sha256}. Policy SHA-256: ${d.freezeSHA256}. The policy was frozen before the first outcomes and not retuned on the new holdout. Previously inspected old holdouts remain diagnostic.

## Question-scope issue to fix before live adoption

A synthetic counterexample found before blind outcomes shows that a negative plant-cutting response can withdraw Biological Technician support grounded in other biological interests. This contextual example does not represent every valid context for that profession. The frozen policy is retained in this first independent holdout run; it was not silently retuned. ${d.scopeReview.length} new-holdout career claims were withdrawn after a negative contextual diagnostic and need review, including ${d.scopeReview.filter(x=>x.plantContextMissing).length} plant-related withdrawals without a positive plant activity in the profile. These are software outputs, not proof that the career is a poor fit.

The next correction should restrict contextual item targeting to relevant existing activities and keep a scoped negative separate from a career-wide rejection. It must preserve independent evidence, explicit No/Unsure/holds and unknown interests. Evaluate that correction separately; do not call a post-inspection rerun a fresh blind validation.

## Important interpretation limits

A fresh synthetic holdout is independent profile authoring, not an independently observed career-fit criterion. The neutral activity responses are replayed through a fixed structured adapter for comprehensive subject-aligned question coverage. Most profession-specific responses are derived from these structured answers, not independently answered by real students. Broad correlation, domain rules and source reuse can still be wrong. This does not complete external psychometric or real-student validation.

Housing mode is held at renting for this paired comparison; ownership preference was not collected. The nine lifestyle-choice levels vary. Numeric skill/experience ratings were not collected and remain unknown; varied narrative strengths are not converted into aptitude scores.

US profiles use the same existing Austin reference lifestyle/pay conventions. This is not geographically adjusted affordability. Missing or experience-gated earnings remain unassessed; they are not guaranteed starting salaries.

## Inspect the evidence

- [Dashboard](../performance/)
- [Original comparison chart](../model-match-chart.html#evidence-benchmark)
- [Separate new blind cohort](../model-match-chart.html?researchCohort=grok075&researchFilter=all#evidence-benchmark)
- [Complete research replay](../evidence-benchmark-075.json.gz)
- [Whole profiles, neutral questionnaire and input quality](../grok-075-inputs.json.gz)
- [Retained earlier research](../evidence-benchmark-073.json.gz)
`;
fs.writeFileSync('docs/evidence-075-2026-10-21.md',text);
fs.writeFileSync('dist/developer/grok-075-inputs.json.gz',gzipSync(JSON.stringify({profiles:read('calibration/grok-075/profiles.json'),questionnaire:read('calibration/grok-075/neutral-questionnaire.json'),quality:q,generation:contract,seal,semanticReview:fs.existsSync('calibration/grok-075/semantic-review.json')?read('calibration/grok-075/semantic-review.json'):null}),{level:9}));
console.log('Prepared research findings and independent input download.');
// Publish the freshly generated report after the replay, not an earlier build's copy.
const mdName='evidence-075-2026-10-21.md',escaped=text.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));fs.mkdirSync('dist/developer/docs',{recursive:true});fs.copyFileSync('docs/'+mdName,'dist/developer/docs/'+mdName);
fs.writeFileSync('dist/developer/docs/'+mdName+'.html',`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Whole-profile holdout and evidence review · Fieldguide</title><link rel="stylesheet" href="../../developer.css"><main><nav><a href="../performance/">← Dashboard</a> · <a href="../model-match-chart.html?researchCohort=grok075&researchFilter=all#evidence-benchmark">Independent holdout profiles →</a> · <a href="../grok-075-inputs.json.gz">Complete frozen inputs →</a></nav><h1>Whole-profile holdout and evidence review</h1><p>Fixed-policy research comparison. The live student flow is unchanged.</p><a href="./${mdName}" download>Download original report</a><pre class="document">${escaped}</pre></main></html>`);
