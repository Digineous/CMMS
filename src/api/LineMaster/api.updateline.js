import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiUpdateLine = async (updatedLineData) => {
  //console.log(updatedLineData);
    const url = baseUrl + `/line/updateLine/${updatedLineData.lineNo}`;
    try {
      const token=localStorage.getItem("token")
 
      const data = await axios.put(url, 
        {
          "lineNo":updatedLineData.lineNo,
          "plantNo":updatedLineData.plantNo,
          "lineName":updatedLineData.lineName,
          "segment":updatedLineData.segment  
      }
        ,{headers:{
          Authorization:`Bearer ${token}`
      }});
      return data;
    } catch (error) {
      console.error("Error during adding plant:", error);
      throw error;
    }
  };