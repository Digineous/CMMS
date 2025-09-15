import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiAddDevice = async (deviceData) => {
  const url = baseUrl + "/device/addDevice";
  try {
    const token = localStorage.getItem("token");

    const data = await axios.post(url,deviceData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};