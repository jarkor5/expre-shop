import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
  Pressable,
} from "react-native";
import { Button, Portal, Snackbar } from "react-native-paper";
import { useLocalSearchParams, useRouter} from "expo-router";
import { fetchProductById, Product } from "@/data/products";
import { useCart } from "@/context/useCart";
import{ AntDesign } from '@expo/vector-icons'

export default function ProductDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const router = useRouter()

  const { addToCart } = useCart();

  useEffect(() => {
    if (id) {
      fetchProductById(id).then((data) => {
        setProduct(data);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.center}>
        <Text>Producto no encontrado</Text>
      </View>
    );
  }

  const handleAddToCart = () => {
    try {
      addToCart(product);
      setSnackbarMessage("Añadido al carrito correctamente");
      setSnackbarVisible(true);
    } catch (error) {
      console.error(error);
      setSnackbarMessage("No se pudo añadir al carrito");
      setSnackbarVisible(true);
    }
  };

  return (
    <ScrollView>
      <View style={{ backgroundColor: "#d9d9d9", flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
            backgroundColor: "white",
            width: "98%",
            alignSelf: "center",
            marginTop: 20,
            padding: 48,
            borderRadius: 15,
            height: "96%",
            marginBottom: "20%",
          }}
        >
            <Pressable
            onPress={() => router.back()}
            >
            <AntDesign name="arrowleft" size={24} color="black" />
            </Pressable>
          <Image source={{ uri: product.image }} style={styles.image} />
          <View style={{ flexDirection: "column", width: "40%" }}>
            <ScrollView style={{ flexDirection: "row", width: "100%" }}>
              <View style={styles.container}>
                <Text style={styles.title}>{product.name}</Text>
                <Text style={styles.price}>${product.price}</Text>
                <Text style={styles.category}>
                  {product.category} - {product.brand}
                </Text>

                <Text style={styles.description}>{product.description}</Text>
                <Text style={styles.subheading}>Detalles Técnicos</Text>
                <Text style={styles.techDetails}>
                  {product.technicalDetails ?? "Sin detalles técnicos"}
                </Text>

                <Button
                  mode="contained"
                  style={styles.addButton}
                  onPress={handleAddToCart}
                  textColor="white"
                >
                  Agregar al carrito
                </Button>
                <Button
                  mode="contained"
                  style={styles.buyNowButton}
                  onPress={() => console.log("comprar ahora")}
                  textColor="white"
                >
                  Comprar ahora
                </Button>
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
      <Portal>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={2000}
          style={{ backgroundColor: "#44B244", alignSelf: 'center', width: '20%',}} 
          wrapperStyle={{
            position: "absolute",
            top: 40, 
            left: 10,
            right: 10,
            bottom: "auto",
            zIndex: 9999,
            
            alignSelf: 'center',
            alignItems: 'center'
          }}
        >
          {snackbarMessage}
        </Snackbar>
      </Portal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    width: "50%",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "25%",
    height: 300,
    marginBottom: 16,
    borderRadius: 8,
    resizeMode: "cover",
    borderWidth: 0.5,
    borderColor: "#ccc",
    alignSelf: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    color: "green",
    marginBottom: 8,
  },
  category: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#333",
    marginTop: 0,
    marginBottom: 16,
  },
  subheading: {
    fontSize: 18,
    marginBottom: 8,
  },
  techDetails: {
    fontSize: 16,
    marginBottom: 16,
  },
  technicalDetails: {},
  addButton: {
    marginTop: 10,
    alignSelf: "stretch",
    backgroundColor: "#F1AB86",
  },
  buyNowButton: {
    marginTop: 10,
    alignSelf: "stretch",
    backgroundColor: "#8C2F39",
  },
});
