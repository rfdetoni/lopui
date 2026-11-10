# LopUI — regras para agentes
- A fonte canônica de tokens é `packages/tokens/tokens.css`.
- Não trocar a identidade LopFlow v2 por um tema Material/React genérico.
- Não introduzir dependências Angular no pacote tokens ou CLI.
- Componentes Angular standalone, OnPush quando aplicável, imports explícitos e CSS local.
- Contratos de dados são somente apresentação: não implementar autenticação,
  sessão, tenancy, acesso a API, queries SQL ou escritas comerciais aqui.
- Não incluir código privado de negócio ou segredos extraídos de apps consumidores.
- Skeleton não inventa informações; estados vazio/erro/loading/sem permissão são distintos.
- Paginação e filtros são executados pelo backend; esta biblioteca só emite eventos.
- Testar teclado, foco, aria, estado de carregamento, 360px, 200% zoom e reduced-motion.
- Validar `npm test` e `npm run build` antes de qualquer PR/merge.
- Atualizar o manifesto da CLI ao adicionar/remover componentes.
- Preservar a licença MIT e os avisos de copyright em todos os pacotes; não copiar código AGPL/GPL de terceiros.
- Publicação versionada requer validação de build e testes antes do registro.
- CI mínimo: PR / workflow_dispatch; sem runner pesado em todo push.

- Antes de release, validar npm run compat para os consumidores Angular 21 e 22. CI comum nunca publica pacotes; registrar versões com revisão explícita.
