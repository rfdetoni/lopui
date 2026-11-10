import {test} from 'node:test';
import {strict as assert} from 'node:assert';
import {existsSync,readFileSync} from 'node:fs';
import {execFileSync,spawnSync} from 'node:child_process';
const read=(path)=>readFileSync(path,'utf8');
const command=(...args)=>JSON.parse(execFileSync(process.execPath,
 ['packages/cli/bin/lopui.mjs',...args,'--json'],{encoding:'utf8'}));
test('manifest is versioned, exported and references real Angular components',()=>{
 const response=command('manifest'),manifest=response.data;
 assert.equal(response.apiVersion,1);
 assert.equal(response.type,'manifest');
 assert.equal(manifest.license,'MIT');
 assert.ok(manifest.components.length>=10);
 const exports=read('packages/angular/src/public-api.ts');
 for(const component of manifest.components){
  assert.ok(existsSync(component.source),component.source);
  assert.match(read(component.source),new RegExp(component.selector));
  assert.ok(exports.includes(component.source.split('/').at(-1).replace('.ts','')));
 }
});
test('CLI supports list, component, template and JSON errors',()=>{
 assert.equal(command('component','DataTable').data.selector,'lopui-data-table');
 assert.ok(command('list').data.some(x=>x.name==='EntityPicker'));
 assert.match(command('template','search').data.content,/allowlist/);
 for(const invalid of [['component','unknown'],['template','../LICENSE'],['other']]){
  const result=spawnSync(process.execPath,['packages/cli/bin/lopui.mjs',...invalid,'--json'],
    {encoding:'utf8'});
  assert.equal(result.status,1);
  assert.ok(JSON.parse(result.stdout).error.code);
 }
});
test('tokens are opt-in and independent of global resets',()=>{
 const css=read('packages/tokens/tokens.css');
 assert.match(css,/:root\s*\{/);
 assert.match(css,/\[data-lop-theme="dark"\]/);
 assert.match(css,/--lp-accent:/);
 assert.doesNotMatch(css,/\bbody\s*\{/);
 const p=JSON.parse(read('packages/tokens/package.json'));
 assert.ok(p.exports['./tokens.css']);
});
test('Angular library uses partial compilation and Angular 21 peer compatibility',()=>{
 const a=JSON.parse(read('packages/angular/package.json'));
 assert.match(a.peerDependencies['@angular/core'],/21.*23/);
 const tsconfig=JSON.parse(read('tsconfig.base.json'));
 assert.equal(tsconfig.angularCompilerOptions.compilationMode,'partial');
 const pack=JSON.parse(read('packages/angular/ng-package.json'));
 assert.equal(pack.lib.entryFile,'src/public-api.ts');
});

test('every installable package carries the MIT license',()=>{
 const license=read('LICENSE');
 for(const name of ['angular','tokens','cli']){
  assert.equal(read('packages/'+name+'/LICENSE'),license);
 }
});
test('filters emit only declared operator variants',()=>{
 const code=read('packages/angular/src/lib/directory-filter.component.ts');
 assert.match(code,/operatorFor\(field:string\)/);
 assert.match(code,/operator:LopFilterOperator/);
});

test('MIT permissions and notice are included in every redistributable package',()=>{
 const license=read('LICENSE');
 assert.match(license,/MIT License/);
 assert.match(license,/Permission is hereby granted, free of charge/);
 assert.match(license,/The above copyright notice and this permission notice/);
 for(const id of ['angular','cli','tokens']){
  assert.equal(JSON.parse(read('packages/'+id+'/package.json')).license,'MIT');
  assert.equal(read('packages/'+id+'/LICENSE'),license);
 }
});

test('release publication is gated and validates MIT license',()=>{
 const yaml=read('.github/workflows/release.yml');
 assert.match(yaml,/workflow_dispatch:/);
 assert.match(yaml,/npm run compat/);
 assert.match(yaml,/packages: write/);
 assert.match(yaml,/MIT License/);
 assert.doesNotMatch(yaml,/pull_request:/);
});
