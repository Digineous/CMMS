import axios from "axios";
import { baseUrl } from "../baseUrl";


export const apiGetState = async () => {
  const url = baseUrl + "/state/getstates";
  try {
    const token=localStorage.getItem("token")
   
    const data = await axios.get(url, {headers:{
        Authorization:`Bearer ${token}`
    }});
    return data;
  } catch (error) {
    console.error("Error during getting plants:", error);
    throw error;
}
};