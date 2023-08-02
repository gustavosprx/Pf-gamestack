import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useSelector } from "react-redux";
const PurchaseCard = ({ videoG }) => {
  const videoGames = useSelector((state) => state.videogamesState.videoGames);

  const actualgame =
    videoGames && videoGames.filter((i) => i.id == videoG.items[0].videogameId);

  return (
    <View style={styles.cardContainer}>
      <Image source={{ uri: actualgame[0].image }} style={styles.image} />
      <Text style={styles.gameName}>{actualgame[0].name}</Text>
      <Text style={styles.rating}>Rating:{actualgame[0].rating}</Text>
      <Text style={styles.price}>Price: ${actualgame[0].price}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#E1F5FE", // Color de fondo en tono azul claro
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000", // Agregamos sombra
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  image: {
    width: 150,
    height: 100,
    resizeMode: "cover",
    marginBottom: 8,
    borderRadius: 4,
  },
  gameName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#2196F3", // Color del texto en tono azul
  },
  rating: {
    fontSize: 14,
    marginBottom: 4,
    color: "#1976D2", // Color del texto en tono azul más oscuro
  },
  price: {
    fontSize: 14,
    marginBottom: 8,
    color: "#1976D2", // Color del texto en tono azul más oscuro
  },
});

export default PurchaseCard;
