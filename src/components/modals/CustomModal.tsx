import * as React from "react";
import Box from "@mui/material/Box";
import { Modal } from "react-responsive-modal";
import useCustomTheme from "@/hooks/theme.hook";
import { IoIosClose } from "react-icons/io";

interface IProps {
  open: boolean;
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  closeModal?: () => void;
  children: React.ReactNode;
  width?: string;
  maxWidth?: string;
  closeOnOverlayClick?: boolean;
  showCloseIcon?: boolean;
  bgColor?: string;
  radius?: string;
  maxHeight?: string;
}

interface ModalStyle {
  root?: React.CSSProperties | undefined;
  overlay?: React.CSSProperties | undefined;
  modalContainer?: React.CSSProperties | undefined;
  modal?: React.CSSProperties | undefined;
  closeButton?: React.CSSProperties | undefined;
  closeIcon?: React.CSSProperties | undefined;
}

const CustomModal: React.FC<IProps> = ({
  open,
  setOpen,
  children,
  width,
  maxWidth,
  closeOnOverlayClick,
  showCloseIcon,
  closeModal,
  bgColor,
  radius,
  maxHeight,
}) => {
  const { themeColors } = useCustomTheme();
  const customModalStyle: ModalStyle = {
    modal: {
      width: width ?? "500px",
      maxWidth: maxWidth ?? "90%",
      borderRadius: radius || "15px",
      border: "none",
      background: bgColor || themeColors.background,
      maxHeight: maxHeight ?? "100%",
      margin: "0 auto",
      padding: "20px",
    },
  };

  const handleCloseModal = () => {
    if (setOpen) {
      return setOpen(false);
    } else if (closeModal) {
      return closeModal();
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleCloseModal}
      center
      closeIcon={<IoIosClose size={24} />}
      showCloseIcon={showCloseIcon ?? false}
      styles={customModalStyle}
      closeOnOverlayClick={closeOnOverlayClick}
      classNames={{
        modal: "scroll",
      }}
    >
      <Box>{children}</Box>
    </Modal>
  );
};

export default CustomModal;
