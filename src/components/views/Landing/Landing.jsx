import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { StatusBar } from 'react-native';
import { ThemeContext } from '../../utils/theme/ThemeProvider';
import { LanguajeContext } from '../../utils/languaje/languajeProvider';
import {
  getvideoGames,
  applyPriceSortAsc,
  applyRatingSortDesc
} from '../../../redux/videogamesActions';
import Card from '../../utils/Card/Card';

const Landing = ({ navigation }) => {
  const { isDarkMode, StringsDark } = useContext(ThemeContext);
  const { StringsLanguaje, locale } = useContext(LanguajeContext);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getvideoGames());
    dispatch(applyPriceSortAsc());
    dispatch(applyRatingSortDesc());
  }, []);

  const videoGames = useSelector((state) => state.videogamesState.videoGames);

  useEffect(() => {
    navigation.setOptions({
      // headerTitle: `${StringsLanguaje.Welcome}`,
      headerTitle: `Welcome`,
      headerTintColor: StringsDark.Titulo_Screen,
      headerStyle: {
        backgroundColor: StringsDark.Titulo_Screen_fondo,
      },
    });
  }, [isDarkMode, locale]);

  const [menu1Index, setMenu1Index] = useState(5);
  const [menu2Index, setMenu2Index] = useState(10);
  const [showMoreMenu1, setShowMoreMenu1] = useState(true);
  const [showMoreMenu2, setShowMoreMenu2] = useState(true);
  const [showCloseMenu1, setShowCloseMenu1] = useState(false);
  const [showCloseMenu2, setShowCloseMenu2] = useState(false);

  useEffect(() => {
    setMenu1Index(5);
    setMenu2Index(10);
    setShowMoreMenu1(true);
    setShowMoreMenu2(true);
    setShowCloseMenu1(false);
    setShowCloseMenu2(false);
  }, [videoGames]);

  const loadMoreGames = (menu) => {
    if (menu === 'menu1') {
      const newMenu1Index = menu1Index + 5;
      if (newMenu1Index >= videoGames.length) {
        setMenu1Index(videoGames.length);
        setShowMoreMenu1(false);
        setShowCloseMenu1(true);
      } else {
        setMenu1Index(newMenu1Index);
      }
    } else if (menu === 'menu2') {
      const newMenu2Index = menu2Index + 5;
      if (newMenu2Index >= videoGames.length) {
        setMenu2Index(videoGames.length);
        setShowMoreMenu2(false);
        setShowCloseMenu2(true);
      } else {
        setMenu2Index(newMenu2Index);
      }
    }
  };

  const renderSliderItem = ({ item }) => (
    <View style={styles.sliderItem}>
      <Image source={{ uri: item.image }} style={styles.sliderImage} resizeMode="cover" />
    </View>
  );

  const customKeyExtractor = (item, index) => {
    return index.toString();
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: StringsDark.menuDrawner_c }]}>
      <StatusBar backgroundColor={StringsDark.status_bar} barStyle="light-content" />

      <View style={styles.gameStackButtonContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('HomeStack')}>
          {/* Cambiar el botón "Game Stack" por una imagen */}
          <Image source={require('../../../../assets/logoLigth.png')} style={styles.gameStackButton} />
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={videoGames}
        keyExtractor={customKeyExtractor}
        renderItem={renderSliderItem}
        contentContainerStyle={styles.sliderContainer}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
      />

      <View style={[styles.menuContainer, { backgroundColor: '#3F13A4' }]}>
        <Text style={[styles.menuTitle, styles.bestSellersTitle, { color: '#FFFFFF' }]}>Best sellers</Text>
        <View style={styles.cardContainer}>
          {videoGames.slice(0, menu1Index).map((item, index) => (
            <Card key={index} videoG={item} nav={navigation} />
          ))}
        </View>
        {showMoreMenu1 && (
          <TouchableOpacity onPress={() => loadMoreGames('menu1')}>
            <View style={[styles.button, styles.menuButton]}>
              <Text style={[styles.buttonText, { color: StringsDark.boton_texto }]}>
                {menu1Index >= videoGames.length ? 'Close' : 'See more'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        {showCloseMenu1 && (
          <TouchableOpacity onPress={() => setShowCloseMenu1(false)}>
            <View style={[styles.button, styles.menuButton]}>
              <Text style={[styles.buttonText, { color: StringsDark.boton_texto }]}>Close</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      <View style={[styles.menuContainer, { backgroundColor: '#622EDA' }]}>
        <Text style={[styles.menuTitle, styles.lastestReleasesTitle, { color: '#FFFFFF' }]}>Lastest releases</Text>
        <View style={styles.cardContainer}>
          {videoGames.slice(5, menu2Index).map((item, index) => (
            <Card key={index} videoG={item} nav={navigation} />
          ))}
        </View>
        {showMoreMenu2 && (
          <TouchableOpacity onPress={() => loadMoreGames('menu2')}>
            <View style={[styles.button, styles.menuButton]}>
              <Text style={[styles.buttonText, { color: StringsDark.boton_texto }]}>
                {menu2Index >= videoGames.length ? 'Close' : 'See more'}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        {showCloseMenu2 && (
          <TouchableOpacity onPress={() => setShowCloseMenu2(false)}>
            <View style={[styles.button, styles.menuButton]}>
              <Text style={[styles.buttonText, { color: StringsDark.boton_texto }]}>Close</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Resto del código... */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
  },
  sliderContainer: {
    marginBottom: 20,
    marginTop: 20,
  },
  sliderItem: {
    width: 300,
    height: 200,
    justifyContent: 'center',
    marginRight: 10,
  },
  sliderImage: {
    width: '100%',
    height: '100%',
  },
  menuContainer: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    marginBottom: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    textAlign: 'center',
    padding: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuButton: {
    width: '100%',
  },
  gameStackButtonContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  gameStackButton: {
    // Estilo para el botón "Game Stack"
  },
  bestSellersTitle: {
    fontSize: 27,
  },
  lastestReleasesTitle: {
    fontSize: 27,
  },
  cardContainer: {
    marginHorizontal: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width:'100%',
  },
});

export default Landing;