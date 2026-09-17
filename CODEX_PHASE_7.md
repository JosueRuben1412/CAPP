# CODEX TASK — CORONAPP FASE 7: CRUD de bodegas

## Contexto

Estás trabajando en **CORONAPP**, una aplicación móvil personal, offline-first y Android-first para localizar mercancía dentro de bodegas dinámicas.

Las Fases 0 a 6 ya fueron completadas y aprobadas.

Antes de modificar código, lee completos:

- `CORONAPP_SPEC_CODEX.md`
- `IMPLEMENTATION_PLAN.md`
- `CODEX_PHASE_6.md`

Esta tarea corresponde únicamente a:

> **FASE 7 — CRUD de bodegas**

No avances a la Fase 8.

---

## 1. Objetivo

Convertir la sección Bodegas en un flujo funcional completo.

Al finalizar el usuario debe poder:

1. ver bodegas registradas;
2. crear una bodega;
3. abrir su detalle;
4. editarla;
5. eliminarla con confirmación;
6. manejar correctamente el caso en que una bodega tenga datos relacionados;
7. cerrar y reabrir la app y conservar los datos.

Todavía NO se implementará el mapa visual de bodega.

---

## 2. Alcance estricto

Implementa únicamente CRUD visual de `Warehouse`.

Usa:

```text
WarehouseRepository
↓
SQLite
```

No hacer SQL directo desde UI.

No modificar esquema salvo bug real bloqueante.

---

## 3. Inspección inicial obligatoria

Antes de modificar:

1. Ejecuta `git status`.
2. Confirma que Fase 6 esté limpia o identifica cambios pendientes.
3. Lee:
   - `src/app/(tabs)/warehouses.tsx`
   - `src/repositories/WarehouseRepository.ts`
   - `src/features/products/useProductRepository.ts` como referencia de patrón
   - `src/app/_layout.tsx`
   - `src/types/records.ts`
4. Revisa cómo se resolvió CRUD de productos para mantener consistencia visual y de arquitectura.
5. Ejecuta:
   - `npm run lint`
   - `npm run typecheck`
   - `npx expo install --check`

---

## 4. Dependencias

No instalar ninguna dependencia nueva.

Usa lo existente.

No agregar:

- formularios externos;
- validadores;
- estado global;
- UI kits;
- mapas;
- image picker;
- cámara.

---

## 5. Rutas

Mantén la tab:

```text
/(tabs)/warehouses
```

Agrega rutas equivalentes a:

```text
/warehouses/new
/warehouses/[id]
/warehouses/[id]/edit
```

Estructura sugerida:

```text
src/app/
├── (tabs)/
│   └── warehouses.tsx
└── warehouses/
    ├── new.tsx
    └── [id]/
        ├── index.tsx
        └── edit.tsx
```

---

## 6. Navegación

Desde lista:

```text
Nueva bodega → /warehouses/new
Bodega → /warehouses/[id]
```

Desde detalle:

```text
Editar → /warehouses/[id]/edit
```

Después de crear:

```text
ir al detalle
```

Después de editar:

```text
volver al detalle actualizado
```

Después de eliminar:

```text
volver a Bodegas
```

---

## 7. Acceso al repositorio

Crea un patrón equivalente a productos.

Puede existir:

```text
useWarehouseRepository
```

si ayuda a evitar duplicación.

Debe obtener la DB existente del provider.

No SQL en hooks.

No singletons nuevos.

---

## 8. Lista de bodegas

Reemplaza placeholder.

Debe mostrar:

```text
Bodegas
[ Nueva bodega ]
```

Estados:

```text
loading
success
empty
error
```

Empty state:

```text
No hay bodegas registradas.
```

Con acción clara:

```text
Agregar bodega
```

---

## 9. Elemento de lista

Mostrar como mínimo:

```text
nombre
descripción si existe
```

No mostrar:

```text
Descripción: null
```

Todo el elemento debe ser tocable.

Usa `FlatList`.

---

## 10. Refresh al foco

La lista debe recargarse al recuperar foco.

Esto permite reflejar:

- creación;
- edición;
- eliminación.

SQLite sigue siendo fuente de verdad.

---

## 11. Crear bodega

Ruta:

```text
/warehouses/new
```

Campos:

