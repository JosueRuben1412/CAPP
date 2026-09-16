# CORONAPP — Especificación inicial del proyecto

## 1. Resumen

**CORONAPP** es una aplicación móvil de uso personal para localizar mercancía dentro de una bodega cuyo acomodo cambia constantemente.

El problema principal es que las tarimas y cajas de mercancía se almacenan conforme van llegando, por lo que los productos no siempre permanecen en el mismo lugar. La bodega puede tener una clasificación general, por ejemplo:

- Bodega de higiénicos y desechables
- Bodega de limpieza
- Bodega de abarrotes

Sin embargo, dentro de cada bodega no existe una posición fija y confiable para cada producto.

El objetivo de CORONAPP es permitir registrar rápidamente dónde se encuentra un producto o una tarima y consultarlo posteriormente sin depender de la memoria del usuario.

La aplicación es de **uso exclusivamente personal**.

---

## 2. Objetivo principal

Permitir que el usuario pueda:

1. Registrar productos.
2. Buscar productos por nombre.
3. Escanear códigos de barras.
4. Registrar la ubicación aproximada de un producto o tarima dentro de un mapa 2D de la bodega.
5. Asociar fotografías y referencias textuales a una ubicación.
6. Actualizar fácilmente la ubicación cuando la mercancía se mueve.
7. Consultar el historial de ubicaciones.
8. Usar la aplicación sin conexión a Internet.

La prioridad del proyecto es la **velocidad de uso**, no la administración formal de inventarios.

---

## 3. Contexto de uso

El usuario trabaja principalmente los fines de semana en una abarrotera.

Una de sus tareas consiste en localizar cajas de mercancía dentro de bodegas y bajarlas al área de venta para que posteriormente otros trabajadores acomoden los productos.

El problema es que entre una semana y otra:

- llegan nuevas tarimas;
- se mueve mercancía;
- se ocupan espacios vacíos;
- cambian los pasillos;
- cambian las posiciones relativas de las tarimas;
- los productos pueden quedar detrás de otros productos;
- no existe una ubicación fija por SKU.

Por lo tanto, CORONAPP no debe asumir que una posición registrada es permanente.

---

## 4. Principios del producto

### 4.1 Offline-first

La aplicación debe funcionar completamente sin conexión a Internet.

No debe ser obligatorio:

- iniciar sesión;
- conectarse a un backend;
- conectarse a Supabase;
- conectarse a Firebase;
- descargar información;
- sincronizar datos con otro dispositivo.

Toda la información principal debe almacenarse localmente en el teléfono.

---

### 4.2 Uso personal

CORONAPP está diseñada para un solo usuario.

No implementar:

- cuentas de usuario;
- roles;
- permisos;
- colaboración;
- sincronización entre trabajadores;
- sistema multiusuario;
- auditoría por diferentes empleados.

Si en el código se necesita identificar al usuario, puede asumirse un único propietario local de la aplicación.

---

### 4.3 Simplicidad

La aplicación debe permitir realizar las operaciones frecuentes con pocos pasos.

Registrar o actualizar una ubicación debería poder realizarse idealmente en menos de 15 segundos.

Evitar formularios innecesariamente largos.

---

### 4.4 La ubicación puede quedar desactualizada

Una ubicación registrada no debe considerarse permanentemente correcta.

Cada ubicación debe guardar:

- fecha de creación;
- fecha de última actualización;
- fotografía opcional;
- referencia textual opcional;
- posición dentro del mapa;
- bodega asociada.

La interfaz debe mostrar claramente cuándo fue actualizada por última vez.

---

## 5. Alcance del MVP

El MVP debe incluir las siguientes funcionalidades.

### 5.1 Productos

Crear y administrar productos con al menos:

- id interno;
- código de barras opcional;
- nombre;
- marca opcional;
- categoría opcional;
- fotografía opcional;
- notas opcionales;
- fecha de creación;
- fecha de actualización.

Debe ser posible:

- crear producto;
- editar producto;
- eliminar producto;
- buscar producto;
- abrir detalle de producto.

---

### 5.2 Código de barras

La aplicación debe poder utilizar la cámara del teléfono para leer códigos de barras.

Flujo esperado:

