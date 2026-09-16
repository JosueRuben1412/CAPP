# CODEX TASK — CORONAPP FASE 4: CRUD de productos

## Contexto

Estás trabajando en **CORONAPP**, una aplicación móvil personal, offline-first y Android-first.

Las Fases 0, 1, 2 y 3 ya fueron completadas y aprobadas.

Antes de modificar código, lee completos:

- `CORONAPP_SPEC_CODEX.md`
- `IMPLEMENTATION_PLAN.md`
- `CODEX_PHASE_2.md`
- `CODEX_PHASE_3.md`

Esta tarea corresponde únicamente a:

> **FASE 4 — CRUD de productos**

No avances a la Fase 5.

---

## 1. Objetivo

Convertir la sección Productos en el primer flujo funcional completo de CORONAPP.

Al terminar, el usuario debe poder:

1. ver la lista de productos;
2. crear un producto;
3. abrir su detalle;
4. editarlo;
5. eliminarlo con confirmación;
6. cerrar y volver a abrir la aplicación;
7. comprobar que los datos siguen guardados en SQLite.

Todavía NO se implementará el escáner de códigos de barras.

---

## 2. Alcance estricto

Implementa únicamente el CRUD visual de `Product`.

Usa la infraestructura existente:

```text
SQLite
↓
ProductRepository
↓
UI de productos
```

No hagas SQL directamente desde pantallas.

No modifiques el esquema salvo que encuentres un error real bloqueante.

---

## 3. Inspección inicial obligatoria

Antes de modificar:

1. Ejecuta `git status`.
2. Confirma que Fase 3 esté limpia o identifica cambios pendientes.
3. Lee:
   - `src/app/_layout.tsx`
   - `src/app/(tabs)/products.tsx`
   - `src/database/DatabaseProvider.tsx`
   - `src/repositories/ProductRepository.ts`
   - `src/repositories/errors.ts`
   - `src/types/records.ts`
4. Confirma cómo obtener la instancia `SQLiteDatabase` del provider existente.
5. Ejecuta:
   - `npm run lint`
   - `npm run typecheck`
   - `npx expo install --check`

No rompas las Fases 0–3.

---

## 4. Dependencia nueva permitida

Se permite una sola dependencia nueva:

```text
expo-crypto
```

Instálala con:

```bash
npx expo install expo-crypto
```

Usa:

```ts
Crypto.randomUUID()
```

para crear IDs de productos.

No uses `Math.random()` como generador principal de IDs.

No instales otra librería UUID.

---

## 5. Fechas

La capa de UI/aplicación debe generar las fechas antes de llamar al repositorio.

Usa:

```ts
new Date().toISOString()
```

para:

```text
createdAt
updatedAt
```

Al crear:

```text
createdAt = now
updatedAt = now
```

Al editar:

```text
updatedAt = now
```

No modifiques `createdAt` al editar.

---

## 6. Rutas

Mantén la tab existente:

```text
/(tabs)/products
```

Agrega rutas del Root Stack equivalentes a:

```text
/products/new
/products/[id]
/products/[id]/edit
```

Estructura sugerida:

```text
src/app/
├── _layout.tsx
├── (tabs)/
│   └── products.tsx
└── products/
    ├── new.tsx
    └── [id]/
        ├── index.tsx
        └── edit.tsx
```

Puedes ajustar la estructura manteniendo URLs y responsabilidades claras.

No dupliques `/products` como ruta principal fuera de la tab.

---

## 7. Navegación

Usa Expo Router.

Desde la lista:

```text
Nuevo producto → /products/new
Producto → /products/[id]
```

Desde detalle:

```text
Editar → /products/[id]/edit
```

Después de crear:

```text
ir al detalle del producto creado
```

Después de editar:

```text
volver al detalle actualizado
```

Después de eliminar:

```text
volver a la lista de Productos
```

Prefiere `useRouter()` para navegación imperativa desde componentes.

Usa hrefs completos.

---

## 8. Root Stack

