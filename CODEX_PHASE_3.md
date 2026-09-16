# CODEX TASK — CORONAPP FASE 3: Shell visual y navegación principal

## Contexto

Estás trabajando en **CORONAPP**, una aplicación móvil personal, offline-first y Android-first para localizar mercancía dentro de bodegas dinámicas.

Las Fases 0, 1 y 2 ya fueron completadas y aprobadas.

Antes de modificar código, lee completos:

- `CORONAPP_SPEC_CODEX.md`
- `IMPLEMENTATION_PLAN.md`
- `CODEX_PHASE_1.md`
- `CODEX_PHASE_2.md`

Esta tarea corresponde únicamente a:

> **FASE 3 — Shell visual y navegación principal**

No avances a la Fase 4.

---

## 1. Objetivo

Construir la estructura visual y de navegación principal del MVP sin implementar todavía CRUD real.

Al finalizar debe existir navegación funcional entre:

```text
Inicio
Productos
Escáner
Bodegas
```

La aplicación debe sentirse como una app real y no como una pantalla de prueba, pero todavía no debe consultar productos, bodegas ni escáner real.

---

## 2. Decisión de navegación

Usa **Expo Router con JavaScript Tabs estables**.

Para la versión actual del proyecto (Expo SDK 57), NO uses:

```text
expo-router/unstable-native-tabs
```

No uses APIs experimentales.

Usa un patrón equivalente a:

```text
Root Stack
└── (tabs)
    ├── Inicio
    ├── Productos
    ├── Escáner
    └── Bodegas
```

El `Root Stack` permitirá añadir posteriormente pantallas de detalle, creación y edición por encima de las tabs.

---

## 3. Inspección inicial obligatoria

Antes de modificar:

1. Ejecuta `git status`.
2. Confirma que Fase 2 esté limpia o identifica cambios pendientes.
3. Lee `src/app/_layout.tsx`.
4. Lee `src/app/index.tsx`.
5. Lee la integración de `DatabaseProvider`.
6. Revisa `package.json`.
7. Revisa las carpetas `src/types`, `src/repositories` y `src/database`.
8. Ejecuta:
   - `npm run lint`
   - `npm run typecheck`
   - `npx expo install --check`

No rompas la infraestructura SQLite ni los repositorios ya aprobados.

---

## 4. Dependencias

No instales dependencias nuevas para esta fase.

Usa únicamente:

- React Native;
- Expo Router;
- APIs y componentes ya disponibles.

No instalar:

- librerías de UI;
- NativeWind;
- Tailwind;
- React Native Paper;
- Tamagui;
- gluestack;
- librerías de iconos adicionales;
- Redux;
- Zustand;
- TanStack Query.

Si `@expo/vector-icons` ya existe como dependencia disponible y el proyecto la usa oficialmente por Expo, no la agregues solo por esta fase. La navegación debe poder funcionar incluso sin iconos personalizados.

---

## 5. Estructura de rutas esperada

Adapta `src/app/` a una estructura equivalente a:

```text
src/app/
├── _layout.tsx
└── (tabs)/
    ├── _layout.tsx
    ├── index.tsx
    ├── products.tsx
    ├── scanner.tsx
    └── warehouses.tsx
```

Puedes ajustar nombres de archivos si Expo Router requiere otra convención, pero mantén estas cuatro rutas principales.

El archivo anterior `src/app/index.tsx` puede moverse/adaptarse a `(tabs)/index.tsx`.

No dejes rutas duplicadas innecesarias.

---

## 6. Root layout

`src/app/_layout.tsx` debe continuar siendo responsable de:

- integrar `DatabaseProvider`;
- contener el `Stack` raíz;
- renderizar el grupo `(tabs)` sin header duplicado.

Conceptualmente:

```text
DatabaseProvider
└── Stack
    └── (tabs)
```

No abras SQLite desde cada pantalla.

No dupliques providers.

No cambies la infraestructura de migraciones.

---

## 7. Tabs layout

Crea `src/app/(tabs)/_layout.tsx`.

Debe definir cuatro tabs:

```text
Inicio
Productos
Escáner
Bodegas
```

Orden obligatorio:

1. Inicio
2. Productos
3. Escáner
4. Bodegas

Usa etiquetas en español.

No mostrar nombres técnicos como:

```text
index
products
scanner
warehouses
```

al usuario.

---

## 8. Iconos

Los iconos NO son requisito para aprobar esta fase.

Prioriza:

- estabilidad;
- labels claras;
- navegación;
- cero dependencias nuevas.

Si puedes usar iconos mediante una dependencia que YA esté correctamente disponible en el proyecto sin instalar nada, puedes hacerlo.

Si no, usa tabs con labels solamente.

No uses emojis como solución permanente en la barra de navegación.

---

## 9. Pantalla Inicio

La pantalla Inicio debe ser el punto principal de entrada.

Debe mostrar:

```text
CORONAPP
```

y una descripción breve equivalente a:

```text
Encuentra tu mercancía rápidamente.
```

Debe incluir accesos visuales a:

