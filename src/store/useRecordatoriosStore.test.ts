import { useRecordatoriosStore } from './useRecordatoriosStore';
import { Recordatorio } from '../types/types';

// Mock storage functions to isolate Zustand state testing
jest.mock('../data/storage', () => ({
    guardarRecordatorios: jest.fn(),
    obtenerRecordatorios: jest.fn(() => Promise.resolve([])),
}));

// Mock notifications function
jest.mock('../data/notifications', () => ({
    cancelarNotificacion: jest.fn(),
}));

import { guardarRecordatorios, obtenerRecordatorios } from '../data/storage';
import { cancelarNotificacion } from '../data/notifications';

describe('useRecordatoriosStore', () => {
    beforeEach(() => {
        // Reset the store state before each test
        useRecordatoriosStore.setState({
            recordatorios: [],
            loading: false
        });
        jest.clearAllMocks();
    });

    it('should add a reminder successfully and save it to storage', async () => {
        const nuevoRecordatorio: Recordatorio = {
            id: '1',
            nombreMedicacion: 'Ibuprofeno',
            descripcion: 'Cada 8 horas',
            tiempo: 8,
            unidad: 'horas'
        };

        await useRecordatoriosStore.getState().agregarRecordatorio(nuevoRecordatorio);

        expect(useRecordatoriosStore.getState().recordatorios).toContainEqual(nuevoRecordatorio);
        expect(guardarRecordatorios).toHaveBeenCalledWith([nuevoRecordatorio]);
    });

    it('should load reminders from storage successfully', async () => {
        const listaSimulada: Recordatorio[] = [
            {
                id: '1',
                nombreMedicacion: 'Ibuprofeno',
                descripcion: 'Cada 8 horas',
                tiempo: 8,
                unidad: 'horas'
            }
        ];
        (obtenerRecordatorios as jest.Mock).mockResolvedValue(listaSimulada);

        await useRecordatoriosStore.getState().cargarRecordatorios();

        expect(useRecordatoriosStore.getState().recordatorios).toEqual(listaSimulada);
        expect(useRecordatoriosStore.getState().loading).toBe(false);
    });

    it('should delete a reminder and cancel its scheduled notification', async () => {
        const recordatorio: Recordatorio = {
            id: '1',
            nombreMedicacion: 'Ibuprofeno',
            descripcion: 'Cada 8 horas',
            tiempo: 8,
            unidad: 'horas',
            notificationId: 'notif-123'
        };

        // Populate store
        useRecordatoriosStore.setState({ recordatorios: [recordatorio] });

        await useRecordatoriosStore.getState().eliminarRecordatorio('1');

        expect(useRecordatoriosStore.getState().recordatorios).toEqual([]);
        expect(cancelarNotificacion).toHaveBeenCalledWith('notif-123');
        expect(guardarRecordatorios).toHaveBeenCalledWith([]);
    });
});
