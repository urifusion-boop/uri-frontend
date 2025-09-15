import React, { ReactNode } from "react";
import styles from "@/styles/Organisms.module.css";
import { Box } from "@mui/material";
import Text from "./CustomText";
import useCustomTheme from "../../hooks/theme.hook";

interface IProps {
  value: string;
  label: string;
  icon: ReactNode;
}

const CustomStatBox: React.FC<IProps> = ({ value, label, icon }) => {
  const { themeColors } = useCustomTheme();

  return (
    <Box className={styles.customStatBox} sx={{}}>
      <Text size={30} weight={700} sx={{ p: "30px 0px 0px 25px" }}>
        {value}
      </Text>
      <Text
        size={16}
        weight={500}
        sx={{ p: "0px 0px 0px 25px" }}
        color={themeColors.placeholder}
      >
        {label}
      </Text>
      <Box
        className={styles.customStatBoxIcon}
        sx={{
          backgroundColor: `${themeColors.primary}20`,
          border: `2px solid ${themeColors.primary}10`,
        }}
      >
        {icon}
      </Box>
    </Box>
  );
};

export default CustomStatBox;
