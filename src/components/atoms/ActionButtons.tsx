import React from "react";
import { Box } from "@mui/material";
import CustomButton from "./CustomButton";

interface ActionButtonsProps {
  onCancel: () => void;
  onConfirm: () => void;
  cancelText?: string;
  confirmText?: string;
  cancelStyle?: React.CSSProperties;
  confirmStyle?: React.CSSProperties;
  isConfirmDisabled?: boolean;
  isLoading?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onCancel,
  onConfirm,
  cancelText = "Cancel",
  confirmText = "Done",
  cancelStyle = {},
  confirmStyle = {},
  isConfirmDisabled = false,
  isLoading = false,
}) => {
  return (
    <Box display="flex" gap={2}>
      <CustomButton
        onClick={onCancel}
        style={{
          backgroundColor: "#F6F6F6",
          color: "#555555",
          border: "none",
          ...cancelStyle, // Allow custom styles to be passed
        }}
      >
        {cancelText}
      </CustomButton>
      <CustomButton
        mode="primary"
        onClick={onConfirm}
        disabled={isConfirmDisabled}
        loading={isLoading}
        style={confirmStyle} // Allow custom styles to be passed
      >
        {confirmText}
      </CustomButton>
    </Box>
  );
};

export default ActionButtons;
