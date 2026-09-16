import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0B5266',
        tabBarInactiveTintColor: '#52636D',
        tabBarLabelStyle: { fontSize: 14, fontWeight: '600' },
        tabBarStyle: { backgroundColor: '#FFFFFF', borderTopColor: '#D7E0E4' },
        tabBarItemStyle: { minHeight: 48 },
      }}>
      <Tabs.Screen name="index" options={{ title: 'Inicio' }} />
      <Tabs.Screen name="products" options={{ title: 'Productos' }} />
      <Tabs.Screen name="scanner" options={{ title: 'Escáner' }} />
      <Tabs.Screen name="warehouses" options={{ title: 'Bodegas' }} />
    </Tabs>
  );
}
