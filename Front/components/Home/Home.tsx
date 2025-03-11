import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  NativeSyntheticEvent,
  NativeScrollEvent,
  LayoutChangeEvent,
  ScrollView,
  Image
} from "react-native";
import { Product, fetchFeaturedProducts,  fetchProductsPaginated, fetchFilters, fetchProductsFiltered } from "@/data/products";
import { useRouter } from "expo-router";
import ProductCard from "./ProductCard";
import { Button, IconButton, Checkbox } from "react-native-paper";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollX, setScrollX] = useState(0);
  const [viewWidth, setViewWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
const [catalogProducts, setCatalogProducts] = useState<Product[]>([]);
const [catalogPage, setCatalogPage] = useState(1);
const catalogLimit = 9;
const [hasMoreCatalogProducts, setHasMoreCatalogProducts] = useState(true);
const [filters,setFilters] = useState<{categories: string[], brands: string[]}>({categories: [], brands: []})
const [selectedCategories, setSelectedCategories] = useState<string[]>([])
const [selectedBrands, setSelectedBrands] = useState<string[]>([]) 
const [showAllCategories, setShowAllCategories] = useState(false)
const [showAllBrands, setShowAllBrands] = useState(false)

  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    fetchFeaturedProducts().then((data) => {
      setFeaturedProducts(data);
    });
    loadCatalogPage(1);
    fetchFilters()
      .then((data) => {
        setFilters(data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    setCatalogPage(1);
    setHasMoreCatalogProducts(true);
    loadCatalogPage(1);
  }, [selectedCategories, selectedBrands]);
  

  
  

  const loadCatalogPage = (page: number) => {
    let queryParams = `?page=${page}&limit=${catalogLimit}`;
    if (selectedCategories.length > 0) {
      queryParams += `&category=${selectedCategories.join(",")}`;
    }
    if (selectedBrands.length > 0) {
      queryParams += `&brand=${selectedBrands.join(",")}`;
    }
    fetchProductsFiltered(queryParams).then((data) => {
      if (data.length < catalogLimit) {
        setHasMoreCatalogProducts(false);
      }
      if (page === 1) {
        setCatalogProducts(data);
      } else {
        setCatalogProducts((prev) => [...prev, ...data]);
      }
    });
  };
  
  const toggleCategory = (category: string) => {
   if (selectedCategories.includes(category)) {
     setSelectedCategories([])
   }
    else{
      setSelectedCategories([category])
    }
  };

  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands([]);
    } else {
      setSelectedBrands([brand]);
    }
  };
  
  

const handleLoadMoreCatalog = ()=>{
  const  nextPage   = catalogPage + 1
  setCatalogPage(nextPage)
  loadCatalogPage(nextPage)
}

  const renderItem = ({ item }: { item: Product }) => (
    <ProductCard
      product={item}
      onPress={() => {
        router.push('/product');
      }}
    />
  );

  const renderCatalogItem = ({item}: {item: Product}) => (
    <ProductCard
      product={item}
      variant="catalog"
      onPress={() => {
        router.push('/product');
      }}
    />
  )

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
          <Image
          source={require('../../assets/images/ExpreBanner1.png')}
          style={styles.bannerImage}
          />
        </View>

        <View style={{ width: '85%', alignSelf: 'center' }}>
          <Text style={styles.title}>Bienvenido a Expre Shop!
          </Text>
          <Text style={styles.bodyText}>Expre Shop es la tienda musical que marca la diferencia.
            Descubre una amplia selección de instrumentos,
            equipos y accesorios de alta calidad. Con pasión e innovación,
            cada producto inspira creatividad y transforma
            cada nota en una experiencia inolvidable.</Text>

            <View style={{ marginTop: '2%' }}>
            <Text style={styles.subtitle}>¿Ya conoces los beneficios de comprar en Expre shop?</Text>
          <View style={styles.plus}>
            <View style={styles.plusBox}>
              <IconButton icon="truck" size={36} disabled={true} />
              <Text style={styles.plusText}>Envío gratis a toda Colombia</Text>
            </View>
            <View style={styles.plusBox}>
              <IconButton icon="shield-check" size={36} disabled={true} />
              <Text style={styles.plusText}>Garantía de por vida</Text>
            </View>
            <View style={styles.plusBox}>
              <IconButton icon="headset" size={36} disabled={true} />
              <Text style={styles.plusText}>Servicio técnico 24/7</Text>
            </View>
            <View style={styles.plusBox}>
              <IconButton icon="credit-card" size={36} disabled={true} />
              <Text style={styles.plusText}>Paga a cuotas!</Text>
            </View>
          </View>
            </View>

          
        </View>

        <View style={styles.productsContainer}>
          <Text style={styles.title}>Productos Destacados</Text>
          <View style={styles.carouselContainer} onLayout={onContainerLayout}>
            <IconButton
              icon="chevron-left"
              size={32}
              style={[
                styles.arrow,
                styles.leftArrow,
                scrollX <= 0 && styles.disabledArrow,
              ]}
              disabled={scrollX <= 0}
              onPress={scrollLeft}
            />
            <FlatList
              ref={flatListRef}
              data={featuredProducts.filter((p) => p.isfeatured)}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              horizontal
              onScroll={handleScroll}
              scrollEventThrottle={16}
              onContentSizeChange={(width, height) => setContentWidth(width)}
              contentContainerStyle={styles.productsList}
              showsHorizontalScrollIndicator={false}
            />
            <IconButton
              icon="chevron-right"
              size={32}
              style={[
                styles.arrow,
                styles.rightArrow,
                scrollX >= contentWidth - viewWidth && styles.disabledArrow,
              ]}
              disabled={scrollX >= contentWidth - viewWidth}
              onPress={scrollRight}
            />
          </View>
        </View>

