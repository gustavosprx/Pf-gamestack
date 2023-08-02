import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

import MenuBottonItem from "./MenuButton";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { LanguajeContext } from "../../utils/languaje/languajeProvider";
import { ThemeContext } from "../../utils/theme/ThemeProvider";
import { ChangeButtonContext } from "../../utils/changeContextButton/ChangeContextButton";
import { useContext } from "react";
import MenuButtonSubItem from "./MenuButtonSubItem";
import { useSelector } from "react-redux";

const MenuItems = ({ navigation }) => {
  //esta linea debo de llamar en cada componente
  const { StringsDark } = useContext(ThemeContext);
  const { StringsLanguaje } = useContext(LanguajeContext);
  const loged = useSelector((state) => state.usersState.isLogged);

  return (
    <DrawerContentScrollView
      style={{ backgroundColor: StringsDark.menuDrawner_f }}
    >
      <View style={{ backgroundColor: StringsDark.menuDrawner_c }}>
        <View style={styles.cabeceraimg}>
          <TouchableOpacity onPress={() => navigation.navigate("UserProfile")} >
          <Image
            source={loged.image ? {uri:loged.image} : require("../../../../assets/imageUser.png")}
            style={styles.imgmenu}
          />
          </TouchableOpacity>
        </View>
        <View style={styles.cabeceraText}>
          <Text
            style={[styles.textoUsr, { color: StringsDark.menuDrawner_t }]}
          >{loged.user ? loged.user : "Welcome"}</Text>
        </View>
        <View
          style={[
            styles.separator,
            { borderColor: StringsDark.menuDrawner_sep },
          ]}
        ></View>
      </View>
      <MenuBottonItem
        // nombre={StringsLanguaje.Landing}
        nombre={"Landing"}
        onPress={() => navigation.navigate("Landing")}
        icon="airplane-landing"
      />
      <MenuBottonItem
        // nombre={StringsLanguaje.Home}
        nombre={"Home"}
        onPress={() => navigation.navigate("HomeStack")}
        icon="home-circle-outline"
      />
      <MenuBottonItem
        // nombre={StringsLanguaje.Shopping_Car}
       nombre={"Shopping Cart"}
        onPress={() => navigation.navigate("Cart")}
        icon="cart-variant"
      />
      <MenuBottonItem
        // nombre={StringsLanguaje.CreateVideogame}
        nombre={"Game Creation"}
        onPress={() => navigation.navigate("CreateVideogame")}
        icon="gamepad-variant-outline"
      />
      <MenuBottonItem
        // nombre={StringsLanguaje.Login}
        nombre={loged ? "Logout": "Login"}
        onPress={() => navigation.navigate("RenderLogin")}
        icon={loged ? "logout" : "login"}
      />
      {/* {loged.user&&<MenuBottonItem
        // nombre={StringsLanguaje.Login}
        nombre={"DashBoard"}
        // onPress={() => navigation.navigate("Login")}
        icon="view-dashboard"
      />} */}
      {loged.user&&<MenuBottonItem
              nombre= {'User Profile'}
              onPress={()=> navigation.navigate('UserProfile')}
              icon="account-eye-outline"
            />}
{      !loged.user && <MenuBottonItem
        // nombre={StringsLanguaje.Login}
        nombre={"Register"}
        onPress={() => navigation.navigate("Register")}
        icon="account-plus"
      />}
      {/* Botones para cambiar el modoDark o Idioma */}
      <ChangeButtonContext
        name={
          "DarkMode"
          // StringsLanguaje.DarkMode
        }
        tipo={"theme"}
      />
      <ChangeButtonContext
        name={
          "Language Change"
          // StringsLanguaje.Languaje
        }
        tipo={"Languaje"}
      />
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  cabeceraimg: {
    flexDirection: "row",
    // alignContent: 'space-between',
    alignItems: "center",
    alignContent: "space-around",
  },
  imgmenu: {
    marginLeft: 20,
    padding: 20,
    width: 120,
    height: 80,
    // justifyContent: '',

    resizeMode: "contain",
  },
  icon: {
    marginLeft: 70,
    width: 50,
    height: 50,
    // alignContent: 'flex-end',
    // alignItems: '',
    resizeMode: "contain",
    borderRadius: 100,
  },
  cabeceraText: {
    alignContent: "center",
    alignItems: "center",
  },
  btnIngresa: {
    margin: 3,
    width: 150,
    height: 40,
    // backgroundColor: color_blanco,
    borderRadius: 10,
    // color: color_crema,
    fontWeight: "bold",
    fontSize: 22,
    textAlign: "center",
  },
  textoUsr: {
    fontSize: 13,
    // color:color_blanco,
  },

  separator: {
    // marginVertical: 30,
    // height: 0,
    width: "100%",
    marginTop: 5,
    //  borderColor:'red',
    borderWidth: 2,
    // color: color_negro,
  },
});
export default MenuItems;
