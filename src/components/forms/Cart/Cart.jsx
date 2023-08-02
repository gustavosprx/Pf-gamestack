import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CardCard from './CardCart';
import { removeItem, cleanCart } from './CardCartController';
import { updateCart } from '../../../redux/cartSlice';

import { useFocusEffect } from '@react-navigation/native';
//linea para llamar a modo DARK
import { ThemeContext } from '../../utils/theme/ThemeProvider';
//linea para modificar el contexto de localizacion para el lenaguje
import { LanguajeContext } from '../../utils/languaje/languajeProvider';

import { getItemAsyncStorage } from '../../forms/Cart/CardCartController';
// import { electron } from 'webpack';

const Cart = ({ navigation }) => {
  const dispatch = useDispatch();
  const cartG = useSelector((state) => state.cartState);
  // console.log("estado q llega del redux", cartG)
  const [Carrito, setCarrito] = useState([]);
  const [total, setTotal] = useState(0);
  //linea para setear el lenguaje /obtener palabras de lenguaje
  const { StringsDark, isDarkMode } = useContext(ThemeContext);
  const { StringsLanguaje, locale } = useContext(LanguajeContext);

  //manejo de usuario logeado
  const [isLogged, setIsLogged] = useState(false);
  const [logginUser, setLoggingUser] = useState('');
  const isLoggedGlobal = useSelector((state) => state.usersState.isLogged);

  let acumulador = 0;
  // esta linea de bede de eliminar

  useEffect(() => {
    // console.log("navigation",navigation.setOptions)
    navigation.setOptions({
      // headerTitle: `${StringsLanguaje.Shopping_Car}`,
      headerTitle: `Shopping Cart`,
      headerTintColor: '#280657',
      headerStyle: {
        backgroundColor: StringsDark.backgroundContainer,
      },
    });
  }, [isDarkMode, locale]);

  useFocusEffect(
    React.useCallback(() => {
      getAllItems();
    }, [cartG])
  );
  useFocusEffect(
    React.useCallback(() => {
      getUserStorage();
      console.log("is logged global",isLoggedGlobal)
    }, [isLoggedGlobal])
    //  [cartG]
  );
  useEffect(() => {
    console.log('entre una vez------------------->');
    removeItem('EXPO_CONSTANTS_INSTALLATION_ID');
    getAllItems();
  }, []);

  useEffect(() => {
    // console.log("entro xq me llama Carrito")
    Carrito.forEach((el) => {
      if (el && el.value && el.value.price) {
        const calculos = Number(el.value.price) * Number(el.value.amount);
        acumulador += calculos;
      }
    });

    setTotal(acumulador);
  }, [Carrito]);

  const AlertItem = () => {
    Alert.alert(
      // StringsLanguaje.MsgAlertTitle,
      'Are you sure you want to clean the Cart?',
      '',
      [
        {
          text: 'Cancel',//StringsLanguaje.optCancel,
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => handlePress(),
        },
      ],
      { cancelable: false }
    );
  };

  const getUserStorage = async () => {
    try {
      const LoggedUserJSON = await getItemAsyncStorage('logedGameStack');
      console.log('variable LoggedUserJSON menu ITEMS->', LoggedUserJSON);
      if (LoggedUserJSON !== 'vacio') {
        setLoggingUser(LoggedUserJSON);
        setIsLogged(true);
         console.log("Usuario Cargado correctamente menu ITEMS name->", logginUser.fullname);
      } else {
        setLoggingUser('vacio');
        setIsLogged(false);
      }
    } catch (error) {
      console.log('Error al obtener la clave de  logedGameStack:', error);
    }
  };
  const handlePress = async () => {
    await cleanCart();
    setCarrito([]); // Actualiza el estado de Carrito para que esté vacío
    dispatch(updateCart());
  };
  // console.log('logginUser', Carrito);

  const handlePasarellaPress = () => {
    const proceedWithPurchase = () => {
      if (isLogged) {
        const itemsCart = Carrito.map((el) => {
          return {
            videogameId: el.value.id,
            videogameName: el.value.title,
            unitPrice: el.value.price,
            quantity: el.value.amount.toFixed(2),
          };
        });
        // const items = [{ videogameId: 3498, videogameName: "Grand Theft Auto V", unitPrice: 20, quantity: 2 }]
        navigation.navigate('Pasarella', {
          Cart: itemsCart,
          tot: total,
          userid: logginUser.id,
          // username:logginUser.name
        });
      } else {
        alert('Login Registration is required\nYou are being redirected to Login...');

        navigation.navigate('Login');
      }
    };

    Alert.alert(
      'Proceed to checkout',
      '',
      [
        {
          text: 'Cancel',//StringsLanguaje.optCancel,
          onPress: () => console.log('Cancel Pressed'),
          style: 'Cancel',
        },
        {
          text: 'OK',
          onPress: proceedWithPurchase,
        },
      ],
      { cancelable: false }
    );
  };

  const getAllItems = () => {
    AsyncStorage.getAllKeys((error, keys) => {
      if (error) {
        console.log('Error al obtener las claves de AsyncStorage:', error);
        return;
      }

      const filteredKeys = keys.filter((el) => el.substring(0, 4) === 'cart');
      // console.log('Claves filtradas del carrito:', filteredKeys);

      AsyncStorage.multiGet(filteredKeys, (error, items) => {
        if (error) {
          console.log('Error al obtener los elementos de AsyncStorage:', error);
          return;
        }

        const result = items.map(([key, value]) => {
          let parsedValue;
          try {
            parsedValue = JSON.parse(value);
          } catch (error) {
            console.log(
              `Error al analizar el valor para la clave ${key}:`,
              error
            );
            parsedValue = null;
          }
          return { key, value: parsedValue };
        });

        setCarrito(result);
      });
    });
  };

  // console.log('Usuario actual ----->', logginUser.id);
  // console.log('carrito actual ----->', Carrito);
  // console.log('Total actual ----->', total);
  if (Carrito.length < 1) {
    return (
      <View
        style={[
          styles.emptyCartContainer,
          { backgroundColor: StringsDark.btnPagar },
        ]}
      >
        <Text style={[styles.emptyCart, { color: StringsDark.srchBartxt }]}>
          {/* {StringsLanguaje.emptycar} */}
          Your Cart is Empty
        </Text>

        <TouchableOpacity
          onPress={() => navigation.navigate('HomeStack')}
          style={[styles.clearCart, { backgroundColor: StringsDark.txtClaro }]}
        >
          <Text style={[styles.clearCartText, { color: StringsDark.text }]}>
            {/* {StringsLanguaje.Home} */}
            Go Gome
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  // console.log("longitus de carrito", Carrito)
  return (
    <ScrollView
      style={[
        styles.cartContainer,
        { backgroundColor: StringsDark.tabInactive },
      ]}
    >
      <View>
        {/* <Text style={[styles.cartSubTitle, { color: StringsDark.text }]}>
          {isLogged ? `${logginUser.fullname}` : StringsLanguaje.CartValidate}
        </Text> */}
        <Text style={[styles.cartTitle, { color: StringsDark.text }]}>
          {/* {StringsLanguaje.youtCart} */}
          Your Basket
        </Text>
      </View>
      <View style={{ backgroundColor: StringsDark.bktitle }}>
        {Carrito.map((el) => {
          // console.log("keyyy", el.key);
          return <CardCard key={el.key} llave={el.key} item={el.value} />;
        })}
      </View>
      <View style={[styles.cartTotal, { borderColor: StringsDark.txtprice }]}>
        <Text style={[styles.cartTotalTitle, { color: StringsDark.text }]}>
          Total
        </Text>
        <Text style={[styles.cartTotalPrice, { color: StringsDark.text }]}>
          U$S {total.toFixed(2)}
        </Text>
      </View>
      <TouchableOpacity
        onPress={AlertItem}
        style={[styles.clearCart, { backgroundColor: '#E94E4E' }]}
      >
        <Text style={[styles.clearCartText, { color: '#ffffff' }]}>
          {/* {StringsLanguaje.clCart} */}
          Clear Basket
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handlePasarellaPress}
        style={[styles.chkOutCart, { backgroundColor: '#496BFF' }]}
      >
        <Text style={[styles.clearCartText, { color: '#ffffff' }]}>
          {/* {StringsLanguaje.chkOut} */}
          Pay
        </Text>
      </TouchableOpacity>
      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  cartContainer: {},
  emptyCartContainer: {},
  cartItems: {
    // backgroundColor: color_azul
  },
  cartTotal: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 20,
    borderTopWidth: 1,
  },
  cartTotalPrice: {
    // color: color_azul,
    fontSize: 20,
    fontWeight: 'bold',
  },
  cartTotalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  clearCart: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'coral',
    padding: 10,
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 5,
    marginHorizontal: 20,
  },
  chkOutCart: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 10,
    marginTop: 5,
    marginBottom: 5,
    marginHorizontal: 20,
  },
  clearCartText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  cartTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  cartSubTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginVertical: 10,
  },
  emptyCartContainer: {
    width: '100%',
    height: '50%',
  },
  emptyCart: {
    margin: '20%',
    // marginBottom: '80%',
    // marginTop: '80%',
    // alignContent:'center',
    // alignItems:'center',
    // alignItems:'center',
    // textAlign:'center',
    fontSize: 25,
    fontWeight: 'bold',
  },
});

export default Cart;
