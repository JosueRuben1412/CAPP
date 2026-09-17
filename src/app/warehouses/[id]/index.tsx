import { useRef, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { RepositoryError } from '@/repositories/errors';
import { WarehousePage } from '@/features/warehouses/WarehousePage';
import { warehouseRouteId } from '@/features/warehouses/warehouseFields';
import { useWarehouseRecord } from '@/features/warehouses/useWarehouseRecord';

function displayDate(value: string): string {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Fecha no disponible' : date.toLocaleString('es-MX');
}

export default function WarehouseDetailScreen() {
  const { id: routeId } = useLocalSearchParams<{ id?: string | string[] }>();
  const id = warehouseRouteId(routeId);
  const router = useRouter();
  const { state, retry, repository } = useWarehouseRecord(id);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const deletingRef = useRef(false);

  async function deleteWarehouse() {
    if (!id || deletingRef.current) return;
    deletingRef.current = true;
    setDeleting(true);
    setDeleteError(null);
    try {
      await repository.delete(id);
      router.dismissTo('/warehouses');
    } catch (error) {
      console.error('No se pudo eliminar la bodega.', error);
      setDeleteError(error instanceof RepositoryError && error.kind === 'constraint'
        ? 'No se puede eliminar esta bodega porque tiene información asociada.'
        : 'No se pudo eliminar la bodega. Inténtalo de nuevo.');
    } finally {
      deletingRef.current = false;
      setDeleting(false);
    }
  }

  function confirmDelete() {
    if (deleting) return;
    Alert.alert('¿Eliminar bodega?', 'Esta acción eliminará la bodega de CORONAPP.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => { void deleteWarehouse(); } },
    ]);
  }

  return (
    <WarehousePage title="Detalle de bodega">
      {state.kind === 'loading' && <View style={styles.state}><ActivityIndicator /><Text style={styles.message}>Cargando bodega…</Text></View>}
      {state.kind === 'not_found' && <Text style={styles.message}>Bodega no encontrada.</Text>}
      {state.kind === 'error' && (
        <View style={styles.state}>
          <Text style={styles.message}>No se pudo cargar la bodega.</Text>
          <Pressable accessibilityRole="button" onPress={retry} style={styles.retry}>
            <Text style={styles.retryText}>Reintentar</Text>
          </Pressable>
        </View>
      )}
      {state.kind === 'success' && (
        <View>
          <Text style={styles.name}>{state.warehouse.name}</Text>
          {state.warehouse.description && (
            <View style={styles.valueRow}>
              <Text style={styles.valueLabel}>Descripción</Text>
              <Text style={styles.valueText}>{state.warehouse.description}</Text>
            </View>
          )}
          <View style={styles.valueRow}>
            <Text style={styles.valueLabel}>Última actualización</Text>
            <Text style={styles.valueText}>{displayDate(state.warehouse.updatedAt)}</Text>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={() => router.push({ pathname: '/warehouses/[id]/edit', params: { id: state.warehouse.id } })}
            style={styles.editButton}>
            <Text style={styles.editText}>Editar</Text>
          </Pressable>
          {deleteError && <Text accessibilityRole="alert" style={styles.error}>{deleteError}</Text>}
          <Pressable
            accessibilityRole="button"
            disabled={deleting}
            onPress={confirmDelete}
            style={[styles.deleteButton, deleting && styles.disabled]}>
            <Text style={styles.deleteText}>{deleting ? 'Eliminando…' : 'Eliminar bodega'}</Text>
          </Pressable>
        </View>
      )}
    </WarehousePage>
  );
}

const styles = StyleSheet.create({
  state: { alignItems: 'center', paddingVertical: 30 },
  message: { color: '#344B55', fontSize: 17, lineHeight: 25, marginTop: 12 },
  retry: { minHeight: 48, justifyContent: 'center', paddingHorizontal: 18, marginTop: 12 },
  retryText: { color: '#0B5266', fontSize: 17, fontWeight: '700' },
  name: { color: '#172E38', fontSize: 25, fontWeight: '700', marginBottom: 26 },
  valueRow: { borderBottomColor: '#D7E0E4', borderBottomWidth: 1, paddingVertical: 13 },
  valueLabel: { color: '#52636D', fontSize: 15, marginBottom: 4 },
  valueText: { color: '#172E38', fontSize: 18, lineHeight: 26 },
  editButton: { backgroundColor: '#0B5266', borderRadius: 8, minHeight: 54,
    justifyContent: 'center', alignItems: 'center', marginTop: 32 },
  editText: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  deleteButton: { borderColor: '#A52F2F', borderWidth: 1, borderRadius: 8,
    minHeight: 54, justifyContent: 'center', alignItems: 'center', marginTop: 16 },
  deleteText: { color: '#A52F2F', fontSize: 17, fontWeight: '700' },
  disabled: { opacity: 0.55 },
  error: { color: '#A52F2F', fontSize: 15, lineHeight: 22, marginTop: 16 },
});
