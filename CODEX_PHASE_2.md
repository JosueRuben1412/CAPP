# CODEX TASK — CORONAPP FASE 2: Tipos TypeScript y repositorios

## Contexto

CORONAPP es una app móvil personal, offline-first y Android-first. Las Fases 0 y 1 ya están aprobadas.

Antes de modificar código, lee completos:

- `CORONAPP_SPEC_CODEX.md`
- `IMPLEMENTATION_PLAN.md`
- `CODEX_PHASE_1.md`

Esta tarea corresponde únicamente a:

> **FASE 2 — Tipos TypeScript y repositorios base**

No avances a la Fase 3.

---

## 1. Objetivo

Crear la capa tipada que separe el resto de la aplicación de SQLite.

Al terminar deben existir:

- tipos TypeScript para las 6 entidades;
- tipos de entrada para create/update;
- tipos de filas SQL en `snake_case`;
- mappers SQL row → modelo de dominio `camelCase`;
- repositorios que encapsulen SQLite;
- `ProductRepository` con CRUD + búsqueda;
- repositorios base para bodegas, tarimas, relaciones, ubicaciones e historial;
- consultas parametrizadas;
- manejo consistente de errores de persistencia;
- ninguna pantalla nueva.

---

## 2. Inspección inicial obligatoria

Antes de modificar:

1. `git status`
2. Lee todo `src/database/`.
3. Lee el esquema real de `001_initial_schema`.
4. Lee `package.json` y `tsconfig.json`.
5. Ejecuta:
   - `npm run lint`
   - `npm run typecheck`
   - `npx expo install --check`

Los repositorios deben coincidir exactamente con el esquema aprobado en Fase 1.

No modifiques `001_initial_schema.ts` salvo que exista un error real. No crees migración 002 sin necesidad clara.

---

## 3. Dependencias

No instales ninguna dependencia nueva.

No agregar:

- ORM
- Zod
- UUID libraries
- Redux
- Zustand
- TanStack Query
- date libraries
- validation libraries

Usa TypeScript y `expo-sqlite` ya instalados.

---

## 4. Tipos de dominio

Crea tipos/modelos TypeScript con propiedades `camelCase`.

### Product

```ts
type Product = {
  id: string;
  barcode: string | null;
  name: string;
  brand: string | null;
  category: string | null;
  imagePath: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};
```

### Warehouse

```ts
type Warehouse = {
  id: string;
  name: string;
  description: string | null;
  mapImagePath: string | null;
  createdAt: string;
  updatedAt: string;
};
```

### Pallet

```ts
type Pallet = {
  id: string;
  warehouseId: string;
  name: string | null;
  mapX: number | null;
  mapY: number | null;
  reference: string | null;
  photoPath: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};
```

### PalletProduct

```ts
type PalletProduct = {
  id: string;
  palletId: string;
  productId: string;
  createdAt: string;
};
```

### ProductLocation

```ts
type ProductLocation = {
  id: string;
  productId: string;
  warehouseId: string;
  mapX: number | null;
  mapY: number | null;
  reference: string | null;
  photoPath: string | null;
  createdAt: string;
  updatedAt: string;
};
```

### LocationHistory

```ts
type LocationEntityType = 'product' | 'pallet';

type LocationHistory = {
  id: string;
  entityType: LocationEntityType;
  entityId: string;
  warehouseId: string;
  mapX: number | null;
  mapY: number | null;
  reference: string | null;
  photoPath: string | null;
  createdAt: string;
};
```

---

## 5. Tipos de filas SQL y mappers

Los resultados directos de SQLite deben tener tipos internos explícitos en `snake_case`.

Ejemplo:

```ts
type ProductRow = {
  id: string;
  barcode: string | null;
  name: string;
  brand: string | null;
  category: string | null;
  image_path: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};
```

Implementa mappers explícitos, por ejemplo `mapProductRow(row): Product`.

No uses casts amplios como `as Product` para evitar el mapeo.

---

## 6. Tipos de entrada

Distingue entidad persistida de datos para crear/actualizar.

Crea tipos claros como:

```text
CreateProductRecord
UpdateProductRecord
```

### Regla

Los repositorios **NO generan IDs ni timestamps**.

Los métodos `create` reciben explícitamente `id`, `createdAt` y `updatedAt` cuando aplique.

Los updates parciales deben usar:

- `undefined` = campo no enviado;
- `null` = guardar ausencia explícita.

Ejemplo:

```ts
type UpdateProductRecord = {
  name?: string;
  barcode?: string | null;
  brand?: string | null;
  category?: string | null;
  imagePath?: string | null;
  notes?: string | null;
  updatedAt: string;
};
```