Registra/configura las nuevas rutas únicamente si es necesario para controlar headers o presentación.

No crees un segundo navegador independiente.

`DatabaseProvider` debe seguir existiendo una sola vez.

---

## 9. Acceso al repositorio

Crea una forma pequeña y reusable de obtener `ProductRepository` usando la instancia SQLite actual.

Una opción válida es un hook como:

```text
useProductRepository
```

si realmente reduce repetición.

El hook puede:

1. obtener `SQLiteDatabase` mediante la API existente de `expo-sqlite`;
2. instanciar/memoizar `ProductRepository`.

No pongas consultas SQL en el hook.

No dupliques lógica del repositorio.

No crear todavía hooks genéricos para todas las entidades.

---

## 10. Pantalla Productos

Reemplaza el placeholder actual por una lista real.

Debe tener:

```text
Productos
[ Nuevo producto ]
```

y debajo el contenido.

Estados obligatorios:

```text
loading
success
empty
error
```

### Empty state

Si no hay productos:

```text
No hay productos registrados.
```

y un acceso claro a:

```text
Agregar producto
```

No insertar datos demo.

---

## 11. Carga de productos

Usa:

```text
ProductRepository.list()
```

No hagas SQL desde la pantalla.

La lista debe refrescarse cuando la pantalla vuelva a tener foco para reflejar:

- producto creado;
- producto editado;
- producto eliminado.

Usa una estrategia apropiada de Expo Router, por ejemplo `useFocusEffect`, si encaja con la implementación actual.

Evita ciclos o recargas innecesarias.

---

## 12. Elemento de lista

Cada producto debe mostrar como mínimo:

```text
nombre
marca si existe
barcode si existe
```

No mostrar labels vacías como:

```text
Marca: null
```

Todo el elemento debe ser fácilmente tocable.

Al tocar:

```text
/products/[id]
```

---

## 13. Rendimiento de lista

Usa una lista apropiada de React Native, preferiblemente:

```text
FlatList
```

No renderices manualmente cientos de productos con `.map()` dentro de un `ScrollView`.

Configura una `keyExtractor` estable usando el ID.

---

## 14. Creación de producto

Ruta:

```text
/products/new
```

Campos:

```text
Nombre *
Código de barras
Marca
Categoría
Notas
```

No implementar foto todavía.

`imagePath` debe persistirse como:

```text
null
```

---

## 15. Formulario reusable

Crea un componente reutilizable para creación y edición, por ejemplo:

```text
ProductForm
```

Debe recibir:

- valores iniciales;
- estado de envío;
- callback de submit;
- texto apropiado de acción.

No dupliques dos formularios casi idénticos.

No construyas un framework de formularios.

---

## 16. Estado del formulario

Puedes usar:

```text
useState
```

por campo o un estado agrupado sencillo.

No instalar:

- React Hook Form
- Formik
- Zod
- Yup

para esta fase.

---

## 17. Normalización de campos opcionales

Antes de guardar:

- aplica `trim()` al texto;
- los campos opcionales vacíos deben persistirse como `null`.

Ejemplo:

```text
"   " → null
```

para:

```text
barcode
brand
category
notes
```

Para `name`:

```text
trim()
```

y no permitir vacío.

---

## 18. Validación de nombre

`name` es obligatorio.

Si queda vacío después de `trim()`:

- no llamar al repositorio;
- mostrar error visible junto al formulario o campo.

Mensaje corto en español, por ejemplo:

```text
El nombre es obligatorio.
```

No depender únicamente de `NOT NULL`.

---

## 19. Validación de barcode

El barcode es opcional.

No implementes todavía validaciones específicas por tipo de EAN/UPC.

Para esta fase:

- permitir string;
- trim;
- vacío → null;
- duplicado → mostrar error comprensible.

No hacer consultas a Internet.

---

## 20. Producto duplicado por barcode

La base ya tiene unicidad.

Cuando `ProductRepository.create()` o `update()` produzca un error de constraint debido a barcode duplicado:

