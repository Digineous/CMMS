import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiGetLinkedMainpoints = async (id) => {
  const url = baseUrl + `/maintenance/checklists/${id}/mainPoints`;

  try {
    const token = localStorage.getItem("token");

    const res = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return res;
  } catch (error) {
    throw error;
  }
};
