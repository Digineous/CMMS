import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apigetValidation = async () => {
  const url = baseUrl + "/cmms/workordersForValidation"; 
  try {
    const token=localStorage.getItem("token")
    const data = await axios.get(url, {headers:{
        Authorization:`Bearer ${token}`
    }});
    return data;
  } catch (error) {
    console.error("Error during adding line:", error);
    throw error;
}
};