```text
Nombre *
Descripción
```

Todavía NO:

```text
mapa
imagen
foto
coordenadas
```

`mapImagePath` debe guardarse como:

```text
null
```

---

## 12. Formulario reusable

Crea algo como:

```text
WarehouseForm
```

Reutilizable para creación y edición.

No duplicar formularios.

No construir framework genérico.

---

## 13. Normalización

Antes de guardar:

```text
name → trim()
description → trim() o null
```

No permitir nombre vacío.

---

## 14. Validación

Si `name.trim()` queda vacío:

mostrar:

```text
El nombre es obligatorio.
```

No llamar repositorio.

---

## 15. IDs

Usa la misma estrategia de Fase 4:

```ts
Crypto.randomUUID()
```

No agregar dependencia nueva.

---

## 16. Fechas

Al crear:

```text
createdAt = now
updatedAt = now
```

Al editar:

```text
updatedAt = now
```

Con:

```ts
new Date().toISOString()
```

---

## 17. Crear

Llama:

```text
WarehouseRepository.create(...)
```

Guarda:

```text
id
name
description
mapImagePath: null
createdAt
updatedAt
```

Evita doble submit.

---

## 18. Detalle de bodega

Ruta:

```text
/warehouses/[id]
```

Estados:

```text
loading
success
not found
error
```

Mostrar:

```text
Nombre
Descripción
Fecha de actualización
```

Todavía no mostrar mapa.

---

## 19. Acciones de detalle

Debe existir:

```text
Editar
Eliminar
```

Todavía NO:

```text
Ver mapa
Agregar tarima
Tomar foto
```

---

## 20. Editar

Ruta:

```text
/warehouses/[id]/edit
```

Prellenar:

```text
name
description
```

No editar:

```text
id
createdAt
mapImagePath
```

Guardar con:

```text
updatedAt = now
```

---

## 21. Eliminar

Desde detalle.

Mostrar confirmación:

```text
¿Eliminar bodega?

Esta acción eliminará la bodega de CORONAPP.
```

Botones:

```text
Cancelar
Eliminar
```

Usa `Alert`.

---

## 22. Eliminación restringida

Este punto es obligatorio.

El esquema usa `ON DELETE RESTRICT` cuando existen referencias relevantes.

Si `WarehouseRepository.delete()` falla por constraint:

NO mostrar un error técnico.

Mostrar algo equivalente a:

```text
No se puede eliminar esta bodega porque tiene información asociada.
```

o:

```text
Esta bodega todavía tiene tarimas o ubicaciones registradas.
```

No elimines relaciones manualmente para forzar la eliminación.

No uses CASCADE donde el esquema no lo define.

---

## 23. Producto inexistente equivalente

Para bodega inexistente:

```text
WarehouseRepository.getById(id) → null
```

mostrar estado limpio:

```text
Bodega no encontrada.
```

No crear una nueva automáticamente.

---

## 24. Manejo de errores

Carga:

```text
No se pudieron cargar las bodegas.
```

Guardar:

```text
No se pudo guardar la bodega.
```

Eliminar:

```text
No se pudo eliminar la bodega.
```

Constraint:

mensaje específico amigable.

No mostrar SQL.

---

## 25. No mapa todavía

Aunque `mapImagePath` exista:

NO implementar:

- selección de plano;
- visualización de plano;
- coordenadas;
- zoom;
- pan;
- marcadores.

Eso corresponde a fases futuras.

---

## 26. No fotos

No usar:

```text
expo-camera
image picker
filesystem
```

para bodegas en esta fase.

---

## 27. No tarimas

No mostrar ni crear tarimas todavía.

Aunque exista `PalletRepository`, no conectarlo aquí.

---

## 28. No búsqueda de bodegas

No crear buscador.

La lista simple es suficiente.

---

## 29. Componentes compartidos

Puedes crear:

```text
WarehouseForm
WarehousePage
```

o equivalentes.

Mantén consistencia con productos sin forzar una abstracción genérica común.

No refactorices ProductForm solo por intentar compartir todo.

---

## 30. UI

Dirección visual:

```text
simple
clara
utilitaria
consistente con Productos
```

Todos los textos en español.

---

## 31. Persistencia

Verifica:

