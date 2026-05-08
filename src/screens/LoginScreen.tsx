import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';

import { obtenerUsuario } from '../data/storage';

export default function LoginScreen({ navigation }: any) {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');

  const ingresar = async () => {

    if (!usuario || !password) {
      Alert.alert('Completar todos los campos');
      return;
    }

    const usuarioGuardado = await obtenerUsuario();

    if (!usuarioGuardado) {
      Alert.alert('No existe usuario registrado');
      return;
    }
    if (
      usuario.toLowerCase() ===
      usuarioGuardado.usuario.toLowerCase() &&
      password === usuarioGuardado.password
    ) {

      Alert.alert('Login correcto');

      navigation.replace('Home');

    } else {

      Alert.alert('Usuario o contraseña incorrectos');

    }

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
          <Text style={styles.title}>Recordatorio de Medicación</Text>

          <TextInput
            style={styles.input}
            placeholder="Usuario"
            value={usuario}
            onChangeText={setUsuario}
          />

          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity style={styles.button} onPress={ingresar}>
            <Text style={styles.buttonText}>Ingresar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate('Registro')}
          >
            <Text style={styles.link}>¿No tenés cuenta? Registrarse</Text>
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
    justifyContent: 'center',

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
    backgroundColor: '#2563eb',
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