// CatalogList.tsx
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
    <View style={styles.itemContainer}>
      <ProductCard product={item} variant="catalog" onPress={() => { /* TODO: Navegación */ }} />
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={{alignSelf: 'center', width: '100%',}}>
      <FlatList
        data={catalogProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.flatListContainer}
        scrollEnabled={false} 
      />
      </View>
      
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
  container: {
    width: "100%",
    alignSelf: "center",
    paddingTop: 40,
    top: 0,
    marginRight: '0%',
    marginLeft: '10%',
    padding: 0
  },
  flatListContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    padding: 4,
    marginLeft: '0%'

  },
  itemContainer: {
    width: "100%", 
    padding: 8,
  },
  buttonContainer: {
    alignSelf: "center",
    marginTop: 16,
    left: '-3%'
  },
});
