import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SignUpScreen" />
        <Stack.Screen name="LoginScreen" />
        <Stack.Screen name="DreamInterpretationScreen" />
        <Stack.Screen name="DreamHistoryScreen" />
        <Stack.Screen name="DreamDetailScreen" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
