import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiUpdateValidation = async (id, body) => {
    const url = baseUrl + `/cmms/validateWorkOrder/${id}`;
    try {
      const token=localStorage.getItem("token")
      const data = await axios.put(url, body,{headers:{
          Authorization:`Bearer ${token}`
      }});
      return data;
    } catch (error) {
      console.error("Error during adding plant:", error);
      throw error;
    }
  };