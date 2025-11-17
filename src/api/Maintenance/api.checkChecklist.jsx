import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiCheckChecklist = async (id) => {
  const url = baseUrl + `/cmms/checkChecklist/${id}`;
  try {
    const token = localStorage.getItem("token");
    const data = await axios.post(url, {}, {
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