mostrar un mensaje equivalente a:

```text
Ya existe un producto con ese código de barras.
```

No mostrar al usuario:

```text
SQLITE_CONSTRAINT_UNIQUE...
```

Conserva logs técnicos solo cuando sean útiles para desarrollo.

---

## 21. Crear producto

Al enviar un formulario válido:

1. generar ID con `Crypto.randomUUID()`;
2. generar `now = new Date().toISOString()`;
3. llamar `ProductRepository.create`;
4. guardar:
   - `id`
   - `name`
   - `barcode`
   - `brand`
   - `category`
   - `notes`
   - `imagePath: null`
   - `createdAt: now`
   - `updatedAt: now`
5. navegar al detalle.

Evita doble submit.

Durante guardado deshabilita la acción principal.

---

## 22. Detalle de producto

Ruta:

```text
/products/[id]
```

Obtén `id` mediante Expo Router.

Carga:

```text
ProductRepository.getById(id)
```

Estados:

```text
loading
success
not found
error
```

Mostrar como mínimo:

```text
Nombre
Marca
Categoría
Código de barras
Notas
Fecha de actualización
```

Si un campo opcional no existe, puedes ocultarlo o mostrar una representación limpia como:

```text
Sin marca
```

pero evita saturar la pantalla.

---

## 23. Fecha en detalle

La DB conserva ISO 8601.

En UI puedes usar una presentación local sencilla disponible en JavaScript.

No instales librería de fechas.

Ejemplo:

```ts
new Date(product.updatedAt).toLocaleString()
```

Si una fecha no puede interpretarse, no debe romper la pantalla.

---

## 24. Acciones de detalle

Debe existir:

```text
Editar
Eliminar
```

Todavía NO:

```text
Ver en mapa
Agregar a tarima
Cambiar ubicación
Historial
Foto
```

Esas acciones pertenecen a fases posteriores.

---

## 25. Editar producto

Ruta:

```text
/products/[id]/edit
```

Carga el producto.

Prellena el `ProductForm`.

Permite modificar:

```text
name
barcode
brand
category
notes
```

No permitir editar:

```text
id
createdAt
imagePath
```

Al guardar:

```text
updatedAt = new Date().toISOString()
```

Usa actualización parcial o el contrato correcto ya implementado.

Después de éxito navega/regresa al detalle.

---

## 26. Producto inexistente al editar

Si `getById(id)` devuelve `null`:

mostrar estado de producto no encontrado.

No crear automáticamente uno nuevo.

---

## 27. Eliminar producto

Desde detalle.

Antes de eliminar, mostrar confirmación nativa con algo equivalente a:

```text
¿Eliminar producto?

Esta acción eliminará el producto de CORONAPP.
```

Botones:

```text
Cancelar
Eliminar
```

La acción destructiva debe ser clara.

Usa `Alert` de React Native o equivalente nativo ya disponible.

No implementar "deshacer".

---

## 28. Error al eliminar

Si falla la eliminación:

- permanecer en detalle;
- mostrar error comprensible;
- no navegar como si hubiera funcionado.

Si devuelve `false` porque ya no existe, maneja el estado de forma segura.

---

## 29. Integridad con relaciones futuras

Las FKs ya administran relaciones existentes.

No escribas SQL manual para:

- pallet_products;
- product_locations;
- history.

No existen flujos visuales para esas entidades todavía.

---

## 30. Búsqueda

La **Fase 5** estará dedicada a mejorar búsqueda.

En Fase 4 NO es obligatorio construir un buscador completo.

La pantalla Productos debe listar correctamente.

Si ya existe un control de búsqueda visual del shell, puede quedar deshabilitado/ausente hasta Fase 5.

No adelantes debounce, filtros ni FTS.

---

## 31. Escáner

No implementar.

El campo barcode se captura manualmente en Fase 4.

No solicitar cámara.

No instalar `expo-camera`.

---

## 32. Fotografías

No implementar.

`imagePath` permanece en:

