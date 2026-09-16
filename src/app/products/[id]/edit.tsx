import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { ProductForm } from '@/features/products/ProductForm';
import { ProductPage } from '@/features/products/ProductPage';
import { productSaveErrorMessage, updateProduct } from '@/features/products/productActions';
import { productRouteId, productToDraft, type ProductFields } from '@/features/products/productFields';
import { useProductRecord } from '@/features/products/useProductRecord';

export default function EditProductScreen() {
  const { id: routeId } = useLocalSearchParams<{ id?: string | string[] }>();
  const id = productRouteId(routeId);
  const router = useRouter();
  const { state, retry, repository } = useProductRecord(id);
  const [submitting, setSubmitting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function save(fields: ProductFields) {
    if (!id) return;
    setSubmitting(true);
    setSaveError(null);
    try {
      const product = await updateProduct(repository, id, fields);
      if (!product) {
        setSaveError('El producto ya no existe.');
        return;
      }
      router.dismissTo({ pathname: '/products/[id]', params: { id } });
    } catch (error) {
      setSaveError(await productSaveErrorMessage(error, repository, fields.barcode, id));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ProductPage title="Editar producto">
      {state.kind === 'loading' && <View style={styles.state}><ActivityIndicator /><Text style={styles.message}>Cargando producto…</Text></View>}
      {state.kind === 'not_found' && <Text style={styles.message}>Producto no encontrado.</Text>}
      {state.kind === 'error' && (
        <View style={styles.state}>
          <Text style={styles.message}>No se pudo cargar el producto.</Text>
          <Pressable accessibilityRole="button" onPress={retry} style={styles.retry}>
            <Text style={styles.retryText}>Reintentar</Text>
          </Pressable>
        </View>
      )}
      {state.kind === 'success' && (
        <ProductForm
          key={state.product.id}
          initialValues={productToDraft(state.product)}
          actionLabel="Guardar cambios"
          submitting={submitting}
          saveError={saveError}
          onChange={() => setSaveError(null)}
          onSubmit={save}
        />
      )}
    </ProductPage>
  );
}

const styles = StyleSheet.create({
  state: { alignItems: 'center', paddingVertical: 30 },
  message: { color: '#344B55', fontSize: 17, lineHeight: 25, marginTop: 12 },
  retry: { minHeight: 48, justifyContent: 'center', paddingHorizontal: 18, marginTop: 12 },
  retryText: { color: '#0B5266', fontSize: 17, fontWeight: '700' },
});
