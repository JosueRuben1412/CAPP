# CODEX TASK — CORONAPP FASE 0: Inicialización del repositorio

## Contexto

Estás trabajando en **CORONAPP**, una aplicación móvil personal, offline-first y Android-first para registrar y localizar mercancía dentro de bodegas que cambian constantemente.

Antes de modificar código, lee completos estos archivos si existen en el repositorio:

- `CORONAPP_SPEC_CODEX.md`
- `IMPLEMENTATION_PLAN.md`

Esos documentos son la fuente de verdad del alcance del proyecto.

Esta tarea corresponde únicamente a:

> **FASE 0 — Inicialización del repositorio**

No avances a ninguna fase posterior.

---

## Objetivo de esta tarea

Dejar una base de proyecto Expo limpia, mínima, mantenible y verificable sobre la cual se construirá CORONAPP.

Al finalizar debe existir una aplicación que:

- use React Native con Expo;
- use TypeScript;
- use Expo Router;
- compile correctamente;
- tenga TypeScript en modo estricto;
- tenga lint configurado y funcional;
- tenga una pantalla inicial mínima de CORONAPP;
- esté preparada estructuralmente para crecer;
- no contenga todavía lógica de negocio;
- no contenga todavía SQLite ni funcionalidades de fases futuras.

---

## 1. Primero inspecciona el repositorio

Antes de crear o sobrescribir archivos:

1. Inspecciona la estructura actual.
2. Revisa `package.json` si existe.
3. Revisa configuración Expo si existe.
4. Revisa configuración TypeScript si existe.
5. Revisa configuración ESLint si existe.
6. Comprueba si el repositorio ya es un proyecto Expo.
7. Comprueba si existen archivos/documentos que deben preservarse.

### Regla importante

**No borres ni sobrescribas `CORONAPP_SPEC_CODEX.md` ni `IMPLEMENTATION_PLAN.md`.**

No destruyas trabajo existente para volver a inicializar el proyecto.

Si el repositorio ya contiene un proyecto Expo válido, adapta ese proyecto en lugar de crear otro desde cero.

Si el repositorio contiene únicamente documentación u otros archivos no conflictivos, inicializa Expo de una forma segura que preserve dichos archivos.

---

## 2. Inicialización tecnológica

Usa las herramientas y convenciones actuales recomendadas oficialmente por Expo.

La base tecnológica debe ser:

```text
React Native
Expo
TypeScript
Expo Router
npm
```

Para un proyecto nuevo, toma como referencia el template por defecto actual de `create-expo-app`, que ya integra Expo Router y TypeScript.

No fijes versiones antiguas manualmente si la herramienta oficial actual puede resolver versiones compatibles.

No instales EAS CLI ni configures EAS en esta fase.

---

## 3. Nombre del proyecto

Nombre visible:

```text
CORONAPP
```

Usa un identificador técnico razonable y consistente cuando Expo lo requiera.

No inventes todavía:

- bundle identifiers definitivos de producción;
- cuentas Expo;
- configuración de Play Store;
- certificados;
- signing keys.

---

## 4. TypeScript

TypeScript debe quedar en modo estricto.

Comprueba que `tsconfig.json` tenga una configuración equivalente a:

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

Puedes extender la configuración recomendada por Expo.

### Reglas

- No usar `any`.
- No silenciar errores de TypeScript innecesariamente.
- No utilizar `@ts-ignore` para hacer pasar la fase.
- Si la plantilla genera algún código incompatible con strict mode, corrígelo.

---

## 5. Expo Router

Expo Router debe ser el sistema de navegación.

Usa routing basado en archivos siguiendo las convenciones actuales de Expo.

Para esta fase solo necesitamos una ruta inicial funcional.

Debe existir una pantalla principal equivalente a:

```text
CORONAPP

Localiza tu mercancía sin depender de Internet.

[Proyecto en preparación]
```

No es necesario copiar exactamente ese diseño o texto, pero debe ser una pantalla limpia y claramente identificable como CORONAPP.

