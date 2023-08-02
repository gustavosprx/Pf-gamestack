import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getvideoGames } from '../../../redux/videogamesActions';

import Card from '../../utils/Card/Card';

const VideoGames = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const videoGames = useSelector((state) => state.videogamesState.videoGames);
  const filteredVideoGames = useSelector((state) => state.videogamesState.filteredVideoGames);
  const notFoundGames = useSelector((state) => state.videogamesState.notFoundGames);

  useEffect(() => {
    
    dispatch(getvideoGames());
  }, []);

  // Función para cargar más videojuegos
  const fetchMoreVideoGames = () => {
    // implementar la lógica para obtener más videojuegos desde API o fuente de datos
  };

  return (
    <View style={styles.container}>
      {console.log(notFoundGames)}
      {notFoundGames ? <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText1}>We're sorry!</Text>
          <Text style={styles.notFoundText}>No games found with that name.</Text>
        </View> : <FlatList
        data={filteredVideoGames.length > 0 ? filteredVideoGames : videoGames}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Card key={item.id} videoG={item} nav={navigation} />}
        onEndReached={fetchMoreVideoGames} // Función a llamar cuando se alcanza el final de la lista
        onEndReachedThreshold={0.1} // Umbral para activar la carga de más videojuegos (valor entre 0 y 1)
        // ListFooterComponent={<Text>Loading...</Text>} // Componente de carga mientras se obtienen más videojuegos
      />}
      

      {/* <TouchableOpacity onPress={() =>navigation.navigate('Detail', {props: videogames[0]  })}> 
          <Text style={styles.enlace2}>Enlace a ScreenDetalle</Text>
        </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width:'93%',
    marginLeft:10,
  },
  enlace2: {
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 25,
  },
  notFoundContainer: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  notFoundText1: {
    fontSize: 24,
    fontWeight: "bold",
    color:"#987BDC"
  }, 
  notFoundText: {
    fontSize: 21,
    fontWeight: "bold",
  },

});

export default VideoGames;