import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Button, Portal, Snackbar } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import {
  Product,
  fetchProductById,
  fetchFeaturedProducts,
  fetchSimilarProducts,
} from "@/data/products";
import { useCart } from "@/context/useCart";
import FeaturedCarousel from "@/components/FeaturedCarousel";

export default function ProductDetail() {

  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Listas para cada carrusel
  const [featured, setFeatured] = useState<Product[]>([]);
  const [similar, setSimilar] = useState<Product[]>([]);

  // Hook del carrito
  const { addToCart } = useCart();

  // Router para navegación manual
  const router = useRouter();

  // Efecto para cargar el producto base
  useEffect(() => {
    if (id) {
      fetchProductById(id).then((data) => {
        setProduct(data);
        setLoading(false);
      });
      fetchSimilarProducts(id).then((simil) => setSimilar(simil));
      fetchFeaturedProducts().then((list) => {
        setFeatured(list.filter((p) => p.isfeatured));
      });
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
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

  return (
    <View style={{ flex: 1, backgroundColor: "#d9d9d9" }}>
      <ScrollView style={{ marginBottom: 20 }}>
        <View style={styles.cardContainer}>
          <View style={styles.detailContainer}>
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
                  <View style={styles.benefitsContainer}>
                    <View style={styles.benefitRow}>
                      <Ionicons
                        name="airplane"
                        size={20}
                        color="#2e7d32"
                        style={{ marginRight: 6 }}
                      />
                      <Text style={styles.benefitText}>
                        Envío gratis a toda Colombia
                      </Text>
                    </View>
                    <View style={styles.benefitRow}>
                      <Ionicons
                        name="shield-checkmark"
                        size={20}
                        color="#2e7d32"
                        style={{ marginRight: 6 }}
                      />
                      <Text style={styles.benefitText}>
                        Garantía de por vida
                      </Text>
                    </View>
                    <View style={styles.benefitRow}>
                      <Ionicons
                        name="card"
                        size={20}
                        color="#2e7d32"
                        style={{ marginRight: 6 }}
                      />
                      <Text style={styles.benefitText}>Paga a cuotas</Text>
                    </View>
                  </View>
                </View>
              </ScrollView>
            </View>
          </View>

          {similar.length > 0 && (
            <FeaturedCarousel featuredProducts={similar} />
          )}
          {featured.length > 0 && (
            <FeaturedCarousel featuredProducts={featured} isFeatured />
          )}

        
        </View>
      </ScrollView>
      <Portal>
        <Snackbar
          visible={snackbarVisible}
          onDismiss={() => setSnackbarVisible(false)}
          duration={2000}
          style={{
            backgroundColor: "#44B244",
            alignSelf: "center",
            width: "40%",
          }}
          wrapperStyle={{
            position: "absolute",
            top: 90,
            left: 0,
            right: 0,
            bottom: "auto",
            zIndex: 9999,
          }}
        >
          {snackbarMessage}
        </Snackbar>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    backgroundColor: "white",
    width: "95%",
    alignSelf: "center",
    marginTop: 20,
    padding: 48,
    borderRadius: 15,
    minHeight: 400,
  },
  detailContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 24,
  },
  container: {
    padding: 16,
    width: "60%",
    borderWidth: 0.5,
    borderRadius: 12,
    borderColor: "#d9d9d9",
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
  benefitsContainer: {
    marginTop: 20,
  },
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  benefitText: {
    fontSize: 16,
    color: "#333",
  },
});