1. Usuario abre el escáner.
2. Escanea el código.
3. Se consulta SQLite localmente.
4. Si existe:
   - abrir producto.
5. Si no existe:
   - ofrecer crear un producto utilizando ese código.

El código de barras no requiere ninguna consulta a Internet.

---

## 6. Bodegas

Debe ser posible crear varias bodegas.

Ejemplo:

```text
Bodega de higiénicos y desechables
Bodega de limpieza
Bodega de abarrotes
```

Cada bodega debe contener:

- id;
- nombre;
- descripción opcional;
- mapa/plano;
- fecha de creación;
- fecha de actualización.

---

## 7. Mapa de la bodega

Cada bodega puede tener un mapa 2D.

El mapa NO debe depender de Google Maps.

El mapa representa únicamente el espacio interno de la bodega.

Ejemplo conceptual:

```text
┌─────────────────────────────────────┐
│                                     │
│       Tarima          Tarima        │
│                                     │
│                 ●                   │
│              Producto               │
│                                     │
│ Tarima                              │
│                                     │
│                 ENTRADA             │
└─────────────────────────────────────┘
```

### 7.1 Primera implementación

Para el MVP, el plano puede ser una imagen cargada o creada por el usuario.

Debe permitirse colocar marcadores sobre el mapa mediante toque.

El marcador debe almacenarse usando coordenadas normalizadas:

```text
x: 0.0 .. 1.0
y: 0.0 .. 1.0
```

Ejemplo:

```json
{
  "x": 0.67,
  "y": 0.43
}
```

Esto permite mantener la posición independientemente del tamaño o resolución de pantalla.

### 7.2 Interacción del mapa

El usuario debe poder:

- visualizar el plano;
- hacer zoom;
- desplazarse;
- tocar una posición;
- colocar un marcador;
- mover un marcador;
- seleccionar un marcador existente.

La implementación debe priorizar simplicidad y estabilidad.

---

## 8. GPS

El GPS NO debe ser el sistema principal de posicionamiento dentro de la bodega.

La precisión del GPS en interiores puede no ser suficiente para distinguir correctamente entre tarimas cercanas.

Sin embargo, la arquitectura puede dejar abierta la posibilidad de utilizar ubicación GPS en el futuro.

Para el MVP:

- no es obligatorio implementar GPS;
- no utilizar GPS para guardar la posición exacta de una tarima;
- la posición interna siempre debe almacenarse mediante coordenadas del mapa 2D.

Si se agrega GPS posteriormente, será una funcionalidad complementaria.

---

## 9. Tarimas

La aplicación debe considerar que múltiples productos pueden encontrarse en una misma tarima.

Entidad sugerida:

```text
Pallet
```

Campos:

```text
id
warehouseId
name
mapX
mapY
reference
photoPath
notes
createdAt
updatedAt
```

Ejemplo:

```text
Tarima 025

Bodega:
Higiénicos y desechables

Posición:
x = 0.67
y = 0.43

Referencia:
Detrás de las cajas de Suavel
```

---

## 10. Relación entre productos y tarimas

Una tarima puede contener varios productos.

Un producto puede aparecer en una o más tarimas.

Utilizar una relación muchos-a-muchos.

Tabla sugerida:

```text
PalletProduct
```

Campos:

```text
id
palletId
productId
createdAt
```

Ejemplo:

```text
Tarima 025
├── Regio 12 rollos
├── Regio 24 rollos
├── Pétalo 12 rollos
└── Servilletas Pétalo
```

---

## 11. Ubicación directa de productos

Aunque el modelo principal puede utilizar tarimas, la arquitectura no debe obligar a que absolutamente todos los productos pertenezcan a una tarima.

Debe ser posible representar productos sueltos si fuera necesario.

Codex debe diseñar el modelo evitando una dependencia rígida que impida esta posibilidad.

---

## 12. Fotografías

Debe ser posible tomar fotografías desde la aplicación.

Las fotografías deben almacenarse localmente.

No almacenar las imágenes como BLOB dentro de SQLite.

Guardar el archivo en el sistema de archivos del dispositivo y almacenar únicamente su ruta en la base de datos.

Ejemplo:

```text
/app-data/photos/pallet-025-001.jpg
```

