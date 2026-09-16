# CODEX TASK — CORONAPP FASE 5: Búsqueda local de productos

## Contexto

Estás trabajando en **CORONAPP**, una aplicación móvil personal, offline-first y Android-first para localizar mercancía dentro de bodegas dinámicas.

Las Fases 0, 1, 2, 3 y 4 ya fueron completadas y aprobadas.

Antes de modificar código, lee completos:

- `CORONAPP_SPEC_CODEX.md`
- `IMPLEMENTATION_PLAN.md`
- `CODEX_PHASE_4.md`

Esta tarea corresponde únicamente a:

> **FASE 5 — Búsqueda optimizada de productos**

No avances a la Fase 6.

---

## 1. Objetivo

Convertir la pantalla Productos en una herramienta rápida para localizar un producto por:

```text
nombre
marca
código de barras
```

La búsqueda debe:

- ser completamente local;
- usar `ProductRepository.search()`;
- responder mientras el usuario escribe;
- convivir correctamente con creación, edición y eliminación;
- mantener SQLite como fuente de verdad;
- no requerir Internet;
- no implementar todavía cámara ni escáner.

---

## 2. Alcance estricto

Implementa solamente la experiencia de búsqueda dentro de la sección Productos.

No implementar:

- cámara;
- lectura de códigos de barras;
- filtros avanzados;
- categorías navegables;
- favoritos;
- historial de búsquedas;
- FTS5;
- backend;
- búsqueda remota;
- sugerencias obtenidas de Internet.

---

## 3. Inspección inicial obligatoria

Antes de modificar:

1. Ejecuta `git status`.
2. Confirma que la Fase 4 está limpia o identifica cambios pendientes.
3. Lee:
   - `src/app/(tabs)/products.tsx`
   - `src/repositories/ProductRepository.ts`
   - `src/features/products/useProductRepository.ts`
   - componentes utilizados por la lista de productos.
4. Confirma el contrato actual de:
   - `ProductRepository.list()`
   - `ProductRepository.search()`
5. Ejecuta:
   - `npm run lint`
   - `npm run typecheck`
   - `npx expo install --check`

No cambies el repositorio si ya cumple correctamente el contrato de búsqueda.

---

## 4. Dependencias

No instales ninguna dependencia nueva.

Usa:

- React;
- React Native;
- Expo Router;
- repositorios existentes.

No instalar:

- debounce libraries;
- lodash;
- search libraries;
- fuzzy search;
- SQLite FTS wrappers;
- state managers.

---

## 5. Campo de búsqueda

En la pantalla Productos agrega un `TextInput` visible cerca del encabezado.

Debe tener una etiqueta o contexto claro y un placeholder similar a:

```text
Buscar por nombre, marca o código
```

No uses únicamente un icono sin explicación.

Debe ser cómodo para Android y fácil de tocar.

---

## 6. Estado de búsqueda

Mantén como mínimo:

```text
query
results
loading
error
```

Puedes reutilizar el estado/lista actual si la implementación queda clara.

No crear un store global.

---

## 7. Normalización del query

Para decidir si existe búsqueda activa:

```ts
const normalizedQuery = query.trim();
```

Si `normalizedQuery` está vacío:

```text
usar ProductRepository.list()
```

Si tiene contenido:

```text
usar ProductRepository.search(normalizedQuery)
```

No modificar el texto visible que el usuario está escribiendo más allá de lo necesario.

---

## 8. Búsqueda mientras escribe

La búsqueda debe actualizar resultados mientras el usuario escribe.

Implementa un debounce pequeño sin librerías externas.

Rango esperado:

```text
200–350 ms
```

Una elección razonable:

```text
250 ms
```

No ejecutes una consulta SQLite por cada pulsación inmediata si puedes evitarlo.

---

## 9. Cancelación lógica de resultados obsoletos

Evita este problema:

```text
usuario escribe "reg"
↓
consulta A tarda
↓
usuario escribe "regio"
↓
consulta B termina primero
↓
consulta A termina después
↓
UI muestra resultados de "reg"
```

Aunque SQLite local normalmente sea rápido, implementa una protección sencilla contra resultados obsoletos.

Opciones aceptables:

- contador/request id;
- flag cancelado dentro del efecto;
- mecanismo equivalente simple.

No agregues infraestructura compleja.

---

## 10. Integración con foco

