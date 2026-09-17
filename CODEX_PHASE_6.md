# CODEX TASK — CORONAPP FASE 6: Escáner de códigos de barras

## Contexto

Estás trabajando en **CORONAPP**, una aplicación móvil personal, offline-first y Android-first para localizar mercancía dentro de bodegas dinámicas.

Las Fases 0, 1, 2, 3, 4 y 5 ya fueron completadas y aprobadas.

Antes de modificar código, lee completos:

- `CORONAPP_SPEC_CODEX.md`
- `IMPLEMENTATION_PLAN.md`
- `CODEX_PHASE_4.md`
- `CODEX_PHASE_5.md`

Esta tarea corresponde únicamente a:

> **FASE 6 — Escáner de códigos de barras**

No avances a la Fase 7.

---

## 1. Objetivo

Convertir la tab `Escáner` en un flujo real usando la cámara del dispositivo.

Flujo esperado:

```text
Abrir Escáner
↓
Solicitar permiso de cámara si hace falta
↓
Escanear código
↓
Buscar exactamente por barcode en SQLite
↓
Si existe:
    abrir /products/[id]
Si no existe:
    abrir /products/new?barcode=<codigo>
```

Todo debe funcionar sin Internet.

---

## 2. Alcance estricto

Implementa únicamente:

- cámara;
- permiso de cámara;
- lectura de código de barras;
- lookup local por barcode;
- navegación a producto existente;
- navegación a creación con barcode precargado;
- protección contra lecturas repetidas.

NO implementar todavía:

- fotografías;
- OCR;
- QR internos de bodega;
- GPS;
- mapas;
- inventario;
- consulta de producto en Internet;
- APIs de terceros;
- búsqueda online por UPC/EAN;
- historial de escaneos.

---

## 3. Inspección inicial obligatoria

Antes de modificar:

1. Ejecuta `git status`.
2. Confirma que Fase 5 esté limpia o identifica cambios pendientes.
3. Lee:
   - `src/app/(tabs)/scanner.tsx`
   - `src/repositories/ProductRepository.ts`
   - `src/features/products/useProductRepository.ts`
   - `src/app/products/new.tsx`
   - `src/features/products/ProductForm.tsx`
   - `src/app/_layout.tsx`
   - `app.json`
   - `package.json`
4. Confirma que `ProductRepository.getByBarcode()` funciona.
5. Confirma cómo `new.tsx` recibe o puede recibir parámetros.
6. Ejecuta:
   - `npm run lint`
   - `npm run typecheck`
   - `npx expo install --check`

---

## 4. Dependencia permitida

Instala únicamente:

```text
expo-camera
```

Usa:

```bash
npx expo install expo-camera
```

No fijes manualmente versiones incompatibles.

---

## 5. Configuración de `expo-camera`

Usa la configuración actual recomendada por Expo.

Si el CLI agrega el plugin en `app.json`, conserva una configuración mínima y razonable.

Como CORONAPP no graba video ni audio, evita solicitar permisos que no necesita.

Si el plugin permite desactivar audio mediante configuración, hazlo de manera compatible con la versión instalada.

El permiso visible debe referirse a que CORONAPP necesita la cámara para escanear códigos de barras.

No agregues permisos de micrófono si no son necesarios.

---

## 6. API de cámara

Usa las APIs actuales de `expo-camera`.

Esperado:

```ts
import {
  CameraView,
  useCameraPermissions,
} from 'expo-camera';
```

No uses APIs antiguas/deprecadas.

No uses:

```text
expo-barcode-scanner
```

como dependencia separada.

---

## 7. Permisos

Usa `useCameraPermissions()` o la API actual equivalente.

Estados obligatorios:

```text
cargando permiso
permiso no concedido
permiso concedido
```

### Si todavía puede pedirse

Mostrar explicación corta:

```text
CORONAPP necesita acceso a la cámara para escanear códigos de barras.
```

Botón:

```text
Permitir cámara
```

### Si el usuario negó y `canAskAgain` es false

Mostrar mensaje claro:

```text
El acceso a la cámara está desactivado. Actívalo desde los ajustes del sistema.
```

No entrar en loop solicitando permiso.

Si existe una API estándar y sencilla para abrir Settings sin dependencia nueva, puede utilizarse. No es obligatorio.

---

## 8. Cámara activa solo cuando corresponde

La cámara debe montarse/estar activa únicamente cuando:

- la tab Escáner está enfocada;
- el permiso está concedido;
- no se está procesando una navegación por un código ya leído.