SQLite:

```text
photoPath = "/app-data/photos/pallet-025-001.jpg"
```

---

## 13. Referencias textuales

Además de la posición visual, cada ubicación o tarima puede contener una referencia escrita.

Ejemplos:

```text
Detrás de Suavel

A la derecha de la entrada

Junto a las cajas de vasos

Hasta el fondo, lado izquierdo

Detrás de la tarima azul
```

La referencia debe ser opcional.

---

## 14. Historial de ubicaciones

Nunca eliminar silenciosamente la ubicación anterior al mover una tarima o producto.

Debe existir historial.

Entidad sugerida:

```text
LocationHistory
```

Campos:

```text
id
entityType
entityId
warehouseId
mapX
mapY
reference
photoPath
createdAt
```

`entityType` puede representar:

```text
product
pallet
```

El historial permitirá observar dónde se encontraba anteriormente la mercancía.

---

## 15. Base de datos

Utilizar SQLite local.

Tecnología sugerida:

```text
expo-sqlite
```

SQLite debe ser la fuente de verdad principal de la aplicación.

No implementar backend para el MVP.

---

## 16. Modelo de datos inicial

### Product

```text
id TEXT PRIMARY KEY
barcode TEXT NULL
name TEXT NOT NULL
brand TEXT NULL
category TEXT NULL
imagePath TEXT NULL
notes TEXT NULL
createdAt TEXT NOT NULL
updatedAt TEXT NOT NULL
```

---

### Warehouse

```text
id TEXT PRIMARY KEY
name TEXT NOT NULL
description TEXT NULL
mapImagePath TEXT NULL
createdAt TEXT NOT NULL
updatedAt TEXT NOT NULL
```

---

### Pallet

```text
id TEXT PRIMARY KEY
warehouseId TEXT NOT NULL
name TEXT NULL
mapX REAL NULL
mapY REAL NULL
reference TEXT NULL
photoPath TEXT NULL
notes TEXT NULL
createdAt TEXT NOT NULL
updatedAt TEXT NOT NULL
```

---

### PalletProduct

```text
id TEXT PRIMARY KEY
palletId TEXT NOT NULL
productId TEXT NOT NULL
createdAt TEXT NOT NULL
```

---

### ProductLocation

Para productos que tengan ubicación propia:

```text
id TEXT PRIMARY KEY
productId TEXT NOT NULL
warehouseId TEXT NOT NULL
mapX REAL NULL
mapY REAL NULL
reference TEXT NULL
photoPath TEXT NULL
createdAt TEXT NOT NULL
updatedAt TEXT NOT NULL
```

---

### LocationHistory

```text
id TEXT PRIMARY KEY
entityType TEXT NOT NULL
entityId TEXT NOT NULL
warehouseId TEXT NOT NULL
mapX REAL NULL
mapY REAL NULL
reference TEXT NULL
photoPath TEXT NULL
createdAt TEXT NOT NULL
```

---

## 17. Tecnología propuesta

### Mobile

```text
React Native
Expo
TypeScript
```

### Base de datos

```text
SQLite
expo-sqlite
```

### Navegación

```text
Expo Router
```

### Cámara y códigos

Utilizar APIs compatibles con Expo para:

- cámara;
- lectura de códigos de barras;
- captura de fotografías.

### Archivos locales

Utilizar las APIs actuales recomendadas por Expo para almacenamiento de archivos locales.

---

## 18. Arquitectura

La aplicación debe evitar colocar consultas SQL directamente dentro de los componentes visuales.

Separar al menos:

```text
UI
↓
casos de uso / servicios
↓
repositorios
↓
SQLite
```

Estructura conceptual:

```text
src/
├── app/
├── components/
├── features/
│   ├── products/
│   ├── warehouses/
│   ├── pallets/
│   ├── scanner/
│   └── map/
├── database/
├── repositories/
├── services/
├── hooks/
├── types/
├── utils/
└── constants/
```

No implementar arquitectura excesivamente compleja.

Priorizar:

- mantenibilidad;
- separación razonable de responsabilidades;
- tipado;
- facilidad para modificar funcionalidades.

---

## 19. Pantallas del MVP

### 19.1 Inicio

