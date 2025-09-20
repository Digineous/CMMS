// api.getWorkOrderHistory.js
import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiGetWorkOrderHistory = async (workorderNo) => {
  const url = baseUrl + `/cmms/workordersHistory/${workorderNo}`;
  try {
    const token = localStorage.getItem("token");
    const data = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error during getting work order history:", error);
    throw error;
  }
};
