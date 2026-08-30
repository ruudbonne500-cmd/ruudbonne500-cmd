# CLAUDE.md

Instructies voor Claude Code in deze repo.

## Wat dit is

De profiel-repo van Ruud (`ruudbonne500-cmd/ruudbonne500-cmd`). De README hiervan
staat op zijn GitHub-profielpagina. Daarnaast legt deze repo zijn dev-omgeving vast,
zodat die opnieuw op te bouwen is.

## Taal

- README, docs en commit messages: **Nederlands**.
- Code, bestandsnamen, variabelen en shell-scripts: **Engels**.
- Antwoorden in de chat: Nederlands.

## Context over de eigenaar

Ruud is aan het leren bouwen. Ga niet uit van voorkennis: leg keuzes kort uit en
zet bij shell-commando's erbij wat ze doen. Voorkeur voor kleine, begrijpelijke
stappen boven slimme one-liners.

- Werkplek: Windows + WSL2 (Ubuntu), VS Code
- Talen: Python, JavaScript
- Interesse: automatisering en Google Ads(-scripts)

## Structuur

| Pad | Wat |
| --- | --- |
| `README.md` | Profieltekst, zichtbaar op GitHub |
| `docs/` | Documentatie, o.a. het opbouwen van de dev-omgeving |
| `scripts/` | Uitvoerbare scripts (bash, python) |

## Conventies

- Shell-scripts: `bash`, beginnen met `#!/usr/bin/env bash` en `set -euo pipefail`.
- Scripts moeten **idempotent** zijn: twee keer draaien mag niets stukmaken.
- Python: standaardbibliotheek waar het kan; anders een `requirements.txt` erbij.
- Regels afbreken rond 100 tekens, geen trailing whitespace, bestand eindigt met newline.
- Geen geheimen in de repo (API-keys, tokens, klantdata). Gebruik `.env` en `.gitignore`.

## Werkwijze

- Controleer een shell-script met `bash -n <bestand>` voordat je het aflevert.
- Update `docs/` mee als een verandering de setup raakt.
- Houd de README kort: details horen in `docs/`.
