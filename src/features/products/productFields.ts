import type { Product } from '@/types/records';

export type ProductDraft = {
  name: string;
  barcode: string;
  brand: string;
  category: string;
  notes: string;
};

export type ProductFields = Pick<Product, 'name' | 'barcode' | 'brand' | 'category' | 'notes'>;

export const emptyProductDraft: ProductDraft = {
  name: '', barcode: '', brand: '', category: '', notes: '',
};

export function productToDraft(product: Product): ProductDraft {
  return {
    name: product.name,
    barcode: product.barcode ?? '',
    brand: product.brand ?? '',
    category: product.category ?? '',
    notes: product.notes ?? '',
  };
}

export function normalizeProductDraft(draft: ProductDraft): ProductFields | null {
  const name = draft.name.trim();
  if (!name) return null;
  const optional = (value: string) => value.trim() || null;
  return {
    name,
    barcode: optional(draft.barcode),
    brand: optional(draft.brand),
    category: optional(draft.category),
    notes: optional(draft.notes),
  };
}

export function productRouteId(value: string | string[] | undefined): string | null {
  if (typeof value === 'string') return value.trim() || null;
  if (Array.isArray(value) && value.length === 1) return value[0].trim() || null;
  return null;
}
