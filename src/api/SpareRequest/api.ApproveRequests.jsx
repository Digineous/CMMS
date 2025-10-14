import axios from "axios";
import { baseUrl } from "../baseUrl";

export const approveRequests = async (id) => {
  const url = baseUrl + `/spare/approveRequests/${id}`;

  try {
    const token = localStorage.getItem("token");

    const response = await axios.put(url,{}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error) {
    console.log("Error in approve Requests:", error);
    throw error;
  }
};