Evita mantener cámara activa en background.

Expo recomienda que solo exista una preview activa a la vez.

Usa `useIsFocused()` o una estrategia equivalente de Expo Router si encaja.

---

## 9. Cámara trasera

Usa cámara:

```text
back
```

No hace falta selector frontal/trasero.

No implementar zoom manual.

No implementar grabación.

---

## 10. Tipos de barcode

Configura `barcodeScannerSettings` para los formatos comerciales relevantes.

Incluye como mínimo:

```text
ean13
ean8
upc_a
upc_e
code128
code39
code93
itf14
codabar
```

Puedes incluir `datamatrix` si no introduce problemas.

No incluir `qr` como objetivo de esta fase salvo que exista una razón técnica; CORONAPP no usará QR internos.

---

## 11. Evento de escaneo

Usa:

```text
onBarcodeScanned
```

o la API actual equivalente de `CameraView`.

Obtén:

```text
data
type
```

El valor importante para el lookup es:

```text
data
```

Normaliza:

```ts
const barcode = data.trim();
```

Si queda vacío, ignora el evento.

No alterar ceros a la izquierda.

Trata barcode como `string`.

---

## 12. Lookup exacto

Después de leer un código:

```text
ProductRepository.getByBarcode(barcode)
```

No usar:

```text
search()
```

No usar `LIKE`.

El escáner debe buscar coincidencia exacta del barcode.

---

## 13. Producto existente

Si `getByBarcode(barcode)` devuelve un producto:

navega a:

```text
/products/[id]
```

Usa el ID real del producto.

No mostrar una pantalla intermedia innecesaria.

---

## 14. Producto inexistente

Si no existe:

navega a:

```text
/products/new?barcode=<barcode>
```

Usa parámetros de Expo Router, no estado global.

El parámetro debe viajar de forma segura mediante la API de navegación.

No construyas URLs inseguras concatenando datos arbitrarios si la API ofrece params estructurados.

---

## 15. Creación con barcode precargado

Modifica `src/app/products/new.tsx` únicamente lo necesario.

Debe leer:

```text
barcode
```

mediante:

```text
useLocalSearchParams
```

o API equivalente.

Si existe un barcode válido como search param:

```text
ProductForm initial barcode = barcode
```

El usuario debe poder modificarlo antes de guardar.

Si no hay param, el flujo manual existente debe seguir funcionando exactamente igual.

---

## 16. Normalización del param

Recuerda que params pueden llegar como:

```text
string
string[]
undefined
```

Normaliza con TypeScript estricto.

No hagas cast ciego.

Si llegan varios valores, usa una estrategia clara y segura, por ejemplo tomar el primero.

---

## 17. Protección contra múltiples lecturas

Este punto es obligatorio.

Los lectores pueden disparar repetidamente el mismo evento mientras el código permanece frente a la cámara.

Implementa un bloqueo simple:

```text
idle
↓
barcode detectado
↓
processing = true
↓
lookup
↓
navegación
```

Mientras:

```text
processing = true
```

ignorar nuevos eventos.

No ejecutar múltiples consultas/navegaciones.

---

## 18. Rehabilitar el escáner al volver

Cuando el usuario vuelve a la tab Escáner:

```text
processing = false
```

y debe poder escanear otro producto.

No dejar el scanner bloqueado después de regresar de detalle o creación.

Usa ciclo de foco de la ruta.

---

## 19. Doble lectura del mismo barcode

Además del bloqueo durante procesamiento, evita que un mismo código genere dos navegaciones casi simultáneas.

No necesitas persistir historial.

No necesitas cooldown global permanente.

Al regresar a la pantalla puede escanearse nuevamente el mismo código.

---

## 20. Estado "procesando"

Mientras se realiza el lookup:

- evita nuevos scans;
- puedes mostrar un indicador pequeño o texto:
  `Buscando producto…`

No es obligatorio ocultar completamente la preview.

Evita parpadeos.

---

## 21. Error de SQLite

Si `getByBarcode()` falla:

- no navegar;
- desbloquear scanner de forma controlada;
- mostrar mensaje:

```text
No se pudo consultar el producto.
```

- ofrecer volver a intentar escaneando.

No mostrar SQL.

---

## 22. Error de cámara

Usa el callback actual disponible como:

```text
onMountError
```

si resulta útil.

Si cámara falla al montar:

mostrar un mensaje claro.

No causar crash.

---

## 23. Diseño de scanner

La pantalla debe incluir:

