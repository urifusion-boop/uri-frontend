import React from "react";
import useCustomTheme from "../../hooks/theme.hook";
import { AiOutlineClose } from "react-icons/ai";

interface IProps {
  name: string;
  onRemove: () => void;
}

const CustomFilterItem: React.FC<IProps> = ({ name, onRemove }) => {
  const { themeColors } = useCustomTheme();

  return (
    <span
      style={{
        backgroundColor: themeColors.primary,
        display: "inline-block",
        padding: "10px 10px",
        borderRadius: "5px",
        margin: "0px 5px 10px 5px",
        whiteSpace: "nowrap",
        fontSize: "11px",
        fontWeight: "500px",
        color: "white",
      }}
    >
      {name}
      <span
        style={{
          marginLeft: "10px",
          position: "relative",
          cursor: "pointer",
        }}
        onClick={() => onRemove()}
      >
        <AiOutlineClose
          style={{
            color: "white",
            width: "13px",
            height: "13px",
            transform: "translate(0px, 0px)",
          }}
        />
      </span>
    </span>
  );
};

export default CustomFilterItem;
