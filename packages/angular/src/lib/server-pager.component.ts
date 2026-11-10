import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

/** For keyset endpoints that return hasMore rather than inaccurate totals. */
@Component({
  selector: 'lopui-server-pager',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="pager" [attr.aria-label]="label">
      <span>Página {{page+1}}</span>
      <button type="button" [disabled]="busy || page<=0"
        (click)="pageChange.emit(page-1)">{{previousLabel}}</button>
      <button type="button" [disabled]="busy || !hasMore"
        (click)="pageChange.emit(page+1)">{{nextLabel}}</button>
    </nav>
  `,
  styles: [`
    :host{display:block}
    .pager{display:flex;align-items:center;justify-content:flex-end;gap:9px;flex-wrap:wrap;
      color:var(--lp-muted,#516c78);font-size:.84rem;padding:9px 0}
    button{min-height:var(--lp-control-height,40px);border-radius:var(--lp-control-radius,9px);
      border:1px solid var(--lp-border,#ccdee5);background:var(--lp-surface,#fff);
      color:var(--lp-ink,#172d31);padding:7px 12px;font:inherit;cursor:pointer}
    button:disabled{opacity:.52;cursor:not-allowed}
    button:focus-visible{outline:var(--lp-focus,2px solid #006f68);outline-offset:2px}
  `]
})
export class LopServerPagerComponent {
  @Input({required:true}) page=0;
  @Input({required:true}) hasMore=false;
  @Input() busy=false;
  @Input() label='Paginação';
  @Input() previousLabel='Anterior';
  @Input() nextLabel='Próxima';
  @Output() readonly pageChange=new EventEmitter<number>();
}
