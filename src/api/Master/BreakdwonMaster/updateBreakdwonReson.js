import axios from "axios";
import { baseUrl } from "../../baseUrl";

export const updateBreakDownReason = async(payload)=>{

    const id=payload.reasonNo;
    const url= baseUrl+`/breakdownReason/updateBreakdownReason/${id}`
    const body={
         "reasonNo": payload.reasonNo,
         "reasonText":payload.reasonText
    }
    console.log(body)

    try {
        const token = localStorage.getItem("token");
        const response=await axios.put(url,body,
            {
                headers:{
                    Authorization:`Bearer ${token}`
                }
            }
        ) 
        return response;
    } catch (error) {
        console.error("error is ",error)
        throw error;
    }

 
    
}