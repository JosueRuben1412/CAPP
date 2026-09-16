import { Stack } from 'expo-router';

// Las rutas de Expo Router viven en src/app/ para mantener el código dentro de src/.
export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
