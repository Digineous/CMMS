import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiGetPendingComplaints = async () => {
  const url = baseUrl + "/cmms/pendingComplaints";
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