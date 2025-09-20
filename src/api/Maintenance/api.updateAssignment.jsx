import axios from "axios";
import { baseUrl } from "../baseUrl";
export const apiUpdateAssignment = async (id, body) => {
  const url = baseUrl + `/maintenance/assignments/${id}`;
  try {
    const token = localStorage.getItem("token");
    const data = await axios.put(
      url,
body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.error("Error during adding line:", error);
    throw error;
  }
};