import React from "react";
import { View, FlatList, StyleSheet } from "react-native";
import { Button } from "react-native-paper";
import ProductCard from "./ProductCard";
import { Product } from "@/data/products";

export default function CatalogList({
  catalogProducts,
  loadMoreCatalog,
  hasMoreCatalogProducts,
}: {
  catalogProducts: Product[];
  loadMoreCatalog: () => void;
  hasMoreCatalogProducts: boolean;
}) {
  const renderItem = ({ item }: { item: Product }) => (
    <ProductCard product={item} variant="catalog" onPress={() => { /* TODO: Navegación */ }} />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={catalogProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={3}
        columnWrapperStyle={styles.columnWrapper}
      />
      {hasMoreCatalogProducts && (
        <View style={styles.buttonContainer}>
          <Button mode="outlined" onPress={loadMoreCatalog}>
            Ver más
          </Button>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: "80%", alignSelf: "center", paddingTop: 40, top: 0 },
  columnWrapper: {
    justifyContent: "flex-start",
    marginBottom: 24,
    padding: 24,
    flexWrap: "wrap",
    alignContent: "flex-start",
  },
  buttonContainer: { alignSelf: "center", marginTop: 16 },
});
