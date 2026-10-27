// Plausible fictional high-school stories. Expected directions are editorial review criteria,
// written from activities and occupational duties, not copied from scorer output or population data.
export const studentStories=[
 {id:'care-and-diagnosis',name:'Biology volunteer',story:'Enjoys biology investigations and explaining things to people. Wants to observe patient care before committing to medicine.',likes:[2,8,14,26,32,44,56,4,10,16,28,34,46,52],dislikes:[5,11,17,23,35,41,59],expected:['health','science'],family:'health',choices:[1,1,1,1,1,1,1,1],roles:['physician'],availableRoles:['physician-assistant','nurse-practitioner'],choose:'physician'},
 {id:'precision-and-dental-care',name:'Careful maker drawn to dentistry',story:'Likes careful handwork, human biology and reassuring patients. Dislikes sales and public performance. Wants to compare dentistry with dental hygiene.',likes:[1,7,13,25,31,37,49,2,14,26,32,44,56,16,34],dislikes:[5,11,17,23,27,35,41,51,57,59],expected:['health','building','trades'],required:['health'],family:'health',choices:[3,2,1,2,2,3,3,2],roles:['dentist'],availableRoles:['dental-hygiene','dental-assisting'],choose:'dentist'},
 {id:'visual-not-performance',name:'Visual designer, not a performer',story:'Loves posters, visual layouts, photographs and product sketches. Does not enjoy music, acting, creative writing or selling. An arts score must not erase that visual interest.',likes:[1,3,9,15,33,45,60],dislikes:[5,11,17,23,27,35,39,41,51,53,57,59],expected:['creative'],family:'creative',choices:[1,1,1,1,1,1,1,1],roles:['graphic-design'],forbidden:['public-relations'],choose:'graphic-design'},
 {id:'story-and-media',name:'School filmmaker',story:'Edits short films and experiments with pacing and images. Likes stories; has little interest in persuading customers or maintaining business records.',likes:[3,9,15,21,27,33,39,45,51,57],dislikes:[6,12,18,24,30,35,36,41,48,59],expected:['creative'],family:'creative',choices:[3,3,3,2,4,4,4,4],roles:['film-editing','animation'],availableRoles:['photographer'],choose:'film-editing'},
 {id:'hands-on-diagnostics',name:'Repair-club student',story:'Repairs objects and likes wiring, diagrams and diagnosing faults. Prefers learning by doing and wants to compare paid training with engineering.',likes:[1,7,13,25,31,37,49,55,2,26,38,50,24,54],dislikes:[3,9,15,27,33,39,51,57],expected:['trades','building'],family:'trades',choices:[1,2,2,1,1,1,1,1],roles:['electrician'],choose:'electrician'},
 {id:'data-without-sales',name:'Quiet data investigator',story:'Enjoys data, checking assumptions and debugging. Likes organized work but dislikes sales and leading an event. Quiet must not imply unsuitable for college.',likes:[2,8,20,26,38,44,50,6,12,18,24,30,36,48,54,60],dislikes:[5,11,17,23,29,35,41,47,53,59],expected:['technology','science','business'],required:['technology'],family:'technology',choices:[2,2,2,2,2,2,2,2],roles:['data-science','statistics'],choose:'data-science'},
 {id:'records-not-persuasion',name:'Detail-oriented organizer',story:'Enjoys budgets, records, schedules and finding discrepancies. Does not enjoy persuasion, sales or leading teams.',likes:[6,12,18,24,30,36,42,48,54,60,8,44],dislikes:[5,11,17,23,29,35,41,47,53,59],expected:['business','sales-office'],family:'business',choices:[1,1,1,1,1,1,1,1],roles:['accounting'],choose:'accounting'},
 {id:'helping-not-clinical',name:'Tutor and listener',story:'Enjoys helping younger students learn, adapting explanations and listening. Does not want clinical procedures or repairing equipment.',likes:[4,10,16,22,28,34,40,46,52,58,3,11],dislikes:[7,13,14,25,32,37,49,50,56],expected:['education','health'],family:'education',choices:[2,3,1,1,2,2,2,2],roles:['high-school-teacher'],choose:'high-school-teacher'},
 {id:'environment-and-evidence',name:'Creek-restoration volunteer',story:'Enjoys water quality, habitats, field observations and evidence. Does not enjoy selling products or providing personal care.',likes:[2,8,20,26,32,44,50,19,25,43,55,6,24,54],dislikes:[17,21,34,35,41,46,59],expected:['science'],family:'science',choices:[3,2,2,2,1,1,1,1],roles:['environmental-science','conservation'],choose:'environmental-science'},
 {id:'design-and-technology',name:'Art-and-coding student',story:'Enjoys both visual design and making digital tools usable. Wants to compare design with computing, not be forced into only one.',likes:[1,3,8,9,15,26,33,38,44,45,60,2,12],dislikes:[17,23,27,35,41,51,57,59],expected:['creative','technology'],required:['creative','technology'],family:'creative',choices:[1,1,2,3,2,2,1,2],roles:['web-interface-design'],choose:'web-interface-design'},
 {id:'people-and-business',name:'School-event organizer',story:'Enjoys coordinating people, finding audience needs and presenting a case. Interested in business and communication, not only making visual art.',likes:[5,11,17,23,29,35,41,47,53,59,6,12,30,10,28],dislikes:[7,13,25,37,49],expected:['business','sales-office'],family:'business',choices:[3,2,2,4,2,2,2,2],roles:['market-research'],choose:'market-research'},
 {id:'mostly-unfamiliar',name:'Student with little exposure',story:'Has not tried most work-like activities. Mild curiosity about helping a classmate and making a visual idea. Needs experiences, not a career verdict.',likes:[],unknown:'most',overrides:{3:4,4:4,10:3,15:3,16:3,22:3},expected:[],family:'health',choices:[0,0,0,0,0,0,0,0],roles:[],choose:null}
];

// Additional fictional answers, authored from each story's actual work preferences.
// Unlisted fields are low-interest, not inferred from an occupation choice.
export const studentFieldResponses={
 'care-and-diagnosis':{health:[5,5,4],science:[4,4,4],education:[4,3,4]},
 'precision-and-dental-care':{health:[5,5,4],science:[4,4,3],trades:[3,3,4]},
 'visual-not-performance':{creative:[5,5,5]},
 'story-and-media':{creative:[5,4,5]},
 'hands-on-diagnostics':{trades:[5,5,5],building:[2,3,2],'transportation-production':[4,4,4]},
 'data-without-sales':{technology:[5,5,4],science:[4,4,4],business:[5,2,5]},
 'records-not-persuasion':{business:[5,2,5],'sales-office':[4,5,5],'transportation-production':[3,4,4]},
 'helping-not-clinical':{education:[5,5,5],health:[2,2,3]},
 'environment-and-evidence':{science:[5,5,5],building:[3,3,3]},
 'design-and-technology':{creative:[5,4,5],technology:[5,5,4]},
 'people-and-business':{business:[5,5,4],'sales-office':[5,4,4],services:[3,3,3]},
 'mostly-unfamiliar':{}
};
