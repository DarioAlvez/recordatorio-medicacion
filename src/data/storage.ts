import AsyncStorage from '@react-native-async-storage/async-storage';

const ClaveUsuario = '@usuario';

export const guardarUsuario = async (
    usuario: string,
    password: string
) => {
    try {
        const userData = {
            usuario,
            password
        };

        await AsyncStorage.setItem(
            ClaveUsuario,
            JSON.stringify(userData)
        );

        console.log('Usuario guardado');
    } catch (error) {
        console.log('Error al guardar usuario', error);
    }
};

export const obtenerUsuario = async () => {
    try {
        const data = await AsyncStorage.getItem(ClaveUsuario);

        if (data !== null) {
            return JSON.parse(data);
        }

        return null;
    } catch (error) {
        console.log('Error al obtener usuario', error);
        return null;
    }
};
import { Recordatorio } from '../types/types';

const ClaveRecordatorios = '@recordatorios';

export const guardarRecordatorios = async (
    recordatorios: Recordatorio[]
) => {

    try {

        await AsyncStorage.setItem(
            ClaveRecordatorios,
            JSON.stringify(recordatorios)
        );

    } catch (error) {

        console.log(
            'Error al guardar recordatorios',
            error
        );

    }

};

export const obtenerRecordatorios = async () => {

    try {
        const data = await AsyncStorage.getItem(
            ClaveRecordatorios
        );

        if (data !== null) {
            return JSON.parse(data);
        }
        return [];

    } catch (error) {

        console.log(
            'Error al obtener recordatorios',
            error
        );

        return [];

    }

};