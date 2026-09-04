# ScrapeGraphAI — installation locale (100% Ollama, aucune API payante)

Kit d'installation locale de **ScrapeGraphAI 2.2.2** avec un LLM **Ollama** en local.
Aucune clé d'API, aucun service payant : le modèle tourne sur ta machine via
`http://localhost:11434`.

- **Modèle par défaut** : `llama3.2:3b` (adapté à une machine **~8 Go de RAM**, empreinte ~2–3 Go)
- **Test de démonstration** : extraction sur `https://example.com`

---

## Contenu du dossier

| Fichier | Rôle |
|---|---|
| `install.sh` | Script tout-en-un : vérifie/installe les outils (avec ton accord), clone le repo, `uv sync`, `playwright install`, télécharge le modèle, lance le test |
| `smart_scraper_example.py` | Exemple `SmartScraperGraph` configuré pour Ollama en local |
| `README.md` | Ce fichier |
| `official-repo/` | Repo officiel cloné (créé par `install.sh`, non versionné) |

---

## Installation en une commande

```bash
cd scrapegraphai-local
bash install.sh
```

Le script demande ton accord **avant** d'installer un outil système manquant
(uv, Ollama) et t'affiche la commande officielle utilisée. Pour changer de modèle :

```bash
OLLAMA_MODEL=qwen2.5:3b bash install.sh
```

---

## Étapes manuelles équivalentes

```bash
# 1. Outils requis (installe uniquement ce qui manque)
#    - Python 3.12+ : facultatif, uv le provisionne tout seul
#    - uv        : curl -LsSf https://astral.sh/uv/install.sh | sh
#    - Ollama    : curl -fsSL https://ollama.com/install.sh | sh   (Windows : https://ollama.com/download)

# 2. Cloner le repo officiel + dépendances
git clone --depth 1 https://github.com/ScrapeGraphAI/Scrapegraph-ai.git official-repo
cd official-repo
uv sync
uv run playwright install chromium

# 3. Lancer Ollama et télécharger le modèle
ollama serve &                 # si le service n'est pas déjà lancé
ollama pull llama3.2:3b

# 4. Test sur https://example.com
uv run python ../smart_scraper_example.py
```

---

## Configuration SmartScraperGraph (extrait)

Le LLM est 100% local — aucune clé d'API n'est lue ni requise :

```python
graph_config = {
    "llm": {
        "model": "ollama/llama3.2:3b",
        "temperature": 0,
        "base_url": "http://localhost:11434",
        "model_tokens": 8192,
    },
    "verbose": True,
    "headless": True,
}
```

Variables d'environnement supportées par `smart_scraper_example.py` :
`OLLAMA_MODEL`, `OLLAMA_BASE_URL`, `SCRAPE_URL`, `SCRAPE_PROMPT`.

---

## Choix du modèle selon la RAM

| RAM machine | Modèle conseillé | Commande |
|---|---|---|
| **8 Go** (défaut) | `llama3.2:3b` | `ollama pull llama3.2:3b` |
| 16 Go | `llama3.1:8b` | `ollama pull llama3.1:8b` |
| 32 Go+ | `qwen2.5:14b` | `ollama pull qwen2.5:14b` |

Puis : `OLLAMA_MODEL=<modèle> uv run python ../smart_scraper_example.py`

---

## Versions validées

| Composant | Version |
|---|---|
| ScrapeGraphAI | 2.2.2 (PyPI, `requires-python >=3.12,<4.0`) |
| Python (env uv) | 3.12.3 |
| uv | 0.8.17 |
| langchain-ollama | 1.0.1 |
| Playwright | Chromium (via `uv run playwright install`) |

---

## Dépannage

- **`ERR_CONNECTION_REFUSED` / `Connection refused` sur le port 11434** : Ollama n'est
  pas lancé → `ollama serve` dans un terminal séparé.
- **`model not found`** : télécharge le modèle → `ollama pull llama3.2:3b`.
- **Playwright : « Executable doesn't exist »** : (re)lance `uv run playwright install chromium`.
- **Lenteur du premier appel** : le modèle se charge en RAM au premier prompt, c'est normal.