La pantalla ya se refresca al volver desde crear/editar/eliminar.

Mantén ese comportamiento.

Cuando Productos vuelve a foco:

- si no hay query → recargar `list()`;
- si hay query → volver a ejecutar `search(query)`.

Esto garantiza que un producto editado o eliminado se refleje dentro de resultados activos.

Expo Router proporciona `useFocusEffect`; si ya se usa, conserva una implementación idiomática y memoiza el callback según corresponda.

---

## 11. Comportamiento esperado

Ejemplos:

Productos:

```text
Regio 12 rollos
Regio Rinde+
Coca Cola 600 ml
Cloralex 1 L
```

Buscar:

```text
reg
```

debe mostrar los productos Regio.

Buscar una marca coincidente debe mostrar sus productos.

Buscar:

```text
7501234567890
```

debe encontrar el producto cuyo barcode coincida o contenga ese valor según el contrato actual `LIKE`.

---

## 12. No cambiar a búsqueda exacta por barcode

La Fase 5 utiliza el contrato de `search()` existente, que busca parcialmente en:

```text
name
brand
barcode
```

No reemplazarlo por `getByBarcode()`.

La búsqueda exacta por barcode será especialmente útil en la Fase 6 con el escáner.

---

## 13. Case-insensitive

Conserva el comportamiento de búsqueda actual de SQLite/`LIKE`.

No agregues normalización Unicode, collations personalizadas ni extensiones.

La búsqueda debe funcionar razonablemente para nombres y marcas comunes.

---

## 14. Comodines

`%` y `_` pueden conservar el comportamiento de comodines de SQL `LIKE` definido en Fase 2.

No es obligatorio escaparlos en esta fase.

La entrada sigue yendo mediante parámetros enlazados.

No concatenes query dentro del SQL.

---

## 15. Empty state sin búsqueda

Cuando:

```text
query vacío
+
no existen productos
```

mostrar el empty state de catálogo:

```text
No hay productos registrados.
```

Mantén el acceso para crear el primer producto.

---

## 16. Empty state con búsqueda

Cuando existe query y no hay coincidencias, NO mostrar el mismo mensaje del catálogo vacío.

Mostrar algo equivalente a:

```text
No encontramos productos para “regio”.
```

y una indicación sencilla:

```text
Prueba con otro nombre, marca o código.
```

No crear automáticamente un producto desde este estado todavía.

---

## 17. Botón limpiar

Cuando exista texto en el buscador, proporciona una forma clara de limpiarlo.

Puede ser:

```text
Limpiar
```

o un control equivalente accesible.

No necesitas instalar un paquete de iconos.

Al limpiar:

```text
query = ""
↓
volver a lista completa
```

---

## 18. Teclado

Configura el `TextInput` de forma apropiada:

- `returnKeyType="search"` si encaja;
- autocorrect puede desactivarse si produce fricción con marcas/códigos;
- auto-capitalización debe elegirse pensando en búsquedas.

No fuerces teclado numérico porque se buscan nombres y marcas además de códigos.

---

## 19. Lista

Conserva `FlatList`.

La búsqueda NO debe cambiar a:

```text
ScrollView + .map()
```

Mantén IDs como keys estables.

---

## 20. Resultados

Cada resultado conserva como mínimo:

```text
nombre
marca si existe
barcode si existe
```

Tocar un resultado sigue abriendo:

```text
/products/[id]
```

No crear una nueva pantalla de resultados.

---

## 21. Resaltar coincidencias

NO es obligatorio resaltar texto coincidente.

No añadas complejidad solo para pintar fragmentos en negrita.

Puede evaluarse posteriormente.

---

## 22. Contador de resultados

No es obligatorio.

Si se agrega, debe ser discreto y derivado del array actual.

No crear métricas complejas.

---

## 23. Indicador de carga

Como SQLite es local, evita un spinner intrusivo en cada pulsación.

Puedes:

- conservar resultados anteriores durante la búsqueda;
- usar un indicador pequeño;
- o actualizar silenciosamente si la respuesta es inmediata.

Para carga inicial sí debe mantenerse el estado correspondiente.

No provocar parpadeo constante.

---

## 24. Manejo de errores

Si `search()` falla:

mostrar un estado/mensaje como:

```text
No se pudo realizar la búsqueda.
```

Permitir:

