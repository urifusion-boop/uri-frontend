import { Toaster as Toast } from "react-hot-toast";

import React from "react";
import useCustomTheme from "@/hooks/theme.hook";

const Toaster = () => {
  const { themeColors } = useCustomTheme();
  return (
    <Toast
      position="top-center"
      toastOptions={{
        style: {
          borderRadius: "10px",
          paddingInline: "1rem",
        },
        success: {
          style: {
            background: themeColors.background,
            color: themeColors.blackWhite,
          },
        },
        error: {
          style: {
            background: themeColors.background,
            color: themeColors.blackWhite,
          },
        },
      }}
    />
  );
};

export default Toaster;
