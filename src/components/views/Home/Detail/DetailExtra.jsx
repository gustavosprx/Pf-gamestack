import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
} from 'react-native';

import HTML from 'react-native-render-html';
// import MaterialCommunityIcons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useEffect, useContext } from 'react';

import { ThemeContext } from '../../../utils/theme/ThemeProvider';
import { LanguajeContext } from '../../../utils/languaje/languajeProvider';

const CardExtra = (videogame) => {
  // const {requeriments_en}=videogame.propExtra;
  const windowWidth = useWindowDimensions().width;

  //linea para setear el modo dark
  const { StringsDark } = useContext(ThemeContext);
  //linea para setear el lenguaje /obtener palabras de lenguaje
  const { StringsLanguaje } = useContext(LanguajeContext);

  // useEffect(()=>{

  //  navigation.setOptions({

  //      headerTitle: `${StringsLanguaje.Welcome}`,
  //      headerTintColor:  StringsDark.Titulo_Screen,
  //      headerStyle: {
  //        backgroundColor: StringsDark.Titulo_Screen_fondo,
  //      },
  //    })
  // },[isDarkMode,locale])

  let Req = videogame.propExtra.requeriments_en;
  
  const tagsStyles = {
    p: { color: StringsDark.text, fontSize: 30 },
    strong: { fontWeight: 'bold', color: StringsDark.tit_det_extra },
    a: {
      color: StringsDark.link,
      fontSize: 15,
      textDecorationLine: 'underline',
    },
    li: { color: StringsDark.text, fontSize: 13 }, //textp viñeta
    ul: { color: StringsDark.viñeta, fontSize: 20 }, //viñeta
  };

  const getIconName = (item) => {
    let iconName = 'help-circle-outline'; // Icono por defecto

    if (item.length >= 3) {
      const platformPrefix = item.substring(0, 2).toLowerCase();
      // console.log("platformPrefix",item)
      // Asigna el nombre del icono en función de las tres primeras letras
      if (platformPrefix === 'pl') {
        iconName = 'sony-playstation';
      } else if (platformPrefix === 'xb') {
        iconName = 'microsoft-xbox';
      } else if (platformPrefix === 'ni') {
        iconName = 'nintendo-switch';
      } else if (platformPrefix === 'pc') {
        iconName = 'microsoft-windows';
      } else if (platformPrefix === 'ma') {
        iconName = 'apple-ios';
      } else if (platformPrefix === 'an') {
        iconName = 'android';
      } else if (platformPrefix === 'li') {
        iconName = 'penguin';
      }
    }

    return iconName;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View
        style={[
          styles.Container,
          { backgroundColor: StringsDark.Titulo_Screen_fondo },
        ]}
      >

        {Req.length > 0 && (
          <Text style={[styles.reqtitle, { color: StringsDark.tit_det_extra }]}>
            {/* {StringsLanguaje.systemRequeriments} */}
            {"System Requeriments"}

          </Text>
        )}
      {typeof(Req)==='string' &&
        <View style={styles.htmlContainer}>
        <HTML
          source={{ html: Req }}
          contentWidth={windowWidth}
          tagsStyles={tagsStyles}
        />
      </View>
      }
        {Req.length > 0 && typeof(Req)==='object' && (
          <View>
            {Req.map((item, index) => (
              <View key={index} style={styles.htmlContainer}>
                <HTML
                  source={{ html: item.minimum }}
                  contentWidth={windowWidth}
                  tagsStyles={tagsStyles}
                />

                {item.recommended && (
                  <HTML
                    source={{ html: item.recommended }}
                    contentWidth={windowWidth}
                    tagsStyles={tagsStyles}
                  />
                )}
              </View>
            ))}
          </View>
        )}
        <View>
          {videogame.propExtra.platforms.length > 0 && (
            <Text
              style={[styles.reqtitle, { color: StringsDark.tit_det_extra }]}
            >
              {/* {StringsLanguaje.Plataformas} */}
              {"Platforms"}
            </Text>
          )}

          {videogame.propExtra.platforms.length > 0 &&
            videogame.propExtra.platforms.map((item, index) => (
              <View key={index}>
                <Text style={[styles.text, { color: StringsDark.text }]}>
                  <MaterialCommunityIcons
                    name={getIconName(item)}
                    size={20}
                    color={StringsDark.cartButton}
                  />
                  &nbsp;{item}
                </Text>
              </View>
            ))}
          {videogame.propExtra.genre.length > 0 && (
            <Text
              style={[styles.reqtitle, { color: StringsDark.tit_det_extra }]}
            >
              {/* {StringsLanguaje.Genres} */}
              {"Genres"}
            </Text>
          )}
          {videogame.propExtra.genre.length > 0 &&
            videogame.propExtra.genre.map((item, index) => (
              <View key={index}>
                <Text style={[styles.text, { color: StringsDark.text }]}>
                  <MaterialCommunityIcons
                    name="tag-text"
                    size={20}
                    color={StringsDark.cartButton}
                  />
                  &nbsp;{item}
                </Text>
              </View>
            ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  Container: {
    margin: 40,
    // marginLeft:50,
    // marginRight: 50,
    // flex: 1,
    // justifyContent: 'space-between',
    // alignItems: 'center',
    width: '90%',
    borderRadius: 8,
  },
  title: {
    marginLeft: 15,
    fontSize: 25,
    fontWeight: '700',
    textAlign: 'left',
    fontWeight: '800',
  },
  text: {
    marginLeft: 15,
    fontSize: 18,
    marginTop: 8,
    fontWeight: '800',
  },
  reqtitle: {
    fontSize: 25,
    fontWeight: 'bold',
    alignItems: 'center',
    alignContent: 'center',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  req: {
    fontSize: 20,
  },
  htmlContainer: {
    
    marginLeft: 10,
    textAlign: 'right',
  },
  iconos: {
    flexDirection: 'row',
  },
});

export default CardExtra;