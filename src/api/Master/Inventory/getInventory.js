import axios from "axios";
import { baseUrl } from "../../baseUrl";

export const getInventory = async () => {
  const url = baseUrl + "/spare/inventory";

  try {
    const token = localStorage.getItem("token");
    console.log("token:", token);

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.log("Error in getInventory:", error);
    throw error; // rethrow so frontend can catch it
  }
};
