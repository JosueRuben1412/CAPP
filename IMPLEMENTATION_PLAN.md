# CORONAPP — IMPLEMENTATION PLAN

## 1. Propósito de este documento

Este documento define cómo debe construirse CORONAPP por etapas controladas.

La especificación funcional principal se encuentra en:

```text
CORONAPP_SPEC_CODEX.md
```

Este archivo NO reemplaza esa especificación. Su objetivo es convertirla en una secuencia de implementación segura, verificable y mantenible.

La regla principal del proyecto es:

> Codex implementa una sola fase a la vez. No debe anticipar funcionalidades de fases posteriores.

Cada fase debe terminar con:

- proyecto compilando;
- TypeScript sin errores;
- navegación funcional cuando aplique;
- migraciones correctas cuando aplique;
- validaciones básicas;
- pruebas razonables;
- reporte de cambios;
- sin introducir funcionalidades fuera del alcance.

---

# 2. Filosofía de implementación

CORONAPP es una aplicación:

- personal;
- offline-first;
- Android-first;
- sin backend;
- sin cuentas;
- sin sincronización;
- sin QR;
- sin multiusuario.

Tecnologías objetivo:

```text
React Native
Expo
TypeScript
Expo Router
SQLite
```

Persistencia:

```text
SQLite local
+
archivos locales para fotos y mapas
```

La prioridad no es construir muchas funcionalidades rápidamente.

La prioridad es:

```text
correcto
↓
simple
↓
mantenible
↓
rápido de usar
```

---

# 3. Reglas permanentes para Codex

Estas reglas aplican a TODAS las fases.

## 3.1 No adelantarse

Codex NO debe implementar funcionalidades de fases posteriores sin autorización explícita.

Ejemplo:

Si estamos implementando productos:

```text
NO agregar todavía:
- mapas;
- tarimas;
- historial;
- GPS;
- backups;
```

aunque crea que podrían ser útiles.

---

## 3.2 No cambiar arquitectura sin justificarlo

Si Codex considera necesario:

- cambiar una librería;
- modificar el modelo de datos;
- eliminar una tabla;
- cambiar Expo Router;
- cambiar SQLite;
- introducir un ORM;

debe explicarlo antes de realizar un cambio estructural importante.

---

## 3.3 TypeScript estricto

Evitar:

```ts
any
```

salvo una razón técnica excepcional y documentada.

---

## 3.4 Componentes sin SQL

Los componentes de interfaz NO deben ejecutar consultas SQL directamente.

Flujo esperado:

```text
UI
↓
hook / service / use case
↓
repository
↓
SQLite
```

---

## 3.5 Una fuente de verdad

SQLite será la fuente principal de verdad para los datos del dominio.

No mantener copias paralelas innecesarias de datos persistentes.

---

## 3.6 Aplicación funcional después de cada fase

No dejar el proyecto en un estado en el cual:

- no compile;
- no abra;
- tenga rutas rotas;
- necesite que otra fase futura arregle errores actuales.

---

# 4. Flujo de trabajo conmigo y Codex

Para cada fase:

```text
1. Se selecciona una fase.
2. Se prepara un prompt concreto para Codex.
3. Codex implementa solamente esa fase.
4. Codex ejecuta verificaciones.
5. Codex reporta cambios y problemas.
6. Se revisa el resultado.
7. Si existen errores, se corrigen.
8. Solo entonces se continúa.
```

Nunca dar a Codex instrucciones como:

```text
"Construye toda CORONAPP"
```

o:

```text
"Implementa todas las fases"
```

---

# 5. Definición de terminado

Una fase está terminada únicamente cuando:

- cumple sus criterios de aceptación;
- no existen errores TypeScript;
- no existen errores evidentes de ejecución;
- las migraciones funcionan si fueron modificadas;
- el código respeta la arquitectura;
- no se introdujeron funcionalidades fuera del alcance;
- Codex entrega un resumen de archivos creados/modificados;
- Codex indica cómo verificar manualmente la fase.

