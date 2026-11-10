import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

export type LopStatusTone='neutral'|'success'|'warning'|'danger'|'info';

@Component({
  selector:'lopui-status-badge',
  standalone:true,
  changeDetection:ChangeDetectionStrategy.OnPush,
  template:`<span [attr.data-tone]="tone">{{label}}</span>`,
  styles:[`
    :host{display:inline-flex;min-width:0}
    span{display:inline-flex;align-items:center;padding:4px 8px;border-radius:7px;
      font-size:.75rem;font-weight:700;background:var(--lp-surface-muted,#eef3f6);
      color:var(--lp-body,#526b77)}
    [data-tone=success]{background:var(--lp-accent-subtle,#dff8ed);
      color:var(--lp-accent-dark,#087958)}
    [data-tone=warning]{background:#fff4da;color:#885b0d}
    [data-tone=danger]{background:#fff0f0;color:#ad3444}
    [data-tone=info]{background:#eaf2ff;color:#275eb0}
  `]
})
export class LopStatusBadgeComponent {
  @Input({required:true}) label='';
  @Input() tone:LopStatusTone='neutral';
}
