import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Calendar from 'expo-calendar';
import { ConsultaMedica } from '../types/types';

const ClaveConsultas = '@consultas_medicas';

export const guardarConsultas = async (
    consultas: ConsultaMedica[]
) => {
    try {
        await AsyncStorage.setItem(
            ClaveConsultas,
            JSON.stringify(consultas)
        );
        console.log('Consultas guardadas');
    } catch (error) {
        console.log('Error al guardar consultas', error);
    }
};

export const obtenerConsultas = async (): Promise<ConsultaMedica[]> => {
    try {
        const data = await AsyncStorage.getItem(ClaveConsultas);

        if (data !== null) {
            return JSON.parse(data);
        }
        return [];
    } catch (error) {
        console.log('Error al obtener consultas', error);
        return [];
    }
};


const obtenerOCrearCalendarioApp = async (): Promise<string | null> => {
    try {
        const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);


        const existingAppCalendar = calendars.find(
            (c) => c.name === 'consultas_medicas'
        );
        if (existingAppCalendar) {
            return existingAppCalendar.id;
        }


        const writableCalendar = calendars.find((c) => c.allowsModifications);
        if (writableCalendar) {
            return writableCalendar.id;
        }

        const defaultCalendarSource = {
            isLocalAccount: true,
            name: 'Recordatorio Medicacion',
            type: Calendar.SourceType.LOCAL
        };

        const newCalendarId = await Calendar.createCalendarAsync({
            title: 'Consultas Médicas',
            color: '#7c3aed',
            entityType: Calendar.EntityTypes.EVENT,
            sourceId: defaultCalendarSource.name,
            source: defaultCalendarSource,
            name: 'consultas_medicas',
            ownerAccount: 'personal',
            accessLevel: Calendar.CalendarAccessLevel.OWNER
        });
        return newCalendarId;
    } catch (error) {
        console.log('Error obteniendo/creando calendario:', error);
        return null;
    }
};


export const agendarEnCalendarioDispositivo = async (
    titulo: string,
    fecha: string,
    hora: string,
    notas: string
): Promise<string | null> => {
    try {
        const calendarId = await obtenerOCrearCalendarioApp();
        if (!calendarId) {
            console.log('No se pudo encontrar o crear un calendario');
            return null;
        }


        const [dia, mes, anio] = fecha.split('/').map(Number);
        const [horas, minutos] = hora.split(':').map(Number);

        const startDate = new Date(anio, mes - 1, dia, horas, minutos);

        const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);

        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'GMT-3';

        const eventId = await Calendar.createEventAsync(calendarId, {
            title: `Consulta Médica: ${titulo}`,
            startDate,
            endDate,
            notes: notas,
            timeZone,
            alarms: [{ relativeOffset: -15 }]
        });

        console.log('Evento creado en el calendario del dispositivo:', eventId);
        return eventId;
    } catch (error) {
        console.log('Error creando evento en el calendario:', error);
        return null;
    }
};


export const removerDeCalendarioDispositivo = async (eventId: string) => {
    try {
        await Calendar.deleteEventAsync(eventId);
        console.log('Evento eliminado del calendario del dispositivo');
    } catch (error) {
        console.log('Error al eliminar evento de calendario:', error);
    }
};
