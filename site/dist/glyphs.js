// Original Fieldguide SVGs. Decorative icons always sit beside readable labels.
const fieldPaths={creative:'M12 43 40 15l9 9-28 28-13 3 4-12Zm22-22 9 9M16 45l7 7M43 8l13 13',technology:'M18 18h28v28H18zM25 25h14v14H25zM24 8v10m16-10v10M24 46v10m16-10v10M8 24h10m-10 16h10M46 24h10M46 40h10',health:'M13 10v14a11 11 0 0 0 22 0V10M9 10h8m14 0h8M24 35v8a13 13 0 0 0 26 0v-8M50 27a4 4 0 1 0 0 8 4 4 0 0 0 0-8',science:'M27 8h10M29 8v17L14 49a5 5 0 0 0 4 7h28a5 5 0 0 0 4-7L35 25V8M23 37h18M26 46h1m9 2h1',building:'M9 55h46M15 55V25l17-14 17 14v30M23 55V36h18v19M25 25h14M32 15v10',trades:'m14 48 20-20M39 11a12 12 0 0 0-11 16L9 46a6 6 0 0 0 9 9l19-19a12 12 0 0 0 16-15l-10 9-9-9 9-10M13 51h1',business:'M10 52h44M15 45V30h9v15M28 45V21h9v24M41 45V11h9v34M12 20l12-8 9 2 14-9',services:'M12 25h33v21a9 9 0 0 1-9 9H21a9 9 0 0 1-9-9V25Zm33 3h5a7 7 0 0 1 0 14h-5M20 17c-6-5 6-7 0-12m12 12c-6-5 6-7 0-12',education:'M32 20c-8-7-17-8-24-6v36c9-2 16 0 24 6 8-6 15-8 24-6V14c-7-2-16-1-24 6v36M15 24l10 4m-10 7 10 4m14-11 10-4m-10 15 10-4','public-safety':'M32 7 53 16v16c0 11-10 20-21 25C21 52 11 43 11 32V16L32 7Zm-10 24 7 8 14-16','transportation-production':'M7 19h30v29H7V19Zm30 9h11l9 10v10H37M17 43a7 7 0 1 0 0 14 7 7 0 0 0 0-14m30 0a7 7 0 1 0 0 14 7 7 0 0 0 0-14M43 33h5l5 7H43','sales-office':'M10 16h44v34H10V16Zm0 0 22 18 22-18M22 9h20M19 56h26'};

