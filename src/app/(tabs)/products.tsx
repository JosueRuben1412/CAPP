import { useCallback, useRef, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useProductRepository } from '@/features/products/useProductRepository';
import type { Product } from '@/types/records';

type ListState =
  | { kind: 'loading' }
  | { kind: 'success'; products: Product[] }
  | { kind: 'error' };

export default function ProductsScreen() {
  const router = useRouter();
  const repository = useProductRepository();
  const [state, setState] = useState<ListState>({ kind: 'loading' });
  const requestId = useRef(0);

  const loadProducts = useCallback(() => {
    const request = ++requestId.current;
    setState({ kind: 'loading' });
    repository.list().then(products => {
      if (request === requestId.current) setState({ kind: 'success', products });
    }).catch(error => {
      console.error('No se pudieron cargar los productos.', error);
      if (request === requestId.current) setState({ kind: 'error' });
    });
  }, [repository]);

  useFocusEffect(useCallback(() => {
    loadProducts();
    return () => { requestId.current += 1; };
  }, [loadProducts]));

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text accessibilityRole="header" style={styles.title}>Productos</Text>
          <Pressable accessibilityRole="button" onPress={() => router.push('/products/new')} style={styles.newButton}>
            <Text style={styles.newButtonText}>Nuevo producto</Text>
          </Pressable>
        </View>

        {state.kind === 'loading' && <View style={styles.center}><ActivityIndicator /><Text style={styles.message}>Cargando productos…</Text></View>}
        {state.kind === 'error' && (
          <View style={styles.center}>
            <Text style={styles.message}>No se pudieron cargar los productos.</Text>
            <Pressable accessibilityRole="button" onPress={loadProducts} style={styles.retryButton}>
              <Text style={styles.retryText}>Reintentar</Text>
            </Pressable>
          </View>
        )}
        {state.kind === 'success' && (
          <FlatList
            data={state.products}
            keyExtractor={product => product.id}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <Pressable
                accessibilityRole="button"
                onPress={() => router.push({ pathname: '/products/[id]', params: { id: item.id } })}
                style={styles.productRow}>
                <Text style={styles.productName}>{item.name}</Text>
                {item.brand && <Text style={styles.productMeta}>{item.brand}</Text>}
                {item.barcode && <Text style={styles.productMeta}>Código: {item.barcode}</Text>}
              </Pressable>
            )}
            ListEmptyComponent={
              <View style={styles.center}>
                <Text style={styles.message}>No hay productos registrados.</Text>
                <Pressable accessibilityRole="button" onPress={() => router.push('/products/new')} style={styles.retryButton}>
                  <Text style={styles.retryText}>Agregar producto</Text>
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
  header: { marginBottom: 22 },
  title: { color: '#172E38', fontSize: 32, fontWeight: '700', marginBottom: 16 },
  newButton: { backgroundColor: '#0B5266', minHeight: 52, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center' },
  newButtonText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
  listContent: { flexGrow: 1, paddingBottom: 28 },
  productRow: { backgroundColor: '#FFFFFF', borderColor: '#D7E0E4', borderWidth: 1,
    borderRadius: 8, minHeight: 76, justifyContent: 'center', padding: 16, marginBottom: 12 },
  productName: { color: '#172E38', fontSize: 19, fontWeight: '700', marginBottom: 3 },
  productMeta: { color: '#52636D', fontSize: 15, lineHeight: 22 },
  center: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48 },
  message: { color: '#344B55', fontSize: 17, textAlign: 'center', lineHeight: 25, marginTop: 10 },
  retryButton: { minHeight: 48, justifyContent: 'center', paddingHorizontal: 20, marginTop: 12 },
  retryText: { color: '#0B5266', fontSize: 17, fontWeight: '700' },
});
