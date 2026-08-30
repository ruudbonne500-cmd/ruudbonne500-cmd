# Mijn dev-omgeving opbouwen

Dit is de checklist waarmee ik mijn werkplek van nul terugbouw: Windows met WSL2,
Ubuntu, VS Code, Git, Python en Node.

De hardware waar dit op draait: Intel i7-7700, 32 GB RAM, SSD (systeem) + HDD (opslag).

---

## 1. WSL2 en Ubuntu

In **PowerShell als administrator** op Windows:

```powershell
wsl --install -d Ubuntu
```

Dit zet WSL2 aan, installeert Ubuntu en vraagt om een herstart. Na de herstart start
Ubuntu vanzelf en vraagt om een gebruikersnaam en wachtwoord. Dat wachtwoord is je
`sudo`-wachtwoord in Linux — het staat los van je Windows-account.

Controleren dat het versie 2 is (versie 1 is trager en mist een echte Linux-kernel):

```powershell
wsl --list --verbose
```

Staat er `VERSION 1`? Dan omzetten:

```powershell
wsl --set-version Ubuntu 2
wsl --set-default-version 2
```

## 2. Ubuntu bijwerken

Vanaf hier alles in de **Ubuntu-terminal**.

```bash
sudo apt update && sudo apt upgrade -y
```

- `apt update` haalt de lijst met beschikbare pakketten op.
- `apt upgrade` installeert de nieuwere versies daarvan.

## 3. Basisgereedschap

```bash
sudo apt install -y git curl wget build-essential python3 python3-pip python3-venv
```

`build-essential` levert de compiler die sommige Python- en Node-pakketten nodig
hebben om zichzelf te installeren.

## 4. Git instellen

```bash
git config --global user.name "Ruud"
git config --global user.email "jouw@email.nl"
git config --global init.defaultBranch main
git config --global pull.rebase false
```

Gebruik hetzelfde e-mailadres als op GitHub, anders koppelt GitHub je commits niet
aan je account.

## 5. SSH-sleutel voor GitHub

Met een SSH-sleutel hoef je niet elke push je wachtwoord of token in te typen.

```bash
ssh-keygen -t ed25519 -C "jouw@email.nl"   # 3x Enter is prima
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
cat ~/.ssh/id_ed25519.pub
```

Kopieer de uitvoer van die laatste regel (begint met `ssh-ed25519`) en plak hem op
GitHub onder **Settings → SSH and GPG keys → New SSH key**. Testen:

```bash
ssh -T git@github.com
```

"Hi <naam>! You've successfully authenticated" betekent dat het werkt.

## 6. Node.js via nvm

Installeer Node **niet** met `apt` — die versie is meestal oud. `nvm` laat je
wisselen tussen versies per project.

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
nvm install --lts
node --version
```

## 7. VS Code

Installeer VS Code op **Windows** (niet in Ubuntu) en voeg de extensie
**WSL** (`ms-vscode-remote.remote-wsl`) toe. Daarna open je een project vanuit
de Ubuntu-terminal met:

```bash
code .
```

VS Code draait dan op Windows, maar alle bestanden en terminals zitten in Linux.

Handige extensies: Python, Pylance, ESLint, GitLens.

## 8. Waar zet ik mijn projecten neer

In het Linux-bestandssysteem, dus onder `~/`:

```bash
mkdir -p ~/projecten
```

Zet ze **niet** onder `/mnt/c/...`. Dat werkt wel, maar is een stuk trager omdat
elke bestandsoperatie de grens tussen Windows en Linux over moet.

## 9. Python per project

Geef elk project zijn eigen virtuele omgeving, zodat pakketten van verschillende
projecten elkaar niet in de weg zitten:

```bash
cd ~/projecten/mijn-project
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

`deactivate` zet hem weer uit. Zet `.venv/` altijd in je `.gitignore`.

---

## Sneller: het bootstrap-script

De stappen 2 t/m 6 staan ook in [`scripts/setup-dev.sh`](../scripts/setup-dev.sh).
Dat script is idempotent — je kunt het opnieuw draaien zonder iets stuk te maken:

```bash
bash scripts/setup-dev.sh
```

Stap 1 (WSL2), stap 5 (de sleutel op GitHub plakken) en stap 7 (VS Code) blijven
handwerk.
