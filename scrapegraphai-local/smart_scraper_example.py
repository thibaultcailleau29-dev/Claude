#!/usr/bin/env python3
"""Exemple SmartScraperGraph — 100% local via Ollama, aucune API ni service payant.

Test par défaut : extraction du contenu de https://example.com avec un modèle
Ollama tournant en local (par défaut llama3.2:3b, adapté à une machine 8 Go de RAM).

Réglages via variables d'environnement (valeurs par défaut entre parenthèses) :
  OLLAMA_MODEL       modèle Ollama            (llama3.2:3b)
  OLLAMA_BASE_URL    URL du serveur Ollama    (http://localhost:11434)
  SCRAPE_URL         page à analyser          (https://example.com)
  SCRAPE_PROMPT      instruction d'extraction (voir ci-dessous)

Prérequis : Ollama installé et lancé (`ollama serve`) + modèle téléchargé
(`ollama pull llama3.2:3b`). Aucune clé d'API n'est requise ni utilisée.
"""

import json
import os

from scrapegraphai.graphs import SmartScraperGraph

MODEL = os.environ.get("OLLAMA_MODEL", "llama3.2:3b")
BASE_URL = os.environ.get("OLLAMA_BASE_URL", "http://localhost:11434")
URL = os.environ.get("SCRAPE_URL", "https://example.com")
PROMPT = os.environ.get(
    "SCRAPE_PROMPT",
    "Extrais le titre principal de la page et un résumé de son contenu.",
)

# Configuration du graphe : LLM local Ollama uniquement.
graph_config = {
    "llm": {
        "model": f"ollama/{MODEL}",
        "temperature": 0,
        "base_url": BASE_URL,
        "model_tokens": 8192,
    },
    "verbose": True,
    "headless": True,
}


def main() -> int:
    print(f"Modèle       : ollama/{MODEL}")
    print(f"Serveur      : {BASE_URL}")
    print(f"URL cible    : {URL}")
    print(f"Instruction  : {PROMPT}\n")

    smart_scraper_graph = SmartScraperGraph(
        prompt=PROMPT,
        source=URL,
        config=graph_config,
    )

    result = smart_scraper_graph.run()
    print("\n===== RÉSULTAT =====")
    print(json.dumps(result, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
