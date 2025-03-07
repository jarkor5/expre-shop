import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { IconButton } from "react-native-paper";

export default function Navbar() {
  const router = useRouter();

  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={() => router.push("/")}>
        <Image
          source={require("../assets/images/Exppre-logo.png")}
          style={styles.logo}
        />
      </TouchableOpacity>
      <View style={styles.menu}>
        <TouchableOpacity onPress={() => router.push("/")}>
          <Text style={styles.menuItem}>Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/catalog")}>
          <Text style={styles.menuItem}>Catálogo</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/")}>
          <IconButton icon="cart" size={36} style={styles.cartIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  logo: {
    width: 150,
    height: 60,
    resizeMode: "contain",
  },
  menu: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: '25%'
  },
  menuItem: {
    marginHorizontal: 10,
    fontSize: 22,
    color: "#333",

    fontWeight: 600
  },
  cartIcon: {
    marginHorizontal: 10,
  },
});