### No crear todavía

No crear pantallas reales de:

- productos;
- bodegas;
- escáner;
- tarimas;
- mapas;
- historial;
- configuración.

Esas rutas pertenecen a fases posteriores.

---

## 6. Estructura del proyecto

Mantén las convenciones actuales de Expo Router y evita crear carpetas vacías sin utilidad inmediata.

Prepara una estructura razonable para que más adelante puedan existir áreas equivalentes a:

```text
app / rutas
components
features
database
repositories
services
hooks
types
utils
constants
```

### Importante

No es obligatorio crear todas esas carpetas físicamente ahora.

Crea únicamente las que tengan sentido en esta fase.

No agregues archivos placeholder vacíos solo para aparentar arquitectura.

Si Expo Router utiliza `app/` o `src/app/`, respeta la convención elegida y documenta brevemente la decisión.

---

## 7. Código de ejemplo de la plantilla

Elimina el contenido demostrativo innecesario que genere la plantilla de Expo si no aporta valor al proyecto.

Por ejemplo, no necesitamos conservar:

- tutoriales de ejemplo;
- pantallas demo;
- componentes demo;
- assets demo que no vaya a utilizar CORONAPP.

### Precaución

No elimines componentes/dependencias necesarias para que Expo Router o la app funcionen.

El resultado debe ser una base mínima, no una plantilla llena de ejemplos.

---

## 8. Estilos

Usa únicamente estilos básicos de React Native para esta fase.

No agregues todavía:

- NativeWind;
- Tailwind;
- Tamagui;
- React Native Paper;
- UI Kitten;
- gluestack;
- librerías de temas;
- librerías de componentes.

No necesitamos tomar todavía una decisión de sistema visual externo.

La pantalla inicial puede utilizar:

```text
View
Text
StyleSheet
SafeAreaView o equivalente apropiado
```

según las APIs disponibles y recomendadas por el proyecto.

---

## 9. Dependencias

Mantén las dependencias al mínimo.

Antes de agregar cualquier dependencia que no forme parte de la base normal de Expo/Expo Router, pregúntate si es necesaria para cumplir esta fase.

### No instalar todavía

- `expo-sqlite`
- ORM
- Zustand
- Redux
- TanStack Query
- cámara
- image picker
- filesystem específico del dominio
- mapas
- geolocalización
- barcode libraries adicionales
- backend SDKs
- Supabase
- Firebase
- Axios si `fetch` fuera suficiente
- librerías de formularios
- librerías de validación
- librerías de UI

Si alguna dependencia adicional resulta imprescindible únicamente por requisitos actuales de Expo Router, puedes utilizarla y debes reportarla.

---

## 10. ESLint

Mantén o configura ESLint usando la estrategia recomendada por la versión actual de Expo.

Debe existir un comando reproducible para ejecutar lint.

Si `package.json` no lo incluye, agrega un script apropiado, por ejemplo conceptualmente:

```json
{
  "scripts": {
    "lint": "..."
  }
}
```

No agregues una configuración excesivamente personalizada.

---

## 11. Scripts de verificación

El proyecto debe permitir ejecutar fácilmente:

```text
lint
typecheck
start
```

Si no existe script de typecheck, agrega uno equivalente a:

```text
tsc --noEmit
```

Ejemplo conceptual:

```json
{
  "scripts": {
    "typecheck": "tsc --noEmit"
  }
}
```

Usa los nombres y comandos reales compatibles con la configuración final.

---

## 12. Git

Si existe repositorio Git:

- respeta `.gitignore`;
- no elimines historial;
- no hagas force reset;
- no borres archivos ajenos a esta fase.

No hagas commit salvo que el entorno o la instrucción superior te lo pida explícitamente.

No agregues secretos.

---

## 13. Configuración de la aplicación

Configura únicamente metadata básica necesaria.

Debe utilizarse el nombre:

```text
CORONAPP
```

Mantén Android como plataforma prioritaria, pero no rompas iOS innecesariamente.

No configures todavía:

