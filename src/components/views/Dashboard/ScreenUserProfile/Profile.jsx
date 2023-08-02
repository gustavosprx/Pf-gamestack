import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Modal,
} from "react-native";
import { Formik } from "formik";
import Checkbox from "expo-checkbox";
import { uploadImageAsync } from "../../../helpers/uploadImage";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { convertirFecha } from "../../../helpers/InvertDate";
// import imageUser from "../../../../../assets/imageUser.png";
import Reload from "../../../utils/theme/reload";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


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
} from "../../../utils/theme/stringsColors";

import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getUserByName, updateUser } from "../../../../redux/userActions";
//Dark Mode:

const Profile = ({ navigation }) => {
  const loged = useSelector((state) => state.usersState.isLogged);
  const [acceptTac, setAcceptTac] = useState(true);
  const [receibenewsLetter, setReceivenewsLetter] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [dataUser, setDataUser] = useState("");
  const dispatch = useDispatch();
  const dataUserdb = useSelector((state) => state.usersState.dataUser);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);


  const getDataFromAsyncStorage = async () => {
    try {
      const data = await AsyncStorage.getItem("logedGameStack");
      if (data !== null) {
        console.log("Valor almacenado en AsyncStorage:", data);
        const parsedData = JSON.parse(data);
        dispatch(getUserByName(parsedData.user)); // Despachar la acción antes de actualizar el estado
        setDataUser(parsedData);
        console.log("SKMDKAKDNMASKJMDASJKDNMJKASNDKJASNASJKDNKAS",parsedData);

        // Realiza las operaciones que necesites con los datos obtenidos
        // ...
        setTimeout(() => {
          setLoading(false);
        }, 3000);
      } else {
        console.log("No se encontró ningún valor en AsyncStorage");
        setIsLoading(false);
      }
    } catch (error) {
      console.log("Error al acceder a AsyncStorage:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(()=>{
    getDataFromAsyncStorage();
    setImage(loged.image)
  }, 1000)
  }, []);



  
  console.log(dataUserdb);
  
  const imageUser =
  'https://res.cloudinary.com/deamondhero/image/upload/v1690180824/imageUser_g1mimk.png'
  
  const [image, setImage] = useState(loged.image);
  console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!",image)
    // !dataUserdb.length ? imageUser : dataUserdb[0].image

  //   useEffect(()=>{
  // setImage(dataUserdb[0].image)
  //   },[dataUserdb[0].image])
    
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
      userAdmin: true,
      image: image,
    };
  
    console.log(`Antes del try`, userData);
    const objupdatedUser = {};
  
    // Verifica cada propiedad y agrega solo las que no sean nulas
    if (userData.user) objupdatedUser.user = userData.user;
    if (userData.fullname) objupdatedUser.fullname = userData.fullname;
    if (userData.pass) objupdatedUser.pass = userData.pass;
    if (userData.userAdmin) objupdatedUser.userAdmin = userData.userAdmin;
    if (userData.email) objupdatedUser.email = userData.email;
    if (userData.date) objupdatedUser.date = userData.date;
    if (userData.image) objupdatedUser.image = userData.image;
    if (userData.phone) objupdatedUser.phone = userData.phone;
    if (userData.tac) objupdatedUser.tac = userData.tac;
    if (userData.newsLetter) objupdatedUser.newsLetter = userData.newsLetter;
  
    // Aquí utilizamos el ID directamente desde el estado loged (suponiendo que loged es un estado)
    objupdatedUser.id = loged.id;
  
    console.log("LOGEDID------------------>", loged);

    console.log("LOGEDID------------------>", loged.id);
  
    console.log("OBJUSR----------------------------------->",objupdatedUser);
  
    try {
      console.log("OBJUSR----------------------------------->",objupdatedUser);
      console.log(`Después del try`, userData);
  
      // Supongo que updateUser es una función que realiza una solicitud PUT al backend
      // pero aquí no se muestra cómo se implementa updateUser, asegúrate de que esté correctamente implementada
      await updateUser(objupdatedUser);
  
      // Si la función updateUser es asíncrona, asegúrate de esperar su resultado con "await" o usar ".then()"
      // const response = await updateUser(objupdatedUser);
      // console.log(`Respuesta del servidor:`, response.data);
  
      Alert.alert("Data update!", "", [
        {
          text: "Ok",
          // onPress: () => navigation.navigate("HomeStack", { name: "HomeStack" }),
        },
      ]);
    } catch (error) {
      console.log(`Error en el backend:`, error);
      Alert.alert("Auch...Something went wrong");
    }
  };
  if (loading) {
    return <Reload />;
  }
  if (!dataUserdb.length)
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  return (
    <ScrollView>
      <View style={[styles.bgCont]}>
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={pickImage} style={[styles.ImageButton]}>
            <Image
              source={{ uri: image.length ? image : imageUser }}
              style={{ borderRadius: 100, margin: 5, width: 200, height: 200 }}
            />
          </TouchableOpacity>

          {/* Círculo de color #CDCDCD con ícono del lápiz */}
          <View style={styles.circleContainer}>
            <View style={styles.circle}>
              <TouchableOpacity onPress={pickImage}>
                <MaterialCommunityIcons
                  name="pencil"
                  size={35}
                  color="#3F16A7"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>

      <Formik
        initialValues={{
          user: "",
          pass: "",
          fullname: "",
          email: "",
          date: "",
          phone: "",
        }}
        validate={(values) => {
          let errors = {};
          // if (values.user) {
          //   errors.user = "Modified value";
          // }
          // if (values.password) {
          //   errors.password = "Modified value";
          // }
          // if (values.fullname) {
          //   errors.fullname = "Modified value";
          // }
          // if (values.email) {
          //   errors.email = "Modified value";
          // } else if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
          //   errors.email = "Please enter a valid email address";
          // }
          // if (values.date) {
          //   errors.date = "Modified value";
          // }
          // if (values.phone) {
          //   errors.phone = "Modified value";
          // }

          // return errors;
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
          <View>
            <View style={[styles.container]}>
              <View style={[styles.containerLogin]}>
                <View>
                  <TextInput
                    style={[styles.input]}
                    value={values.user}
                    placeholder={dataUserdb[0].user}
                    onChangeText={handleChange("user")}
                    onBlur={handleBlur("user")}
                  />
                  {/* {errors.user && touched.user && (
                    <Text style={styles.error}>{errors.user}</Text>
                  )} */}
                </View>

                <View>
                  <TextInput
                    style={[styles.input]}
                    value={values.pass}
                    placeholder="••••••••••"
                    secureTextEntry
                    onChangeText={handleChange("pass")}
                    onBlur={handleBlur("pass")}
                  />
                  {/* {errors.password && touched.password && (
                    <Text style={styles.error}>{errors.password}</Text>
                  )} */}
                </View>

                <View>
                  <TextInput
                    style={[styles.input]}
                    value={values.fullname}
                    placeholder={dataUserdb[0].fullname}
                    onChangeText={handleChange("fullname")}
                    onBlur={handleBlur("fullname")}
                  />
                  {/* {errors.fullname && touched.fullname && (
                    <Text style={styles.error}>{errors.fullname}</Text>
                  )} */}
                </View>

                <View>
                  <TextInput
                    style={[styles.input]}
                    value={values.email}
                    placeholder={dataUserdb[0].email}
                    onChangeText={handleChange("email")}
                    onBlur={handleBlur("email")}
                  />
                  {/* {errors.email && touched.email && (
                    <Text style={styles.error}>{errors.email}</Text>
                  )} */}
                </View>

                <View>
                  <TextInput
                    style={[styles.input]}
                    value={values.date}
                    placeholder={convertirFecha(dataUserdb[0].date)}
                    onChangeText={handleChange("date")}
                    onBlur={handleBlur("date")}
                  />
                  {/* {errors.date && touched.date && (
                    <Text style={styles.error}>{errors.date}</Text>
                  )} */}
                </View>

                <View>
                  <TextInput
                    style={[styles.input]}
                    value={values.phone}
                    placeholder={dataUserdb[0].phone}
                    onChangeText={handleChange("phone")}
                    onBlur={handleBlur("phone")}
                  />
                  {/* {errors.phone && touched.phone && (
                    <Text style={styles.error}>{errors.phone}</Text>
                  )} */}
                </View>

                <View style={styles.boxcontainercheckbox}>
                  <View style={styles.checkboxSection}>
                    <Checkbox
                      style={styles.checkbox}
                      value={acceptTac}
                      onValueChange={setAcceptTac}
                    />
                    <View style={styles.boxcontainercheckbox}>
                      <TouchableOpacity
                        onPress={() => setModalVisible(true)} // Abrir el modal al presionar el texto
                      >
                        <Text style={[styles.checkboxParagraph]}>
                          I accept the Terms and Conditions
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.checkboxSection}>
                    <Checkbox
                      style={styles.checkbox}
                      value={receibenewsLetter}
                      onValueChange={setReceivenewsLetter}
                    />
                    <Text style={[styles.checkboxParagraph]}>
                      I want to receive the newsLetter
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.submitContainer}>
                <TouchableOpacity
                  style={[styles.miniButton]}
                  onPress={handleSubmit}
                >
                  <Text style={[styles.buttonText]}>Submit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </Formik>
      {/* Modal */}
    
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
        <ScrollView
            contentContainerStyle={styles.modalContentContainer}
          >
          <View style={styles.modalContent}>
            {/* Título del modal */}
            <Text style={styles.modalTitle}>
              User Registration Terms and Conditions - GameStack
            </Text>

            {/* Subtítulo del modal */}
            <Text style={styles.modalSubtitle}>
              Welcome to GameStack. Before using our services, we kindly ask you
              to read these User Registration Terms and Conditions carefully. By
              registering on GameStack, you agree to comply with the following
              terms and conditions that govern our relationship with users:
            </Text>

            {/* Lista enumerada */}
            <View style={styles.listContainer}>
              <Text style={styles.listItem}>
                1- Acceptance of Terms and Conditions:
              </Text>
              <Text style={styles.listDescription}>
                By creating an account on GameStack, you accept these terms and
                conditions in full. If you do not agree with any part of these
                terms, we recommend that you do not use our services.
              </Text>

              <Text style={styles.listItem}>
                2- User Registration and Account:
              </Text>
              <Text style={styles.listDescription}>
                a. To register on GameStack, you must be of legal age in your
                country of residence or have the consent of your parents or
                legal guardians. b. The information provided during registration
                must be accurate, up-to-date, and complete. It is the user's
                responsibility to keep this information updated at all times. c.
                The user is solely responsible for maintaining the
                confidentiality of their account and password. Any activity
                performed from their account will be their sole responsibility.
              </Text>

              <Text style={styles.listItem}>3- Acceptable Use:</Text>
              <Text style={styles.listDescription}>
                a. By using GameStack, you agree not to violate any applicable
                laws or infringe on the rights of third parties. b. You will not
                use GameStack for illegal, fraudulent, or unauthorized purposes,
                including, but not limited to, sending offensive, defamatory, or
                inappropriate content.
              </Text>

              <Text style={styles.listItem}>4- Intellectual Property:</Text>
              <Text style={styles.listDescription}>
                a. GameStack and all its content (logos, designs, text,
                graphics, images, software, etc.) are the exclusive property of
                GameStack or their respective licensed owners. b. Unauthorized
                reproduction, distribution, modification, public display, or any
                other unauthorized use of GameStack's content is not permitted
                without prior written consent from the owners.
              </Text>

              <Text style={styles.listItem}>
                5- Purchases and Transactions:
              </Text>
              <Text style={styles.listDescription}>
                a. By making purchases on GameStack, you acknowledge that you
                are responsible for providing accurate and valid payment
                information. b. All purchases are subject to product
                availability and applicable terms and conditions of sale.
              </Text>

              <Text style={styles.listItem}>
                6- Account Cancellation and Suspension:
              </Text>
              <Text style={styles.listDescription}>
                a. GameStack reserves the right to cancel or suspend user
                accounts that violate these terms and conditions or engage in
                fraudulent or malicious activities.
              </Text>

              <Text style={styles.listItem}>
                7- Modifications to Terms and Conditions:
              </Text>
              <Text style={styles.listDescription}>
                a. GameStack may modify these terms and conditions at any time
                without prior notice. Updated versions will be posted on our
                website. b. It is the user's responsibility to regularly review
                the updated terms and conditions.
              </Text>

              <Text style={styles.listItem}>8- Privacy Policy:</Text>
              <Text style={styles.listDescription}>
                a. The collection and use of personal data are governed by our
                Privacy Policy, which is available on the GameStack website.
              </Text>

              <Text style={styles.listItem}>9- Applicable Law:</Text>
              <Text style={styles.listDescription}>
                These terms and conditions shall be governed and interpreted in
                accordance with the laws of [Argentina]. Any dispute arising
                from these terms and conditions shall be subject to the
                exclusive jurisdiction of the courts of [Argentina].
              </Text>

              {/* Resto de los elementos de la lista enumerada */}
            </View>

            {/* Subtítulo final del modal */}
            <Text style={styles.modalSubtitle}>
              If you have any questions or concerns about these terms and
              conditions, please contact us through the customer support
              channels provided on our website.
            </Text>

            <TouchableOpacity
              onPress={() => setModalVisible(false)} // Cerrar el modal al presionar el texto
              style={styles.modalClose}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
          </ScrollView>
        </View>
      </Modal>
      {/* Modal */}
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
    marginBottom: 10, // Agregar espacio hacia abajo
    borderBottomWidth: 1.5, // Agregar borde inferior
    borderBottomColor: "#280657", // Color del borde inferior
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
    marginTop: 5,
    alignItems: "flex-start",
  },

  checkboxSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Alinear verticalmente los elementos en el centro
    marginBottom: 5,
  },
  checkboxParagraph: {
    color: color_gris_595959,
    fontSize: 14,
    textDecorationLine: 'underline', // Agregar subrayado al texto para indicar que es tocable
    paddingBottom: 5,
  },
  checkbox: {
    margin: 8,
  },

  bgCont: {
    flex: 1,
    alignItems: 'center', // Alineación al centro horizontalmente
    justifyContent: 'flex-start', // Alineación en la parte superior
    backgroundColor: color_gris_c,
    padding: 16, // Ajusta el espaciado del componente
    position: 'relative', // Agregar position:relative al contenedor para permitir position:absolute en los hijos
  },

  circleContainer: {
    position: 'absolute',
    top: 160, // Ajustar posición vertical del círculo
    left: 150, // Alinear a la izquierda
    alignItems: 'center', // Centrar horizontalmente el círculo en el contenedor
  },

  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#CDCDCD',
    alignItems: 'center', // Alineación horizontal del contenido dentro del círculo
    justifyContent: 'center', // Alineación vertical del contenido dentro del círculo
  },

  pencilIcon: {
    position: 'absolute',
    top: 10, // Ajusta la posición vertical del ícono dentro del círculo
  },


  // Estilos para el Modal
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Color de fondo semitransparente
  },
  modalContentContainer: {
    flexGrow: 1, // Permitir que el contenido del ScrollView crezca
    justifyContent: 'center', // Centrar verticalmente el contenido del ScrollView
    paddingHorizontal: 20,
  },

  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color:"#3F16A7",
    textAlign: 'center',
  },

  modalSubtitle: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },

  listContainer: {
    marginLeft: 15,
    
  },

  listItem: {
    fontWeight: 'bold',
  },

  listDescription: {
    marginLeft: 15,
    
  },
  modalClose: {
    backgroundColor: '#622EDA', // Fondo de color #622EDA
    fontWeight: 'bold', // Negrita
    paddingHorizontal: 10, // Agregar espaciado horizontal
    paddingVertical: 5, // Agregar espaciado vertical
    borderRadius: 8, // Agregar bordes redondeados
    alignSelf: 'center', // Centrar el botón horizontalmente dentro del modal
    marginTop: 10, // Agregar margen superior
  },
  modalCloseText: {
    color: '#FFF', // Letra blanca
    fontSize: 18, // Aumentar el tamaño de la fuente

  },

});

export default Profile;