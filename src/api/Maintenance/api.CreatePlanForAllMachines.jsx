import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiCreatePlanForAllMachines = async (payload) => {
  const url = baseUrl + "/maintenance/createPlanForAllMachines";

  try {
    const token = localStorage.getItem("token");

    const res = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res;
  } catch (error) {
    throw error;
  }
};
