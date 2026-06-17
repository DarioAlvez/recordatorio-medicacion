import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground, Image, Alert, ScrollView, Linking } from 'react-native';

import { obtenerRecordatorios } from '../data/storage';
import { Recordatorio } from '../types/types';
import { guardarRecordatorios } from '../data/storage';
import { cancelarNotificacion } from '../data/notifications';
import { seleccionarDelaGaleria } from '../data/imageHandler';
import { requestCameraPermission, requestMediaLibraryPermission } from '../data/permissions';

export default function DetalleRecordatorioScreen({ route, navigation }: any) {

    const { id } = route.params;

    const [recordatorio, setRecordatorio] =
        useState<Recordatorio | null>(null);

    useEffect(() => {
        cargarRecordatorio();
    }, []);

    const cargarRecordatorio = async () => {

        const lista =
            await obtenerRecordatorios();

        const encontrado =
            lista.find(
                (r: Recordatorio) => r.id === id
            );

        if (encontrado) {
            setRecordatorio(encontrado);
        }

    };

    const eliminarRecordatorio = async () => {

        const lista =
            await obtenerRecordatorios();

        const nuevaLista =
            lista.filter(
                (r: Recordatorio) => r.id !== id
            );

        if (recordatorio?.notificationId) {

            await cancelarNotificacion(
                recordatorio.notificationId
            );

        }

        await guardarRecordatorios(
            nuevaLista
        );

        navigation.goBack();

    };

    const eliminarFoto = async () => {
        if (!recordatorio) return;

        const nuevaLista = await obtenerRecordatorios();
        const indexRec = nuevaLista.findIndex(
            (r: Recordatorio) => r.id === id
        );

        if (indexRec !== -1) {
            nuevaLista[indexRec].foto = undefined;
            await guardarRecordatorios(nuevaLista);
            setRecordatorio({
                ...recordatorio,
                foto: undefined
            });

            Alert.alert('Éxito', 'Foto eliminada');
        }
    };

    const cambiarFoto = async () => {
        Alert.alert(
            'Capturar foto',
            'Elige cómo obtener la foto',
            [
                {
                    text: 'Capturar con cámara',
                    onPress: async () => {
                        const permission = await requestCameraPermission();
                        if (permission.status === 'granted') {
                            navigation.navigate('Camera', {
                                onPhotoCapture: (photoData: string) => {
                                    guardarNuevaFoto(photoData);
                                }
                            });
                        } else if (permission.status === 'denied') {
                            Alert.alert(
                                'Permiso denegado',
                                'Habilita el permiso en configuración.',
                                [
                                    {
                                        text: 'Abrir configuración',
                                        onPress: () => Linking.openSettings()
                                    },
                                    { text: 'Cancelar', style: 'cancel' }
                                ]
                            );
                        }
                    }
                },
                {
                    text: 'De la galería',
                    onPress: () => {
                        seleccionarDelGaleria();
                    }
                },
                {
                    text: 'Cancelar',
                    style: 'cancel'
                }
            ]
        );
    };

    const seleccionarDelGaleria = async () => {
        const permission = await requestMediaLibraryPermission();

        if (permission.status === 'granted') {
            const result = await seleccionarDelaGaleria();

            if (result.success && result.data) {
                guardarNuevaFoto(result.data);
            } else {
                Alert.alert('Error', result.error || 'No se pudo seleccionar la imagen');
            }
        } else if (permission.status === 'denied') {
            Alert.alert(
                'Permiso de galería denegado',
                'Se requiere acceso a la galería para seleccionar fotos.',
                [
                    {
                        text: 'Abrir configuración',
                        onPress: () => Linking.openSettings(),
                        style: 'default'
                    },
                    {
                        text: 'Cancelar',
                        style: 'cancel'
                    }
                ]
            );
        }
    };

    const guardarNuevaFoto = async (photoData: string) => {
        if (!recordatorio) return;

        const nuevaLista = await obtenerRecordatorios();
        const indexRec = nuevaLista.findIndex(
            (r: Recordatorio) => r.id === id
        );

        if (indexRec !== -1) {
            nuevaLista[indexRec].foto = photoData;
            await guardarRecordatorios(nuevaLista);
            setRecordatorio({
                ...recordatorio,
                foto: photoData
            });

            Alert.alert('Éxito', 'Foto actualizada');
        }
    };

    if (!recordatorio) {

        return (
            <View style={styles.container}>
                <Text>Cargando...</Text>
            </View>
        );

    }

    return (
        <ImageBackground
            source={require('../../assets/Fondo.jpg')}
            style={styles.background}
            imageStyle={styles.imageOverlay}
            resizeMode="cover"
        >
            <ScrollView style={styles.scrollContainer}>
                <View style={styles.container}>

                    <Text style={styles.title}>
                        {recordatorio.nombreMedicacion}
                    </Text>

                    <Text style={styles.text}>
                        {recordatorio.descripcion}
                    </Text>

                    <Text style={styles.text}>
                        Cada {recordatorio.tiempo}
                        {' '}
                        {recordatorio.unidad}
                    </Text>

                    {recordatorio.foto ? (
                        <View style={styles.fotoContainer}>
                            <Image
                                source={{ uri: recordatorio.foto }}
                                style={styles.fotoGrande}
                            />
                            <View style={styles.fotoButtonsContainer}>
                                <TouchableOpacity
                                    style={styles.cambiarButton}
                                    onPress={cambiarFoto}
                                >
                                    <Text style={styles.buttonText}>
                                        📝 Cambiar Foto
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.eliminarFotoButton}
                                    onPress={eliminarFoto}
                                >
                                    <Text style={styles.buttonText}>
                                        🗑️ Eliminar Foto
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <View style={styles.noFotoContainer}>
                            <Text style={styles.noFotoText}>
                                Sin foto
                            </Text>
                            <TouchableOpacity
                                style={styles.agregarButton}
                                onPress={cambiarFoto}
                            >
                                <Text style={styles.buttonText}>
                                    📷 Agregar Foto
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={eliminarRecordatorio}
                    >
                        <Text style={styles.deleteText}>
                            Eliminar Recordatorio
                        </Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
    },
    imageOverlay: {
        opacity: 0.4,
    },
    scrollContainer: {
        flex: 1
    },
    container: {
        justifyContent: 'center',
        padding: 24,
        minHeight: '100%'
    },

    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center'
    },

    text: {
        fontSize: 18,
        marginBottom: 12,
        textAlign: 'center'
    },

    fotoContainer: {
        alignItems: 'center',
        marginVertical: 20
    },

    fotoGrande: {
        width: 250,
        height: 250,
        borderRadius: 12,
        marginBottom: 15
    },

    fotoButtonsContainer: {
        width: '100%',
        gap: 10
    },

    cambiarButton: {
        backgroundColor: '#9333ea',
        padding: 12,
        borderRadius: 8
    },

    eliminarFotoButton: {
        backgroundColor: '#ea580c',
        padding: 12,
        borderRadius: 8
    },

    noFotoContainer: {
        alignItems: 'center',
        marginVertical: 20,
        padding: 20,
        backgroundColor: 'rgba(200, 200, 200, 0.3)',
        borderRadius: 10
    },

    noFotoText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 12
    },

    agregarButton: {
        backgroundColor: '#2563eb',
        padding: 12,
        borderRadius: 8,
        width: '100%'
    },

    deleteButton: {
        backgroundColor: '#dc2626',
        padding: 14,
        borderRadius: 8,
        marginTop: 30
    },

    deleteText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold'
    },

    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold'
    }

});
