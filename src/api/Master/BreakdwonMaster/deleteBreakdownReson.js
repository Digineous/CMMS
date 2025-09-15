import axios from "axios";
import { baseUrl } from "../../baseUrl"

export  const deleteBreakDownReson=async(id)=>{

    const url= baseUrl+`/breakdownReason/removeBreakdownReason/${id}`;
    try{
        const token = localStorage.getItem("token");
        const response= await axios.delete(url,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        }) 
        return response;
    }catch (error){
        console.log("error :",error);
        throw error;
    }

}