`updatedAt` es obligatorio en actualizaciones.

---

## 7. Repositorios

Crea `src/repositories/` e implementa:

- `ProductRepository`
- `WarehouseRepository`
- `PalletRepository`
- `PalletProductRepository`
- `ProductLocationRepository`
- `LocationHistoryRepository`

Preferencia: factory functions o clases pequeñas que reciban `SQLiteDatabase`.

Evita singletons globales ocultos.

No abras una nueva conexión por cada método.

---

## 8. Seguridad SQL

Toda entrada dinámica debe usar parámetros enlazados con APIs actuales de Expo SQLite, como:

```ts
db.runAsync(...)
db.getFirstAsync<T>(...)
db.getAllAsync<T>(...)
```

Prohibido:

```ts
`SELECT * FROM products WHERE name LIKE '%${query}%'`
```

Correcto conceptualmente:

```ts
db.getAllAsync(
  'SELECT ... WHERE name LIKE ?',
  `%${query}%`
);
```

No concatenes datos de usuario en SQL.

---

## 9. Contratos de retorno

Usa una convención consistente:

```text
getBy... → Entity | null
list...  → Entity[]
create   → Entity
update   → Entity | null
delete   → boolean
```

Puedes variar solo con justificación.

---

## 10. ProductRepository

Implementa:

```text
create
getById
getByBarcode
list
search
update
delete
```

### create

- Inserta sin reemplazar silenciosamente.
- No usar `INSERT OR REPLACE`.
- Barcode duplicado debe producir error controlable.

### getById

Retorna `Product | null`.

### getByBarcode

Retorna `Product | null`.

Define comportamiento simple para barcode vacío/null; evita consultas absurdas.

### list

Orden explícito:

```text
name ASC
```

Añade segundo criterio estable si es útil.

### search

Buscar parcialmente en:

- `name`
- `brand`
- `barcode`

Usa `LIKE`, parámetros enlazados y orden determinista.

No implementar FTS5.

Para query vacía/espacios, preferencia: reutilizar `list()`.

No es obligatorio escapar `%` y `_` como literales en esta versión; documenta el comportamiento.

### update

Actualización parcial:

- `id` requerido;
- campos omitidos no pasan a NULL;
- `null` explícito sí se guarda;
- `updatedAt` obligatorio;
- no modificar `createdAt` ni `id`;
- devolver producto actualizado o `null` si no existe.

Puedes construir el `SET` dinámicamente a partir de una lista fija de columnas permitidas. Los valores siempre van como parámetros enlazados.

### delete

Eliminar por ID y devolver `boolean` o equivalente consistente.

---

## 11. WarehouseRepository

Implementa como mínimo:

```text
create
getById
list
update
delete
```

- `list`: `name ASC`.
- updates parciales.
- respetar `ON DELETE RESTRICT`.
- no ocultar errores FK.

---

## 12. PalletRepository

Implementa:

```text
create
getById
listByWarehouse
update
delete
```

No crear todavía un caso de uso especial `movePallet` ni historial automático.

---

## 13. PalletProductRepository

Implementa:

```text
add
remove
listByPallet
listByProduct
exists
```

No es necesario hacer joins para devolver entidades completas todavía.

La unicidad `(pallet_id, product_id)` debe seguir siendo garantizada por SQLite.

---

## 14. ProductLocationRepository

Implementa:

```text
create
getByProductId
update
deleteByProductId
```

No crear historial automático ni casos de uso de movimiento.

---

## 15. LocationHistoryRepository

Implementa:

```text
create
listByEntity
```

`listByEntity(entityType, entityId)` debe ordenar por:

```text
created_at DESC
```

---

## 16. Errores de repositorio

Implementa un mecanismo pequeño y consistente para distinguir al menos:

```text
constraint
not_found
unknown
```

Puede ser una clase o estructura equivalente.

No construyas una jerarquía compleja.

No ocultes la causa original.

No dependas por toda la app de comparar strings de errores SQLite.

Si no puedes clasificar con seguridad, usa `unknown` preservando la causa.

---

## 17. No implementar todavía

No crear:

- hooks (`useProducts`, etc.);
- casos de uso;
- pantallas nuevas;
- formularios;
- navegación nueva;
- validación de UI;
- generación de IDs;
- generación automática de fechas;
- joins complejos agregados;
- FTS;
- paginación compleja.

`src/app/index.tsx` debe permanecer funcionalmente igual.

---

## 18. Orden explícito

No dependas del orden natural de SQLite.

Usa `ORDER BY` cuando importe.

Esperado:

```text
products → name ASC
warehouses → name ASC
location_history → created_at DESC
```