```text
Escáner
Apunta al código de barras del producto.
```

La preview debe ocupar una parte amplia de la pantalla.

Puedes crear un marco visual simple para orientar el escaneo.

No necesitas detectar físicamente que el código esté dentro del marco; puede ser solo guía visual.

No añadir animaciones complejas.

---

## 24. Linterna

La linterna/torch es opcional.

NO es requisito para aprobar Fase 6.

Si la implementas usando `enableTorch` sin dependencia adicional y de forma muy sencilla, es aceptable.

Pero no debe retrasar ni complicar el flujo principal.

---

## 25. Texto del último código

No es necesario mostrar ni conservar historial.

Puedes mostrar temporalmente:

```text
Código detectado: ...
```

mientras se procesa si ayuda a UX.

No persistirlo.

---

## 26. Integración con tab Escáner

La tab debe seguir siendo una de las cuatro principales.

No convertir scanner en modal independiente en esta fase.

La cámara vive dentro de:

```text
/(tabs)/scanner
```

Cuando navegas a producto/creación, la tab pierde foco y cámara debe dejar de estar activa.

---

## 27. Navegación y Back

Flujo existente:

```text
Escáner
→ Producto
→ Back
→ Escáner activo nuevamente
```

y:

```text
Escáner
→ Nuevo producto con barcode
→ Guardar
→ Detalle
```

El usuario debe poder regresar sin encontrarse con un scanner permanentemente bloqueado.

---

## 28. Barcode duplicado al crear

Existe una posible carrera:

```text
escaneo → no existe
↓
abre creación
↓
por alguna razón ya existe antes de guardar
```

Mantén el manejo de barcode duplicado de Fase 4.

No crees lógica especial nueva si el flujo ya muestra correctamente el error.

---

## 29. Producto creado desde scanner

Cuando el barcode desconocido se precarga:

- nombre sigue siendo obligatorio;
- barcode puede modificarse;
- guardar usa el CRUD existente;
- después navega al detalle.

No implementar retorno automático al scanner después de crear.

---

## 30. No buscar información externa

Bajo ninguna circunstancia:

```text
barcode
↓
Internet
↓
obtener nombre/marca/foto
```

Eso está fuera del alcance.

La app debe seguir offline-first.

---

## 31. No QR

Aunque `expo-camera` soporte QR:

No implementar lógica para:

- QR de ubicación;
- QR de bodega;
- QR de tarima;
- navegación por QR.

El proyecto descartó esa idea para el MVP personal.

---

## 32. No fotografías

Aunque `expo-camera` pueda tomar fotos:

NO usar:

```text
takePictureAsync
```

en esta fase.

La cámara se utiliza únicamente como scanner.

---

## 33. No modificar ProductRepository sin necesidad

Debe existir:

```text
getByBarcode(barcode)
```

Úsalo.

Solo modifica el repositorio si detectas un bug real.

Si lo haces, documenta el bug.

---

## 34. TypeScript

Mantén:

```text
strict
sin any
sin @ts-ignore
```

Usa tipos exportados por `expo-camera` cuando ayuden.

No inventes tipos duplicados innecesarios.

---

## 35. Seguridad

Barcode siempre se envía al repositorio como argumento.

El repositorio debe continuar usando parámetros enlazados.

No concatenar barcode dentro de SQL.

---

## 36. Verificación de permisos

Prueba conceptualmente/realmente:

### Primera vez
```text
permiso undetermined
→ pedir permiso
```

### Permitido
```text
mostrar cámara
```

### Negado pero puede preguntar
```text
mostrar explicación + botón
```

### Negado permanentemente
```text
explicar que debe ir a ajustes
```

No asumas `permission` no-null durante carga inicial.

---

## 37. Verificaciones funcionales obligatorias

Si hay dispositivo Android/Expo Go, probar:

### Código existente

Crear previamente producto:

```text
barcode: 7501234567890
```

Escanear ese código.

Esperado:

```text
abre ProductDetail correcto
```

### Código inexistente

Escanear un código que no esté en DB.

Esperado:

```text
abre Nuevo producto
barcode precargado
```

### Volver

Desde ProductDetail:

```text
Back
```

Esperado:

```text
scanner vuelve a funcionar
```

### Lectura repetida

Mantener barcode frente a cámara.

Esperado:

```text
una sola navegación
```

### Negar cámara

Verificar que no crashea y muestra mensaje adecuado.

---

## 38. Verificación sin dispositivo

