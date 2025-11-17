import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiCalenderEvent = async (startDate, endDate) => {
  const url = baseUrl + `/cmms/calendarEvents?start=${startDate}&end=${endDate}`;
  try {
    const token = localStorage.getItem("token");
    const data = await axios.get(url, {
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
