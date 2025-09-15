import { Box, Typography } from "@mui/material";

type titleProps = {
  title: string;
  icon: any;
};

const TitleCard = ({ title, icon: Icon }: titleProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "9px",
      }}
    >
      <Icon
        style={{
          width: "24px",
          height: "24px",
          color: "#CD1B78",
        }}
      />
      <Typography
        sx={{
          fontSize: "clamp(1.125rem, 1.0732rem + 0.221vw, 1.25rem)",
          fontWeight: 600,
          color: "#282828",
        }}
      >
        {title}
      </Typography>
    </Box>
  );
};

export default TitleCard;
