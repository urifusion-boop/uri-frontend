import { Box, Typography } from "@mui/material";

interface EmptyProfileDetailsProps {
  image: string;
  header: string;
  text: string;
  height?: number; // Made optional for better flexibility
  width?: number; // Made optional for better flexibility
}

const EmptyProfileDetails = ({
  header,
  image,
  text,
  height = 400,
  width = 400,
}: EmptyProfileDetailsProps) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      mt={5}
      mb={3}
      width="100%"
      maxWidth={width}
      height="auto"
      mx="auto"
    >
      <Box
        width="100%"
        maxWidth={width}
        height={height * 0.5}
        mb={2}
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <img
          alt="empty-profile"
          src={image}
          style={{
            objectFit: "contain",
            maxWidth: "100%",
            maxHeight: "100%",
          }}
        />
      </Box>
      <Typography
        variant="h2"
        color="#CD1B78"
        fontWeight={700}
        fontSize={32}
        marginBottom={1}
        textAlign="center"
      >
        {header}
      </Typography>
      <Typography
        variant="body1"
        color="#6C727F"
        fontWeight={500}
        fontSize={16}
        textAlign="center"
        maxWidth={385}
      >
        {text}
      </Typography>
    </Box>
  );
};

export default EmptyProfileDetails;
