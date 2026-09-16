import * as Crypto from 'expo-crypto';

import { RepositoryError } from '@/repositories/errors';
import type { ProductRepository } from '@/repositories/ProductRepository';
import type { Product } from '@/types/records';
import type { ProductFields } from './productFields';

export async function createProduct(repository: ProductRepository, fields: ProductFields): Promise<Product> {
  const now = new Date().toISOString();
  return repository.create({
    id: Crypto.randomUUID(),
    ...fields,
    imagePath: null,
    createdAt: now,
    updatedAt: now,
  });
}

export async function updateProduct(repository: ProductRepository, id: string, fields: ProductFields): Promise<Product | null> {
  return repository.update(id, { ...fields, updatedAt: new Date().toISOString() });
}

export async function productSaveErrorMessage(
  error: unknown, repository: ProductRepository, barcode: string | null, currentId?: string,
): Promise<string> {
  if (error instanceof RepositoryError && error.kind === 'constraint' && barcode) {
    try {
      const existing = await repository.getByBarcode(barcode);
      if (existing && existing.id !== currentId) {
        return 'Ya existe un producto con ese código de barras.';
      }
    } catch (lookupError) {
      console.error('No se pudo verificar el código de barras duplicado.', lookupError);
    }
  }
  console.error('No se pudo guardar el producto.', error);
  return 'No se pudo guardar el producto. Inténtalo de nuevo.';
}
