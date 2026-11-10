# Integração nos hosts

1. Publicar artefatos versionados após testes e revisão da licença.
2. Adicionar dependências via registry com lockfile; não importar
   `../../lopflow-web/src/app/...` entre repositórios.
3. Referenciar tokens no CSS global e aplicar overrides locais.
4. Substituir componentes de forma incremental, mantendo seletor antigo
   até migrar seus consumidores e testes. Não remover código em massa.
5. Remover o catálogo legado `lopflow-web/packages/lop-ui` apenas após
   releases e migração funcional; antes disso apontar docs para este repo.
6. Testar `npm test && npm run build` em cada host e pelo menos um teste
   de consumo Angular 21 e Angular 22. Validar bundles, DOM e foco.
7. IAM/JWK, permissões e tenant permanecem nos serviços do host/API.

### Mapeamento

- LopFlow Angular 22: substituir gradualmente skeleton/tabela/pager
  e filtros já implementados.
- LopManager Angular 22: adaptar command palette e skeleton mantendo
  filtros locais de navegação e dark theme.
- LiviaAgent Angular Elements 22: usar tokens e estados; bridge BYOK/SSE
  continua na aplicação, não na biblioteca.
- LopKanban Angular Elements 22: reutilizar estados visuais; drag-and-drop
  e regras WIP continuam específicos do CRM.
- LiviaCare Angular 21: tokens imediatamente compatíveis; componentes
  APF Angular 21 devem ser verificados em um build do próprio host.

O host ainda deve executar auditorias com dados/sessões de teste.
