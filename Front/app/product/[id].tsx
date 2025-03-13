// app/product/[id].tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator, ScrollView} from "react-native";
import { Button } from "react-native-paper";
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
        <View style={{backgroundColor: '#d9d9d9', flex: 1}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'white', width: '98%', alignSelf: 'center', marginTop: 20, padding: 48, borderRadius: 15}}>
            <Image source={{ uri: product.image }} style={styles.image} />
            <View style={{flexDirection: 'column', width: '40%'}}>
            <ScrollView style={{flexDirection: 'row',  width: '100%',}}>
             
             <View style={styles.container}>
             <Text style={styles.title}>{product.name}</Text>
             <Text style={styles.price}>$ {product.price}</Text>
             <Text style={styles.category}>{product.category} - {product.brand}</Text>
 
             <Text style={styles.description}>{product.description}</Text>
             <Text style={styles.subheading}>Detalles Técnicos</Text>
 <Text style={styles.techDetails}>
   {product.technicalDetails ?? "Sin detalles técnicos"}
 </Text>
 
             <Button
                        mode="contained"
                        style={styles.addButton}
                        onPress={() => console.log("agregar al carrito")}
                      >
                        Agregar al carrito
                      </Button>

                      <Button
                                    mode="contained"
                                    style={styles.buyNowButton}
                                    onPress={() => console.log("comprar ahora")}
                                  >
                                    Comprar ahora
                                  </Button>
         </View>
         </ScrollView>
            </View>
           
        </View>
        </View>
        
        
        
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
        alignItems: "center"
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
    techDetails: {fontSize: 16},
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
