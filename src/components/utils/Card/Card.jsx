import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React from "react";
// import StarRating from "react-native-star-rating";
import { AirbnbRating } from "react-native-ratings";
import { InsertarItem } from "../../forms/Cart/CardCartController";
import { updateCart } from "../../../redux/cartSlice";
import { useDispatch } from "react-redux";
import GameRating from "../../views/Home/Detail/GameRating";
import { useState, useRef, useSelector } from "react";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from "react-native-animatable"; // Importamos la librería para las animaciones

const Card = (props) => {
  const { videoG, nav } = props;

  {/* Botón de favoritos -> NO BORRAR COMENTARIOS POR EL AMOR DE DIOS. */}
  const [isFavorite, setIsFavorite] = useState(false); // Estado para controlar si el juego es favorito o no
  const heartRef = useRef(null); // Referencia para la animación del corazón
  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Hacemos que el corazón tiemble cada vez que se toque
    heartRef.current?.rubberBand(500); // 500ms para completar la animación
  };
 {/* Botón de favoritos -> NO BORRAR COMENTARIOS POR EL AMOR DE DIOS. */}



  const dispatch = useDispatch();
  // Función para actualizar el rating del videojuego en la tarjeta inicial (Home)
  const [videoGames, setVideoGames] = useState([]);
  //PARSEANDO OBJETO PARA AGREGAR AL CARRITO
  let objeto = {
    id: videoG.id,
    title: videoG.name,
    price: videoG.price,
    img: videoG.image,
    stock: 5,
    amount: 1,
  };
  const objString = JSON.stringify(objeto);

  const key = "cart" + videoG.id;
  // console.log("generado clave cart",key)

  // Función para actualizar el rating del videojuego en la tarjeta inicial (Home)
  const updateCardRating = (newRating) => {
    const updatedVideoGames = videoGames.map((videoGame) => {
      if (videoGame.id === videoG.id) {
        return { ...videoGame, rating: newRating };
      } else {
        return videoGame;
      }
    });
    setVideoGames(updatedVideoGames);
  };
 
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {/* Imagen del videojuego */}
        <TouchableOpacity onPress={() => nav.navigate("Detail", { videoGames: videoG })}>
          <Image
            style={styles.image}
            source={{ uri: videoG.image }}
            PlaceholderContent={<ActivityIndicator color={"#FFFFFF"} size={"large"} />}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.detailsContainer}>
        {/* Nombre del videojuego */}
        <Text style={styles.name}>{videoG.name}</Text>
  
        {/* Rating del videojuego */}
        <AirbnbRating
          count={5}
          defaultRating={videoG.rating}
          size={20}
          showRating={false}
          selectedColor="gold"
          isDisabled={true}
        />
  
        {/* Fila que contiene el precio y el corazón */}
      <View style={styles.priceAndFavoriteContainer}>
        {/* Precio del videojuego */}
        <Text style={styles.price}>$ {videoG.price}</Text>

        {/* Espacio entre el precio y el corazón */}
        <View style={styles.space} />

        {/* Botón de favoritos */}
        <TouchableOpacity onPress={handleToggleFavorite}>
        <Animatable.View ref={heartRef} >
            <MaterialCommunityIcons style={styles.heartIcon}
              name={isFavorite ? 'heart-plus' : 'heart-minus'}
              size={30}
              color={isFavorite ? "#622EDA" : "#595959"}
            />
          </Animatable.View>
        </TouchableOpacity>
      </View>
        
        {/* Botón "Add to cart" */}
        <TouchableOpacity onPress={() => {
          InsertarItem(key, objString);
          dispatch(updateCart());
          console.log("key guardada", objString);
        }}>
          <View style={[styles.AddCartContainer, { backgroundColor: "#622EDA" }]}>
            <Text style={[styles.addItemCar, { color: "#ffffff" }]}>
              {"Add to cart"}
            </Text>
          </View>
        </TouchableOpacity>
        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  priceAndFavoriteContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  space: {
    width: 30, // Ajusta este valor según el espaciado deseado
  },
  container: {
    padding: 3,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    // marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
    // shadowColor: 'black',
    shadowOpacity: 0.23,
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 10,
    elevation: 3,
    backgroundColor: "#987BDC",
  },
  imageContainer: {
    alignItems: "center",
    // flex:1
    width: "45%",
    // height: '100%',
    // marginRight: 10 ,
    marginLeft: 5,
    // backgroundColor:'blue
  },
  image: {
    marginTop: 10,
    marginBottom: 10,
    // marginLeft: -10,
    width: 140,
    height: 140,
    borderRadius: 8,
    // alignSelf:'center',
    alignContent: "center",
    resizeMode: "cover",
  },
  detailsContainer: {
    width: "50%",
    // height:'100%',
    alignContent: "space-between",
    alignItems: "center",
    padding: 5,
  },
  name: {
    fontSize: 15,
    alignContent: "center",
    alignItems: "center",
    textAlign: "center",
    verticalAlign: "middle",
    fontWeight: "bold",
    height: 37,
  },
  rating: {
    fontSize: 16,
    textAlign: "center",
  },
  price: {
    fontSize: 22,
    textAlign: "center",
    fontWeight: "bold",
    height: 28,
    color: "white",
  },
  detail: {
    fontSize: 18,
    textAlign: "center",
  },
  AddCartContainer: {
    alignContent: "center",
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginTop: 15,
    // textAlign:'center'
  },
  addItemCar: {
    margin: 5,
    // marginLeft:10,
    textAlign: "center",
    fontWeight: "700",
    fontSize: 15,
    width: 110,
    // backgroundColor:'white'
  },
});

export default Card;
