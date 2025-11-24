import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiGetPlansByMachine = async () => {
  const url = baseUrl + "/maintenance/plansByMachine";

  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res;
  } catch (error) {
    throw error;
  }
};
