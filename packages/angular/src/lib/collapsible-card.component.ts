import {ChangeDetectionStrategy, Component, HostListener, Input, OnChanges, OnInit, SimpleChanges, signal} from '@angular/core';

/** Content is hidden instead of destroyed, preserving unsaved NgForm state. */
@Component({
  selector:'lopui-collapsible-card',
  standalone:true,
  changeDetection:ChangeDetectionStrategy.OnPush,
  template:`
    <section class="card" [class.closed]="collapsed()" [class.action]="action">
      <h3>
        <button type="button" [attr.aria-expanded]="!collapsed()"
          [attr.aria-controls]="contentId" [attr.aria-label]="title"
          (click)="toggle()">
          @if(action){<span class="plus" aria-hidden="true">+</span>}
          <span class="title">{{title}}</span>
          @if(action&&collapsed()){<small>{{actionHint}}</small>}
          <span aria-hidden="true" class="chevron">⌄</span>
        </button>
      </h3>
      <div class="body" [id]="contentId" [hidden]="collapsed()">
        <ng-content/>
      </div>
    </section>
  `,
  styles:[`
    :host{display:block;min-width:0;scroll-margin-top:20px}
    .card{border:1px solid var(--lp-border,#ccdee5);border-radius:var(--lp-radius,13px);
      background:var(--lp-surface,#fff);min-width:0;overflow:hidden}
    .card.action.closed{background:var(--lp-accent-subtle,#e5f8f1)}
    h3{margin:0;font:inherit}
    button{display:flex;align-items:center;gap:11px;width:100%;min-height:48px;padding:11px 15px;
      color:var(--lp-ink,#172d31);background:transparent;border:0;font:inherit;
      font-weight:720;text-align:left;cursor:pointer}
    button:hover{background:var(--lp-surface-muted,#f5f8fa)}
    button:focus-visible{outline:var(--lp-focus,2px solid #006f68);outline-offset:-3px}
    .title{flex:1;min-width:0;overflow-wrap:anywhere}
    .plus{display:grid;place-items:center;flex:none;background:var(--lp-accent-dark,#006f68);
      color:white;width:32px;height:32px;border-radius:9px;font-size:23px}
    small{font-size:.75rem;color:var(--lp-accent-dark,#006f68)}
    .chevron{transition:transform .15s ease}
    .closed .chevron{transform:rotate(-90deg)}
    .body{border-top:1px solid var(--lp-border,#ccdee5);padding:12px 15px 16px}
    .body[hidden]{display:none}
    @media(max-width:600px){small{display:none}}
    @media(prefers-reduced-motion:reduce){.chevron{transition:none}}
  `]
})
export class LopCollapsibleCardComponent implements OnInit,OnChanges {
  private static nextId=0;
  readonly contentId='lopui-panel-'+(++LopCollapsibleCardComponent.nextId);
  readonly collapsed=signal(false);
  @Input({required:true}) title='';
  @Input() startCollapsed=false;
  @Input() action=false;
  @Input() actionHint='Abrir cadastro';
  @Input() expandWhenInvalid=false;

  ngOnInit():void{this.collapsed.set(this.startCollapsed);}
  ngOnChanges(changes:SimpleChanges):void{
    if(changes['expandWhenInvalid']?.currentValue===true)this.collapsed.set(false);
  }
  toggle():void{this.collapsed.update(v=>!v);}
  @HostListener('window:hashchange')
  openFromHash():void {
    // A host may supply its own id to this element for an in-page anchor.
    if(typeof location==='undefined')return;
    const id=(document.getElementById(location.hash.slice(1)))?.id;
    if(id && id===location.hash.slice(1))this.collapsed.set(false);
  }
}
