import type { LocationEntityType, LocationHistory, Pallet, PalletProduct, Product, ProductLocation, Warehouse } from '@/types/records';

export type ProductRow = {
  id: string; barcode: string | null; name: string; brand: string | null;
  category: string | null; image_path: string | null; notes: string | null;
  created_at: string; updated_at: string;
};
export type WarehouseRow = {
  id: string; name: string; description: string | null; map_image_path: string | null;
  created_at: string; updated_at: string;
};
export type PalletRow = {
  id: string; warehouse_id: string; name: string | null; map_x: number | null;
  map_y: number | null; reference: string | null; photo_path: string | null;
  notes: string | null; created_at: string; updated_at: string;
};
export type PalletProductRow = {
  id: string; pallet_id: string; product_id: string; created_at: string;
};
export type ProductLocationRow = {
  id: string; product_id: string; warehouse_id: string; map_x: number | null;
  map_y: number | null; reference: string | null; photo_path: string | null;
  created_at: string; updated_at: string;
};
export type LocationHistoryRow = {
  id: string; entity_type: LocationEntityType; entity_id: string; warehouse_id: string;
  map_x: number | null; map_y: number | null; reference: string | null;
  photo_path: string | null; created_at: string;
};

export function mapProductRow(row: ProductRow): Product {
  return { id: row.id, barcode: row.barcode, name: row.name, brand: row.brand,
    category: row.category, imagePath: row.image_path, notes: row.notes,
    createdAt: row.created_at, updatedAt: row.updated_at };
}
export function mapWarehouseRow(row: WarehouseRow): Warehouse {
  return { id: row.id, name: row.name, description: row.description,
    mapImagePath: row.map_image_path, createdAt: row.created_at, updatedAt: row.updated_at };
}
export function mapPalletRow(row: PalletRow): Pallet {
  return { id: row.id, warehouseId: row.warehouse_id, name: row.name,
    mapX: row.map_x, mapY: row.map_y, reference: row.reference,
    photoPath: row.photo_path, notes: row.notes, createdAt: row.created_at,
    updatedAt: row.updated_at };
}
export function mapPalletProductRow(row: PalletProductRow): PalletProduct {
  return { id: row.id, palletId: row.pallet_id, productId: row.product_id,
    createdAt: row.created_at };
}
export function mapProductLocationRow(row: ProductLocationRow): ProductLocation {
  return { id: row.id, productId: row.product_id, warehouseId: row.warehouse_id,
    mapX: row.map_x, mapY: row.map_y, reference: row.reference,
    photoPath: row.photo_path, createdAt: row.created_at, updatedAt: row.updated_at };
}
export function mapLocationHistoryRow(row: LocationHistoryRow): LocationHistory {
  return { id: row.id, entityType: row.entity_type, entityId: row.entity_id,
    warehouseId: row.warehouse_id, mapX: row.map_x, mapY: row.map_y,
    reference: row.reference, photoPath: row.photo_path, createdAt: row.created_at };
}
