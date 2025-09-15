import { Box } from "@mui/material";
import React from "react";
import { BiSolidStar } from "react-icons/bi";

interface Props {
  rating: number;
}

const RatingStars = ({ rating }: Props) => {
  const colors: { [key: string]: string } = {
    "1": "red",
    "2": "orange",
    "3": "gray",
    "4": "lightblue",
    "5": "green",
  };

  const stars = Array.from({ length: rating }, (_, index: number) => (
    <Box
      key={index}
      sx={{
        color: "white",
        backgroundColor: colors[rating.toString()],
        padding: "3px",
        borderRadius: 0.5,
      }}
    >
      {/* ★ */}
      <BiSolidStar />
    </Box>
  ));

  return <Box sx={{ display: "flex", alignItems: "center" }}>{stars}</Box>;
};

export default RatingStars;
