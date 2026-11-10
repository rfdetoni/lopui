# Angular Elements / MFE
- O host fornece identidade e sessionProvider; a biblioteca visual não armazena tokens.
- Variáveis CSS --lp-* são herdadas, com fallback dentro do ShadowRoot.
- Os eventos closeRequested e similares pertencem ao adapter do host.
- Troca de tenant cancela requests da aplicação e limpa estado associado.
- Angular 21+ pode usar APF partial compilado com Angular 21; validar bundle do host.
- Não duplicar a runtime Angular dentro de um aplicativo hospedeiro sem necessidade.
