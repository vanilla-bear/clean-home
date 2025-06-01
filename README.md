
# 🧼 Ménage – Application de gestion des tâches ménagères

Ce projet est une application Next.js générée avec [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

---

## 🚀 Démarrer le projet

Lancez le serveur de développement avec :

```bash
npm run dev
# ou
yarn dev
# ou
pnpm dev
# ou
bun dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour voir le résultat.

Vous pouvez commencer à modifier la page en éditant `app/page.tsx`. Le rechargement est automatique.

Ce projet utilise [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) pour optimiser et charger automatiquement [Geist](https://vercel.com/font), une police créée par Vercel.

---

## 📚 En savoir plus

Pour aller plus loin avec Next.js :

- [Documentation Next.js (FR)](https://nextjs.org/docs) – toutes les fonctionnalités et l'API.
- [Apprendre Next.js](https://nextjs.org/learn) – tutoriel interactif.
- [Dépôt GitHub Next.js](https://github.com/vercel/next.js) – contributions bienvenues !

---

## 🚀 Déploiement avec Vercel

La méthode la plus simple pour déployer votre application Next.js est d’utiliser [Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme), la plateforme des créateurs de Next.js.

Consultez la [documentation de déploiement](https://nextjs.org/docs/app/building-your-application/deploying) pour plus d’infos.

---

## ⚙️ Stack technique

| Frontend | Backend | Base de données | Authentification | Outils |
|----------|---------|-----------------|------------------|--------|
| Next.js 14+, TypeScript, Tailwind CSS, Turbopack | API Routes Next.js | Supabase (PostgreSQL) avec Prisma | NextAuth.js (Auth.js) + Google OAuth | React Hook Form, Zod, FullCalendar, date-fns |

---

## 🧑‍💻 Prérequis

- Node.js 18+
- Un compte Supabase (base PostgreSQL)
- Un projet Google Cloud avec identifiants OAuth 2.0

---

## 🏗️ Installation rapide

1. **Création du projet**

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

---

## 🗂️ Structure du projet (extrait)

```
src/
├── app/
│   ├── (auth)/login/
│   ├── (dashboard)/page.tsx
│   └── api/tasks/[taskId]/complete/
├── components/
│   ├── calendar/TaskCalendar.tsx
│   ├── tasks/TaskForm.tsx
├── lib/
│   ├── auth/
│   └── db/prisma.ts
├── utils/recurrence.ts
```