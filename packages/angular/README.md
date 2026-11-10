# @rfdetoni/lopui-angular

Angular Package Format, compilado com Angular 21 em modo `partial`
para consumo por aplicações Angular 21 ou 22. Não incorpora uma runtime
Angular nem inclui CSS global de host. Exports standalone:

`LopSkeletonComponent`, `LopDataTableComponent`,
`LopServerPagerComponent`, `LopDirectoryFilterComponent`,
`LopStateComponent`, `LopToastComponent`,
`LopCollapsibleCardComponent`, `LopAreaSidenavComponent`,
`LopCommandPaletteComponent`, `LopEntityPickerComponent`.

Exemplo completo: `docs/EXAMPLES.md` na raiz do repositório.

Todos os fetches, credenciais, validações de negócio, quotas,
autorizações e mensagens de domínio são responsabilidade da aplicação
consumidora. `EntityPicker` recebe adaptadores async tipados, não
lê `localStorage` ou `sessionStorage`.

Licença AGPL-3.0-only. Verificar compatibilidade com a distribuição
dos produtos consumidores antes de publicar/instalar.
