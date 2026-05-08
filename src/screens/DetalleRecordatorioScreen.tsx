import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ImageBackground } from 'react-native';

import { obtenerRecordatorios } from '../data/storage';
import { Recordatorio } from '../types/types';
import { guardarRecordatorios } from '../data/storage';
import { cancelarNotificacion } from '../data/notifications';

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
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={eliminarRecordatorio}
                >
                    <Text style={styles.deleteText}>
                        Eliminar Recordatorio
                    </Text>
                </TouchableOpacity>

            </View>
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
        justifyContent: 'center',
        padding: 24
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
    }

});