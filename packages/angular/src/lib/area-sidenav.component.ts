import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

export interface LopAreaNavItem {
  readonly id:string;
  readonly label:string;
}

@Component({
  selector:'lopui-area-sidenav',
  standalone:true,
  changeDetection:ChangeDetectionStrategy.OnPush,
  template:`
    <nav class="area-nav" [attr.aria-label]="title">
      <span class="caption">{{title}}</span>
      @for(item of items;track item.id){
        <a [attr.href]="'#'+item.id">{{item.label}}</a>
      }
    </nav>
  `,
  styles:[`
    :host{display:block;min-width:0}
    .area-nav{position:sticky;top:22px;display:grid;gap:4px;
      max-height:calc(100dvh - 44px);overflow:auto;padding:12px 9px;
      border:1px solid var(--lp-border,#ccdee5);border-radius:11px;
      background:var(--lp-surface,#fff)}
    .caption{padding:5px 10px 8px;color:var(--lp-muted,#516c78);
      font-size:.7rem;letter-spacing:.08em;font-weight:740;text-transform:uppercase}
    a{display:block;padding:9px 10px;border-radius:8px;color:var(--lp-body,#314a54);
      font-size:.83rem;font-weight:600;text-decoration:none}
    a:hover{background:var(--lp-accent-subtle,#e5f8f1);
      color:var(--lp-accent-dark,#006f68)}
    a:focus-visible{outline:var(--lp-focus,2px solid #006f68);outline-offset:-2px}
    @media(max-width:1100px){
      .area-nav{position:static;display:flex;align-items:center;max-height:none;
        overflow-x:auto;padding:5px;white-space:nowrap}
      .caption,a{flex-shrink:0}
    }
  `]
})
export class LopAreaSidenavComponent {
  @Input({required:true}) items: readonly LopAreaNavItem[]=[];
  @Input() title='Nesta área';
}
