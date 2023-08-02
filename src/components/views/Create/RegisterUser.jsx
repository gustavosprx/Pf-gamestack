  import React, { useState, useEffect } from "react";
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Formik } from "formik";
import Checkbox from "expo-checkbox";
import { uploadImageAsync } from "../../helpers/uploadImage";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { convertirFecha } from "../../helpers/InvertDate";
import imageUser from "../../../../assets/imageUser.png";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import {
  color_gris_c,
  color_morado_o,
  color_celeste,
  color_morado_c2,
  color_gris_595959,
  color_gris_dadada,
  color_morado_sc1,
  color_rojo,
  color_gris_cdcdcd,
} from "../../utils/theme/stringsColors";
import * as Google from 'expo-auth-session/providers/google'
import axios from "axios";
import Purchase from "../Purchase/Purchase"; // Aca se importa el componente Purchase

const Register = ({ navigation }) => {

  //AUTH GOOGLE// 

  const [accessToken, setAccessToken] = useState()
  const [userInfo, setUserInfo] = useState();
  const [showPassword, setShowPassword] = useState(false);
  const [request,response,promptAsync] = Google.useAuthRequest({
    androidClientId:"992202978342-to1fhbb86o68n536dsijlaiiedsruv8g.apps.googleusercontent.com",
    iosClientId:"992202978342-to1fhbb86o68n536dsijlaiiedsruv8g.apps.googleusercontent.com",
    expoClientId:"992202978342-r97fm6970n55pdn6jsu5s2h8tme07qbe.apps.googleusercontent.com"
  })

  useEffect(()=>{
    if(response?.type === "success"){
      setAccessToken(response.authentication.accessToken)

     }
  },[response])

  useEffect(() => {
    if (accessToken) {
      getUserData();
    }
  }, [accessToken]);


  const getUserData = async  () => {
    let userInfoResponse = await fetch("https://www.googleapis.com/userinfo/v2/me",
    { headers: {Authorization: `Bearer ${accessToken}`}})

      await userInfoResponse.json().then(data => {
      setUserInfo(data)
    })

  }


  const showUserData = () => {

    if(userInfo) {
      return (
        <View style={styles.userInfo}>
          <Image source={{ uri: userInfo.picture}} style ={styles.profilePic}/>
          <Text>welcome {userInfo.name}</Text>
          <Text> {userInfo.email}</Text>

        </View>
      )
    }
  }

  // ----------- FIN AUTH GOOGLE ------



  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [acceptTac, setAcceptTac] = useState(false);
  const [receibenewsLetter, setReceivenewsLetter] = useState(false);
  const [image, setImage] = useState('https://res.cloudinary.com/deamondhero/image/upload/v1690180824/imageUser_g1mimk.png');
  const [showPurchase, setShowPurchase] = useState(false); // Variable de estado para mostrar el componente Purchase

  useEffect(() => {
    convertirFecha();
  }, [date]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: false,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.5,
    });

    console.log(result);

    if (!result.canceled) {
      const arrLks = [];
      // const arrView = []
      const uploadedImages = await Promise.all(
        result.assets.map(async (image) => {
          let imageUrl = await uploadImageAsync(image.uri);

          // arrView.push(image.uri)
          arrLks.push(imageUrl);

          console.log(`3-----${arrLks}`);
          // return arrImg
        })
      );

      setImage(arrLks[0]);
      console.log(`4-----${image}`);
      console.log(`46-----${arrLks}`);
      return arrLks;
    }
  };



  const onSubmit = async (values) => {
    const userData = {
      ...values,
      tac: acceptTac,
      newsLetter: receibenewsLetter,
      id: 1 + Math.floor(Math.random() * 999),
      userAdmin: true,
      image: image,
      date: date,
    };



    console.log(`Antes del try ${userData}`);

    try {
      console.log(`Después del try ${userData}`);

      const response = await axios.post(
        "https://pfvideojuegos-back-production.up.railway.app/user",
        {
          user: userData.user,
          password: userData.password,
          fullname: userData.fullname,
          email: userData.email,
          date: userData.date,
          phone: userData.phone,
          tac: userData.tac,
          newsLetter: userData.newsLetter,
          id: userData.id,
          userAdmin: userData.userAdmin,
          image: userData.image,
        }
      );
      console.log(`Respuesta del servidor:`, response.data);
      

      const emailResponse = await axios.post(
        "https://pfvideojuegos-back-production.up.railway.app/correo-registro",

        {
          correo: userData.email,
          user: userData.user,
          fullname: userData.fullname,
        }
      );
      console.log(`Respuesta del servidor:`, emailResponse.data);

      Alert.alert("User Created!", "", [
        {
          text: "Go to login",
          onPress: () => navigation.navigate("RenderLogin", { name: "RenderLogin" }),
        },
      ]);

      // Mostrar el componente Purchase después de un registro exitoso
      setShowPurchase(true);
    } catch (error) {
      console.log("Error en el backend:", error);
      Alert.alert("Auch...Something went wrong");
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const showDatePicker = () => {
    setShowPicker(true);
  };

  return (
    <ScrollView>
      <View style={[styles.bgCont]}>
        <TouchableOpacity onPress={pickImage} style={[styles.ImageButton]}>
          <Image
            source={{  uri: image}}
            style={{ margin: 5, width: 200, height: 200, borderRadius:125}}
          />
        </TouchableOpacity>
      </View>

      <Formik
        initialValues={{
          user: "",
          password: "",
          fullname: "",
          email: "",
          phone: "",
        }}
        validate={(values) => {
          let errors = {};
          if (!values.user) {
            errors.user = "Please enter a user";
          }
          if (!values.password) {
            errors.password = "Please enter a password";
          }
          if (!values.fullname) {
            errors.fullname = "Please enter your full name";
          }
          if (!values.email) {
            errors.email = "Please enter your email address";
          } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
            errors.email = "Please enter a valid email address";
          }

          if (!values.phone) {
            errors.phone = "Please enter your phone number";
          }

          return errors;
        }}
        image={image}
        onSubmit={onSubmit}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          image,
        }) => (
          <View style={[]}>
            <View style={[styles.container]}>
              <View style={[styles.containerLogin]}>
                <View>
                  <Text style={styles.title}>User</Text>
                  <TextInput
                    style={[styles.input, ,]}
                    value={values.user}
                    placeholder="User"
                    onChangeText={handleChange("user")}
                    onBlur={handleBlur("user")}
                  />
                  {errors.user && touched.user && (
                    <Text style={styles.error}>{errors.user}</Text>
                  )}
                </View>
                    {showUserData()}
                <View>
                  <Text style={styles.title}>Password</Text>
                  <TextInput
                    style={styles.input}
                    value={values.password}
                    placeholder="Password"
                    secureTextEntry={!showPassword}
                    onChangeText={handleChange("password")}
                    onBlur={handleBlur("password")}
                  />
                                  <TouchableOpacity
                  style={styles.button}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <MaterialCommunityIcons
                    name={showPassword ? "eye" : "eye-off"}
                    size={20}
                    color="#000"
                    style={{marginTop:-40, left:260, padding:10}}
                  />
                </TouchableOpacity>
                  {errors.password && touched.password && (
                    <Text style={styles.error}>{errors.password}</Text>
                  )}
                </View>

                <View>
                  <Text style={styles.title}>Fullname</Text>
                  <TextInput
                    style={[styles.input]}
                    value={values.fullname}
                    placeholder="Full Name"
                    onChangeText={handleChange("fullname")}
                    onBlur={handleBlur("fullname")}
                  />
                  {errors.fullname && touched.fullname && (
                    <Text style={styles.error}>{errors.fullname}</Text>
                  )}
                </View>

                <View>
                  <Text style={styles.title}>Email</Text>
                  <TextInput
                    style={[styles.input]}
                    value={values.email}
                    placeholder="Email"
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                  />
                  {errors.email && touched.email && (
                    <Text style={styles.error}>{errors.email}</Text>
                  )}
                </View>

                <View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.title}>Birthdate</Text>
                    <View style={{ flex: 1 }}>
                      <TouchableOpacity
                        onPress={showDatePicker}
                        style={[styles.dateButton]}
                      >
                        <Text style={styles.buttonTextDate}>
                          {!date
                            ? "Insert date of birth "
                            : convertirFecha(date)}
                        </Text>
                      </TouchableOpacity>
                      {showPicker && (
                        <DateTimePicker
                          value={date}
                          onChange={handleDateChange}
                          mode="date"
                          display="spinner"
                          textColor="red"
                          style={{ flex: 1 }}
                        />
                      )}
                    </View>
                  </View>
                </View>

                <View>
                  <Text style={styles.title}>Phone</Text>
                  <TextInput
                    style={[styles.input]}
                    value={values.phone}
                    placeholder="Phone"
                    onChangeText={handleChange("phone")}
                    onBlur={handleBlur("phone")}
                  />
                  {errors.phone && touched.phone && (
                    <Text style={styles.error}>{errors.phone}</Text>
                  )}
                </View>

                <View style={styles.boxcontainercheckbox}>
                  <View style={styles.checkboxSection}>
                    <Checkbox
                      style={[styles.checkbox]}
                      value={acceptTac}
                      onValueChange={setAcceptTac}
                    />
                    <Text style={[styles.checkboxParagraph]}>
                      I accept the Terms and Conditions
                    </Text>
                  </View>

                  <View style={styles.checkboxSection}>
                    <Checkbox
                      style={[styles.checkbox]}
                      value={receibenewsLetter}
                      onValueChange={setReceivenewsLetter}
                    />
                    <Text style={[styles.checkboxParagraph]}>
                      I want to receive the newsLetter
                    </Text>
                  </View>
                </View>
              </View>

              <View>
                <TouchableOpacity
                  style={[styles.miniButton]}
                  onPress={handleSubmit}
                >
                  <Text style={[styles.buttonText]}>Register</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Formik>

      {/* Mostrar el componente Purchase si showPurchase es true */}
      {showPurchase && <Purchase />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  /////
  header: {
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: color_gris_c,
    width: "100%",
  },

  title: {
    marginTop:16,
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    color: color_morado_o,
    width: "100%",
  },

  bgCont: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color_gris_c,
  },

  container: {
    marginTop: 0,
    backgroundColor: color_gris_c,
    alignItems: "center",
    padding: 8,
  },

  containerLogin: {
    width: 340,
    padding: 10,
  },

  input: {
    textAlign: "center",
    height: 42,
    width: 315,
    borderColor: color_gris_c,
    backgroundColor: color_gris_dadada,
    borderRadius: 8,
  },

  ImageButton: {
    marginTop: 16,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    width: 200,
    height: 200,
    backgroundColor: color_morado_o,
    borderRadius: 125,
  },
  miniButton: {
    marginTop: 15,
    marginBottom: 32,
    height: 42,
    width: 315,
    padding: 0,
    backgroundColor: color_morado_sc1,
    borderRadius: 5,
  },
  dateButton: {
    height: 42,
    width: 315,
    padding: 0,
    backgroundColor: color_gris_dadada,
    borderRadius: 5,
  },
  buttonTextDate: {
    textAlign: "center",
    padding: 10,
    fontSize: 14,
    fontWeight: "600",
    color: color_gris_cdcdcd,
  },
  error: {
    textAlign: "center",
    fontSize: 14,
    color: color_rojo,
    fontWeight: "bold",
  },
  buttonText: {
    textAlign: "center",
    padding: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: color_gris_c,
  },

  boxcontainercheckbox: {
    flex: 1,
    marginTop: 16,
    alignItems: "flex-start",
  },

  checkboxSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkboxParagraph: {
    color: color_gris_595959,
    fontSize: 14,
  },
  checkbox: {
    margin: 8,
  },
});

export default Register;
