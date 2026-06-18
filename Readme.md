                                 *** Proyecto de App Movil con los contenidos vistos hasta la fecha ***

Contenido de la App:

Es una App de recordatorios de medicamentos con la posibilidad de guardar los mismos en el dispositivo de manera persistente.

*Librerias utilizadas:

**expo-notifications** para programar las notificaciones locales.
**async-storage** para guardar los recordatorios y el user registrado.
**@react-navigation/native** para la navegación entre pantallas.

Parcial 2:

**expo-camera** Libreria de acceso a Camara del dispositivo 
**expo-image-picker** Libreria de acceso a Galeria de dispositivo
**Expo-location** Libreria de acceso GPS
**React-Native-Map** Libreria de Mapa de react-native (complementos MapView, Marker, PROVIDER_GOOGLE)
**expo-contacts** Libreria de acceso a Contactos del dispositivo
**expo-calendar** Libreria de acceso a Calendario del dispositivo


*Funcionalidades: 

Al iniciar la aplicación, se solicita al usuario inicie sesión (LoginScreen). Si el usuario no tiene cuenta, se puede registrar (Registro creen).   
Al momento de ingresar el mail no distingue entre mayusculas y minusculas, la contraseña requiere de al menos un simbolo, y entre 8 y 10 caracteres.

Una vez ingresado (HomeScreen), permite ver el listado de los recordatorios (mediante FlatList) y gestionar seleccionando la card correspondiente la eliminacion de dicho recordatorio(DetalleRecordatorioScreen). 

Al presionar "Nuevo Recordatorio" se puede agregar uno nuevo (GestionRecordatorioScreen). En esta pagina podemos definir el nombre del medicamento, una descripcion breve y setear el intervalo de tiempo de la alerta entre segundos, minutos u horas. Desde la parte superior de cada pantalla podemos volver a la pantalla anterior (utilizando react-native/stack-navigator).
Al presionar "Cerrar Sesión" se cierra la sesión, volviendo a la pantalla principal.

Al presionar "Farmacias Cercanas" se accede a una pantalla (FarmaciasScreen) que muestra en un mapa interactivo (react-native-maps) la ubicación actual del dispositivo. Permite agregar nuevas farmacias tocando el mapa (AgregarFarmaciaScreen), así como editarlas o eliminarlas (EditarFarmaciaScreen).

Al presionar "Contactos de Emergencia" se accede a una nueva pantalla (ContactosScreen) con el título "Contactos de emergencia" que permite importar un contacto de la agenda del dispositivo (expo-contacts), pudiendo realizar llamadas rápidas de emergencia directamente o eliminarlo de la lista.

Al presionar "Calendario de Consultas" se accede a una nueva pantalla (CalendarioScreen) con el título "Calendario de consulta medica" que permite programar citas o compromisos médicos (expo-calendar) en el calendario nativo de su dispositivo móvil de forma sincronizada con una alarma recordatorio (15 minutos antes).

Arquitectura de la aplicacion:

```text
recordatorio-medicacion/
├── App.tsx
├── assets/
│   └── Fondo.jpg
│
└── src/
    ├── data/
    │   ├── calendar.ts
    │   ├── contacts.ts
    │   ├── farmacias.ts
    │   ├── imageHandler.ts
    │   ├── location.ts
    │   ├── notifications.ts
    │   ├── permissions.ts
    │   └── storage.ts
    │
    ├── navigation/
    │   └── NavegacionPrincipal.tsx
    │
    ├── screens/
    │   ├── LoginScreen.tsx
    │   ├── RegistroScreen.tsx
    │   ├── HomeScreen.tsx
    │   ├── GestionRecordatorioScreen.tsx
    │   ├── DetalleRecordatorioScreen.tsx
    │   ├── CamaraScreen.tsx
    │   ├── FarmaciasScreen.tsx
    │   ├── AgregarFarmaciaScreen.tsx
    │   ├── EditarFarmaciaScreen.tsx
    │   ├── ContactosScreen.tsx
    │   └── CalendarioScreen.tsx
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
Home ──┬→ Contactos de emergencia (Importar y llamar contactos)
  │    └→ Calendario de consultas médicas (Agendar eventos en calendario nativo)
  ↓
Crear recordatorio
  ↓
Ver detalle
  ↓
Editar o eliminar recordatorio
```

*Inicializacion de la Aplicacion:

`npm install`

*Creacion de Proyecto:

`npx create-expo-app recordatorio-medicacion -t expo-template-blank-typescript`

*Instalacion de librerias:

(Parcial 1)

`npx expo install expo-notifications`
`npx expo install expo-device`
`npx expo install @react-native-async-storage/async-storage`
`npx expo install @react-navigation/native @react-navigation/native-stack`
`npx expo install react-native-screens`
`npx expo install react-native-safe-area-context`

(Parcial 2) 

`npx expo install expo-image-picker expo-camera expo-image-manipulator`
`npx expo install expo-location`
`npx expo install react-native-maps`
`npx expo install expo-contacts`
`npx expo install expo-calendar`
`npx expo install zustand`
`npx expo install jest @types/jest ts-jest`



*Codigo para ejecutar:

`npx expo start`    ((en mi caso particular al tener una PC de escritorio agregue --tunnel para probar la app en mi celular))

*Pruebas:

El desarrollo se realizó en Antigravity y los test mediantes Expo Go en un celular android.


*Video Demo y explicacion:

Parcial 1:
https://drive.google.com/drive/folders/1iNfAzBgsp0DUFEfH9065Wkh1pYc8yBhx?usp=sharing

Parcial 2:

https://drive.google.com/file/d/1wAVznANxysMMZDvunttilfVxheaB0SlA/view?usp=drive_link

---

## Estado Global con Zustand 

Se integró **Zustand** para la gestión del estado global de los recordatorios de medicamentos.

Se creó un store global en `src/store/useRecordatoriosStore.ts` que maneja:
- **`recordatorios`**: La lista principal que se comparte en toda la app.
- **Acciones**:
  - `cargarRecordatorios()`: Carga los recordatorios guardados en `AsyncStorage`.
  - `agregarRecordatorio(nuevo)`: Guarda un nuevo recordatorio en almacenamiento y actualiza el store.
  - `eliminarRecordatorio(id)`: Cancela notificaciones pendientes, elimina del almacenamiento y actualiza el store.
  - `actualizarFotoRecordatorio(id, foto)`: Actualiza o elimina la foto de un recordatorio y sincroniza con el almacenamiento.


Se implemento el asistente de IA integrado en el IDE de antigravity para desarrollar la implementacion de punto 5 del trabajo practico, Test mediante la libreria Jest. El prompt utilizado fue:

"""Mediante la implementacion de la libreria Jest integrar a la solucion tres test basicos del proyecto que incluyan un componente re utilizable, un test de funcion logica y por ultimo un test sobre el store global implementado con Zustand en el manejo de recordatorios guardados.  Por ultimo estos tres test de ejmeplo deben correr con un unico comando."""

El Plan de implementacion devuelto por el asistente  se encuentra en el archivo ./TEST_implementation_plan.md
Se adjunta en el Drive con el video demo una imagen del resultado de Run Test TP2RunTestApp.jpg:

https://drive.google.com/file/d/13wmjGnk5Qtqa0JwGHilGSiThoJmC5oB4/view?usp=drive_link





