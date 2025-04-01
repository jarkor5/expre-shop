
import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router"; 
import { AntDesign } from "@expo/vector-icons";
import { z } from "zod";


export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{ username?: string; password?: string }>({});
  const { signIn } = useAuth();
  const router = useRouter(); 

  const loginSchema = z.object({
    username: z.string().min(1, "El usuario es obligatorio"),
    password: z.string().min(1, "La contraseña es obligatoria"),
  });

  const isFormValid = username.trim() !== "" && password.trim() !== "";

  

  const handleLogin = async () => {
    setError(null);
    setFormErrors({}); 
  
    try {
      loginSchema.parse({ username, password });
  
      const response = await fetch("http://127.0.0.1:8001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ username, password }).toString(),
      });
  
      if (!response.ok) {
        throw new Error("Credenciales incorrectas");
      }
  
      const data = await response.json();
      await signIn(data.access_token);
      router.push({ pathname: "/" });
  
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const errors: { username?: string; password?: string } = {};
        err.errors.forEach((e) => {
          const field = e.path[0] as "username" | "password";
          errors[field] = e.message;
        });
        setFormErrors(errors);
      } else {
        setError(err.message);
      }
    }
  };
  
  

  return (
    <View style={styles.container}>
      <AntDesign name="arrowleft" onPress={() => {router.push('/')}} size={32} color="black" style={{marginLeft: '5%'} } />
        <View style={{ width: '30%', justifyContent: "center", alignItems: "center", alignSelf: 'center'}}>
        <Text style={styles.title}>Iniciar Sesión</Text>
      
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
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        mode="outlined"
        textColor="black"
      />
      {formErrors.password && <Text style={styles.error}>{formErrors.password}</Text>}
      {error && <Text style={styles.error}>{error}</Text>}
      <Button mode="contained" disabled={!isFormValid} onPress={handleLogin} style={[
  styles.button,
  !isFormValid && { backgroundColor: "#ccc" }
]}
 labelStyle={{ color: "white", fontSize: 16, fontWeight: 600 }}>
        Iniciar Sesión
      </Button>
      <View>
        <Text style={{ textAlign: "center", marginTop: 16, fontSize: 16 }}>
          ¿No tienes una cuenta?{" "}
          <Text
            style={{ color: "blue", fontSize: 16 }}
            onPress={() => router.push("/register")}

          >
            Regístrate
          </Text>
        </Text>
      </View>
        </View>
      
        
        

    </View>
     
  );
}

const styles = StyleSheet.create({
  container: {
padding: 16,
flex: 1
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
    alignSelf: 'center',
    backgroundColor: 'white',
    width: '100%',
  },
  button: {
    alignSelf: 'center',
    marginTop: 16,
    backgroundColor: "#F1AB86",
    width: '100%',
  },
  error: {
    color: "red",
    marginBottom: 8,
  },
});



