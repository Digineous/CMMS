import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowLeft } from "@fortawesome/free-solid-svg-icons";

const BackButton = ({ background, iconColor }) => {
  const goBack = () => {
    window.history.back();
  };

  return (
    <button
      onClick={goBack}
      style={{
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        background: background || "transparent", 
        color: iconColor || "#000", 
        border: "none",
        outline: "none",
        padding: "8px",
        borderRadius: "4px",
      }}
    >
      <FontAwesomeIcon
        icon={faCircleArrowLeft}
        style={{
          fontSize: "24px",
          color: iconColor || "#000", 
          marginRight: "8px",
        }}
      />
      
    </button>
  );
};

export default BackButton;
