import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiGetPlanDetails = async (planNo) => {
  const url = baseUrl + `/maintenance/planDetails/${planNo}`;

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
