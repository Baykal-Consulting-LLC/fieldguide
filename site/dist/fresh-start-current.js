const study=new URL(location.href).searchParams.get('study');
await import(['095','096','097'].includes(study)?'./fresh-start-095.js':study==='098'?'./fresh-start-098.js':study==='099'?'./fresh-start-099.js':study==='104'?'./fresh-start-104.js':study==='103'?'./fresh-start-103.js':study==='102'?'./fresh-start-102.js':study==='101'?'./fresh-start-101.js':'./fresh-start-100.js');
