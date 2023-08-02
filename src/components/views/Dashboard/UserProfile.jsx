import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Importar los componentes de las ventanas que hemos creado
import Profile from './ScreenUserProfile/Profile';
import Posts from './ScreenUserProfile/Posts';
import Communications from './ScreenUserProfile/Communications';
import Shoppings from './ScreenUserProfile/Shoppings';
import Videogames from './ScreenUserProfile/Videogames';
import Comments from './ScreenUserProfile/Comments';
import MyFavoriteGames from './ScreenUserProfile/MyFavoriteGames';
import Friends from './ScreenUserProfile/Friends';

const Stack = createNativeStackNavigator();

const UserProfile = () => {
  const Card = ({ iconName, title, description, screenName }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate(screenName)}
      style={styles.card}
    >
      <MaterialCommunityIcons name={iconName} size={30} color="#987BDC" />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <NavigationContainer independent={true}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="UserProfile"
            component={UserProfileComponent}
          />
          {/* Definir las rutas para cada componente */}
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Posts" component={Posts} />
          <Stack.Screen name="Communications" component={Communications} />
          <Stack.Screen name="Shoppings" component={Shoppings} />
          <Stack.Screen name="Videogames" component={Videogames} />
          <Stack.Screen name="Comments" component={Comments} />
          <Stack.Screen name="MyFavoriteGames" component={MyFavoriteGames} />
          <Stack.Screen name="Friends" component={Friends} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};

const UserProfileComponent = ({ navigation }) => {
  const Card = ({ iconName, title, description, screenName }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate(screenName)}
      style={styles.card}
    >
      <MaterialCommunityIcons name={iconName} size={30} color="#987BDC" />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{title}</Text>
        <Text style={styles.cardDescription}>{description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Card
        iconName="account"
        title="Profile"
        description="Account information"
        screenName="Profile"
      />
      {/* <Card
        iconName="file-document-outline"
        title="Posts"
        description="Publications"
        screenName="Posts"
      /> */}
      {/* <Card
        iconName="message"
        title="Communications"
        description="Sensitive data"
        screenName="Communications"
      /> */}
      <Card
        iconName="cart"
        title="My Shoppings"
        description="History"
        screenName="Shoppings"
      />
      {/* <Card
        iconName="gamepad-variant"
        title="Videogames"
        description="My videogames"
        screenName="Videogames"
      /> */}
      
      <Card
        iconName="heart"
        title="My favorite games"
        description="Favorites games"
        screenName="MyFavoriteGames"
      />
       <Card
        iconName="comment"
        title="My reviews"
        description="My Comments"
        screenName="Comments"
      /> 
      {/* <Card
        iconName="account-group"
        title="Friends"
        description="Community"
        screenName="Friends"
      />*/}
    </View> 
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    padding: 16,
    paddingTop: 28,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#FFF',
    marginBottom: 72,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
    marginHorizontal: -15, // Agregar margen horizontal de 2px
  },
  cardContent: {
    flex: 1,
    marginLeft: 16,
    marginRight: 2, // Agregar margen derecho de 2px
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  cardDescription: {
    fontSize: 14,
    color: '#606060',
  },
});

export default UserProfile;