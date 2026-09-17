import { useCallback, useEffect, useRef, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { CameraView, useCameraPermissions, type BarcodeScanningResult, type BarcodeType } from 'expo-camera';
import { ActivityIndicator, AppState, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { normalizeScannedBarcode } from '@/features/scanner/barcode';
import { useProductRepository } from '@/features/products/useProductRepository';

const BARCODE_TYPES: BarcodeType[] = [
  'ean13', 'ean8', 'upc_a', 'upc_e', 'code128', 'code39', 'code93', 'itf14', 'codabar',
];

export default function ScannerScreen() {
  const router = useRouter();
  const repository = useProductRepository();
  const [permission, requestPermission] = useCameraPermissions();
  const [focused, setFocused] = useState(false);
  const [appActive, setAppActive] = useState(AppState.currentState === 'active');
  const [processing, setProcessing] = useState(false);
  const [askingPermission, setAskingPermission] = useState(false);
  const [lookupError, setLookupError] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [permissionError, setPermissionError] = useState(false);
  const activeRef = useRef(false);
  const processingRef = useRef(false);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => setAppActive(state === 'active'));
    return () => subscription.remove();
  }, []);

  useFocusEffect(useCallback(() => {
    activeRef.current = true;
    processingRef.current = false;
    setFocused(true);
    setProcessing(false);
    setLookupError(false);
    setCameraError(false);
    setPermissionError(false);
    return () => {
      activeRef.current = false;
      processingRef.current = true;
      setFocused(false);
    };
  }, []));

  async function askPermission() {
    setPermissionError(false);
    setAskingPermission(true);
    try {
      await requestPermission();
    } catch (error) {
      console.error('No se pudo solicitar permiso de cámara.', error);
      if (activeRef.current) setPermissionError(true);
    } finally {
      if (activeRef.current) setAskingPermission(false);
    }
  }

  async function scan({ data }: BarcodeScanningResult) {
    const barcode = normalizeScannedBarcode(data);
    if (!barcode || !activeRef.current || !appActive || processingRef.current) return;
    processingRef.current = true;
    setProcessing(true);
    setLookupError(false);

    let product;
    try {
      product = await repository.getByBarcode(barcode);
    } catch (error) {
      console.error('No se pudo consultar el código de barras.', error);
      if (activeRef.current) {
        processingRef.current = false;
        setProcessing(false);
        setLookupError(true);
      }
      return;
    }
    if (!activeRef.current) return;
    if (product) {
      router.push({ pathname: '/products/[id]', params: { id: product.id } });
    } else {
      router.push({ pathname: '/products/new', params: { barcode } });
    }
  }

  function retry() {
    processingRef.current = false;
    setProcessing(false);
    setLookupError(false);
    setCameraError(false);
  }

  const showCamera = focused && appActive && permission?.granted && !processing && !lookupError && !cameraError;

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.safeArea}>
      <View style={styles.content}>
        <Text accessibilityRole="header" style={styles.title}>Escáner</Text>
        <Text style={styles.description}>Apunta al código de barras del producto.</Text>

        {permission === null && (
          <View style={styles.status}><ActivityIndicator /><Text style={styles.statusText}>Comprobando permiso de cámara…</Text></View>
        )}
        {permission && !permission.granted && (
          <View style={styles.status}>
            <Text style={styles.statusText}>
              {permission.canAskAgain
                ? 'CORONAPP necesita acceso a la cámara para escanear códigos de barras.'
                : 'El acceso a la cámara está desactivado. Actívalo desde los ajustes del sistema.'}
            </Text>
            {permissionError && <Text accessibilityRole="alert" style={styles.error}>No se pudo solicitar el permiso de cámara.</Text>}
            {permission.canAskAgain && (
              <Pressable accessibilityRole="button" disabled={askingPermission} onPress={() => { void askPermission(); }} style={styles.button}>
                <Text style={styles.buttonText}>Permitir cámara</Text>
              </Pressable>
            )}
          </View>
        )}

        {permission?.granted && (
          <View style={styles.previewArea}>
            {showCamera && (
              <View style={styles.cameraContainer}>
                <CameraView
                  style={styles.camera}
                  facing="back"
                  barcodeScannerSettings={{ barcodeTypes: BARCODE_TYPES }}
                  onBarcodeScanned={event => { void scan(event); }}
                  onMountError={error => {
                    console.error('No se pudo iniciar la cámara.', error);
                    if (activeRef.current) setCameraError(true);
                  }}
                />
                <View pointerEvents="none" style={styles.scanFrame} />
              </View>
            )}
            {processing && <View style={styles.status}><ActivityIndicator /><Text style={styles.statusText}>Buscando producto…</Text></View>}
            {(lookupError || cameraError) && (
              <View style={styles.status}>
                <Text accessibilityRole="alert" style={styles.error}>
                  {lookupError ? 'No se pudo consultar el producto.' : 'No se pudo iniciar la cámara.'}
                </Text>
                <Pressable accessibilityRole="button" onPress={retry} style={styles.button}>
                  <Text style={styles.buttonText}>Reintentar</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F7F8' },
  content: { flex: 1, paddingHorizontal: 24, paddingTop: 28, paddingBottom: 20 },
  title: { color: '#172E38', fontSize: 32, fontWeight: '700', marginBottom: 12 },
  description: { color: '#344B55', fontSize: 18, lineHeight: 26, marginBottom: 22 },
  previewArea: { flex: 1, minHeight: 260 },
  cameraContainer: { flex: 1, borderRadius: 12, overflow: 'hidden', backgroundColor: '#172E38' },
  camera: { flex: 1 },
  scanFrame: { position: 'absolute', left: '12%', right: '12%', top: '30%', bottom: '30%',
    borderColor: '#FFFFFF', borderWidth: 3, borderRadius: 12 },
  status: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  statusText: { color: '#344B55', fontSize: 17, lineHeight: 25, textAlign: 'center', marginTop: 12 },
  error: { color: '#A52F2F', fontSize: 17, lineHeight: 25, textAlign: 'center', marginBottom: 16 },
  button: { backgroundColor: '#0B5266', minHeight: 54, borderRadius: 8, paddingHorizontal: 24,
    justifyContent: 'center', alignItems: 'center', marginTop: 20 },
  buttonText: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
});
