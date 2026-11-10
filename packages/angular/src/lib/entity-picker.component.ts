import {
  ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy,
  Output, forwardRef, signal
} from '@angular/core';
import {
  AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR,
  ValidationErrors, Validator
} from '@angular/forms';

export interface LopEntityPage<T> {
  readonly items:readonly T[];
  readonly hasMore:boolean;
  readonly nextCursor:string|null;
}

/**
 * Generic server-side ControlValueAccessor. All network and credentials stay
 * in fetchPage/fetchById provided by the host. Never import app-specific code.
 */
@Component({
  selector:'lopui-entity-picker',
  standalone:true,
  changeDetection:ChangeDetectionStrategy.OnPush,
  providers:[
    {provide:NG_VALUE_ACCESSOR,useExisting:forwardRef(()=>LopEntityPickerComponent),multi:true},
    {provide:NG_VALIDATORS,useExisting:forwardRef(()=>LopEntityPickerComponent),multi:true}
  ],
  template:`
    <div class="picker">
      <label [attr.for]="queryId">{{searchLabel}}</label>
      <input [id]="queryId" type="search" [value]="query" [disabled]="disabled"
        [placeholder]="placeholder" (focus)="ensureLoaded()"
        (input)="search($event)"/>
      <label [attr.for]="selectId">{{label}}</label>
      <select [id]="selectId" [value]="value" [disabled]="disabled"
        (focus)="ensureLoaded()" (change)="choose($event)"
        (blur)="onTouched()" [attr.aria-invalid]="required&&!value">
        <option value="">{{selectLabel}}</option>
        @if(outsideSelected(); as item){
          <option [value]="identify(item)">{{display(item)}}</option>
        }
        @for(item of items();track identify(item)){
          <option [value]="identify(item)">{{display(item)}}</option>
        }
      </select>
      <div class="pager">
        <span>Página {{page()+1}}</span>
        <button type="button" [disabled]="disabled||loading()||page()===0"
          (click)="changePage(page()-1)">{{previousLabel}}</button>
        <button type="button" [disabled]="disabled||loading()||!hasMore()"
          (click)="changePage(page()+1)">{{nextLabel}}</button>
      </div>
      @if(loading()){<small role="status">{{loadingLabel}}</small>}
      @if(error()){
        <div class="error" role="alert">{{errorLabel}}</div>
        <button type="button" [disabled]="disabled" (click)="load()"> {{retryLabel}} </button>
      }
      @if(loaded()&&!loading()&&!error()&&!items().length){
        <small>{{emptyLabel}}</small>
      }
    </div>
  `,
  styles:[`
    :host{display:block;min-width:0}
    .picker{display:grid;gap:6px}
    label{font-size:.82rem;font-weight:600;color:var(--lp-muted,#516c78)}
    input,select{min-height:var(--lp-control-height,40px);width:100%;min-width:0;
      border:1px solid var(--lp-border,#ccdee5);border-radius:var(--lp-control-radius,9px);
      background:var(--lp-surface,#fff);color:var(--lp-ink,#172d31);padding:8px 10px;font:inherit}
    .pager{display:flex;align-items:center;flex-wrap:wrap;gap:8px;color:var(--lp-muted,#516c78);font-size:.8rem}
    .pager span{margin-right:auto}
    button{min-height:36px;border:1px solid var(--lp-border,#ccdee5);
      color:var(--lp-ink,#172d31);background:var(--lp-surface,#fff);
      padding:6px 10px;border-radius:8px;font:inherit;cursor:pointer}
    button:disabled{opacity:.55;cursor:not-allowed}
    button:focus-visible,input:focus-visible,select:focus-visible{
      outline:var(--lp-focus,2px solid #006f68);outline-offset:2px}
    .error{font-size:.8rem;color:var(--lp-danger,#b7354a)}
    small{font-size:.77rem;color:var(--lp-muted,#516c78)}
  `]
})
export class LopEntityPickerComponent<T> implements ControlValueAccessor,Validator,OnDestroy {
  private static serial=0;
  readonly serial=++LopEntityPickerComponent.serial;
  readonly queryId='lopui-entity-query-'+this.serial;
  readonly selectId='lopui-entity-value-'+this.serial;
  @Input({required:true}) fetchPage!:(
    query:string,cursor:string|null,limit:number
  )=>Promise<LopEntityPage<T>>;
  @Input() fetchById?: (id:string)=>Promise<T|null>;
  @Input({required:true}) identify!: (item:T)=>string;
  @Input({required:true}) display!: (item:T)=>string;
  @Input() required=false;
  @Input() label='Registro';
  @Input() searchLabel='Buscar registro';
  @Input() placeholder='Digite para pesquisar';
  @Input() selectLabel='Selecione';
  @Input() loadingLabel='Buscando registros…';
  @Input() errorLabel='Não foi possível carregar os registros.';
  @Input() emptyLabel='Nenhum resultado.';
  @Input() retryLabel='Tentar novamente';
  @Input() previousLabel='Anterior';
  @Input() nextLabel='Próxima';
  @Input() pageSize=25;
  @Output() readonly entitySelected=new EventEmitter<T>();

