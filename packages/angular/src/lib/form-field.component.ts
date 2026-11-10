import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

/**
 * Layout wrapper for template-driven or reactive form controls.
 * Projected input owns form binding and aria-invalid. Use errorId for
 * aria-describedby when the host reports an invalid field.
 */
@Component({
  selector:'lopui-form-field',
  standalone:true,
  changeDetection:ChangeDetectionStrategy.OnPush,
  template:`
    <div class="field">
      <label [attr.for]="controlId">{{label}}
        @if(required){<span class="required" aria-hidden="true">*</span>}
      </label>
      <div class="control"><ng-content/></div>
      @if(error){<small class="error" [id]="errorId" role="alert">{{error}}</small>}
      @else if(hint){<small class="hint" [id]="hintId">{{hint}}</small>}
    </div>
  `,
  styles:[`
    :host{display:block;min-width:0}
    .field{display:grid;gap:6px}
    label{display:block;color:var(--lp-body,#314a54);
      font-size:.82rem;font-weight:600;line-height:1.4}
    .required{color:var(--lp-danger,#b7354a);margin-left:4px}
    .control{display:block;min-width:0}
    :host ::ng-deep input,:host ::ng-deep select,:host ::ng-deep textarea{
      width:100%;min-width:0;min-height:var(--lp-control-height,40px);
      padding:8px 10px;border:1px solid var(--lp-border,#ccdee5);
      border-radius:var(--lp-control-radius,9px);background:var(--lp-surface,#fff);
      color:var(--lp-ink,#172d31);font:inherit}
    :host ::ng-deep input:focus-visible,:host ::ng-deep select:focus-visible,
    :host ::ng-deep textarea:focus-visible{
      outline:var(--lp-focus,2px solid #006f68);outline-offset:2px}
    small{font-size:.76rem}
    .error{color:var(--lp-danger,#b7354a)}
    .hint{color:var(--lp-muted,#516c78)}
  `]
})
export class LopFormFieldComponent {
  @Input({required:true}) controlId='';
  @Input({required:true}) label='';
  @Input() required=false;
  @Input() error='';
  @Input() hint='';
  get errorId():string{return this.controlId+'-error';}
  get hintId():string{return this.controlId+'-hint';}
}
