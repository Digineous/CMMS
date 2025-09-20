import axios from "axios";
import { baseUrl } from "../../baseUrl";

export const addCheckPoint = async (payload) => {
  const url = baseUrl + "/maintenance/addChecklists";
  try {
    const token = localStorage.getItem("token");

    const data = await axios.post(url,payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};