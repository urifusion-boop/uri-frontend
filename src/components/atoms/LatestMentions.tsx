import { Box, Grid, Typography, Avatar, useMediaQuery } from "@mui/material";

const LatestMentions = () => {
  const mentions = [
    { name: "Malik Wiwoho", followers: "1,620,201" },
    { name: "Nancy Aulia", followers: "1,224,820" },
    { name: "Natasha Viresta", followers: "1,100,491" },
    { name: "Wilona Hamda", followers: "927,421" },
    { name: "Rava Nanda", followers: "827,810" },
  ];

  const isMobile = useMediaQuery("(max-width:800px)");
  return (
    <Box p={3} border="1px solid #ddd" borderRadius={2} bgcolor="white">
      <Box display="flex" justifyContent="space-between">
        <Typography fontSize={isMobile ? 14 : 16} variant="h6" mb={2}>
          Latest Mentions
        </Typography>
        <Box>
          <Typography
            fontSize={12}
            fontWeight={600}
            color="text.primary"
            style={{ cursor: "pointer" }}
          >
            + Add Influencers
          </Typography>
        </Box>
      </Box>
      <Box
        display="grid"
        gridTemplateColumns={"1fr 35%"}
        marginBottom={2}
        bgcolor={"#F8F9FA"}
        padding={1}
      >
        <Typography fontSize={14} fontWeight={600} color={"#111827"}>
          Influencers
        </Typography>

        <Typography fontSize={14} fontWeight={600} color={"#111827"}>
          Followers
        </Typography>
      </Box>
      <Grid container spacing={2}>
        {mentions.map((mention, index) => (
          <Grid item xs={12} key={index}>
            <Box display="grid" gridTemplateColumns={"1fr 35%"}>
              <Box display={"flex"} alignItems={"center"} gap={1}>
                <Avatar sizes="24" src={`/path/to/avatar${index}.jpg`} />
                <Typography fontSize={14} fontWeight={500}>
                  {mention.name}
                </Typography>
              </Box>
              <Typography fontSize={13} fontWeight={400}>
                {mention.followers}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default LatestMentions;
