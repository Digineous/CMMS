import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiAddPlan = async (body) => {
  const url = baseUrl + "/maintenance/createPlan";
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
