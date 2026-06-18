import { create } from 'zustand';
import { Recordatorio } from '../types/types';
import { guardarRecordatorios, obtenerRecordatorios } from '../data/storage';
import { cancelarNotificacion } from '../data/notifications';

interface RecordatoriosState {
    recordatorios: Recordatorio[];
    loading: boolean;
    cargarRecordatorios: () => Promise<void>;
    agregarRecordatorio: (nuevo: Recordatorio) => Promise<void>;
    eliminarRecordatorio: (id: string) => Promise<void>;
    actualizarFotoRecordatorio: (id: string, foto?: string) => Promise<void>;
}

export const useRecordatoriosStore = create<RecordatoriosState>((set, get) => ({
    recordatorios: [],
    loading: false,

    cargarRecordatorios: async () => {
        set({ loading: true });
        try {
            const lista = await obtenerRecordatorios();
            set({ recordatorios: lista });
        } catch (error) {
            console.error('Error al cargar recordatorios en el store', error);
        } finally {
            set({ loading: false });
        }
    },

    agregarRecordatorio: async (nuevo: Recordatorio) => {
        const { recordatorios } = get();
        const nuevaLista = [...recordatorios, nuevo];
        
        try {
            await guardarRecordatorios(nuevaLista);
            set({ recordatorios: nuevaLista });
        } catch (error) {
            console.error('Error al agregar recordatorio en el store', error);
        }
    },

    eliminarRecordatorio: async (id: string) => {
        const { recordatorios } = get();
        const recordatorioAEliminar = recordatorios.find((r) => r.id === id);
        
        if (recordatorioAEliminar?.notificationId) {
            try {
                await cancelarNotificacion(recordatorioAEliminar.notificationId);
            } catch (error) {
                console.error('Error al cancelar la notificación', error);
            }
        }

        const nuevaLista = recordatorios.filter((r) => r.id !== id);
        try {
            await guardarRecordatorios(nuevaLista);
            set({ recordatorios: nuevaLista });
        } catch (error) {
            console.error('Error al eliminar recordatorio en el store', error);
        }
    },

    actualizarFotoRecordatorio: async (id: string, foto?: string) => {
        const { recordatorios } = get();
        const nuevaLista = recordatorios.map((r) => {
            if (r.id === id) {
                return { ...r, foto };
            }
            return r;
        });

        try {
            await guardarRecordatorios(nuevaLista);
            set({ recordatorios: nuevaLista });
        } catch (error) {
            console.error('Error al actualizar foto en el store', error);
        }
    }
}));
