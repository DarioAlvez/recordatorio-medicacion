import * as ImagePicker from 'expo-image-picker';

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
                'Error requesting camera permission',
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
                'Error getting camera permission',
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
                'Error requesting media library permission',
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
                'Error getting media library permission',
                error
            );
            return 'undetermined';
        }
    };