Si NO hay cámara/dispositivo disponible:

Puedes verificar:

- TypeScript;
- rutas;
- bundle Android;
- lógica de lookup;
- normalización de params;
- bloqueo `processing`;
- comportamiento de navegación por tests/scripts temporales o inspección estructurada.

Pero NO declares:

```text
scanner físico probado
```

si no se ejecutó en un dispositivo real.

Esta limitación debe quedar muy explícita.

---

## 39. Expo Go

`expo-camera` está disponible en Expo Go.

Si hay un teléfono Android accesible, prioriza probar con Expo Go antes de cerrar la fase.

No necesitas generar APK para este smoke test.

---

## 40. Configuración Android

Confirma que:

- permiso CAMERA esté configurado automáticamente/apropiadamente;
- no se haya añadido permiso de audio innecesario;
- app config siga siendo válida.

Ejecuta:

```bash
npx expo config --type public
```

---

## 41. Dependencias

Esperado:

```text
+ expo-camera
```

Nada más.

No agregar:

```text
expo-barcode-scanner
```

---

## 42. Prueba de creación precargada

Verifica de forma separada que:

```text
/products/new?barcode=7501234567890
```

precarga correctamente el campo.

También verifica:

```text
/products/new
```

sigue mostrando barcode vacío.

---

## 43. Edge cases

Maneja razonablemente:

```text
data = ""
data = "   "
search param barcode ausente
search param barcode como array
producto eliminado entre lookup y navegación
```

Para el último caso, ProductDetail ya debe manejar not-found.

No sobrearquitectures.

---

## 44. UI durante permiso

No renderices `CameraView` antes de tener permiso.

No permitas un flash visual de cámara que luego desaparezca por falta de permisos.

---

## 45. Accesibilidad

Botones:

```text
Permitir cámara
Reintentar
```

deben tener roles apropiados y tamaño táctil razonable.

El marco visual del scanner no debe ser la única instrucción; incluye texto.

---

## 46. Git

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

## 47. Verificaciones técnicas obligatorias

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

## 48. Criterios de aceptación

La Fase 6 queda lista para revisión si:

1. `expo-camera` está instalado correctamente.
2. tab Escáner usa `CameraView`.
3. permisos se manejan.
4. cámara solo se activa con permiso.
5. usa cámara trasera.
6. escanea barcodes comerciales.
7. barcode se conserva como string.
8. hace lookup exacto con `getByBarcode`.
9. producto existente abre detalle.
10. producto inexistente abre creación.
11. barcode se precarga en formulario.
12. creación manual sin param sigue funcionando.
13. lecturas repetidas no duplican navegación.
14. scanner se rehabilita al recuperar foco.
15. errores de DB se muestran de forma segura.
16. errores de cámara no crashean app.
17. no hay lookup por Internet.
18. no hay QR funcional.
19. no hay captura de fotos.
20. no hay `expo-barcode-scanner`.
21. solo se agregó `expo-camera`.
22. lint pasa.
23. typecheck pasa.
24. Expo dependency check pasa.
25. config Expo pasa.
26. Metro inicia.
27. bundle Android compila si es posible.
28. prueba física se reporta con honestidad.
29. no se avanzó a Fase 7.

---

## 49. Reporte final obligatorio

Responde con:

### Cambios realizados
Resumen.

### Archivos creados/modificados
Lista exacta y propósito.

### Dependencias
Confirma versión de `expo-camera` y que no se agregó otra.

### Permisos
Explica:
- cómo se solicitan;
- qué ocurre al negar;
- si `canAskAgain` es false.

### Tipos de barcode
Lista los configurados.

### Flujo de escaneo
Explica:
- existente;
- inexistente;
- bloqueo de lecturas repetidas;
- rehabilitación al foco.

### Precarga de creación
Explica cómo `/products/new` recibe barcode.

### Manejo de errores
Cámara y SQLite.

### Verificaciones funcionales
Lista lo realmente probado.

### Verificaciones técnicas
Formato:

```text
comando → resultado
```

### Git diff
Resumen.

### Limitaciones
Especialmente si no hubo prueba física de cámara.

### Estado
Indica únicamente:

```text
FASE 6 LISTA PARA REVISIÓN FINAL
```

o:

```text
FASE 6 AÚN REQUIERE CORRECCIONES
```

---

## 50. Detente

Después de completar esta tarea:

**NO avances a la Fase 7.**

No implementes CRUD de bodegas.

No agregues fotografías.

No implementes mapas.

Espera revisión.
