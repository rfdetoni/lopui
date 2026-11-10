# Arquitetura LopUI

`tokens` é CSS e pode ser usado por qualquer aplicação. `angular`
é uma biblioteca APF compilada parcialmente com Angular 21; os consumidores
Angular 21/22 compartilham o runtime Angular do host. `cli` fornece
manifesto e contratos para agentes. Nenhum pacote importa código fonte
dos repositórios privados LopFlow, LopManager, LiviaCare ou LiviaAgent.

### Separação de responsabilidades

- LopUI: controles, semântica, a11y, apresentação, estado visual e eventos.
- Host: HttpClient, sessão IAM, handlers de erros traduzidos, navegação,
  controles de acesso visuais, dados de negócio e chamadas de ferramentas.
- API: autorização real, isolamento de schema, validação, transações,
  logging e proteção de dados.

### Identidade

O design v2 conserva `--lp-*`, mas os consumidores podem fornecer
valores por CSS var. Dark mode é opt-in `[data-lop-theme=dark]`;
LiviaCare preserva seu tema clínico. Angular Elements herdam variáveis
customizadas do elemento host. Não instanciar Angular/React extra para
apenas compartilhar tokens.

### Performance

- Imports explícitos por componente; sem ícones remotos/fontes externas.
- `@defer` e chunks ficam a cargo do aplicativo host.
- Páginas e filtros sempre executados no backend.
- Virtualização apenas com necessidade e medida; não faz parte da
  tabela de 25 registros do ERP.

### Licença

Todos os pacotes LopUI usam MIT; podem ser incorporados em produtos comerciais e proprietários, preservando a atribuição e o aviso de copyright. Não há obrigação de abrir o código dos consumidores.
