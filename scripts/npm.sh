#!/usr/bin/env bash
set -euo pipefail

project_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$project_root"

# Prefer the project-local Linux runtime when WSL resolves npm to Windows.
if [[ -x "$project_root/.tools/node/bin/node" ]]; then
  export PATH="$project_root/.tools/node/bin:$PATH"
fi

if ! command -v node >/dev/null 2>&1 || ! node -e '
  const [major, minor] = process.versions.node.split(".").map(Number);
  process.exit(process.platform === "linux" && (major > 22 || (major === 22 && minor >= 12)) ? 0 : 1);
'; then
  printf '%s\n' 'Potrzebny jest Linuxowy Node.js >= 22.12 w WSL.' 'Zainstaluj Node.js w Ubuntu (np. przez nvm), zamiast korzystać z npm z Windows.' 'Instrukcje: README.md' >&2
  exit 1
fi

export ASTRO_TELEMETRY_DISABLED=1
exec node "$(dirname -- "$(command -v node)")/../lib/node_modules/npm/bin/npm-cli.js" "$@"
