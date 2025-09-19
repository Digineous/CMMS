import axios from "axios";
import { baseUrl } from "../../baseUrl";


export const getCheckPoint = async () => {
  const url = baseUrl + "/maintenance/checklists/";
  try {
    const token=localStorage.getItem("token")
   
    const data = await axios.get(url, {headers:{
        Authorization:`Bearer ${token}`
    }});
    return data.data;
  } catch (error) {
    console.error("Error during getting part:", error);
    throw error;
}
};