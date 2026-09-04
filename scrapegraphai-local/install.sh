#!/usr/bin/env bash
#
# Installation locale de ScrapeGraphAI + Ollama (100% local, aucune API payante).
# Cible : machine ~8 Go de RAM  ->  modèle Ollama par défaut : llama3.2:3b
#
# Étapes : vérifie Python 3.12+/uv/Ollama, installe ce qui manque (avec ton accord),
# clone le repo officiel, uv sync, playwright install, télécharge le modèle,
# puis lance le test sur https://example.com.
#
# Usage :   bash install.sh
#           OLLAMA_MODEL=qwen2.5:3b bash install.sh   # pour changer de modèle
set -euo pipefail

REPO_URL="https://github.com/ScrapeGraphAI/Scrapegraph-ai.git"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$HERE/official-repo"
OLLAMA_MODEL="${OLLAMA_MODEL:-llama3.2:3b}"

info()  { printf '\033[1;34m[i]\033[0m %s\n' "$*"; }
ok()    { printf '\033[1;32m[✓]\033[0m %s\n' "$*"; }
warn()  { printf '\033[1;33m[!]\033[0m %s\n' "$*"; }
err()   { printf '\033[1;31m[x]\033[0m %s\n' "$*" >&2; }

# Demande une confirmation avant toute installation d'outil système.
confirm() {
  local prompt="$1"
  read -r -p "$(printf '\033[1;33m[?]\033[0m %s [o/N] ' "$prompt")" ans
  [[ "$ans" =~ ^([oO]|[yY])$ ]]
}

# ---------------------------------------------------------------------------
# 1. Python 3.12+
# ---------------------------------------------------------------------------
info "Vérification de Python 3.12+ ..."
if command -v python3 >/dev/null 2>&1 && \
   python3 -c 'import sys; sys.exit(0 if sys.version_info[:2] >= (3,12) else 1)' 2>/dev/null; then
  ok "Python $(python3 -c 'import platform; print(platform.python_version())') détecté."
else
  warn "Python 3.12+ absent du système."
  warn "Ce n'est PAS bloquant : uv télécharge automatiquement Python 3.12 pour ce projet."
  info "Pour installer Python 3.12 toi-même (facultatif) :"
  echo "    macOS    : brew install python@3.12"
  echo "    Ubuntu   : sudo add-apt-repository ppa:deadsnakes/ppa && sudo apt update && sudo apt install python3.12"
  echo "    ou via uv: uv python install 3.12"
fi

# ---------------------------------------------------------------------------
# 2. uv
# ---------------------------------------------------------------------------
info "Vérification de uv ..."
if command -v uv >/dev/null 2>&1; then
  ok "uv $(uv --version | awk '{print $2}') détecté."
else
  warn "uv est absent."
  info "Commande d'installation officielle :"
  echo "    curl -LsSf https://astral.sh/uv/install.sh | sh"
  if confirm "Installer uv maintenant avec cette commande officielle ?"; then
    curl -LsSf https://astral.sh/uv/install.sh | sh
    export PATH="$HOME/.local/bin:$PATH"
    ok "uv installé."
  else
    err "uv est requis. Arrêt."; exit 1
  fi
fi

# ---------------------------------------------------------------------------
# 3. Ollama
# ---------------------------------------------------------------------------
info "Vérification d'Ollama ..."
if command -v ollama >/dev/null 2>&1; then
  ok "Ollama $(ollama --version 2>/dev/null | head -1) détecté."
else
  warn "Ollama est absent."
  info "Commande d'installation officielle (Linux/macOS) :"
  echo "    curl -fsSL https://ollama.com/install.sh | sh"
  echo "    (Windows : télécharge l'installeur sur https://ollama.com/download)"
  if confirm "Installer Ollama maintenant avec cette commande officielle ?"; then
    curl -fsSL https://ollama.com/install.sh | sh
    ok "Ollama installé."
  else
    err "Ollama est requis pour le mode local. Arrêt."; exit 1
  fi
fi

# S'assurer que le serveur Ollama tourne.
if ! curl -sf http://localhost:11434/api/version >/dev/null 2>&1; then
  info "Démarrage du serveur Ollama en arrière-plan (ollama serve) ..."
  (ollama serve >/tmp/ollama-serve.log 2>&1 &) || true
  for _ in $(seq 1 30); do
    curl -sf http://localhost:11434/api/version >/dev/null 2>&1 && break
    sleep 1
  done
fi
curl -sf http://localhost:11434/api/version >/dev/null 2>&1 \
  && ok "Serveur Ollama joignable sur http://localhost:11434" \
  || warn "Serveur Ollama non joignable — lance 'ollama serve' dans un autre terminal."

# ---------------------------------------------------------------------------
# 4. Clone du repo officiel
# ---------------------------------------------------------------------------
if [ -d "$REPO_DIR/.git" ]; then
  ok "Repo déjà présent : $REPO_DIR"
else
  info "Clone du repo officiel ScrapeGraphAI ..."
  git clone --depth 1 "$REPO_URL" "$REPO_DIR"
  ok "Cloné dans $REPO_DIR"
fi

# ---------------------------------------------------------------------------
# 5. uv sync + Playwright
# ---------------------------------------------------------------------------
info "Installation des dépendances (uv sync) ..."
( cd "$REPO_DIR" && uv sync )
ok "Dépendances installées."

info "Installation du navigateur Playwright (Chromium) ..."
( cd "$REPO_DIR" && uv run playwright install chromium )
ok "Playwright prêt."

# ---------------------------------------------------------------------------
# 6. Téléchargement du modèle Ollama
# ---------------------------------------------------------------------------
info "Téléchargement du modèle Ollama : $OLLAMA_MODEL ..."
ollama pull "$OLLAMA_MODEL"
ok "Modèle $OLLAMA_MODEL prêt."

# ---------------------------------------------------------------------------
# 7. Test sur https://example.com
# ---------------------------------------------------------------------------
info "Lancement du test sur https://example.com ..."
( cd "$REPO_DIR" && OLLAMA_MODEL="$OLLAMA_MODEL" uv run python "$HERE/smart_scraper_example.py" )

ok "Terminé."
echo
echo "Chemin d'installation : $HERE"
echo "Repo officiel         : $REPO_DIR"
echo "Modèle Ollama         : $OLLAMA_MODEL (local, http://localhost:11434)"
echo
echo "Pour relancer le test :"
echo "    cd \"$REPO_DIR\" && uv run python \"$HERE/smart_scraper_example.py\""
