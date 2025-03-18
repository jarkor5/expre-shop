import React, { useState, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { IconButton } from "react-native-paper";
import { Product } from "@/data/products";
import ProductCard from "./Home/ProductCard";
import { useRouter } from "expo-router";

type FeaturedCarouselProps = {
  featuredProducts: Product[];  
  isFeatured?: boolean;        
};

export default function FeaturedCarousel({
  featuredProducts,
  isFeatured = false,
}: FeaturedCarouselProps) {
  const router = useRouter();
  const flatListRef = useRef<FlatList<Product>>(null);
  const [scrollX, setScrollX] = useState(0);
  const [viewWidth, setViewWidth] = useState(0);
  const [contentWidth, setContentWidth] = useState(0);
  const titleToShow = isFeatured ? "Productos Destacados" : "Quizás podría gustarte";

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setScrollX(event.nativeEvent.contentOffset.x);
  };

  const onContainerLayout = (event: LayoutChangeEvent) => {
    setViewWidth(event.nativeEvent.layout.width);
  };
  const scrollLeft = () => {
    if (flatListRef.current) {
      if (scrollX <= 0) {
        const newOffset = contentWidth - viewWidth;
        flatListRef.current.scrollToOffset({ offset: newOffset, animated: true });
        setScrollX(newOffset);
      } else {
        const newOffset = Math.max(scrollX - viewWidth / 2, 0);
        flatListRef.current.scrollToOffset({ offset: newOffset, animated: true });
        setScrollX(newOffset);
      }
    }
  };

  const scrollRight = () => {
    if (flatListRef.current) {
      if (scrollX >= contentWidth - viewWidth -1) {
        flatListRef.current.scrollToOffset({ offset: 0, animated: true });
        setScrollX(0);
      } else {
        const newOffset = Math.min(scrollX + viewWidth / 2, contentWidth - viewWidth);
        flatListRef.current.scrollToOffset({ offset: newOffset, animated: true });
        setScrollX(newOffset);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{titleToShow}</Text>
      <View style={styles.carouselContainer} onLayout={onContainerLayout}>
        <IconButton
          icon="chevron-left"
          size={32}
          style={[styles.arrow, styles.leftArrow]}
          onPress={scrollLeft}
        />
        <FlatList
          ref={flatListRef}
          data={featuredProducts} 
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() =>
                router.push({
                  pathname: "/product/[id]",
                  params: { id: item.id },
                })
              }
            />
          )}
          keyExtractor={(item) => item.id}
          horizontal
          onScroll={handleScroll}
          scrollEventThrottle={16}
          onContentSizeChange={(width) => setContentWidth(width)}
          contentContainerStyle={styles.productsList}
          showsHorizontalScrollIndicator={false}
        />
        <IconButton
          icon="chevron-right"
          size={32}
          style={[styles.arrow, styles.rightArrow]}
          onPress={scrollRight}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: "4%" },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
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
  leftArrow: { left: 0, transform: [{ translateY: -16 }] },
  rightArrow: { right: 0, transform: [{ translateY: -16 }] },
  productsList: {
    padding: 12,
  },
});
