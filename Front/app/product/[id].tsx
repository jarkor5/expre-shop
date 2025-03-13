// app/product/[id].tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { fetchProductById, Product } from "@/data/products";

export default function ProductDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            // Llamamos a la API para obtener el producto
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

    // Manejo de error o producto no encontrado
    if (!product) {
        return (
            <View style={styles.center}>
                <Text>Producto no encontrado</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Encabezado con la imagen */}
            <Image source={{ uri: product.image }} style={styles.image} />

            {/* Datos del producto */}
            <Text style={styles.title}>{product.name}</Text>
            <Text style={styles.price}>$ {product.price}</Text>
            <Text style={styles.category}>{product.category} - {product.brand}</Text>

            <Text style={styles.description}>{product.description}</Text>
            {/* Aquí podrías agregar un botón de 'Agregar al carrito' o 'Comprar ahora' */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    image: {
        width: "100%",
        height: 300,
        marginBottom: 16,
        borderRadius: 8,
        resizeMode: "cover",
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 8,
    },
    price: {
        fontSize: 20,
        color: "green",
        marginBottom: 8,
    },
    category: {
        fontSize: 16,
        fontWeight: "600",
        marginBottom: 16,
    },
    description: {
        fontSize: 18,
        color: "#333",
        marginTop: 8,
    },
});
