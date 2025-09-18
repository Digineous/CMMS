import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiAddUser = async (body) => {
  const url = baseUrl + "/user/addUser";
  try {
    const token = localStorage.getItem("token");
    //console.log(" plantName, segment,location,state,country");
    const data = await axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error("Error during adding plant:", error);
    throw error;
  }
};
