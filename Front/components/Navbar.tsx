import React, {useState}from "react"
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native"
import { useRouter } from "expo-router"
import { IconButton, Menu } from "react-native-paper"
import { useAuth } from "@/context/AuthContext"


export default function Navbar() {
  const router = useRouter()
  const { token, signOut } = useAuth()
  const [menuVisible, setMenuVisible] = useState(false);
const openMenu = () => setMenuVisible(true)
const closeMenu = () => setMenuVisible(false)


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
        <TouchableOpacity onPress={() => router.push("/cart")}>
          <IconButton icon="cart" size={36} style={styles.cartIcon} />
          
          
        </TouchableOpacity>
        {token ? (
  <Menu
    visible={menuVisible}
    onDismiss={closeMenu}
    anchor={
      <TouchableOpacity onPress={openMenu}>
        <Image
          source={{ uri: "https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50" }}
          style={styles.avatar}
        />
      </TouchableOpacity>
    }
  >
    <Menu.Item
      onPress={() => {
        closeMenu();
        router.push("/");
      }}
      title="Mi perfil"
    />
    <Menu.Item
      onPress={() => {
        closeMenu();
        router.push("/");
      }}
      title="Mis compras"
    />
    <Menu.Item
      onPress={() => {
        closeMenu();
        signOut();
        router.push("/login" );
      }}
      title="Cerrar sesión"
    />
  </Menu>
) : (
  <TouchableOpacity onPress={() => router.push("/login" )}>
    <Text style={styles.loginText}>Iniciar sesión</Text>
  </TouchableOpacity>
)}

      </View>
    </View>
  )
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
    width: '30%',
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
  loginText: {
    marginHorizontal: 10,
    fontSize: 18,
    color: "#007AFF",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 10,
  },
})
