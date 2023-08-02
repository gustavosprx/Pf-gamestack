import React, { useState } from 'react';
import { TouchableOpacity, View, StyleSheet,Text } from 'react-native';
//linea para llamar a modo DARK
import { ThemeContext } from '../theme/ThemeProvider';
//linea para modificar el contexto de localizacion para el lenaguje
import { LanguajeContext } from '../languaje/languajeProvider';


export const ChangeButtonContext = (props) => {
  // console.log("proprs", props)
  const [isOn, setIsOn] = useState(false);
  const { StringsDark,toggleTheme} = React.useContext(ThemeContext);
  const {toggleLanguaje }= React.useContext(LanguajeContext)
  const handleSwitchToggle = () => {
    if(props.tipo==='theme'){
      toggleTheme();
      setIsOn(!isOn);
    }else{
      toggleLanguaje();
      setIsOn(!isOn);

    }
  };

  return (
    <TouchableOpacity  activeOpacity={0.8} style={{flexDirection:'row'}} >
    {/* <TouchableOpacity onPress={handleSwitchToggle} activeOpacity={0.8} style={{flexDirection:'row'}} ></TouchableOpacity> */}
      <View style={styles.separador}>
        <Text style={[styles.texto,{color:StringsDark.text}]}>{props.name}</Text>
        <View style={[styles.switchContainer, isOn ? styles.switchOn : styles.switchOff]}>
          <View style={isOn ? styles.switchToggleOn : styles.switchToggleOff} />
        </View>

      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({

  switchContainer: {
    position:'absolute',
    marginLeft: 160,
    flexDirection:'row',
    width: 55,
    height: 27,
     borderRadius: 4,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    padding: 1,
  },
    separador:{
    margin:12,
    flexDirection:'row',
    
  },
  texto:{
    fontSize:15,
    fontWeight:'bold',
    // paddingRight:10,
    paddingLeft: '5%'

  },
  switchOn: {
    backgroundColor: 'green',
  },
  switchOff: {
    backgroundColor: 'red',
  },
  switchToggleOn: {
    marginRight:20,
    marginTop:1.5,
    width: 22,
    height: 22,
    borderRadius: 4,
    backgroundColor: 'white',
  },
  switchToggleOff: {
    marginLeft:20,
    marginTop:1.5,
    width: 22,
    height: 22,
    borderRadius: 4,
    backgroundColor: 'black',
  },
});
