import axios from "axios";
import { baseUrl } from "../../baseUrl"


export const addBreakdwonReson =async(payload)=>{
    const url = baseUrl+"/breakdownReason/createBreakdownReason"
    
    try {
        const token = localStorage.getItem("token");
        console.log("token :",token);
        console.log("payload:",payload);
        const response = await axios.post(url,payload,
            {
                headers:{
                    Authorization: `Bearer ${token}`
                },
            }
        )
        return response;
    } catch (error) {
        console.log("Error is :",error);
    }

}