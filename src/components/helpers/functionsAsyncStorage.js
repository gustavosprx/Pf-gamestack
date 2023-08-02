import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveItemAsyncStorage = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    console.log(`key "${key}" y value "${value}" guardados en AsyncStorage.`);
  } catch (error) {
    console.error("Error al guardar el par key-value en AsyncStorage:", error);
  }
};

export const loadItemAsyncStorage = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value !== null ? JSON.parse(value) : null;
  } catch (error) {
    console.error("Error al obtener el value desde AsyncStorage:", error);
    return null;
  }
};


export const removeItemAsyncStorage = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
    console.log("usuario eliminado")
  } catch (error) {
    console.error('Error al eliminar de AsyncStorage:', error);
  }
};


export const showAsyncStorageData = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const items = await AsyncStorage.multiGet(keys);
    console.log('Contenido de AsyncStorage:');
    items.forEach(([key, value]) => {
      console.log(key, value);
    });
  } catch (error) {
    console.error('Error al obtener datos de AsyncStorage:', error);
  }
};

// Llama a la función para mostrar los datos cuando sea necesario, por ejemplo, en un evento o en un botón
