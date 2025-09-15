import styles from "@/styles/Atoms.module.css";
import { Box } from "@mui/material";
import React, { ReactNode } from "react";
import { FaRegCircleCheck } from "react-icons/fa6";
import Text from "./CustomText";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

const SuccessBadge: React.FC<IProps> = ({ children, style, ...props }) => {
  return (
    <div
      {...props}
      style={{
        backgroundColor: "#AAFFE5",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        border: `1px solid #5DD9C1`,
        ...style,
      }}
      className={styles.errorButton}
    >
      <Box sx={{ mr: 1 }}>
        <FaRegCircleCheck
          style={{ width: "24px", height: "24px", color: "#5DD9C1" }}
        />
      </Box>
      <Text size={12} weight={500} sx={{ textAlign: "left" }} color="#141416">
        {children}
      </Text>
    </div>
  );
};

export default SuccessBadge;
