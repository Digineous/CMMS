import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiGetCity = async (stateId) => {
    const url =`${baseUrl}/common/cityByStateId/${stateId}`;
  try {
    const token = localStorage.getItem("token");

    const data = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};