```text
Buscar producto
Escanear código
Ver bodegas
```

### Importante

Estos accesos únicamente deben navegar a las secciones correspondientes.

No implementar todavía búsqueda real.

No abrir cámara real.

No consultar bodegas desde SQLite.

---

## 10. Diseño de Inicio

Usa React Native estándar.

Puedes crear componentes reutilizables sencillos, por ejemplo:

```text
HomeAction
SectionHeader
ScreenContainer
```

solo si reducen duplicación real.

La pantalla debe priorizar:

- botones/áreas táctiles grandes;
- buena legibilidad;
- separación clara;
- uso sencillo en Android;
- diseño sobrio;
- pocas distracciones.

No construyas un sistema de diseño completo.

---

## 11. Pantalla Productos

Por ahora es un shell/placeholder funcional.

Debe mostrar algo equivalente a:

```text
Productos

Aquí podrás buscar y consultar los productos registrados.

La gestión de productos se habilitará en la siguiente fase.
```

No mostrar datos falsos.

No insertar productos demo.

No consultar `ProductRepository`.

No construir todavía:

- ProductList real;
- Search real;
- CreateProduct;
- EditProduct;
- ProductDetail.

---

## 12. Pantalla Escáner

Debe mostrar un placeholder claro.

Ejemplo conceptual:

```text
Escáner

Escanea el código de barras de un producto para localizarlo.

El escáner se habilitará próximamente.
```

No solicitar permiso de cámara.

No instalar cámara.

No mostrar una cámara falsa.

No implementar códigos de barras.

---

## 13. Pantalla Bodegas

Debe mostrar un shell/placeholder.

Ejemplo:

```text
Bodegas

Consulta los espacios donde registras tu mercancía.

La gestión de bodegas se habilitará próximamente.
```

No consultar `WarehouseRepository`.

No crear bodegas demo.

No implementar CRUD.

No implementar mapa.

---

## 14. Navegación desde Inicio

Los accesos de Inicio deben usar navegación real de Expo Router.

Esperado:

```text
Buscar producto → Productos
Escanear código → Escáner
Ver bodegas → Bodegas
```

Usa `Link`, `router.push`, `router.navigate` o la API actual apropiada.

No uses hacks con estado local para simular navegación.

---

## 15. Botón Android Back

La navegación debe respetar el comportamiento estándar de Expo Router/React Navigation.

No interceptes manualmente el botón Back.

No implementes handlers personalizados todavía.

---

## 16. Safe areas

La interfaz no debe quedar debajo de barras del sistema de forma incorrecta.

Usa la estrategia apropiada ya disponible en el proyecto.

No instales dependencias nuevas únicamente para esto.

---

## 17. Componentes compartidos

Puedes crear una carpeta como:

```text
src/components/
```

y componentes pequeños si aportan valor real.

Ejemplos aceptables:

```text
Screen
ActionCard
EmptyState
```

No crear:

- Button framework completo;
- Typography system complejo;
- design tokens extensos;
- theme engine;
- Storybook.

---

## 18. Estilos

Usa:

```text
StyleSheet
```

y componentes React Native.

Evita números/estilos repetidos excesivamente cuando una constante local sencilla pueda resolverlo.

Puedes definir una pequeña paleta local si facilita coherencia, pero no construyas todavía temas claro/oscuro personalizados.

---

## 19. Apariencia

La app debe verse limpia y funcional.

Dirección visual:

```text
simple
industrial
clara
utilitaria
```

CORONAPP se usará mientras el usuario está trabajando, por lo que la legibilidad es más importante que el adorno.

Evita:

- gradientes innecesarios;
- animaciones decorativas;
- sombras exageradas;
- cards excesivas;
- texto pequeño;
- interfaces tipo dashboard empresarial.

---

## 20. Accesibilidad básica

Para controles táctiles:

- usa áreas de toque razonables;
- labels comprensibles;
- no dependas exclusivamente de color;
- usa `accessibilityRole` cuando corresponda.

No hace falta una auditoría WCAG completa en esta fase.

---

## 21. Textos

Todos los textos visibles deben estar en español.

Usa lenguaje corto y directo.

No usar Lorem Ipsum.

No inventar estadísticas ni información de inventario.

---

## 22. Offline

La navegación debe funcionar sin Internet.

No agregar:

- fetch;
- APIs remotas;
- imágenes remotas;
- fuentes remotas obligatorias.

---

## 23. Base de datos

No modifiques:

- esquema;
- migraciones;
- repositorios;
- tipos de dominio,

salvo que detectes un error real que impida compilar.

Las pantallas de Fase 3 NO deben consultar repositorios.

La finalidad es únicamente navegación y shell visual.

---

## 24. No implementar Fase 4

Está prohibido implementar:

```text
crear producto
editar producto
eliminar producto
buscar producto realmente
detalle de producto
formularios
validaciones de producto
```

Aunque ya exista `ProductRepository`.

---

## 25. No implementar fases posteriores

Tampoco implementar:

```text
cámara
barcode scanner
CRUD de bodegas
mapas
tarimas
fotografías
historial
GPS
backups
```

