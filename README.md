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

Após publicar os pacotes em registro npm compatível com
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

**MIT** — permite incorporar, modificar e distribuir LopUI em aplicações
comerciais e proprietárias sem exigir que o código dos consumidores seja
publicado. A obrigação principal é manter o aviso de copyright e a
licença MIT nas cópias ou partes substanciais da biblioteca. A licença
do Astryx também é MIT; LopUI utiliza código próprio, sem importar a
biblioteca React.

### Distribuição e licenças

Cada pacote inclui sua própria cópia da licença MIT.
`npm run build` produz `dist/angular` com a biblioteca APF;
`npm pack --dry-run` verifica o conteúdo antes de qualquer publicação.
A biblioteca não está publicada em npm/GitHub Packages nesta etapa.

## Compatibilidade e releases

O comando npm run compat compila o consumo dos 14 componentes em Angular 21 e 22, a partir de tarballs locais. Para publicação manual ou por tag (GitHub Packages e npmjs), consulte docs/RELEASE.md. A licença MIT permanece nos três pacotes.

A publicação GitHub Packages pode ser disparada via PR de versão alterando
`RELEASE`, sem disponibilizar tokens em arquivos. Consulte [docs/RELEASE.md](docs/RELEASE.md).
