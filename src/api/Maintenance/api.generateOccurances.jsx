import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiGenerateOccurrences = async (body) => {
  const url = baseUrl + '/cmms/generateOccurrences';
  try {
    const token = localStorage.getItem("token");
    const data = await axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error during adding line:", error);
    throw error;
  }
};
