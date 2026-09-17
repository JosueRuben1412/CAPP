import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { WarehouseForm } from '@/features/warehouses/WarehouseForm';
import { WarehousePage } from '@/features/warehouses/WarehousePage';
import { updateWarehouse } from '@/features/warehouses/warehouseActions';
import { warehouseRouteId, warehouseToDraft, type WarehouseFields } from '@/features/warehouses/warehouseFields';
import { useWarehouseRecord } from '@/features/warehouses/useWarehouseRecord';

export default function EditWarehouseScreen() {
  const { id: routeId } = useLocalSearchParams<{ id?: string | string[] }>();
  const id = warehouseRouteId(routeId);
  const router = useRouter();
  const { state, retry, repository } = useWarehouseRecord(id);
  const [submitting, setSubmitting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function save(fields: WarehouseFields) {
    if (!id) return;
    setSubmitting(true);
    setSaveError(null);
    try {
      const warehouse = await updateWarehouse(repository, id, fields);
      if (!warehouse) {
        setSaveError('La bodega ya no existe.');
        return;
      }
      router.dismissTo({ pathname: '/warehouses/[id]', params: { id } });
    } catch (error) {
      console.error('No se pudo guardar la bodega.', error);
      setSaveError('No se pudo guardar la bodega. Inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <WarehousePage title="Editar bodega">
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
        <WarehouseForm
          key={state.warehouse.id}
          initialValues={warehouseToDraft(state.warehouse)}
          actionLabel="Guardar cambios"
          submitting={submitting}
          saveError={saveError}
          onChange={() => setSaveError(null)}
          onSubmit={save}
        />
      )}
    </WarehousePage>
  );
}

const styles = StyleSheet.create({
  state: { alignItems: 'center', paddingVertical: 30 },
  message: { color: '#344B55', fontSize: 17, lineHeight: 25, marginTop: 12 },
  retry: { minHeight: 48, justifyContent: 'center', paddingHorizontal: 18, marginTop: 12 },
  retryText: { color: '#0B5266', fontSize: 17, fontWeight: '700' },
});
