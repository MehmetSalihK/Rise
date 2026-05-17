# 📱 Rise - AI Daily Discipline Coach

[![React Native](https://img.shields.io/badge/React_Native-0.74+-61DAFB?style=for-the-badge&logo=react)](https://reactnative.dev)
[![Expo](https://img.shields.io/badge/Expo-51+-000000?style=for-the-badge&logo=expo)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

---

## 🌍 Languages
[Français](README.md) | **English** | [Türkçe](README_TR.md)

---

## 📋 Table of Contents
- [🚀 About the Project](#-about-the-project)
- [🎯 Features](#-features)
- [🧠 Core Concept](#-core-concept)
- [⚙️ Tech Stack](#%EF%B8%8F-tech-stack)
- [🏗️ Project Architecture](#%EF%B8%8F-project-architecture)
- [📱 App Screens Overview](#-app-screens-overview)
- [🔔 Notification System](#-notification-system)
- [⏰ Smart Wake-Up System](#-smart-wake-up-system)
- [📊 Discipline Score System](#-discipline-score-system)
- [🔥 Streak System](#-streak-system)
- [🧩 Widgets System](#-widgets-system)
- [🧪 Diagnostics Panel](#-diagnostics-panel)
- [🤖 AI Coach (Optional)](#-ai-coach-optional)
- [📦 Installation](#-installation)
- [⚙️ Configuration](#%EF%B8%8F-configuration)
- [📁 Project Structure](#-project-structure)
- [🚧 Future Improvements](#-future-improvements)
- [📜 License](#-license)

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
```text
Rise/
├── App.tsx                    # Main Orchestrator & Navigation
├── src/
│   ├── core/                  # Autonomous Business Engines
│   │   ├── goalEngine.ts
│   │   ├── comparisonEngine.ts
│   │   ├── scoringEngine.ts
│   │   ├── streakEngine.ts
│   │   ├── wakeUpEngine.ts
│   │   └── notificationEngine.ts
│   ├── notifications/         # Schedulers & Templates
│   │   ├── permissionManager.ts
│   │   ├── notificationTemplates.ts
│   │   ├── pressureSystem.ts
│   │   ├── smartNotificationEngine.ts
│   │   └── notificationScheduler.ts
│   ├── widgets/               # Native Widgets Bridge
│   │   └── widgetDataBuilder.ts
│   ├── hooks/                 # Connection Reactive Hooks
│   │   ├── useDailyGoals.ts
│   │   ├── useTracking.ts
│   │   └── useWakeUpGoal.ts
│   ├── screens/               # Graphical Screens
│   │   ├── HomeScreen.tsx
│   │   ├── DailyGoalsScreen.tsx
│   │   ├── InputTrackingScreen.tsx
│   │   ├── ResultScreen.tsx
│   │   ├── HistoryScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   └── NotificationTestScreen.tsx
│   └── services/              # Storage & Core Services
│       ├── storageService.ts
│       ├── notificationService.ts
│       └── aiService.ts
```

## 🚧 Future Improvements
- **Interactive Quick Widgets**: Adding native Swift / Kotlin home widgets button triggers to let users dismiss alarms directly from their lock screen.
- **Cloud Database Syncing**: Seamless history persistence on Supabase backend tables.

## 📜 License
Distributed under the MIT License. See `LICENSE` for details.
