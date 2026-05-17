import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const notificationService = {
  async registerForPushNotifications(): Promise<boolean> {
    if (Platform.OS === 'web') return false;

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    // Register V8 Notification Categories
    await this.registerCategories();

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#6366F1',
      });
    }

    return finalStatus === 'granted';
  },

  async registerCategories(): Promise<void> {
    if (Platform.OS === 'web') return;

    // Wake up interactive buttons
    await Notifications.setNotificationCategoryAsync('wake-up-actions', [
      {
        identifier: 'awake-yes',
        buttonTitle: '☀️ JE SUIS DEBOUT',
        options: { opensAppToForeground: false }
      },
      {
        identifier: 'awake-no',
        buttonTitle: '🛌 ENCORE 5 MIN',
        options: { opensAppToForeground: false }
      }
    ]);

    // Discipline check interactive buttons
    await Notifications.setNotificationCategoryAsync('discipline-check-actions', [
      {
        identifier: 'check-yes',
        buttonTitle: '✅ OUI, RÉUSSI',
        options: { opensAppToForeground: false }
      },
      {
        identifier: 'check-no',
        buttonTitle: '❌ NON, ÉCHOUÉ',
        options: { opensAppToForeground: false }
      }
    ]);
  },

  async scheduleImmediateNotification(
    title: string,
    body: string,
    delaySeconds: number = 1
  ): Promise<string | null> {
    try {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.MAX,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: delaySeconds,
          repeats: false,
        },
      });
      return identifier;
    } catch (e) {
      console.warn("Error scheduling immediate notification:", e);
      return null;
    }
  },

  async scheduleInteractiveNotification(
    title: string,
    body: string,
    categoryIdentifier: 'wake-up-actions' | 'discipline-check-actions',
    delaySeconds: number = 1
  ): Promise<string | null> {
    try {
      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.MAX,
          categoryIdentifier,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: delaySeconds,
          repeats: false,
        },
      });
      return identifier;
    } catch (e) {
      console.warn("Error scheduling interactive notification:", e);
      return null;
    }
  },

  async scheduleDailyReminder(
    id: string,
    title: string,
    body: string,
    timeStr: string // "HH:mm"
  ): Promise<string | null> {
    try {
      await this.cancelReminder(id);

      const [hour, minute] = timeStr.split(':').map(Number);
      
      const trigger: Notifications.DailyTriggerInput = {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour,
        minute,
      };

      const identifier = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger,
      });

      return identifier;
    } catch (e) {
      console.warn("Error scheduling notification:", e);
      return null;
    }
  },

  setupNotificationResponseListener(callback: (actionId: string) => void) {
    return Notifications.addNotificationResponseReceivedListener(response => {
      const actionId = response.actionIdentifier;
      callback(actionId);
    });
  },

  async cancelReminder(identifier: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
    } catch (e) {
      // Ignored
    }
  },

  async cancelAllReminders(): Promise<void> {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }
};
