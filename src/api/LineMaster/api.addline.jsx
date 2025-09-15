import axios from "axios";
import { baseUrl } from "../baseUrl";

export const apiAddLineMaster = async (plantNo, lineName, segmentName) => {
  const url = baseUrl + "/line/addline";
  try {
    const token = localStorage.getItem("token");
    //console.log(token);
    //console.log(plantNo, lineName, segmentName);
    const data = await axios.post(
      url,
      {
        plantNo: plantNo,
        lineName: lineName,
        segment: segmentName,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    console.error("Error during adding line:", error);
    throw error;
  }
};
