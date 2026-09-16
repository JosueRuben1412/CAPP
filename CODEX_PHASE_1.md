# CODEX TASK — CORONAPP FASE 1: Infraestructura SQLite y migraciones

## Contexto

Estás trabajando en **CORONAPP**, una aplicación móvil personal, offline-first y Android-first para registrar y localizar mercancía dentro de bodegas cuya distribución cambia constantemente.

Antes de modificar código, lee completos:

- `CORONAPP_SPEC_CODEX.md`
- `IMPLEMENTATION_PLAN.md`
- `CODEX_PHASE_0.md`

La Fase 0 ya fue completada y aprobada.

Esta tarea corresponde únicamente a:

> **FASE 1 — Infraestructura SQLite**

No avances a la Fase 2.

---

## 1. Objetivo

Introducir la infraestructura de persistencia local de CORONAPP usando `expo-sqlite`.

Al terminar esta fase debe existir:

- una base de datos SQLite local;
- inicialización centralizada;
- configuración apropiada;
- sistema de migraciones versionadas;
- esquema inicial completo;
- claves foráneas;
- índices;
- restricciones de integridad;
- integración mínima con el arranque de la aplicación;
- manejo claro de errores de inicialización;
- ninguna pantalla CRUD nueva;
- ningún repositorio de dominio todavía.

SQLite será la fuente de verdad local de CORONAPP.

---

## 2. Regla principal

Implementa **solo infraestructura de base de datos**.

No crear todavía lógica funcional de:

- creación/edición/búsqueda de productos;
- bodegas desde UI;
- tarimas desde UI;
- cámara;
- fotografías;
- mapas;
- escáner;
- historial visible;
- respaldo;
- GPS.

Las tablas sí deben existir porque pertenecen al esquema inicial.

---

## 3. Inspección inicial obligatoria

Antes de modificar archivos:

1. Ejecuta `git status`.
2. Confirma que la Fase 0 está limpia o identifica cambios existentes.
3. Lee `package.json`.
4. Lee `src/app/_layout.tsx`.
5. Lee `tsconfig.json`.
6. Confirma la versión instalada de Expo.
7. Ejecuta `npx expo install --check`.

No destruyas ni reescribas innecesariamente la estructura aprobada en Fase 0.

---

## 4. Dependencia permitida

Instala únicamente:

```text
expo-sqlite
```

Usa:

```bash
npx expo install expo-sqlite
```

o el equivalente correcto para el entorno.

No fijes manualmente una versión incompatible con la versión actual de Expo.

---

## 5. Dependencias prohibidas

No instalar:

- Drizzle ORM
- Prisma
- TypeORM
- WatermelonDB
- Realm
- Knex
- Redux
- Zustand
- TanStack Query
- Zod
- Supabase
- Firebase
- librerías externas de migraciones

La infraestructura debe construirse directamente sobre `expo-sqlite`.

---

## 6. API SQLite

Usa APIs asíncronas actuales de `expo-sqlite`.

Prefiere conceptos equivalentes a:

```ts
SQLiteProvider
openDatabaseAsync
execAsync
runAsync
getFirstAsync
getAllAsync
withTransactionAsync
```

No uses APIs legacy/deprecadas.

---

## 7. Nombre de base de datos

Usa:

```text
coronapp.db
```

Define el nombre en un único lugar.

---

## 8. Estructura sugerida

Crea una estructura simple en `src/database/`.

Ejemplo conceptual:

```text
src/
└── database/
    ├── constants.ts
    ├── migrations/
    │   ├── 001_initial_schema.ts
    │   └── index.ts
    ├── migrate.ts
    ├── initializeDatabase.ts
    └── DatabaseProvider.tsx
```

Puedes ajustar nombres si existe una razón clara.

No crear todavía repositorios ni servicios de dominio.

---

## 9. Migraciones

Implementa migraciones incrementales y versionadas.

Usa `PRAGMA user_version` como versión del esquema, salvo una razón técnica fuerte para usar otra estrategia.

Flujo esperado:

```text
version 0
↓
migration 1
↓
version 1
```

Requisitos:

- cada migración tiene una versión;
- se ejecutan en orden;
- una migración aplicada no se repite;
- si la DB ya está en la última versión, no se modifica;
- si una migración falla, no se marca como aplicada;
- no usar `DROP TABLE` destructivos en inicialización normal;
- no borrar automáticamente bases existentes.

---

## 10. Transacciones

Ejecuta cada migración de forma segura dentro de una transacción apropiada siempre que la API/plataforma lo permitan.

Actualiza `PRAGMA user_version` únicamente después de que la migración correspondiente termine correctamente.

---

## 11. Configuración SQLite

Durante inicialización:

```sql
PRAGMA foreign_keys = ON;
PRAGMA journal_mode = WAL;
```

No agregues más pragmas sin justificación.

---

## 12. Nombres SQL

Usa `snake_case`.

```text
Product          → products
Warehouse        → warehouses
Pallet           → pallets
PalletProduct    → pallet_products
ProductLocation  → product_locations
LocationHistory  → location_history
```

---

## 13. Tabla `products`

Columnas:

