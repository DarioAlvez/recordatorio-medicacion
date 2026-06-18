import { useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, View, Text, TouchableOpacity, FlatList,  Alert, Linking, ActivityIndicator} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { obtenerFarmacias, eliminarFarmacia } from '../data/farmacias';
import { requestLocationPermission, getLocationPermissionStatus, obtenerUbicacionActual, calcularDistancia} from '../data/location';
import { Farmacia, UbicacionActual } from '../types/types';
import React from 'react';

export default function FarmaciasScreen({ navigation }: any) {
    const [farmacias, setFarmacias] = useState<Farmacia[]>([]);
    const [ubicacionActual, setUbicacionActual] =
        useState<UbicacionActual | null>(null);
    const [loading, setLoading] = useState(true);
    const [farmaciasConDistancia, setFarmaciasConDistancia] =
        useState<
            (Farmacia & { distancia: number })[]
        >([]);

  useFocusEffect(
    React.useCallback(() => {
        cargarDatos();
    }, [])
);

    const cargarDatos = async () => {
        try {
            setLoading(true);

            // 1. Siempre cargar las farmacias desde el almacenamiento local
            const lista = await obtenerFarmacias();
            setFarmacias(lista);

            // 2. Intentar obtener el permiso de ubicación sin bloquear
            const permiso = await getLocationPermissionStatus();
            let locationGranted = permiso === 'granted';

            if (permiso === 'undetermined') {
                const result = await requestLocationPermission();
                locationGranted = result.status === 'granted';
            }

            let ubicacion = null;
            if (locationGranted) {
                ubicacion = await obtenerUbicacionActual();
                if (ubicacion) {
                    setUbicacionActual(ubicacion);
                }
            }

            // 3. Calcular distancias si tenemos la ubicación actual
            if (ubicacion && lista.length > 0) {
                const conDistancia = lista
                    .map((f) => ({
                        ...f,
                        distancia: calcularDistancia(
                            ubicacion.latitude,
                            ubicacion.longitude,
                            f.ubicacion.latitude,
                            f.ubicacion.longitude
                        )
                    }))
                    .sort((a, b) => a.distancia - b.distancia);

                setFarmaciasConDistancia(conDistancia);
            } else {
                setFarmaciasConDistancia(
                    lista.map((f) => ({
                        ...f,
                        distancia: 0
                    }))
                );
            }

            setLoading(false);
        } catch (error) {
            console.log('Error en cargarDatos:', error);
            Alert.alert('Error', 'Error al cargar datos');
            setLoading(false);
        }
    };

    const handleEliminarFarmacia = (id: string) => {
        Alert.alert(
            'Eliminar farmacia',
            '¿Estás seguro?',
            [
                {
                    text: 'Eliminar',
                    onPress: async () => {
                        await eliminarFarmacia(id);
                        await cargarDatos();
                    },
                    style: 'destructive'
                },
                { text: 'Cancelar', style: 'cancel' }
            ]
        );
    };

    const renderFarmacia = ({ item }: any) => (
        <TouchableOpacity
            style={styles.farmaciaCard}
            onPress={() =>
                navigation.navigate('EditarFarmacia', {
                    id: item.id
                })
            }
        >
            <View style={styles.farmaciaInfo}>
                <Text style={styles.nombreFarmacia}>
                    {item.nombre}
                </Text>
                <Text style={styles.direccionFarmacia}>
                    📍 {item.direccion}
                </Text>
                <Text style={styles.telefonoFarmacia}>
                    📞 {item.telefono}
                </Text>                
            </View>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() =>
                    handleEliminarFarmacia(item.id)
                }
            >
                <Text style={styles.deleteText}>🗑️</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator
                    size="large"
                    color="#2563eb"
                />
                <Text style={styles.loadingText}>
                    Obteniendo tu ubicación...
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {ubicacionActual && (
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    initialRegion={{
                        latitude: ubicacionActual.latitude,
                        longitude:
                            ubicacionActual.longitude,
                        latitudeDelta: 0.05,
                        longitudeDelta: 0.05
                    }}
                >
                    <Marker
                        coordinate={{
                            latitude:
                                ubicacionActual.latitude,
                            longitude:
                                ubicacionActual.longitude
                        }}
                        title="Mi ubicación"
                        pinColor="blue"
                    />

                    {farmacias.map((farmacia) => (
                        <Marker
                            key={farmacia.id}
                            coordinate={{
                                latitude:
                                    farmacia.ubicacion
                                        .latitude,
                                longitude:
                                    farmacia.ubicacion
                                        .longitude
                            }}
                            title={farmacia.nombre}
                            description={farmacia.direccion}
                            pinColor="red"
                        />
                    ))}
                </MapView>
            )}

            <View style={styles.listContainer}>
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>
                        Farmacias Cercanas
                    </Text>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() =>
                            navigation.navigate(
                                'AgregarFarmacia'
                            )
                        }
                    >
                        <Text
                            style={styles.addButtonText}
                        >
                            ➕ Agregar
                        </Text>
                    </TouchableOpacity>
                </View>

                {farmaciasConDistancia.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text
                            style={styles.emptyText}
                        >
                            No hay farmacias agregadas
                        </Text>
                        <Text
                            style={styles.emptySubtext}
                        >
                            Presiona "Agregar" para crear una
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={farmaciasConDistancia}
                        keyExtractor={(item) => item.id}
                        renderItem={renderFarmacia}
                        scrollEnabled={true}
                    />
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5'
    },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },

    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#666'
    },

    map: {
        height: '50%'
    },

    listContainer: {
        flex: 1,
        backgroundColor: '#fff'
    },

    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee'
    },

    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold'
    },

    addButton: {
        backgroundColor: '#2563eb',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 6
    },

    addButtonText: {
        color: '#fff',
        fontWeight: 'bold'
    },

    farmaciaCard: {
        flexDirection: 'row',
        backgroundColor: '#f9f9f9',
        padding: 12,
        marginHorizontal: 12,
        marginVertical: 6,
        borderRadius: 8,
        borderLeftWidth: 4,
        borderLeftColor: '#2563eb',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    farmaciaInfo: {
        flex: 1
    },

    nombreFarmacia: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 4,
        color: '#333'
    },

    direccionFarmacia: {
        fontSize: 13,
        color: '#666',
        marginBottom: 3
    },

    telefonoFarmacia: {
        fontSize: 13,
        color: '#666',
        marginBottom: 3
    },

    distanciaFarmacia: {
        fontSize: 13,
        color: '#2563eb',
        fontWeight: '600'
    },

    deleteButton: {
        paddingHorizontal: 8,
        paddingVertical: 4
    },

    deleteText: {
        fontSize: 18
    },

    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
    },

    emptyText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#999',
        marginBottom: 8
    },

    emptySubtext: {
        fontSize: 14,
        color: '#bbb',
        textAlign: 'center'
    }
});
