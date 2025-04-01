
import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router"; 
import { AntDesign } from "@expo/vector-icons";

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
      <AntDesign name="arrowleft" onPress={() => {router.push('/')}} size={32} color="black" style={{marginLeft: '5%'} } />
        <View>
        <Text style={styles.title}>Iniciar Sesión</Text>
      
      <TextInput
        label="Usuario"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        mode="outlined"
      />
      <TextInput
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        mode="outlined"
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button mode="contained" onPress={handleLogin} style={styles.button} labelStyle={{ color: "white", fontSize: 16, fontWeight: 600 }}>
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
    width: '30%',
    alignSelf: 'center',
    backgroundColor: 'white',
  },
  button: {
    width: '30%',
    alignSelf: 'center',
    marginTop: 16,
    backgroundColor: "#F1AB86",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 8,
  },
});



