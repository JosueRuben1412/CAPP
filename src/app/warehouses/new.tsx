import { useState } from 'react';
import { useRouter } from 'expo-router';

import { WarehouseForm } from '@/features/warehouses/WarehouseForm';
import { WarehousePage } from '@/features/warehouses/WarehousePage';
import { createWarehouse } from '@/features/warehouses/warehouseActions';
import { emptyWarehouseDraft, type WarehouseFields } from '@/features/warehouses/warehouseFields';
import { useWarehouseRepository } from '@/features/warehouses/useWarehouseRepository';

export default function NewWarehouseScreen() {
  const router = useRouter();
  const repository = useWarehouseRepository();
  const [submitting, setSubmitting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function save(fields: WarehouseFields) {
    setSubmitting(true);
    setSaveError(null);
    try {
      const warehouse = await createWarehouse(repository, fields);
      router.replace({ pathname: '/warehouses/[id]', params: { id: warehouse.id } });
    } catch (error) {
      console.error('No se pudo guardar la bodega.', error);
      setSaveError('No se pudo guardar la bodega. Inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <WarehousePage title="Nueva bodega">
      <WarehouseForm
        initialValues={emptyWarehouseDraft}
        actionLabel="Guardar bodega"
        submitting={submitting}
        saveError={saveError}
        onChange={() => setSaveError(null)}
        onSubmit={save}
      />
    </WarehousePage>
  );
}
