import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { green } from "@mui/material/colors";

interface AcceptanceModalProps {
  displayTitle: string;
  displayMessage: string;
  displayIcon?: string;
}

// Define the modal component
const AcceptanceModal: React.FC<AcceptanceModalProps> = ({
  displayTitle,
  displayMessage,
  displayIcon,
}) => {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setOpen(false);
    }, 1500); // Close after 1500 milliseconds (1.5 seconds)

    return () => clearTimeout(timer); // Clear the timer if the component unmounts
  }, []);

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <Box sx={modalStyle}>
        <CheckCircleIcon sx={{ fontSize: 60, color: green[500] }} />
        <Typography id="simple-modal-title" variant="h6" component="h2">
          {displayTitle}
        </Typography>
        <Typography id="simple-modal-description" sx={{ mt: 2 }}>
          {displayMessage}
        </Typography>
      </Box>
    </Modal>
  );
};

// Modal style
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 2,
};

export default AcceptanceModal;
