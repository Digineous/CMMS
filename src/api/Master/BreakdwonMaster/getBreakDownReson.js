import axios from "axios";
import { baseUrl } from "../../baseUrl"

export const getBreakDownReson=async()=>{
    const url= baseUrl+"/breakdownReason/breakdownReasons"

    try {
        const token =  localStorage.getItem("token");
        const response= await axios.get(url,{
            headers:{
                Authorization:`Bearer ${token}`
            }
        })
        return response;
    } catch (error) {
        console.log("error :",error);
        throw error;
    }

}