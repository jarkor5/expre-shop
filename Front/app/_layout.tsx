import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Slot } from 'expo-router'
import Navbar from '../components/Navbar'
import { CartProvider } from '@/context/useCart'
import { Provider as PaperProvider } from "react-native-paper"

export default function RootLayout() {
  return (
    <PaperProvider>
    <CartProvider>
      <View style={styles.container}>
      <Navbar />
      <Slot />
    </View>
  
    </CartProvider>
    </PaperProvider>
    )
    
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
