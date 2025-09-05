import axios from "axios";
import { baseUrl } from "../baseUrl";
export const apiMachineMaster = async (updatedMachineData) => {
  //console.log("add machine data:", updatedMachineData)
  const url = baseUrl + "/machine/addMachine";
  try {
    const token = localStorage.getItem("token");
    const data = await axios.post(
      url,
      {
        machineId: "NULLi",
        // plantNo: 1,
        plantNo: updatedMachineData.plantNo,
        lineNo: updatedMachineData.lineNo,
        machineName: updatedMachineData.machineName,
        displayMachineName: updatedMachineData.displayMachineName,
        lineProductionCount: updatedMachineData.lineProductionCount,
        cycleTime: updatedMachineData.cycleTime
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