---

# 6. Fases

---

# FASE 0 — Inicialización del repositorio

## Objetivo

Crear una base limpia y estable del proyecto móvil.

## Implementar

Crear proyecto Expo con:

```text
React Native
Expo
TypeScript
Expo Router
```

Configurar:

- estructura básica;
- TypeScript estricto;
- ESLint;
- scripts principales;
- alias de imports si son necesarios;
- rutas iniciales;
- pantalla inicial mínima.

Estructura inicial sugerida:

```text
src/
├── app/
├── components/
├── features/
├── database/
├── repositories/
├── services/
├── hooks/
├── types/
├── utils/
└── constants/
```

La estructura puede adaptarse a las convenciones actuales de Expo Router siempre que la separación conceptual se mantenga.

## No implementar todavía

- SQLite;
- productos;
- cámara;
- mapas;
- bodegas;
- tarimas;
- fotografías.

## Criterios de aceptación

- la app abre;
- existe una pantalla inicial;
- Expo Router funciona;
- TypeScript estricto;
- lint sin errores críticos;
- no hay dependencias innecesarias.

## Verificación

Codex debe ejecutar los comandos disponibles equivalentes a:

```text
npm install
npm run lint
npx tsc --noEmit
```

y comprobar que Expo puede iniciar correctamente.

---

# FASE 1 — Infraestructura SQLite

## Objetivo

Crear la infraestructura de persistencia local antes de desarrollar funcionalidades.

## Implementar

Agregar:

```text
expo-sqlite
```

Crear módulo de base de datos.

Responsabilidades:

- abrir base de datos;
- inicializarla;
- ejecutar migraciones;
- administrar versión del esquema;
- manejar errores de inicialización.

Crear una tabla interna de migraciones o utilizar una estrategia equivalente clara.

Ejemplo conceptual:

```text
database/
├── db.ts
├── migrations/
│   ├── 001_initial_schema.ts
│   └── index.ts
└── migrate.ts
```

## Tablas iniciales

Crear:

```text
Product
Warehouse
Pallet
PalletProduct
ProductLocation
LocationHistory
```

según la especificación principal.

## Requisitos

Agregar:

- claves primarias;
- claves foráneas;
- índices;
- restricciones razonables;
- timestamps;
- `PRAGMA foreign_keys = ON` si corresponde.

## No implementar

- interfaces de usuario CRUD;
- repositorios completos;
- cámara;
- mapas.

## Criterios de aceptación

- base de datos se crea al primer inicio;
- reiniciar la app no recrea destructivamente los datos;
- migraciones pueden ejecutarse de forma idempotente;
- todas las tablas existen;
- índices principales existen.

---

# FASE 2 — Tipos y repositorios base

## Objetivo

Separar correctamente dominio y persistencia antes de crear UI.

## Implementar

Tipos TypeScript para:

```text
Product
Warehouse
Pallet
PalletProduct
ProductLocation
LocationHistory
```

Crear repositorios.

Ejemplo:

```text
ProductRepository
WarehouseRepository
PalletRepository
```

Cada repositorio debe encapsular SQLite.

## Operaciones mínimas

Para `ProductRepository`:

```text
create
getById
getByBarcode
list
search
update
delete
```

Para los demás repositorios, implementar solo operaciones básicas necesarias para fases futuras.

## Criterios de aceptación

- componentes no conocen SQL;
- repositorios están tipados;
- errores de SQLite se propagan de forma consistente;
- búsquedas principales funcionan;
- sin `any`.

---

# FASE 3 — Shell visual y navegación principal

## Objetivo

Definir la navegación real del MVP antes de añadir funcionalidad compleja.

## Implementar

Pantallas vacías o mínimas para:

```text
Inicio
Productos
Escáner
Bodegas
```

Diseñar navegación principal.

La pantalla de inicio debe priorizar:

```text
Buscar producto
Escanear código
Ver bodegas
```

## Requisitos UX

