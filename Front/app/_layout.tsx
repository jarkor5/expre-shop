import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Slot } from 'expo-router'
import Navbar from '../components/Navbar'
import { CartProvider } from '@/context/useCart'
import { Provider as PaperProvider } from "react-native-paper"
import { AuthProvider } from '@/context/AuthContext'
export default function RootLayout() {
  return (
   
       <PaperProvider>

    <AuthProvider >
    <CartProvider>
      <View style={styles.container}>
      <Navbar />
      <Slot />
    </View>
  
    </CartProvider>
    </AuthProvider>
    </PaperProvider>
   
   
    )
    
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
