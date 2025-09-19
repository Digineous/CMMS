import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiGetAssignmentTechnician = async () => {
  const url = baseUrl + "/maintenance/assignedPlansForTechnician"; 
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