<View>
<Text style={styles.title}>Descubre nuestro cátalogo</Text>
<View style={{ flexDirection: 'row'}}>
<View style={styles.filtersContainer}>
  <Text style={styles.filtersTitle}>Filtrar por Categoría:</Text>
  {(showAllCategories ? filters.categories : filters.categories.slice(0, 5)).map((cat: string) => (
    <View key={cat} style={styles.checkboxRow}>
      <Checkbox
        status={selectedCategories.includes(cat) ? "checked" : "unchecked"}
        onPress={() => toggleCategory(cat)}
      />
      <Text>{cat}</Text>
    </View>
  ))}
  {filters.categories.length > 5 && (
    <Text
      style={styles.viewMoreText}
      onPress={() => setShowAllCategories(!showAllCategories)}
    >
      {showAllCategories ? "Ver menos" : "Ver más"}
    </Text>
  )}

  <Text style={styles.filtersTitle}>Filtrar por Marca:</Text>
  {(showAllBrands ? filters.brands : filters.brands.slice(0, 5)).map((brand: string) => (
    <View key={brand} style={styles.checkboxRow}>
      <Checkbox
        status={selectedBrands.includes(brand) ? "checked" : "unchecked"}
        onPress={() => toggleBrand(brand)}
      />
      <Text>{brand}</Text>
    </View>
  ))}
  {filters.brands.length > 5 && (
    <Text
      style={styles.viewMoreText}
      onPress={() => setShowAllBrands(!showAllBrands)}
    >
      {showAllBrands ? "Ver menos" : "Ver más"}
    </Text>
  )}
</View>


<View style={styles.catalogContainer}>
<FlatList
    data={catalogProducts}
    renderItem={renderCatalogItem}
    keyExtractor={(item) => item.id}
    numColumns={3}
    columnWrapperStyle={{
      justifyContent: "flex-start",
      marginBottom: 24,
      padding: 24,
      flexWrap: "wrap",
      alignContent: "flex-start",
      height: '100%',
      top: 0
    }}
  />
  {hasMoreCatalogProducts && (
    <View style={{ alignSelf: "center", marginTop: 16 }}>
      <Button
        mode="outlined"
        onPress={() => {
          const nextPage = catalogPage + 1;
          setCatalogPage(nextPage);
          loadCatalogPage(nextPage);
        }}
      >
        Ver más
      </Button>
    </View>
  )}
          
        </View>

</View>
</View>

       

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  productsList: {
    padding: 12,

  },
  carouselContainer: {
    position: "relative",
  },
  arrow: {
    position: "absolute",
    top: "50%",
    zIndex: 1,
    backgroundColor: "rgba(255,255,255,0.8)",
  },
  leftArrow: {
    left: 0,
    transform: [{ translateY: -16 }],
  },
  rightArrow: {
    right: 0,
    transform: [{ translateY: -16 }],
  },
  disabledArrow: {
    opacity: 0.3,
  },
  productsContainer: { marginTop: '4%' },
  bodyText: {
    fontSize: 20,
  },
  subtitle: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 16,
    marginTop: 8,
    textAlign: "center",
  },
  plus: {
    flexDirection: 'row',
    justifyContent: 'space-around',marginTop: '2%'
  },
  plusBox: {
    padding: 16,
    borderWidth: 2,
    width: '23%',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#461220',
    borderRadius: 8,
    marginBottom: 8
  },
  plusText: {
    fontSize: 18,
    color: '#461220',
    fontWeight: 600
  },
  bannerContainer: {
    width: "100%",
    height: 300, 
    marginVertical: 10,
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 8, 
  },
  catalogContainer: {
    width: '80%',
    alignSelf: 'center',
    paddingTop: 40,
    top: 0,
    height: '100%'
  },
  filtersContainer: {
    marginVertical: 20,
    marginRight: '5%'
  },
  filtersTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  checkboxRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },

  viewMoreText: {
    fontSize: 16,
    color: "#007AFF", // Color azul, por ejemplo
    textAlign: "center",
    marginTop: 5,
  },

});
