import { useRouter } from 'expo-router';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useProductSearch } from '@/features/products/useProductSearch';

export default function ProductsScreen() {
  const router = useRouter();
  const { query, normalizedQuery, state, changeQuery, clearQuery, retry } = useProductSearch();

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text accessibilityRole="header" style={styles.title}>Productos</Text>
          <Text style={styles.searchLabel}>Buscar productos</Text>
          <View style={styles.searchRow}>
            <TextInput
              accessibilityLabel="Buscar por nombre, marca o código"
              placeholder="Buscar por nombre, marca o código"
              placeholderTextColor="#627681"
              value={query}
              onChangeText={changeQuery}
              style={styles.searchInput}
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="search"
            />
            {query.length > 0 && (
              <Pressable accessibilityRole="button" accessibilityLabel="Limpiar búsqueda" onPress={clearQuery} style={styles.clearButton}>
                <Text style={styles.clearText}>Limpiar</Text>
              </Pressable>
            )}
          </View>
          <Pressable accessibilityRole="button" onPress={() => router.push('/products/new')} style={styles.newButton}>
            <Text style={styles.newButtonText}>Nuevo producto</Text>
          </Pressable>
        </View>

        {state.kind === 'loading' && <View style={styles.center}><ActivityIndicator /><Text style={styles.message}>Cargando productos…</Text></View>}
        {state.kind === 'error' && (
          <View style={styles.center}>
            <Text style={styles.message}>{normalizedQuery ? 'No se pudo realizar la búsqueda.' : 'No se pudieron cargar los productos.'}</Text>
            <Pressable accessibilityRole="button" onPress={retry} style={styles.retryButton}>
              <Text style={styles.retryText}>Reintentar</Text>
            </Pressable>
          </View>
        )}
        {state.kind === 'success' && (
          <View style={styles.results}>
            {state.searching && <Text style={styles.searchingText}>Actualizando resultados…</Text>}
            <FlatList
              data={state.products}
              keyExtractor={product => product.id}
              contentContainerStyle={styles.listContent}
              keyboardShouldPersistTaps="handled"
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
                  {state.searching ? (
                    <Text style={styles.message}>Buscando productos…</Text>
                  ) : normalizedQuery ? (
                    <>
                      <Text style={styles.message}>No encontramos productos para “{normalizedQuery}”.</Text>
                      <Text style={styles.hint}>Prueba con otro nombre, marca o código.</Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.message}>No hay productos registrados.</Text>
                      <Pressable accessibilityRole="button" onPress={() => router.push('/products/new')} style={styles.retryButton}>
                        <Text style={styles.retryText}>Agregar producto</Text>
                      </Pressable>
                    </>
                  )}
                </View>
              }
            />
          </View>
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
  searchLabel: { color: '#213B46', fontSize: 16, fontWeight: '600', marginBottom: 8 },
  searchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  searchInput: { flex: 1, backgroundColor: '#FFFFFF', borderColor: '#B8C8CF', borderWidth: 1,
    borderRadius: 8, color: '#172E38', fontSize: 17, minHeight: 52,
    paddingHorizontal: 14, paddingVertical: 10 },
  clearButton: { minHeight: 48, justifyContent: 'center', paddingHorizontal: 12, marginLeft: 4 },
  clearText: { color: '#0B5266', fontSize: 16, fontWeight: '700' },
  newButton: { backgroundColor: '#0B5266', minHeight: 52, borderRadius: 8,
    alignItems: 'center', justifyContent: 'center' },
  newButtonText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
  listContent: { flexGrow: 1, paddingBottom: 28 },
  results: { flex: 1 },
  searchingText: { color: '#52636D', fontSize: 14, marginBottom: 8 },
  productRow: { backgroundColor: '#FFFFFF', borderColor: '#D7E0E4', borderWidth: 1,
    borderRadius: 8, minHeight: 76, justifyContent: 'center', padding: 16, marginBottom: 12 },
  productName: { color: '#172E38', fontSize: 19, fontWeight: '700', marginBottom: 3 },
  productMeta: { color: '#52636D', fontSize: 15, lineHeight: 22 },
  center: { alignItems: 'center', justifyContent: 'center', paddingVertical: 48 },
  message: { color: '#344B55', fontSize: 17, textAlign: 'center', lineHeight: 25, marginTop: 10 },
  hint: { color: '#52636D', fontSize: 15, lineHeight: 22, textAlign: 'center', marginTop: 8 },
  retryButton: { minHeight: 48, justifyContent: 'center', paddingHorizontal: 20, marginTop: 12 },
  retryText: { color: '#0B5266', fontSize: 17, fontWeight: '700' },
});
