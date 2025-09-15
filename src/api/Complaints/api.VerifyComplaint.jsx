import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiVerifyCompliant = async (id, body) => {
  const url = baseUrl + `/cmms/verifyComplaint/${id}`;
  try {
    const token = localStorage.getItem("token");
    const data = await axios.put(url, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error during adding line:", error);
    throw error;
  }
};