- controles grandes;
- interfaz simple;
- uso cómodo en Android;
- textos en español;
- no crear un diseño excesivamente decorativo.

## Criterios de aceptación

- navegación completa entre secciones;
- botón atrás funciona correctamente;
- no existen rutas muertas;
- shell visual coherente.

---

# FASE 4 — CRUD de productos

## Objetivo

Crear el primer flujo funcional completo de CORONAPP.

## Implementar

Pantallas:

```text
ProductList
ProductSearch
ProductDetail
CreateProduct
EditProduct
```

Campos:

```text
name
barcode
brand
category
notes
imagePath
```

La fotografía puede quedar sin implementación real hasta la fase correspondiente.

## Validaciones

```text
name obligatorio
barcode opcional
barcode único cuando exista
```

## Eliminación

La eliminación debe solicitar confirmación.

## Criterios de aceptación

El usuario puede:

1. crear producto;
2. cerrar aplicación;
3. abrir nuevamente;
4. encontrar producto;
5. editarlo;
6. eliminarlo.

Todo debe persistir localmente.

---

# FASE 5 — Búsqueda optimizada

## Objetivo

Hacer que localizar productos por texto sea rápido.

## Implementar

Buscar por:

```text
name
brand
barcode
```

Coincidencia parcial.

Agregar debounce solo si realmente mejora la experiencia.

La búsqueda debe ser completamente local.

## Criterios de aceptación

Buscar:

```text
reg
```

debe encontrar productos como:

```text
Regio Rinde+
Regio 12 rollos
```

La UI debe manejar:

```text
sin resultados
resultado único
múltiples resultados
```

---

# FASE 6 — Escáner de códigos de barras

## Objetivo

Permitir localizar productos físicamente mediante el código de barras.

## Implementar

Cámara con APIs actuales de Expo.

Flujo:

```text
abrir scanner
↓
leer barcode
↓
buscar en SQLite
↓
producto existente → ProductDetail
producto inexistente → CreateProduct
```

El barcode debe precargarse al crear producto.

## Requisitos importantes

Evitar múltiples lecturas consecutivas del mismo código.

Manejar:

- permiso concedido;
- permiso rechazado;
- cámara no disponible;
- error de lectura.

## Criterios de aceptación

El escáner funciona sin Internet.

---

# FASE 7 — CRUD de bodegas

## Objetivo

Permitir definir los espacios físicos principales.

## Implementar

Pantallas:

```text
WarehouseList
WarehouseDetail
CreateWarehouse
EditWarehouse
```

Campos:

```text
name
description
mapImagePath
```

La edición visual del mapa se implementará después.

## Criterios de aceptación

Crear, editar, consultar y eliminar bodegas.

Al eliminar una bodega que tenga datos asociados:

- bloquear eliminación;
o
- pedir una confirmación muy explícita.

No eliminar información relacionada accidentalmente.

---

# FASE 8 — Sistema local de archivos

## Objetivo

Crear una forma correcta de manejar fotografías y mapas.

## Implementar

Servicio local de archivos.

Responsabilidades:

```text
guardar imagen
copiar imagen
eliminar imagen
obtener URI
crear directorios
validar existencia
```

Directorios conceptuales:

```text
/photos/products/
/photos/pallets/
/maps/
```

## Requisitos

NO guardar imágenes como BLOB dentro de SQLite.

SQLite solo guarda rutas.

## Criterios de aceptación

Una imagen guardada permanece disponible después de reiniciar la aplicación.

---

# FASE 9 — Fotografías de productos

## Objetivo

Agregar soporte visual al catálogo.

## Implementar

En productos:

- tomar fotografía;
- seleccionar una fotografía si la API lo permite;
- reemplazar;
- eliminar.

Integrar con el servicio de archivos.

## Criterios de aceptación

- foto persiste;
- reemplazar no deja referencias incorrectas;
- eliminación no rompe el producto.

---

# FASE 10 — Imagen/plano de bodega

## Objetivo

Permitir que cada bodega tenga una representación visual.

