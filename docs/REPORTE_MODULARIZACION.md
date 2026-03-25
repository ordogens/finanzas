# Reporte de Modularizacion y Estructura

Fecha: 2026-03-24

## Objetivo

Dejar el proyecto en una estructura mas profesional, facil de leer, facil de mantener y con responsabilidades mejor separadas.

Este reporte se basa en la revision del arbol actual de `src/`, el tamano de los archivos, la distribucion de responsabilidades y algunos indicios de deuda tecnica visibles hoy.

## Diagnostico rapido

El proyecto esta funcional, pero hoy mezcla varias responsabilidades en archivos grandes:

- UI, configuracion visual y logica de negocio dentro del mismo componente.
- Context providers con logica de almacenamiento, calculos, normalizacion y acciones de dominio al mismo tiempo.
- Utilidades de negocio dentro de carpetas de `components`.
- Archivos `.ts` con rol de contexto o servicio fuera de una convencion clara.
- Archivos heredados o redundantes que ya no aportan valor.

## Prioridad alta: archivos que mas conviene modularizar

### 1. `src/components/CardBalance.tsx`

Tamano actual: 407 lineas.

Problema:

- Mezcla iconos SVG, formateo de moneda, configuracion de tarjetas, configuracion de metas, UI del acordeon y formulario de metas.
- Tiene demasiada logica inline para un componente visual.

Modularizacion sugerida:

- Extraer `formatCurrency` a `src/lib/formatters/currency.ts`.
- Extraer iconos propios a `src/components/balance/icons.tsx`.
- Extraer configuracion de tarjetas a `src/features/finanzas/config/balanceCards.ts`.
- Extraer `GoalCard` como componente independiente.
- Extraer `GoalProgressBar` si quieres mantener una UI reutilizable.
- Dejar `CardBalance.tsx` solo como componente orquestador.

Senal clara:

- Este es hoy el componente mas grande del proyecto.

### 2. `src/components/AuthModal.tsx`

Tamano actual: 364 lineas.

Problema:

- Mezcla modal shell, tabs, inputs, acciones de submit, Google login, alertas de SweetAlert y layout completo.
- Tiene demasiadas decisiones de UI y comportamiento en un solo archivo.

Modularizacion sugerida:

- Extraer `AuthModalShell`.
- Extraer `AuthTabs`.
- Extraer `AuthLoginForm`.
- Extraer `AuthRegisterForm`.
- Extraer `AuthInputField`.
- Mover `showSuccessAlert` a `src/lib/alerts/authAlerts.ts` o `src/lib/ui/alerts.ts`.

Beneficio:

- Facilita probar y cambiar login y registro sin tocar todo el modal.

### 3. `src/components/FormMovimiento.tsx`

Tamano actual: 349 lineas.

Problema:

- Mezcla FAB flotante, modal, formulario, reglas de validacion, acciones de edicion y shortcuts de tipo de movimiento.
- Tiene dos responsabilidades fuertes: abrir/cerrar UI y administrar formulario.

Modularizacion sugerida:

- Extraer `FloatingAddButton`.
- Extraer `MovimientoModal`.
- Extraer `MovimientoForm`.
- Extraer `MovimientoTypeQuickActions`.
- Extraer validaciones y defaults a `src/features/movimientos/form/form.constants.ts`.

Beneficio:

- Permite reutilizar el formulario si luego quieren una pagina dedicada o un drawer.

### 4. `src/context/FinanzasProvider.tsx`

Tamano actual: 304 lineas.

Problema:

- Mezcla provider React con calculos de dominio, claves de localStorage, lecturas/escrituras, normalizacion de datos y acciones CRUD.
- Hoy hace trabajo de provider, store, selectors y repository a la vez.

Modularizacion sugerida:

- Mover storage keys a `src/features/finanzas/storage/keys.ts`.
- Mover acceso a localStorage a `src/features/finanzas/storage/finanzasStorage.ts`.
- Mover calculos a `src/features/finanzas/domain/finanzasCalculations.ts`.
- Mover normalizacion de movimientos a `src/features/finanzas/domain/normalizers.ts`.
- Dejar el provider solo coordinando estado y exponiendo acciones.

Recomendacion pro:

- Si el proyecto sigue creciendo, pasar de `useState` a `useReducer` para centralizar eventos del dominio.

### 5. `src/context/AuthContext.tsx`

Tamano actual: 253 lineas.

Problema:

- Mezcla contexto, almacenamiento, sanitizacion, session management, registro, login y fake Google auth.
- Es dificil de leer porque todo esta en el mismo nivel.

Modularizacion sugerida:

