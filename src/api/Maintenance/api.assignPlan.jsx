import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiAssignPlan = async (id, body) => {
  const url = baseUrl + `/maintenance/assignPlan/${id}`;
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
