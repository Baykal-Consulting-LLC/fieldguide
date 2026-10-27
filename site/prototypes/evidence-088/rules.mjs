import{questionRules as previous}from'../simulator-078/bindings-002.mjs';import{scopedRules}from'../simulator-079/bindings-002.mjs';
export const rules={...previous,...scopedRules,
 'degree-17211202-047-responsibility':{id:'degree-17211202-047-responsibility',any:[['t:quality','m:testing','m:precision'],['t:electronics','m:precision'],['t:mechanics','m:testing','m:precision','m:organization']],block:['m:testing','m:precision','m:organization'],reason:'The circuit activity explicitly records repeatable tests. Careful organized mechanical tests support documentation; independent research-program responsibility is not asked. Explicit opposition to testing, precision or organization prevents support.'}
};
export const diagnostics=[
 {id:'088-plant-comparison',prompt:'Would you enjoy comparing growing conditions to explain why plants develop differently?',any:[['t:plants']],block:[],scope:'degree-19101300'},
 {id:'088-environment-comparison',prompt:'Would you enjoy comparing repeated habitat observations to work out what changed?',any:[['t:ecology','m:fieldwork']],block:['m:fieldwork'],scope:'environmental-science'}
];
