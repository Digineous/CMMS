import axios from "axios";
import { baseUrl } from "../../baseUrl";

export const updateInventory = async (payload) => {
  const url = baseUrl + `/spare/updateInventory/${payload.itemNo}`;

  try {
    const token = localStorage.getItem("token");
    console.log("token:", token);
    console.log("update payload:", payload);

    const response = await axios.put(url, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.log("Error in updateInventory:", error);
    throw error;
  }
};
