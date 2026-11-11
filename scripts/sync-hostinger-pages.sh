#!/usr/bin/env bash
set -euo pipefail

# Additional rsync arguments include the transport and --dry-run, when requested.
source_directory="${1%/}"
destination="${2%/}"
shift 2

[[ -s "$source_directory/index.html" ]] || {
  printf '%s\n' 'Missing build homepage; refusing to publish or prune pages.' >&2
  exit 1
}

empty_directory="$(mktemp -d "${TMPDIR:-/tmp}/hostinger-empty-pages.XXXXXX")"
trap 'rmdir -- "$empty_directory"' EXIT

# Publish every HTML document before pruning withdrawn routes.
rsync "$@" --include='*/' --include='*.html' --exclude='*' \
  "$source_directory/" "$destination/"

# Only these namespaces belong to the application. Astro emits their routes as
# index.html. Excluded files are protected from deletion by rsync, so .htaccess,
# downloads, older hashed assets and other hosting content remain untouched.
# Keep this list aligned with src/pages when adding a new top-level namespace.
for namespace in arkusze zadania wiedza matura-2027; do
  page_source="$source_directory/$namespace"
  if [[ ! -d "$page_source" ]]; then
    page_source="$empty_directory"
  fi
  rsync "$@" --delete-delay --include='*/' --include='index.html' --exclude='*' \
    "$page_source/" "$destination/$namespace/"
done
