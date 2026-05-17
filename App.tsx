import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from './src/screens/HomeScreen';
import { DailyPlanScreen } from './src/screens/DailyPlanScreen';
import { CheckInScreen } from './src/screens/CheckInScreen';
import { ResultScreen } from './src/screens/ResultScreen';
import { SleepScreen } from './src/screens/SleepScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { Home, Sparkles, Moon, Calendar, Settings as SettingsIcon } from 'lucide-react-native';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const customTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#0B0F14',
    card: '#121826',
    border: '#1F2E45',
    text: '#ffffff',
    primary: '#6366F1',
  },
};

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#6366F1',
        tabBarInactiveTintColor: '#8A9CAE',
        tabBarStyle: {
          backgroundColor: '#121826',
          borderTopWidth: 1,
          borderTopColor: '#1F2E45',
          paddingBottom: 6,
          paddingTop: 6,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: '800',
          textTransform: 'uppercase',
        },
        tabBarIcon: ({ color, size, focused }) => {
          const iconSize = focused ? 22 : 20;
          switch (route.name) {
            case 'Home':
              return <Home size={iconSize} color={color} />;
            case 'Plan':
              return <Sparkles size={iconSize} color={color} />;
            case 'Sleep':
              return <Moon size={iconSize} color={color} />;
            case 'History':
              return <Calendar size={iconSize} color={color} />;
            case 'Settings':
              return <SettingsIcon size={iconSize} color={color} />;
            default:
              return null;
          }
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Accueil' }} />
      <Tab.Screen name="Plan" component={DailyPlanScreen} options={{ title: 'Mon Plan' }} />
      <Tab.Screen name="Sleep" component={SleepScreen} options={{ title: 'Sommeil' }} />
      <Tab.Screen name="History" component={HistoryScreen} options={{ title: 'Historique' }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Réglages' }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer theme={customTheme}>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen name="CheckIn" component={CheckInScreen} />
        <Stack.Screen name="Result" component={ResultScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
