import fs from 'node:fs';

// A small renderer for this review's controlled Markdown subset. No remote code,
// raw HTML, student state, or third-party runtime is loaded by the report pages.
const names=[
 'competitive-services-review-2026-10-18.md',
 'competitive-assessments-2026-10-18.md',
 'competitive-school-platforms-2026-10-18.md',
 'competitive-consumer-finance-2026-10-18.md',
 'competitive-additional-services-2026-10-18.md',
 'competitive-financial-methods-2026-10-18.md',
 'competitive-student-outcomes-2026-10-18.md'
];
const h=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
function inline(s){
 const links=[];
 s=s.replace(/\[([^\]]+)\]\(([^)]+)\)/g,(_,label,url)=>{
  if(!/^(https?:\/\/|\.\.?\/)/.test(url))return label;
  const token='LINKTOKEN'+links.length+'END';
  links.push(`<a href="${h(url)}">${h(label)}</a>`);return token;
 });
 return h(s).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/`([^`]+)`/g,'<code>$1</code>').replace(/LINKTOKEN(\d+)END/g,(_,i)=>links[Number(i)]);
}
function render(source){
 const lines=source.split('\n'),out=[],toc=[];let i=0;
 const startsBlock=s=>/^#{1,6}\s|^\s*[-*]\s|^\s*\d+\.\s|^\|/.test(s);
 while(i<lines.length){
  const line=lines[i];if(!line.trim()){i++;continue;}
  const title=line.match(/^(#{1,6})\s+(.+)$/);
  if(title){const level=title[1].length,id='section-'+i,text=title[2];if(level===2)toc.push([id,text]);out.push(`<h${level} id="${id}">${inline(text)}</h${level}>`);i++;continue;}
  if(line.startsWith('|')){
   const rows=[];while(i<lines.length&&lines[i].startsWith('|'))rows.push(lines[i++].replace(/^\||\|$/g,'').split('|').map(x=>x.trim()));
   const header=rows.shift();if(rows[0]?.every(x=>/^:?-+:?$/.test(x)))rows.shift();
   out.push(`<div class="table-scroll" tabindex="0" role="region" aria-label="Comparison table"><table><thead><tr>${header.map(x=>`<th scope="col">${inline(x)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map(x=>`<td>${inline(x)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);continue;
  }
  const item=line.match(/^\s*(?:([-*])|(\d+)\.)\s+(.+)$/);
  if(item){const ordered=!!item[2],tag=ordered?'ol':'ul',items=[];
   while(i<lines.length){const m=lines[i].match(/^\s*(?:([-*])|(\d+)\.)\s+(.+)$/);if(!m||!!m[2]!==ordered)break;items.push(`<li>${inline(m[3])}</li>`);i++;}
   out.push(`<${tag}>${items.join('')}</${tag}>`);continue;
  }
  const paragraph=[line];i++;while(i<lines.length&&lines[i].trim()&&!startsBlock(lines[i]))paragraph.push(lines[i++]);
  out.push(`<p>${inline(paragraph.join(' '))}</p>`);
 }
 return {body:out.join('\n'),toc};
}
export function buildCompetitiveReview(){
 for(const name of names){
  const source=fs.readFileSync('research/'+name,'utf8'),title=source.match(/^# (.+)$/m)[1],{body,toc}=render(source);
  fs.writeFileSync('dist/developer/research/'+name+'.html',`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${h(title)} · Fieldguide research</title><style>
   :root{color-scheme:light}*{box-sizing:border-box}body{margin:0;color:#203c32;background:#faf9f4;font:17px/1.65 system-ui,sans-serif}main{max-width:1160px;margin:auto;padding:28px 24px 80px}a{color:#1e5492;text-underline-offset:3px;overflow-wrap:anywhere}a:focus-visible,.table-scroll:focus-visible{outline:3px solid #235f9d;outline-offset:4px}nav{display:flex;gap:12px;flex-wrap:wrap;font-size:16px}h1{font-size:clamp(28px,4vw,42px);line-height:1.18;max-width:1000px;margin:32px 0 20px}h2{font-size:26px;line-height:1.3;margin:46px 0 16px;border-top:1px solid #cbd5cc;padding-top:24px}h3{font-size:21px;margin-top:30px}p{max-width:950px;margin:14px 0}li{max-width:950px;padding:5px 0}code{font-size:.95em}.table-scroll{overflow:auto;margin:22px 0;background:#fff;border:1px solid #cbd5cc;border-radius:12px}table{width:100%;border-collapse:collapse;min-width:700px;font-size:16px;line-height:1.55}th,td{text-align:left;vertical-align:top;padding:15px;border-bottom:1px solid #dce2dc}th{background:#e6edde}tr:last-child td{border-bottom:0}details{border:1px solid #cbd5cc;border-radius:10px;padding:15px;margin:24px 0;background:white}summary{cursor:pointer;font-weight:650}.scope{background:#edf1f7;border-left:4px solid #3567a2;padding:14px 18px;font-size:16px}.download{display:block;margin:18px 0}footer{margin-top:45px;border-top:1px solid #cbd5cc;padding-top:24px}@media(max-width:500px){main{padding:20px 16px 60px}body{font-size:16px}h2{font-size:23px}th,td{padding:12px}table{font-size:16px}}@media print{nav,details,.download{display:none}.table-scroll{overflow:visible}table{min-width:0;font-size:10px}main{padding:0}a{color:inherit}h2{break-after:avoid}tr{break-inside:avoid}}
   </style></head><body><main><nav><a href="../../developer.html#competitive">← Developer research</a><a href="./competitive-services-review-2026-10-18.md.html">Main comparison</a><a href="../../#/overview">Student guide</a></nav><aside class="scope">Research reviewed October 18, 2026. Public-source comparison; competitor features and published time estimates are not a hands-on student study.</aside>${body.replace(/(<\/h1>)/,'$1'+`<details><summary>Jump to a section</summary><ul>${toc.map(([id,text])=>`<li><a href="#${id}">${h(text)}</a></li>`).join('')}</ul></details>`)}<footer><a class="download" href="./${name}" download>Download this report as Markdown</a><a href="../../developer.html#competitive">Return to Developer research →</a></footer></main></body></html>`);
 }
}
