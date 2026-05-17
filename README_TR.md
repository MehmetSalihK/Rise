# 📱 Rise - AI Daily Discipline Coach

[![React Native](https://img.shields.io/badge/React_Native-0.74+-61DAFB?style=for-the-badge&logo=react)](https://reactnative.dev)
[![Expo](https://img.shields.io/badge/Expo-51+-000000?style=for-the-badge&logo=expo)](https://expo.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](LICENSE)

---

## 🌍 Diller
[Français](README.md) | [English](README_EN.md) | **Türkçe**

---

## 📋 İçindekiler
- [Proje Hakkında](#-proje-hakkında)
- [Özellikler](#-özellikler)
- [Temel Konsept](#-temel-konsept)
- [Teknoloji Yığını](#%EF%B8%8F-teknoloji-yığını)
- [Proje Mimarisi](#%EF%B8%8F-proje-mimarisi)
- [Ekran Genel Bakışları](#-ekran-genel-bakışları)
- [Bildirim Sistemi](#-bildirim-sistemi)
- [Akıllı Uyandırma Sistemi](#-akıllı-uyandırma-sistemi)
- [Disiplin Skoru](#-disiplin-skoru)
- [Seri Sistemi (Streak)](#-seri-sistemi-streak)
- [Araç Takımı Sistemi (Widgets)](#-araç-takımı-sistemi-widgets)
- [Test ve Teşhis Paneli](#-test-ve-teşhis-paneli)
- [Yapay Zeka Koçu (İsteğe Bağlı)](#-yapay-zeka-koçu-isteğe-bağlı)
- [Kurulum](#-kurulum)
- [Yapılandırma](#%EF%B8%8F-yapılandırma)
- [Klasör Yapısı](#-klasör-yapısı)
- [Gelecekteki Geliştirmeler](#-gelecekteki-geliştirmeler)
- [Lisans](#-lisans)

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
```text
Rise/
├── App.tsx                    # Ana Yapılandırıcı & Navigasyon
├── src/
│   ├── core/                  # Otonom Çekirdek Motorlar
│   │   ├── goalEngine.ts
│   │   ├── comparisonEngine.ts
│   │   ├── scoringEngine.ts
│   │   ├── streakEngine.ts
│   │   ├── wakeUpEngine.ts
│   │   └── notificationEngine.ts
│   ├── notifications/         # Planlayıcılar ve Şablonlar
│   │   ├── permissionManager.ts
│   │   ├── notificationTemplates.ts
│   │   ├── pressureSystem.ts
│   │   ├── smartNotificationEngine.ts
│   │   └── notificationScheduler.ts
│   ├── widgets/               # Araç Takımı Köprüleri
│   │   └── widgetDataBuilder.ts
│   ├── hooks/                 # Reaktif Bağlantı Kancaları
│   │   ├── useDailyGoals.ts
│   │   ├── useTracking.ts
│   │   └── useWakeUpGoal.ts
│   ├── screens/               # Grafiksel Ekranlar
│   │   ├── HomeScreen.tsx
│   │   ├── DailyGoalsScreen.tsx
│   │   ├── InputTrackingScreen.tsx
│   │   ├── ResultScreen.tsx
│   │   ├── HistoryScreen.tsx
│   │   ├── SettingsScreen.tsx
│   │   └── NotificationTestScreen.tsx
│   └── services/              # Sistem Servisleri ve Depolama
│       ├── storageService.ts
│       ├── notificationService.ts
│       └── aiService.ts
```

## 🚧 Gelecekteki Geliştirmeler
- **Etkileşimli Araç Takımları**: Swift / Kotlin uzantıları ile ana ekrandan uygulamayı açmadan alarm kapatma butonları.
- **Bulut Veritabanı**: Supabase tablolarında geçmiş disiplin günlüklerinin otomatik olarak saklanması.

## 📜 Lisans
Bu proje MIT Lisansı ile dağıtılmaktadır. Detaylar için `LICENSE` dosyasına göz atabilirsiniz.
