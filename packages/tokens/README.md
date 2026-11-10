# @rfdetoni/lopui-tokens

Standalone CSS custom properties. No React, Angular, JavaScript or fonts.

```css
@import '@rfdetoni/lopui-tokens/tokens.css';
```

The host can override each `--lp-*` token. The optional attribute
`data-lop-theme="dark"` activates a dark palette inside that subtree.
Angular Elements inherit CSS custom properties from their host, including
when the element uses Shadow DOM. Components also define fallback values.

Do not import these tokens expecting them to style buttons globally: 
the library only provides semantic variables.
