import { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { pedirPermisosNotificaciones } from '../data/notifications';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, ImageBackground } from 'react-native';

import { obtenerRecordatorios } from '../data/storage';
import { Recordatorio } from '../types/types';

export default function HomeScreen({ navigation }: any) {

    const [recordatorios, setRecordatorios] =
        useState<Recordatorio[]>([]);

    useFocusEffect(() => {
        cargarRecordatorios();
        pedirPermisosNotificaciones();
    });

    const cargarRecordatorios = async () => {

        const lista =
            await obtenerRecordatorios();

        setRecordatorios(lista);

    };

    const cerrarSesion = () => {
        navigation.replace('Login');
    };

    return (
        <ImageBackground
            source={require('../../assets/Fondo.jpg')}
            style={styles.background}
            imageStyle={styles.imageOverlay}
            resizeMode="cover"
        >
            <View style={styles.container}>

                <Text style={styles.title}>
                    Recordatorios
                </Text>

                <FlatList
                    data={recordatorios}
                    keyExtractor={(item) => item.id}

                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.card}

                            onPress={() =>
                                navigation.navigate(
                                    'DetalleRecordatorio',
                                    {
                                        id: item.id
                                    }
                                )
                            }
                        >

                            <Text style={styles.name}>
                                {item.nombreMedicacion}
                            </Text>

                            <Text>
                                Cada {item.tiempo} {item.unidad}
                            </Text>

                            <Text>
                                {item.descripcion}
                            </Text>

                        </TouchableOpacity>

                    )}
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={() =>
                        navigation.navigate(
                            'GestionRecordatorios'
                        )
                    }
                >
                    <Text style={styles.buttonText}>
                        Nuevo Recordatorio
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.logout}
                    onPress={cerrarSesion}
                >
                    <Text style={styles.buttonText}>
                        Cerrar sesión
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
        padding: 20
    },

    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center'
    },

    card: {
        backgroundColor: '#eee',
        padding: 16,
        borderRadius: 10,
        marginBottom: 12
    },

    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 6
    },

    button: {
        backgroundColor: '#2563eb',
        padding: 14,
        borderRadius: 8,
        marginTop: 10
    },

    logout: {
        backgroundColor: '#dc2626',
        padding: 14,
        borderRadius: 8,
        marginTop: 10,
        marginBottom: 35
    },

    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold'
    }

});