```text
Reintentar
```

si la implementación es sencilla.

No borrar el query cuando ocurre el error.

No mostrar SQL al usuario.

---

## 25. Crear producto

El botón:

```text
Nuevo producto
```

debe seguir disponible aunque haya una búsqueda activa.

No deshabilitar creación por estar buscando.

Después de crear y volver a Productos:

- si el query sigue activo y el nuevo producto coincide → debe aparecer;
- si no coincide → correctamente no aparece hasta limpiar/cambiar búsqueda.

---

## 26. Editar producto

Después de editar y regresar:

- reejecutar búsqueda activa;
- si deja de coincidir, debe desaparecer de esos resultados;
- si ahora coincide, debe aparecer.

No actualices resultados manualmente mediante mutaciones complejas.

Recarga desde SQLite.

---

## 27. Eliminar producto

Después de eliminar:

- reejecutar la consulta actual;
- el producto debe desaparecer.

SQLite sigue siendo fuente de verdad.

---

## 28. Inicio → Buscar producto

En Fase 3 el botón de Inicio:

```text
Buscar producto
```

navega a Productos.

Mantén ese comportamiento.

No es obligatorio autofocar el input al llegar desde Inicio en esta fase.

Si puedes hacerlo limpiamente sin alterar rutas ni introducir params innecesarios, puede evaluarse, pero no es requisito.

---

## 29. Escáner

La tab Escáner sigue siendo placeholder.

No conectarla todavía con el buscador.

No instalar cámara.

---

## 30. ProductRepository

La expectativa es que `ProductRepository.search()` ya esté implementado y probado.

No lo reescribas por preferencia personal.

Solo modifícalo si detectas un bug real, por ejemplo:

- no busca alguno de los tres campos requeridos;
- concatena SQL inseguro;
- orden no determinista;
- búsqueda vacía rompe el contrato.

Si lo modificas:

- explica exactamente el bug;
- conserva parámetros enlazados;
- añade verificación.

---

## 31. Orden de resultados

Usa el orden definido por el repositorio.

No hagas sorting inconsistente en UI salvo necesidad real.

Idealmente:

```text
name ASC
```

según el contrato aprobado.

---

## 32. Hook opcional

Puedes crear un hook pequeño como:

```text
useProductSearch
```

si encapsula limpiamente:

- query;
- debounce;
- loading;
- results;
- error;
- refresh al foco.

Pero NO es obligatorio.

No metas SQL en el hook.

No conviertas esto en un framework genérico de queries.

---

## 33. Separación de responsabilidades

Ideal:

```text
ProductsScreen
↓
estado/hook de búsqueda
↓
ProductRepository
↓
SQLite
```

No:

```text
ProductsScreen
↓
SQL directo
```

---

## 34. Accesibilidad

El campo debe tener:

- label/contexto comprensible;
- tamaño táctil adecuado;
- botón limpiar accesible;
- resultados tocables.

No dependas solo de color para mostrar estados.

---

## 35. Textos

Todos los textos visibles en español.

Evita jerga técnica:

NO:

```text
0 rows found
query failed
```

SÍ:

```text
No encontramos productos.
No se pudo realizar la búsqueda.
```

---

## 36. Offline

Verifica que la búsqueda funciona:

```text
sin Internet
```

No introducir ninguna dependencia de red.

---

## 37. Pruebas funcionales obligatorias

Usa datos temporales o datos locales de prueba sin dejar seeds permanentes.

Comprueba:

### Consulta vacía
```text
"" → lista completa
"   " → lista completa
```

### Nombre
Producto:

```text
Regio Rinde+
```

Buscar:

```text
reg
Rinde
```

Debe aparecer según comportamiento actual de `LIKE`.

### Marca
Ejemplo:

```text
brand = Coca Cola
query = coca
```

Debe aparecer.

### Barcode
Ejemplo:

```text
barcode = 7501234567890
query = 750123
```

Debe aparecer.

### Sin coincidencias
Debe mostrarse el empty state de búsqueda, no el del catálogo vacío.

### Limpiar
Debe restaurar la lista completa.

### Editar
Con query activo, editar un producto y verificar que resultados se recalculan.

### Eliminar
Con query activo, eliminar y verificar desaparición.

### Crear
Con query activo, crear un producto coincidente y comprobar que aparece al regresar.

---

