# Reporte de Modularizacion

Fecha: 2026-03-24

## Objetivo

Tener una referencia corta y real del estado actual del proyecto despues del refactor, y dejar visibles solo los cambios que todavia valen la pena para seguir escalando la app con una estructura mas profesional.

## Estado actual

La app ya no depende tanto de archivos monoliticos. En esta etapa se modularizaron los bloques mas grandes sin romper sus imports publicos ni cambiar el comportamiento visible.

### Modularizado

- `src/components/CardBalance.tsx`
- `src/components/AuthModal.tsx`
- `src/components/FormMovimiento.tsx`
- `src/context/FinanzasProvider.tsx`
- `src/context/AuthContext.tsx`
- `src/components/historial/HistorialMonthCard.tsx`
- `src/components/historial/historial.utils.ts`
- `src/layouts/MainLayout.tsx`

### Patron aplicado

En casi todos los casos se dejo:

- Un archivo publico pequeno que reexporta.
- Una carpeta interna por modulo.
- Componentes, helpers, hooks, constantes y tipos separados por responsabilidad.
- Validacion posterior con `npm run lint` y `npx tsc -b`.

## Como quedo el proyecto

Hoy el proyecto esta en un punto bastante mejor para crecer:

- Los componentes grandes ya estan partidos en piezas mas legibles.
- Los providers principales ya separan mejor storage, calculos y coordinacion.
- El modulo de historial ya no depende de un solo archivo utilitario gigante.
- El layout principal ya esta dividido entre shell, header y menu.

Todavia no esta en arquitectura por feature completa, pero ya tiene una base mucho mas sana para llegar ahi sin rehacer todo.

## Como separar bien un proyecto

Una de las ideas mas importantes de la modularizacion es que no todo el codigo cumple el mismo rol.

Cuando todo vive mezclado en un mismo archivo o en una misma carpeta, se vuelve dificil responder preguntas basicas como estas:

- donde se pinta la interfaz
- donde estan las reglas del negocio
- donde se guardan o leen los datos
- donde se conectan los componentes con React
- donde estan los tipos y contratos

La separacion correcta ayuda a que cada parte tenga una responsabilidad clara.

### UI

La UI es la parte visual.

Aqui viven cosas como:

- componentes
- secciones
- modales
- tarjetas
- botones
- acordeones
- layouts

La UI deberia enfocarse en:

- mostrar datos
- recibir interaccion del usuario
- disparar acciones

La UI no deberia cargar demasiada logica de negocio ni detalles de persistencia.

Ejemplo en este proyecto:

- `CardBalance`
- `AuthModal`
- `FormMovimiento`
- `HistorialMonthCard`
- `MainLayout`

### Logica de negocio

La logica de negocio es la que decide como se comporta el sistema.

Aqui viven cosas como:

- calculos
- reglas financieras
- normalizacion de datos
- agrupaciones por mes
- reglas de validacion
- transformaciones del dominio

Ejemplo en este proyecto:

- calculo de balance
- progreso de ahorro
- progreso de deuda
- agrupacion mensual del historial
- sanitizacion de auth

Esta parte idealmente debe ser lo mas pura posible, porque asi:

- se entiende mejor
- se prueba mejor
- se reutiliza mejor

### Persistencia o storage

La persistencia es la capa que lee o guarda informacion.

Hoy en Monify eso se hace con:

- `localStorage`

Manana podria hacerse con:

- una API
- una base de datos
- un servicio externo

La idea sana es que el resto del proyecto no dependa demasiado de si los datos vienen de `localStorage` o de backend.

Por eso conviene separar esta capa.

Ejemplo en este proyecto:

- `src/context/auth/auth.storage.ts`
- `src/context/finanzas/storage.ts`

### Capa de integracion con React

Esta capa conecta:

- UI
- logica
- storage

Aqui viven normalmente:

- providers
- hooks de contexto
- componentes orquestadores

Su trabajo no deberia ser hacer todo, sino coordinar.

Ejemplo en este proyecto:

- `AuthProvider`
- `FinanzasProvider`
- componentes orquestadores como `CardBalance/CardBalance.tsx`

### Tipos y contratos

Los tipos ayudan a dejar claro que forma tiene la informacion y que espera cada modulo.

Ejemplo:

- `AuthUser`
- `MovimientoItem`
- `MovimientoSummary`
- `RegisterValues`

Esto ayuda mucho a diferenciar las partes del proyecto porque obliga a explicitar:

- que entra
- que sale
- que representa cada cosa

## Por que esta separacion mejora el proyecto

Cuando separas UI, negocio, storage e integracion:

- leer el codigo es mas facil
- cambiar una parte rompe menos las demas
- conectar backend es mas ordenado
- escribir pruebas es mucho mas simple
- los componentes se vuelven mas pequenos
- se reduce el acoplamiento

En otras palabras: cada parte del proyecto empieza a tener identidad propia.

## Arquitectura por tipo tecnico vs arquitectura por feature

Hoy el proyecto todavia mezcla bastante una estructura por tipo tecnico.

Eso significa carpetas como:

- `components`
- `context`
- `data`
- `types`
- `pages`

Ese modelo funciona bien al inicio, pero con el tiempo tiene un problema:

la logica de una sola funcionalidad termina repartida en muchas carpetas.

Por ejemplo, la feature de finanzas puede quedar partida entre:

