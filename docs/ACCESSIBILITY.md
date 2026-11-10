# Contratos de acessibilidade

- `button` real para ações; `a` para navegação; labels de controles.
- Focus-visible, Escape, Tab, foco de retorno e modal com gestão real
  de foco quando utilizado.
- Skeleton com `role=status` e conteúdo visual `aria-hidden`.
- Erros com `role=alert`, mensagens localizadas do host e retry explícito.
- Não usar cor isoladamente para estado ou permissão.
- `prefers-reduced-motion` desliga animações, inclusive shimmer.
- Não assumir cobertura WCAG integral sem Playwright/axe e QA manual
  com teclado, leitor de tela, mobile e zoom.
- Não ler dados de API durante testes públicos; staging autenticado
  fica fora da biblioteca.
