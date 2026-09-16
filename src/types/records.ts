export type Product = {
  id: string; barcode: string | null; name: string; brand: string | null;
  category: string | null; imagePath: string | null; notes: string | null;
  createdAt: string; updatedAt: string;
};
export type Warehouse = {
  id: string; name: string; description: string | null; mapImagePath: string | null;
  createdAt: string; updatedAt: string;
};
export type Pallet = {
  id: string; warehouseId: string; name: string | null; mapX: number | null;
  mapY: number | null; reference: string | null; photoPath: string | null;
  notes: string | null; createdAt: string; updatedAt: string;
};
export type PalletProduct = {
  id: string; palletId: string; productId: string; createdAt: string;
};
export type ProductLocation = {
  id: string; productId: string; warehouseId: string; mapX: number | null;
  mapY: number | null; reference: string | null; photoPath: string | null;
  createdAt: string; updatedAt: string;
};
export type LocationEntityType = 'product' | 'pallet';
export type LocationHistory = {
  id: string; entityType: LocationEntityType; entityId: string; warehouseId: string;
  mapX: number | null; mapY: number | null; reference: string | null;
  photoPath: string | null; createdAt: string;
};

export type CreateProductRecord = Product;
export type UpdateProductRecord = Partial<Pick<Product, 'barcode' | 'name' | 'brand' | 'category' | 'imagePath' | 'notes'>> & Pick<Product, 'updatedAt'>;
export type CreateWarehouseRecord = Warehouse;
export type UpdateWarehouseRecord = Partial<Pick<Warehouse, 'name' | 'description' | 'mapImagePath'>> & Pick<Warehouse, 'updatedAt'>;
export type CreatePalletRecord = Pallet;
export type UpdatePalletRecord = Partial<Pick<Pallet, 'warehouseId' | 'name' | 'mapX' | 'mapY' | 'reference' | 'photoPath' | 'notes'>> & Pick<Pallet, 'updatedAt'>;
export type CreatePalletProductRecord = PalletProduct;
export type CreateProductLocationRecord = ProductLocation;
export type UpdateProductLocationRecord = Partial<Pick<ProductLocation, 'warehouseId' | 'mapX' | 'mapY' | 'reference' | 'photoPath'>> & Pick<ProductLocation, 'updatedAt'>;
export type CreateLocationHistoryRecord = LocationHistory;