- un componente en `components`
- un provider en `context`
- datos en `data`
- tipos en `types`

Eso hace que para entender una sola feature tengas que saltar por muchas zonas del proyecto.

### Que es arquitectura por feature

La arquitectura por feature agrupa el codigo por funcionalidad del negocio.

Ejemplo:

```text
src/
  features/
    auth/
      components/
      context/
      domain/
      storage/
      types/
    finanzas/
      components/
      context/
      domain/
      storage/
      types/
    historial/
      components/
      domain/
      types/
```

Aqui la idea es simple:

- todo lo relacionado con auth vive junto
- todo lo relacionado con finanzas vive junto
- todo lo relacionado con historial vive junto

### Por que la arquitectura por feature es mejor

Porque hace mas facil:

- entender una funcionalidad completa
- cambiar una feature sin tocar media app
- mover responsabilidades con menos friccion
- escalar el proyecto cuando aparecen nuevos modulos
- trabajar en equipo sin pisarse tanto

Tambien ayuda a responder preguntas concretas muy rapido:

- donde esta todo lo de auth
- donde esta todo lo de finanzas
- donde vive la logica del historial

## Como todo esto ayuda a diferenciar mejor las partes del proyecto

Cuando el proyecto esta mejor separado, se empiezan a ver capas mas claras:

- la UI representa
- la logica decide
- el storage persiste
- los providers conectan
- los tipos describen

Eso evita una de las causas mas comunes del desorden:

- componentes que hacen de todo
- providers que parecen servicios
- utilidades metidas en carpetas visuales
- reglas del negocio mezcladas con JSX

La modularizacion que ya hicimos en Monify va exactamente en esa direccion:

- los componentes grandes ya quedaron partidos
- auth ya separa provider, storage y utilidades
- finanzas ya separa provider, calculos y persistencia
- historial ya separa utilidades por responsabilidad
- layout ya separa shell, header y menu

## Hacia donde deberia seguir el proyecto

La siguiente evolucion natural ya no es solo partir archivos grandes.

La siguiente evolucion natural es esta:

1. terminar de modularizar los componentes pendientes
2. limpiar nombres y archivos de contexto
3. mover poco a poco el proyecto a `features/`
4. crear servicios para backend real
5. probar la logica de dominio por separado

Asi el proyecto va quedando cada vez mas profesional porque no solo tiene archivos pequenos, sino una estructura donde cada parte se entiende por su rol.

## Lo que falta para dejarlo mas escalable y pro

### 1. Modularizar `src/components/ListaMovimientos.tsx`

Sigue siendo el componente grande mas claro que falta por partir.

Objetivo:

- Separar item de movimiento.
- Separar estado vacio.
- Separar icon mapping y format helpers si aplica.

### 2. Consolidar nombres y ubicacion de contextos

Todavia hay nombres heredados que pueden confundir:

- `src/context/authStore.ts`
- `src/context/finanzasStore.ts`
- `src/context/finanzasContext.ts`

Objetivo:

- Dejar una convencion unica y clara.
- Evitar archivos de reexport innecesarios.
- Hacer mas obvio cual archivo define contexto y cual expone hooks o provider.

### 3. Empezar migracion gradual a estructura por feature

La modularizacion interna ya avanzo bastante, pero la raiz de `src/` todavia mezcla estructura por tipo tecnico:

- `components`
- `context`
- `data`
- `layouts`
- `pages`
- `types`

Siguiente paso recomendado:

- Mover gradualmente `auth`, `finanzas` e `historial` a una estructura por feature.
- Hacerlo por fases, sin big bang refactor.

### 4. Crear una capa compartida para utilidades comunes

Ya hay varias piezas que pronto conviene centralizar del todo:

- currency formatter
- helpers de fecha
- constantes de storage
- utilidades de dominio compartidas

Objetivo:

- Evitar duplicacion silenciosa.
- Facilitar pruebas.
- Preparar mejor la integracion con backend.

### 5. Preparar capa de servicios para backend real

Hoy auth y finanzas siguen funcionando con `localStorage`, pero la estructura ya permite dar el siguiente paso.

Recomendacion:

- Crear servicios/adaptadores para auth.
- Crear servicios/adaptadores para movimientos y metas.
- Dejar providers como capa de integracion con React, no como lugar de acceso directo a persistencia.

### 6. Agregar pruebas a la logica de dominio mas importante

Las funciones puras ya estan mas separadas, asi que ahora tiene mucho mas sentido cubrir:

- calculos financieros
- construccion de grupos mensuales
- sanitizacion y flujo de auth
- normalizacion de datos persistidos

## Orden recomendado desde este punto

Si seguimos con el mismo criterio de refactor seguro, el mejor orden seria:

1. `ListaMovimientos`
2. Limpieza y unificacion de archivos de contexto
3. Primera migracion parcial a `features/`
4. Extraccion de servicios para backend
5. Pruebas de dominio

## Conclusion

El proyecto ya salio de la zona mas riesgosa de archivos gigantes. La base actual esta bastante mejor para escalar, mantener y conectar backend sin que cada cambio toque demasiadas cosas al tiempo.

Lo que sigue ya no es tanto "romper monolitos", sino ordenar la arquitectura alrededor de features, servicios y utilidades compartidas para que el codigo se vea cada vez mas profesional y facil de evolucionar.
