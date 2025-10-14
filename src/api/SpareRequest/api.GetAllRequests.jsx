import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiGetAllRequests = async () => {
  const url = baseUrl + "/spare/allRequests";
  try {
    const token = localStorage.getItem("token");
    const data = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error during adding plant:", error);
    throw error;
  }
};
