# Lista e tabela
- A API é autoridade da autorização e do tenant.
- Usar paginação remota limitada. Não transformar o carregamento inicial em SELECT global.
- Nunca realizar sort/filter só nos registros da página se o usuário espera busca global.
- Estado de loading usa skeleton sem inventar informações.
- Exibir vazio, 401/403, erro recuperável e retry com i18n do host.
- Ações de escrita exigem autorização real e confirmação do backend.
- Controlar foco, aria-busy, aria-label e reduced motion.
