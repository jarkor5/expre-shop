import React from "react"
import { View, Text, Button, StyleSheet, Pressable } from "react-native"
import { useCart } from "@/context/useCart"
import { useRouter } from "expo-router"
import { AntDesign } from "@expo/vector-icons"

export default function CartScreen() {
  const { cartItems, removeFromCart, clearCart } = useCart()
  const total = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  )

  const router = useRouter()

  return (
    <View style={styles.container}>
      <View>
      <Pressable
                  onPress={() => router.back()}
                  >
                  <AntDesign name="arrowleft" size={24} color="black" />
                  </Pressable>
      <Text style={styles.title}>Carrito de Compras</Text>

      </View>
      
      {cartItems.length === 0 ? (
        <Text>No hay productos en el carrito</Text>
      ) : (
        cartItems.map((item) => (
          <View key={item.product.id} style={styles.itemRow}>
            <Text>{item.product.name}</Text>
            <Text>Cantidad: {item.quantity}</Text>
            <Text>Subtotal: ${item.product.price * item.quantity}</Text>
            <Button
              title="Eliminar"
              onPress={() => removeFromCart(item.product.id)}
            />
          </View>
        ))
      )}

      <Text style={styles.total}>Total: ${total}</Text>
      <Button title="Vaciar Carrito" onPress={clearCart} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  total: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "bold",
  },
})
