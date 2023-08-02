import {
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  View,
  TextInput,
  Button
} from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import * as Google from 'expo-auth-session/providers/google'



import {
  color_gris_c,
  color_morado_o,
  color_celeste,
  color_morado_c2,
  color_gris_595959,
  color_gris_cdcdcd,
  color_gris_dadada,
} from "../../utils/theme/stringsColors";

// import { persons } from "../../../utils/arrayPersons";
import { Formik } from "formik";
import { useState, useEffect } from "react";
import loginService from "../../../services/login";
import { useDispatch, useSelector } from "react-redux";
import {
  saveItemAsyncStorage,
  loadItemAsyncStorage,
  removeItemAsyncStorage,
  showAsyncStorageData,
} from "../../helpers/functionsAsyncStorage";
import imageUser from "../../../../assets/imageUser.png";
import { checkLogedUser } from "../../../redux/userActions";


export const Login = ({ navigation }) => {


//AUTH GOOGLE
const [accessToken, setAccessToken] = useState()
const [userInfo, setUserInfo] = useState();

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
  const handleLoginAuth = async () => {
    console.log("DESDE USER", userInfo);
    
      const user = await loginService.authLogin({
        email:userInfo.email,
        family_name:userInfo.family_name,
        given_name:userInfo.given_name,
        google_id:userInfo.id,
        locale:userInfo.locale,
        name:userInfo.name,
        picture:userInfo.picture,
        verified_email:userInfo.verified_email
      });
      console.log("supuesto user",user);
      if(user.message){
        setLogingUser(userInfo);
        saveItemAsyncStorage("logedGameStack", userInfo);
        showAsyncStorageData();
        dispatch(checkLogedUser());
      }

  }

  if (accessToken && userInfo) {
    console.log("LLEGA");
    handleLoginAuth();
  }
}, [accessToken, userInfo]);

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
  console.log(userInfo)
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

  const loged = useSelector((state) => state.usersState.isLogged);
  const token = useSelector((state) => state.usersState.userToken);

  const dispatch = useDispatch();

  useEffect(() => {
    const loadUserFromAsyncStorage = async () => {
      try {
        const loggedUser = await loadItemAsyncStorage("user");
        if (loggedUser) {
          const dataUser = JSON.parse(loggedUser);
          setLogingUser(dataUser);
          dispatch(checkLogedUser());
          setTimeout(() => {
            // console.log("------------------------->", token);
            // console.log("------------------------->", loged);
          }, 5000);
        }
      } catch (error) {
        console.error("Error al cargar el usuario desde AsyncStorage:", error);
      }
    };

    loadUserFromAsyncStorage();
  }, [loginUser, handleUnlogin]);

  const [loginUser, setLogingUser] = useState(null);
  // const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);


  const handleLogin = async (values) => {
    try {
      const user = await loginService.login({
        user: values.user,
        password: values.password,
      });

      console.log("ACA ESTA LO QUE DEVUELVE LA PROMESA", user);

      if(user.user){
        setLogingUser(user);
        saveItemAsyncStorage("logedGameStack", user);
        showAsyncStorageData();
        dispatch(checkLogedUser());
      }else{
        setErrorMessage("Wrong credentials");


    }

    } catch (e) {
      console.log(e);
      setErrorMessage("Wrong credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };
  const handleUnlogin = () => {
    removeItemAsyncStorage("logedGameStack");
    dispatch(logedUser());
  };

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  return (
    <Formik
      initialValues={{
        user: "",
        password: "",
      }}
      validate={(val) => {
        let errors = {};

        if (!val.user) {
          errors.user = "Enter Username";
        }
        // else if (!persons.some((e) => e.user.includes(val.user))) {
        //   errors.user = "Username invalid";
        // }

        if (!val.password) {
          errors.password = "Enter password";
        }
        // else if (user ? ){ errors.user = "Username invalid"}

        return errors;
      }}
      onSubmit={handleLogin}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        handdleLogin,
        values,
        errors,
        touched,
        onSubmit,
      }) => {
        return (
          <View style={[styles.container]}>
            <View style={[styles.header]}>
              <Image
                style={styles.logo}
                source={require("../../../../assets/logoLigth.png")}
              ></Image>
            </View>
            <View style={[styles.containerLogin]}>
              {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
              <View>
                <TextInput
                  placeholder="Username"
                  value={values.user}
                  onChangeText={handleChange("user")}
                  onBlur={handleBlur("user")}
                  style={styles.input}
                />
                {errors.user && touched.user && (
                  <Text style={styles.error}>{errors.user}</Text>
                )}
              </View>

              <View>
                <TextInput
                  placeholder="Password"
                  value={values.password}
                  onChangeText={handleChange("password")}
                  secureTextEntry={!showPassword}
                  onBlur={handleBlur("password")}
                  style={styles.input}
                />
                {/* <TouchableOpacity title={isPasswordVisible ? 'Hide Password' : 'Show Password'} onPress={() => setIsPasswordVisible(!isPasswordVisible)} /> */}
                {errors.password && touched.password && (
                  <Text style={styles.error}>{errors.password}</Text>
                )}
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <MaterialCommunityIcons
                    name={showPassword ? "eye" : "eye-off"}
                    size={20}
                    color="#000"
                    style={{marginTop:-50, left:260, padding:10}}
                  />
                </TouchableOpacity>
              </View>

              {errorMsg && <Text>Incorrect user or password</Text>}

              <TouchableOpacity
                style={[styles.miniButton]}
                onPress={handleSubmit}
              >
                <Text style={[styles.buttonText]}>Login</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.miniButtonRegister]}
                onPress={() =>
                  navigation.navigate("ForgotPassword", {
                    name: "ForgotPassword",
                  })
                }
              >
                <Text style={[styles.buttonTextRegister]}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>

              <View>
                <View>
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 16,
                      marginTop: 8,
                      color: color_morado_c2,
                      fontWeight: "bold",
                    }}
                  >
                    or
                  </Text>
                </View>
                <View>
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 16,
                      marginTop: 8,
                      color: color_morado_c2,
                      fontWeight: "bold",
                    }}
                  >
                    -------- sing in --------
                  </Text>
                </View>
                <TouchableOpacity style={styles.buttonGoogle}
                onPress={ ()=> promptAsync({
                  useProxy:true, showInRecents: true
                })}
                >
                  <Image
                    style={styles.imageGoogle}
                    source={require("../../../../assets/singinwhitgoogle.png")}
                  />
                </TouchableOpacity>
              </View>

              {showUserData()}

              <View style={styles.containerLogin}>
                {/* <Text style={[{ fontSize: 45 }]}>Welcome</Text>
                <Text style={[{ fontSize: 20 }, { fontWeight: "bold" }]}>
                  Fullname
                </Text>
                <Image style={styles.perfil} source={{}}></Image>
                <TouchableOpacity
                  onPress={() => {
                    handdleLogout();
                  }}
                  style={[styles.miniButtonLogout]}
                >
                  <Text style={[styles.buttonText]}>Logout</Text>
                </TouchableOpacity> */}

                <TouchableOpacity
                  style={[styles.miniButtonRegister]}
                  onPress={() =>
                    navigation.navigate("Register", { name: "Register" })
                  }
                >
                  <Text style={[styles.buttonTextRegister]}>Register</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      }}
    </Formik>
  );
};

