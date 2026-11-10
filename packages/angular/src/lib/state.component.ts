import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

export type LopUiState='empty'|'error'|'forbidden'|'success';

/** Feedback state with semantics, no implicit retries or business mutations. */
@Component({
  selector:'lopui-state',
  standalone:true,
  changeDetection:ChangeDetectionStrategy.OnPush,
  template:`
    <section class="state" [attr.role]="state==='error'?'alert':'status'">
      <strong>{{title}}</strong>
      @if(message){<p>{{message}}</p>}
      @if(state==='error' && retryLabel){
        <button type="button" (click)="retry.emit()">{{retryLabel}}</button>
      }
    </section>
  `,
  styles:[`
    :host{display:block;min-width:0}
    .state{padding:20px;border:1px solid var(--lp-border,#ccdee5);
      background:var(--lp-surface,#fff);border-radius:var(--lp-radius,13px);
      color:var(--lp-body,#314a54)}
    strong{display:block;color:var(--lp-ink,#172d31)}
    p{font-size:.85rem;line-height:1.5;margin:6px 0 12px}
    button{padding:8px 12px;min-height:40px;cursor:pointer;font:inherit;
      border:1px solid var(--lp-accent-dark,#006f68);
      background:var(--lp-accent-dark,#006f68);color:white;border-radius:9px}
    button:focus-visible{outline:var(--lp-focus,2px solid #006f68);outline-offset:2px}
  `]
})
export class LopStateComponent {
  @Input() state:LopUiState='empty';
  @Input({required:true}) title='';
  @Input() message='';
  @Input() retryLabel='Tentar novamente';
  @Output() readonly retry=new EventEmitter<void>();
}
