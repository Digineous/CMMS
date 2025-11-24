import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiUpdatePlanStatus = async (planNo, payload) => {
  const url = baseUrl + `/maintenance/plans/${planNo}/status`;

  try {
    const token = localStorage.getItem("token");

    const res = await axios.put(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res;
  } catch (error) {
    throw error;
  }
};