```text
id TEXT PRIMARY KEY NOT NULL
barcode TEXT NULL
name TEXT NOT NULL
brand TEXT NULL
category TEXT NULL
image_path TEXT NULL
notes TEXT NULL
created_at TEXT NOT NULL
updated_at TEXT NOT NULL
```

Crear índice único para `barcode`.

No usar IDs autoincrementales.

---

## 14. Tabla `warehouses`

Columnas:

```text
id TEXT PRIMARY KEY NOT NULL
name TEXT NOT NULL
description TEXT NULL
map_image_path TEXT NULL
created_at TEXT NOT NULL
updated_at TEXT NOT NULL
```

---

## 15. Tabla `pallets`

Columnas:

```text
id TEXT PRIMARY KEY NOT NULL
warehouse_id TEXT NOT NULL
name TEXT NULL
map_x REAL NULL
map_y REAL NULL
reference TEXT NULL
photo_path TEXT NULL
notes TEXT NULL
created_at TEXT NOT NULL
updated_at TEXT NOT NULL
```

FK:

```text
warehouse_id → warehouses.id
ON DELETE RESTRICT
ON UPDATE CASCADE
```

---

## 16. Restricción de coordenadas

Para `pallets`:

- `map_x` y `map_y` deben ser ambos NULL;
- o ambos deben estar entre `0.0` y `1.0`.

No aceptar X sin Y ni valores fuera de rango.

Implementa un `CHECK` equivalente.

---

## 17. Tabla `pallet_products`

Columnas:

```text
id TEXT PRIMARY KEY NOT NULL
pallet_id TEXT NOT NULL
product_id TEXT NOT NULL
created_at TEXT NOT NULL
```

FKs:

```text
pallet_id → pallets.id ON DELETE CASCADE ON UPDATE CASCADE
product_id → products.id ON DELETE CASCADE ON UPDATE CASCADE
```

Restricción:

```text
UNIQUE(pallet_id, product_id)
```

---

## 18. Tabla `product_locations`

Columnas:

```text
id TEXT PRIMARY KEY NOT NULL
product_id TEXT NOT NULL
warehouse_id TEXT NOT NULL
map_x REAL NULL
map_y REAL NULL
reference TEXT NULL
photo_path TEXT NULL
created_at TEXT NOT NULL
updated_at TEXT NOT NULL
```

FKs:

```text
product_id → products.id ON DELETE CASCADE ON UPDATE CASCADE
warehouse_id → warehouses.id ON DELETE RESTRICT ON UPDATE CASCADE
```

Reglas:

- máximo una ubicación directa actual por producto;
- `UNIQUE(product_id)`;
- misma restricción de coordenadas que `pallets`.

---

## 19. Tabla `location_history`

Columnas:

```text
id TEXT PRIMARY KEY NOT NULL
entity_type TEXT NOT NULL
entity_id TEXT NOT NULL
warehouse_id TEXT NOT NULL
map_x REAL NULL
map_y REAL NULL
reference TEXT NULL
photo_path TEXT NULL
created_at TEXT NOT NULL
```

Reglas:

```text
CHECK(entity_type IN ('product', 'pallet'))
```

`entity_id` no tendrá FK directa porque es una referencia polimórfica.

`warehouse_id`:

```text
→ warehouses.id
ON DELETE RESTRICT
ON UPDATE CASCADE
```

Aplicar misma restricción de coordenadas.

---

## 20. Índices mínimos

Crear índices útiles como mínimo para:

```text
products(name)
products(brand)
products(barcode) UNIQUE
pallets(warehouse_id)
pallet_products(pallet_id)
pallet_products(product_id)
UNIQUE(pallet_id, product_id)
product_locations(product_id) UNIQUE
product_locations(warehouse_id)
location_history(entity_type, entity_id, created_at)
location_history(warehouse_id)
```

Usa nombres explícitos como:

```text
idx_products_name
idx_pallets_warehouse_id
```

Evita índices redundantes si una restricción ya crea un índice equivalente.

---

## 21. Fechas

Guardar fechas como `TEXT`.

El formato esperado por capas futuras será ISO 8601.

No crear triggers automáticos de timestamps en esta fase.

---

## 22. IDs

Todos los IDs de dominio son `TEXT`.

No usar:

```text
INTEGER PRIMARY KEY AUTOINCREMENT
```

La generación de IDs llegará en una fase posterior.

---

## 23. Integración con Expo Router

Integra la DB en el nivel raíz apropiado.

La solución debe garantizar:

1. apertura de `coronapp.db`;
2. configuración SQLite;
3. ejecución de migraciones;
4. app disponible solo después de inicialización correcta.

Puedes usar `SQLiteProvider` y su mecanismo de inicialización.

No ejecutes SQL directamente desde pantallas.

No cambies navegación salvo lo mínimo para integrar la DB.

---

## 24. Manejo de errores

No ignores errores de apertura o migración.

Si la DB no puede inicializarse:

- registra un error útil para desarrollo;
- no finjas una inicialización correcta.

Mantén esto simple. No agregues telemetría.

---

## 25. Pantalla principal

Mantén la pantalla de Fase 0 esencialmente igual.