- Mover storage a `src/features/auth/storage/authStorage.ts`.
- Mover sanitizacion a `src/features/auth/domain/authSanitizers.ts`.
- Mover acciones a `src/features/auth/services/authService.ts`.
- Dejar `AuthContext.tsx` como capa de integracion con React.

Beneficio:

- Hace mas facil reemplazar localStorage por backend mas adelante.

### 6. `src/components/historial/HistorialMonthCard.tsx`

Tamano actual: 286 lineas.

Problema:

- Mezcla tarjeta principal, resumen del mes, detalle de salidas, lista de movimientos y estados vacios.

Modularizacion sugerida:

- Extraer `HistorialMonthHeader`.
- Extraer `HistorialExpenseBreakdown`.
- Extraer `HistorialSummaryPanel`.
- Extraer `HistorialMovementsPanel`.
- Extraer `EmptyMonthState`.

Beneficio:

- La pantalla de historial queda mas facil de extender.

### 7. `src/components/historial/historial.utils.ts`

Tamano actual: 239 lineas.

Problema:

- Tiene logica de dominio de historial dentro de una carpeta de componentes.
- No es un componente; es logica de negocio y transformacion.

Reubicacion sugerida:

- Mover a `src/features/historial/domain/historial.utils.ts` o mejor:
- `src/features/historial/domain/buildMonthGroups.ts`
- `src/features/historial/domain/historyFormatters.ts`
- `src/features/historial/domain/historySelectors.ts`

Beneficio:

- Separa claramente UI de dominio.

### 8. `src/components/ListaMovimientos.tsx`

Tamano actual: 202 lineas.

Problema:

- Mezcla icon mapping, formateo, render de item, estados vacios y acciones.

Modularizacion sugerida:

- Extraer `MovimientoListItem`.
- Extraer `MovimientoEmptyState`.
- Extraer `movementIconMap.tsx`.
- Reutilizar `formatCurrency` desde una utilidad comun.

### 9. `src/layouts/MainLayout.tsx`

Tamano actual: 173 lineas.

Problema:

- Mezcla layout, header, menu, auth actions y user menu card.

Modularizacion sugerida:

- Extraer `AppHeader`.
- Extraer `HeaderMenu`.
- Extraer `HeaderAuthSection`.

## Archivos `.ts` fuera de `data` o `types` que deberian reorganizarse

Aqui no todo esta mal por estar fuera de `data` o `types`. Muchos `.ts` deben vivir en `context`, `lib`, `features`, `services` o `hooks`. El problema no es el formato `.ts`; el problema es la ubicacion y el nombre.

### Archivos a revisar

#### `src/context/authStore.ts`

Situacion actual:

- En realidad define `AuthContext`, no un store completo.

Recomendacion:

- Renombrar a `src/context/auth-context.ts` si mantienes estructura simple.
- O mover a `src/features/auth/context/AuthContext.ts`.

#### `src/context/finanzasStore.ts`

Situacion actual:

- Tambien define el contexto, no un store en sentido estricto.

Recomendacion:

- Renombrar a `src/context/finanzas-context.ts`.
- O mover a `src/features/finanzas/context/FinanzasContext.ts`.

#### `src/context/finanzasContext.ts`

Situacion actual:

- Solo reexporta `FinanzasContext`.
- Aporta muy poco y aumenta confusion porque convive con `finanzasStore.ts`.

Recomendacion:

- Eliminarlo o consolidarlo con un solo archivo de contexto.

#### `src/components/historial/historial.utils.ts`

Situacion actual:

- Es logica de dominio viviendo dentro de `components`.

Recomendacion:

- Moverlo a `features/historial/domain`.

## Archivos redundantes, obsoletos o sospechosos

### `src/data/cardBalance.ts`

Situacion actual:

- Existe un arreglo `balanceCards`, pero `CardBalance.tsx` ya define su propia configuracion interna.
- Hoy parece archivo muerto.

Recomendacion:

- O lo eliminas.
- O lo conviertes en la unica fuente de configuracion y lo importas desde `CardBalance.tsx`.

### `src/App.css`

Situacion actual:

- Esta vacio y `App.tsx` lo sigue importando.

Recomendacion:

- Eliminar el import.
- Eliminar el archivo si no se va a usar.

### `src/assets/react.svg` y `src/assets/vite.svg`

Situacion actual:

- Parecen restos del scaffold inicial.
- No encontre uso actual.

Recomendacion:

- Eliminar si confirmas que no se necesitan.

### `src/data/movimientos.ts`

Situacion actual:

- Incluye categoria `transporte`, pero esa categoria no aparece en `categoriasPorTipo` ni en `categoriasLabels`.

Riesgo:

- Inconsistencia de dominio.
- La UI puede mostrar etiquetas crudas o comportamientos raros.

Recomendacion:

- O agregas `transporte` al catalogo oficial.
- O corriges el mock para usar una categoria valida.