```text
null
```

al crear.

Al editar no se modifica.

---

## 33. Teclado y formularios

La experiencia debe ser usable en Android.

Asegura que:

- campos puedan desplazarse cuando aparece teclado;
- botón Guardar pueda alcanzarse;
- multiline sea apropiado para Notas;
- `returnKeyType`/`keyboardType` se usen solo si aportan valor.

Para barcode puede usarse un teclado apropiado, pero recuerda que algunos códigos pueden requerir más que una suposición numérica; no impongas una restricción incorrecta.

---

## 34. Scroll de formulario

Usa un contenedor que permita desplazar el formulario.

No permitas que el teclado vuelva inaccesibles campos inferiores.

No agregues librerías externas de keyboard avoidance.

---

## 35. Componentes compartidos

Puedes crear componentes pequeños como:

```text
ProductForm
FormField
ScreenState
```

solo si reducen duplicación.

No sobrearquitectures.

---

## 36. UI

Mantén la dirección visual aprobada:

```text
simple
clara
utilitaria
Android-first
```

Botones suficientemente grandes.

Textos en español.

No implementar aún un sistema de diseño completo.

---

## 37. Errores de carga

Si `ProductRepository.list()` falla:

mostrar algo como:

```text
No se pudieron cargar los productos.
```

con opción:

```text
Reintentar
```

si es sencillo hacerlo.

No dejar la pantalla vacía silenciosamente.

---

## 38. Errores de guardado

Mientras guarda:

- bloquear doble envío;
- mostrar estado de actividad razonable.

Si falla:

- no descartar lo escrito;
- mostrar mensaje;
- permitir intentar otra vez.

---

## 39. Estado después de navegación

Al volver desde creación/edición/eliminación, la lista debe reflejar el estado actual sin obligar a reiniciar la app.

No mantener una copia global redundante del catálogo.

SQLite sigue siendo la fuente de verdad.

---

## 40. No agregar store global

No instalar ni crear:

```text
Redux
Zustand
Context global de productos
```

No es necesario.

La lista puede recargarse desde SQLite cuando la ruta gana foco.

---

## 41. No crear API service

No existe backend.

No crear:

```text
ProductApi
HTTP client
fetch wrappers
```

---

## 42. No cambiar repositorio salvo necesidad real

`ProductRepository` fue aprobado en Fase 2.

Úsalo.

Si encuentras un bug real:

1. corrígelo mínimamente;
2. explica exactamente qué fallaba;
3. agrega la verificación correspondiente.

No rediseñes los seis repositorios.

---

## 43. TypeScript

Mantén:

```text
strict
sin any
sin @ts-ignore
```

Los params de rutas deben manejarse sin asumir ciegamente que siempre son un único string.

Si `id` puede tiparse como `string | string[]`, normalízalo correctamente.

---

## 44. Accesibilidad básica

Inputs:

- labels visibles;
- no usar placeholder como única etiqueta.

Botones:

- `accessibilityRole` apropiado;
- nombres comprensibles.

Acción destructiva:

- claramente identificable.

---

## 45. Persistencia real

Verifica como mínimo:

```text
crear producto
↓
aparece en lista
↓
abrir detalle
↓
editar
↓
regresar
↓
cambio visible
↓
reiniciar app
↓
producto sigue existiendo
```

Si Android/Expo Go está disponible, esta prueba debe hacerse allí.

---

## 46. Pruebas funcionales obligatorias

Comprueba:

### Crear
- nombre solamente;
- todos los campos;
- nombre vacío rechazado;
- barcode duplicado rechazado;
- doble submit evitado.

### Listar
- empty state;
- uno o más productos;
- toque abre detalle.

### Detalle
- producto existente;
- producto inexistente;
- campos null se presentan correctamente.

### Editar
- cambio de nombre;
- limpiar campo opcional → guarda NULL;
- barcode duplicado → error;
- `createdAt` permanece;
- `updatedAt` cambia.

