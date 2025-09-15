import axios from "axios";
import { baseUrl } from "../baseUrl";
export const apiAssignManager = async (id, body) => {
  //console.log("add machine data:", updatedMachineData)
  const url = baseUrl + `/cmms/assignMaintenanceManager/${id}`;
  try {
    const token = localStorage.getItem("token");
    const data = await axios.post(
      url,
      body,
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
