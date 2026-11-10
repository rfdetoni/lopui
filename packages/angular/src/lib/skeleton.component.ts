import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

/** Reserve layout space without reporting invented business values. */
@Component({
  selector: 'lopui-skeleton',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="lp-skeleton-page" role="status" [attr.aria-label]="label">
      <div class="lp-skeleton-line heading" aria-hidden="true"></div>
      <div class="lp-skeleton-line subtitle" aria-hidden="true"></div>
      @if (variant === 'dashboard') {
        <div class="lp-skeleton-grid">
          @for (item of [0,1,2]; track item) {
            <div class="lp-skeleton-card" aria-hidden="true">
              <span class="lp-skeleton-line"></span>
              <span class="lp-skeleton-line value"></span>
              <span class="lp-skeleton-line short"></span>
            </div>
          }
        </div>
      }
      <div class="lp-skeleton-card" aria-hidden="true">
        @for (item of [0,1,2,3]; track item) {
          <div class="lp-skeleton-row">
            <span class="lp-skeleton-line"></span>
            <span class="lp-skeleton-line short"></span>
            <span class="lp-skeleton-line"></span>
          </div>
        }
      </div>
      <span class="visually-hidden">{{label}}</span>
    </section>
  `,
  styles: [`
    :host{display:block;min-width:0}
    .lp-skeleton-page{display:grid;gap:12px}
    .lp-skeleton-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
    .lp-skeleton-card{min-width:0;display:grid;gap:12px;padding:18px;
      border:1px solid var(--lp-border,#ccdee5);background:var(--lp-surface,#fff);
      border-radius:var(--lp-radius,13px)}
    .lp-skeleton-row{display:grid;grid-template-columns:2fr 1fr 1.5fr;gap:12px}
    .lp-skeleton-line{display:block;min-width:0;height:13px;width:100%;border-radius:7px;
      background:linear-gradient(90deg,#dce9eb 17%,#f3f8f9 48%,#dce9eb 83%);
      background-size:200% 100%;animation:lp-ui-shimmer 1.4s ease-in-out infinite}
    .heading{height:25px;width:45%}.subtitle{width:68%}.value{height:32px}.short{width:55%}
    .visually-hidden{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
    @keyframes lp-ui-shimmer{from{background-position:180%}to{background-position:-20%}}
    @media(max-width:680px){.lp-skeleton-grid{grid-template-columns:1fr}.lp-skeleton-row{gap:6px}}
    @media(prefers-reduced-motion:reduce){.lp-skeleton-line{animation:none}}
  `]
})
export class LopSkeletonComponent {
  @Input() variant: 'dashboard'|'list' = 'list';
  @Input() label = 'Carregando dados…';
}
