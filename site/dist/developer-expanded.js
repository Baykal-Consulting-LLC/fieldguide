document.querySelector('#show-options')?.addEventListener('change',e=>document.body.classList.toggle('show-options',e.target.checked));
document.querySelector('#print-view')?.addEventListener('click',()=>window.print());
let printDetails=[];
window.addEventListener('beforeprint',()=>{printDetails=[...document.querySelectorAll('details')].map(el=>({el,open:el.open}));for(const {el}of printDetails)el.open=true;});
window.addEventListener('afterprint',()=>{for(const {el,open}of printDetails)el.open=open;printDetails=[];});
