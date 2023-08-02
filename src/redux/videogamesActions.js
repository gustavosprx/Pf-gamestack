import {getAllVideogames, addUser,setNextPage,setPrevPage,setMaxPage,setErrorMsg,
        setFlaPrev,setFirstPage,getVideogamesbyName,setPrevVideoGame,updateVideogames,
  filterByPlatform,
  filterByGenre,
  filterByPriceRange,
  filterByRating,
  filterByReleaseDate,
  sortByRatingAsc,
  sortByRatingDesc,
  sortByPriceAsc,
  sortByPriceDesc,
  sortByReleaseDateAsc,
  sortByReleaseDateDesc,
  clearFilters,
  sortByAlphabeticalAsc,
  sortByAlphabeticalDesc,
  notFoundGamesError
     } from "./videogamesSlice";

         

import axios from "axios";
import {videogames} from '../components/utils/dataVideojuegos'
import { createAsyncThunk } from "@reduxjs/toolkit";
let estado=0
export const  getvideoGames = () =>(dispatch)=>{
  

//  dispatch(getAllVideogames(videogames))
     axios("https://pfvideojuegos-back-production.up.railway.app/games")
     .then(res => dispatch(getAllVideogames(res.data)))
     .catch(e=>console.log("error en la ruta" ,e))
}

export const getvGamebyName =(query)=> (dispatch=>{
    // console.log("esto me llega de query",query)
    fetch(`https://pfvideojuegos-back-production.up.railway.app/games?name=${query}`)
            .then(response =>{
                estado= response.status
                return response.json()
            })
            .then(json =>{
                if(estado ===200)
                // {
                   if(json.includes('No se encontraron videojuegos con el nombre') ) 
                        //  alert('No se encontraron videojuegos con ese Nombre')
                        dispatch(notFoundGamesError())
                    else 
                        dispatch(getVideogamesbyName(json))
              
            }).catch(error =>{
                alert("error", error)
                dispatch(setErrorMsg(error))
            })
   
})


export const setNxtPage=()=>{
    return  function(dispatch){
           dispatch(setNextPage())
    }
}

export const setPrvPage=()=>{
    return  function(dispatch){
           dispatch(setPrevPage())
    }
}

export const setMxPage=(maximo)=>{
    
    return  function(dispatch){
           dispatch(setMaxPage(maximo))
    }
}
export const set1rsPage=()=>{
    return function(dispatch){
        dispatch(setFirstPage())
    }
}
export const setflgPrev=(value)=>{
    return function(dispatch){
        dispatch(setFlaPrev(value))
    }    
}

export const setPrvVideogame=()=>{
    return function(dispatch){
        dispatch(setPrevVideoGame())
}
}

export const updateVgames=(data)=>{
    return function(dispatch){
        dispatch(updateVideogames(data))
    }
}





export const getVGameByID = (id) => {
    return async (dispatch) => {
      try {
        const response = await axios.get(
          `https://pfvideojuegos-back-production.up.railway.app/games/${id}`
        );
  
        const dataVg = response.data;
  
        if (dataVg) {
          dispatch(getVideogamebyId(dataVg)); // Asegúrate de importar y definir esta acción correctamente
        } else {
          dispatch(setErrorMsg("No game registration")); // Asegúrate de importar y definir esta acción correctamente
        }
      } catch (err) {
        console.log(`Error: ${err}`);
        dispatch(setErrorMsg(err)); // Asegúrate de importar y definir esta acción correctamente
      }
    };
  };

// Acciones para filtros y ordenamientos ----> Adrián
export const applyPlatformFilter = (platform) => (dispatch) => {
    dispatch(filterByPlatform(platform));
  };
  
  export const applyGenreFilter = (genre) => (dispatch) => {
    dispatch(filterByGenre(genre));
  };
  
  export const applyPriceRangeFilter = (minPrice, maxPrice) => (dispatch) => {
    dispatch(filterByPriceRange({ minPrice, maxPrice }));
  };
  
  export const applyRatingFilter = (rating) => (dispatch) => {
    dispatch(filterByRating(rating));
  };
  
  export const applyReleaseDateFilter = (releaseDate) => (dispatch) => {
    dispatch(filterByReleaseDate(releaseDate));
  };
  
  export const applyRatingSortAsc = () => (dispatch) => {
    dispatch(sortByRatingAsc());
  };
  
  export const applyRatingSortDesc = () => (dispatch) => {
    dispatch(sortByRatingDesc());
  };
  
  export const applyPriceSortAsc = () => (dispatch) => {
    dispatch(sortByPriceAsc());
  };
  
  export const applyPriceSortDesc = () => (dispatch) => {
    dispatch(sortByPriceDesc());
  };
  
  export const applyReleaseDateSortAsc = () => (dispatch) => {
    dispatch(sortByReleaseDateAsc());
  };
  
  export const applyReleaseDateSortDesc = () => (dispatch) => {
    dispatch(sortByReleaseDateDesc());
  };
  
  export const clearAllFilters = () => (dispatch) => {
    dispatch(clearFilters());
  };

  export const applyAlphabeticalSortAsc = createAsyncThunk(
    "videogames/applyAlphabeticalSortAsc",
    async (_, { dispatch }) => {
      dispatch(sortByAlphabeticalAsc());
    }
  );
  
  export const applyAlphabeticalSortDesc = createAsyncThunk(
    "videogames/applyAlphabeticalSortDesc",
    async (_, { dispatch }) => {
      dispatch(sortByAlphabeticalDesc());
    }
  );
  //////Filtros ------- Adrián


  