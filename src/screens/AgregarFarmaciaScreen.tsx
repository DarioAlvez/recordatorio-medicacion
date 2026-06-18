import { useEffect, useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

import { agregarFarmacia } from '../data/farmacias';
import {
    obtenerUbicacionActual,
    getLocationPermissionStatus,
    requestLocationPermission
} from '../data/location';
import { Farmacia } from '../types/types';

export default function AgregarFarmaciaScreen({
    navigation
}: any) {
    const [nombre, setNombre] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [ubicacion, setUbicacion] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);
    const [ubicacionInicial, setUbicacionInicial] =
        useState<{
            latitude: number;
            longitude: number;
            latitudeDelta: number;
            longitudeDelta: number;
        } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        obtenerUbicacionInicial();
    }, []);

    const obtenerUbicacionInicial = async () => {
        try {
            const permiso = await getLocationPermissionStatus();
            let locationGranted = permiso === 'granted';

            if (permiso === 'undetermined') {
                const result = await requestLocationPermission();
                locationGranted = result.status === 'granted';
            }

            let ubicacionActual = null;
            if (locationGranted) {
                ubicacionActual = await obtenerUbicacionActual();
            }

            if (ubicacionActual) {
                const region = {
                    latitude: ubicacionActual.latitude,
                    longitude: ubicacionActual.longitude,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05
                };
                setUbicacionInicial(region);
                setUbicacion({
                    latitude: ubicacionActual.latitude,
                    longitude: ubicacionActual.longitude
                });
            } else {
                // Buenos Aires default coordinates
                const defaultRegion = {
                    latitude: -34.6037,
                    longitude: -58.3816,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05
                };
                setUbicacionInicial(defaultRegion);
                setUbicacion({
                    latitude: -34.6037,
                    longitude: -58.3816
                });
            }
        } catch (error) {
            console.log(
                'Error al obtener ubicación inicial',
                error
            );
        } finally {
            setLoading(false);
        }
    };

    const handleMapPress = (e: any) => {
        const { latitude, longitude } =
            e.nativeEvent.coordinate;
        setUbicacion({
            latitude,
            longitude
        });
    };

    const guardar = async () => {
        if (!nombre || !direccion || !telefono) {
            Alert.alert('Aviso', 'Completa todos los campos');
            return;
        }

        if (!ubicacion) {
            Alert.alert(
                'Aviso',
                'Selecciona una ubicación tocando el mapa'
            );
            return;
        }

        try {
            setLoading(true);

            const nuevaFarmacia: Farmacia = {
                id: Date.now().toString(),
                nombre,
                direccion,
                telefono,
                ubicacion,
                createdAt: new Date().toISOString()
            };

            await agregarFarmacia(nuevaFarmacia);

            Alert.alert('Éxito', 'Farmacia agregada correctamente', [
                {
                    text: 'OK',
                    onPress: () => navigation.goBack()
                }
            ]);

            setNombre('');
            setDireccion('');
            setTelefono('');
            setUbicacion(null);
        } catch (error) {
            console.log('Error al guardar farmacia', error);
            Alert.alert('Error', 'No se pudo guardar la farmacia');
        } finally {
            setLoading(false);
        }
    };

    if (loading || !ubicacionInicial) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Cargando mapa...</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={
                Platform.OS === 'ios' ? 'padding' : 'height'
            }
        >
            <ScrollView
                style={styles.container}
                scrollEnabled={true}
            >
                <Text style={styles.title}>
                    Agregar Nueva Farmacia
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Nombre de la farmacia"
                    value={nombre}
                    onChangeText={setNombre}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Dirección (manual)"
                    value={direccion}
                    onChangeText={setDireccion}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Teléfono"
                    value={telefono}
                    onChangeText={setTelefono}
                    keyboardType="phone-pad"
                />

                <View style={styles.mapSection}>
                    <Text style={styles.mapTitle}>
                        📍 Selecciona ubicación en el mapa
                    </Text>
                    <Text style={styles.mapSubtitle}>
                        Toca en el mapa para seleccionar la ubicación de la farmacia
                    </Text>

                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={styles.map}
                        initialRegion={ubicacionInicial}
                        onPress={handleMapPress}
                    >
                        {ubicacion && (
                            <Marker
                                coordinate={ubicacion}
                                title="Ubicación seleccionada"
                                pinColor="green"
                            />
                        )}
                    </MapView>

                    {ubicacion && (
                        <View style={styles.coordenadasInfo}>
                            <Text
                                style={
                                    styles.coordenadasLabel
                                }
                            >
                                ✅ Ubicación seleccionada:
                            </Text>
                            <Text
                                style={
                                    styles.coordenadasTexto
                                }
                            >
                                Lat: {ubicacion.latitude.toFixed(
                                    4
                                )}
                                {'\n'}
                                Lng: {ubicacion.longitude.toFixed(
                                    4
                                )}
                            </Text>
                        </View>
                    )}
                </View>

                <TouchableOpacity
                    style={styles.button}
                    onPress={guardar}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>
                        {loading ? 'Guardando...' : 'Guardar Farmacia'}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.buttonText}>
                        Cancelar
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff'
    },

    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },

    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center'
    },

    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 15,
        fontSize: 16
    },

    mapSection: {
        backgroundColor: '#f9f9f9',
        padding: 15,
        borderRadius: 8,
        marginBottom: 20,
        borderLeftWidth: 4,
        borderLeftColor: '#7c3aed'
    },

    mapTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5
    },

    mapSubtitle: {
        fontSize: 13,
        color: '#666',
        marginBottom: 12,
        fontStyle: 'italic'
    },

    map: {
        height: 300,
        borderRadius: 8,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#ddd'
    },

    coordenadasInfo: {
        backgroundColor: '#e6f3ff',
        padding: 10,
        borderRadius: 6
    },

    coordenadasLabel: {
        fontSize: 13,
        color: '#0066cc',
        fontWeight: '600',
        marginBottom: 5
    },

    coordenadasTexto: {
        fontSize: 12,
        color: '#0066cc',
        fontFamily: 'monospace'
    },

    button: {
        backgroundColor: '#2563eb',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10
    },

    cancelButton: {
        backgroundColor: '#dc2626',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 30
    },

    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    }
});
