import {
  View,
  StyleSheet,
  Button,
  Alert,
  Image,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
} from "react-native";

import { CardField, useConfirmPayment } from "@stripe/stripe-react-native";
import { removeItem, cleanCart } from "./CardCartController";
import { useDispatch } from "react-redux";
import { updateCart } from "../../../redux/cartSlice";
//linea para llamar a modo DARK
import { ThemeContext } from "../../utils/theme/ThemeProvider";
//linea para modificar el contexto de localizacion para el lenaguje
import { LanguajeContext } from "../../utils/languaje/languajeProvider";
import React, { useEffect, useState, useContext, useRef } from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
const Pasarella = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const { StringsDark, isDarkMode } = useContext(ThemeContext);
  const { StringsLanguaje, locale } = useContext(LanguajeContext);
  const { Cart, tot, userid } = route.params;
  const cardFieldRef = useRef(null);
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  const closeModalAndPerformActions = () => {
    // Cerrar el modal
    setModalVisible(false);
    // Realizar las acciones necesarias
    cleanCart(); // Limpia el carrito
    dispatch(updateCart()); // Actualiza el estado del carrito en el Redux store
    navigation.navigate("HomeStack"); // Navega a la pantalla 'HomeStack'
  };

  useEffect(() => {
    // console.log("esta entrando ?")
    navigation.setOptions({
      headerTitle: "Payment Gateway", //`${StringsLanguaje.Pasarella}`,
      headerTintColor: "#280657",
      headerStyle: {
        backgroundColor: StringsDark.backgroundContainer,
      },
    });
  }, [isDarkMode, locale]);

  if (isNaN(tot)) {
    console.log("tot no es un número válido");
  } else {
    // Convertir tot a un número válido con dos decimales
    const amountfx = (Number(tot) * 100).toFixed(0);
    // console.log('precioVenta', amountfx);
    var datos = {
      items: Cart,
      amount: amountfx,
      userId: userid,
    };

    // console.log("Datos:", datos);
  }
  const [cardDetails, setCardDetails] = useState();
  const { confirmPayment, loading } = useConfirmPayment();

  // Función para formatear el número de tarjeta
  // const formatCardNumber = (cardNumber) => {
  //   // Si no hay detalles de la tarjeta, no se muestra nada
  //   if (!cardNumber) return '';

  //   const visibleDigits = cardNumber.number.slice(0, -4);
  //   const hiddenDigits = '****';

  //   return `${visibleDigits}${hiddenDigits}`;
  // };

  const subscribe = async () => {
    try {
      const response = await fetch(
        "https://pfvideojuegos-back-production.up.railway.app/pay",
        {
          method: "POST",
          body: JSON.stringify({ datos }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      // console.log("lo que hay en data",data)

      if (!response.ok) return Alert.alert(data.message);
      const clientSecret = data.clientSecret;

      const { paymentIntent, error } = await confirmPayment(clientSecret, {
        paymentMethodType: "Card",
      });
      if (error) {
        alert(`Payment Confirmation Error ${error.message}`);
      } else if (paymentIntent) {
        const itemsFormat = JSON.stringify(datos.items);
        console.log("items formateados----> " + itemsFormat);
        try {
          const response = await fetch(
            "https://pfvideojuegos-back-production.up.railway.app/createSale",
            {
              method: "POST",
              body: JSON.stringify({
                paymentId: paymentIntent.id,
                amount: datos.amount,
                items: itemsFormat,
                userId: userid,
              }),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const data = await response.json();
          // console.log('aqui q hay', data.message);

          if (data.message === "ok") {
            console.log("esto hay en este estado", cardDetails);
            setModalVisible(true);
          } else {
            alert(
              "It was not possible to complete the purchase, the payment has been refunded."
            );
          }
        } catch (error) {
          alert(`Payment Confirmation Error ${error.message}`);
        }

        if (cardFieldRef.current) {
          cardFieldRef.current.clear(); // Limpia el contenido del CardField
        }
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Something went wrong, try again later!");
    }
  };
  // console.log("esto hay en datos", datos);
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: StringsDark.backgroundContainer },
      ]}
    >
      <View>
        <Image
          style={styles.logogameStack}
          source={require("../../../../assets/logoLigth.png")}
        ></Image>
      </View>
      <View>
        <Image
          style={styles.logoStripe}
          source={require("../../../../assets/stripe.png")}
        ></Image>
      </View>
      <CardField
        ref={cardFieldRef}
        postalCodeEnabled={true}
        placeholder={{
          number: "4242 4242 4242 4242",
        }}
        cardStyle={[styles.card, { backgroundColor: StringsDark.txtprice }]}
        style={styles.cardContainer}
        onCardChange={(cardDetails) => {
          setCardDetails(cardDetails);
        }}
      />

      <Button
        onPress={subscribe}
        title="Checkout" //{StringsLanguaje.chkOut}
        disabled={loading}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View
            style={[
              styles.modalView,
              { shadowColor: "#3F13A4" },
              { backgroundColor: "#ffffff" },
            ]}
          >
            <View style={[styles.p1, { borderColor: "#6B35E8" }]}>
              <MaterialCommunityIcons
                name={"credit-card-check-outline"}
                size={40}
                color={"#3F13A4"}
              />
              <Text style={[styles.modalText, { color: "#6B35E8" }]}>
                Congratulations
              </Text>
              <Text style={[styles.modalText, { color: "#6B35E8" }]}>
                Payment Accepted !!!
              </Text>
            </View>

            <View style={[styles.p2, { borderColor: "#6B35E8" }]}>
              <Text style={[styles.m_titulos, { color: "#6B35E8" }]}>
                Transaction Details
              </Text>
              <Text style={[styles.m_Subtitulos, { color: "#987BDC" }]}>
                Order Number: 12345
              </Text>
              <Text style={[styles.m_Subtitulos, { color: "#987BDC" }]}>
                Date and time: {currentDate} {currentTime}
              </Text>
              {/* <Text style={[styles.m_Subtitulos, { color: "#987BDC" }]}>
                User: {datos && datos.userId ? datos.userId : "en desarrollo"}
              </Text> */}
            </View>
            <View style={[styles.p2, { borderColor: "#6B35E8" }]}>
              <Text style={[styles.m_titulos, { color: "#6B35E8" }]}>
                Card Details and Amount
              </Text>
              <Text style={[styles.m_Subtitulos, { color: "#987BDC" }]}>
                Number: **** **** ****{" "}
                {cardDetails && cardDetails.last4 ? cardDetails.last4 : ""}
              </Text>
              <Text style={[styles.m_Subtitulos, { color: "#987BDC" }]}>
                Card:
                {cardDetails && cardDetails.brand ? cardDetails.brand : ""}
              </Text>
              <Text style={[styles.m_Subtitulos, { color: "#987BDC" }]}>
                Import: {datos.amount && (datos.amount / 100).toFixed(2)}
              </Text>
              <Text style={[styles.m_Subtitulos, { color: "#987BDC" }]}>
                Currency: Dollar
              </Text>
            </View>
            <View style={[styles.p2, { borderColor: "#6B35E8" }]}>
              <Text style={[styles.m_titulos, { color: "#6B35E8" }]}>
                Products Detail
              </Text>
              {datos && (
  <View>
    <View style={{ flexDirection: "row" }}>
      <Text style={[styles.m_Subtitulos_i, { color: "#987BDC" }, { marginLeft: 20 }]}>
        Name
      </Text>
      <Text style={[styles.m_Subtitulos_i, { color: "#987BDC" }, { marginLeft: 50 }]}>
        Price
      </Text>
      <Text style={[styles.m_Subtitulos_i, { color: "#987BDC" }, { marginLeft: 50 }]}>
        Quantity
      </Text>
    </View>
    {datos.items.map((item) => (
      <View key={item.id} style={{ flexDirection: "row" }}>
        <Text
          style={[styles.m_Subtitulos_i_1, { color: "#6B35E8" }]}
        >
          {item.videogameName.substring(0, 20)}
        </Text>
        <Text
          style={[
            styles.m_Subtitulos_i_1,
            { color: "#6B35E8" },
            { marginLeft: 15 },
          ]}
        >
          $ {item.unitPrice}
        </Text>
        <Text
          style={[
            styles.m_Subtitulos_i_1,
            { color: "#6B35E8" },
            // { marginLeft: 10 },
          ]}
        >
          {item.quantity}
        </Text>
      </View>
    ))}
  </View>
)}

              {/* <Text style={[styles.m_Subtitulos, { color: '#987BDC' }]}>
                Date and time of the Operation:
              </Text> */}
              <Text style={[styles.m_Subtitulos, { color: "#987BDC" }]}>
                Total: $ {datos.amount && (datos.amount / 100).toFixed(2)}
              </Text>
            </View>
            <TouchableOpacity onPress={() => closeModalAndPerformActions()}>
              <Text
                style={[
                  styles.closeButton,
                  { backgroundColor: "#3F13A4" },
                  { color: "#ffffff" },
                ]}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    margin: 20,
    borderRadius: 8,
  },
  input: {
    backgroundColor: "#efefefef",

    borderRadius: 8,
    fontSize: 20,
    height: 50,
    padding: 10,
  },
  logogameStack: {
    width: "90%",
    alignSelf: "center",
    resizeMode: "contain",
  },
  logoStripe: {
    marginTop: 10,
    width: 400,
    height: 200,
    alignSelf: "center",
    resizeMode: "contain",
  },
  card: {
    // backgroundColor: "green",
  },
  cardContainer: {
    height: 100,
    marginVertical: 30,
  },
  botonPago: {
    fontSize: 45,
    fontWeight: "bold",
  },
  modalContainer: {
    width: "100%",
    height: "40%",
    top: 50,
    left: 150,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,

    borderRadius: 20,
    padding: 35,
    alignItems: "center",

    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },

  closeButton: {
    marginTop: 10,
    width: 150,
    height: 41,
    borderRadius: 10,
    alignItems: "center",
    alignContent: "center",
    textAlign: "center",
  },
  modalContent: {
    marginTop: 10,
    alignItems: "center",
  },
  separator: {
    height: 2,
    backgroundColor: "red",
    marginVertical: 10,
  },
  p1: {
    alignContent: "center",
    alignItems: "center",
    margin: 5,
    borderBottomWidth: 2,

    width: 250,
  },
  p2: {
    width: 250,
    margin: 5,
    borderBottomWidth: 2,
  },
  m_titulos: {
    textAlign: "left",
    fontSize: 18,
    fontWeight: "bold",
  },
  m_Subtitulos: {
    textAlign: "auto",
    fontSize: 14,
    fontWeight: "400",
    margin: 5,
  },
  m_Subtitulos_i: {
    // textAlign: 'auto',
    fontSize: 13,
    fontWeight: "400",
    margin: 5,
  },
  m_Subtitulos_i_1: {
    fontSize: 11,
    fontWeight: "400",
    // margin: 5,
    width: 100,
    height: 30,
  },
});

export default Pasarella;
