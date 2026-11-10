import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

export interface LopTableColumn<T> {
  readonly id: string;
  readonly header: string;
  readonly value: (row: T) => string|number|null|undefined;
  readonly strong?: boolean;
}

/** Presentation only: backend owns pagination, sorting and row authorization. */
@Component({
  selector: 'lopui-data-table',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="table-scroll" role="region" tabindex="0" [attr.aria-label]="label">
      <table [attr.aria-busy]="loading">
        <thead><tr>
          @for (column of columns; track column.id) {
            <th scope="col">{{column.header}}</th>
          }
        </tr></thead>
        <tbody>
          @if (loading) {
            @for (row of [0,1,2,3]; track row) {
              <tr>
                @for (column of columns; track column.id) {
                  <td><span class="skeleton-line" aria-hidden="true"></span></td>
                }
              </tr>
            }
          } @else {
            @for (row of rows; track identify(row)) {
              <tr>
                @for (column of columns; track column.id) {
                  <td>
                    @if (column.strong) {
                      @if (interactive) {
                        <button type="button" class="row-link"
                          (click)="rowActivated.emit(row)">{{column.value(row) ?? '—'}}</button>
                      } @else {
                        <strong>{{column.value(row) ?? '—'}}</strong>
                      }
                    } @else {
                      {{column.value(row) ?? '—'}}
                    }
                  </td>
                }
              </tr>
            } @empty {
              <tr><td [attr.colspan]="columns.length" class="empty">{{emptyMessage}}</td></tr>
            }
          }
        </tbody>
      </table>
    </div>
    @if (loading) {
      <span class="visually-hidden" role="status">{{loadingLabel}}</span>
    }
  `,
  styles: [`
    :host{display:block;min-width:0}
    .table-scroll{max-width:100%;overflow:auto;border:1px solid var(--lp-border,#ccdee5);
      border-radius:var(--lp-control-radius,9px)}
    table{width:100%;border-collapse:collapse;text-align:left}
    th,td{padding:11px 12px;border-bottom:1px solid var(--lp-border,#ccdee5);
      color:var(--lp-body,#314a54);font:inherit;font-size:.86rem}
    th{background:var(--lp-surface-muted,#f5f8fa);
      color:var(--lp-muted,#516c78);font-size:.75rem;text-align:left}
    th,td{white-space:nowrap}
    tr:last-child td{border-bottom:0}
    td strong{color:var(--lp-ink,#172d31)}
    .empty{padding:24px;text-align:center;white-space:normal;color:var(--lp-muted,#516c78)}
    .row-link{background:none;border:0;padding:3px 0;color:var(--lp-accent-dark,#006f68);
      text-align:left;font:inherit;font-weight:700;cursor:pointer}
    .row-link:hover{text-decoration:underline}
    .row-link:focus-visible{outline:var(--lp-focus,2px solid #006f68);outline-offset:3px}
    .skeleton-line{display:block;height:12px;min-width:65px;border-radius:7px;
      background:linear-gradient(90deg,#dce9eb,#f2f8f9,#dce9eb);background-size:200% 100%;
      animation:lp-ui-shimmer 1.4s ease-in-out infinite}
    .visually-hidden{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
    @keyframes lp-ui-shimmer{from{background-position:180%}to{background-position:-20%}}
    @media(prefers-reduced-motion:reduce){.skeleton-line{animation:none}}
  `]
})
export class LopDataTableComponent<T> {
  @Input({required: true}) columns: readonly LopTableColumn<T>[] = [];
  @Input({required: true}) rows: readonly T[] = [];
  @Input({required: true}) identify!: (row: T) => string;
  @Input() loading = false;
  @Input() interactive = false;
  @Input() label = 'Tabela de registros';
  @Input() loadingLabel = 'Carregando registros…';
  @Input() emptyMessage = 'Nenhum registro encontrado.';
  @Output() readonly rowActivated = new EventEmitter<T>();
}
