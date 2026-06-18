import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegistroScreen from '../screens/RegistroScreen';
import HomeScreen from '../screens/HomeScreen';
import GestionRecordatorioScreen from '../screens/GestionRecordatorioScreen';
import DetalleRecordatorioScreen from '../screens/DetalleRecordatorioScreen';
import CameraScreen from '../screens/CameraScreen';
import FarmaciasScreen from '../screens/FarmaciasScreen';
import AgregarFarmaciaScreen from '../screens/AgregarFarmaciaScreen';
import EditarFarmaciaScreen from '../screens/EditarFarmaciaScreen';
import ContactosScreen from '../screens/ContactosScreen';
import CalendarioScreen from '../screens/CalendarioScreen';

export type RootStackParamList = {
    Login: undefined;
    Registro: undefined;
    Home: undefined;
    GestionRecordatorios: undefined;
    DetalleRecordatorio: { id: string };
    Camera: { onPhotoCapture: (photo: string) => void };
    Farmacias: undefined;
    AgregarFarmacia: undefined;
    EditarFarmacia: { id: string };
    Contactos: undefined;
    Calendario: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function NavegacionPrincipal() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login">
                <Stack.Screen
                    name="Login"
                    component={LoginScreen}
                    options={{ title: 'Iniciar sesión' }}
                />
                <Stack.Screen
                    name="Registro"
                    component={RegistroScreen}
                    options={{ title: 'Registro' }}
                />
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ title: 'Inicio' }}
                />
                <Stack.Screen
                    name="GestionRecordatorios"
                    component={GestionRecordatorioScreen}
                    options={{ title: 'Gestionar Recordatorios' }}
                />
                <Stack.Screen
                    name="DetalleRecordatorio"
                    component={DetalleRecordatorioScreen}
                    options={{ title: 'Detalle' }}
                />
                <Stack.Screen
                    name="Camera"
                    component={CameraScreen}
                    options={{ title: 'Capturar Foto' }}
                />
                <Stack.Screen
                    name="Farmacias"
                    component={FarmaciasScreen}
                    options={{ title: 'Farmacias Cercanas' }}
                />
                <Stack.Screen
                    name="AgregarFarmacia"
                    component={AgregarFarmaciaScreen}
                    options={{ title: 'Agregar Farmacia' }}
                />
                <Stack.Screen
                    name="EditarFarmacia"
                    component={EditarFarmaciaScreen}
                    options={{ title: 'Editar Farmacia' }}
                />
                <Stack.Screen
                    name="Contactos"
                    component={ContactosScreen}
                    options={{ title: 'Contactos de emergencia' }}
                />
                <Stack.Screen
                    name="Calendario"
                    component={CalendarioScreen}
                    options={{ title: 'Calendario de consulta medica' }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

