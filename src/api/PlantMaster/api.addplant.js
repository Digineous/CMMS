import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiAddPlant = async (
  plantNo,
  plantName,
  segment,
  location,
  state,
  country
) => {
  const url = baseUrl + "/plant/addPlant";
  try {
    const token = localStorage.getItem("token");
    //console.log(" plantName, segment,location,state,country");
    const data = await axios.post(
      url,
      {
        plantNo: plantNo,
        plantName: plantName,
        segment: segment,
        location: location,
        state: state,
        country: "India",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.error("Error during adding plant:", error);
    throw error;
  }
};
