import AsyncStorage from '@react-native-async-storage/async-storage';

import { Alert } from 'react-native'
//linea para modificar el contexto de localizacion para el lenaguje


//inserta o agrega cantidad de item
export const  InsertarItem= async (key,objString) => {
    try {           
        const currentValue = await AsyncStorage.getItem(key);
        if (currentValue !== null) {
            const parsedValue = JSON.parse(currentValue);
            if (parsedValue.amount===3){
                alert("Sorry, the maximum number of purchases per title is 3.")
            }else{
            parsedValue.amount = parsedValue.amount+1; // Aquí puedes realizar las modificaciones necesarias en el valor
            // Convertir el objeto modificado a una cadena de texto
            const updatedValue = JSON.stringify(parsedValue);
            await AsyncStorage.setItem(key, updatedValue);
            
            alert('One unit was added to the current item')
            // console.log('Item modificado exitosamente');
            }
        }   
        else{
            await AsyncStorage.setItem(key, objString);
            // Kawait AsyncStorage.setItem('item2', objString);
            // console.log("llave agregada",objString)
            alert('Item has been added')
        }
       
    } catch (error) {
      console.log("error al guardar objeto", error);
    }

  }


// Agregar cantidad de item en AsyncStorage
export const amountAdd = async (key, newValue) => {
    try {
        // Obtener el valor actual del item
        // console.log("cantida enviada", newValue)
        const currentValue = await AsyncStorage.getItem(key);
        if (currentValue !== null) {
          if (newValue===3){
              alert("Sorry, the maximum number of purchases per title is 3.")
          }else{
            const parsedValue = JSON.parse(currentValue);
            parsedValue.amount = newValue+1; // Aquí puedes realizar las modificaciones necesarias en el valor
            // Convertir el objeto modificado a una cadena de texto
            const updatedValue = JSON.stringify(parsedValue);
            await AsyncStorage.setItem(key, updatedValue);
            // dispatch(updateCart());
            
            console.log('Item modificado exitosamente');
          } 
        } else {
          console.log('No se encontró un item para la clave especificada');
        }
      } catch (error) {
        console.log('Error al modificar el item:', error);
      }
    };
// Agregar cantidad de item en AsyncStorage
export const amountSub = async (key, newValue) => {
  // console.log("valor de key",key)
    try {
        // Obtener el valor actual del item
        const currentValue = await AsyncStorage.getItem(key);
        if (currentValue !== null) {
          // Analizar el valor obtenido para convertirlo en un objeto
          const parsedValue = JSON.parse(currentValue);
          console.log("newValue",newValue)
              parsedValue.amount = newValue-1; // Aquí puedes realizar las modificaciones necesarias en el valor
              // Convertir el objeto modificado a una cadena de texto
              const updatedValue = JSON.stringify(parsedValue);
              // Guardar la cadena de texto actualizada en AsyncStorage
              await AsyncStorage.setItem(key, updatedValue);
              console.log('Item modificado exitosamente');
          
        } else {
          console.log('No se encontró un item para la clave especificada');
        }
      } catch (error) {
        
        console.log('Error al modificar el item:', error);
      }
    };


    // Eliminar una clave de AsyncStorage
export const removeItem = async (key) => {
    // console.log("ID a eliminar ",key)
    try {
      await AsyncStorage.removeItem(key);
      console.log('Clave eliminada exitosamente');
    } catch (error) {
      console.log('Error al eliminar la clave:', error);
    }
  };

  //limpiar carrito
  export const cleanCart = async () => {
    // console.log("Nota: Debo controlar que solo se borren las claves del carrito");
    try {
      let allKeys = await AsyncStorage.getAllKeys();
      const filteredKeys = allKeys.filter((el) => el.substring(0, 4) === "cart");
      // console.log("Claves filtradas del carrito:", filteredKeys);
      await Promise.all(
        filteredKeys.map(async (el) => {
          try {
            await removeItem(el);
          } catch (error) {
            console.log("Error al eliminar la clave:", error);
          }
        })
      );
    } catch (error) {
      console.log("Error al obtener las claves de AsyncStorage:", error);
      throw error;
    }
  };
  
  
  
  
  export const AlertItem = (fx) => {
    Alert.alert(
      'Are you sure you want to clear the cart?',
      '',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () =>fx,
        },
      ],
      { cancelable: false }
    );
  };
  
  export const getKeysCount = async () => {
    // console.log("tb debo contar solo las claves CART")
    try {
      let allKeys = await AsyncStorage.getAllKeys();
      allKeys = await AsyncStorage.getAllKeys();
      // console.log("Todas las claves:", allKeys);
      const filteredKeys = allKeys.filter((el) => el.substring(0,4)=== 'cart');
      // console.log("Claves filtradas Carrito:", filteredKeys);
      let keysCount = filteredKeys.length;
      //  console.log("Cantidad DESDE FX GET KEYS COUNT:", keysCount);
      //  console.log("Cantidad DESDE FX filteredKeysT:", filteredKeys.length);
      return keysCount;
    } catch (error) {
      console.log("Error al obtener las claves de AsyncStorage???:", error);
      throw error; // Opcional: relanza el error para manejarlo en otro lugar si es necesario
    }
  };
  
  // Obtener item en AsyncStorage
  export const getItemAsyncStorage = async (key) => {
    // console.log("esta llave busco", key);
    try {
      const currentValue = await AsyncStorage.getItem(key);
      // console.log("danole al try", currentValue);
      let parsedValue;
      if (currentValue != null) {
        try {
          parsedValue = JSON.parse(currentValue);
        } catch (error) {
          console.log(`Error al analizar el valor para la clave ${key}:`, error);
          parsedValue = null;
        }
  
        return parsedValue;
      } else {
        // Llave no encontrada
        return 'vacio'; // Devuelve una cadena vacía como valor predeterminado
      }
    } catch (error) {
      console.log('Error al obtener item en AsyncStorage:', error);
      return null;
    }
  };
  


    export const  InsertUserAsynStorage= async (key,objString) => {
      try {           
              await AsyncStorage.setItem(key, objString);
              // Kawait AsyncStorage.setItem('item2', objString);
              // console.log("llave agregada",objString)
              console.log('Usuario Logeado correctamente')
         
      } catch (error) {
        console.log("error al guardar objeto", error);
      }
  
    }
