import AsyncStorage from '@react-native-async-storage/async-storage';
import { ContactoEmergencia } from '../types/types';

const ClaveContactos = '@contactos_emergencia';

export const guardarContactos = async (
    contactos: ContactoEmergencia[]
) => {
    try {
        await AsyncStorage.setItem(
            ClaveContactos,
            JSON.stringify(contactos)
        );
        console.log('Contactos guardados');
    } catch (error) {
        console.log('Error al guardar contactos', error);
    }
};

export const obtenerContactos = async (): Promise<ContactoEmergencia[]> => {
    try {
        const data = await AsyncStorage.getItem(ClaveContactos);

        if (data !== null) {
            return JSON.parse(data);
        }
        return [];
    } catch (error) {
        console.log('Error al obtener contactos', error);
        return [];
    }
};

export const agregarContacto = async (
    contacto: ContactoEmergencia
) => {
    try {
        const contactos = await obtenerContactos();
        contactos.push(contacto);
        await guardarContactos(contactos);
        console.log('Contacto agregado');
    } catch (error) {
        console.log('Error al agregar contacto', error);
    }
};

export const eliminarContacto = async (id: string) => {
    try {
        const contactos = await obtenerContactos();
        const nuevaLista = contactos.filter(
            (c: ContactoEmergencia) => c.id !== id
        );
        await guardarContactos(nuevaLista);
        console.log('Contacto eliminado');
    } catch (error) {
        console.log('Error al eliminar contacto', error);
    }
};
