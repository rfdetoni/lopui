import {execFileSync} from 'node:child_process';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join,resolve} from 'node:path';

const major=process.argv[2];
if(!['21','22'].includes(major))throw Error('Use 21 or 22');
const root=process.cwd(),tmp=mkdtempSync(join(tmpdir(),'lopui-consumer-'));
const version=major==='21'?'21.2.26':'22.2.2';
const typescript=major==='21'?'~5.9.3':'~6.0.2';
try{
 const raw=execFileSync('npm',['pack',join(root,'dist/angular'),'--pack-destination',tmp,'--json','--ignore-scripts'],{cwd:root,encoding:'utf8'});
 const filename=JSON.parse(raw)[0].filename;
 const dir=join(tmp,'consumer');
 mkdirSync(join(dir,'src'),{recursive:true});
 writeFileSync(join(dir,'package.json'),JSON.stringify({
   name:'lopui-consumer-'+major,version:'0.0.0',private:true,type:'module',
   dependencies:{
     '@rfdetoni/lopui-angular':'file:'+join(tmp,filename),
     '@angular/core':version,'@angular/common':version,'@angular/forms':version,
     '@angular/compiler':version,'@angular/platform-browser':version,
     rxjs:'7.8.2',tslib:'2.8.1'
   },
   devDependencies:{'@angular/compiler-cli':version,typescript}
 },null,2));
 writeFileSync(join(dir,'tsconfig.json'),JSON.stringify({
   compilerOptions:{target:'ES2022',module:'ES2022',moduleResolution:'bundler',
     lib:['ES2022','DOM'],strict:true,skipLibCheck:true,
     experimentalDecorators:true,types:[],outDir:'build'},
   angularCompilerOptions:{strictTemplates:true,strictInjectionParameters:true},
   files:['src/consumer.component.ts']
 },null,2));
 writeFileSync(join(dir,'src/consumer.component.ts'),"import {Component} from '@angular/core';\nimport {LopSkeletonComponent,LopDataTableComponent,LopServerPagerComponent,LopDirectoryFilterComponent,LopStateComponent,LopToastComponent,LopCollapsibleCardComponent,LopAreaSidenavComponent,LopCommandPaletteComponent,LopEntityPickerComponent,LopChatMessageComponent,LopKanbanCardComponent,LopFormFieldComponent,LopStatusBadgeComponent,type LopTableColumn,type LopFilterField,type LopDirectoryQuery} from '@rfdetoni/lopui-angular';\ninterface Row {id:string;name:string}\n@Component({\n standalone:true,selector:'test-lopui-consumer',\n imports:[LopSkeletonComponent,LopDataTableComponent,LopServerPagerComponent,LopDirectoryFilterComponent,LopStateComponent,LopToastComponent,LopCollapsibleCardComponent,LopAreaSidenavComponent,LopCommandPaletteComponent,LopEntityPickerComponent,LopChatMessageComponent,LopKanbanCardComponent,LopFormFieldComponent,LopStatusBadgeComponent],\n templateUrl:'./consumer.component.html'\n})\nexport class TestConsumer {\n rows:Row[]=[{id:'1',name:'Item'}];\n columns:readonly LopTableColumn<Row>[]=[{id:'name',header:'Nome',value:r=>r.name}];\n identify=(row:Row)=>row.id;\n display=(row:Row)=>row.name;\n fetchPage=async():Promise<{items:Row[];hasMore:boolean;nextCursor:null}>=>({items:this.rows,hasMore:false,nextCursor:null});\n filters:readonly LopFilterField[]=[{id:'all',label:'Todos',operator:'contains'}];\n nav=[{id:'list',label:'Listagem'}];\n commands=[{id:'list',label:'Listagem',section:'Início'}];\n message={id:'1',role:'assistant' as const,text:'Tudo pronto'};\n card={id:'1',title:'Atividade'};\n onFilter(_q:LopDirectoryQuery):void{}\n}\n");
 writeFileSync(join(dir,'src/consumer.component.html'),"\n<lopui-skeleton variant=\"list\"/>\n<lopui-data-table label=\"Itens\" [rows]=\"rows\" [columns]=\"columns\" [identify]=\"identify\"/>\n<lopui-server-pager [page]=\"0\" [hasMore]=\"false\"/>\n<lopui-directory-filter [fields]=\"filters\" (filtersChange)=\"onFilter($event)\"/>\n<lopui-state title=\"Sem registros\" state=\"empty\"/>\n<lopui-toast title=\"Salvo\"/>\n<lopui-collapsible-card title=\"Informações\">Conteúdo</lopui-collapsible-card>\n<lopui-area-sidenav [items]=\"nav\"/>\n<lopui-command-palette [commands]=\"commands\"/>\n<lopui-entity-picker [identify]=\"identify\" [display]=\"display\" [fetchPage]=\"fetchPage\"/>\n<lopui-chat-message [message]=\"message\"/>\n<lopui-kanban-card [card]=\"card\"/>\n<lopui-form-field controlId=\"f1\" label=\"Nome\"><input id=\"f1\" aria-describedby=\"f1-hint\"/></lopui-form-field>\n<lopui-status-badge label=\"Ativo\" tone=\"success\"/>\n");
 execFileSync('npm',['install','--ignore-scripts','--no-audit','--no-fund'],{cwd:dir,stdio:'inherit'});
 execFileSync(join(dir,'node_modules/.bin/ngc'),['-p','tsconfig.json'],{cwd:dir,stdio:'inherit'});
 console.log('LOPUI_COMPAT_OK Angular '+major+' APF consumer and template build');
} finally {rmSync(tmp,{recursive:true,force:true});}