## Problemas de arquitectura que hoy conviene corregir

### 1. Mezcla de estructura por tipo tecnico y por feature

Hoy el proyecto mezcla:

- `components`
- `context`
- `data`
- `types`
- `pages`

Eso funciona en proyectos pequenos, pero cuando crece termina repartiendo la logica de una misma feature en muchas carpetas.

Recomendacion:

- Migrar gradualmente a estructura por feature.

Ejemplo:

```text
src/
  app/
    App.tsx
    main.tsx
    providers/
  features/
    auth/
      components/
      context/
      domain/
      services/
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
  shared/
    components/
    lib/
    hooks/
    types/
  assets/
```

### 2. Utilidades duplicadas o dispersas

Hoy hay formateo de moneda y logica de resumen repetida o muy cercana entre componentes/provider/utils.

Recomendacion:

- Centralizar:
- `currency.ts`
- `date.ts`
- `movementSelectors.ts`
- `storageKeys.ts`

### 3. Contexts demasiado pesados

Cuando un provider tiene mucha logica, el archivo deja de ser una capa de integracion y se vuelve dificil de mantener.

Recomendacion:

- Provider corto.
- Logica de negocio en funciones puras.
- Storage en adaptadores separados.

## Propuesta concreta de estructura mas profesional

Opcion recomendada sin sobrerrefactor:

```text
src/
  app/
    App.tsx
    main.tsx
  assets/
  features/
    auth/
      components/
        AuthModal.tsx
        AuthLoginForm.tsx
        AuthRegisterForm.tsx
      context/
        AuthContext.tsx
        useAuth.ts
      services/
        authStorage.ts
        authService.ts
      types/
        auth.types.ts
    finanzas/
      components/
        CardBalance.tsx
        GoalCard.tsx
        FormMovimiento.tsx
        ListaMovimientos.tsx
        MovimientoListItem.tsx
      context/
        FinanzasContext.tsx
        useFinanzas.ts
      domain/
        finanzasCalculations.ts
        movimientoSelectors.ts
        movimientoNormalizers.ts
      storage/
        finanzasStorage.ts
        finanzasKeys.ts
      config/
        movementCategories.ts
      types/
        movimiento.types.ts
        formMovimiento.types.ts
        cardBalance.types.ts
    historial/
      components/
        HistorialMonthCard.tsx
        HistorialSummaryPanel.tsx
        HistorialExpenseBreakdown.tsx
        HistorialMovementsPanel.tsx
      domain/
        historial.utils.ts
  layouts/
    MainLayout.tsx
  pages/
    Home.tsx
    Historial.tsx
  shared/
    lib/
      currency.ts
      date.ts
```

## Plan sugerido por fases

### Fase 1. Limpieza segura

- Eliminar `App.css` si no se va a usar.
- Eliminar `src/data/cardBalance.ts` si queda muerto.
- Eliminar assets del scaffold que no se usen.
- Corregir categoria `transporte` en datos mock.
- Consolidar `finanzasStore.ts` y `finanzasContext.ts` en un solo archivo.

### Fase 2. Extraer utilidades puras

- Extraer formatters de moneda.
- Extraer helpers de fecha.
- Extraer calculos de resumen financiero.
- Extraer acceso a localStorage.

### Fase 3. Dividir componentes grandes

- `CardBalance.tsx`
- `AuthModal.tsx`
- `FormMovimiento.tsx`
- `HistorialMonthCard.tsx`
- `ListaMovimientos.tsx`
- `MainLayout.tsx`

### Fase 4. Reorganizar por feature

- Mover auth a `features/auth`.
- Mover finanzas a `features/finanzas`.
- Mover historial a `features/historial`.

## Prioridad recomendada

Si solo se van a hacer 5 cambios para elevar mucho la calidad del proyecto, yo haria estos en este orden:

1. Partir `FinanzasProvider.tsx` en provider + storage + calculos.
2. Partir `AuthContext.tsx` en context + auth service + auth storage.
3. Partir `CardBalance.tsx` y `FormMovimiento.tsx`.
4. Mover `historial.utils.ts` fuera de `components`.
5. Limpiar archivos muertos y unificar nombres de contexto.

## Conclusiones

El proyecto no esta mal encaminado, pero ya alcanzo el punto en el que necesita una estructura mas clara para seguir creciendo sin volverse dificil de mantener.

La mayor oportunidad no esta en crear mas carpetas por crear carpetas, sino en separar:

- UI
- logica de negocio
- storage
- configuracion
- tipos

Si haces esa separacion, la lectura del codigo mejora mucho, los componentes bajan de tamano y el proyecto queda listo para evolucionar hacia backend real, testing y escalamiento de features.
