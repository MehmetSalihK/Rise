# 📱 Rise - AI Daily Discipline Coach

[![React Native](https://img.shields.io/badge/React_Native-0.74+-61DAFB?style=for-the-badge&logo=react)](https://reactnative.dev)
[![Expo](https://img.shields.io/badge/Expo-51+-000000?style=for-the-badge&logo=expo)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

---

## 🌍 Languages
[Français](#français) | [English](#english) | [Türkçe](#türkçe)

---

<div id="français">

# 🇫🇷 Version Française

## 📋 Table des Matières
- [🚀 À Propos du Projet](#-à-propos-du-projet)
- [🎯 Fonctionnalités](#-fonctionnalités)
- [🧠 Concept Central](#-concept-central)
- [⚙️ Stack Technique](#%EF%B8%8F-stack-technique)
- [🏗️ Architecture du Projet](#%EF%B8%8F-architecture-du-projet)
- [📱 Aperçu des Écrans](#-aperçu-des-écrans)
- [🔔 Système de Notifications](#-système-de-notifications)
- [⏰ Système Smart Wake-Up](#-système-smart-wake-up)
- [📊 Score de Discipline](#-score-de-discipline)
- [🔥 Système de Streak](#-système-de-streak)
- [🧩 Système de Widgets](#-système-de-widgets)
- [🧪 Diagnostics de Test](#-diagnostics-de-test)
- [🤖 Coach Personnel IA](#-coach-personnel-ia-optionnel)
- [📦 Installation](#-installation)
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
- **Active Coach Notifications** : Moteur de rappels adaptatif à 3 niveaux de pression (Vert, Orange, Rouge).
- **Widgets System** : Pont de données local (`widgetDataBuilder.ts`) prêt pour WidgetKit (iOS) et AppWidget (Android).
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
- **Notifications** : Expo Notifications
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
- **Réglages (`SettingsScreen.tsx`)** : Paramètres utilisateurs, gestion de clé API IA et passerelle vers les tests.
- **Diagnostics de Test (`NotificationTestScreen.tsx`)** : Terminal de test matériel haptique.

## 🔔 Système de Notifications
Le **Pressure System** adapte automatiquement la fréquence des notifications selon ton état de discipline :
- 🟢 **GOOD STATE** (Score $\ge$ 70) : Motivation douce, le coach reste discret.
- 🟠 **MEDIUM STATE** (Score 40-70) : Rappels réguliers et équilibrés de recentrage.
- 🔴 **BAD STATE** (Score < 40 ou inactivité > 24h) : **Pression Active**. Jusqu'à 6 rappels quotidiens ciblés et percutants pour te pousser à réagir !

## ⏰ Système Smart Wake-Up
Dès que ton heure cible de réveil est configurée (ex: 06:30), Rise programme 3 alertes :
1. **06:30 (Alerte 1)** : *"Il est 06:30 — Réveille-toi maintenant 🌅"*
2. **06:35 (Alerte 2)** : *"Tu devais être debout depuis 5 minutes... ⚠️"*
3. **06:40 (Alerte 3)** : *"Commence ta journée maintenant ! 🚨"*
Le bouton **"JE SUIS DEBOUT ☀️"** sur l'écran d'accueil arrête instantanément le reste de la séquence.

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

## 🧩 Système de Widgets
Grâce à **`widgetDataBuilder.ts`**, l'application écrit à chaque soumission un conteneur JSON léger contenant ton score, streak et code couleur dans un répertoire persistant partagé. Ce pont de données local est prêt à être lu en arrière-plan par **WidgetKit** (iOS) et **AppWidget** (Android).

## 🧪 Diagnostics de Test
L'écran **`NotificationTestScreen.tsx`** offre un terminal de contrôle matériel :
- **Test Simple** : Reçoit une alerte simple après 1s.
- **Test Wake-Up Alarm** : Simule une alarme sonore et vibratoire après 5s.
- **Test Reminder Flow** : Envoie une séquence rythmée de 3 alertes (1s, 4s, 7s).
- **Test Critical Alert** : Déclenche une vibration d'urgence haptique après 1s.

## 🤖 Coach Personnel IA (Optionnel)
En ajoutant ta clé API Google Gemini dans les réglages, le coach IA :
- Analyse tes métriques réelles pour générer un bilan de 2 phrases percutantes.
- Réécrit à la volée tes notifications quotidiennes pour les adapter à ton niveau de discipline actuel.

---

## 📦 Installation
```bash
# 1. Cloner le projet
git clone https://github.com/MehmetSalihK/Rise.git
cd Rise

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement Expo
npx expo start
```

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

</div>

---

<div id="english">

# 🇬🇧 English Version

## 📋 Table of Contents
- [🚀 About the Project](#-about-the-project)
- [🎯 Features](#-features)
- [🧠 Core Concept](#-core-concept-1)
- [⚙️ Tech Stack](#%EF%B8%8F-tech-stack-1)
- [🏗️ Project Architecture](#%EF%B8%8F-project-architecture)
- [📱 App Screens Overview](#-app-screens-overview)
- [🔔 Notification System](#-notification-system-1)
- [⏰ Smart Wake-Up System](#-smart-wake-up-system-1)
- [📊 Discipline Score System](#-discipline-score-system-1)
- [🔥 Streak System](#-streak-system-1)
- [🧩 Widgets System](#-widgets-system-1)
- [🧪 Diagnostics Panel](#-diagnostics-panel)
- [🤖 AI Coach (Optional)](#-ai-coach-optional)
- [📦 Installation](#-installation-1)
- [⚙️ Configuration](#%EF%B8%8F-configuration-1)
- [📁 Project Structure](#-project-structure-1)
- [🚧 Future Improvements](#-future-improvements-1)
- [📜 License](#-license-1)

---

## 🚀 About the Project
**Rise** is an ultra-minimalist, mobile-first daily discipline coach application built with React Native (Expo) and TypeScript. Far from complex, bloated to-do list apps, Rise serves as a daily mirror of truth: you set your actual quantitative targets (times, durations), submit your reality, and the app instantly calculates your scientific discipline score while guiding you via active reminders, status widgets, and an AI personal coach.

## 🎯 Features
- **Daily Goals System**: Fast and simple configuration of daily targets.
- **Smart Wake-Up System**: A 3-step sequential simulated alarm system with a quick dismiss button.
- **Daily Check-in**: Submit your daily actual achievements in under 60 seconds.
- **Discipline Score**: A unified mathematical calculation of your daily progress (0 to 100).
- **Streak System**: Consistency tracker 🔥 featuring loss aversion triggers (loss of streak on relapse).
- **Active Coach Notifications**: Adaptive reminder engine with 3 custom pressure levels (Green, Orange, Red).
- **Widgets System**: Local JSON bridging (`widgetDataBuilder.ts`) prepared for WidgetKit (iOS) and AppWidget (Android).
- **Diagnostics Panel**: Built-in testing screen (`NotificationTestScreen.tsx`) to validate haptics, vibrations, and system channels.
- **AI Coach**: Live, tailored cognitive logs written directly by Google Gemini.

## 🧠 Core Concept
Rise is built on the philosophy of **Quantifiable Discipline**. The user does not evaluate their day based on a vague subjective mood, but by comparing targets with declared realities:
> *“You set a daily target, you submit your reality, and Rise tells you if you succeeded or failed. It is a system of truth.”*

## ⚙️ Tech Stack
- **Core Framework**: React Native (Expo SDK 51)
- **Language**: TypeScript
- **Local Storage**: AsyncStorage (local-first)
- **Cloud Sync**: Supabase Client (Optional)
- **Notifications**: Expo Notifications
- **Icons**: Lucide React Native
- **AI Core**: Google Gemini API integration (Optional)

## 🏗️ Project Architecture
Rise enforces a strict Separation of Concerns (SOC):
- **`/src/core/`**: Autonomous business engines (score evaluation, bedtime minutes calculations, streak rules).
- **`/src/notifications/`**: Adaptive scheduling engines and warning templates.
- **`/src/widgets/`**: Native shared widget local serializing bridges.
- **`/src/hooks/`**: Reactive Hooks connecting storage layers to front screens.
- **`/src/screens/`**: Minimalist, high-end dark mode layout panels.

## 📱 App Screens Overview
- **Home (`HomeScreen.tsx`)**: Elegant clock panel, active AI pressure badge, streak indicators 🔥, and morning wake-up widget.
- **Targets setup (`DailyGoalsScreen.tsx`)**: Slick target values input forms (wake-up, bedtime, screen limits, sport, reading).
- **Submit Actuals (`InputTrackingScreen.tsx`)**: Under-60-seconds numeric reality declarations forms.
- **Verdict Results (`ResultScreen.tsx`)**: Target vs Actual comparison cards with color-coded badges and AI tips.
- **History (`HistoryScreen.tsx`)**: Chronological audit timelines reflecting past performance.
- **Settings (`SettingsScreen.tsx`)**: Secure API Keys managers and developer portal shortcuts.
- **Diagnostics (`NotificationTestScreen.tsx`)**: Embedded hardware haptic testers and terminals.

## 🔔 Notification System
The **Discipline Pressure System** automatically scales notifications frequency based on your behavioral states:
- 🟢 **GOOD STATE** (Score $\ge$ 70): Light motivational pushes, coach remains subtle.
- 🟠 **MEDIUM STATE** (Score 40-70): Regular, balanced checkpoints.
- 🔴 **BAD STATE** (Score < 40 or inactivity > 24h): **Active Pressure Enabled**. Up to 6 hourly alerts to shake you and enforce focus!

## ⏰ Smart Wake-Up System
Once a wake-up goal is set (e.g., 06:30), Rise registers a 3-step sequence:
1. **06:30 (Alert 1)**: *"It is 06:30 — Wake up now 🌅"*
2. **06:35 (Alert 2)**: *"You were supposed to be up 5 minutes ago... ⚠️"*
3. **06:40 (Alert 3)**: *"Start your day now! 🚨"*
Clicking **"I'M UP ☀️"** on the home screen cancels all remaining sequence reminders instantly.

## 📊 Discipline Score System
$$DAILY\_SCORE = \left( \frac{\text{successful targets}}{\text{total goals}} \right) \times 100$$
Each target validated (e.g. screen time $\le$ goal, or sleep $\le$ goal) awards 1 point.
- **0 to 40**: Bad Day (Red `#EF4444`)
- **40 to 70**: Medium Day (Orange `#F59E0B`)
- **70 to 100**: Excellent Day (Green `#22C55E`)

## 🔥 Streak System
- **Score $\ge$ 70**: Streak increases by **+1**.
- **Score < 40**: Streak immediately resets to **0** (Loss Aversion).
- **Between 40 and 70**: Streak is maintained.

## 🧩 Widgets System
Using **`widgetDataBuilder.ts`**, the app writes a clean JSON file containing your score, streak, and status color to a shared local bridge directory at each submission. This allows **WidgetKit** (iOS) and **AppWidget** (Android) to render updates instantly on your home screens without waking up the main thread.

## 🧪 Diagnostics Panel
The **`NotificationTestScreen.tsx`** offers direct control over hardware triggers:
- **Simple Test**: Fires a welcome alert after 1s.
- **Wake-Up Alarm**: Simulates an alarm sound + haptic vibration in 5s.
- **Reminder Flow**: Schedules a sequential flow of 3 alerts (1s, 4s, 7s).
- **Critical Alert**: Triggers a high-priority, warning vibration after 1s.

## 🤖 AI Coach (Optional)
By configuring your Google Gemini API Key in Settings:
- The AI analyzes your targets vs actuals to draft a sharp, Apple-Fitness-style evaluation.
- It dynamically enriches your scheduled push alerts according to your current pressure state.

---

## 📦 Installation
```bash
# 1. Clone the project
git clone https://github.com/MehmetSalihK/Rise.git
cd Rise

# 2. Install dependencies
npm install

# 3. Start Expo local server
npx expo start
```

## ⚙️ Configuration
Create a `.env.local` file at the root:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📁 Project Structure
Refer to the French section [Structure des Fichiers](#-structure-des-fichiers) for details.

## 🚧 Future Improvements
- **Interactive Quick Widgets**: Adding native Swift / Kotlin home widgets button triggers to let users dismiss alarms directly from their lock screen.
- **Cloud Database Syncing**: Seamless history persistence on Supabase backend tables.

## 📜 License
Distributed under the MIT License. See `LICENSE` for details.

</div>

---

<div id="türkçe">

# 🇹🇷 Türkçe Versiyonu

## 📋 İçindekiler
- [🚀 Proje Hakkında](#-proje-hakkında)
- [🎯 Özellikler](#-özellikler)
- [🧠 Temel Konsept](#-temel-konsept)
- [⚙️ Teknoloji Yığını](#%EF%B8%8F-teknoloji-yığını)
- [🏗️ Proje Mimarisi](#%EF%B8%8F-proje-mimarisi)
- [📱 Ekran Genel Bakışları](#-ekran-genel-bakışları)
- [🔔 Bildirim Sistemi](#-bildirim-sistemi)
- [⏰ Akıllı Uyandırma Sistemi](#-akıllı-uyandırma-sistemi)
- [📊 Disiplin Skoru](#-disiplin-skoru)
- [🔥 Seri Sistemi (Streak)](#-seri-sistemi-streak)
- [🧩 Araç Takımı Sistemi (Widgets)](#-araç-takımı-sistemi-widgets)
- [🧪 Test ve Teşhis Paneli](#-test-ve-teşhis-paneli)
- [🤖 Yapay Zeka Koçu (İsteğe Bağlı)](#-yapay-zeka-koçu-isteğe-bağlı)
- [📦 Kurulum](#-kurulum)
- [⚙️ Yapılandırma](#%EF%B8%8F-yapılandırma)
- [📁 Klasör Yapısı](#-klasör-yapısı)
- [🚧 Gelecekteki Geliştirmeler](#-gelecekteki-geliştirmeler)
- [📜 Lisans](#-lisans)

---

## 🚀 Proje Hakkında
**Rise**, React Native (Expo) ve TypeScript kullanılarak geliştirilmiş, mobil öncelikli ve ultra-minimalist bir günlük disiplin koçu uygulamasıdır. Rise, karmaşık yapılacaklar listelerinin aksine, kullanıcının gerçek hedeflerini (saatler, süreler) belirlediği, gerçek sonuçlarını beyan ettiği ve uygulamanın anında bilimsel disiplin skorunu hesaplayarak kullanıcıyı akıllı bildirimler, araç takımları ve kişiselleştirilmiş bir yapay zeka koçu ile yönlendirdiği bir "gerçeklik aynasıdır".

## 🎯 Özellikler
- **Daily Goals System**: Günlük hedeflerin hızlı ve basit bir şekilde yapılandırılması.
- **Smart Wake-Up System**: 3 aşamalı ardışık alarm simülasyonu ve hızlı kapatma butonu.
- **Günlük Bildirim (Check-in)**: Günlük gerçek verilerinizi 60 saniyeden kısa sürede kaydetme.
- **Disiplin Skoru**: Günlük başarı seviyenizin bilimsel formülle hesaplanması (0 - 100).
- **Streak Sistemi**: Gelişmiş kayıp önleme (Loss Aversion) kurallarına sahip istikrar sayacı 🔥.
- **Active Coach Notifications**: 3 farklı disiplin seviyesine (Yeşil, Turuncu, Kırmızı) göre uyum sağlayan akıllı hatırlatıcı.
- **Widgets Sistemi**: WidgetKit (iOS) ve AppWidget (Android) için optimize edilmiş JSON veri köprüsü (`widgetDataBuilder.ts`).
- **Test ve Teşhis Paneli**: Titreşimleri ve bildirim izinlerini anında test etmek için dahili panel (`NotificationTestScreen.tsx`).
- **Yapay Zeka Koçu**: Google Gemini tarafından doğrudan yazılan dinamik analizler ve kişiselleştirilmiş öneriler.

## 🧠 Temel Konsept
Rise, **Ölçülebilir Disiplin** felsefesi üzerine kurulmuştur. Kullanıcı gününü soyut hislere göre değil, net sayısal hedefleri ve gerçek başarı durumlarını karşılaştırarak değerlendirir:
> *“Bir hedef belirlersiniz, gerçeği beyan edersiniz ve Rise size başarılı olup olmadığınızı söyler. Bu bir dürüstlük sistemidir.”*

## ⚙️ Teknoloji Yığını
- **Çekirdek Çerçeve**: React Native (Expo SDK 51)
- **Dil**: TypeScript
- **Yerel Depolama**: AsyncStorage (Local-First)
- **Bulut Senkronizasyonu**: Supabase Client (İsteğe Bağlı)
- **Bildirimler**: Expo Notifications
- **İkonlar**: Lucide React Native
- **Yapay Zeka Modeli**: Google Gemini API Entegrasyonu (İsteğe Bağlı)

## 🏗️ Proje Mimarisi
Rise, katı bir Sorumlulukların Ayrılması (SOC) mimarisine sahiptir:
- **`/src/core/`**: Otonom iş mantığı motorları (skor hesaplama, uyku saati dönüşümleri, streak kuralları).
- **`/src/notifications/`**: Akıllı planlayıcılar ve bildirim şablonları.
- **`/src/widgets/`**: Yerel widget'lar için JSON veri köprüleri.
- **`/src/hooks/`**: Depolama katmanını ekranlara bağlayan reaktif kancalar.
- **`/src/screens/`**: Minimalist karanlık mod arayüzleri.

## 📱 Ekran Genel Bakışları
- **Ana Ekran (`HomeScreen.tsx`)**: Minimalist saat, aktif yapay zeka bildirim baskı rozeti, streak göstergesi 🔥 ve akıllı sabah alarmları kapatma widget'ı.
- **Hedef Belirleme (`DailyGoalsScreen.tsx`)**: Uyandırma, uyku, ekran sınırı, spor ve okuma hedefleri giriş formu.
- **Gerçek Durum Girişi (`InputTrackingScreen.tsx`)**: 60 saniyelik sayısal gerçeklik beyan ekranı.
- **Sonuç Karşılaştırma (`ResultScreen.tsx`)**: Hedef ve gerçek durumları karşılaştıran renkli rozetler ve yapay zeka tavsiyeleri.
- **Geçmiş (`HistoryScreen.tsx`)**: Eski performansların kronolojik geçmişi.
- **Ayarlar (`SettingsScreen.tsx`)**: Kullanıcı profili, yapay zeka anahtarı yönetimi ve teşhis paneli kısayolları.
- **Teşhis Paneli (`NotificationTestScreen.tsx`)**: Fiziksel bildirim, titreşim ve kanal test araçları.

## 🔔 Bildirim Sistemi
**Disiplin Baskı Sistemi (Pressure System)**, disiplin durumunuza göre bildirim sıklığını otomatik ayarlar:
- 🟢 **GOOD STATE** (Skor $\ge$ 70): Yumuşak ve motive edici hatırlatmalar.
- 🟠 **MEDIUM STATE** (Skor 40-70): Dengeli ve düzenli disiplin kontrolleri.
- 🔴 **BAD STATE** (Skor < 40 veya 24 saatten fazla hareketsizlik): **Aktif Baskı**. Sizi toparlanmaya zorlamak için günde 6 defaya kadar saatlik uyarılar!

## ⏰ Akıllı Uyandırma Sistemi
Bir uyandırma hedefi (örneğin 06:30) belirlediğinizde, Rise otomatik olarak 3 ardışık uyarı planlar:
1. **06:30 (1. Uyarı)**: *"Saat 06:30 — Şimdi uyanma zamanı 🌅"*
2. **06:35 (2. Uyarı)**: *"5 dakika önce uyanmış olman gerekiyordu... ⚠️"*
3. **06:40 (3. Uyarı)**: *"Güne şimdi başla! Erteleme disiplini yok eder. 🚨"*
Ana ekrandaki **"AYAKTAYIM ☀️"** butonu kalan tüm uyarıları anında iptal eder.

## 📊 Disiplin Skoru
$$GUNLUK\_SKOR = \left( \frac{\text{başarılı hedefler}}{\text{toplam hedefler}} \right) \times 100$$
Tamamlanan her hedef (örneğin, ekran süresi $\le$ hedef veya spor $\ge$ hedef) 1 puan kazandırır.
- **0 - 40**: Kötü Gün (Kırmızı `#EF4444`)
- **40 - 70**: Orta Gün (Turuncu `#F59E0B`)
- **70 - 100**: Harika Gün (Yeşil `#22C55E`)

## 🔥 Seri Sistemi (Streak)
- **Skor $\ge$ 70**: Streak sayacınız **+1** artar.
- **Skor < 40**: Streak sayacınız anında **0** olur (Loss Aversion).
- **40 - 70 Arası**: Streak sayacınız aynı kalır.

## 🧩 Araç Takımı Sistemi (Widgets)
**`widgetDataBuilder.ts`** sayesinde, her check-in işleminde uygulamanız yerel depolama köprüsüne skorunuzu, streak sayınızı ve durum renginizi içeren hafif bir JSON dosyası yazar. Bu veri köprüsü, **WidgetKit** (iOS) ve **AppWidget** (Android) tarafından ana ekranınızda anında güncellenmeye hazırdır.

## 🧪 Test ve Teşhis Paneli
**`NotificationTestScreen.tsx`** fiziksel bildirimlerinizi anında test etmenizi sağlar:
- **Basit Test**: 1 saniye içinde basit bir karşılama bildirimi gönderir.
- **Uyandırma Alarmı**: 5 saniye içinde sesli ve titreşimli bir alarm simüle eder.
- **Ardışık Akış**: Sırasıyla (1s, 4s, 7s) 3 ardışık bildirim gönderir.
- **Kritik Uyarı**: 1 saniye içinde yüksek öncelikli bir disiplin uyarısı gönderir.

## 🤖 Yapay Zeka Koçu (İsteğe Bağlı)
Ayarlardan Google Gemini API anahtarınızı tanımladığınızda:
- Yapay zeka, hedeflerinizi ve beyanlarınızı analiz ederek 2 cümlelik keskin bir değerlendirme hazırlar.
- Planlanmış bildirim mesajlarınızı o anki disiplin durumunuza göre dinamik olarak yeniden yazar.

---

## 📦 Kurulum
```bash
# 1. Projeyi klonlayın
git clone https://github.com/MehmetSalihK/Rise.git
cd Rise

# 2. Bağımlılıkları yükleyin
npm install

# 3. Expo geliştirici sunucusunu başlatın
npx expo start
```

## ⚙️ Yapılandırma
Kök dizinde `.env.local` dosyası oluşturun:
```env
EXPO_PUBLIC_SUPABASE_URL=supabase_url_adresiniz
EXPO_PUBLIC_SUPABASE_ANON_KEY=supabase_anon_key_degeriniz
```

## 📁 Klasör Yapısı
Fransızca bölümündeki [Structure des Fichiers](#-structure-des-fichiers) tablosunu referans alabilirsiniz.

## 🚧 Gelecekteki Geliştirmeler
- **Etkileşimli Araç Takımları**: Swift / Kotlin uzantıları ile ana ekrandan uygulamayı açmadan alarm kapatma butonları.
- **Bulut Veritabanı**: Supabase tablolarında geçmiş disiplin günlüklerinin otomatik olarak saklanması.

## 📜 Lisans
Bu proje MIT Lisansı ile dağıtılmaktadır. Detaylar için `LICENSE` dosyasına göz atabilirsiniz.

</div>
