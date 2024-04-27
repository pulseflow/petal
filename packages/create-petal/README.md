# create-petal

## scaffolding for petal projects

**with npm:**

```bash
npm create petal@latest
```

**with yarn:**

```bash
yarn create petal
```

**\*with pnpm:**

```bash
pnpm create petal
```

**with bun:**

```bash
bun create petal
```

`create-petal` automatically runs in _interactive_ mode, but you can also specify your project name and template with command line arguments.

```bash
# npm
npm create petal@latest my-petal-project -- --template minimal

# yarn
yarn create petal my-petal-project --template minimal

# pnpm
pnpm create petal my-petal-project --template minimal

# bun
bun create petal my-petal-project --template minimal
```

[check out the full list][examples] of example templates, available on GitHub

you may also use any GitHub repository as a template:

```bash
npm create petal@latest my-petal-project -- --template pauliesnug/rust-turbo
```

### cli flags

may be provided in place of prompts
| name | description |
| :--------------------------- | :----------------------------------------------------- |
| `--help` (`-h`) | display available flags. |
| `--template <name>` | specify your template. |
| `--install` / `--no-install` | install dependencies (or not). |
| `--git` / `--no-git` | initialize git repo (or not). |
| `--yes` (`-y`) | skip all prompts by accepting defaults. |
| `--no` (`-n`) | skip all prompts by declining defaults. |
| `--dry-run` | walk through steps without executing. |
| `--skip-flower` | skip flower animations animation. |
| `--ref` | specify a Petal branch (default: latest). |
| `--fancy` | enable full Unicode support for Windows. |
| `--typescript <option>` | typescript option: `strict` / `strictest` / `relaxed`. |

[examples]: https://github.com/pulseflow/petal/tree/main/examples
