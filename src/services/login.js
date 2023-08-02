import axios from "axios";

const baseUrl = "https://pfvideojuegos-back-production.up.railway.app/user/login"
const baseUrlLogin = "https://pfvideojuegos-back-production.up.railway.app/loginGoogle"

const login = async credentials =>{
    const {data} = await axios.post(baseUrl,credentials)
    return data
}




const authLogin = async (user) => {

    console.log("DESDE LOGIN ",user)

    try {
        
        const  data  = await axios.post(baseUrlLogin,user)
        console.log("DATA",data)

        if(!data.user){
            const response = await axios.post(
                "https://pfvideojuegos-back-production.up.railway.app/loginGoogle",
                {
                    email:user.email,
                    family_name:user.family_name,
                    given_name:user.given_name,
                    google_id:user.google_id,
                    locale:user.locale,
                    name:user.name,
                    picture:user.picture,
                    verified_email:user.verified_email

                }
              );
              console.log("Respuesta del servidor:", response.data);
        }
        return data


    } catch (error) {
        console.log("CATCH", error);
  if (error.response) {
    console.log("Response status:", error.response.status);
    console.log("Response data:", error.response.data);
    
    return error.response.data
  }
    }
    




      

    

         
}
export default { login, authLogin }