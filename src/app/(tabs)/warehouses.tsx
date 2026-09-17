import { useCallback, useRef, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useWarehouseRepository } from '@/features/warehouses/useWarehouseRepository';
import type { Warehouse } from '@/types/records';

type ListState =
  | { kind: 'loading' }
  | { kind: 'success'; warehouses: Warehouse[] }
  | { kind: 'error' };

export default function WarehousesScreen() {
  const router = useRouter();
  const repository = useWarehouseRepository();
  const [state, setState] = useState<ListState>({ kind: 'loading' });
  const requestId = useRef(0);

  const load = useCallback(() => {
    const request = ++requestId.current;
    setState({ kind: 'loading' });
    repository.list().then(warehouses => {
      if (request === requestId.current) setState({ kind: 'success', warehouses });
    }).catch(error => {
      console.error('No se pudieron cargar las bodegas.', error);
      if (request === requestId.current) setState({ kind: 'error' });
    });
  }, [repository]);

  useFocusEffect(useCallback(() => {
    load();
    return () => { requestId.current += 1; };
  }, [load]));

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <View style={styles.content}>
        <Text accessibilityRole="header" style={styles.title}>Bodegas</Text>
        <Pressable accessibilityRole="button" onPress={() => router.push('/warehouses/new')} style={styles.newButton}>
          <Text style={styles.newButtonText}>Nueva bodega</Text>
        </Pressable>

        {state.kind === 'loading' && <View style={styles.center}><ActivityIndicator /><Text style={styles.message}>Cargando bodegas…</Text></View>}
        {state.kind === 'error' && (
          <View style={styles.center}>
            <Text style={styles.message}>No se pudieron cargar las bodegas.</Text>
            <Pressable accessibilityRole="button" onPress={load} style={styles.retryButton}>
              <Text style={styles.retryText}>Reintentar</Text>
            </Pressable>
          </View>
        )}
        {state.kind === 'success' && (
          <FlatList
            data={state.warehouses}
            keyExtractor={warehouse => warehouse.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push({ pathname: '/warehouses/[id]', params: { id: item.id } })}
                style={styles.warehouseRow}>
                <Text style={styles.warehouseName}>{item.name}</Text>
                {item.description && <Text style={styles.warehouseDescription}>{item.description}</Text>}
              </Pressable>
            )}
            ListEmptyComponent={
              <View style={styles.center}>
                <Text style={styles.message}>No hay bodegas registradas.</Text>
                <Pressable accessibilityRole="button" onPress={() => router.push('/warehouses/new')} style={styles.retryButton}>
                  <Text style={styles.retryText}>Agregar bodega</Text>
                </Pressable>
              </View>
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F7F8' },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 28 },
  title: { color: '#172E38', fontSize: 32, fontWeight: '700', marginBottom: 20 },
  newButton: { backgroundColor: '#0B5266', minHeight: 52, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center', marginBottom: 22 },
  newButtonText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
  listContent: { flexGrow: 1, paddingBottom: 28 },
  warehouseRow: { backgroundColor: '#FFFFFF', borderColor: '#D7E0E4', borderWidth: 1,
    borderRadius: 8, minHeight: 76, justifyContent: 'center', padding: 16, marginBottom: 12 },
  warehouseName: { color: '#172E38', fontSize: 19, fontWeight: '700', marginBottom: 3 },
  warehouseDescription: { color: '#52636D', fontSize: 15, lineHeight: 22 },
  center: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48 },
  message: { color: '#344B55', fontSize: 17, textAlign: 'center', lineHeight: 25, marginTop: 10 },
  retryButton: { minHeight: 48, justifyContent: 'center', paddingHorizontal: 20, marginTop: 12 },
  retryText: { color: '#0B5266', fontSize: 17, fontWeight: '700' },
});
