import {
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

import { uploadImageAsync } from '../../helpers/uploadImage';

import  {validate}  from './components/Validate/CreateGameValidate';

import { SelectList } from "react-native-dropdown-select-list";

import { convertirFecha, convertirFechaDiasCruzados } from "../../helpers/InvertDate";

import DateTimePicker from '@react-native-community/datetimepicker';

import {color_gris_c, color_morado_o, color_celeste, color_morado_c2, color_gris_595959, color_gris_cdcdcd, color_gris_dadada} from '../../utils/theme/stringsColors'



import {
  allGenres,
  allPlatforms,
} from "./components/dataFilteredgames";
import { useState, useRef, useEffect, useContext } from "react";

import axios from "axios";

import { useSelector } from "react-redux";



const CreateVideogame = ({ navigation, route }) => {
  const [image, setImage] = useState([]);
  const token = useSelector((state) => state.usersState.userToken);
  console.log("elTokendeRegisteeeer",token)
  const [imageScreen, setImageScreen] = useState([]);

  const [date, setDate] = useState(new Date());

  console.log(`-------------------->>-->>>> ${date}`)
  const [inputFocusedName, setInputFocusedName] = useState(true);
  const [inputFocusedDesc, setInputFocusedDesc] = useState(true);
  const [inputFocusedDate, setInputFocusedDate] = useState(true);
  const [inputFocusedPrice, setInputFocusedPrice] = useState(true);
  const [inputFocusedrequeriments_en, setInputFocusedrequeriments_en] =
    useState(true);
  const [validateSubmit, setValidateSubmit] = useState(true);
  const [showPicker, setShowPicker] = useState(false);


  const [stackData, setStackData] = useState({
    platforms: allPlatforms,
    genre: allGenres,
  });
  const [newVideoGame, setNewVideoGame] = useState({
    id: 1 + Math.floor(Math.random() * 999),
    name: "",
    description: "",
    image: "",
    screenShots: [],
    platforms: [],
    genre: [],
    price: "",
    requeriments_en: "",
    releaseDate: "10-12-2022",
  });


  console.log(`------------------------------------------ ${newVideoGame}`)

  useEffect(() => {
    validate(newVideoGame);
  }, [newVideoGame]);

  const validateNvg = validate(newVideoGame);

  console.log(validateNvg.name);

  const showDatePicker = () => {
    setShowPicker(true);
  };

  ///////

  const inputStyle = {
    height: Math.max(40, newVideoGame.description.length * 1.2), // Ajusta el tamaño en base a la longitud del texto
  };

  const inputStyleVar = {
    height: Math.max(40, newVideoGame.requeriments_en.length * 1.2), // Ajusta el tamaño en base a la longitud del texto
  };

  const handleTextChange = (text) => {
    setNewVideoGame((prevVideoGame) => ({
      ...prevVideoGame,
      requeriments_en: text,
    }));
  };

  const handleTextChange2 = (text) => {
    setNewVideoGame((prevVideoGame) => ({
      ...prevVideoGame,
      description: text,
    }));
  };

  const handleDateChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const Submit = async () => {
    const config= {Authorization: token}
    try {
      console.log(newVideoGame);
      if (
        newVideoGame.name === "" ||
        newVideoGame.description === "" ||
        date === "" ||
        !newVideoGame.platforms.length ||
        !newVideoGame.genre.length ||
        newVideoGame.image === "" ||
        !newVideoGame.screenShots.length ||
        newVideoGame.price === "" ||
        newVideoGame.requeriments_en === ""
      ) {
        setValidateSubmit(false);
      } else {
        const res = await axios.post(
          "https://pfvideojuegos-back-production.up.railway.app/games",
          {
            id: newVideoGame.id,
            name: newVideoGame.name,
            releaseDate: newVideoGame.releaseDate ,
            description: newVideoGame.description,
            image: newVideoGame.image,
            screenShots: newVideoGame.screenShots,
            platforms: newVideoGame.platforms,
            genre: newVideoGame.genre,
            price: newVideoGame.price,
            requeriments_en: newVideoGame.requeriments_en,
          },config
          );
        Alert.alert("Publication Create!", "", [
          {
            onPress: () =>
              setNewVideoGame({
                id: 1 + Math.floor(Math.random() * 999),
                name: "",
                description: "",
                releaseDate: "",
                image: "",
                screenShots: [],
                platforms: [],
                genre: [],
                price: "",
                requeriments_en: "",
                
              }),
            text: "Continue loading games",
          },
          {
            text: "Back to dashboard",
            onPress: () =>
              navigation.navigate("Landing", { name: "RenderLogin" }),
          },
        ]);

      }
    } catch (error) {
      Alert.alert("Auch...Something went wrong", "");
      console.log("Error en el backend:", error);
    }
  };

  const CancelSubmit = () => {
    Alert.alert(
      "Cancel Publication",
      "You are about to cancel your publication",
      [
        {
          text: "Cancel",
          onPress: () =>
            Alert.alert(
              "Return to Home",
              "Are you sure you want to return to Home?",
              [
                {
                  text: "Yes",
                  onPress: () =>
                    navigation.navigate("HomeStack", { name: "Home" }),
                },
                { text: "No", onPress: () => console.log("No pressed") },
              ]
            ),
          style: "cancel",
        },
        {
          text: "Continue edit",
          onPress: () => console.log("Continue edit pressed"),
        },
      ],
      {
        cancelable: true,
        onDismiss: () =>
          Alert.alert(
            "This alert was dismissed by tapping outside of the alert dialog."
          ),
      }
    );
  };

  ///////

  const pushItemgenre = (value) => {
    setTimeout(() => {
      setNewVideoGame((prevState) => ({
        ...prevState,
        genre: [...prevState.genre, value],
      }));

      setStackData((prevState) => ({
        ...prevState,
        genre: prevState.genre.filter((p) => p !== value),
      }));
    }, 1200);
  };

  const removeItemgenre = (value) => {
    setTimeout(() => {
      setNewVideoGame((prevState) => ({
        ...prevState,
        genre: prevState.genre.filter((p) => p !== value),
      }));

      setStackData((prevState) => ({
        ...prevState,
        genre: [...prevState.genre, value],
      }));
    }, 1200);
  };

  ///////

  const pushItemplatforms = (value) => {
    setTimeout(() => {
      setNewVideoGame((prevState) => ({
        ...prevState,
        platforms: [...prevState.platforms, value],
      }));

      setStackData((prevState) => ({
        ...prevState,
        platforms: prevState.platforms.filter((p) => p !== value),
      }));
    }, 1200);
  };

  const removeItemplatforms = (value) => {
    setTimeout(() => {
      setNewVideoGame((prevState) => ({
        ...prevState,
        platforms: prevState.platforms.filter((p) => p !== value),
      }));

      setStackData((prevState) => ({
        ...prevState,
        platforms: [...prevState.platforms, value],
      }));
    }, 1200);
  };



  ///////

  const handleInputChange = (inputName, inputValue) => {
    setNewVideoGame({
      ...newVideoGame,
      [inputName]: inputValue,
    });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: false,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
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

      setNewVideoGame((newVideoGame) => ({
        ...newVideoGame,
        image: arrLks[0],
      }));

      console.log(`4-----${newVideoGame}`);
      return arrLks;
    }
  };

  const deleteImage = () => {
    setNewVideoGame((newVideoGame) => ({
      ...newVideoGame,
      image: "",
    }));
  };

  const deleteScreen = (image) => {
    setNewVideoGame((newVideoGame) => ({
      ...newVideoGame,
      screenShots: newVideoGame.screenShots.filter((i) => !image),
    }));
  };

  const pickImageScreen = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsMultipleSelection: true,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 0.8,
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

      setNewVideoGame((newVideoGame) => ({
        ...newVideoGame,
        screenShots: [...newVideoGame.screenShots, ...arrLks],
      }));
      console.log(`4-----${newVideoGame}`);
      return arrLks;
    }
  };

  console.log(newVideoGame);

  return (
    <ScrollView>
      <View
        style={[
          styles.bgCont]}
      />
      <View
        style={[styles.container]}
      >
        <View
          style={[
            styles.containerLogin]}
        >
          <Text style={
            styles.TitlePage
          }>Load Videogame</Text>
          <View
            style={[
              styles.containerInput]}
          >
            <Text
              style={[styles.title]}>
                Title
            </Text>
            <TextInput
              style={[styles.input]}
              placeholder="Enter Game name"
              value={newVideoGame.name}
              onBlur={() => setInputFocusedName(false)}
              keyboardAppearance="light"
              onChangeText={(text) => handleInputChange("name", text)}
            />
            {validateNvg.name !== "" && !inputFocusedName && (
              <Text style={styles.error}>{validateNvg.name}</Text>
            )}
          </View>

          <View
            style={[
              styles.containerInput]}
          >
            <Text
              style={[styles.title]}
            >
              Price
            </Text>
            <TextInput
              style={[styles.input]}
              placeholder="$999.99"
              onBlur={() => setInputFocusedPrice(false)}
              value={newVideoGame.price}
              onChangeText={(text) => handleInputChange("price", text)}
            />
            {validateNvg.price !== "" && !inputFocusedPrice && (
              <Text style={styles.error}>{validateNvg.price}</Text>
            )}
          </View>

          <View
            style={[
              styles.containerInput]}
          >
            <Text
              style={[styles.title]}
            >
              Description
            </Text>
            <TextInput
              style={[styles.inputStyle2, inputStyle]}
              placeholder="Paste_description"
              onBlur={() => setInputFocusedDesc(false)}
              value={newVideoGame.description}
              onChangeText={handleTextChange2}
              multiline
            />
            {validateNvg.description !== "" && !inputFocusedDesc && (
              <Text style={styles.error}>{validateNvg.description}</Text>
            )}
          </View>

          <View
            style={[
              styles.containerInput,
            ]}
          >
            <Text
              style={[styles.title]}
            >
              System Requeriments
            </Text>
            <TextInput
              style={[styles.inputStyle2]}
              placeholder="Paste_requeriments"
              onBlur={() => setInputFocusedrequeriments_en(false)}
              value={newVideoGame.requeriments_en}
              onChangeText={handleTextChange}
              multiline
            />
            {validateNvg.requeriments_en !== "" &&
              !inputFocusedrequeriments_en && (
                <Text style={styles.error}>{validateNvg.requeriments_en}</Text>
              )}
          </View>


          <View
            style={[
              styles.containerInput
            ]}
          >
            <Text
              style={[styles.title]}
            >Release date
            </Text>
            <View>

              <View >
                <TouchableOpacity
                  onPress={showDatePicker}
                  style={[styles.dateButton]}
                >
                  <Text style={styles.buttonTextDate}>
                    {!date ? "Intesert date of birth " : convertirFecha(date) }
                    
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
              {validateNvg.releaseDate !== "" && !inputFocusedDate && (
              <Text style={styles.error}>{validateNvg.releaseDate}</Text>
            )}
            </View>



            {validateNvg.releaseDate !== "" && !inputFocusedDate && (
              <Text style={styles.error}>{validateNvg.releaseDate}</Text>
            )}
          </View>

          <View
            style={[
              styles.containerInput
            ]}
          >
            <Text
              style={[styles.title]}
            >Load videogame cover
            </Text>

            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <TouchableOpacity
                onPress={pickImage}
                style={[
                  styles.miniButton
                  
                ]}
              >
                <Text
                  style={[styles.buttonText]}
                >Load Image
                </Text>
              </TouchableOpacity>
              {validateNvg.image !== "" && !validateSubmit && (
                <Text style={styles.error}>{validateNvg.image}</Text>
              )}
              {console.log(`5454--------------${newVideoGame.image}`)}
              {newVideoGame.image && (
                <View>
                  <TouchableOpacity
                    onPress={() => deleteImage(newVideoGame.image)}
                  >
                    <Image
                      key={newVideoGame.image}
                      source={{ uri: `${newVideoGame.image}` }}
                      style={{ margin: 5, width: 200, height: 200 }}
                    />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          <View
            style={[styles.containerInput
            ]}
          >
            <Text
              style={[styles.title]}
            >Load screenshots
            </Text>

            <View
              style={
                styles.viewContx1}
            >
              <TouchableOpacity
                onPress={pickImageScreen}
                style={[
                  styles.miniButton]}
              >
                <Text
                  style={styles.buttonText}
                >Load Images</Text>
              </TouchableOpacity>
              {validateNvg.screenShots !== "" && !validateSubmit && (
                <Text style={styles.error}>{validateNvg.screenShots}</Text>
              )}

              {newVideoGame.screenShots[0] &&
                newVideoGame.screenShots.map((i) => {
                  return (
                    <View>
                      <TouchableOpacity onPress={() => deleteScreen(`${i}`)}>
                        <Image
                          key={i}
                          source={{ uri: `${i}` }}
                          style={{ margin: 5, width: 200, height: 200 }}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                })}
            </View>
          </View>
          <View
            style={styles.containerInput}
          >
            <Text
              style={[styles.title]}
            >Select genre
            </Text>
            <View>
              <SelectList
                data={stackData.genre}
                placeholder="Add genre"
                setSelected={(val) => pushItemgenre(val)}
                search={false}
              />
            </View>
            <View>
              <SelectList
                placeholder="Remove genre"
                setSelected={(val) => removeItemgenre(val)}
                data={newVideoGame.genre}
                search={false}
              />
            </View>
            {validateNvg.genre !== "" && !validateSubmit && (
              <Text style={styles.error}>{validateNvg.genre}</Text>
            )}
          </View>
          <View
            style={[
              styles.containerInput]}
          >
            <Text
              style={[styles.title]}
            >Select platform
            </Text>
            <View>
              <SelectList
                data={stackData.platforms}
                placeholder="Add platforms"
                setSelected={(val) => pushItemplatforms(val)}
                search={false}
              />
            </View>
            <View>
              <SelectList
                placeholder="Remove platformss"
                setSelected={(val) => removeItemplatforms(val)}
                data={newVideoGame.platforms}
                search={false}
              />
            </View>
            {validateNvg.platforms !== "" && !validateSubmit && (
              <Text style={styles.error}>{validateNvg.platforms}</Text>
            )}
          </View>


          <View></View>
          <View
            style={[
              styles.submit
            ]}
          >
            <TouchableOpacity
              style={[
                styles.miniButtonSubmit]}
              onPress={() => Submit()}
            >
              <Text
                style={[
                  styles.buttonTextSubmit]}
              >Load videogame
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.miniButtonCancel
              ]}
              onPress={() => CancelSubmit()}
            >
              <Text style={styles.buttonTextCancel}>
              Cancel
                </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",

  },
  TitlePage: {
    fontSize: 24,
    fontWeight: "900", 
    color: color_morado_o

  },


  dateButton: {
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    backgroundColor:  color_gris_dadada,
    height: 42,
    width: 315,
    padding: 0,
    // backgroundColor: color_azul,
    borderRadius: 8,
  },
  buttonTextDate: {
    textAlign: "left",
    fontSize: 16,
    fontWeight: "bold",
    color: "gray",
  },
  title: {
    margin: 8,
    fontSize: 16,
    fontWeight: "bold",

  },

  boxButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 10,
  },
  miniButton: {
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",

    marginTop: 8,
    height: 42,
    width: 315,
    backgroundColor: color_celeste,
    borderRadius: 5,

  },
  buttonText: {
    textAlign: "center",
    padding: 10,
    fontSize: 15,
    fontWeight: "bold",
    color: color_gris_c
  },
  miniButtonSubmit: {
    marginTop: 5,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    marginBottom: "8%",
    height: 42,
    width: 315,
    padding: 0,
    backgroundColor: color_morado_c2,
    borderRadius: 8,
  },
  miniButtonCancel: {

    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    marginBottom: "8%",
    height: 20,
    width: 315,

    borderRadius: 5,
  },
  buttonTextSubmit: {
    textAlign: "center",
    padding: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: color_gris_c,
  },

  buttonTextCancel:{
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
    color: color_gris_595959,
  },
  error: {
    margin: 8,
    fontSize: 14,
    // color: "red",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: 10,
    fontSize: 16,
    textAlign: "center",
    height: 50,
    marginHorizontal: "auto",
    backgroundColor: color_gris_dadada,
    borderRadius: 8,
  },

  select: {
    marginHorizontal: 50,
    justifyContent: "center",
    alignContent: "center",
    marginBottom: 10,
  },

  submit: {
    marginTop: 30,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
  },

  containerInput: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },

  inputStyle2: {
    width: 315,
    padding: 10,
    fontSize: 16,
    textAlign: "center",
    marginHorizontal: "auto",
    backgroundColor: color_gris_dadada,
    borderRadius: 5,
  },

  viewContx1: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  bgCont: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: color_azul,
  },
});

export default CreateVideogame


