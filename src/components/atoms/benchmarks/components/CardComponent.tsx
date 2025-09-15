import { Box, Typography, useMediaQuery } from "@mui/material";

interface CardProp {
  bg: string;
  number: string;
  name: string;
}

export const CardElement = ({ bg, number, name }: CardProp) => {
  const isLarge = useMediaQuery("(min-width:1600px)");
  return (
    <Box
      sx={{
        height: isLarge ? "300px" : "200px",
        width: isLarge ? "400px" : "300px",
        borderRadius: 2,
        padding: "20px",
        boxShadow: 0.3,
        border: `1px solid ${bg}`,
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          border: "1px solid lightgray",
          borderRadius: 2,
          backgroundColor: bg,
          padding: 3,
        }}
      >
        <Box sx={{}}>
          <Typography variant="h6" style={{ fontWeight: 700, color: "white" }}>
            {number}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyItems: "center",
              alignItems: "center",
              height: "100%",
              padding: 3,
            }}
          >
            <Typography> {name} </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
