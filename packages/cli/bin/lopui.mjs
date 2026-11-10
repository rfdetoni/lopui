#!/usr/bin/env node
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,join} from 'node:path';

const root=dirname(dirname(fileURLToPath(import.meta.url)));
const manifest=JSON.parse(readFileSync(join(root,'manifest.json'),'utf8'));
const args=process.argv.slice(2),json=args.includes('--json');
const positional=args.filter(x=>x!=='--json');
const [cmd='manifest',arg]=positional;
const write=(type,data)=>console.log(json?JSON.stringify({apiVersion:1,type,data}):
  (typeof data==='string'?data:JSON.stringify(data,null,2)));
function fail(code,message) {
  if(json)console.log(JSON.stringify({apiVersion:1,error:{code,message}}));
  else console.error(message);
  process.exitCode=1;
}
switch(cmd){
  case 'manifest':write('manifest',manifest);break;
  case 'list':write('components',manifest.components.map(x=>({name:x.name,selector:x.selector,package:x.package})));break;
  case 'component':{
    const item=manifest.components.find(x=>x.name.toLowerCase()===arg?.toLowerCase());
    if(!item)fail('UNKNOWN_COMPONENT','Componente não encontrado');
    else write('component',item);
    break;
  }
  case 'template':{
    const template=manifest.templates.find(x=>x.name===arg);
    if(!template){fail('UNKNOWN_TEMPLATE','Template não encontrado');break;}
    const content=readFileSync(join(root,'templates',template.file),'utf8');
    write('template',{name:template.name,content});
    break;
  }
  default:fail('UNKNOWN_COMMAND','Comandos: manifest, list, component <nome>, template <nome>');
}
