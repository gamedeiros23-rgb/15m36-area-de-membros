import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {join,extname} from 'node:path';
let html=readFileSync('dist/index.html','utf8');
const cssPath=html.match(/<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/);
const jsPath=html.match(/<script type="module"[^>]*src="([^"]+)"[^>]*><\/script>/);
if(!cssPath||!jsPath)throw Error('Execute npm run build antes de exportar.');
const css=readFileSync(join('dist',cssPath[1]),'utf8').replace(/url\(([^)]+)\)/g,(_,path)=>{
 const clean=path.replace(/["']/g,'');if(clean.startsWith('data:'))return `url(${path})`;const bytes=readFileSync(join('dist',clean));
 return `url(data:font/${extname(clean).slice(1)};base64,${bytes.toString('base64')})`;
});
const js=readFileSync(join('dist',jsPath[1]),'utf8').replace(/<\/script/gi,'<\\/script');
html=html.replace(cssPath[0],()=>`<style>${css}</style>`).replace(jsPath[0],()=>`<script type="module">${js}</script>`);
mkdirSync('artifacts',{recursive:true});writeFileSync('artifacts/15m36-prototipo.html',html);
console.log('Prévia independente gerada: artifacts/15m36-prototipo.html');
