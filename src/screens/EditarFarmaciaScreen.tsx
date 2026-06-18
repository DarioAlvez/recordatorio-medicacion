import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { obtenerFarmaciaPorId, editarFarmacia, eliminarFarmacia } from '../data/farmacias';
import { Farmacia } from '../types/types';

export default function EditarFarmaciaScreen({
    route,
    navigation
}: any) {
    const { id } = route.params;

    const [nombre, setNombre] = useState('');
    const [direccion, setDireccion] = useState('');
    const [telefono, setTelefono] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        cargarFarmacia();
    }, []);

    const cargarFarmacia = async () => {
        try {
            const farmacia =
                await obtenerFarmaciaPorId(id);

            if (farmacia) {
                setNombre(farmacia.nombre);
                setDireccion(farmacia.direccion);
                setTelefono(farmacia.telefono);
            }
            setLoading(false);
        } catch (error) {
            console.log(
                'Error al cargar farmacia',
                error
            );
            setLoading(false);
        }
    };

    const guardarCambios = async () => {
        if (!nombre || !direccion || !telefono) {
            Alert.alert('Aviso', 'Completa todos los campos');
            return;
        }

        try {
            setLoading(true);

            await editarFarmacia(id, {
                nombre,
                direccion,
                telefono
            });

            Alert.alert('Éxito', 'Farmacia actualizada', [
                {
                    text: 'OK',
                    onPress: () => navigation.goBack()
                }
            ]);
        } catch (error) {
            console.log('Error al editar farmacia', error);
            Alert.alert('Error', 'No se pudo editar la farmacia');
        } finally {
            setLoading(false);
        }
    };

    const handleEliminar = () => {
        Alert.alert(
            'Eliminar farmacia',
            '¿Estás seguro? Esta acción no se puede deshacer.',
            [
                {
                    text: 'Eliminar',
                    onPress: async () => {
                        try {
                            await eliminarFarmacia(id);
                            Alert.alert('Éxito', 'Farmacia eliminada', [
                                {
                                    text: 'OK',
                                    onPress: () =>
                                        navigation.goBack()
                                }
                            ]);
                        } catch (error) {
                            Alert.alert(
                                'Error',
                                'No se pudo eliminar la farmacia'
                            );
                        }
                    },
                    style: 'destructive'
                },
                { text: 'Cancelar', style: 'cancel' }
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Cargando...</Text>
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
            <ScrollView style={styles.container}>
                <Text style={styles.title}>
                    Editar Farmacia
                </Text>

                <TextInput
                    style={styles.input}
                    placeholder="Nombre de la farmacia"
                    value={nombre}
                    onChangeText={setNombre}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Dirección"
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

                <TouchableOpacity
                    style={styles.button}
                    onPress={guardarCambios}
                >
                    <Text style={styles.buttonText}>
                        Guardar Cambios
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={handleEliminar}
                >
                    <Text style={styles.deleteButtonText}>
                        🗑️ Eliminar Farmacia
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

    button: {
        backgroundColor: '#2563eb',
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10
    },

    deleteButton: {
        backgroundColor: '#ea580c',
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
    },

    deleteButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    }
});
