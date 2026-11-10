import {
  ChangeDetectionStrategy, Component, ElementRef, EventEmitter,
  HostListener, Input, OnChanges, Output, SimpleChanges, ViewChild
} from '@angular/core';
import {FormsModule} from '@angular/forms';

export interface LopCommand {
  readonly id:string;
  readonly label:string;
  readonly section:string;
}

/** The host MUST provide only authorized commands. Never grants access itself. */
@Component({
  selector:'lopui-command-palette',
  standalone:true,
  imports:[FormsModule],
  changeDetection:ChangeDetectionStrategy.OnPush,
  template:`
    @if(open){
      <div class="backdrop" role="presentation" (click)="close()">
        <section #dialog class="dialog" role="dialog" aria-modal="true"
          [attr.aria-labelledby]="titleId" (click)="$event.stopPropagation()"
          (keydown)="onDialogKey($event)">
          <header>
            <h2 [id]="titleId">{{title}}</h2>
            <button type="button" class="close" (click)="close()" [attr.aria-label]="closeLabel">×</button>
          </header>
          <label [attr.for]="queryId">{{searchLabel}}</label>
          <input #queryInput [id]="queryId" type="search" autocomplete="off"
            [(ngModel)]="query" [placeholder]="placeholder"/>
          <div class="choices" role="group" aria-label="Resultados">
            @for(item of filtered();track item.id){
              <button type="button" class="choice" (click)="choose(item.id)">
                <span>{{item.label}}</span><small>{{item.section}}</small>
              </button>
            } @empty {<p role="status">{{emptyLabel}}</p>}
          </div>
          <footer>Ctrl/⌘ K · Escape</footer>
        </section>
      </div>
    }
  `,
  styles:[`
    :host{display:contents}
    .backdrop{position:fixed;inset:0;z-index:3000;display:flex;justify-content:center;
      align-items:flex-start;padding:clamp(36px,10vh,96px) 12px 16px;
      background:rgba(10,18,28,.66)}
    .dialog{display:flex;flex-direction:column;gap:10px;width:min(100%,570px);
      max-height:min(80vh,700px);overflow:hidden;padding:19px;
      border-radius:var(--lp-radius,13px);border:1px solid var(--lp-border,#ccdee5);
      color:var(--lp-body,#314a54);background:var(--lp-surface,#fff);
      box-shadow:0 18px 60px #0005}
    header{display:flex;align-items:center;justify-content:space-between;gap:10px}
    h2{font-size:1.1rem;color:var(--lp-ink,#172d31);margin:0}
    label{font-size:.8rem;color:var(--lp-muted,#516c78)}
    input{min-height:44px;padding:8px 12px;border-radius:var(--lp-control-radius,9px);
      border:1px solid var(--lp-border,#ccdee5);background:var(--lp-surface-muted,#f5f8fa);
      color:var(--lp-ink,#172d31);font:inherit}
    .choices{min-height:0;overflow-y:auto;display:grid;align-content:start;gap:4px}
    .choice{min-height:44px;display:flex;align-items:center;justify-content:space-between;
      gap:10px;width:100%;text-align:left;background:transparent;
      border:1px solid transparent;border-radius:8px;padding:10px;
      color:var(--lp-body,#314a54);font:inherit;cursor:pointer}
    .choice:hover,.choice:focus-visible{background:var(--lp-accent-subtle,#e5f8f1);
      border-color:var(--lp-border,#ccdee5)}
    .choice small{font-size:.75rem;color:var(--lp-muted,#516c78)}
    .close{background:transparent;color:inherit;border:1px solid var(--lp-border,#ccdee5);
      border-radius:7px;font:inherit;padding:5px 10px;cursor:pointer}
    input:focus-visible,button:focus-visible{outline:var(--lp-focus,2px solid #006f68);outline-offset:2px}
    footer{font-size:.7rem;color:var(--lp-muted,#516c78);padding-top:10px;
      border-top:1px solid var(--lp-border,#ccdee5)}
    .choices p{font-size:.84rem}
  `]
})
export class LopCommandPaletteComponent implements OnChanges {
  private static serial=0;
  readonly serial=++LopCommandPaletteComponent.serial;
  readonly titleId='lopui-command-title-'+this.serial;
  readonly queryId='lopui-command-query-'+this.serial;
  @Input() open=false;
  @Input() shortcutEnabled=false;
  @Input() commands:readonly LopCommand[]=[];
  @Input() title='Ir para uma área';
  @Input() searchLabel='Buscar destinos disponíveis';
  @Input() placeholder='Digite o nome da área';
  @Input() closeLabel='Fechar busca';
  @Input() emptyLabel='Nenhum destino encontrado.';
  @Output() readonly openChange=new EventEmitter<boolean>();
  @Output() readonly selected=new EventEmitter<string>();
  @ViewChild('queryInput') queryInput?:ElementRef<HTMLInputElement>;
  @ViewChild('dialog') dialog?:ElementRef<HTMLElement>;
  private previousFocus:HTMLElement|null=null;
  query='';

  ngOnChanges(changes:SimpleChanges):void {
    if(changes['open']?.currentValue){
      this.query='';
      if(typeof document!=='undefined')this.previousFocus=document.activeElement as HTMLElement;
      queueMicrotask(()=>this.queryInput?.nativeElement.focus());
    }
  }
  filtered():LopCommand[]{
    const term=this.query.trim().toLocaleLowerCase('pt-BR');
    return this.commands.filter(c=>!term||
      (c.label+' '+c.section).toLocaleLowerCase('pt-BR').includes(term)).slice(0,30);
  }
  choose(id:string):void{
    if(!this.commands.some(c=>c.id===id))return;
    this.selected.emit(id);
    this.close();
  }
  close():void{
    this.openChange.emit(false);
    const target=this.previousFocus;
    queueMicrotask(()=>target?.focus());
  }
  @HostListener('document:keydown',['$event'])
  globalShortcut(event:KeyboardEvent):void{
    if(!this.shortcutEnabled)return;
    if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){
      event.preventDefault();
      if(this.open)this.close();else this.openChange.emit(true);
    }
    if(event.key==='Escape'&&this.open)this.close();
  }
  onDialogKey(event:KeyboardEvent):void{
    if(event.key==='Escape'){event.preventDefault();this.close();return;}
    const root=this.dialog?.nativeElement;
    if(!root)return;
    const controls=Array.from(root.querySelectorAll<HTMLElement>('button:not([disabled]),input:not([disabled])'));
    const active=document.activeElement as HTMLElement,index=controls.indexOf(active);
    if(event.key==='Tab'&&controls.length){
      if(event.shiftKey&&active===controls[0]){event.preventDefault();controls.at(-1)?.focus();}
      else if(!event.shiftKey&&active===controls.at(-1)){
        event.preventDefault();controls[0].focus();
      }
    }else if(event.key==='Enter'&&active===this.queryInput?.nativeElement){
      const item=this.filtered()[0];
      if(item){event.preventDefault();this.choose(item.id);}
    }else if((event.key==='ArrowDown'||event.key==='ArrowUp')&&controls.length){
      event.preventDefault();
      const delta=event.key==='ArrowDown'?1:-1;
      controls[(index+delta+controls.length)%controls.length].focus();
    }
  }
}
