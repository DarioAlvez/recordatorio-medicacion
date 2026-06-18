import * as Location from 'expo-location';
import { Linking } from 'react-native';

export type PermissionStatus = 'granted' | 'denied' | 'undetermined';

export interface PermissionResult {
    status: PermissionStatus;
    canAskAgain: boolean;
}

export const requestLocationPermission =
    async (): Promise<PermissionResult> => {
        try {
            const { status, canAskAgain } =
                await Location.requestForegroundPermissionsAsync();

            return {
                status: status as PermissionStatus,
                canAskAgain
            };
        } catch (error) {
            console.log(
                'Error requesting location permission',
                error
            );
            return {
                status: 'undetermined',
                canAskAgain: true
            };
        }
    };

export const getLocationPermissionStatus =
    async (): Promise<PermissionStatus> => {
        try {
            const { status } =
                await Location.getForegroundPermissionsAsync();

            return status as PermissionStatus;
        } catch (error) {
            console.log(
                'Error getting location permission',
                error
            );
            return 'undetermined';
        }
    };

export const obtenerUbicacionActual = async () => {
    try {
        const permStatus =
            await getLocationPermissionStatus();

        if (permStatus !== 'granted') {
            return null;
        }

        const location =
            await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High
            });

        return {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy
        };
    } catch (error) {
        console.log(
            'Error getting current location',
            error
        );
        return null;
    }
};

export const calcularDistancia = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
): number => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distancia = R * c;

    return Math.round(distancia * 100) / 100;
};
