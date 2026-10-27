import React,{useState}from'react';
import{EvidenceChart,barChartSpec}from'../../data-app-public.jsx';
const names={all:'First cohort · 1,000',development:'Development · 758',holdout:'Original holdout · 30',holdout049:'Earlier fresh holdout · 12',holdout056:'Expansion holdout · 200',grok075:'Grok cohort · 1,000'};
const spec=barChartSpec({presentation:'progress',category:'arm',value:'count',track:{max:'population'},unitField:'unit',format:{style:'decimal',maximumFractionDigits:1}});
export function Evidence090({rows,cohort}){
 const[metric,setMetric]=useState('Top');
 const groups=[rows.find(r=>r.cohort===cohort)||rows.find(r=>r.cohort==='all'),rows.find(r=>r.cohort==='grok075')];
 const chart=(r,location)=><section key={r.cohort}>
  <EvidenceChart id={`evidence090-${location}-${r.cohort}-${metric}`} queryId="evidence090" title={names[r.cohort]} variant="plain" rows={['before','after'].map(arm=>({arm:(arm==='before'?'Before · 0.89':'Research · 0.90')+' · '+(100*r[arm+metric]/r.models).toFixed(1)+'%',count:r[arm+metric],population:r.models,unit:'models'}))} sourceRows={[r]} spec={spec} height={150}/>
  <p>{r['before'+metric]} → <strong>{r['after'+metric]}</strong> / {r.models} · {r.degreeBelowCap} supported degree options below Top-three cap</p>
  {r.degreeGapModels>0&&<EvidenceChart id={`evidence090-reach-${location}-${r.cohort}`} queryId="evidence090" title="Degree follow-up reach" variant="plain" rows={['before','after'].map(arm=>({arm:(arm==='before'?'Before':'After')+' · '+(r.degreeGapModels-r[arm+'NoDegreeCheck'])+' / '+r.degreeGapModels,count:r.degreeGapModels-r[arm+'NoDegreeCheck'],population:r.degreeGapModels,unit:'models'}))} sourceRows={[r]} spec={spec} height={140}/>}
  <details><summary>Question evidence · {r.questions} checks</summary><p>{r.degreeFollowupModels} models received degree-career checks. Plant research: {r.plantYes} supported answers, {r.plantNo} declined, {r.plantUnknown} unknown. All checks: {r.unknown} unknown, {r.unbound} without exact bindings.</p></details>
 </section>;
 return <div data-reviewed-rows><label>Measure <select value={metric} onChange={e=>setMetric(e.target.value)}><option value="Top">Supported Top</option><option value="Degree">Bachelor / graduate Top</option><option value="AllDegree">Any supported bachelor / graduate option</option><option value="NoDegree">No-college-degree Top</option></select></label>
 <div className="perf-routes">{groups.filter(Boolean).map(r=>chart(r,'primary'))}</div>
 <p>Follow-up reach counts models offered a degree-career check among those lacking any supported degree option. It does not count them as matches.</p>
 <details><summary>Holdouts · reported separately</summary><div className="perf-routes">{rows.filter(r=>r.cohort.startsWith('holdout')).map(r=>chart(r,'holdouts'))}</div></details>
 <p className="perf-note">Synthetic calibration; live0.87 unchanged. Unknown interests and prior support remain intact. Plant research and grower advising are separate responsibility routes.</p>
 <a href="../evidence-090.html">Inspect every model and exact answers →</a></div>;
}
