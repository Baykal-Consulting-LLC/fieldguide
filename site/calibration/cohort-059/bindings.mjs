// Reviewed against each existing question's subject, method and responsibility.
// Simulation assumptions only. No title/prompt/biography classifier or new scoring weights.
const c=(topicAll,methodAll,responsibilityAll=[],responsibilityMethods=methodAll)=>({topicAll,methodAll,responsibilityAll,responsibilityMethods,mappingVersion:7});
export const constructs059={
 '13-1041.01':c(['ecology','law'],['fieldwork','investigation','precision'],[],['precision','explaining']),
 '13-1081.01':c(['logistics'],['quantitative','design','testing'],[],['quantitative','explaining']),
 '13-2054.00':c(['finance','statistics'],['quantitative','investigation'],['risk'],['quantitative','explaining']),
 '13-2099.04':c(['finance','law'],['investigation','precision'],[],['precision','explaining']),
 '15-1211.01':c(['health','computing','information'],['listening','investigation','design'],['safety'],['coordination','explaining','precision']),
 '15-1243.01':c(['computing','information','enterprise'],['computing','testing','precision'],[],['organization','precision']),
 '15-1299.04':c(['computing','safety'],['computing','investigation','testing'],['safety'],['precision','explaining']),
 '15-1299.05':c(['computing','safety'],['computing','design','testing'],['safety'],['coordination','testing']),
 '15-1299.06':c(['computing','law'],['computing','investigation','precision'],[],['precision','explaining']),
 '15-1299.08':c(['computing','enterprise'],['computing','design','testing'],['safety'],['organization','precision']),
 '17-2051.01':c(['infrastructure','logistics'],['design','quantitative','testing'],['safety'],['precision','explaining']),
 '17-2051.02':c(['infrastructure','ecology','chemistry'],['design','quantitative','testing'],['safety'],['precision','investigation']),
 '17-2112.01':c(['psychology','mechanics'],['design','testing','listening'],[],['investigation','explaining']),
 '17-2112.03':c(['mechanics','logistics'],['design','making','testing'],[],['coordination','precision']),
 '19-2041.01':c(['ecology','weather','policy'],['investigation','quantitative'],[],['explaining','precision']),
 '19-2041.03':c(['ecology','mechanics','chemistry'],['quantitative','investigation'],[],['explaining','precision']),
 '19-2099.01':c(['earth','electronics'],['quantitative','investigation','testing'],[],['precision','explaining']),
 '19-3011.01':c(['ecology','enterprise','policy'],['quantitative','investigation'],[],['precision','explaining']),
 '19-3099.01':c(['logistics','policy','spaces'],['investigation','quantitative'],[],['listening','explaining']),
 '25-1112.00':c(['law','adults','learning'],['explaining','investigation'],['assessment'],['precision','listening']),
 '25-1193.00':c(['movement','adults','learning'],['explaining','investigation','design'],['assessment','safety']),
 '27-1011.00':c(['visual','marketing'],['expression','design','precision'],['leadership'],['coordination','explaining']),
 '29-1129.01':c(['visual','health','psychology'],['expression','design','listening'],['clinical','patientcare'],['listening','precision','testing']),
 '29-1129.02':c(['sound','health'],['expression','design','listening'],['clinical','patientcare'],['listening','precision','testing']),
 '41-9031.00':c(['mechanics','enterprise','retail'],['investigation','design','persuading'],[],['precision','explaining','coordination']),
 '45-2011.00':c(['plants','food','law'],['fieldwork','investigation','precision'],['safety'])
};
export function questionBinding059(c,q){
 if(c.mappingVersion!==7)return null;
 return q.domain==='domain'?{topicAll:c.topicAll}:q.domain==='method'?{topicAll:c.topicAll,methodAll:c.methodAll}:q.domain==='responsibility'?{topicAll:c.topicAll,methodAll:c.responsibilityMethods,responsibilityAll:c.responsibilityAll}:null;
}
