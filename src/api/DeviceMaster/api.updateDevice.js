import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiUpdateDevice = async (deviceData) => {
    const device_no = deviceData.deviceNo
  const url = baseUrl + `/device/updateDevice${device_no}`;
  try {
    const token = localStorage.getItem("token");

    const data = await axios.put(url, deviceData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    throw error;
  }
};