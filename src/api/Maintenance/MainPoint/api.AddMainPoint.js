import axios from "axios";
import { baseUrl } from "../../baseUrl";

export const apiAddMainPoint = async (payload) => {
  const url = baseUrl + "/maintenance/addMainPoint";
  try {
    const token = localStorage.getItem("token");
    const { data } = await axios.post(url, payload, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return data;
  } catch (error) {
    console.error("Error during adding main point:", error);
    throw error;
  }
};
