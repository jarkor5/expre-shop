import React from "react";
import { Pressable, Image, Text, StyleSheet, View } from "react-native";
import { Product } from "@/data/products";
import { Button } from "react-native-paper";

type ProductCardProps = {
  product: Product;
  onPress?: () => void;
  onAddToCart?: () => void;
  variant?: "default" | "catalog";
};

export default function ProductCard({
  product,
  onPress,
  onAddToCart,
  variant = "default",
}: ProductCardProps) {
  const isCatalog = variant === "catalog";

  const name =
    product.name.length > 25
      ? product.name.slice(0, 20) + "..."
      : product.name;

  return (
    <Pressable onPress={onPress}>
      {({ hovered }) => (
        <View
          style={[
            isCatalog ? styles.catalogCard : styles.card,
            hovered && { transform: [{ scale: 1.05 }] },
          ]}
        >
          <Image
            source={{ uri: product.image }}
            style={isCatalog ? styles.catalogImage : styles.image}
          />
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.price}>${product.price}</Text>
          {!isCatalog && (
            <Text numberOfLines={2} style={styles.description}>
              {product.description}
            </Text>
          )}
          <Button
            mode="contained"
            style={styles.addButton}
            onPress={
              onAddToCart ? onAddToCart : () => console.log("agregado al carrito")
            }
          >
            Agregar al carrito
          </Button>
          {isCatalog && (
            <Button
              mode="contained"
              style={styles.buyNowButton}
              onPress={() => console.log("comprar ahora")}
            >
              Comprar ahora
            </Button>
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginRight: 24,
    backgroundColor: "#FEFFFE",
    padding: 12,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: "#F1AB86",
    width: 280,
    alignItems: "center",
    height: 350,
  },
  catalogCard: {
    marginRight: 24,
    backgroundColor: "#FEFFFE",
    padding: 12,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: "#F1AB86",
    width: 320, // mayor ancho para el catálogo
    alignItems: "center",
    height: 350,
  },
  image: {
    width: 200,
    height: 140,
    marginBottom: 8,
    borderRadius: 8,
    resizeMode: "cover",
    alignSelf: "center",
  },
  catalogImage: {
    width: 240, // imagen más grande en catálogo
    height: 160,
    marginBottom: 8,
    borderRadius: 8,
    resizeMode: "cover",
    alignSelf: "center",
  },
  name: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    color: "#461220",
  },
  price: {
    fontSize: 20,
    color: "#8C2F39",
    marginTop: 4,
    alignSelf: "center",
  },
  description: {
    fontSize: 16,
    color: "#495867",
    textAlign: "center",
    marginTop: 4,
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
});
