export function degreeControl(el,view){
 const keys={'degree-search':'search','degree-family':'family','degree-education':'education','degree-topic':'topic','degree-new':'onlyNew','degree-experienced':'includeExperienced','degree-strong':'strongOnly','degree-strength':'strengthOnly'};
 const key=keys[el.id];if(!key)return false;view[key]=el.type==='checkbox'?el.checked:el.value;view.showAll=false;return true;
}
