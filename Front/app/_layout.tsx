
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Slot } from 'expo-router';
import Navbar from '../components/Navbar';

export default function RootLayout() {
  return (
    <View style={styles.container}>
      <Navbar />
      <Slot />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
