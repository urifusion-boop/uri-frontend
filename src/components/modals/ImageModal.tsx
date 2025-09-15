import React from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { TextHelper } from "../../helpers/TextHelper";

type ImageModalProps = {
  imageUrl: string;
  isOpen: boolean;
  onClose: () => void;
  modalStyle?: React.CSSProperties; // Define modalStyle prop
  imageBorderRadius?: string; // Add imageBorderRadius prop
};

const ImageModal: React.FC<ImageModalProps> = ({
  imageUrl,
  isOpen,
  onClose,
  modalStyle, // Destructure modalStyle prop
  imageBorderRadius = "0px", // Set a default value for imageBorderRadius
}) => {
  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        // style the box to center the modal, you can adjust this to your liking
        sx={{
          ...modalStyle, // Spread modalStyle prop
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.water",
          boxShadow: 24,
          p: 4,
          border: "1px solid",
        }}
      >
        <img
          src={TextHelper.setUrl(imageUrl)}
          alt="Zoomed In"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: imageBorderRadius, 
          }}
        />
      </Box>
    </Modal>
  );
};

export default ImageModal;
