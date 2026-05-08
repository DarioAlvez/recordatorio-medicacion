import { useState } from 'react';
import { Alert, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform } from 'react-native';

import { guardarUsuario } from '../data/storage';

export default function RegistroScreen({ navigation }: any) {
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [repetirPassword, setRepetirPassword] = useState('');

    const registrarse = async () => {


        if (!usuario || !password || !repetirPassword) {
            Alert.alert('Aviso', 'Completar todos los campos');
            return;
        }

        const emailValido = /\S+@\S+\.\S+/;

        if (!emailValido.test(usuario)) {
            Alert.alert('Aviso', 'Ingresar un email válido');
            return;
        }

        const passwordValida =
            /^(?=.*[!@#$%^&*(),.?":{}|<>]).{8,10}$/;

        if (!passwordValida.test(password)) {
            Alert.alert(
                'Aviso',
                'La contraseña debe tener entre 8 y 10 caracteres y al menos un símbolo'
            );
            return;
        }

        if (password !== repetirPassword) {
            Alert.alert('Aviso', 'Las contraseñas no coinciden');
            return;
        }

        await guardarUsuario(usuario.toLowerCase(), password);

        Alert.alert('Aviso', 'Usuario registrado correctamente');

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
                    <Text style={styles.title}>Crear cuenta</Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={usuario}
                        onChangeText={setUsuario}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Contraseña"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Repetir contraseña"
                        value={repetirPassword}
                        onChangeText={setRepetirPassword}
                        secureTextEntry
                    />

                    <TouchableOpacity style={styles.button} onPress={registrarse}>
                        <Text style={styles.buttonText}>Registrarse</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.link}>Volver al Login</Text>
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
    button: {
        backgroundColor: '#16a34a',
        padding: 14,
        borderRadius: 8,
        marginTop: 8
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    link: {
        marginTop: 20,
        color: '#2563eb',
        textAlign: 'center'
    }
});