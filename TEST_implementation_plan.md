# Plan de Implementación y Resultados: Integración de Jest

Este documento detalla el plan y el resultado de la integración de pruebas unitarias con Jest en el proyecto `recordatorio-medicacion`.

---

## 1. Configuración del Entorno de Pruebas

Para dar soporte a **React 19**, **React Native 0.81** y **Zustand 5**, se instalaron y configuraron las siguientes dependencias de desarrollo:
* **`jest` y `jest-expo`**: Motor y preset de pruebas adaptado al entorno de Expo.
* **`@testing-library/react-native` (v14+)**: Biblioteca para renderizar y probar componentes de React Native con soporte asíncrono para React 19.
* **`test-renderer`**: Biblioteca moderna de reemplazo para la deprecada `react-test-renderer` en React 19.
* **`babel-preset-expo`**: Transpilador necesario para procesar TypeScript y JSX de React Native.

### Archivos de Configuración

#### `babel.config.js` (Raíz del proyecto)
```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
  };
};
```

#### `package.json` (Clave `"jest"` y scripts)
Se configuró el preset y los patrones de transformación para incluir dependencias nativas:
```json
  "scripts": {
    ...
    "test": "jest"
  },
  "jest": {
    "preset": "jest-expo",
    "transformIgnorePatterns": [
      "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|sentry-expo|native-base|react-native-svg)"
    ]
  }
```

*Nota: Se corrigió un bug nativo en `node_modules/react-native/jest/mockComponent.js` usando encadenamiento opcional (`RealComponent.prototype?.constructor`) para evitar bloqueos por componentes funcionales sin prototipo bajo React 19.*

---

## 2. Pruebas Implementadas

### A. Componente Reutilizable: `Boton.tsx`
* **Código**: `src/components/Boton.tsx`
* **Prueba**: `src/components/Boton.test.tsx`
* **Descripción**: Se diseñó un componente de botón personalizable que acepta una variante (`primary`, `secondary`, `danger`) y reacciona a eventos. Su prueba valida que renderice correctamente el título y que llame a la función callback `onPress` cuando es presionado.

### B. Función Lógica: `recordatorioHelper.ts`
* **Código**: `src/utils/recordatorioHelper.ts`
* **Prueba**: `src/utils/recordatorioHelper.test.ts`
* **Descripción**: Una función lógica pura (`calcularIntervaloEnSegundos`) que recibe una cantidad de tiempo y su unidad (`segundos`, `minutos`, `horas`) y retorna el valor equivalente en segundos. Su prueba verifica las conversiones correctas y el manejo de valores inválidos (negativos).

### C. Store Global de Zustand: `useRecordatoriosStore.ts`
* **Código**: `src/store/useRecordatoriosStore.ts`
* **Prueba**: `src/store/useRecordatoriosStore.test.ts`
* **Descripción**: Se mockearon los accesos al almacenamiento asíncrono (`@react-native-async-storage/async-storage`) y el sistema de notificaciones de Expo para testear de manera aislada el comportamiento del store. Se prueba que se añadan los recordatorios, se carguen de base de datos correctamente y que al eliminar un recordatorio se limpie el estado y se cancele su notificación asociada.

---

## 3. Verificación de Resultados

Los tres test se ejecutan y validan con un único comando:

```bash
npm test
```

### Salida del comando de pruebas:
```bash
> recordatorio-medicacion@1.0.0 test
> jest

PASS src/store/useRecordatoriosStore.test.ts
PASS src/utils/recordatorioHelper.test.ts
PASS src/components/Boton.test.tsx

Test Suites: 3 passed, 3 total
Tests:       9 passed, 9 total
Snapshots:   0 total
Time:        2.307 s, estimated 4 s
Ran all test suites.
```