  readonly items=signal<readonly T[]>([]);
  readonly selected=signal<T|null>(null);
  readonly page=signal(0);
  readonly hasMore=signal(false);
  readonly loaded=signal(false);
  readonly loading=signal(false);
  readonly error=signal(false);
  private readonly cursors:(string|null)[]=[null];
  private version=0;
  private selectionVersion=0;
  private timer?:ReturnType<typeof setTimeout>;
  private destroyed=false;
  value='';
  query='';
  disabled=false;
  private onChange:(id:string)=>void=()=>{};
  onTouched:()=>void=()=>{};

  writeValue(value:string|null):void {
    const id=value??'';
    if(this.value===id)return;
    this.value=id;
    ++this.selectionVersion;
    if(!id){this.selected.set(null);return;}
    const found=this.items().find(item=>this.identify(item)===id);
    if(found){this.selected.set(found);return;}
    this.selected.set(null);
    if(!this.fetchById)return;
    const serial=this.selectionVersion;
    void this.fetchById(id).then(item=>{
      if(!this.destroyed&&serial===this.selectionVersion&&this.value===id)
        this.selected.set(item);
    }).catch(()=>{/* Keep unrecognized selection until next host update. */});
  }
  registerOnChange(fn:(id:string)=>void):void{this.onChange=fn;}
  registerOnTouched(fn:()=>void):void{this.onTouched=fn;}
  setDisabledState(disabled:boolean):void{
    this.disabled=disabled;
    if(disabled)++this.version;
  }
  validate(_:AbstractControl):ValidationErrors|null {
    return this.required&&!this.value?{required:true}:null;
  }
  outsideSelected():T|null {
    const selected=this.selected();
    return selected&&!this.items().some(x=>this.identify(x)===this.value)?selected:null;
  }
  ensureLoaded():void {
    if(!this.loaded()&&!this.loading()&&!this.disabled)void this.load();
  }
  search(event:Event):void {
    this.query=(event.target as HTMLInputElement).value;
    if(this.timer)clearTimeout(this.timer);
    ++this.version;
    this.loading.set(false);
    this.timer=setTimeout(()=>{
      this.cursors.splice(0,this.cursors.length,null);
      this.page.set(0);
      void this.load();
    },300);
  }
  changePage(page:number):void {
    if(this.disabled||page<0||page>this.page()+1||
      (page>this.page()&&!this.hasMore()))return;
    this.page.set(page);
    void this.load();
  }
  async load():Promise<void> {
    if(this.destroyed||this.disabled||!this.fetchPage)return;
    const serial=++this.version;
    const pageIndex=this.page();
    const limit=Math.max(1,Math.min(100,Math.floor(this.pageSize)));
    this.error.set(false);this.loading.set(true);
    try{
      const response=await this.fetchPage(this.query,this.cursors[pageIndex]??null,limit);
      if(this.destroyed||this.disabled||serial!==this.version)return;
      this.items.set(response.items);
      this.hasMore.set(response.hasMore);
      if(response.hasMore)this.cursors[pageIndex+1]=response.nextCursor;
      this.loaded.set(true);
      const match=response.items.find(item=>this.identify(item)===this.value);
      if(match)this.selected.set(match);
    }catch{
      if(!this.destroyed&&serial===this.version)this.error.set(true);
    }finally{
      if(!this.destroyed&&serial===this.version)this.loading.set(false);
    }
  }
  choose(event:Event):void {
    const id=(event.target as HTMLSelectElement).value;
    const item=this.items().find(x=>this.identify(x)===id)
      ??(this.selected()&&this.identify(this.selected()!)===id?this.selected():null);
    this.value=id;
    this.selected.set(item??null);
    this.onChange(id);this.onTouched();
    if(item)this.entitySelected.emit(item);
  }
  ngOnDestroy():void{
    this.destroyed=true;++this.version;++this.selectionVersion;
    if(this.timer)clearTimeout(this.timer);
  }
}
