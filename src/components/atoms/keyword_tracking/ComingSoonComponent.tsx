import { Typography, Stack, TextField, Box, Button } from "@mui/material";
import { LightThemeColors } from "@/configs/colors.config";

export const ComingSoonComponent: React.FC = () => {
  return (
    <Stack
      spacing={4}
      sx={{
        height: "70vh",
        width: "100%",
        justifyContent: "center",
        alignItems: "center",
        border: "none",
      }}
    >
      <Typography
        variant="h2"
        sx={{
          fontWeight: "bold",
          color: LightThemeColors.uriColor,
          fontSize: "4rem",
          lineHeight: "1.2",
        }}
      >
        {" "}
        Coming Soon
      </Typography>
      <Typography align="center">
        {" "}
        From automation of people processes to creating <br /> an engaged and
        driven culture.{" "}
      </Typography>
      <Stack
        direction={"column"}
        spacing={4}
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            justifyContent: "center",
          }}
        >
          <TextField
            placeholder="Please enter your email address"
            InputProps={{
              sx: {
                backgroundColor: "#ccc",
                height: "60px",
                borderTopRightRadius: 0,
                borderBottomRightRadius: 0,
                width: "100%",
                minWidth: {
                  sm: "250px",
                  md: "300px",
                  lg: "400px",
                },
                border: "none",
                fontSize: "10px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    border: "none",
                    height: "100%", // Match the height of the TextField
                  },
                  "&:hover fieldset": {
                    border: "none",
                    height: "100%", // Match the height of the TextField
                  },
                  "&.Mui-focused fieldset": {
                    border: "none",
                    height: "100%", // Match the height of the TextField
                  },
                  "& .MuiOutlinedInput-notchedOutline": {
                    border: "none",
                    height: "100%", // Match the height of the TextField
                  },
                },
              },
            }}
          />

          <Button
            variant="contained"
            sx={{
              color: "#FFF",
              fontWeight: "bold",
              height: "60px",
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              whiteSpace: "nowrap",
            }}
          >
            Notify Me
          </Button>
        </Box>

        <Typography>-_Notify me when App is launched_-</Typography>
      </Stack>
    </Stack>
  );
};
