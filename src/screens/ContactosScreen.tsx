import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Alert, Linking, ImageBackground } from 'react-native';
import * as Contacts from 'expo-contacts';
import { obtenerContactos, agregarContacto, eliminarContacto } from '../data/contacts';
import { requestContactsPermission } from '../data/permissions';
import { ContactoEmergencia } from '../types/types';

export default function ContactosScreen({ navigation }: any) {
    const [contactos, setContactos] = useState<ContactoEmergencia[]>([]);

    useEffect(() => {
        cargarContactos();
    }, []);

    const cargarContactos = async () => {
        const lista = await obtenerContactos();
        setContactos(lista);
    };

    const handleAgregarContacto = async () => {
        try {
            const permiso = await requestContactsPermission();

            if (permiso.status !== 'granted') {
                Alert.alert(
                    'Permiso denegado',
                    'Se necesita acceso a tus contactos para agregarlos a la lista de emergencia.',
                    [
                        {
                            text: 'Abrir configuración',
                            onPress: () => Linking.openSettings()
                        },
                        { text: 'Cancelar', style: 'cancel' }
                    ]
                );
                return;
            }


            const contact = await Contacts.presentContactPickerAsync();

            if (contact) {
                const nombre = contact.name || 'Sin nombre';
                const telefono =
                    contact.phoneNumbers && contact.phoneNumbers.length > 0
                        ? contact.phoneNumbers[0].number
                        : '';

                if (!telefono) {
                    Alert.alert(
                        'Aviso',
                        'El contacto seleccionado no tiene un número de teléfono guardado.'
                    );
                    return;
                }


                const nuevoContacto: ContactoEmergencia = {
                    id: contact.id || Date.now().toString(),
                    nombre,
                    telefono
                };


                const yaExiste = contactos.some(
                    (c) => c.telefono.replace(/\s+/g, '') === telefono.replace(/\s+/g, '')
                );

                if (yaExiste) {
                    Alert.alert(
                        'Aviso',
                        'Este contacto ya está agregado como contacto de emergencia.'
                    );
                    return;
                }

                await agregarContacto(nuevoContacto);
                await cargarContactos();
                Alert.alert('Éxito', `${nombre} agregado a contactos de emergencia.`);
            }
        } catch (error) {
            console.log('Error seleccionando contacto:', error);
            Alert.alert('Error', 'No se pudo acceder a los contactos del dispositivo.');
        }
    };

    const handleEliminarContacto = (id: string, nombre: string) => {
        Alert.alert(
            'Eliminar contacto',
            `¿Estás seguro de eliminar a ${nombre} de tus contactos de emergencia?`,
            [
                {
                    text: 'Eliminar',
                    onPress: async () => {
                        await eliminarContacto(id);
                        await cargarContactos();
                    },
                    style: 'destructive'
                },
                { text: 'Cancelar', style: 'cancel' }
            ]
        );
    };

    const realizarLlamada = (telefono: string) => {
        const url = `tel:${telefono}`;
        Linking.canOpenURL(url)
            .then((supported) => {
                if (supported) {
                    Linking.openURL(url);
                } else {
                    Alert.alert('Error', 'No se puede realizar llamadas en este dispositivo.');
                }
            })
            .catch((err) => console.log('Error de llamada:', err));
    };

    const renderContacto = ({ item }: { item: ContactoEmergencia }) => (
        <View style={styles.card}>
            <View style={styles.infoContainer}>
                <Text style={styles.nombre}>{item.nombre}</Text>
                <Text style={styles.telefono}>📞 {item.telefono}</Text>
            </View>
            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    style={styles.callButton}
                    onPress={() => realizarLlamada(item.telefono)}
                >
                    <Text style={styles.actionIcon}>📞</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleEliminarContacto(item.id, item.nombre)}
                >
                    <Text style={styles.actionIcon}>🗑️</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <ImageBackground
            source={require('../../assets/Fondo.jpg')}
            style={styles.background}
            imageStyle={styles.imageOverlay}
            resizeMode="cover"
        >
            <View style={styles.container}>
                <Text style={styles.title}>Contactos de emergencia</Text>

                {contactos.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            NO hay ningun contacto disponible
                        </Text>
                        <Text style={styles.emptySubtext}>
                            Agregue contactos
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={contactos}
                        keyExtractor={(item) => item.id}
                        renderItem={renderContacto}
                        contentContainerStyle={styles.listContent}
                    />
                )}

                <TouchableOpacity
                    style={styles.importButton}
                    onPress={handleAgregarContacto}
                >
                    <Text style={styles.importButtonText}>
                        Importar Contacto
                    </Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1
    },
    imageOverlay: {
        opacity: 0.4
    },
    container: {
        flex: 1,
        padding: 20
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333'
    },
    listContent: {
        paddingBottom: 20
    },
    card: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        alignItems: 'center',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3
    },
    infoContainer: {
        flex: 1
    },
    nombre: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111',
        marginBottom: 4
    },
    telefono: {
        fontSize: 15,
        color: '#444'
    },
    actionsContainer: {
        flexDirection: 'row',
        gap: 12
    },
    callButton: {
        backgroundColor: '#10b981',
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center'
    },
    deleteButton: {
        backgroundColor: '#ef4444',
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center'
    },
    actionIcon: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    },
    importButton: {
        backgroundColor: '#059669',
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4
    },
    importButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        borderRadius: 12,
        marginBottom: 20
    },
    emptyText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555',
        textAlign: 'center',
        marginBottom: 8
    },
    emptySubtext: {
        fontSize: 14,
        color: '#777',
        textAlign: 'center'
    }
});
