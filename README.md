# GRAILS

> Dashboard premium pour resellers de sneakers & streetwear, avec IA Claude intégrée.

**Stack** — Next.js 14 (App Router) · TypeScript · Tailwind · Recharts · API Anthropic (Claude Haiku 4.5)

## Ce que ça fait

- **Portefeuille en temps réel** — valeur marché, total investi, profit réalisé, ROI
- **Graphique de profit cumulé** + répartition par catégorie
- **AI Lab** (propulsé par Claude) :
  - 🔥 **Roast ma collection** — Claude balance un roast cinglant de ton inventaire
  - 🎬 **Captions TikTok** — 3 captions pour ta dernière pièce (hype / story / engagement)
  - 💸 **Quoi flip ?** — Claude te dit quelle pièce vendre maintenant et laquelle hold
- **Inventaire CRUD** complet avec frais plateforme (Vinted, StockX…)
- **Flex card** — carte à screenshot pour ta story / TikTok

Toutes les données restent dans ton navigateur (localStorage). Aucun backend, aucune base de données.

## Déploiement Vercel (5 minutes)

### 1. Pousser sur GitHub

```bash
cd grails
git init
git add .
git commit -m "init grails"
gh repo create grails --public --source=. --push
# OU manuel :
# git remote add origin https://github.com/<TON_USER>/grails.git
# git branch -M main && git push -u origin main
```

### 2. Déployer sur Vercel

1. Va sur [vercel.com/new](https://vercel.com/new)
2. Importe le repo `grails`
3. Avant de cliquer **Deploy**, ouvre **Environment Variables** et ajoute :
   - `ANTHROPIC_API_KEY` = ta clé (récupérée sur [console.anthropic.com](https://console.anthropic.com/settings/keys))
4. Clique **Deploy**. C'est en ligne en ~90 secondes.

### 3. Tester en local (optionnel)

```bash
cp .env.example .env.local
# colle ta clé dans .env.local
npm install
npm run dev
# → http://localhost:3000
```

## Itérer avec Claude Code

Une fois le projet sur GitHub, branche Claude Code pour évoluer dessus :

```bash
# installer Claude Code
npm install -g @anthropic-ai/claude-code

# dans le dossier du projet
cd grails
claude
```

Exemples de prompts à tester :

> "Ajoute une vue 'Watchlist' où je peux suivre des pièces que je n'ai pas encore acheté, avec le prix retail et le prix marché actuel."

> "Ajoute un export CSV de mon inventaire."

> "Connecte la flex card à un bouton 'Télécharger en PNG' avec la lib html-to-image."

> "Ajoute une 4ème action AI Lab : 'Estime la valeur de cette pièce' (input nom + état)."

Claude Code modifie les fichiers, lance `npm run build` pour vérifier, et tu commit/push : Vercel redéploie automatiquement à chaque push.

## Personnaliser

- **Palette / nom** — `tailwind.config.ts` et `app/layout.tsx`
- **Données de démarrage** — `lib/seed.ts` (supprime/édite si tu veux partir d'un inventaire vide)
- **Prompts IA** — `app/api/ai/route.ts` (objet `SYSTEM`)
- **Modèle Claude** — par défaut `claude-haiku-4-5-20251001` (rapide et économique). Pour passer en Sonnet ou Opus, change la valeur de `model` dans `app/api/ai/route.ts`.

## Limites connues

- Données locales (localStorage) : pas synchronisé entre appareils. Pour ça, brancher Supabase ou Neon (parfait prompt pour Claude Code).
- Le « prix marché » est saisi à la main. Une V2 pourrait scraper StockX/Vinted via une API.

---

Build par GRAILS team · Powered by [Claude](https://claude.com) · Hébergé sur [Vercel](https://vercel.com)
