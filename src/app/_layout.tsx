import { Stack } from 'expo-router';

import { DatabaseProvider } from '@/database/DatabaseProvider';

// Las rutas de Expo Router viven en src/app/ para mantener el código dentro de src/.
export default function RootLayout() {
  return (
    <DatabaseProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </DatabaseProvider>
  );
}
