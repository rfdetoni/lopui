# LopUI Design System — LopFlow v2

A fonte canônica dos tokens é `packages/tokens/tokens.css`.
A biblioteca disponibiliza nomes de semântica (canvas, ink, surface,
accent, muted, border, danger etc.), tamanhos compactos e foco visível,
mas **não** sobrepõe globalmente fontes ou botões dos hosts.

LopFlow preserva sua identidade v2, LopManager pode sobrescrever tokens
para tema noturno, e LiviaCare mantém suas cores clínicas.
Use `[data-lop-theme="dark"]` apenas quando um host optar pelo tema.

Os estados loading, vazio, erro, proibição e sucesso são separados;
skeleton não apresenta números, nomes ou informações fictícias.
Acessibilidade: teclado, aria, aria-busy, foco e movimento reduzido.

Nenhum componente pode buscar tenant, chave BYOK ou JWT no navegador.
Validações fiscais, financeiras e clínicas são responsabilidade das APIs.
