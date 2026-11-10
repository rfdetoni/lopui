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

## Primitivas de MFE

`LopChatMessageComponent` mostra texto e fontes HTTP(S) sem HTML bruto;
o streaming SSE e as permissões de documentos continuam na aplicação.
`LopKanbanCardComponent` só apresenta o cartão; o CDK drag-and-drop,
WIP e aprovação de transições continuam no Kanban host.
`LopFormFieldComponent` concentra a disposição visual; cada controle
projetado continua dono de seu `FormControl` e `aria-invalid`.
`LopStatusBadgeComponent` fornece indicação de estado com texto visível.