## Implementar

Desde `WarehouseDetail`:

```text
Agregar plano
Cambiar plano
Eliminar plano
```

Inicialmente el plano será una imagen.

NO construir todavía un editor de planos.

## Criterios de aceptación

- plano aparece correctamente;
- conserva proporción;
- puede reemplazarse;
- persiste después de reiniciar.

---

# FASE 11 — Componente WarehouseMap

## Objetivo

Crear el componente técnico más importante del proyecto.

## Implementar

Componente reutilizable:

```text
WarehouseMap
```

Debe poder:

- renderizar imagen del plano;
- hacer zoom;
- hacer pan;
- mostrar marcadores;
- permitir seleccionar un punto;
- convertir coordenadas de pantalla a coordenadas normalizadas;
- convertir coordenadas normalizadas a pantalla.

Formato:

```text
x: 0..1
y: 0..1
```

## Importante

Las coordenadas almacenadas NO dependen:

- de resolución;
- de tamaño de pantalla;
- de zoom actual.

## Criterios de aceptación

Un marcador guardado en:

```json
{
  "x": 0.67,
  "y": 0.43
}
```

debe aparecer aproximadamente en la misma posición física independientemente del tamaño de pantalla.

---

# FASE 12 — CRUD de tarimas

## Objetivo

Representar agrupaciones físicas de productos.

## Implementar

Pantallas:

```text
PalletList
PalletDetail
CreatePallet
EditPallet
```

Campos:

```text
warehouseId
name
mapX
mapY
reference
photoPath
notes
```

## Crear tarima

Flujo:

```text
elegir bodega
↓
abrir mapa
↓
tocar ubicación
↓
agregar referencia opcional
↓
guardar
```

## Criterios de aceptación

La tarima aparece como marcador en el mapa.

---

# FASE 13 — Relación producto ↔ tarima

## Objetivo

Permitir saber qué productos contiene cada tarima.

## Implementar

Relación muchos-a-muchos:

```text
PalletProduct
```

Desde tarima:

```text
Agregar producto
Quitar producto
```

Desde producto:

```text
Ver tarimas donde aparece
Agregar a tarima
```

## Regla

No duplicar:

```text
mismo productId + mismo palletId
```

## Criterios de aceptación

Un producto puede aparecer en más de una tarima.

Una tarima puede contener múltiples productos.

---

# FASE 14 — Localización desde ProductDetail

## Objetivo

Convertir el catálogo en una herramienta real de búsqueda física.

## Implementar

En ProductDetail mostrar:

```text
bodega
tarima
referencia
última actualización
foto
botón Ver en mapa
```

Si aparece en varias tarimas, mostrarlas todas.

## Criterios de aceptación

Flujo completo:

```text
buscar producto
↓
abrir producto
↓
ver tarima
↓
ver ubicación
↓
abrir mapa
```

---

# FASE 15 — Mover tarimas

## Objetivo

Hacer fácil mantener la información actualizada.

## Implementar

Acción:

```text
Mover tarima
```

Flujo:

```text
PalletDetail
↓
Mover
↓
mapa
↓
seleccionar nueva posición
↓
referencia opcional
↓
guardar
```

Antes de modificar la posición actual:

1. capturar ubicación anterior;
2. crear `LocationHistory`;
3. actualizar `Pallet`.

## Criterios de aceptación

Mover nunca destruye silenciosamente la ubicación anterior.

---

# FASE 16 — Historial

## Objetivo

Consultar posiciones anteriores.

## Implementar

Pantalla:

```text
LocationHistory
```

Orden:

```text
más reciente primero
```

Mostrar:

- fecha;
- bodega;
- posición;
- referencia;
- foto si existe.

## Criterios de aceptación

Después de mover una tarima varias veces, todas las posiciones previas pueden consultarse.

---

# FASE 17 — Ubicación directa de producto

## Objetivo

Soportar mercancía que no esté asociada a una tarima.

## Implementar

Usar:

