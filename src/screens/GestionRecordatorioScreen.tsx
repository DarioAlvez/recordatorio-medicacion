import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';

import { guardarRecordatorios, obtenerRecordatorios } from '../data/storage';
import { programarNotificacion } from '../data/notifications';

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
            notificationId: notificationId
        };

        lista.push(nuevo);

        await guardarRecordatorios(lista);

        Alert.alert('Aviso', 'Recordatorio guardado');

        setNombreMedicacion('');
        setDescripcion('');
        setTiempo('');

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
        marginBottom: 80,
        textAlign: 'center',
        marginTop: '15%'
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