---

## 26. Rutas futuras

No crees decenas de rutas vacías para fases futuras.

Solo las rutas necesarias para la navegación actual.

El Root Stack queda preparado conceptualmente para crecer, pero no agregues pantallas inexistentes.

---

## 27. Manejo del título/header

Evita tener simultáneamente:

- título dentro de pantalla;
- header duplicado con el mismo título;

si se ve redundante.

Para las tabs puedes optar por ocultar headers y dibujar el encabezado dentro de cada pantalla, o configurar headers coherentes mediante Expo Router.

Elige una estrategia consistente en las cuatro secciones.

Documenta brevemente la decisión en el reporte.

---

## 28. Estado activo de tab

La barra de tabs debe reflejar correctamente cuál sección está activa mediante el comportamiento estándar del navegador.

No implementes un estado manual paralelo.

---

## 29. Home como ruta inicial

Al abrir la app debe mostrarse:

```text
Inicio
```

No Productos, Scanner ni Bodegas.

---

## 30. Reinicio

Cierra/reinicia Metro o vuelve a cargar la app durante la verificación.

La ruta inicial y navegación deben seguir funcionando.

No depender de un hot reload previo.

---

## 31. Pruebas manuales mínimas

Verifica:

1. app inicia en Inicio;
2. Inicio → Productos;
3. Inicio → Escáner;
4. Inicio → Bodegas;
5. tab Inicio funciona;
6. tab Productos funciona;
7. tab Escáner funciona;
8. tab Bodegas funciona;
9. no hay rutas 404;
10. no hay warnings evidentes de navegación;
11. DatabaseProvider sigue inicializando correctamente;
12. segundo arranque sigue funcionando.

Si no hay dispositivo Android disponible, verifica todo lo posible mediante bundle/Metro y declara la limitación.

---

## 32. Verificación del árbol de rutas

Comprueba que Expo Router reconoce las rutas nuevas.

No deben aparecer warnings por rutas duplicadas o pantallas inexistentes.

---

## 33. TypeScript

Mantén:

```text
strict
sin any
sin @ts-ignore
```

No debilites `tsconfig.json`.

---

## 34. Lint

No deshabilites reglas para hacer pasar la fase.

Si una regla es incómoda, corrige el código.

---

## 35. Git

Antes de finalizar:

```bash
git status
git diff
git diff --check
```

Si hay archivos nuevos sin seguimiento:

```bash
git status --short
```

y revísalos explícitamente.

No hagas commit.

No hagas push.

---

## 36. Verificaciones técnicas obligatorias

Ejecuta:

```bash
npm run lint
npm run typecheck
npx expo install --check
npx expo config --type public
```

Inicia Metro.

Si es posible, solicita el bundle Android para comprobar compilación.

---

## 37. Dependencias

Al finalizar confirma que no se agregaron dependencias.

Si por una razón inesperada Expo exige una dependencia para que el Tabs layout funcione, detente y justifica antes de agregar algo no previsto.

---

## 38. Criterios de aceptación

La Fase 3 está lista para revisión si:

1. existe Root Stack;
2. DatabaseProvider sigue integrado una sola vez;
3. existe grupo `(tabs)`;
4. existen las cuatro tabs;
5. Inicio es ruta inicial;
6. Inicio muestra CORONAPP;
7. Inicio tiene accesos a Productos, Escáner y Bodegas;
8. dichos accesos navegan realmente;
9. Productos tiene placeholder honesto;
10. Escáner tiene placeholder honesto;
11. Bodegas tiene placeholder honesto;
12. no hay CRUD;
13. no hay consultas a repositorios desde UI;
14. no hay cámara;
15. no hay mapas;
16. no hay datos demo;
17. todos los textos visibles están en español;
18. no hay dependencias nuevas;
19. TypeScript pasa;
20. lint pasa;
21. Expo dependency check pasa;
22. Metro inicia;
23. bundle Android compila si el entorno lo permite;
24. no se avanzó a Fase 4.

---

## 39. Formato obligatorio del reporte final

Responde con:

### Cambios realizados
Resumen de navegación y UI.

### Archivos creados/modificados
Lista exacta y propósito.

### Navegación final
Describe el árbol de rutas resultante.

### Decisiones visuales
Explica brevemente:
- estrategia de header;
- tabs;
- componentes compartidos;
- estilo general.

### Dependencias
Confirma si se agregó alguna. La expectativa es ninguna.

### Verificaciones manuales
Lista los flujos realmente comprobados.

### Verificaciones técnicas
Formato:

```text
comando → resultado
```

### Git diff
Resumen.

### Limitaciones
Qué no pudo comprobarse.

### Estado
Indica únicamente:

```text
FASE 3 LISTA PARA REVISIÓN FINAL
```

o:

```text
FASE 3 AÚN REQUIERE CORRECCIONES
```

---

## 40. Detente

Después de esta tarea:

**NO avances a Fase 4.**

No implementes CRUD de productos.

No conectes pantallas con repositorios.

No agregues cámara.

Espera revisión.
