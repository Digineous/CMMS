import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiGetMTTRMTBFDetails = async (body) => {
  const url = baseUrl + "/cmms/mttrMtbfByMachine";
  try {
    const token = localStorage.getItem("token");
    const data = await axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error during adding plant:", error);
    throw error;
  }
};
