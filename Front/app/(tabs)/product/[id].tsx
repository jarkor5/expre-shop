import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { useLocalSearchParams } from "expo-router";
import ProductDetail from "@/components/Products/ProductDetails";

export default function Product(){
  const searchParams = useLocalSearchParams();
  const id = searchParams.id
  

    if (!id){
      return null
    }
    return <ProductDetail id={id as string}/>

  
}