import { Modal, Box, Typography, Button, Fade } from "@mui/material";
import { BiError } from "react-icons/bi";
import Spinner from "../loaders/Spinner";
import { LightThemeColors } from "@/configs/colors.config";

interface DeleteModalProps {
  open: boolean;
  handleClose: () => void;
  handleDelete: () => void;
  message?: string;
  isLoading?: boolean;
}

const DeleteModal = ({
  handleClose,
  handleDelete,
  open,
  message,
  isLoading,
}: DeleteModalProps) => {
  return (
    <Modal open={open} onClose={handleClose} closeAfterTransition>
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 1,
            }}
          >
            <BiError size={24} color="red" />
            <Typography variant="h6" component="h2">
              Confirm Deletion
            </Typography>
          </Box>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {message ?? "Are you sure you want to delete this item?"}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
            }}
          >
            <Button
              variant="outlined"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDelete}
              disabled={isLoading}
            >
              {isLoading ? <Spinner size={18} color="#fff" /> : "Delete"}
            </Button>
          </Box>
        </Box>
      </Fade>
    </Modal>
  );
};

export default DeleteModal;
