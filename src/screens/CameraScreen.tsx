import { useRef, useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert
} from 'react-native';
import * as Camera from 'expo-camera';
import { capturarFoto } from '../data/imageHandler';

export default function CameraScreen({
    route,
    navigation
}: any) {
    const { onPhotoCapture } = route.params;

    const cameraRef = useRef<Camera.CameraView>(null);
    const [facing, setFacing] =
        useState<'front' | 'back'>('back');
    const [flash, setFlash] =
        useState<'on' | 'off'>('off');
    const [photoUri, setPhotoUri] =
        useState<string | null>(null);
    const [isLoading, setIsLoading] =
        useState(false);

    const toggleFacing = () => {
        setFacing((current) =>
            current === 'back' ? 'front' : 'back'
        );
    };

    const toggleFlash = () => {
        setFlash((current) =>
            current === 'off' ? 'on' : 'off'
        );
    };

    const takePicture = async () => {
        if (!cameraRef.current) return;

        try {
            setIsLoading(true);
            const photo =
                await cameraRef.current.takePictureAsync({
                    quality: 0.8
                });

            setPhotoUri(photo.uri);
        } catch (error) {
            Alert.alert(
                'Error',
                'No se pudo capturar la foto'
            );
            console.log('Camera error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const usePhoto = async () => {
        if (!photoUri) return;

        try {
            setIsLoading(true);
            const result = await capturarFoto(
                photoUri
            );

            if (result.success && result.data) {
                onPhotoCapture(result.data);
                navigation.goBack();
            } else {
                Alert.alert(
                    'Error',
                    result.error ||
                        'Error al procesar foto'
                );
            }
        } catch (error) {
            Alert.alert(
                'Error',
                'Error al procesar la foto'
            );
        } finally {
            setIsLoading(false);
        }
    };

    const discardPhoto = () => {
        setPhotoUri(null);
    };

    if (photoUri) {
        return (
            <View style={styles.previewContainer}>
                <Text style={styles.previewText}>
                    ¿Usar esta foto?
                </Text>

                <TouchableOpacity
                    style={[
                        styles.button,
                        styles.useButton
                    ]}
                    onPress={usePhoto}
                    disabled={isLoading}
                >
                    <Text
                        style={styles.buttonText}
                    >
                        {isLoading
                            ? 'Procesando...'
                            : 'Usar esta foto'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.button,
                        styles.discardButton
                    ]}
                    onPress={discardPhoto}
                    disabled={isLoading}
                >
                    <Text
                        style={styles.buttonText}
                    >
                        Descartar
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Camera.CameraView
                style={styles.camera}
                ref={cameraRef}
                facing={facing}
                flash={flash}
            >
                <View style={styles.controlsTop}>
                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={toggleFacing}
                    >
                        <Text
                            style={styles.iconText}
                        >
                            ↻
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.iconButton}
                        onPress={toggleFlash}
                    >
                        <Text
                            style={styles.iconText}
                        >
                            {flash === 'on'
                                ? '⚡'
                                : '◯'}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() =>
                            navigation.goBack()
                        }
                    >
                        <Text
                            style={styles.closeText}
                        >
                            ✕
                        </Text>
                    </TouchableOpacity>
                </View>

                <View
                    style={styles.controlsBottom}
                >
                    <TouchableOpacity
                        style={styles.captureButton}
                        onPress={takePicture}
                        disabled={isLoading}
                    >
                        <View
                            style={
                                styles.captureDot
                            }
                        />
                    </TouchableOpacity>
                </View>
            </Camera.CameraView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000'
    },

    camera: {
        flex: 1
    },

    controlsTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: 20,
        paddingTop: 10
    },

    controlsBottom: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingBottom: 30,
        flex: 1
    },

    iconButton: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },

    iconText: {
        color: '#fff',
        fontSize: 24
    },

    closeButton: {
        backgroundColor: 'rgba(255,0,0,0.5)',
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center'
    },

    closeText: {
        color: '#fff',
        fontSize: 28,
        fontWeight: 'bold'
    },

    captureButton: {
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: 'rgba(255,255,255,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff'
    },

    captureDot: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#fff'
    },

    previewContainer: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },

    previewText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center'
    },

    button: {
        padding: 14,
        borderRadius: 8,
        marginVertical: 10,
        width: '100%'
    },

    useButton: {
        backgroundColor: '#2563eb'
    },

    discardButton: {
        backgroundColor: '#dc2626'
    },

    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16
    }
});
