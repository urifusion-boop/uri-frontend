import { Box } from "@mui/material";

const SummaryBox = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      padding={2}
      bgcolor={"#f9f9fb"}
      borderRadius={3}
      width={"100%"}
      border={"1px solid #e0e0e0"}
    >
      {children}
    </Box>
  );
};

export default SummaryBox;
