import React from "react";
import { Button } from "@mui/material";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

const DownloadReport = ({ apiCall, formatData, fileName }) => {
  const handleDownload = async () => {
    try {
      const result = await apiCall();
      console.log("Result from API call:", result);

      const data = result?.data?.data || result;

      const formattedData = formatData(data);
      console.log("formatted data:",formattedData)

      const ws = XLSX.utils.json_to_sheet(formattedData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Report");

      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      const blob = new Blob([wbout], { type: "application/octet-stream" });

      saveAs(blob, fileName);
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  return (
    <Button
      variant="contained"
      style={{ backgroundColor: "#540b4b" ,color:'white',fontWeight:'600'}}
      onClick={handleDownload}
    >
      Download Report
    </Button>
  );
};

export default DownloadReport;