const styles = StyleSheet.create({
  header: {
    alignContent: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: color_gris_c,
    width: "100%",
  },

  logo: {
    marginTop: 42,
    marginBottom: 42,
    height: 42,
    width: 315,
  },
  perfil: {
    margin: 10,
    height: 150,
    width: 150,
    borderRadius: 100,
  },
  container: {
    backgroundColor: color_gris_c,
    height: "100%",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    padding: 8,
  },

  containerLogin: {
    margin: "auto",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    width: 315,
    height: "85%",
    backgroundColor: color_gris_c,
    alignItems: "center",
    padding: 10,
  },

  title: {
    margin: 24,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },

  input: {
    textAlign: "center",
    height: 42,
    width: 315,
    marginTop: 8,
    borderColor: color_morado_c2,
    paddingHorizontal: 70,

    borderRadius: 5,
    backgroundColor: color_gris_dadada,
  },
  miniButton: {
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    marginTop: 16,
    height: 42,
    width: 315,
    padding: 0,
    backgroundColor: color_morado_c2,
    borderRadius: 8,
  },

  miniButtonRegister: {
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    marginTop: 8,
    height: 42,
    width: 315,
    padding: 0,
    backgroundColor: color_gris_c,
    borderRadius: 8,
  },

  miniButtonLogout: {
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    marginTop: "50%",
    height: "10%",
    width: "50%",
    padding: 0,
    backgroundColor: color_gris_cdcdcd,
    borderRadius: 8,
  },
  error: {
    textAlign: "center",

    fontSize: 14,
    color: "red",
    fontWeight: "bold",
  },
  buttonText: {
    textAlign: "center",
    padding: 10,
    fontSize: 15,
    fontWeight: "bold",
    color: color_gris_c,
  },

  buttonTextRegister: {
    textAlign: "center",
    padding: 10,
    fontSize: 15,
    fontWeight: "normal",
    color: color_celeste,
  },
  buttonGoogle: {
    marginTop: 16,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    width: "100%",
    borderRadius: 20,
    color: color_morado_c2,
  },
  imageGoogle: {
    height: 40,
    width: 250,
  },
  button: {
    padding: 10,

    borderRadius: 5,
  },
  buttonText: {
    color: "#FFFFFF",
  },
});
