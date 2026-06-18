import * as ImagePicker from 'expo-image-picker';
import * as Contacts from 'expo-contacts';
import * as Calendar from 'expo-calendar';

export type PermissionStatus = 'granted' | 'denied' | 'undetermined';

export interface PermissionResult {
    status: PermissionStatus;
    canAskAgain: boolean;
}

export const requestCameraPermission =
    async (): Promise<PermissionResult> => {
        try {
            const { status, canAskAgain } =
                await ImagePicker.requestCameraPermissionsAsync();

            return {
                status: status as PermissionStatus,
                canAskAgain
            };
        } catch (error) {
            console.log(
                'Error al obtener permiso de camara',
                error
            );
            return {
                status: 'undetermined',
                canAskAgain: true
            };
        }
    };

export const getCameraPermissionStatus =
    async (): Promise<PermissionStatus> => {
        try {
            const { status } =
                await ImagePicker.getCameraPermissionsAsync();

            return status as PermissionStatus;
        } catch (error) {
            console.log(
                'Error al obtener permiso de camara',
                error
            );
            return 'undetermined';
        }
    };

export const requestMediaLibraryPermission =
    async (): Promise<PermissionResult> => {
        try {
            const { status, canAskAgain } =
                await ImagePicker.requestMediaLibraryPermissionsAsync();

            return {
                status: status as PermissionStatus,
                canAskAgain
            };
        } catch (error) {
            console.log(
                'Error al obtener permiso para galeria',
                error
            );
            return {
                status: 'undetermined',
                canAskAgain: true
            };
        }
    };

export const getMediaLibraryPermissionStatus =
    async (): Promise<PermissionStatus> => {
        try {
            const { status } =
                await ImagePicker.getMediaLibraryPermissionsAsync();

            return status as PermissionStatus;
        } catch (error) {
            console.log(
                'Error al obtener permiso para galeria',
                error
            );
            return 'undetermined';
        }
    };

export const requestContactsPermission =
    async (): Promise<PermissionResult> => {
        try {
            const { status, canAskAgain } =
                await Contacts.requestPermissionsAsync();

            return {
                status: status as PermissionStatus,
                canAskAgain
            };
        } catch (error) {
            console.log(
                'Error al obtener permiso para contactos',
                error
            );
            return {
                status: 'undetermined',
                canAskAgain: true
            };
        }
    };

export const getContactsPermissionStatus =
    async (): Promise<PermissionStatus> => {
        try {
            const { status } =
                await Contacts.getPermissionsAsync();

            return status as PermissionStatus;
        } catch (error) {
            console.log(
                'Error al obtener permiso para contactos',
                error
            );
            return 'undetermined';
        }
    };

export const requestCalendarPermission =
    async (): Promise<PermissionResult> => {
        try {
            const { status, canAskAgain } =
                await Calendar.requestCalendarPermissionsAsync();

            return {
                status: status as PermissionStatus,
                canAskAgain
            };
        } catch (error) {
            console.log(
                'Error de pedido de Acceso a Calendario',
                error
            );
            return {
                status: 'undetermined',
                canAskAgain: true
            };
        }
    };

export const getCalendarPermissionStatus =
    async (): Promise<PermissionStatus> => {
        try {
            const { status } =
                await Calendar.getCalendarPermissionsAsync();

            return status as PermissionStatus;
        } catch (error) {
            console.log(
                'Error al obtener permisos de acceso al calendario',
                error
            );
            return 'undetermined';
        }
    };



