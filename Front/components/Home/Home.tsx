import React, { useState, useEffect, useRef, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, LayoutChangeEvent, NativeSyntheticEvent, NativeScrollEvent, Image } from "react-native";
import { useRouter } from "expo-router";
import { Checkbox, Button, IconButton } from "react-native-paper";
import { Product, fetchFeaturedProducts, fetchProductsFiltered, fetchFilters } from "@/data/products";
import ProductCard from "./ProductCard";
import FeaturedCarousel from "../Products/FeaturedCarousel";
import Filters from "./Filters";
import CatalogList from "./CatalogList";
import { buildCatalogQuery } from "@/utils/buildCatalogQuery";

// Constante para paginación
const CATALOG_LIMIT = 12;

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
  const isFirstLoad = useRef(true);

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        if (isFirstLoad.current) {
          const featured = await fetchFeaturedProducts();
          if (mounted) {
            setFeaturedProducts(featured);
            isFirstLoad.current = false;
          }
        }
        const categoryParam = selectedCategories[0];
        const filtersData = await fetchFilters(categoryParam);
        if (mounted) {
          setFilters(filtersData);
          setCatalogPage(1);
          setHasMoreCatalogProducts(true);
        }
        const queryParams = buildCatalogQuery(1, CATALOG_LIMIT, {
          category: selectedCategories[0],
          brand: selectedBrands[0],
        });
        console.log("Query Params:", queryParams);
        const catalogData = await fetchProductsFiltered(queryParams);
        if (mounted) {
          if (catalogData.length < CATALOG_LIMIT) {
            setHasMoreCatalogProducts(false);
          }
          setCatalogProducts(catalogData);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [selectedCategories, selectedBrands]);



  const loadCatalogPage = async (page: number) => {
    try {
      const queryString = buildCatalogQuery(page, CATALOG_LIMIT, {
        category: selectedCategories[0],
        brand: selectedBrands[0],
      })

      const data = await fetchProductsFiltered(queryString)


      if (data.length < CATALOG_LIMIT) {
        setHasMoreCatalogProducts(false)
      }

      if (page === 1) {
        setCatalogProducts(data)
      } else {
        setCatalogProducts((prev) => [...prev, ...data])
      }
    } catch (error) {
      console.error("error al cargar la página del catálogo", error)
    }
  }


  // Función para cargar más productos del catálogo
  const handleLoadMoreCatalog = useCallback(async () => {
    try {
      setCatalogPage((prevPage) => {
        const nextPage = prevPage + 1;
        loadCatalogPage(nextPage);
        return nextPage;
      });
    } catch (error) {
      console.error("Error al cargar más productos del catálogo:", error);
      // TODO: Manejar error con un estado o alert
    }
  }, [loadCatalogPage, setCatalogPage]);


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

  // Funciones para manejo de filtros 
  const toggleCategory = (category: string) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories([]);
      setSelectedBrands([])
    } else {
      setSelectedCategories([category])
      setSelectedBrands([])
    }
  };

  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands([]);
    } else {
      setSelectedBrands([brand]);
    }
  };

  // Renderizado condicional si la data aún está cargando
  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 36, alignSelf: 'center' }}>Cargando productos... Gracias por tu paciencia!</Text>
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

        <FeaturedCarousel
          featuredProducts={featuredProducts}
          isFeatured

        />
        <Text style={styles.title}>Descubre nuestro Cátalogo</Text>
        <View style={{ flexDirection: "row", width: '100%', alignSelf: 'center' }}>

          <ScrollView style={{ width: '20%' }}>
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

          <ScrollView style={{ width: '100%', padding: 16, marginLeft: '5%' }}>
            <CatalogList
              catalogProducts={catalogProducts}
              loadMoreCatalog={handleLoadMoreCatalog}
              hasMoreCatalogProducts={hasMoreCatalogProducts}
            />
          </ScrollView>

        </View>

      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 8
  },
  bannerContainer: {
    width: "100%",
    height: 300,
    marginVertical: 10
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 8
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center"
  },
  bodyText: {
    fontSize: 20
  },
  subtitle: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 16,
    marginTop: 8,
    textAlign: "center"
  },
  plus: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: "2%"
  },
  plusBox: {
    padding: 16,
    borderWidth: 2,
    width: "23%",
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#461220",
    borderRadius: 8,
    marginBottom: 8
  },
  plusText: {
    fontSize: 18,
    color: "#461220",
    fontWeight: "600"
  },
});
