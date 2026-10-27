import {spawn} from 'node:child_process';
const child=spawn(process.execPath,['scripts/run-framework.mjs','dev','--port','4174'],{cwd:new URL('../runtime/',import.meta.url),stdio:'inherit'});
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>child.kill(signal));child.on('exit',code=>process.exit(code||0));
