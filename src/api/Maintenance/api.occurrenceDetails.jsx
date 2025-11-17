import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiOccurrenceDetails = async (id) => {
  const url = baseUrl + `/cmms/occurrenceDetails/${id}`;
  try {
    const token = localStorage.getItem("token");
    const data = await axios.get(url, {
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
