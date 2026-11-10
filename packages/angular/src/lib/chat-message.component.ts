import {ChangeDetectionStrategy, Component, Input} from '@angular/core';

export interface LopChatSource {
  readonly url:string;
  readonly title:string;
}
export interface LopChatMessage {
  readonly id:string|number;
  readonly role:'user'|'assistant'|'system';
  readonly text:string;
  readonly model?:string;
  readonly sources?:readonly LopChatSource[];
}

/** Safe presentation; streaming/SSE, actions and AI permissions are host-owned. */
@Component({
  selector:'lopui-chat-message',
  standalone:true,
  changeDetection:ChangeDetectionStrategy.OnPush,
  template:`
    <article class="message" [class.mine]="message.role==='user'"
      [attr.aria-label]="roleLabel()">
      <span class="avatar" aria-hidden="true">{{message.role==='user'?'EU':'✦'}}</span>
      <div class="bubble">
        <div class="role">{{roleLabel()}}</div>
        <div class="text">{{message.text}}</div>
        @if(safeSources().length){
          <div class="sources" aria-label="Fontes">
            <strong>Fontes consultadas</strong>
            @for(source of safeSources();track source.url){
              <a [href]="source.url" target="_blank" rel="noopener noreferrer">{{source.title||source.url}}</a>
            }
          </div>
        }
        @if(message.model){<small>{{message.model}}</small>}
      </div>
    </article>
  `,
  styles:[`
    :host{display:block;min-width:0}
    .message{display:flex;gap:10px;align-items:flex-start;max-width:90%;color:var(--lp-body,#314a54)}
    .message.mine{flex-direction:row-reverse;margin-left:auto}
    .avatar{display:grid;place-items:center;flex:0 0 30px;width:30px;height:30px;border-radius:9px;
      background:var(--lp-accent-subtle,#e5f8f1);color:var(--lp-accent-dark,#006f68);
      font-size:12px;font-weight:800}
    .bubble{min-width:0;padding:12px 15px;border:1px solid var(--lp-border,#ccdee5);
      border-radius:12px;background:var(--lp-surface,#fff)}
    .mine .bubble{background:var(--lp-accent-subtle,#e5f8f1)}
    .role{font-size:.76rem;font-weight:750;margin-bottom:7px;color:var(--lp-ink,#172d31)}
    .text{white-space:pre-wrap;overflow-wrap:anywhere;font-size:.87rem;line-height:1.55}
    .sources{display:grid;gap:5px;margin-top:10px;font-size:.78rem}
    .sources strong{font-weight:600;color:var(--lp-muted,#516c78)}
    .sources a{color:var(--lp-accent-dark,#006f68);overflow-wrap:anywhere}
    .sources a:focus-visible{outline:var(--lp-focus,2px solid #006f68);outline-offset:3px}
    small{display:block;margin-top:8px;font-size:.7rem;color:var(--lp-muted,#516c78)}
  `]
})
export class LopChatMessageComponent {
  @Input({required:true}) message!:LopChatMessage;
  @Input() userLabel='Você';
  @Input() assistantLabel='Assistente';
  @Input() systemLabel='Sistema';
  roleLabel():string{
    return this.message.role==='user'?this.userLabel:
      this.message.role==='assistant'?this.assistantLabel:this.systemLabel;
  }
  safeSources():LopChatSource[]{
    return (this.message.sources??[]).filter(source=>{
      try{
        const value=new URL(source.url);
        return value.protocol==='https:'||value.protocol==='http:';
      }catch{return false;}
    });
  }
}
