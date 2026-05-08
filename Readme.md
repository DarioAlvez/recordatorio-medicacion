                                *** Proyecto de App Movil con los contenidos vistos hasta la fecha ***

Contenido de la App:

Es una App de recordatorios de medicamentos con la posibilidad de guardar los mismos en el dispositivo de manera persistente.

*Librerias utilizadas:

**expo-notifications** para programar las notificaciones locales.
**async-storage** para guardar los recordatorios y el user registrado.
**@react-navigation/native** para la navegación entre pantallas.


*Funcionalidades: 

Al iniciar la aplicación, se solicita al usuario inicie sesión (LoginScreen). Si el usuario no tiene cuenta, se puede registrar (RegistroScreen). 
Al momento de ingresar el mail no distingue entre mayusculas y minusculas, la contraseña requiere de al menos un simbolo, y entre 8 y 10 caracteres.

Una vez ingresado (HomeScreen), permite ver el listado de los recordatorios (mediante FlatList) y gestionar seleccionando la card correspondiente la eliminacion de dicho recordatorio(DetalleRecordatorioScreen). 
Al presionar "Nuevo Recordatorio" se puede agregar uno nuevo (GestionRecordatorioScreen). En esta pagina podemos definir el nombre del medicamento, una descripcion breve y setear el intervalo de tiempo de la alerta entre segundos, minutos u horas. Desde la parte superior de cada pantalla podemos volver a la pantalla anterior (utilizando react-native/stack-navigator).
Al presionar "Cerrar Sesión" se cierra la sesión, volviendo a la pantalla principal.

Arquitectura de la aplicacion:

```text
recordatorio-medicacion/
├── App.tsx
├── assets/
│   └── Fondo.jpg
└── src/
    ├── screens/
    │   ├── LoginScreen.tsx
    │   ├── RegistroScreen.tsx
    │   ├── HomeScreen.tsx
    │   ├── GestionRecordatorioScreen.tsx
    │   └── DetalleRecordatorioScreen.tsx
    │
    ├── navigation/
    │   └── NavegacionPrincipal.tsx
    │
    ├── data/
    │   ├── storage.ts
    │   └── notifications.ts
    │
    └── types/
        └── types.ts
```

Su workflow:

```text
Login
  ↓
Registro, si el usuario no tiene cuenta
  ↓
Home
  ↓
Crear recordatorio
  ↓
Ver detalle
  ↓
Editar o eliminar recordatorio
```

Inicializacion de la Aplicacion:

`npx create-expo-app recordatorio-medicacion -t expo-template-blank-typescript`

*Instalacion de librerias:

`npx expo install expo-notifications`
`npx expo install expo-device`
`npx expo install @react-native-async-storage/async-storage`
`npx expo install @react-navigation/native @react-navigation/native-stack`
`npx expo install react-native-screens`
`npx expo install react-native-safe-area-context`

*Codigo para ejecutar:

`npx expo start`    ((en mi caso particular al tener una PC de escritorio agregue --tunnel para probar la app en mi celular))


El desarrollo se dio en Antigravity y los test mediantes Expo Go en un celular android.


El video Demo y la explicacion quedan en:

https://drive.google.com/drive/folders/1iNfAzBgsp0DUFEfH9065Wkh1pYc8yBhx?usp=sharing

  


