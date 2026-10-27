// Editorial fields organize exploration; they are not qualification or pay equivalences.
const field=(id,title,copy,themes,subjects,routeType='training')=>({id,title,description:copy,eyebrow:copy,work:copy,interestThemes:themes,subjects,routeType,color:'blue',icon:'compass',learn:'Compare the specific career’s preparation, practical experience, and education options.',activity:'Try one small part of the work',detail:'Choose a safe introductory class, demonstration, or conversation. Notice which tasks you want to try again.',question:'Which education or training route keeps useful options open?',careers:[]});
export const commonDirections=[
 field('sales-customer','Sales & customer support','Understand what people need. Explain options and solve problems.',['E','S'],['Marketing','Business','Communication']),
 field('office-support','Office, records & coordination','Keep information accurate and everyday work organized.',['C','E'],['Business administration','Accounting','Office administration']),
 field('transport-logistics','Transport, deliveries & logistics','Move people or goods. Keep deliveries and routes running.',['R','C'],['Logistics','Supply chain management']),
 field('production-work','Production & equipment','Make products. Operate, maintain, and improve equipment.',['R','C'],['Manufacturing technology','Industrial technology']),
 field('public-safety','Safety & emergency response','Protect people and respond when something goes wrong.',['R','S'],['Criminal justice','Fire science','Emergency medical services']),
 field('hospitality-food','Food & hospitality','Prepare meals and help people enjoy good service.',['R','E','S'],['Culinary arts','Hospitality management']),
 field('facilities-outdoor','Places, grounds & maintenance','Keep buildings and outdoor spaces safe and working well.',['R'],['Facilities management','Horticulture']),
 field('agriculture-outdoors','Farming & growing','Grow plants and help produce food and other crops.',['R','I'],['Agriculture','Plant science'])
];
export const commonCareerPaths={
 'sales-customer':['retail-sales','cashier','customer-service','real-estate-agent','insurance-sales-agent'],
 'office-support':['office-clerk','administrative-assistant','bookkeeping-clerk','receptionist'],
 'transport-logistics':['warehouse-material-mover','stock-order-filler','truck-driver','delivery-driver','logistics'],
 'production-work':['welder','industrial-machinery-mechanic','general-maintenance','industrial-engineering'],
 'public-safety':['police','firefighter','security-guard','emt'],
 'hospitality-food':['food-counter','restaurant-server','restaurant-cook','restaurant-manager','chef'],
 'facilities-outdoor':['landscaping-worker','janitor-cleaner','general-maintenance'],
 'agriculture-outdoors':['farmworker-crops','landscaping-worker'],
 'nursing-care':['nursing-assistant','personal-care-aide','medical-assistant','vocational-nurse','nurse-practitioner'],
 'allied-health':['radiologic-technologist','medical-assistant'],
 'medicines-nutrition':['pharmacy-technician'],
 'social-support':['mental-health-counselor'],
 'learning':['school-counselor','elementary-teacher','high-school-teacher','preschool-teacher','childcare-worker'],
 'technology':['computer-support','web-developer'],
 'design':['web-interface-design'],
 'media-communication':['photographer'],
 'visual-arts':['photographer'],
 'skilled-trades':['welder','industrial-machinery-mechanic','general-maintenance','construction-laborer'],
 'practical-service':['hairdresser'],
 'business':['marketing-manager','management-analyst','general-operations-manager','medical-services-manager'],
 'accounting-finance':['personal-financial-advisor','bookkeeping-clerk'],
 'organizations-operations':['marketing-manager','management-analyst','general-operations-manager','medical-services-manager'],
};
for(const d of commonDirections)d.careers=commonCareerPaths[d.id];
export const commonFamilies=[
 {id:'education',title:'Teaching & learning',copy:'Help people learn, grow, and plan their next step.',paths:['learning'],symbol:'✧'},
 {id:'public-safety',title:'Safety & emergency response',copy:'Protect people. Respond to urgent situations.',paths:['public-safety'],symbol:'✚'},
 {id:'transportation-production',title:'Transport & production',copy:'Move goods, make products, and keep equipment running.',paths:['transport-logistics','production-work'],symbol:'⇄'},
 {id:'sales-office',title:'Sales, office & customer support',copy:'Help customers and keep everyday work organized.',paths:['sales-customer','office-support'],symbol:'▦'}
];