Mostrar accesos principales:

```text
Buscar producto
Escanear código
Ver bodegas
Productos recientes
```

El buscador debe ser el elemento principal.

---

### 19.2 Buscar producto

Debe permitir buscar por:

- nombre;
- marca;
- código de barras.

Los resultados deben actualizarse rápidamente desde SQLite.

---

### 19.3 Escáner

Pantalla de cámara para escanear códigos de barras.

Al detectar un código:

```text
si existe producto
    abrir ProductDetail
si no existe
    abrir CreateProduct con barcode precargado
```

Evitar múltiples lecturas consecutivas del mismo código.

---

### 19.4 Detalle de producto

Mostrar:

- nombre;
- marca;
- código;
- fotografía;
- ubicación actual;
- bodega;
- referencia;
- fotografía de ubicación;
- última actualización.

Acciones:

```text
Ver en mapa
Cambiar ubicación
Agregar a tarima
Editar producto
Ver historial
```

---

### 19.5 Lista de bodegas

Mostrar todas las bodegas existentes.

Permitir:

```text
crear
editar
abrir
eliminar
```

La eliminación debe solicitar confirmación.

---

### 19.6 Detalle de bodega

Mostrar:

- nombre;
- mapa;
- tarimas registradas;
- marcadores.

Debe ser posible tocar un marcador para consultar su contenido.

---

### 19.7 Editar mapa

El usuario debe poder definir o reemplazar la imagen que representa el plano de la bodega.

Para el MVP no es necesario construir un editor CAD.

Una imagen de plano es suficiente.

---

### 19.8 Crear tarima

Campos:

```text
nombre opcional
bodega
posición en mapa
referencia
foto
notas
productos
```

La posición se seleccionará tocando el mapa.

---

### 19.9 Detalle de tarima

Mostrar:

```text
foto
bodega
posición
referencia
última actualización
productos contenidos
```

Acciones:

```text
Ver en mapa
Mover tarima
Agregar producto
Quitar producto
Editar
Ver historial
```

---

### 19.10 Cambiar ubicación

Flujo:

```text
Seleccionar bodega
↓
Mostrar mapa
↓
Tocar nueva posición
↓
Escribir referencia opcional
↓
Tomar foto opcional
↓
Guardar
```

Antes de actualizar la posición actual, guardar la ubicación anterior en `LocationHistory`.

---

### 19.11 Historial

Mostrar una lista cronológica.

Ejemplo:

```text
14 sep 2026
Fondo derecha
Foto disponible

7 sep 2026
Centro

31 ago 2026
Entrada izquierda
```

---

## 20. Respaldo local

Debido a que no existe servidor, debe contemplarse un sistema de respaldo.

No es obligatorio implementarlo en la primera iteración, pero la arquitectura no debe impedirlo.

Futuro:

```text
Exportar respaldo
Importar respaldo
```

El respaldo podría contener:

```text
database.sqlite
photos/
maps/
```

El objetivo sería evitar la pérdida total de información si el dispositivo se pierde o se reinstala la aplicación.

---

## 21. Experiencia de usuario

La aplicación debe estar optimizada para ser usada mientras el usuario se encuentra trabajando físicamente en una bodega.

Esto implica:

- botones grandes;
- pocas pulsaciones;
- buena legibilidad;
- uso sencillo con una mano cuando sea posible;
- evitar textos largos;
- evitar animaciones innecesarias;
- búsqueda rápida;
- acceso rápido a cámara y escáner;
- funcionamiento sin red.

---

## 22. Estados que la interfaz debe manejar

Cada pantalla que acceda a información debe contemplar:

```text
loading
success
empty
error
```

En operaciones locales, los tiempos deberían ser muy bajos, pero aun así debe manejarse correctamente cualquier error de SQLite o archivos.

---

## 23. Validaciones

### Producto

```text
name obligatorio
barcode opcional
barcode no duplicado cuando exista
```

### Bodega

```text
name obligatorio
```

### Coordenadas

```text
0 <= mapX <= 1
0 <= mapY <= 1
```

### Relaciones

No permitir duplicar el mismo producto en la misma tarima salvo que posteriormente exista un motivo funcional para hacerlo.

---

## 24. Identificadores

