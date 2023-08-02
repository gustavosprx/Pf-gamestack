import { Badge } from "react-native-paper";
import { View, Text,TouchableOpacity,StyleSheet} from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/Ionicons';
import { ThemeContext } from "../../utils/theme/ThemeProvider";
import { useContext} from 'react'

const CartButton = ({ navigation }) => {
    // const [countBadge, setCountBadge]=useState(0);
    const countBadge=5 //hardcodeado
     //linea para setear el modo dark
    const { isDarkMode, StringsDark } = useContext(ThemeContext);
    return (
      <View style={[styles.container,{borderColor:StringsDark.cartButton}] }>
        <TouchableOpacity onPress={() => navigation.navigate("Cart")}>
          {/* <Text>{countBadge}</Text> */}
          <MaterialCommunityIcons name="cart" 
        //   color={StringsDark.bordercolor} 
          size={28} color={StringsDark.cartButton} />
          {countBadge > 0 && (
            <Badge  size={19} style={[styles.badge,
            {color:StringsDark.cartButton},
            {backgroundColor:StringsDark.cartButton_fondo}
            ]}>
              {countBadge}
            </Badge>
          )}
        </TouchableOpacity>
      </View>
    );
  };
  const styles = StyleSheet.create({
    container: {
      // justifyContent: 'space-between',
      // backgroundColor: color_blanco,
        alignItems: 'center',
        fontSize:18,
        marginRight: 10, 
        
        borderWidth:2,
        padding:5,
        borderRadius:50,
    },
    badge:{
      position: "absolute",
      top: -10,
      right: -10, 
    }
   
  })
  export default CartButton