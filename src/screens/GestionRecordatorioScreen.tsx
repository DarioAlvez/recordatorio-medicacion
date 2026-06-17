import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, ImageBackground, KeyboardAvoidingView, Platform, Image, Linking } from 'react-native';

import { guardarRecordatorios, obtenerRecordatorios } from '../data/storage';
import { programarNotificacion } from '../data/notifications';
import { seleccionarDelaGaleria } from '../data/imageHandler';
import { requestCameraPermission, requestMediaLibraryPermission } from '../data/permissions';

export default function GestionRecordatorioScreen({ navigation }: any) {

    const [nombreMedicacion, setNombreMedicacion] =
        useState('');

    const [descripcion, setDescripcion] =
        useState('');

    const [tiempo, setTiempo] =
        useState('');

    const [unidad, setUnidad] =
        useState<'segundos' | 'minutos' | 'horas'>(
            'minutos'
        );

    const [foto, setFoto] = useState<string | null>(null);

    const handleCapturarFoto = async () => {
        const permission = await requestCameraPermission();

        if (permission.status === 'granted') {
            navigation.navigate('Camera', {
                onPhotoCapture: (photoData: string) => {
                    setFoto(photoData);
                }
            });
        } else if (permission.status === 'denied') {
            Alert.alert(
                'Permiso de cámara denegado',
                'Se requiere acceso a la cámara para capturar fotos. Por favor, habilita el permiso en configuración.',
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
        } else {
            Alert.alert(
                'Permiso pendiente',
                'Por favor, otorga permisos de cámara cuando se solicite.'
            );
        }
    };

    const handleSeleccionarGaleria = async () => {
        const permission = await requestMediaLibraryPermission();

        if (permission.status === 'granted') {
            const result = await seleccionarDelaGaleria();

            if (result.success && result.data) {
                setFoto(result.data);
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
        } else {
            Alert.alert(
                'Permisos pendientes',
                'No se puede solicitar permisos de galería en este momento. Intenta de nuevo.'
            );
        }
    };

    const eliminarFoto = () => {
        setFoto(null);
    };

    const guardar = async () => {
        if (!nombreMedicacion || !descripcion || !tiempo) {
            Alert.alert('Aviso', 'Completar todos los campos');
            return;
        }

        const lista = await obtenerRecordatorios();

        let notificationId = '';

        try {
            notificationId = await programarNotificacion(
                nombreMedicacion,
                Number(tiempo),
                unidad
            );
        } catch (error) {
            console.log('No se pudo programar la notificación', error);
        }

        const nuevo = {
            id: Date.now().toString(),
            nombreMedicacion: nombreMedicacion,
            descripcion: descripcion,
            tiempo: Number(tiempo),
            unidad: unidad,
            notificationId: notificationId,
            foto: foto
        };

        lista.push(nuevo);

        await guardarRecordatorios(lista);

        Alert.alert('Aviso', 'Recordatorio guardado');

        setNombreMedicacion('');
        setDescripcion('');
        setTiempo('');
        setFoto(null);

        navigation.goBack();
    };

    return (
        <ImageBackground
            source={require('../../assets/Fondo.jpg')}
            style={styles.background}
            imageStyle={styles.imageOverlay}
            resizeMode="cover"
        >
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={
                    Platform.OS === 'ios'
                        ? 'padding'
                        : 'height'
                }>
                <View style={styles.container}>

                    <Text style={styles.title}>
                        Nuevo Recordatorio
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Medicamento"
                        value={nombreMedicacion}
                        onChangeText={setNombreMedicacion}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Descripción"
                        value={descripcion}
                        onChangeText={setDescripcion}
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Tiempo"
                        value={tiempo}
                        onChangeText={setTiempo}
                        keyboardType="numeric"
                    />

                    <View style={styles.unitContainer}>

                        <TouchableOpacity
                            style={styles.unitButton}
                            onPress={() => setUnidad('segundos')}
                        >
                            <Text>Segundos</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.unitButton}
                            onPress={() => setUnidad('minutos')}
                        >
                            <Text>Minutos</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.unitButton}
                            onPress={() => setUnidad('horas')}
                        >
                            <Text>Horas</Text>
                        </TouchableOpacity>

                    </View>

                    <Text style={styles.selected}>
                        Unidad seleccionada: {unidad}
                    </Text>

                    {foto && (
                        <View style={styles.fotoContainer}>
                            <Image
                                source={{ uri: foto }}
                                style={styles.fotoPreview}
                            />
                            <TouchableOpacity
                                style={styles.eliminarFotoButton}
                                onPress={eliminarFoto}
                            >
                                <Text style={styles.eliminarFotoText}>
                                    Eliminar foto
                                </Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.photoButton}
                            onPress={handleCapturarFoto}
                        >
                            <Text style={styles.buttonText}>
                                📷 Capturar Foto
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.photoButton}
                            onPress={handleSeleccionarGaleria}
                        >
                            <Text style={styles.buttonText}>
                                🖼️ Galería
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={guardar}
                    >
                        <Text style={styles.buttonText}>
                            Guardar Recordatorio
                        </Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
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
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'flex-start'
    },

    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        marginTop: '5%'
    },

    input: {
        borderWidth: 1,
        borderColor: '#999',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12
    },

    unitContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16
    },

    unitButton: {
        backgroundColor: '#ddd',
        padding: 10,
        borderRadius: 8
    },

    selected: {
        textAlign: 'center',
        marginBottom: 20
    },

    fotoContainer: {
        alignItems: 'center',
        marginBottom: 20
    },

    fotoPreview: {
        width: 150,
        height: 150,
        borderRadius: 8,
        marginBottom: 10
    },

    eliminarFotoButton: {
        backgroundColor: '#dc2626',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 8
    },

    eliminarFotoText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center'
    },

    buttonContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 12
    },

    photoButton: {
        flex: 1,
        backgroundColor: '#9333ea',
        padding: 12,
        borderRadius: 8
    },

    button: {
        backgroundColor: '#2563eb',
        padding: 14,
        borderRadius: 8
    },

    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold'
    }

});
