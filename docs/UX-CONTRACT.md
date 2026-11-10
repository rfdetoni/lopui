# LopUI — contratos de UX

- A busca/componente de filtro somente produz eventos tipados;
  a API do host valida allowlists, paginação e autorização.
- Botões, labels, roles, tabindex e foco devem seguir o HTML semântico.
- Formulários preservam valores quando um painel é recolhido ou a API falha.
- As respostas de escrita só geram sucesso após confirmação backend.
- CommandPalette só recebe destinos previamente autorizados do host.
- Ctrl+K vem desabilitado por padrão para evitar conflito entre MFEs.
- No logout/troca de tenant, o host cancela requests e limpa adaptadores.
- A biblioteca não define rotas, API URLs, idioma, chaves ou credenciais.
