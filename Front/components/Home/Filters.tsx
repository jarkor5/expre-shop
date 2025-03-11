import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Checkbox } from "react-native-paper";

export default function Filters({
  filters,
  selectedCategories,
  selectedBrands,
  toggleCategory,
  toggleBrand,
  showAllCategories,
  setShowAllCategories,
  showAllBrands,
  setShowAllBrands,
}: {
  filters: { categories: string[]; brands: string[] };
  selectedCategories: string[];
  selectedBrands: string[];
  toggleCategory: (cat: string) => void;
  toggleBrand: (brand: string) => void;
  showAllCategories: boolean;
  setShowAllCategories: (val: boolean) => void;
  showAllBrands: boolean;
  setShowAllBrands: (val: boolean) => void;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filtrar por Categoría:</Text>
      {(showAllCategories ? filters.categories : filters.categories.slice(0, 5)).map((cat) => (
        <View key={cat} style={styles.row}>
          <Checkbox
            status={selectedCategories.includes(cat) ? "checked" : "unchecked"}
            onPress={() => toggleCategory(cat)}
          />
          <Text>{cat}</Text>
        </View>
      ))}
      {filters.categories.length > 5 && (
        <Text style={styles.viewMore} onPress={() => setShowAllCategories(!showAllCategories)}>
          {showAllCategories ? "Ver menos" : "Ver más"}
        </Text>
      )}
      <Text style={styles.title}>Filtrar por Marca:</Text>
      {(showAllBrands ? filters.brands : filters.brands.slice(0, 5)).map((brand) => (
        <View key={brand} style={styles.row}>
          <Checkbox
            status={selectedBrands.includes(brand) ? "checked" : "unchecked"}
            onPress={() => toggleBrand(brand)}
          />
          <Text>{brand}</Text>
        </View>
      ))}
      {filters.brands.length > 5 && (
        <Text style={styles.viewMore} onPress={() => setShowAllBrands(!showAllBrands)}>
          {showAllBrands ? "Ver menos" : "Ver más"}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 20, marginRight: "5%", width: '100%', paddingLeft: 4 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  viewMore: { fontSize: 16, color: "#007AFF", margin: 8 },
});
