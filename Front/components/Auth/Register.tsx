import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { TextInput, Button, Snackbar } from "react-native-paper";
import { useRouter } from "expo-router";

/**
 * Pantalla de registro de usuario.
 * Se recopilan datos del formulario y se envía una petición POST
 * al endpoint de registro. Se muestran mensajes de error o confirmación.
 */
export default function RegisterScreen() {
  // Estados para los campos del formulario
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Estados para manejo de mensajes y errores
  const [error, setError] = useState<string | null>(null);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Hook para navegación con Expo Router
  const router = useRouter();

  // Función para manejar el registro de usuario
  const handleRegister = async () => {
    // Construimos el objeto usuario según el schema requerido
    const user = {
      username,
      full_name: fullName,
      email,
      password,
      role: "user", 
    };

    try {
      const response = await fetch("http://127.0.0.1:8001/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Error al registrar usuario");
      }

      // Registro exitoso: mostramos mensaje y redirigimos a login
      setSnackbarMessage("Registro exitoso. Por favor, inicia sesión.");
      setSnackbarVisible(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      // En caso de error, mostramos el mensaje en el Snackbar
      setError(err.message);
      setSnackbarMessage(err.message);
      setSnackbarVisible(true);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Usuario</Text>
      <TextInput
        label="Usuario"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        label="Nombre Completo"
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
      />
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button mode="contained" onPress={handleRegister} style={styles.button}>
        Registrarse
      </Button>
      <Snackbar
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        duration={3000}
      >
        {snackbarMessage}
      </Snackbar>
      {/* TODO: Agregar validaciones de formulario y feedback visual */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 8,
  },
});
