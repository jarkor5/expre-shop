import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { TextInput, Button, Snackbar } from "react-native-paper";
import { useRouter } from "expo-router";
import {z} from "zod";

/**
 * Pantalla de registro de usuario.
 * Se recopilan datos del formulario y se envía una petición POST
 * al endpoint de registro. Se muestran mensajes de error o confirmación.
 */

const registerSchema = z.object({
  username: z.string().min(1, "El nombre de usuario es obligatorio"),
  full_name: z.string().min(1, "El nombre completo es obligatorio"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
})
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
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const isFormValid = username && fullName && email && password; 
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
      registerSchema.parse(user); // Validamos el objeto usuario con Zod
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
      if (err instanceof z.ZodError) {
        const fieldErrors: { [key: string]: string } = {};
        err.errors.forEach((e) => {
          fieldErrors[e.path[0]] = e.message;
        });
        setFormErrors(fieldErrors);
        return;
      }
      
      setSnackbarVisible(true)
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Usuario</Text>
      <View style={styles.formContainer}>
      <TextInput
        label="Usuario"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        mode="outlined"
        textColor="black"
      />
      {formErrors.username && <Text style={styles.error}>{formErrors.username}</Text>}
      <TextInput
        label="Nombre Completo"
        value={fullName}
        onChangeText={setFullName}
        style={styles.input}
        mode="outlined"
        textColor="black"
      />
      {formErrors.full_name && <Text style={styles.error}>{formErrors.full_name}</Text>}
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        mode="outlined"
         textColor="black"
      />
      {formErrors.email && <Text style={styles.error}>{formErrors.email}</Text>}
      <TextInput
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        mode="outlined"
         textColor="black"
      />
      {formErrors.password && <Text style={styles.error}>{formErrors.password}</Text>}
      {/* Mostrar error si existe */}
      </View>
    
      
      <Button mode="contained" onPress={handleRegister} style={styles.button} textColor="#FFFFFF" disabled={!isFormValid}>
        Registrarse
      </Button>

     <View>
        <Text style={{ textAlign: "center", marginTop: 16, fontSize: 16 }}>
          ¿Ya tienes una cuenta?{" "}
          <Text
            style={{ color: "blue", fontSize: 16 }}
            onPress={() => router.push("/login")}
          >
            Inicia sesión
          </Text>
        </Text>
     </View>



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
    width: '100%',
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
  },
  button: {
    width: '30%',
    alignSelf: 'center',
    marginTop: 16,
    backgroundColor: "#F1AB86",
  },
  error: {
    color: "red",
    marginBottom: 8,
  },
  formContainer: {
    width: '30%',
    alignSelf: 'center'
  }
});
