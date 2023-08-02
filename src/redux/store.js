import {configureStore} from "@reduxjs/toolkit";
import videogamesReducer from "./videogamesSlice";
import userReducer from "./userSlices"
import cartReducer from "./cartSlice"
import salesReducer from "./salesSlice"
import reviewsReducer from './reviewSlice';


export default configureStore({
    reducer:{
        videogamesState: videogamesReducer,
        usersState: userReducer,
        cartState: cartReducer,
        salesState: salesReducer,
        reviews: reviewsReducer,

    }
})