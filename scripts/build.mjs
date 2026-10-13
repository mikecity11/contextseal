import {build} from 'esbuild';
import {copyFileSync} from 'node:fs';
await build({entryPoints:['src/network.mjs'],outfile:'dist/network.js',bundle:true,format:'esm',platform:'browser',target:['es2022'],minify:true,loader:{'.py':'text'}});
copyFileSync('contracts/contextseal.py','dist/contextseal.py');
console.log('Built GenLayer wallet integration and contract source.');
