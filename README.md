# LopUI

Biblioteca independente de interface, tokens e contratos para o ecossistema LopFlow,
com padrões de engenharia de componentes inspirados no design system Astryx.
**Não contém código React ou dependência do Astryx.** A identidade visual
padrão é o LopFlow Design System v2, com temas adaptáveis por aplicação.

## Pacotes

| Pacote | Finalidade |
|---|---|
| `@rfdetoni/lopui-tokens` | CSS semântico e temas opcionais; independente de framework |
| `@rfdetoni/lopui-angular` | Componentes standalone, acessibilidade e estado de visualização |
| `@rfdetoni/lopui-cli` | Manifesto e templates para agentes; JSON sem acesso à rede |

Os componentes **não** efetuam autenticação, não acessam banco de dados e
não conhecem tenants. Cada host fornece dados, labels e callbacks. SQL,
RBAC, JWK, segurança clínica e operações monetárias permanecem no backend.

## Desenvolver

Node.js 22+:

```bash
npm install --no-audit --no-fund
npm test
npm run build
node packages/cli/bin/lopui.mjs manifest --json
```

O build `ng-packagr` utiliza o formato Angular Package Format com
compilação `partial` do Angular 21, permitindo consumo por apps Angular
21 e 22 com runtime Angular do host. Requer validação do build de cada
host antes do deploy.

## Consumir

Depois de **publicar** os pacotes em registro npm compatível com
`@rfdetoni`:

```bash
npm install @rfdetoni/lopui-angular @rfdetoni/lopui-tokens
```

No CSS global:

```css
@import '@rfdetoni/lopui-tokens/tokens.css';
```

No componente Angular:

```ts
import {LopSkeletonComponent,LopServerPagerComponent} from '@rfdetoni/lopui-angular';
```

Não há publicação automática, tokens npm ou push para registries.
O CI executa testes e build apenas em PRs/execuções manuais.

Documentação e guias de migração: `docs/ARCHITECTURE.md`,
`docs/INTEGRATION.md` e `docs/ACCESSIBILITY.md`.

## Licença

**AGPL-3.0-only**, conforme o arquivo LICENSE já existente neste
repositório. Ela tem obrigações de copyleft inclusive em certos usos
via rede. Antes de embutir e distribuir essa biblioteca em sistemas
proprietários, avalie com responsável jurídico se AGPL é compatível com
a estratégia de distribuição do ecossistema. A licença do Astryx é MIT,
mas nenhum código original dele foi copiado.
