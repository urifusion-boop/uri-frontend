import Spinner from "@/components/loaders/Spinner";
import { useSubscription } from "@/hooks/subscription/subscription.hook";
import { Box, Button, Typography } from "@mui/material";

const ExploreUri = () => {
  const { getUserDetails } = useSubscription();

  return (
    <Box sx={{ px: 1 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: "50px",
          mb: "20px",
        }}
      >
        <img
          src="/assets/images/trophy.png"
          style={{
            width: "100%",
            height: "226.57px",
            objectFit: "cover",
            maxWidth: "500px",
          }}
          alt="trophy"
        />
      </Box>
      <Typography
        sx={{
          color: "#000000",
          fontSize: { xs: "24px", md: "32px" },
          fontWeight: 600,
          textAlign: "center",
          maxWidth: "478px",
          mx: "auto",
        }}
      >
        Welcome to Premium!
      </Typography>
      <Typography
        sx={{
          color: "#3B3B3B",
          fontSize: { xs: "16px", md: "20px" },
          fontWeight: 500,
          textAlign: "center",
          maxWidth: "497px",
          mx: "auto",
        }}
      >
        You&apos;ve joined the elite side of Uri. Enjoy powerful features built
        just for you!
      </Typography>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: "30px",
        }}
      >
        <Button
          onClick={() => getUserDetails.mutate()}
          variant="contained"
          sx={{
            maxWidth: "200px",
            width: "100%",
            py: "12px",
          }}
        >
          {getUserDetails.isLoading ? (
            <Spinner color="#fff" />
          ) : (
            "Explore Features"
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default ExploreUri;
