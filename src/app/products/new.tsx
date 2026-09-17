import { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { ProductForm } from '@/features/products/ProductForm';
import { ProductPage } from '@/features/products/ProductPage';
import { createProduct, productSaveErrorMessage } from '@/features/products/productActions';
import { emptyProductDraft, type ProductFields } from '@/features/products/productFields';
import { useProductRepository } from '@/features/products/useProductRepository';
import { barcodeFromParam } from '@/features/scanner/barcode';

export default function NewProductScreen() {
  const router = useRouter();
  const { barcode: barcodeParam } = useLocalSearchParams<{ barcode?: string | string[] }>();
  const initialBarcode = barcodeFromParam(barcodeParam);
  const repository = useProductRepository();
  const [submitting, setSubmitting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function save(fields: ProductFields) {
    setSubmitting(true);
    setSaveError(null);
    try {
      const product = await createProduct(repository, fields);
      router.replace({ pathname: '/products/[id]', params: { id: product.id } });
    } catch (error) {
      setSaveError(await productSaveErrorMessage(error, repository, fields.barcode));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ProductPage title="Nuevo producto">
      <ProductForm
        key={initialBarcode}
        initialValues={{ ...emptyProductDraft, barcode: initialBarcode }}
        actionLabel="Guardar producto"
        submitting={submitting}
        saveError={saveError}
        onChange={() => setSaveError(null)}
        onSubmit={save}
      />
    </ProductPage>
  );
}
