export const initialSchema = `
CREATE TABLE products (
  id TEXT PRIMARY KEY NOT NULL,
  barcode TEXT,
  name TEXT NOT NULL,
  brand TEXT,
  category TEXT,
  image_path TEXT,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE UNIQUE INDEX idx_products_barcode ON products(barcode);
CREATE INDEX idx_products_name ON products(name);
CREATE INDEX idx_products_brand ON products(brand);

CREATE TABLE warehouses (
  id TEXT PRIMARY KEY NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  map_image_path TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE pallets (
  id TEXT PRIMARY KEY NOT NULL,
  warehouse_id TEXT NOT NULL REFERENCES warehouses(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  name TEXT,
  map_x REAL,
  map_y REAL,
  reference TEXT,
  photo_path TEXT,
  notes TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  CHECK ((map_x IS NULL AND map_y IS NULL) OR
    (map_x IS NOT NULL AND map_y IS NOT NULL AND map_x BETWEEN 0 AND 1 AND map_y BETWEEN 0 AND 1))
);
CREATE INDEX idx_pallets_warehouse_id ON pallets(warehouse_id);

CREATE TABLE pallet_products (
  id TEXT PRIMARY KEY NOT NULL,
  pallet_id TEXT NOT NULL REFERENCES pallets(id) ON DELETE CASCADE ON UPDATE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE,
  created_at TEXT NOT NULL
);
-- El índice compuesto también cubre búsquedas por pallet_id.
CREATE UNIQUE INDEX idx_pallet_products_pallet_product ON pallet_products(pallet_id, product_id);
CREATE INDEX idx_pallet_products_product_id ON pallet_products(product_id);

CREATE TABLE product_locations (
  id TEXT PRIMARY KEY NOT NULL,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE ON UPDATE CASCADE,
  warehouse_id TEXT NOT NULL REFERENCES warehouses(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  map_x REAL,
  map_y REAL,
  reference TEXT,
  photo_path TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  CHECK ((map_x IS NULL AND map_y IS NULL) OR
    (map_x IS NOT NULL AND map_y IS NOT NULL AND map_x BETWEEN 0 AND 1 AND map_y BETWEEN 0 AND 1))
);
CREATE UNIQUE INDEX idx_product_locations_product_id ON product_locations(product_id);
CREATE INDEX idx_product_locations_warehouse_id ON product_locations(warehouse_id);

CREATE TABLE location_history (
  id TEXT PRIMARY KEY NOT NULL,
  entity_type TEXT NOT NULL CHECK (entity_type IN ('product', 'pallet')),
  entity_id TEXT NOT NULL,
  warehouse_id TEXT NOT NULL REFERENCES warehouses(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  map_x REAL,
  map_y REAL,
  reference TEXT,
  photo_path TEXT,
  created_at TEXT NOT NULL,
  CHECK ((map_x IS NULL AND map_y IS NULL) OR
    (map_x IS NOT NULL AND map_y IS NOT NULL AND map_x BETWEEN 0 AND 1 AND map_y BETWEEN 0 AND 1))
);
CREATE INDEX idx_location_history_entity_created_at ON location_history(entity_type, entity_id, created_at);
CREATE INDEX idx_location_history_warehouse_id ON location_history(warehouse_id);
`;
