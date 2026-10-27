// Reviewed fixture bindings for previously unmapped occupations. Stable IDs only.
// Every conjunction is deliberate; a broad subject never supplies a specialist preference.
// These are transparent simulation assumptions, not observed answers or validity estimates.
const c=(topicAll,methodAll,responsibilityAll=[],responsibilityMethods=methodAll)=>({topicAll,methodAll,responsibilityAll,responsibilityMethods,mappingVersion:6});
export const additionalConstructs006={
 '15-1252.00':c(['computing'],['design','computing','testing']),
 '15-1212.00':c(['computing','safety'],['computing','investigation','testing'],['safety']),
 '15-1211.00':c(['computing'],['listening','design','testing','investigation']),
 '15-1232.00':c(['computing'],['computing','explaining','listening']),
 '15-1254.00':c(['computing'],['computing','design','testing']),
 '15-1221.00':c(['computing'],['computing','investigation','testing'],['research']),
 '15-1241.00':c(['computing'],['computing','design','testing'],['safety','leadership']),
 '15-1242.00':c(['computing','information'],['computing','investigation','testing'],['safety']),
 '15-1243.00':c(['computing','information'],['computing','design','testing'],['leadership']),
 '15-1244.00':c(['computing'],['computing','investigation','organization'],['safety']),
 '15-1251.00':c(['computing'],['computing','testing','precision']),
 '15-1253.00':c(['computing'],['computing','testing','precision'],[],['precision','explaining']),
 '15-1299.02':c(['earth','computing'],['computing','quantitative','precision']),
 '15-1299.03':c(['information','computing'],['organization','investigation'],['safety'],['organization','coordination']),
 '15-2041.01':c(['statistics','health','biology'],['quantitative','testing'],['research'],['precision','explaining']),
 '15-2051.01':c(['statistics','enterprise'],['quantitative','investigation'],[],['organization','explaining']),
 '15-2099.01':c(['biology','computing'],['computing','quantitative','organization'],[],['precision','organization']),
 '17-2199.05':c(['mechanics','electronics'],['design','making','testing','computing'],['safety']),
 '19-1029.01':c(['biology','computing'],['computing','quantitative','investigation'],['research']),
 '19-1029.02':c(['biology','chemistry'],['testing','investigation'],['research']),
 '19-1029.04':c(['biology','ecology'],['fieldwork','investigation'],['research']),
 '19-2041.02':c(['ecology','plants'],['fieldwork','investigation','design'],[],['coordination','organization']),
 '19-4092.00':c(['law','chemistry'],['testing','investigation','precision'],['safety']),
 '19-5011.00':c(['safety','health'],['fieldwork','investigation','testing'],['safety']),
 '21-1015.00':c(['health','psychology'],['listening','organization'],['patientcare'],['listening','coordination']),
 '21-1022.00':c(['health','policy'],['listening','investigation'],['patientcare'],['listening','coordination']),
 '21-1023.00':c(['psychology','policy'],['listening','investigation'],['clinical','patientcare']),
 '21-1091.00':c(['health','learning'],['investigation','design','explaining'],[],['coordination','testing']),
 '23-1012.00':c(['law','writing'],['investigation','precision'],[],['precision','organization']),
 '23-1022.00':c(['law'],['listening','investigation','persuading'],[],['precision','organization']),
 '25-2012.00':c(['children','learning'],['explaining','design','listening'],['assessment'],['listening','coordination']),
 '25-3011.00':c(['adults','learning','language'],['explaining','design','listening'],['assessment']),
 '25-4011.00':c(['history','information'],['investigation','organization','precision'],[],['precision','organization']),
 '25-4012.00':c(['history','visual'],['investigation','design','organization'],[],['precision','organization']),
 '25-4013.00':c(['history','visual','chemistry'],['investigation','testing','precision'],[],['precision','organization']),
 '27-1013.00':c(['visual'],['expression','design'],[],['expression','design']),
 '27-1027.00':c(['spaces','performance','visual'],['design','making'],[],['coordination','organization']),
 '27-3023.00':c(['writing','policy'],['investigation','listening','precision'],[],['precision','investigation']),
 '27-3043.05':c(['writing'],['expression'],[],['expression']),
 '27-4031.00':c(['media'],['expression','precision'],[],['coordination','precision']),
 '29-2011.00':c(['health','biology','chemistry'],['testing','investigation','precision'],['safety']),
 '29-2012.00':c(['health','biology'],['testing','precision'],['safety']),
 '29-2091.00':c(['health','movement','mechanics'],['making','testing','listening'],['patientcare']),
 '29-9091.00':c(['health','movement'],['investigation','testing','listening'],['clinical','patientcare']),
 '43-9081.00':c(['writing'],['precision','organization']),
 '43-9111.00':c(['statistics'],['quantitative','precision','organization']),
 '13-1051.00':c(['purchasing','infrastructure'],['quantitative','precision'],[],['quantitative','explaining']),
 '13-1081.02':c(['logistics'],['quantitative','investigation','organization'],[],['precision','explaining']),
 '13-1199.05':c(['ecology','enterprise'],['investigation','quantitative'],[],['coordination','precision'])
};
const q=(topicAll,methodAll,responsibilityAll=[])=>({topicAll,methodAll,responsibilityAll});
const overrides={
 'software-interest-044-1':q(['computing'],['design','listening']),
 'software-interest-044-2':q(['computing'],['computing','testing']),
 'web-developer-interest-044-1':q(['computing'],['computing','design']),
 'web-developer-interest-044-2':q(['computing'],['computing','testing'])
};
export function additionalQuestionBinding006(c,q){
 if(c.mappingVersion!==6)return null;
 if(overrides[q.id])return overrides[q.id];
 const {topicAll,methodAll,responsibilityAll,responsibilityMethods}=c;
 return q.domain==='domain'?{topicAll}:q.domain==='method'?{topicAll,methodAll}:q.domain==='responsibility'?{topicAll,methodAll:responsibilityMethods,responsibilityAll}:{topicAll,methodAll,responsibilityAll};
}
// Read against the actual activity options. No propagation from occupation links.
export const additionalOptions006={
 'technology-problem-1':q(['computing'],['computing','design']),
 'technology-problem-3':q(['computing','safety'],['computing','investigation'],['safety']),
 'technology-problem-4':q(['computing'],['listening','explaining']),
 'technology-workday-1':q(['computing'],['computing','testing']),
 'technology-workday-3':q(['computing'],['listening','design','coordination']),
 'technology-workday-4':q(['computing'],['explaining']),
 'technology-refine-3-1':q(['computing'],['computing','testing']),
 'technology-refine-3-3':q(['computing','safety'],['computing','investigation'],['safety']),
 'technology-refine-3-4':q(['computing'],['listening','design','investigation']),
 'technology-refine-3-5':q(['computing'],['computing','organization','investigation'])
};
