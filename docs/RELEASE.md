# Publicação e versionamento

LopUI usa SemVer e licença MIT. Todos os três pacotes compartilham a mesma
versão, e package-lock.json deve ser atualizado junto com as dependências.

## Comandos de validação
npm ci
npm test
npm run build
npm run compat

O compat cria dois aplicativos consumidores isolados, com Angular 21 e 22,
instala o tarball APF local e compila seus templates. Rodar antes de cada release;
no CI de PR ele é opt-in pelo título [compat], para reduzir uso de Actions.

## Publicação
Ação: Actions > LopUI release. O parâmetro publish=false faz somente preview
e validação. Para publish=true/registry=github, o GITHUB_TOKEN do workflow
requer permissão packages:write. Para registry=npmjs, configure o segredo
NPM_TOKEN no repositório antes da execução. Nenhum segredo deve ficar no código.

Tag vX.Y.Z no GitHub também dispara publicação no GitHub Packages depois
dos testes; não criar tags antes de definir corretamente o número da versão,
nem reutilizar uma versão já publicada.

GitHub Packages pode exigir autenticação ou mudança de visibilidade
dos pacotes mesmo quando o repositório é público. Confira a acessibilidade
dos pacotes para cada aplicativo consumidor no GitHub Packages.

Somente depois de confirmar a existência da versão no registry, atualizar
package.json e package-lock.json dos frontends e executar builds completos,
testes de UI e verificações de permissões/tenant. Não montar artefatos
diretamente de caminhos de arquivos de outros repositórios.

MIT permite incorporação em software proprietário, conservando o
texto da licença e o aviso de copyright correspondente.
