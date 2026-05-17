import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeScreen } from './src/screens/HomeScreen';
import { RoutineScreen } from './src/screens/RoutineScreen';
import { SleepScreen } from './src/screens/SleepScreen';
import { StreakScreen } from './src/screens/StreakScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { Home, CheckSquare, Moon, Flame, Settings as SettingsIcon } from 'lucide-react-native';

const Tab = createBottomTabNavigator();

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

export default function App() {
  return (
    <NavigationContainer theme={customTheme}>
      <StatusBar style="light" />
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
            fontSize: 10,
            fontWeight: '800',
            textTransform: 'uppercase',
          },
          tabBarIcon: ({ color, size, focused }) => {
            const iconSize = focused ? 22 : 20;
            switch (route.name) {
              case 'Home':
                return <Home size={iconSize} color={color} />;
              case 'Routine':
                return <CheckSquare size={iconSize} color={color} />;
              case 'Sleep':
                return <Moon size={iconSize} color={color} />;
              case 'Streak':
                return <Flame size={iconSize} color={color} />;
              case 'Settings':
                return <SettingsIcon size={iconSize} color={color} />;
              default:
                return null;
            }
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Accueil' }} />
        <Tab.Screen name="Routine" component={RoutineScreen} options={{ title: 'Routine' }} />
        <Tab.Screen name="Sleep" component={SleepScreen} options={{ title: 'Sommeil' }} />
        <Tab.Screen name="Streak" component={StreakScreen} options={{ title: 'Série' }} />
        <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: 'Réglages' }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
