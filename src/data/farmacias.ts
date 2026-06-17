import AsyncStorage from '@react-native-async-storage/async-storage';
import { Farmacia } from '../types/types';

const ClaveFarmacias = '@farmacias';

export const guardarFarmacias = async (
    farmacias: Farmacia[]
) => {
    try {
        await AsyncStorage.setItem(
            ClaveFarmacias,
            JSON.stringify(farmacias)
        );
        console.log('Farmacias guardadas');
    } catch (error) {
        console.log('Error al guardar farmacias', error);
    }
};

export const obtenerFarmacias = async (): Promise<Farmacia[]> => {
    try {
        const data = await AsyncStorage.getItem(ClaveFarmacias);

        if (data !== null) {
            return JSON.parse(data);
        }
        return [];
    } catch (error) {
        console.log('Error al obtener farmacias', error);
        return [];
    }
};

export const agregarFarmacia = async (
    farmacia: Farmacia
) => {
    try {
        const farmacias = await obtenerFarmacias();
        farmacias.push(farmacia);
        await guardarFarmacias(farmacias);
        console.log('Farmacia agregada');
    } catch (error) {
        console.log('Error al agregar farmacia', error);
    }
};

export const eliminarFarmacia = async (id: string) => {
    try {
        const farmacias = await obtenerFarmacias();
        const nuevaLista = farmacias.filter(
            (f: Farmacia) => f.id !== id
        );
        await guardarFarmacias(nuevaLista);
        console.log('Farmacia eliminada');
    } catch (error) {
        console.log('Error al eliminar farmacia', error);
    }
};

export const editarFarmacia = async (
    id: string,
    datosActualizados: Partial<Farmacia>
) => {
    try {
        const farmacias = await obtenerFarmacias();
        const indice = farmacias.findIndex(
            (f: Farmacia) => f.id === id
        );

        if (indice !== -1) {
            farmacias[indice] = {
                ...farmacias[indice],
                ...datosActualizados
            };
            await guardarFarmacias(farmacias);
            console.log('Farmacia editada');
        }
    } catch (error) {
        console.log('Error al editar farmacia', error);
    }
};

export const obtenerFarmaciaPorId = async (
    id: string
): Promise<Farmacia | null> => {
    try {
        const farmacias = await obtenerFarmacias();
        const farmacia = farmacias.find(
            (f: Farmacia) => f.id === id
        );
        return farmacia || null;
    } catch (error) {
        console.log('Error al obtener farmacia', error);
        return null;
    }
};
