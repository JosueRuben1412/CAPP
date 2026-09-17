import type { Warehouse } from '@/types/records';

export type WarehouseDraft = { name: string; description: string };
export type WarehouseFields = Pick<Warehouse, 'name' | 'description'>;

export const emptyWarehouseDraft: WarehouseDraft = { name: '', description: '' };

export function warehouseToDraft(warehouse: Warehouse): WarehouseDraft {
  return { name: warehouse.name, description: warehouse.description ?? '' };
}

export function normalizeWarehouseDraft(draft: WarehouseDraft): WarehouseFields | null {
  const name = draft.name.trim();
  if (!name) return null;
  return { name, description: draft.description.trim() || null };
}

export function warehouseRouteId(value: string | string[] | undefined): string | null {
  if (typeof value === 'string') return value.trim() || null;
  if (Array.isArray(value) && value.length === 1) return value[0].trim() || null;
  return null;
}
