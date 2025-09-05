import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiDeletePlant = async (plantNo) => {
    const url = baseUrl + `/plant/removePlant/${plantNo}`;
    try {
      const token=localStorage.getItem("token")
      const data = await axios.delete(url, {headers:{
          Authorization:`Bearer ${token}`
      }});
      return data;
    } catch (error) {
      console.error("Error during delete plant:", error);
      throw error;
    }
  };