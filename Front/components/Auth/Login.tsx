
import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router"; 

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { signIn } = useAuth();
  const router = useRouter(); 

  const handleLogin = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          username,
          password,
        }).toString(),
      });

      if (!response.ok) {
        throw new Error("Credenciales incorrectas");
      }

      const data = await response.json();
      await signIn(data.access_token);
      router.push(
        {
          pathname: "/",
        }
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Iniciar Sesión</Text>
      <TextInput
        label="Usuario"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button mode="contained" onPress={handleLogin} style={styles.button}>
        Iniciar Sesión
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
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
