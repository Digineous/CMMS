import axios from "axios";
import { baseUrl } from "../../baseUrl";

export const addInventory = async (payload) => {
  const url = baseUrl + "/spare/addInventory";

  try {
    const token = localStorage.getItem("token");
    console.log("token:", token);
    console.log("payload:", payload);

    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.log("Error in addInventory:", error);
    throw error; // rethrow so frontend can catch it
  }
};
