import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';

export interface ImageResult {
    success: boolean;
    data: string | null;
    error?: string;
}

const compressImage = async (
    uri: string
): Promise<string | null> => {
    try {
        const manipResult =
            await ImageManipulator.manipulateAsync(
                uri,
                [{ resize: { width: 1000, height: 1000 } }],
                { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
            );

        const base64 = await FileSystem.readAsStringAsync(
            manipResult.uri,
            { encoding: 'base64' }
        );

        return `data:image/jpeg;base64,${base64}`;
    } catch (error) {
        console.log('Error compressing image', error);
        return null;
    }
};

export const seleccionarDelaGaleria =
    async (): Promise<ImageResult> => {
        try {
            const result =
                await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                    allowsEditing: true,
                    aspect: [4, 3],
                    quality: 0.8
                });

            if (result.canceled) {
                return {
                    success: false,
                    data: null,
                    error: 'Selección cancelada'
                };
            }

            const compressed = await compressImage(
                result.assets[0].uri
            );

            if (!compressed) {
                return {
                    success: false,
                    data: null,
                    error: 'Error al procesar imagen'
                };
            }

            return {
                success: true,
                data: compressed
            };
        } catch (error) {
            console.log(
                'Error selecting image from gallery',
                error
            );
            return {
                success: false,
                data: null,
                error: 'Error al seleccionar imagen'
            };
        }
    };

export const capturarFoto = async (
    photoUri: string
): Promise<ImageResult> => {
    try {
        const compressed =
            await compressImage(photoUri);

        if (!compressed) {
            return {
                success: false,
                data: null,
                error: 'Error al procesar foto'
            };
        }

        return {
            success: true,
            data: compressed
        };
    } catch (error) {
        console.log('Error capturing photo', error);
        return {
            success: false,
            data: null,
            error: 'Error al capturar foto'
        };
    }
};