const lifePaths={
 home:'M9 30 32 11l23 19M15 27v28h34V27M26 55V38h12v17',
 shared:'M8 30 32 11l24 19M15 28v27h34V28M22 36h7v9h-7zm13 0h7v9h-7M32 47v8',
 apartment:'M18 56V9h28v47M12 56h40M25 18h3m8 0h3M25 28h3m8 0h3M25 38h3m8 0h3M28 56V47h8v9',
 house:'M7 29 32 8l25 21M14 25v31h36V25M26 56V37h12v19M18 31h4m20 0h4M45 10v10',
 bike:'M8 44a10 10 0 1 0 20 0 10 10 0 0 0-20 0m28 0a10 10 0 1 0 20 0 10 10 0 0 0-20 0M18 44l11-22 14 22H18l-5-28h9M29 22h15l2 22M39 13h9',
 car:'M9 34l6-17h34l6 17v17H9V34Zm0 0h46M16 51v5m32-5v5M17 42h7m16 0h7M21 17l2-5h18l2 5',
 groceries:'M10 27h44l-5 28H15l-5-28Zm8 0 7-15m21 15-7-15M23 36v11m9-11v11m9-11v11',
 produce:'M32 25c-15-12-28 2-20 19 6 14 13 12 20 8 7 4 14 6 20-8 8-17-5-31-20-19Zm0 0c-1-9 2-15 9-19M33 17c-10 0-15-3-16-10 10-2 16 2 16 10',
 dining:'M14 10v17m-6-17v14a6 6 0 0 0 12 0V10M14 30v25M44 55V10c-10 4-13 13-11 23h11',
 cafe:'M10 27h32v16a11 11 0 0 1-11 11H21A11 11 0 0 1 10 43V27Zm32 3h6a8 8 0 0 1 0 16h-6M20 18c-6-5 6-7 0-12m12 12c-6-5 6-7 0-12',
 travel:'m8 39 18-10V10a6 6 0 0 1 12 0v19l18 10v7l-18-5v12l5 4H21l5-4V41L8 46v-7Z',
 suitcase:'M11 22h42v31H11V22Zm13 0V12h16v10M21 22v31m22-31v31M18 53v4m28-4v4',
 outdoors:'m8 40 14-22 12 22H8Zm17 0 15-29 17 29H25M22 40v15m18-15v15M12 55h40',
 entertainment:'M25 44V16l27-6v28M25 21l27-6M25 44c0 5-5 9-10 9s-8-3-7-7 7-7 17-6M52 38c0 5-5 9-10 9s-8-3-7-7 7-7 17-6',
 cinema:'M9 24h46v31H9V24Zm0 0V12h46v12M17 12l8 12m6-12 8 12m6-12 8 12M28 33l12 7-12 7V33Z',
 tickets:'m8 26 38-14 10 27-38 14-3-8a6 6 0 0 0-4-11l-3-8Zm27-9 2 6m2 6 2 6m2 6 2 6',
 recreation:'M10 43a9 9 0 1 0 18 0 9 9 0 0 0-18 0m27 0a9 9 0 1 0 18 0 9 9 0 0 0-18 0M19 43l10-19 13 19H19M29 24h13l4 19M24 16h8m5-4h9',
 fitness:'M10 22v20m7-26v32m30-32v32m7-26v20M17 32h30M6 28v8m52-8v8',
 clothing:'M21 12l11 6 11-6 14 17-11 8-5-6v25H23V31l-5 6-11-8 14-17Zm5 3c0 9 12 9 12 0',
 hanger:'M26 17a6 6 0 1 1 6 6v8L9 45a4 4 0 0 0 2 7h42a4 4 0 0 0 2-7L32 31',
 saving:'M21 20c-9 2-15 9-15 18l-1 9h8l4 9h7l2-6h15l3 6h7l2-12 5-5v-9h-7l-4-7 1-12c-8 0-12 4-13 8H21Zm4 8h12M44 31h1M9 31c-7-1-7-8-3-9',
 jar:'M19 15h26v8H19v-8Zm0 8-6 9v22h38V32l-6-9M18 8h28M32 31v15m6-12c-6-5-14 2-6 5s0 10-6 5',
 target:'M9 32a23 23 0 1 0 46 0 23 23 0 0 0-46 0m11 0a12 12 0 1 0 24 0 12 12 0 0 0-24 0M32 32 54 10M45 10h9v9',
 interests:'M32 55V32M32 39C12 40 7 29 9 16c16-1 25 6 23 23Zm0-9C31 14 42 7 56 9c1 15-7 24-24 21',
 explore:'M32 8a24 24 0 1 0 0 48 24 24 0 0 0 0-48m11 13-7 15-15 7 7-15 15-7Z',
 plan:'M16 11h32v46H16V11Zm10 0V7h12v9H26v-5M23 28l3 3 5-6m4 4h7M23 42l3 3 5-6m4 4h7',
 library:'M10 12h11v43H10V12Zm15 0h11v43H25V12Zm14 5 10-3 10 38-10 3-10-38ZM13 22h5m10 0h5M13 46h5m10 0h5'
};
export function glyph(name,extra=''){
 const field=Object.hasOwn(fieldPaths,name),key=field?name:Object.hasOwn(lifePaths,name)?name:'explore';
 return `<svg class="app-glyph ${field?'field-glyph ':''}glyph-${key} ${extra}" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="${field?fieldPaths[key]:lifePaths[key]}"/></svg>`;
}
export const fieldGlyph=id=>`<span class="field-icon field-icon-${Object.hasOwn(fieldPaths,id)?id:'creative'}">${glyph(id)}</span>`;
const choiceIcons={home:['shared','apartment','apartment','house','house'],transport:['bike','car','car','car','car'],groceries:['groceries','groceries','produce','produce','groceries'],dining:['cafe','cafe','dining','dining','dining'],travel:['outdoors','suitcase','suitcase','travel','travel'],entertainment:['cinema','cinema','tickets','entertainment','entertainment'],recreation:['outdoors','bike','fitness','fitness','outdoors'],clothing:['hanger','clothing','clothing','hanger','hanger'],saving:['jar','jar','saving','saving','target']};
export const lifestyleGlyph=(id,choice=2,mode='rent')=>glyph(id==='home'&&mode==='own'?(choice===0?'apartment':'house'):choiceIcons[id]?.[choice]||id);
const storyKeys={'HOME':'home','GETTING AROUND':'car','TRANSPORT':'car','DINING':'dining','RECREATION':'recreation','PERSONAL STYLE':'clothing','MEALS OUT':'dining','TRAVEL':'travel','FUN & STYLE':'entertainment','SAVINGS':'saving','Home':'home','Getting around':'car','Dinners out':'dining','Travel':'travel','Entertainment & recreation':'entertainment','Personal style':'clothing'};
export const storyGlyph=(label)=>glyph(storyKeys[label]||'saving');
export function discoveryIllustration(){return `<div class="discovery-art" aria-hidden="true"><svg class="discovery-orbit" viewBox="0 0 380 320" fill="none"><circle cx="190" cy="160" r="119" fill="#f1eee4"/><circle cx="190" cy="160" r="91" stroke="#c5cdbf" stroke-width="2" stroke-dasharray="3 9"/><path d="M80 205Q144 102 292 105M115 76Q234 123 272 245" stroke="#c5cdbf" stroke-width="2"/><path d="m80 60 0 16m-8-8h16M302 220v12m-6-6h12" stroke="#b26c41" stroke-width="2"/></svg><span class="art-center">${glyph('explore')}</span><span class="art-token art-home">${glyph('home')}</span><span class="art-token art-create">${glyph('creative')}</span><span class="art-token art-health">${glyph('health')}</span><span class="art-token art-trades">${glyph('trades')}</span></div>`;}
