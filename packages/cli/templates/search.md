# PowerSearch estruturado
- Campos, operadores e tipos precisam estar allowlisted na API.
- A interface somente produz estado {field, value, kind}; backend filtra e pagina.
- Resetar cursor na troca de campo, termo ou tipo; atualizar URL se o host usar deep links.
- Nunca interpolar nomes de campos fornecidos pelo usuário em SQL.
- Limitar tamanho da busca e adotar debounce no consumidor; persistir valores de filtros.