### Eliminar
- Cancelar no elimina;
- Confirmar elimina;
- lista se actualiza.

No insertes datos demo permanentes.

---

## 47. Verificación del ID

Confirma que el ID creado por UI es un UUID v4 generado con `Crypto.randomUUID()`.

No muestres el UUID al usuario salvo para debugging temporal.

Retira debugging antes del diff final.

---

## 48. Verificación timestamps

Confirma:

- create asigna mismo `now` a `createdAt` y `updatedAt`;
- edit conserva `createdAt`;
- edit cambia `updatedAt`.

---

## 49. Navegación y refresh

Verifica que:

- crear no deje pantallas duplicadas extrañas;
- editar vuelva al detalle correcto;
- eliminar no permita volver con Back a un detalle roto si puede evitarse con navegación apropiada;
- lista se refresque al ganar foco.

Usa las primitivas de Expo Router de forma coherente.

---

## 50. Dependencias

Esperado:

```text
+ expo-crypto
```

No agregar nada más.

Al final ejecuta:

```bash
npx expo install --check
```

---

## 51. Verificaciones técnicas

Ejecuta:

```bash
npm run lint
npm run typecheck
npx expo install --check
npx expo config --type public
```

Inicia Metro.

Solicita bundle Android si el entorno lo permite.

---

## 52. Verificación Android

Si hay dispositivo/Expo Go disponible, comprueba visualmente el flujo CRUD completo.

Si no:

- no inventes resultado;
- prueba repositorio/UI todo lo posible;
- declara la limitación.

---

## 53. Git

Antes de finalizar:

```bash
git status
git diff
git diff --check
```

Revisa archivos untracked explícitamente.

No hagas commit.

No hagas push.

---

## 54. Criterios de aceptación

La Fase 4 queda lista para revisión si:

1. Productos dejó de ser placeholder.
2. La lista carga desde `ProductRepository`.
3. Existe empty state.
4. Existe ruta crear.
5. Existe formulario reusable.
6. Nombre es obligatorio.
7. Opcionales vacíos → NULL.
8. ID se genera con UUID v4.
9. Fechas se generan en capa de aplicación.
10. Crear persiste en SQLite.
11. Existe detalle.
12. Existe edición.
13. Edición conserva `createdAt`.
14. Edición actualiza `updatedAt`.
15. Barcode duplicado produce mensaje amigable.
16. Existe eliminación con confirmación.
17. Cancelar no elimina.
18. Eliminar actualiza la lista.
19. La lista se refresca al volver a foco.
20. No hay SQL en UI.
21. No hay store global.
22. No hay cámara.
23. No hay fotos.
24. No hay mapas.
25. No hay búsqueda avanzada.
26. No hay datos demo.
27. Solo se agregó `expo-crypto`.
28. lint pasa.
29. typecheck pasa.
30. Expo dependency check pasa.
31. Metro inicia.
32. bundle Android compila si el entorno lo permite.
33. no se avanzó a Fase 5.

---

## 55. Reporte final obligatorio

Responde con:

### Cambios realizados
Resumen.

### Archivos creados/modificados
Lista exacta y propósito.

### Rutas nuevas
Árbol de rutas de productos.

### Flujo CRUD
Describe:
- listar;
- crear;
- detalle;
- editar;
- eliminar.

### Generación de IDs y fechas
Confirma estrategia.

### Validaciones
Lista las implementadas.

### Manejo de errores
Incluye barcode duplicado y errores de DB.

### Dependencias
Confirma `expo-crypto` y cualquier otra modificación.

### Verificaciones funcionales
Lista cada caso realmente probado.

### Verificaciones técnicas

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
FASE 4 LISTA PARA REVISIÓN FINAL
```

o:

```text
FASE 4 AÚN REQUIERE CORRECCIONES
```

---

## 56. Detente

Después de completar esta tarea:

**NO avances a Fase 5.**

No implementes búsqueda avanzada.

No agregues escáner.

No implementes fotografías.

No construyas bodegas CRUD.

Espera revisión.
