import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apigetLines = async () => {
  const url = baseUrl + "/line/getLines";
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
