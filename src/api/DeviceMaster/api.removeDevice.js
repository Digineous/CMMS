import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiRemoveDevice = async (deviceNo) => {
  const url = baseUrl + `/device/removeDevice/${deviceNo}`;
  try {
    const token = localStorage.getItem("token");

    const data = await axios.put(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};