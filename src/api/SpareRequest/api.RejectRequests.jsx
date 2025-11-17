import axios from "axios";
import { baseUrl } from "../baseUrl";

export const rejectRequests = async (id, payload) => {
  const url = baseUrl + `/spare/rejectRequest/${id}`;

  try {
    const token = localStorage.getItem("token");

    const response = await axios.put(url,payload, {
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