```text
crear bodega
↓
aparece en lista
↓
abrir detalle
↓
editar
↓
cerrar app
↓
abrir app
↓
bodega sigue existiendo
```

---

## 32. Pruebas funcionales

### Crear
- solo nombre;
- nombre + descripción;
- nombre vacío rechazado;
- doble submit evitado.

### Lista
- empty state;
- una o varias bodegas;
- toque abre detalle.

### Detalle
- existente;
- inexistente;
- description null presentada limpiamente.

### Editar
- cambiar nombre;
- limpiar descripción → NULL;
- createdAt se conserva;
- updatedAt cambia.

### Eliminar
- cancelar no elimina;
- confirmar elimina bodega sin relaciones;
- bodega con relación restringida no se elimina y muestra mensaje amigable.

---

## 33. Prueba de restricción

Si todavía no existe UI para crear relaciones:

puedes usar una prueba temporal de persistencia para:

1. crear bodega;
2. crear entidad referenciada válida con repositorio existente;
3. intentar eliminar bodega;
4. confirmar constraint;
5. limpiar datos temporales.

No agregar seeds.

---

## 34. Navegación

Verifica:

```text
Bodegas → nueva → detalle
Bodegas → detalle → editar → detalle
Bodegas → detalle → eliminar → lista
```

Evita stacks duplicados.

---

## 35. TypeScript

Mantén:

```text
strict
sin any
sin @ts-ignore
```

Normaliza params de ruta correctamente.

---

## 36. Dependencias

Esperado:

```text
ninguna dependencia nueva
```

Si cambia package.json accidentalmente, investiga.

---

## 37. Verificaciones técnicas

Ejecuta:

```bash
npm run lint
npm run typecheck
npx expo install --check
npx expo config --type public
```

Inicia Metro.

Solicita bundle Android si es posible.

---

## 38. Android

Si hay dispositivo/Expo Go:

prueba visualmente el CRUD completo.

Especialmente:

- teclado;
- scroll;
- Alert;
- Back;
- refresh al foco.

Si no hay dispositivo, declara la limitación.

---

## 39. Git

Antes de finalizar:

```bash
git status
git diff
git diff --check
```

No hagas commit.

No hagas push.

---

## 40. Criterios de aceptación

La Fase 7 queda lista para revisión si:

1. Bodegas dejó de ser placeholder.
2. Lista desde WarehouseRepository.
3. Empty state funciona.
4. Existe crear.
5. Existe detalle.
6. Existe editar.
7. Existe eliminar.
8. Nombre obligatorio.
9. Descripción vacía → null.
10. UUID generado con estrategia existente.
11. Fechas correctas.
12. createdAt se conserva.
13. updatedAt cambia.
14. eliminación tiene confirmación.
15. constraint de bodega relacionada se maneja.
16. no hay SQL en UI.
17. no hay mapa.
18. no hay fotos.
19. no hay tarimas UI.
20. no hay búsqueda de bodegas.
21. no hay dependencias nuevas.
22. lint pasa.
23. typecheck pasa.
24. Expo dependency check pasa.
25. Metro inicia.
26. bundle Android compila si es posible.
27. no se avanzó a Fase 8.

---

## 41. Reporte final obligatorio

Responde con:

### Cambios realizados
Resumen.

### Archivos creados/modificados
Lista exacta.

### Rutas nuevas
Árbol de rutas de bodegas.

### Flujo CRUD
Listar, crear, detalle, editar, eliminar.

### Validaciones
Nombre y descripción.

### Manejo de eliminación restringida
Explica cómo se presenta el constraint.

### IDs y fechas
Confirma estrategia.

### Dependencias
Confirma que no se agregó ninguna.

### Verificaciones funcionales
Lista de casos realmente probados.

### Verificaciones técnicas
Formato:

```text
comando → resultado
```

### Git diff
Resumen.

### Limitaciones
Qué no pudo probarse.

### Estado

Indica únicamente:

```text
FASE 7 LISTA PARA REVISIÓN FINAL
```

o:

```text
FASE 7 AÚN REQUIERE CORRECCIONES
```

---

## 42. Detente

Después de completar esta tarea:

**NO avances a Fase 8.**

No implementes archivos locales.

No agregues planos.

No implementes mapas.

Espera revisión.
