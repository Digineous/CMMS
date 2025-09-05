import axios from "axios";
import { baseUrl } from "../baseUrl";
export const apiUpdateMachineMaster = async (updatedMachineData) => {
  const url = baseUrl + `/machine/updateMachine/${updatedMachineData.machineNo}`;
  try {
    const token = localStorage.getItem("token");
    const data = await axios.put(
      url,
      {
        machineNo: updatedMachineData.machineNo,
        machineId: updatedMachineData.machineId,
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