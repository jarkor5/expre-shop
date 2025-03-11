// Home.tsx
import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, LayoutChangeEvent, NativeSyntheticEvent, NativeScrollEvent , Image} from "react-native";
import { useRouter } from "expo-router";
import { Checkbox, Button, IconButton } from "react-native-paper";
import { Product, fetchFeaturedProducts, fetchProductsFiltered, fetchFilters } from "@/data/products";
import ProductCard from "./ProductCard";
import FeaturedCarousel from "../FeaturedCarousel";
import Filters from "./Filters";
import CatalogList from "./CatalogList";

// Constante para paginación
const CATALOG_LIMIT = 9;

export default function Home() {
  // Estados de productos
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados de paginación
  const [catalogPage, setCatalogPage] = useState<number>(1);
  const [hasMoreCatalogProducts, setHasMoreCatalogProducts] = useState(true);

  // Estados de filtros y opciones
  const [filters, setFilters] = useState<{ categories: string[]; brands: string[] }>({ categories: [], brands: [] });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllBrands, setShowAllBrands] = useState(false);

  // Estados para el carrusel de destacados
  const [scrollX, setScrollX] = useState(0);
  const [viewWidth, setViewWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);

  const router = useRouter();
  const flatListRef = useRef<any>(null);

  // Carga inicial de datos
  useEffect(() => {
    fetchFeaturedProducts().then((data) => setFeaturedProducts(data));
    loadCatalogPage(1);
    fetchFilters()
      .then((data) => setFilters(data))
      .finally(() => setLoading(false));
  }, []);

  // Reiniciar catálogo cuando cambian los filtros
  useEffect(() => {
    setCatalogPage(1);
    setHasMoreCatalogProducts(true);
    loadCatalogPage(1);
  }, [selectedCategories, selectedBrands]);

  // Función para cargar el catálogo con filtros y paginación
  const loadCatalogPage = (page: number) => {
    let queryParams = `?page=${page}&limit=${CATALOG_LIMIT}`;
    if (selectedCategories.length > 0) {
      queryParams += `&category=${selectedCategories.join(",")}`;
    }
    if (selectedBrands.length > 0) {
      queryParams += `&brand=${selectedBrands.join(",")}`;
    }
    fetchProductsFiltered(queryParams).then((data) => {
      if (data.length < CATALOG_LIMIT) {
        setHasMoreCatalogProducts(false);
      }
      if (page === 1) {
        setCatalogProducts(data);
      } else {
        setCatalogProducts((prev) => [...prev, ...data]);
      }
    });
    // TODO: Manejar errores en la carga de datos
  };

  // Función para cargar más productos del catálogo
  const handleLoadMoreCatalog = () => {
    const nextPage = catalogPage + 1;
    setCatalogPage(nextPage);
    loadCatalogPage(nextPage);
  };

  // Funciones para el carrusel de destacados
  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollX(event.nativeEvent.contentOffset.x);
  };

  const onContainerLayout = (event: LayoutChangeEvent) => {
    setViewWidth(event.nativeEvent.layout.width);
  };

  const scrollLeft = () => {
    if (flatListRef.current) {
      const newOffset = Math.max(scrollX - viewWidth / 2, 0);
      flatListRef.current.scrollToOffset({ offset: newOffset, animated: true });
    }
  };

  const scrollRight = () => {
    if (flatListRef.current) {
      const maxOffset = contentWidth - viewWidth;
      const newOffset = Math.min(scrollX + viewWidth / 2, maxOffset);
      flatListRef.current.scrollToOffset({ offset: newOffset, animated: true });
    }
  };

  // Funciones para manejo de filtros (solo un filtro a la vez)
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories([]);
    } else {
      setSelectedCategories([category]);
      setSelectedBrands([]); // Limpiar marcas si se selecciona una categoría
    }
  };

  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands([]);
    } else {
      setSelectedBrands([brand]);
      setSelectedCategories([]); // Limpiar categorías si se selecciona una marca
    }
  };

  // Renderizado condicional si la data aún está cargando
  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando productos... Gracias por tu paciencia!</Text>
      </View>
    );
  }

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.bannerContainer}>
          <Image source={require("../../assets/images/ExpreBanner1.png")} style={styles.bannerImage} />
        </View>
        <View style={{ width: "85%", alignSelf: "center" }}>
          <Text style={styles.title}>Bienvenido a Expre Shop!</Text>
          <Text style={styles.bodyText}>
            Expre Shop es la tienda musical que marca la diferencia. Descubre una amplia
            selección de instrumentos, equipos y accesorios de alta calidad. Con pasión e
            innovación, cada producto inspira creatividad y transforma cada nota en una
            experiencia inolvidable.
          </Text>
        </View>
        <View style={{ marginTop: "2%" }}>
          <Text style={styles.subtitle}>¿Ya conoces los beneficios de comprar en Expre shop?</Text>
          <View style={styles.plus}>
            <View style={styles.plusBox}>
              <IconButton icon="truck" size={36} disabled />
              <Text style={styles.plusText}>Envío gratis a toda Colombia</Text>
            </View>
            <View style={styles.plusBox}>
              <IconButton icon="shield-check" size={36} disabled />
              <Text style={styles.plusText}>Garantía de por vida</Text>
            </View>
            <View style={styles.plusBox}>
              <IconButton icon="headset" size={36} disabled />
              <Text style={styles.plusText}>Servicio técnico 24/7</Text>
            </View>
            <View style={styles.plusBox}>
              <IconButton icon="credit-card" size={36} disabled />
              <Text style={styles.plusText}>Paga a cuotas!</Text>
            </View>
          </View>
        </View>

        {/* Componente modular: FeaturedCarousel */}
        <FeaturedCarousel
          featuredProducts={featuredProducts}

        />
<Text style={styles.title}>Descubre nuestro Cátalogo</Text>
        <View style={{ flexDirection: "row", }}>
          
          <ScrollView>
          <Filters
            filters={filters}
            selectedCategories={selectedCategories}
            selectedBrands={selectedBrands}
            toggleCategory={toggleCategory}
            toggleBrand={toggleBrand}
            showAllCategories={showAllCategories}
            setShowAllCategories={setShowAllCategories}
            showAllBrands={showAllBrands}
            setShowAllBrands={setShowAllBrands}
          />
          </ScrollView>
        

          <CatalogList
            catalogProducts={catalogProducts}
            loadMoreCatalog={handleLoadMoreCatalog}
            hasMoreCatalogProducts={hasMoreCatalogProducts}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  bannerContainer: { width: "100%", height: 300, marginVertical: 10 },
  bannerImage: { width: "100%", height: "100%", resizeMode: "cover", borderRadius: 8 },
  title: { fontSize: 36, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  bodyText: { fontSize: 20 },
  subtitle: { fontSize: 26, fontWeight: "bold", marginBottom: 16, marginTop: 8, textAlign: "center" },
  plus: { flexDirection: "row", justifyContent: "space-around", marginTop: "2%" },
  plusBox: { padding: 16, borderWidth: 2, width: "23%", justifyContent: "center", alignItems: "center", borderColor: "#461220", borderRadius: 8, marginBottom: 8 },
  plusText: { fontSize: 18, color: "#461220", fontWeight: "600" },
});
