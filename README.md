# 📱 Rise - AI Daily Discipline Coach

[![React Native](https://img.shields.io/badge/React_Native-0.74+-61DAFB?style=for-the-badge&logo=react)](https://reactnative.dev)
[![Expo](https://img.shields.io/badge/Expo-51+-000000?style=for-the-badge&logo=expo)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

---

## 🌍 Languages
**Français** | [English](README_EN.md) | [Türkçe](README_TR.md)

---

## 📋 Table des Matières
- [🚀 À Propos du Projet](#-à-propos-du-projet)
- [🎯 Fonctionnalités](#-fonctionnalités)
- [🧠 Concept Central](#-concept-central)
- [⚙️ Stack Technique](#%EF%B8%8F-stack-technique)
- [🏗️ Architecture du Projet](#%EF%B8%8F-architecture-du-projet)
- [📱 Aperçu des Écrans](#-aperçu-des-écrans)
- [🔔 Système de Notifications & Actions Interactives (V8)](#-système-de-notifications--actions-interactives-v8)
- [⏰ Système Smart Wake-Up](#-système-smart-wake-up)
- [📊 Score de Discipline](#-score-de-discipline)
- [🔥 Système de Streak](#-système-de-streak)
- [🧩 Assistant & Système de Widgets (V9)](#-assistant--système-de-widgets-v9)
- [🧪 Diagnostics de Test](#-diagnostics-de-test)
- [🤖 Coach Personnel IA (Optionnel)](#-coach-personnel-ia-optionnel)
- [📦 Installation & Compilation native](#-installation--compilation-native)
- [⚙️ Configuration](#%EF%B8%8F-configuration)
- [📁 Structure des Fichiers](#-structure-des-fichiers)
- [🚧 Améliorations Futures](#-améliorations-futures)
- [📜 Licence](#-licence)

---

## 🚀 À Propos du Projet
**Rise** est une application mobile mobile-first ultra-minimaliste de discipline personnelle conçue sous React Native (Expo) et TypeScript. Loin des to-do lists complexes et surchargées, Rise agit comme un système de vérité quotidien : tu définis tes cibles réelles (heures, durées), tu déclares ta réalité, et l'application calcule instantanément ton score de discipline scientifique tout en te guidant via des rappels intelligents, des widgets d'état et un coach IA personnalisé.

## 🎯 Fonctionnalités
- **Daily Goals System** : Configuration simple et rapide de tes cibles quotidiennes.
- **Smart Wake-Up System** : Alarmes comportementales simulées en 3 étapes consécutives avec bouton d'extinction rapide.
- **Check-in Quotidien** : Déclaration chiffrée de ta réalité en moins de 60 secondes.
- **Score de Discipline** : Calcul mathématique unifié de ta réussite (0 à 100).
- **Streak System** : Compteur de régularité 🔥 avec règles de *Loss Aversion* (perte du streak en cas de relâchement).
- **Active Coach & Lock Screen Actions (V8)** : Réponds "Oui" ou "Non" directement depuis ton écran verrouillé sans ouvrir l'app !
- **Widget Assistant Dashboard (V9)** : Widget simulé dans tes réglages et guide d'installation visuel adapté à ton OS (iOS/Android).
- **Diagnostics de Test** : Terminal embarqué (`NotificationTestScreen.tsx`) pour tester les vibrations et permissions.
- **Coach Personnel IA** : Conseils exclusifs rédigés en direct par Google Gemini.

## 🧠 Concept Central
Rise repose sur le principe de la **Discipline Quantifiable**. L'utilisateur n'évalue pas sa journée par un simple ressenti subjectif. Il compare des variables cibles à sa réalité :
> *« Tu définis une cible quotidienne, tu déclares la réalité, et Rise te montre si tu as réussi ou échoué. C'est un système de vérité. »*

## ⚙️ Stack Technique
- **Core Framework** : React Native (Expo SDK 51)
- **Langage** : TypeScript
- **Stockage Local** : AsyncStorage (local-first)
- **Synchronisation Cloud** : Supabase Client (Optionnel)
- **Notifications** : Expo Notifications (avec boutons d'actions natifs)
- **Composants Graphiques** : Lucide React Native (icons)
- **Moteur d'IA** : Modèle d'intégration Google Gemini API (Optionnel)

## 🏗️ Architecture du Projet
Rise s'appuie sur une séparation stricte des responsabilités (SOC) :
- **`/src/core/`** : Contient les règles métiers autonomes (calcul de score, logique temporelle de réveil, évaluation du streak).
- **`/src/notifications/`** : Moteur de planification intelligent adaptatif.
- **`/src/widgets/`** : Serialiseur JSON pour widgets d'écrans natifs.
- **`/src/hooks/`** : Hooks réactifs connectant l'état local aux écrans.
- **`/src/screens/`** : Écrans minimalistes dark mode.

## 📱 Aperçu des Écrans
- **Accueil (`HomeScreen.tsx`)** : Cadran horaire épuré, niveau de pression IA actif, streak 🔥 et widget matinal d'extinction d'alarme.
- **Objectifs Cibles (`DailyGoalsScreen.tsx`)** : Formulaire d'ajustement de tes cibles (réveil, coucher, écran, sport, lecture).
- **Bilan Réel (`InputTrackingScreen.tsx`)** : Déclaration chiffrée quotidienne rapide.
- **Résultats Comparatifs (`ResultScreen.tsx`)** : Tableau détaillé cible vs réel avec badges colorés et conseils du coach.
- **Historique (`HistoryScreen.tsx`)** : Frise chronologique de tes performances passées.
- **Réglages (`SettingsScreen.tsx`)** : Paramètres utilisateurs, gestion de clé API IA, widget assistant virtuel et passerelle vers les tests.
- **Diagnostics de Test (`NotificationTestScreen.tsx`)** : Terminal de test matériel haptique.

## 🔔 Système de Notifications & Actions Interactives (V8)
Le **Pressure System** adapte automatiquement la fréquence des notifications selon ton état de discipline :
- 🟢 **GOOD STATE** (Score $\ge$ 70) : Motivation douce, le coach reste discret.
- 🟠 **MEDIUM STATE** (Score 40-70) : Rappels réguliers et équilibrés de recentrage.
- 🔴 **BAD STATE** (Score < 40 ou inactivité > 24h) : **Pression Active**. Jusqu'à 6 rappels quotidiens ciblés et percutants pour te pousser à réagir !

### ☀️ Boutons sur Écran Verrouillé (V8)
Rise intègre les catégories d'actions système natives sur l'écran verrouillé :
* **Réveil matinal (`wake-up-actions`)** :
  - `☀️ JE SUIS DEBOUT` (ID : `'awake-yes'`) -> Intercepte la réponse et éteint automatiquement l'alarme en tâche de fond !
  - `🛌 ENCORE 5 MIN` (ID : `'awake-no'`)
* **Check-in de discipline (`discipline-check-actions`)** :
  - `✅ OUI, RÉUSSI` (ID : `'check-yes'`)
  - `❌ NON, ÉCHOUÉ` (ID : `'check-no'`)

## ⏰ Système Smart Wake-Up
Dès que ton heure cible de réveil est configurée (ex: 06:30), Rise programme 3 alertes :
1. **06:30 (Alerte 1)** : *"Il est 06:30 — Réveille-toi maintenant 🌅"*
2. **06:35 (Alerte 2)** : *"Tu devais être debout depuis 5 minutes... ⚠️"*
3. **06:40 (Alerte 3)** : *"Commence ta journée maintenant ! 🚨"*
Le bouton **"JE SUIS DEBOUT ☀️"** sur l'écran d'accueil ou sur la notification interactive arrête instantanément le reste de la séquence.

## 📊 Score de Discipline
$$SCORE\_DU\_JOUR = \left( \frac{\text{points réussis}}{\text{total objectifs}} \right) \times 100$$
Chaque objectif validé (ex: sport effectué $\ge$ cible, ou coucher $\le$ cible) rapporte 1 point.
- **0 à 40** : Mauvais jour (Rouge `#EF4444`)
- **40 à 70** : Jour moyen (Orange `#F59E0B`)
- **70 à 100** : Excellent jour (Vert `#22C55E`)

## 🔥 Système de Streak
- **Score $\ge$ 70** : Ton streak de discipline augmente de **+1**.
- **Score < 40** : Ton streak retombe immédiatement à **0** (Loss Aversion).
- **Entre 40 et 70** : Maintien du streak sans évolution.

## 🧩 Assistant & Système de Widgets (V9)
Grâce à **`widgetDataBuilder.ts`**, l'application écrit à chaque soumission un conteneur JSON léger contenant ton score, streak et code couleur dans un répertoire persistant partagé. Ce pont de données local est prêt à être lu en arrière-plan par **WidgetKit** (iOS) et **AppWidget** (Android).

### 🍏 Assistant d'Écran d'Accueil (V9)
Dans ton écran **Paramètres**, une section dédiée d'installation de widget propose :
* Un **Mockup Simulatif** de ton widget avec ton score et streak actif en temps réel.
* Un **Modal d'installation intelligent** qui détecte ton OS et t'affiche un tutoriel visuel étape par étape adapté à ton iPhone ou ton appareil Android.

## 🧪 Diagnostics de Test
L'écran **`NotificationTestScreen.tsx`** offre un terminal de contrôle matériel :
- **Test Simple** : Reçoit une alerte simple après 1s.
- **Test Wake-Up Alarm** : Simule une alarme sonore et vibratoire après 5s.
- **Test Reminder Flow** : Envoie une séquence rythmée de 3 alertes (1s, 4s, 7s).
- **Test Critical Alert** : Déclenche une vibration d'urgence haptique après 1s.
- **Test Interactive Actions (Oui/Non)** : Envoie une notification interactive avec boutons de lock screen sous 3s.

## 🤖 Coach Personnel IA (Optionnel)
En ajoutant ta clé API Google Gemini dans les réglages, le coach IA :
- Analyse tes métriques réelles pour générer un bilan de 2 phrases percutantes.
- Réécrit à la volée tes notifications quotidiennes pour les adapter à ton niveau de discipline actuel.

---

## 📦 Installation & Compilation native

### 1. Utilisation via Expo Go (100% Gratuite & Instantanée)
Pour lancer l'application en 10 secondes sur ton iPhone ou Android avec Expo Go :
```bash
# Installer les dépendances
npm install

# Démarrer le serveur Expo Go
npx expo start --go
```
*Scanne simplement le QR Code s'affichant dans le terminal avec l'appareil photo de ton téléphone pour ouvrir l'application.*

### 2. Compilation Standalone Native (Dossiers natifs)
Pour compiler l'application en mode natif autonome et activer les widgets d'écrans d'accueils physiques :
```bash
# Générer les dossiers natifs iOS et Android
npx expo prebuild

# Lancer sur ton téléphone Android connecté ou ton émulateur
npx expo run:android
```
*Pour iOS, la compilation locale requiert un ordinateur macOS. Pour compiler dans le cloud depuis ton PC Windows, utilise le service d'EAS Build (`eas build --platform ios`).*

## ⚙️ Configuration
Créez un fichier `.env.local` à la racine :
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📁 Structure des Fichiers
```text
Rise/
├── App.tsx                    # Orchestrateur principal & Navigation
├── src/
│   ├── core/                  # Moteurs mathématiques autonomes
│   │   ├── goalEngine.ts
│   │   ├── comparisonEngine.ts
│   │   ├── scoringEngine.ts
│   │   ├── streakEngine.ts
│   │   ├── wakeUpEngine.ts
│   │   └── notificationEngine.ts
│   ├── notifications/         # Planificateurs et templates d'alertes
│   │   ├── permissionManager.ts
│   │   ├── notificationTemplates.ts
│   │   ├── pressureSystem.ts
│   │   ├── smartNotificationEngine.ts
│   │   └── notificationScheduler.ts
│   ├── widgets/               # Ponts de données widgets natifs
│   │   └── widgetDataBuilder.ts
│   ├── hooks/                 # Hooks de connexion réactifs
│   │   ├── useDailyGoals.ts
│   │   ├── useTracking.ts
│   │   └── useWakeUpGoal.ts
│   ├── screens/               # Écrans graphiques
│   │   ├── HomeScreen.tsx
│   │   ├── DailyGoalsScreen.tsx
│   │   ├── InputTrackingScreen.tsx
│   │   ├── ResultScreen.tsx
│   │   ├── HistoryScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   └── NotificationTestScreen.tsx
│   └── services/              # Services systèmes et stockages
│       ├── storageService.ts
│       ├── notificationService.ts
│       └── aiService.ts
```

## 🚧 Améliorations Futures
- **Widgets d'Actions Rapides** : Implémentation de boutons interactifs natifs ("Je suis réveillé") directement sur l'écran d'accueil iOS/Android via des extensions natives Swift / Kotlin.
- **Synchronisation Cloud** : Persistance distante automatique de l'historique sur tables Supabase.

## 📜 Licence
Projet distribué sous licence MIT. Voir `LICENSE` pour plus d'informations.