No agregar:

- listados;
- formularios;
- botones CRUD;
- datos técnicos permanentes de SQLite.

Si agregas diagnósticos temporales, elimínalos antes de terminar.

---

## 26. Código SQL

Las sentencias de esquema controladas por el proyecto pueden usar `execAsync`.

No concatenes datos de usuario en SQL.

Para datos dinámicos futuros se usarán parámetros enlazados.

---

## 27. Primera migración

Debe existir conceptualmente:

```text
001_initial_schema
```

Crea las seis tablas y sus índices/restricciones.

Después de éxito:

```text
PRAGMA user_version = 1
```

No crear más migraciones en esta fase.

---

## 28. Idempotencia

Verifica:

```text
primer arranque
→ crea esquema
→ user_version = 1

segundo arranque
→ detecta version 1
→ no repite migración
→ inicia normalmente
```

No uses lógica destructiva.

---

## 29. Verificación de esquema

Verifica que existan:

```text
products
warehouses
pallets
pallet_products
product_locations
location_history
```

Verifica también:

```text
PRAGMA user_version = 1
PRAGMA foreign_keys = 1
```

y los índices importantes.

No dejes logs excesivos permanentes.

---

## 30. Sin datos seed

No insertar productos, bodegas, tarimas ni ubicaciones demo.

---

## 31. No crear repositorios

La Fase 2 será responsable de repositorios y tipos de dominio.

NO crear:

```text
ProductRepository
WarehouseRepository
PalletRepository
```

---

## 32. Tipos

Puedes crear tipos técnicos necesarios para migraciones/configuración/PRAGMA.

No crear todavía todos los modelos de dominio TypeScript.

---

## 33. Compatibilidad

Prioridad:

```text
Android
```

No rompas iOS innecesariamente.

Web no es prioridad funcional para SQLite. No agregues complejidad especial para SQLite web.

---

## 34. Verificaciones obligatorias

Al finalizar ejecuta:

```bash
npm run lint
npm run typecheck
npx expo install --check
npx expo config --type public
```

Inicia Metro.

Si el entorno permite Android/Expo Go, verifica la inicialización real de SQLite.

Si no hay dispositivo/emulador, decláralo como limitación.

---

## 35. Verificación específica de SQLite

Comprueba todo lo posible de:

1. `coronapp.db` abre.
2. migración 001 se ejecuta.
3. `user_version = 1`.
4. existen las seis tablas.
5. `foreign_keys = ON`.
6. existen índices.
7. segunda inicialización no repite migración.
8. no existen datos seed.

No marques como comprobado algo que no ejecutaste realmente.

---

## 36. Pruebas temporales de integridad

Si el entorno lo permite sin ensuciar el producto final, comprueba:

- FK inválida falla;
- coordenadas fuera de 0..1 fallan;
- X sin Y falla;
- duplicar `(pallet_id, product_id)` falla;
- duplicar barcode no NULL falla;
- duplicar `product_locations.product_id` falla.

No dejes datos de prueba.

No instales librerías de testing solo para esto.

---

## 37. Git

Antes de terminar:

```bash
git status
git diff
git diff --check
```

No hagas commit ni push automáticamente.

---

## 38. Criterios de aceptación

La fase queda lista para revisión si:

1. `expo-sqlite` está instalado compatible.
2. existe `coronapp.db`.
3. existe inicialización centralizada.
4. `foreign_keys = ON`.
5. WAL está habilitado cuando corresponde.
6. hay migraciones versionadas.
7. `001_initial_schema` crea seis tablas.
8. `user_version = 1`.
9. FKs correctas.
10. checks de coordenadas.
11. barcode único cuando existe.
12. `(pallet_id, product_id)` único.
13. `product_locations.product_id` único.
14. índices necesarios.
15. sin datos demo.
16. sin repositorios CRUD.
17. sin pantallas nuevas.
18. lint pasa.
19. typecheck pasa.
20. Expo dependency check pasa.
21. Metro inicia.
22. no se avanzó a Fase 2.

---

## 39. Respuesta final obligatoria

Responde con:

### Cambios realizados
Resumen técnico.

### Archivos creados/modificados
Lista exacta y propósito.

### Dependencias
Qué se instaló y versión resuelta.

### Esquema creado
Tablas, FKs, restricciones e índices.

### Migraciones
Mecanismo de versionado, versión inicial y comportamiento del segundo arranque.

### Verificaciones
Cada comando/comprobación con resultado.

### Verificación SQLite
Marca únicamente lo realmente comprobado:
- DB abre
- user_version = 1
- 6 tablas existen
- foreign_keys = ON
- índices existen
- segunda inicialización es idempotente
- restricciones funcionan

### Git diff
Resumen.

### Limitaciones
Qué no pudo comprobarse y por qué.

### Estado
Indica solo:

`FASE 1 LISTA PARA REVISIÓN FINAL`

o

`FASE 1 AÚN REQUIERE CORRECCIONES`

---

## 40. Detente

Después de completar esta tarea:

**NO avances a Fase 2.**

No implementes repositorios.

No implementes CRUD.

No agregues pantallas.

Espera revisión.
