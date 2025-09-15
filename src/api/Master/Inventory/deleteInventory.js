import axios from "axios";
import { baseUrl } from "../../baseUrl";

export const deleteInventory = async (id) => {
  const url = baseUrl + `/spare/removeInventory/${id}`;

  try {
    const token = localStorage.getItem("token");
    console.log("token:", token);
    console.log("delete id:", id);

    const response = await axios.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.log("Error in deleteInventory:", error);
    throw error;
  }
};
