import { Box } from "@mui/material";
import toast, { ToastPosition } from "react-hot-toast";
import { FaTimesCircle } from "react-icons/fa";
import { FaCircleCheck } from "react-icons/fa6";
import { IoIosClose } from "react-icons/io";

const CustomToast = ({
  type,
  message,
  onDismiss,
}: {
  type: "success" | "error";
  message: string;
  onDismiss?: () => void;
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        backgroundColor: "#fff",
        position: "relative",
        alignItems: "flex-start",
        gap: 3,
        maxWidth: {
          xs: "90vw",
          sm: "400px",
        },
      }}
    >
      <Box>
        {type === "success" ? (
          <FaCircleCheck size={20} style={{ color: "green" }} />
        ) : (
          <FaTimesCircle size={20} style={{ color: "red" }} />
        )}
      </Box>
      <span>
        <Box sx={{ color: "#4a4a4a", fontSize: "1rem" }}>{message}</Box>
      </span>
      <Box style={{ cursor: "pointer" }} onClick={onDismiss}>
        <IoIosClose size={30} />
      </Box>
    </Box>
  );
};

export const triggerToast = (
  type: "success" | "error",
  message: string,
  position?: ToastPosition,
  duration?: number
) => {
  toast.custom(
    () => (
      <CustomToast
        type={type}
        message={message}
        onDismiss={() => toast.dismiss()}
      />
    ),
    {
      duration: duration ?? 5000,
      position: position ?? "top-right",
    }
  );
};