## 38. Prueba de debounce

Confirma que escribir rápidamente:

```text
r
re
reg
regi
regio
```

no dispara necesariamente cinco consultas inmediatas consecutivas.

No necesitas instrumentación permanente.

Puedes verificar temporalmente y retirar logs antes del diff final.

---

## 39. Prueba contra resultados obsoletos

Si la implementación usa protección de request/cancelación lógica, prueba o inspecciona que un resultado anterior no pueda reemplazar el query más nuevo.

No dejes delays artificiales permanentes.

---

## 40. No persistir query

El texto de búsqueda no necesita persistirse entre reinicios de la app.

No guardarlo en SQLite.

No usar AsyncStorage.

---

## 41. No historial de búsquedas

No guardar términos anteriores.

Eso está fuera del alcance.

---

## 42. No filtros

No crear:

```text
filtro por categoría
filtro por marca
orden manual
chips
dropdowns
```

Todavía.

La búsqueda única debe resolver el MVP actual.

---

## 43. No paginación

Para el tamaño esperado en esta fase, no implementar paginación.

`ProductRepository.search()` y `list()` pueden devolver el conjunto completo.

Si detectas un problema de rendimiento real durante pruebas, repórtalo en lugar de sobreoptimizar.

---

## 44. Rendimiento objetivo

Para varios cientos o algunos miles de productos, escribir en el buscador debe sentirse inmediato.

No añadas memoización compleja sin necesidad.

SQLite ya tiene índices definidos en Fase 1.

---

## 45. Verificaciones técnicas

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

## 46. Android

Si hay dispositivo/Expo Go:

prueba visualmente:

- enfocar buscador;
- escribir;
- borrar;
- scroll de resultados;
- abrir detalle;
- volver;
- teclado;
- botón limpiar.

Si no hay dispositivo:

declara la limitación.

No inventes resultados.

---

## 47. Git

Antes de finalizar:

```bash
git status
git diff
git diff --check
```

Revisa archivos nuevos sin seguimiento.

No hagas commit.

No hagas push.

---

## 48. Dependencias

Confirma explícitamente:

```text
No se agregaron dependencias.
```

Si alguna dependencia cambia accidentalmente, investiga y corrige antes de terminar.

---

## 49. Criterios de aceptación

La Fase 5 queda lista para revisión si:

1. existe buscador visible en Productos;
2. busca por nombre;
3. busca por marca;
4. busca por barcode;
5. usa `ProductRepository.search()`;
6. query vacío usa lista completa;
7. usa parámetros enlazados en repositorio;
8. existe debounce;
9. existe protección contra resultados obsoletos;
10. existe empty state diferente para búsqueda sin resultados;
11. se puede limpiar la búsqueda;
12. resultados siguen abriendo detalle;
13. lista se refresca al foco;
14. crear con query activo recalcula;
15. editar con query activo recalcula;
16. eliminar con query activo recalcula;
17. SQLite sigue siendo fuente de verdad;
18. no hay búsqueda remota;
19. no hay cámara;
20. no hay escáner;
21. no hay FTS;
22. no hay filtros;
23. no hay dependencias nuevas;
24. lint pasa;
25. typecheck pasa;
26. Expo dependency check pasa;
27. Metro inicia;
28. bundle Android compila si es posible;
29. no se avanzó a Fase 6.

---

## 50. Reporte final obligatorio

Responde con:

### Cambios realizados
Resumen.

### Archivos creados/modificados
Lista exacta y propósito.

### Flujo de búsqueda
Explica:
- query vacío;
- query activo;
- debounce;
- refresh al foco;
- limpiar.

### Campos buscados
Confirma:
- nombre;
- marca;
- barcode.

### Manejo de estados
Describe:
- loading;
- resultados;
- catálogo vacío;
- búsqueda sin resultados;
- error.

### Protección contra resultados obsoletos
Explica la estrategia.

### Dependencias
Confirma que no agregaste ninguna.

### Verificaciones funcionales
Lista casos realmente probados.

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
FASE 5 LISTA PARA REVISIÓN FINAL
```

o:

```text
FASE 5 AÚN REQUIERE CORRECCIONES
```

---

## 51. Detente

Después de completar esta tarea:

**NO avances a Fase 6.**

No instales cámara.

No implementes barcode scanner.

No agregues permisos de cámara.

Espera revisión.
