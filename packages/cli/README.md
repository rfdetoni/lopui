# Lop UI CLI

```bash
node packages/cli/bin/lopui.mjs manifest --json
node packages/cli/bin/lopui.mjs list --json
node packages/cli/bin/lopui.mjs component DataTable --json
node packages/cli/bin/lopui.mjs template list --json
```

`apiVersion:1` is stable. Missing commands and components return
a nonzero exit code and a JSON error object when `--json` is present.
No network access or access to the host application is required.
