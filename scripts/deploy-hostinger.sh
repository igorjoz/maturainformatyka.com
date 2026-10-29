#!/usr/bin/env bash
set -euo pipefail

fail() {
  printf 'Deployment error: %s\n' "$1" >&2
  exit 1
}

for variable in HOSTINGER_HOST HOSTINGER_PORT HOSTINGER_USER HOSTINGER_PATH HOSTINGER_SSH_KEY HOSTINGER_KNOWN_HOSTS; do
  [[ -n "${!variable:-}" ]] || fail "Missing GitHub Actions secret: $variable"
done

[[ "$HOSTINGER_HOST" =~ ^[a-zA-Z0-9][a-zA-Z0-9.-]*$ ]] || fail 'Invalid HOSTINGER_HOST (use a hostname or IPv4 address, without a protocol).'
[[ "$HOSTINGER_USER" =~ ^[a-zA-Z0-9_][a-zA-Z0-9_.-]*$ ]] || fail 'Invalid HOSTINGER_USER.'
[[ "$HOSTINGER_PORT" =~ ^[0-9]{1,5}$ ]] || fail 'Invalid HOSTINGER_PORT.'
(( 10#$HOSTINGER_PORT >= 1 && 10#$HOSTINGER_PORT <= 65535 )) || fail 'HOSTINGER_PORT must be between 1 and 65535.'
[[ "$HOSTINGER_PATH" =~ ^/[a-zA-Z0-9_./-]+$ && "$HOSTINGER_PATH" != / && "$HOSTINGER_PATH" != *'//'* ]] || fail 'HOSTINGER_PATH must be an absolute website directory path.'
[[ "/${HOSTINGER_PATH#/}/" != *'/../'* && "/${HOSTINGER_PATH#/}/" != *'/./'* ]] || fail 'HOSTINGER_PATH must not contain . or .. path segments.'

DEPLOY_DRY_RUN="${DEPLOY_DRY_RUN:-false}"
[[ "$DEPLOY_DRY_RUN" == true || "$DEPLOY_DRY_RUN" == false ]] || fail 'DEPLOY_DRY_RUN must be true or false.'

[[ -s dist/index.html && -d dist/_astro ]] || fail 'Missing build output. Run npm run build first.'
for command in ssh ssh-keygen rsync; do
  command -v "$command" >/dev/null || fail "Required command is unavailable: $command"
done

umask 077
deploy_tmp="$(mktemp -d "${RUNNER_TEMP:-/tmp}/hostinger-deploy.XXXXXX")"
trap 'rm -rf -- "$deploy_tmp"' EXIT

# Normalize Windows line endings when secrets were copied from PowerShell.
printf '%s\n' "$HOSTINGER_SSH_KEY" | tr -d '\r' > "$deploy_tmp/key"
printf '%s\n' "$HOSTINGER_KNOWN_HOSTS" | tr -d '\r' > "$deploy_tmp/known_hosts"
unset HOSTINGER_SSH_KEY HOSTINGER_KNOWN_HOSTS

ssh-keygen -y -P '' -f "$deploy_tmp/key" >/dev/null 2>&1 || fail 'HOSTINGER_SSH_KEY must contain a complete, unencrypted private SSH key.'
if ! ssh-keygen -F "[$HOSTINGER_HOST]:$HOSTINGER_PORT" -f "$deploy_tmp/known_hosts" >/dev/null; then
  if [[ "$HOSTINGER_PORT" != 22 ]] || ! ssh-keygen -F "$HOSTINGER_HOST" -f "$deploy_tmp/known_hosts" >/dev/null; then
    fail 'HOSTINGER_KNOWN_HOSTS has no entry matching HOSTINGER_HOST and HOSTINGER_PORT. Paste the verified known_hosts entry, not a SHA256 fingerprint.'
  fi
fi

cat > "$deploy_tmp/ssh_config" <<EOF
Host hostinger-deploy
  HostName $HOSTINGER_HOST
  Port $HOSTINGER_PORT
  User $HOSTINGER_USER
  IdentityFile "$deploy_tmp/key"
  UserKnownHostsFile "$deploy_tmp/known_hosts"
  StrictHostKeyChecking yes
  BatchMode yes
  IdentitiesOnly yes
  ConnectTimeout 20
EOF

ssh -F "$deploy_tmp/ssh_config" hostinger-deploy \
  "test -d '$HOSTINGER_PATH' && test -w '$HOSTINGER_PATH'" \
  || fail 'SSH connection failed or HOSTINGER_PATH is not an existing writable directory.'

rsync_options=(
  -rtz --perms --chmod=D755,F644 --protect-args --delay-updates
  --rsh="ssh -F '$deploy_tmp/ssh_config'"
)
if [[ "$DEPLOY_DRY_RUN" == true ]]; then
  rsync_options+=(--dry-run --itemize-changes)
  printf '%s\n' 'Dry run: hosting files will not be changed.'
fi

# Keep existing files, including .htaccess and assets used by older page versions.
# Publish index.html only after all its new assets have been transferred.
destination="hostinger-deploy:${HOSTINGER_PATH%/}/"
rsync "${rsync_options[@]}" --exclude=/index.html dist/ "$destination"
rsync "${rsync_options[@]}" dist/index.html "$destination"

if [[ "$DEPLOY_DRY_RUN" == true ]]; then
  printf '%s\n' 'Dry run completed successfully.'
else
  printf '%s\n' 'Website deployed successfully.'
fi
