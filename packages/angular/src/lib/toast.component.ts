import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

export type LopToastTone='info'|'success'|'warning'|'error';

@Component({
  selector:'lopui-toast',
  standalone:true,
  changeDetection:ChangeDetectionStrategy.OnPush,
  template:`
    <div class="toast" [attr.data-tone]="tone"
      [attr.role]="tone==='error'?'alert':'status'"
      [attr.aria-live]="tone==='error'?'assertive':'polite'">
      <div class="copy"><strong>{{title}}</strong>@if(message){<p>{{message}}</p>}</div>
      <button type="button" [attr.aria-label]="dismissLabel" (click)="dismiss.emit()">×</button>
    </div>
  `,
  styles:[`
    :host{display:block}
    .toast{display:flex;align-items:start;justify-content:space-between;gap:12px;
      border:1px solid var(--lp-border,#ccdee5);border-radius:10px;
      color:var(--lp-body,#314a54);background:var(--lp-surface,#fff);
      padding:12px 14px;box-shadow:var(--lp-shadow,0 4px 12px #0001)}
    [data-tone=error]{border-color:var(--lp-danger,#b7354a)}
    [data-tone=success]{border-color:var(--lp-accent,#008d80)}
    [data-tone=warning]{border-color:var(--lp-warning,#946112)}
    strong{font-size:.88rem;color:var(--lp-ink,#172d31)}
    p{font-size:.8rem;margin:5px 0 0}
    button{color:inherit;background:transparent;border:0;cursor:pointer;
      padding:3px 7px;min-height:32px;font:inherit;font-size:18px}
    button:focus-visible{outline:var(--lp-focus,2px solid #006f68);outline-offset:2px}
  `]
})
export class LopToastComponent {
  @Input({required:true}) title='';
  @Input() message='';
  @Input() tone:LopToastTone='info';
  @Input() dismissLabel='Fechar aviso';
  @Output() readonly dismiss=new EventEmitter<void>();
}
