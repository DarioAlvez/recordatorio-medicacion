import { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Alert, Modal, TextInput, KeyboardAvoidingView, Platform, ScrollView, ImageBackground, Linking } from 'react-native';
import { obtenerConsultas, guardarConsultas, agendarEnCalendarioDispositivo, removerDeCalendarioDispositivo } from '../data/calendar';
import { requestCalendarPermission } from '../data/permissions';
import { ConsultaMedica } from '../types/types';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CalendarioScreen() {
    const [consultas, setConsultas] = useState<ConsultaMedica[]>([]);
    const [modalVisible, setModalVisible] = useState(false);


    const [titulo, setTitulo] = useState('');
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [notas, setNotas] = useState('');
    const [loading, setLoading] = useState(false);

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const onChangeFecha = (event: any, selectedDate?: Date) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const dia = String(selectedDate.getDate()).padStart(2, '0');
            const mes = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const anio = selectedDate.getFullYear();
            setFecha(`${dia}/${mes}/${anio}`);
        }
    };

    const onChangeHora = (event: any, selectedTime?: Date) => {
        setShowTimePicker(false);
        if (selectedTime) {
            const horas = String(selectedTime.getHours()).padStart(2, '0');
            const minutos = String(selectedTime.getMinutes()).padStart(2, '0');
            setHora(`${horas}:${minutos}`);
        }
    };

    useEffect(() => {
        cargarConsultas();
    }, []);

    const cargarConsultas = async () => {
        const lista = await obtenerConsultas();


        const listaOrdenada = lista.sort((a, b) => {
            const [diaA, mesA, anioA] = a.fecha.split('/').map(Number);
            const [horaA, minA] = a.hora.split(':').map(Number);
            const [diaB, mesB, anioB] = b.fecha.split('/').map(Number);
            const [horaB, minB] = b.hora.split(':').map(Number);

            const dateA = new Date(anioA, mesA - 1, diaA, horaA, minA);
            const dateB = new Date(anioB, mesB - 1, diaB, horaB, minB);

            return dateA.getTime() - dateB.getTime();
        });

        setConsultas(listaOrdenada);
    };

    const validarCampos = (): boolean => {
        if (!titulo.trim() || !fecha.trim() || !hora.trim()) {
            Alert.alert('Por favor completar todos los campos');
            return false;
        }

        const [dia, mes, anio] = fecha.split('/').map(Number);
        if (dia < 1 || dia > 31 || mes < 1 || mes > 12 || anio < 2020) {
            Alert.alert('Error', 'Por favor ingresa una fecha válida.');
            return false;
        }


        const regexHora = /^\d{2}:\d{2}$/;
        if (!regexHora.test(hora)) {
            Alert.alert('Error', 'La hora debe estar en formato HH:MM.');
            return false;
        }


        const [horas, minutos] = hora.split(':').map(Number);
        if (horas < 0 || horas > 23 || minutos < 0 || minutos > 59) {
            Alert.alert('Error', 'Por favor ingresa una hora válida (00-23 y 00-59).');
            return false;
        }

        return true;
    };

    const handleGuardarConsulta = async () => {
        if (!validarCampos()) return;

        setLoading(true);
        try {

            const permiso = await requestCalendarPermission();

            if (permiso.status !== 'granted') {
                Alert.alert(
                    'Permiso denegado',
                    'Se requiere acceso al calendario del celular para agendar el evento.',
                    [
                        {
                            text: 'Abrir configuración',
                            onPress: () => Linking.openSettings()
                        },
                        {
                            text: 'Continuar sin agendar en dispositivo',
                            onPress: () => guardarSoloEnApp()
                        },
                        { text: 'Cancelar', style: 'cancel', onPress: () => setLoading(false) }
                    ]
                );
                return;
            }


            const eventId = await agendarEnCalendarioDispositivo(
                titulo,
                fecha,
                hora,
                notas
            );

            await guardarSoloEnApp(eventId || undefined);

            if (eventId) {
                Alert.alert('Consulta agendada correctamente');
            } else {
                Alert.alert('Aviso', 'Consulta guardada en la app pero no sincronizada con el dipositivo');
            }
        } catch (error) {
            console.log('Error al guardar consulta:', error);
            Alert.alert('Error', 'Ocurrió un error al guardar la consulta.');
        } finally {
            setLoading(false);
        }
    };

    const guardarSoloEnApp = async (eventId?: string) => {
        const lista = await obtenerConsultas();

        const nuevaConsulta: ConsultaMedica = {
            id: Date.now().toString(),
            titulo,
            fecha,
            hora,
            notas,
            eventId
        };

        lista.push(nuevaConsulta);
        await guardarConsultas(lista);
        await cargarConsultas();


        setTitulo('');
        setFecha('');
        setHora('');
        setNotas('');
        setModalVisible(false);
    };

    const handleEliminarConsulta = (consulta: ConsultaMedica) => {
        Alert.alert(
            'Eliminar consulta',
            `¿Estás seguro de eliminar la consulta "${consulta.titulo}"?`,
            [
                {
                    text: 'Eliminar',
                    onPress: async () => {

                        const lista = await obtenerConsultas();
                        const nuevaLista = lista.filter((c) => c.id !== consulta.id);
                        await guardarConsultas(nuevaLista);
                        await cargarConsultas();


                        if (consulta.eventId) {
                            await removerDeCalendarioDispositivo(consulta.eventId);
                        }

                        Alert.alert('Éxito', 'Consulta eliminada.');
                    },
                    style: 'destructive'
                },
                { text: 'Cancelar', style: 'cancel' }
            ]
        );
    };

    const renderConsulta = ({ item }: { item: ConsultaMedica }) => (
        <View style={styles.card}>
            <View style={styles.infoContainer}>
                <Text style={styles.cardTitle}>{item.titulo}</Text>
                <View style={styles.dateTimeContainer}>
                    <Text style={styles.dateTimeText}>📅 {item.fecha}</Text>
                    <Text style={styles.dateTimeText}>⏰ {item.hora} hs</Text>
                </View>
                {item.notas.trim() !== '' && (
                    <Text style={styles.notasText}>{item.notas}</Text>
                )}
                {item.eventId ? (
                    <Text style={styles.syncStatus}>Sincronizado con Calendario</Text>
                ) : (
                    <Text style={styles.localStatus}>Guardado localmente</Text>
                )}
            </View>
            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleEliminarConsulta(item)}
            >
                <Text style={styles.deleteIcon}>🗑️</Text>
            </TouchableOpacity>
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
                <Text style={styles.title}>Calendario de citas médicas</Text>

                {consultas.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            No tiene citas programadas.
                        </Text>
                        <Text style={styles.emptySubtext}>
                            Agregue una nueva cita.
                        </Text>
                    </View>
                ) : (
                    <FlatList
                        data={consultas}
                        keyExtractor={(item) => item.id}
                        renderItem={renderConsulta}
                        contentContainerStyle={styles.listContent}
                    />
                )}

                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => setModalVisible(true)}
                >
                    <Text style={styles.addButtonText}>
                        Programar Cita
                    </Text>
                </TouchableOpacity>


                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <KeyboardAvoidingView
                            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                            style={styles.modalView}
                        >
                            <ScrollView contentContainerStyle={styles.modalScroll}>
                                <Text style={styles.modalTitle}>Nueva Consulta Médica</Text>

                                <TextInput
                                    style={styles.input}
                                    placeholder="Médico o Especialidad (ej: Dr. Pérez)"
                                    value={titulo}
                                    onChangeText={setTitulo}
                                />

                                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                                    <View pointerEvents="none">
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Fecha"
                                            value={fecha}
                                            editable={false}
                                        />
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => setShowTimePicker(true)}>
                                    <View pointerEvents="none">
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Hora"
                                            value={hora}
                                            editable={false}
                                        />
                                    </View>
                                </TouchableOpacity>

                                {showDatePicker && (
                                    <DateTimePicker
                                        value={new Date()}
                                        mode="date"
                                        display="default"
                                        onChange={onChangeFecha}
                                    />
                                )}

                                {showTimePicker && (
                                    <DateTimePicker
                                        value={new Date()}
                                        mode="time"
                                        is24Hour={true}
                                        display="default"
                                        onChange={onChangeHora}
                                    />
                                )}

                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    placeholder="Observaciones"
                                    value={notas}
                                    onChangeText={setNotas}
                                    multiline={true}
                                    numberOfLines={4}
                                />

                                <View style={styles.modalButtons}>
                                    <TouchableOpacity
                                        style={[styles.modalButton, styles.saveButton]}
                                        onPress={handleGuardarConsulta}
                                        disabled={loading}
                                    >
                                        <Text style={styles.buttonText}>
                                            {loading ? 'Sincronizando...' : 'Guardar'}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.modalButton, styles.cancelButton]}
                                        onPress={() => setModalVisible(false)}
                                        disabled={loading}
                                    >
                                        <Text style={styles.buttonText}>Cancelar</Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        </KeyboardAvoidingView>
                    </View>
                </Modal>
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
        fontSize: 24,
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
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111',
        marginBottom: 6
    },
    dateTimeContainer: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 6
    },
    dateTimeText: {
        fontSize: 14,
        color: '#444',
        fontWeight: '500'
    },
    notasText: {
        fontSize: 14,
        color: '#666',
        marginTop: 6,
        fontStyle: 'italic',
        backgroundColor: '#f3f4f6',
        padding: 6,
        borderRadius: 6
    },
    syncStatus: {
        fontSize: 12,
        color: '#10b981',
        fontWeight: '600',
        marginTop: 8
    },
    localStatus: {
        fontSize: 12,
        color: '#f59e0b',
        fontWeight: '600',
        marginTop: 8
    },
    deleteButton: {
        backgroundColor: '#ef4444',
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 12
    },
    deleteIcon: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    },
    addButton: {
        backgroundColor: '#0284c7',
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
    addButtonText: {
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
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    modalView: {
        width: '90%',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 24,
        maxHeight: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    modalScroll: {
        flexGrow: 1
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#111'
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        fontSize: 16,
        backgroundColor: '#fafafa'
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top'
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 12,
        marginTop: 10
    },
    modalButton: {
        flex: 1,
        padding: 14,
        borderRadius: 8,
        alignItems: 'center'
    },
    saveButton: {
        backgroundColor: '#10b981'
    },
    cancelButton: {
        backgroundColor: '#dc2626'
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    }
});
