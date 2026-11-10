import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {FormsModule} from '@angular/forms';

export type LopFilterOperator='contains'|'equals';
export interface LopFilterField {
  readonly id:string;
  readonly label:string;
  readonly operator:LopFilterOperator;
}
export interface LopFilterOption {
  readonly value:string;
  readonly label:string;
}
export interface LopDirectoryQuery {
  readonly field:string;
  readonly query:string;
  readonly kind:string;
  readonly operator:LopFilterOperator;
}

/** Typed filter controls. No client-side filtering or SQL construction. */
@Component({
  selector:'lopui-directory-filter',
  standalone:true,
  imports:[FormsModule],
  changeDetection:ChangeDetectionStrategy.OnPush,
  template:`
    <div class="controls" role="search" [attr.aria-label]="label">
      <label>Buscar em
        <select [ngModel]="field" (ngModelChange)="emitField($event)">
          @for(option of fields;track option.id){
            <option [value]="option.id">{{option.label}}</option>
          }
        </select>
      </label>
      <label class="query">Valor
        <input type="search" [ngModel]="query" (ngModelChange)="emitQuery($event)"
          [attr.maxlength]="maxLength" [placeholder]="placeholder" autocomplete="off"/>
      </label>
      @if(kinds.length){
        <label>Tipo
          <select [ngModel]="kind" (ngModelChange)="emitKind($event)">
            <option value="">Todos</option>
            @for(option of kinds;track option.value){
              <option [value]="option.value">{{option.label}}</option>
            }
          </select>
        </label>
      }
      @if(query.trim() || field!==defaultField || kind){
        <button type="button" (click)="clear.emit()">Limpar filtros</button>
      }
    </div>
    @if(query.trim() || kind){
      <div class="active" role="group" aria-label="Filtros ativos">
        @if(query.trim()){
          <span>{{activeLabel()}}: {{query.trim()}}</span>
        }
        @if(kind){<span>{{kindLabel()}}</span>}
      </div>
    }
  `,
  styles:[`
    :host{display:block}
    .controls{display:flex;align-items:end;flex-wrap:wrap;gap:10px;margin:10px 0}
    label{display:grid;gap:5px;font-size:.8rem;font-weight:600;color:var(--lp-muted,#516c78)}
    .query{flex:1;min-width:min(100%,180px)}
    select,input,button{min-height:var(--lp-control-height,40px);
      border:1px solid var(--lp-border,#ccdee5);border-radius:var(--lp-control-radius,9px);
      background:var(--lp-surface,#fff);color:var(--lp-ink,#172d31);
      padding:7px 10px;font:inherit;font-size:.85rem}
    input{width:100%}
    button{cursor:pointer}
    button:focus-visible,input:focus-visible,select:focus-visible{
      outline:var(--lp-focus,2px solid #006f68);outline-offset:2px}
    .active{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 9px}
    .active span{font-size:.75rem;padding:5px 8px;border:1px solid var(--lp-border,#ccdee5);
      background:var(--lp-accent-subtle,#e5f8f1);
      color:var(--lp-accent-dark,#006f68);border-radius:7px}
  `]
})
export class LopDirectoryFilterComponent {
  @Input({required:true}) fields: readonly LopFilterField[]=[];
  @Input() kinds: readonly LopFilterOption[]=[];
  @Input() defaultField='all';
  @Input() field='all';
  @Input() kind='';
  @Input() query='';
  @Input() label='Filtros';
  @Input() placeholder='Pesquisar';
  @Input() maxLength=160;
  @Output() readonly fieldChange=new EventEmitter<string>();
  @Output() readonly queryChange=new EventEmitter<string>();
  @Output() readonly kindChange=new EventEmitter<string>();
  @Output() readonly filtersChange=new EventEmitter<LopDirectoryQuery>();
  @Output() readonly clear=new EventEmitter<void>();

  emitField(field:string):void{
    if(!this.fields.some(option=>option.id===field))return;
    this.fieldChange.emit(field);
    this.filtersChange.emit({field,query:this.query,kind:this.kind,
      operator:this.operatorFor(field)});
  }
  emitQuery(query:string):void{
    this.queryChange.emit(query);
    this.filtersChange.emit({field:this.field,query,kind:this.kind,
      operator:this.operatorFor(this.field)});
  }
  emitKind(kind:string):void{
    if(kind!==''&&!this.kinds.some(option=>option.value===kind))return;
    this.kindChange.emit(kind);
    this.filtersChange.emit({field:this.field,query:this.query,kind,
      operator:this.operatorFor(this.field)});
  }
  private operatorFor(field:string):LopFilterOperator{
    return this.fields.find(f=>f.id===field)?.operator??'contains';
  }
  activeLabel():string{return this.fields.find(f=>f.id===this.field)?.label??'Busca';}
  kindLabel():string{return this.kinds.find(x=>x.value===this.kind)?.label??'';}
}
