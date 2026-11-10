# Exemplos de utilização

Após build, licença aprovada e publicação dos pacotes no registry:

```ts
import {
  LopDataTableComponent, LopServerPagerComponent, LopDirectoryFilterComponent,
  type LopTableColumn, type LopFilterField
} from '@rfdetoni/lopui-angular';
interface Product {id:string;sku:string;name:string}
const columns:readonly LopTableColumn<Product>[]=[
 {id:'sku',header:'SKU',value:product=>product.sku},
 {id:'name',header:'Produto',value:product=>product.name,strong:true}
];
const fields:readonly LopFilterField[]=[
 {id:'all',label:'Nome ou SKU',operator:'contains'},
 {id:'sku',label:'SKU',operator:'contains'}
];
```

```html
<lopui-directory-filter [fields]="fields" [query]="query"
 [field]="field" (filtersChange)="onFiltersChanged($event)"/>
<lopui-data-table [rows]="products" [columns]="columns"
 [identify]="productId" [loading]="loading" label="Produtos"/>
<lopui-server-pager [page]="page" [hasMore]="hasMore"
 (pageChange)="loadPage($event)"/>
```

A função `onFiltersChanged` chama o backend para filtrar a base completa,
não apenas os registros que estão na página. O componente EntityPicker
recebe `fetchPage(query,cursor,limit)`, `fetchById(id)`, `identify` e
`display`, sem acesso a APIs, storage ou identidade.
