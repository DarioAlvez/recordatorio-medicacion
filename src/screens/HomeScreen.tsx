import { useFocusEffect } from '@react-navigation/native';
import { pedirPermisosNotificaciones } from '../data/notifications';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, ImageBackground, Image } from 'react-native';
import { useRecordatoriosStore } from '../store/useRecordatoriosStore';

export default function HomeScreen({ navigation }: any) {
    const recordatorios = useRecordatoriosStore((state) => state.recordatorios);
    const cargarRecordatorios = useRecordatoriosStore((state) => state.cargarRecordatorios);

    useFocusEffect(() => {
        cargarRecordatorios();
        pedirPermisosNotificaciones();
    });

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

                            <View style={styles.cardContent}>
                                <View style={styles.textContent}>
                                    <Text style={styles.name}>
                                        {item.nombreMedicacion}
                                    </Text>

                                    <Text>
                                        Cada {item.tiempo} {item.unidad}
                                    </Text>

                                    <Text>
                                        {item.descripcion}
                                    </Text>
                                </View>

                                {item.foto && (
                                    <Image
                                        source={{ uri: item.foto }}
                                        style={styles.thumbnail}
                                    />
                                )}
                            </View>

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
                    style={styles.farmaciasButton}
                    onPress={() =>
                        navigation.navigate('Farmacias')
                    }
                >
                    <Text style={styles.buttonText}>
                        Farmacias Cercanas
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.contactosButton}
                    onPress={() =>
                        navigation.navigate('Contactos')
                    }
                >
                    <Text style={styles.buttonText}>
                        Contactos de Emergencia
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.calendarioButton}
                    onPress={() =>
                        navigation.navigate('Calendario')
                    }
                >
                    <Text style={styles.buttonText}>
                        Calendario de Consultas
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

    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    textContent: {
        flex: 1
    },

    name: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 6
    },

    thumbnail: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginLeft: 12
    },

    button: {
        backgroundColor: '#2563eb',
        padding: 14,
        borderRadius: 8,
        marginTop: 10
    },

    farmaciasButton: {
        backgroundColor: '#7c3aed',
        padding: 14,
        borderRadius: 8,
        marginTop: 10
    },

    contactosButton: {
        backgroundColor: '#059669',
        padding: 14,
        borderRadius: 8,
        marginTop: 10
    },

    calendarioButton: {
        backgroundColor: '#0284c7',
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
