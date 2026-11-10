import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

export interface LopKanbanChip {
  readonly label:string;
  readonly value:string|number;
}
export interface LopKanbanCard {
  readonly id:string;
  readonly title:string;
  readonly description?:string;
  readonly chips?:readonly LopKanbanChip[];
  readonly elapsedLabel?:string;
}

/** Pure card view. Drag/drop, WIP and transition security belong to the host CRM. */
@Component({
  selector:'lopui-kanban-card',
  standalone:true,
  changeDetection:ChangeDetectionStrategy.OnPush,
  template:`
    <article class="card">
      <header><button type="button" class="open" (click)="open.emit(card.id)"
        [attr.aria-label]="openLabel+' '+card.title">{{card.title}}</button></header>
      @if(card.description){<p>{{card.description}}</p>}
      @if(card.chips?.length){
        <div class="chips">
          @for(chip of card.chips??[];track chip.label){
            <span>{{chip.label}}: {{chip.value}}</span>
          }
        </div>
      }
      <footer>
        <small>{{card.elapsedLabel??''}}</small>
        @if(showHistory){
          <button type="button" class="history" [attr.aria-label]="historyLabel+' '+card.title"
            (click)="historyRequested.emit(card.id)">☷</button>
        }
      </footer>
    </article>
  `,
  styles:[`
    :host{display:block;min-width:0}
    .card{min-width:0;border:1px solid var(--lp-border,#ccdee5);
      border-radius:11px;padding:12px;background:var(--lp-surface,#fff);
      color:var(--lp-body,#314a54);box-shadow:var(--lp-shadow,0 3px 8px #0001)}
    header{display:flex;align-items:center;justify-content:space-between}
    .open{text-align:left;cursor:pointer;border:0;background:transparent;
      font:inherit;font-weight:720;color:var(--lp-ink,#172d31);padding:2px 0;
      overflow-wrap:anywhere}
    p{font-size:.79rem;margin:8px 0;line-height:1.45;overflow-wrap:anywhere}
    .chips{display:flex;flex-wrap:wrap;gap:5px;margin:8px 0}
    .chips span{background:var(--lp-surface-muted,#f5f8fa);border:1px solid var(--lp-border,#ccdee5);
      border-radius:6px;padding:3px 6px;font-size:.71rem;overflow-wrap:anywhere}
    footer{display:flex;align-items:center;justify-content:space-between;gap:8px}
    small{font-size:.73rem;color:var(--lp-muted,#516c78)}
    .history{border:1px solid var(--lp-border,#ccdee5);border-radius:7px;
      color:var(--lp-body,#314a54);background:var(--lp-surface,#fff);min-width:34px;
      min-height:34px;font:inherit;cursor:pointer}
    button:focus-visible{outline:var(--lp-focus,2px solid #006f68);outline-offset:2px}
  `]
})
export class LopKanbanCardComponent {
  @Input({required:true}) card!:LopKanbanCard;
  @Input() showHistory=true;
  @Input() openLabel='Abrir cartão';
  @Input() historyLabel='Histórico de';
  @Output() readonly open=new EventEmitter<string>();
  @Output() readonly historyRequested=new EventEmitter<string>();
}
