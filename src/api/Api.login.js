import axios from "axios";
import { baseUrl } from "./baseUrl";

export const apiLogin = async (username, password) => {
  const url = baseUrl + "/auth/signin";
  try {
    const data = await axios.post(url, {
      companyId: "cmms",
      userName: username,
      password: password,
    });
    return data;
  } catch (error) {
    console.error("Error during login:", error);
    throw error;
  }
};