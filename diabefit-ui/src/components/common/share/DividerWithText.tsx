import React from "react";
import "./DividerWithText.scss";

interface DividerWithTextProps {
  text: string;
}

const DividerWithText: React.FC<DividerWithTextProps> = ({ text }) => {
  return (
    <div className="container">
      <div className="border" />
      <span className="content">{text}</span>
      <div className="border" />
    </div>
  );
};

export default DividerWithText;