```text
ProductLocation
```

Desde `ProductDetail`:

```text
Asignar ubicación directa
Cambiar ubicación
Eliminar ubicación
```

También debe generar historial.

## Prioridad

Esta fase puede posponerse si durante pruebas reales se confirma que casi todo se administra mediante tarimas.

No implementar antes de validar esa necesidad.

---

# FASE 18 — Fotografías de tarimas y ubicación

## Objetivo

Mejorar el reconocimiento visual.

## Implementar

En Pallet:

- tomar foto;
- reemplazar foto;
- verla a tamaño grande.

Considerar foto opcional al mover una tarima.

## Criterios de aceptación

El archivo queda almacenado localmente y las rutas son válidas.

---

# FASE 19 — Experiencia de uso rápido

## Objetivo

Optimizar la app para uso real dentro de la bodega.

## Revisar

Número de toques necesarios para:

```text
buscar producto
escanear producto
ver mapa
mover tarima
```

Optimizar:

- botones;
- navegación;
- teclado;
- autofocus;
- búsqueda;
- formularios;
- acceso a cámara.

## Meta

Una actualización de ubicación sencilla debería poder completarse aproximadamente en:

```text
< 15 segundos
```

sin contar el tiempo físico de caminar por la bodega.

---

# FASE 20 — Manejo de errores y estados vacíos

## Objetivo

Evitar que la aplicación falle silenciosamente.

## Revisar todas las pantallas

Estados:

```text
loading
success
empty
error
```

Aunque SQLite sea rápido, manejar correctamente errores.

Incluir mensajes útiles.

Ejemplo:

```text
"No hay productos registrados todavía."
```

mejor que:

```text
[]
```

---

# FASE 21 — Integridad y limpieza de archivos

## Objetivo

Evitar archivos huérfanos y datos inconsistentes.

## Implementar/revisar

Cuando una foto es reemplazada:

- eliminar anterior cuando sea seguro.

Cuando una entidad es eliminada:

- limpiar archivos asociados cuando corresponda.

Agregar utilidades para detectar archivos sin referencia si es necesario.

---

# FASE 22 — Respaldo local

## Objetivo

Evitar perder todo el trabajo si se borra la aplicación o cambia el teléfono.

## Implementar

Exportar respaldo.

Contenido conceptual:

```text
database.sqlite
photos/
maps/
manifest.json
```

Empaquetar en un archivo portable.

Ejemplo:

```text
coronapp-backup-2026-09-14.zip
```

## Importar

Validar:

- estructura;
- versión;
- integridad básica.

Antes de restaurar, solicitar confirmación.

## Criterios de aceptación

Escenario:

```text
crear datos
↓
exportar
↓
eliminar/restablecer datos
↓
importar
↓
recuperar productos, bodegas, mapas y fotos
```

---

# FASE 23 — Pruebas integrales

## Objetivo

Validar los principales recorridos completos.

## Caso A — Producto

```text
crear
buscar
editar
reiniciar app
buscar nuevamente
```

## Caso B — Escáner

```text
escanear nuevo
crear
volver a escanear
abrir existente
```

## Caso C — Tarima

```text
crear bodega
agregar plano
crear tarima
ubicarla
agregar producto
buscar producto
ver tarima
ver mapa
```

## Caso D — Movimiento

```text
mover tarima
consultar ubicación nueva
consultar historial
```

## Caso E — Offline

Realizar todas las operaciones principales con:

```text
modo avión
```

---

# FASE 24 — Pulido del MVP

## Objetivo

Preparar una versión realmente utilizable.

## Revisar

- nombres;
- iconos;
- navegación;
- accesibilidad básica;
- Android back button;
- permisos;
- teclado;
- formularios;
- errores;
- rendimiento;
- tamaño de imágenes;
- persistencia;
- migraciones.

## Resultado esperado

Una versión que pueda instalarse en el teléfono y probarse durante una jornada real.

---

# 7. Fases que NO deben comenzar hasta validar el MVP