Para relaciones sin nombre visible usa un orden estable como `created_at ASC`.

---

## 19. TypeScript

Obligatorio:

```text
strict
sin any
sin @ts-ignore
sin casts amplios innecesarios
```

Los genéricos de `getFirstAsync<T>()` y `getAllAsync<T>()` deben usar tipos de fila correctos.

---

## 20. Pruebas funcionales de repositorios

No instales una librería de testing nueva solo para esta fase.

Verifica todo lo posible.

### ProductRepository

1. create
2. getById
3. getByBarcode
4. list
5. search por nombre
6. search por marca
7. search por barcode
8. update de un solo campo sin destruir otros
9. guardar `null` explícito
10. delete
11. confirmar ausencia posterior
12. barcode duplicado falla

### WarehouseRepository

1. create
2. getById
3. list
4. update
5. delete

### PalletRepository

1. create con warehouse válida
2. listByWarehouse
3. FK inválida falla
4. coordenadas inválidas fallan

### PalletProductRepository

1. add
2. exists
3. listByPallet
4. listByProduct
5. asociación duplicada falla
6. remove

### ProductLocationRepository

1. create
2. getByProductId
3. segunda ubicación para mismo producto falla
4. update
5. deleteByProductId

### LocationHistoryRepository

1. create varios registros
2. listByEntity
3. orden DESC correcto

No dejes datos de prueba permanentes.

---

## 21. Entorno de prueba

Si no hay Android/emulador disponible, puedes usar un adaptador temporal con SQLite real para verificar lógica, siempre que:

- no entre al producto final;
- reportes claramente qué fue prueba nativa y qué no;
- no falsifiques una verificación Expo.

Si Android/Expo Go está disponible, prefiere un smoke test real sin dejar UI de diagnóstico.

---

## 22. Verificaciones técnicas obligatorias

Ejecuta:

```bash
npm run lint
npm run typecheck
npx expo install --check
npx expo config --type public
```

Inicia Metro y confirma que arranca.

Si es posible, solicita/compila el bundle Android como smoke test.

---

## 23. Git

Antes de terminar:

```bash
git status
git diff
git diff --check
```

No hagas commit ni push.

El diff debe contener únicamente Fase 2.

---

## 24. Criterios de aceptación

La Fase 2 queda lista para revisión solo si:

1. existen los 6 tipos de dominio;
2. SQL rows y domain models están separados;
3. hay mappers explícitos;
4. existen los 6 repositorios;
5. ProductRepository tiene create/getById/getByBarcode/list/search/update/delete;
6. Warehouse tiene CRUD base;
7. Pallet tiene create/getById/listByWarehouse/update/delete;
8. PalletProduct tiene add/remove/listByPallet/listByProduct/exists;
9. ProductLocation tiene create/getByProductId/update/deleteByProductId;
10. LocationHistory tiene create/listByEntity;
11. todos los datos dinámicos usan parámetros enlazados;
12. no hay SQL en UI;
13. repositorios no generan IDs;
14. repositorios no generan timestamps;
15. updates distinguen `undefined` de `null`;
16. errores de constraints no se ocultan;
17. no hay dependencias nuevas;
18. no hay hooks;
19. no hay casos de uso;
20. no hay pantallas nuevas;
21. lint pasa;
22. typecheck pasa;
23. Expo dependency check pasa;
24. Metro inicia;
25. las verificaciones de persistencia pasan o las limitaciones quedan declaradas;
26. no se avanzó a Fase 3.

---

## 25. Respuesta final obligatoria

Responde con:

### Cambios realizados
Resumen técnico.

### Archivos creados/modificados
Lista exacta y propósito.

### Tipos de dominio
Lista de tipos creados.

### Repositorios
Para cada repositorio, métodos implementados.

### Seguridad SQL
Cómo confirmaste que toda entrada dinámica usa parámetros enlazados.

### Manejo de errores
Mecanismo implementado.

### Verificaciones funcionales
Cada operación de repositorio realmente probada y resultado.

### Verificaciones técnicas
Formato:

```text
comando → resultado
```

Incluye lint, typecheck, Expo check y Metro.

### Git diff
Resumen.

### Limitaciones
Qué no pudo comprobarse y por qué.

### Estado
Indica solo:

`FASE 2 LISTA PARA REVISIÓN FINAL`

o

`FASE 2 AÚN REQUIERE CORRECCIONES`

---

## 26. Detente

Después de completar esta tarea:

**NO avances a la Fase 3.**

No agregues navegación nueva.

No construyas formularios.

No crees hooks.

No implementes casos de uso.

Espera revisión.
