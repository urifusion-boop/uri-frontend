import { useRouter } from "next/router";
import { MessageInboxIcon } from "../atoms/Icons";
import { Box } from "@mui/material";

export const MessageIcon: React.FC<{
  count: number;
}> = ({ count }) => {
  const router = useRouter();
  return (
    <Box
      position={"relative"}
      onClick={() => router.push("/uri-assistant")}
      sx={{
        cursor: "pointer",
        padding: "10px",
        backgroundColor: "#E9E9E94D",
        borderRadius: "10px",
      }}
    >
      {count > 0 && (
        <Box
          sx={{
            position: "absolute",
            top: 3,
            right: 8,
            width: "20px",
            height: "20px",
            borderRadius: "50%",
            backgroundColor: "#DD0C0C",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
            fontWeight: "bold",
          }}
        >
          {count}
        </Box>
      )}
      <MessageInboxIcon />
    </Box>
  );
};