No desarrollar todavía:

```text
GPS
sincronización cloud
backend
usuarios
QR
IA
rutas óptimas
realidad aumentada
Bluetooth
UWB
inventarios
precios
ventas
```

---

# 8. GPS

El GPS queda explícitamente fuera de las primeras fases.

Primero se probará:

```text
mapa 2D
+
coordenadas normalizadas
+
foto
+
referencia
```

Si después de uso real surge una necesidad concreta para GPS, se diseñará como una fase independiente.

No adaptar prematuramente el modelo de datos a GPS.

---

# 9. Prioridades reales del MVP

Orden de valor para el usuario:

```text
1. encontrar producto
2. saber en qué bodega está
3. saber en qué tarima está
4. verlo en el mapa
5. reconocerlo mediante foto/referencia
6. actualizar rápidamente su posición
7. conservar historial
8. proteger datos mediante respaldo
```

Cualquier decisión debe favorecer estos flujos.

---

# 10. Primer milestone funcional

Se considerará alcanzado el primer milestone importante cuando pueda hacerse:

```text
Crear producto
↓
Crear bodega
↓
Asignar plano
↓
Crear tarima
↓
Ubicar tarima en mapa
↓
Agregar producto a tarima
↓
Buscar producto
↓
Ver dónde está
```

Este milestone corresponde aproximadamente a las fases 0–14.

---

# 11. Segundo milestone funcional

Se alcanzará cuando además sea posible:

```text
Mover tarima
↓
Guardar ubicación anterior
↓
Consultar historial
↓
Usar fotografías
```

Corresponde aproximadamente a las fases 15–18.

---

# 12. MVP completo

El MVP estará completo aproximadamente al finalizar:

```text
Fase 24
```

Siempre sujeto a pruebas reales.

Las fases pueden dividirse todavía más si durante la implementación una tarea resulta demasiado grande.

---

# 13. Formato de prompt para Codex

Cada tarea enviada a Codex debe seguir aproximadamente esta estructura:

```text
Contexto:
Lee CORONAPP_SPEC_CODEX.md e IMPLEMENTATION_PLAN.md.

Fase actual:
FASE X — <nombre>

Objetivo:
<objetivo concreto>

Implementa solamente:
- ...
- ...
- ...

No implementes:
- ...
- ...
- ...

Restricciones:
- TypeScript estricto.
- No usar any.
- No SQL en componentes UI.
- No dependencias innecesarias.
- Android prioritario.
- Offline-first.

Criterios de aceptación:
1. ...
2. ...
3. ...

Antes de finalizar:
- ejecuta lint;
- ejecuta typecheck;
- ejecuta pruebas aplicables;
- corrige errores encontrados.

Al finalizar responde con:
1. resumen de cambios;
2. archivos creados/modificados;
3. decisiones técnicas;
4. comandos ejecutados;
5. resultado de verificaciones;
6. cualquier limitación pendiente.

No avances a la siguiente fase.
```

---

# 14. Regla de revisión

Después de cada tarea de Codex se revisará:

```text
¿compila?
¿cumple el alcance?
¿introdujo dependencias innecesarias?
¿respetó el modelo?
¿hay deuda técnica evidente?
¿se puede probar manualmente?
```

Si la respuesta a cualquiera es negativa, no se continúa.

---

# 15. Primera tarea para Codex

La primera tarea será:

```text
FASE 0 — Inicialización del repositorio
```

No se le pedirá todavía:

- SQLite;
- base de datos;
- cámara;
- mapas;
- productos.

El objetivo es comenzar con una base limpia antes de acumular complejidad.

---

# 16. Principio final

CORONAPP debe evolucionar a partir del uso real.

No intentar anticipar todos los problemas de una bodega.

El ciclo será:

```text
implementar
↓
probar
↓
usar
↓
detectar fricción
↓
mejorar
```

La mejor versión de CORONAPP no será la que tenga más funciones.

Será la que permita encontrar mercancía con el menor esfuerzo posible.
