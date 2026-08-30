#!/usr/bin/env bash
# Bouwt mijn dev-omgeving op in WSL2 (Ubuntu): pakketten, git, ssh-sleutel, node.
# Idempotent: opnieuw draaien is veilig.
# Gebruik: bash scripts/setup-dev.sh

set -euo pipefail

GIT_NAME="${GIT_NAME:-Ruud}"
GIT_EMAIL="${GIT_EMAIL:-}"
NVM_VERSION="v0.40.1"

APT_PACKAGES=(
  git curl wget build-essential
  python3 python3-pip python3-venv
)

log()  { printf '\n\033[1;34m==>\033[0m %s\n' "$1"; }
skip() { printf '    \033[2m(overgeslagen: %s)\033[0m\n' "$1"; }

require_linux() {
  if [[ "$(uname -s)" != "Linux" ]]; then
    echo "Dit script is bedoeld voor Ubuntu in WSL2, niet voor $(uname -s)." >&2
    exit 1
  fi
}

update_apt() {
  log "Pakketlijst bijwerken en updates installeren"
  sudo apt-get update
  sudo apt-get upgrade -y
}

install_packages() {
  log "Basisgereedschap installeren"
  local missing=()
  for pkg in "${APT_PACKAGES[@]}"; do
    if dpkg -s "$pkg" >/dev/null 2>&1; then
      skip "$pkg staat er al"
    else
      missing+=("$pkg")
    fi
  done

  if (( ${#missing[@]} == 0 )); then
    echo "    Alles staat er al."
  else
    sudo apt-get install -y "${missing[@]}"
  fi
}

configure_git() {
  log "Git instellen"
  git config --global init.defaultBranch main
  git config --global pull.rebase false
  git config --global user.name "$GIT_NAME"

  if [[ -n "$GIT_EMAIL" ]]; then
    git config --global user.email "$GIT_EMAIL"
  elif git config --global user.email >/dev/null; then
    skip "e-mail al ingesteld op $(git config --global user.email)"
  else
    echo "    Nog geen e-mail ingesteld. Draai daarna:" >&2
    echo "      git config --global user.email \"jouw@email.nl\"" >&2
  fi
}

create_ssh_key() {
  log "SSH-sleutel voor GitHub"
  local key="$HOME/.ssh/id_ed25519"

  if [[ -f "$key" ]]; then
    skip "sleutel bestaat al"
  else
    local comment="${GIT_EMAIL:-$GIT_NAME}"
    ssh-keygen -t ed25519 -C "$comment" -f "$key" -N ""
    echo
    echo "    Zet deze publieke sleutel op github.com/settings/keys:"
    echo
    cat "$key.pub"
  fi
}

install_nvm_and_node() {
  log "Node.js via nvm"
  export NVM_DIR="$HOME/.nvm"

  if [[ -s "$NVM_DIR/nvm.sh" ]]; then
    skip "nvm staat er al"
  else
    curl -fsSL "https://raw.githubusercontent.com/nvm-sh/nvm/$NVM_VERSION/install.sh" | bash
  fi

  # shellcheck disable=SC1091
  source "$NVM_DIR/nvm.sh"

  # nvm ls toont ook aliassen zonder installatie, dus kijk naar de map zelf.
  if [[ -d "$NVM_DIR/versions/node" ]] && [[ -n "$(ls -A "$NVM_DIR/versions/node")" ]]; then
    skip "Node staat er al ($(node --version 2>/dev/null || echo onbekend))"
  else
    nvm install --lts
  fi
}

create_project_dir() {
  log "Projectmap aanmaken"
  mkdir -p "$HOME/projecten"
  echo "    $HOME/projecten"
}

main() {
  require_linux
  update_apt
  install_packages
  configure_git
  create_ssh_key
  install_nvm_and_node
  create_project_dir

  log "Klaar"
  cat <<'MSG'
    Wat je nog met de hand doet:
      1. De publieke SSH-sleutel op GitHub zetten, daarna: ssh -T git@github.com
      2. VS Code op Windows installeren + de WSL-extensie
      3. Nieuwe terminal openen zodat nvm geladen wordt
MSG
}

main "$@"
