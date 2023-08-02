import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AirbnbRating } from "react-native-ratings";
import axios from "axios";
import { StyleSheet } from "react-native";

const GameRating = ({ gameId, initialRating, updateCardRating }) => {
  const [rating, setRating] = useState(initialRating);

  useEffect(() => {
    const getActualRating = async (id) => {
      const game = await axios.get(
        `https://pfvideojuegos-back-production.up.railway.app/games/${id}`
      );
      // console.log("dentro de la funcion", game.data.rating);
      setRating(game.data.rating);
      return game.data.rating;
    };
    getActualRating(gameId);
  }, [gameId]);

  const handleRatingChange = async (newRating) => {
    // console.log("actual rating:");
    // console.log("Nueva calificación:", newRating);
    // console.log("Id:", gameId);

    try {
      const response = await axios.put(
        "https://pfvideojuegos-back-production.up.railway.app/games/update-rating",
        {
          gameId: gameId,
          score: newRating,
          actualRating: newRating,
        }
      );

      // console.log("Respuesta del servidor de calificación:", response.data);
      setRating(newRating);
      // Aquí puedes hacer algo con la respuesta del servidor, si es necesario

      // Rating(2); // Actualizar el estado local con la nueva calificación
      // updateCardRating(2); // Actualizar el rating en la tarjeta inicial (Home)
    } catch (error) {
      // console.error("Error al actualizar el rating del videojuego:", error);
      // Aquí puedes manejar el error, mostrar un mensaje de error, etc.
    }
  };

  return (
    <View>
      <Text>Rating: {rating}</Text>
      <AirbnbRating
        count={5}
        defaultRating={rating}
        size={20}
        showRating={false}
        selectedColor="gold"
        onFinishRating={handleRatingChange}
      />
      <Text style={styles.ratingText}>{rating}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default GameRating;
