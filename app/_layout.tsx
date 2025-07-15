import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useDatabase } from '@/hooks/useDatabase';

export default function RootLayout() {
  useFrameworkReady();
  const { isReady } = useDatabase();

  if (!isReady) {
    return null; // Or a loading screen
  }
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