- permisos de cámara;
- permisos GPS;
- storage permissions;
- notificaciones;
- deep links de negocio;
- intent filters específicos;
- orientación especial;
- background tasks.

---

## 14. No implementar en esta fase

Está expresamente prohibido adelantar:

```text
SQLite
migraciones
Product
Warehouse
Pallet
PalletProduct
ProductLocation
LocationHistory
CRUD
cámara
lector de códigos de barras
fotografías
mapas de bodega
GPS
QR
backend
API
login
usuarios
sincronización
cloud
backup
IA
```

Si detectas que alguno de esos elementos sería útil, no lo implementes.

Déjalo para su fase correspondiente.

---

## 15. No sobrearquitecturar

No implementes todavía patrones complejos como:

- Clean Architecture completa;
- Dependency Injection framework;
- event bus;
- CQRS;
- Redux;
- repository interfaces sin uso;
- domain entities complejas;
- factories;
- service locator.

Necesitamos una base ordenada, no arquitectura especulativa.

---

## 16. Criterios de aceptación

La fase solo puede considerarse terminada si:

1. El proyecto Expo está correctamente inicializado.
2. Expo Router funciona.
3. Existe una ruta inicial funcional.
4. La pantalla inicial muestra CORONAPP.
5. TypeScript está en strict mode.
6. No existen errores TypeScript.
7. ESLint se ejecuta sin errores.
8. No existen imports rotos.
9. No existen rutas rotas.
10. No se implementó ninguna funcionalidad de fases posteriores.
11. Los documentos de especificación existentes permanecen intactos.
12. Las dependencias son mínimas y justificables.
13. El proyecto puede iniciar mediante Expo.
14. No existen secretos ni credenciales.
15. La estructura final es comprensible para continuar la Fase 1.

---

## 17. Verificaciones obligatorias

Antes de terminar, ejecuta los comandos reales equivalentes a:

```bash
npm install
npm run lint
npm run typecheck
```

También ejecuta una validación apropiada del proyecto Expo, utilizando herramientas actuales disponibles en el proyecto.

Si es razonablemente posible en el entorno, inicia Expo y verifica que el bundler pueda arrancar sin errores.

No necesitas mantener ningún proceso corriendo al finalizar.

### Si una verificación falla

No ignores el error.

Investiga la causa y corrígelo dentro del alcance de esta fase.

Si existe una limitación real del entorno que impide una verificación, documenta exactamente:

- qué comando intentaste;
- qué ocurrió;
- por qué no pudiste verificarlo.

No declares una comprobación como exitosa si no la ejecutaste.

---

## 18. Revisión final del diff

Antes de responder:

1. Revisa todos los archivos modificados.
2. Elimina código demo innecesario.
3. Comprueba que no añadiste funcionalidad futura accidentalmente.
4. Comprueba que no borraste los documentos del proyecto.
5. Comprueba que no hay dependencias sin uso.
6. Comprueba que no hay archivos temporales.
7. Comprueba que el proyecto sigue siendo mínimo.

---

## 19. Formato obligatorio de tu respuesta final

Al terminar responde con estas secciones:

### Resumen
Qué quedó implementado.

### Archivos creados/modificados
Lista breve con propósito de cada archivo importante.

### Dependencias
Indica qué dependencias fueron añadidas o eliminadas y por qué.

### Decisiones técnicas
Explica únicamente decisiones relevantes tomadas durante esta fase.

### Verificaciones ejecutadas
Para cada comando:

```text
comando → resultado
```

### Limitaciones
Cualquier cosa que no haya podido verificarse.

### Estado de la Fase 0
Indica explícitamente una de estas dos opciones:

```text
FASE 0 COMPLETA
```

o:

```text
FASE 0 INCOMPLETA
```

Si está incompleta, explica concretamente qué falta.

---

## 20. Detente

Después de terminar esta fase:

**NO continúes con Fase 1.**

No instales SQLite.

No empieces el modelo de datos.

Espera la siguiente instrucción.
