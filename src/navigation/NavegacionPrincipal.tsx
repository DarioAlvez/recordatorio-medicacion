import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import RegistroScreen from '../screens/RegistroScreen';
import HomeScreen from '../screens/HomeScreen';
import GestionRecordatorioScreen from '../screens/GestionRecordatorioScreen';
import DetalleRecordatorioScreen from '../screens/DetalleRecordatorioScreen';

export type RootStackParamList = {
    Login: undefined;
    Registro: undefined;
    Home: undefined;
    GestionRecordatorios: undefined;
    DetalleRecordatorio: { id: string };
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
            </Stack.Navigator>
        </NavigationContainer>
    );
}