No utilizar IDs autoincrementales como dependencia de negocio.

Preferir UUID o identificadores equivalentes generados localmente.

Ejemplo:

```text
product_550e8400...
```

---

## 25. Fechas

Guardar fechas en formato ISO 8601.

Ejemplo:

```text
2026-09-14T23:15:00-06:00
```

La interfaz puede mostrar versiones amigables:

```text
Hoy, 6:42 PM
Hace 2 días
14 sep 2026
```

---

## 26. Búsqueda

La búsqueda debe ser local.

Debe poder coincidir parcialmente con:

```text
nombre
marca
barcode
```

Ejemplo:

Buscar:

```text
reg
```

Resultados:

```text
Regio Rinde+
Regio 12 rollos
Regio 24 rollos
```

Inicialmente `LIKE` de SQLite es suficiente.

No agregar servicios de búsqueda externos.

---

## 27. Rendimiento

La app debe sentirse inmediata para una base de datos personal.

Se espera un volumen relativamente pequeño o mediano.

Objetivo inicial:

```text
hasta varios miles de productos
cientos de tarimas
miles de registros históricos
```

SQLite es suficiente para este escenario.

Agregar índices en campos utilizados frecuentemente.

Por ejemplo:

```text
Product.barcode
Product.name
Pallet.warehouseId
PalletProduct.productId
PalletProduct.palletId
```

---

## 28. Privacidad

Toda la información permanece localmente en el dispositivo.

La aplicación no debe enviar automáticamente:

- fotografías;
- ubicaciones;
- productos;
- códigos;
- información de la bodega.

No incluir analítica externa en el MVP.

---

## 29. Funcionalidades explícitamente fuera del MVP

Codex NO debe implementar por iniciativa propia:

- sistema multiusuario;
- login;
- registro de cuentas;
- backend;
- API REST;
- Supabase;
- Firebase;
- almacenamiento cloud;
- colaboración;
- permisos de trabajadores;
- sincronización entre dispositivos;
- QR para ubicar zonas;
- códigos QR físicos;
- navegación indoor automática;
- Bluetooth beacons;
- UWB;
- realidad aumentada;
- inteligencia artificial;
- reconocimiento automático de productos;
- optimización de rutas;
- administración de stock;
- precios;
- ventas;
- pedidos;
- facturación;
- integración con sistema de caja.

Estas funcionalidades pueden analizarse en el futuro, pero no forman parte del objetivo actual.

---

## 30. GPS fuera del núcleo del MVP

Codex no debe diseñar la aplicación alrededor de coordenadas GPS.

La ubicación física principal es:

```text
Warehouse
+
mapX
+
mapY
+
reference
+
photo
```

No:

```text
latitude
+
longitude
```

La arquitectura puede aceptar GPS más adelante sin rehacer todo el sistema, pero actualmente no es necesario.

---

## 31. Flujo principal esperado

### Encontrar mercancía

```text
Abrir CORONAPP
↓
Buscar nombre o escanear código
↓
Abrir producto
↓
Ver última ubicación
↓
Ver fotografía/referencia
↓
Abrir ubicación en mapa
↓
Encontrar mercancía
```

### Cuando la mercancía cambió de sitio

```text
Abrir producto
↓
Cambiar ubicación
↓
Seleccionar nueva posición
↓
Agregar referencia/foto
↓
Guardar
↓
Ubicación anterior pasa al historial
```

### Registrar una nueva tarima

```text
Abrir bodega
↓
Crear tarima
↓
Elegir posición en mapa
↓
Agregar foto/referencia
↓
Agregar productos
↓
Guardar
```

---

## 32. Estrategia de implementación para Codex

No intentar construir toda la aplicación en una sola tarea.

Implementar por fases.

### Fase 1 — Proyecto base

Crear:

```text
Expo
React Native
TypeScript
Expo Router
estructura de carpetas
SQLite
sistema de migraciones
```

Debe compilar correctamente antes de avanzar.

---

### Fase 2 — Base de datos

Implementar tablas:

```text
Product
Warehouse
Pallet
PalletProduct
ProductLocation
LocationHistory
```

Crear:

- migraciones;
- repositorios;
- operaciones CRUD;
- índices;
- tipos TypeScript.

Agregar pruebas cuando sea razonable.

---

### Fase 3 — Productos

Implementar:

```text
ProductList
ProductSearch
ProductDetail
CreateProduct
EditProduct
```

Todavía sin mapa.

---

### Fase 4 — Escaneo

Agregar:

```text
Camera
BarcodeScanner
```

Conectar con búsqueda local de productos.

---

### Fase 5 — Bodegas

Implementar:

```text
WarehouseList
WarehouseDetail
CreateWarehouse
EditWarehouse
```

Permitir asociar una imagen de mapa.

---

### Fase 6 — Mapa

Implementar componente reutilizable:

```text
WarehouseMap
```

Características:

- mostrar imagen;
- zoom;
- pan;
- recibir coordenadas;
- mostrar marcadores;
- seleccionar posición;
- mover marcador.

---

### Fase 7 — Tarimas

Implementar:

```text
PalletList
PalletDetail
CreatePallet
EditPallet
MovePallet
```

Agregar relación con productos.

---

### Fase 8 — Historial

Guardar automáticamente el estado anterior al cambiar una ubicación.

Implementar pantalla:

```text
LocationHistory
```

---

### Fase 9 — Fotografías

Agregar:

```text
tomar foto
seleccionar foto cuando sea necesario
guardar archivo local
mostrar foto
eliminar archivos huérfanos
```

---

### Fase 10 — Pulido

Agregar:

- validaciones;
- manejo de errores;
- estados vacíos;
- confirmaciones;
- mejoras visuales;
- rendimiento;
- pruebas.

---

## 33. Reglas para Codex

Al implementar CORONAPP:

1. No agregar dependencias sin justificar su necesidad.
2. Usar APIs actuales y compatibles con la versión elegida de Expo.
3. Mantener TypeScript estricto.
4. Evitar `any`.
5. No realizar consultas SQL directamente desde componentes visuales.
6. Mantener lógica de persistencia dentro de repositorios o servicios.
7. Crear migraciones de base de datos.
8. No borrar datos anteriores sin confirmación.
9. No utilizar Internet como dependencia funcional.
10. No introducir funcionalidades fuera del alcance sin solicitarlas.
11. Mantener componentes pequeños y reutilizables.
12. Comentar únicamente donde ayude a entender decisiones no evidentes.
13. Preferir código simple antes que abstracciones prematuras.
14. Manejar correctamente permisos de cámara y fotografías.
15. Verificar funcionamiento en Android como plataforma prioritaria.

---

## 34. Plataforma prioritaria

Primera plataforma:

```text
Android
```

La arquitectura puede mantenerse compatible con iOS cuando sea sencillo hacerlo, pero Android es la prioridad.

---

## 35. Nombre del proyecto

```text
CORONAPP
```

Utilizar este nombre de forma consistente en:

- metadata;
- títulos;
- documentación;
- estructura del proyecto cuando corresponda.

---

## 36. Resultado esperado del MVP

El proyecto se considerará funcional cuando sea posible realizar de principio a fin el siguiente escenario:

1. Instalar CORONAPP.
2. Abrirla sin Internet.
3. Crear una bodega.
4. Agregar el plano de la bodega.
5. Crear un producto.
6. Crear una tarima.
7. Seleccionar visualmente la posición de la tarima dentro del mapa.
8. Asociar el producto con la tarima.
9. Agregar una referencia y fotografía.
10. Cerrar completamente la aplicación.
11. Abrirla nuevamente.
12. Buscar el producto.
13. Ver la tarima en la que se encuentra.
14. Visualizar su posición en el mapa.
15. Cambiar la ubicación de la tarima.
16. Consultar la ubicación anterior desde el historial.

Todo lo anterior debe funcionar sin conexión a Internet.

---

## 37. Filosofía del proyecto

CORONAPP no pretende resolver la logística completa de una tienda.

Está diseñada para resolver un problema personal y concreto:

> recordar dónde se encuentra la mercancía dentro de bodegas que cambian constantemente.

Toda decisión técnica debe evaluarse con esa pregunta.

Si una funcionalidad no ayuda directamente a localizar o registrar mercancía con mayor facilidad, probablemente no pertenece al MVP.
