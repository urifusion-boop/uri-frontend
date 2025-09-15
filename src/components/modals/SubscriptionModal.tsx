import React from "react";
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Modal,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { useRouter } from "next/navigation";

const SubscriptionModal: React.FC = () => {
  const open = true;
  const router = useRouter();

  const handleGoBack = () => {
    window.location.href = "/dashboard";
  };

  const listTest = [
    "Monitor Keyword Trends",
    "Setup Alerts",
    "Track Sentiment",
    "Generate Leads",
  ];

  return (
    <Modal
      open={open}
      onClose={() => { }} // Prevent onClose from doing anything
      disableEscapeKeyDown // Prevent closing via Escape key
    >
      <>
        {/* Black overlay */}
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            bgcolor: "rgba(0, 0, 0, 0.8)", // Semi-transparent black background
            zIndex: 9, // Behind the modal content
          }}
        />
        {/* Modal content */}
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            textAlign: "center",
            maxWidth: "512px",
            width: "100%",
            maxHeight: "700px",
            overflowY: "auto",
            zIndex: 10, // Above the overlay
            height: "100vh",
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="/assets/images/premium-img.png"
            width="204px"
            height="204px"
            alt="Premium Feature"
            style={{ margin: "0 auto", objectFit: "contain" }}
          />

          <Typography
            variant="h6"
            component="h2"
            gutterBottom
            sx={{
              textAlign: "left",
              px: "16px",
            }}
          >
            Subscribe to Premium
          </Typography>
          <Typography
            variant="body1"
            gutterBottom
            sx={{
              textAlign: "left",
              px: "16px",
            }}
          >
            Please subscribe to our Premium Plan to get access to our Keyword
            Tracking
          </Typography>
          <List>
            {listTest.map((item, index) => (
              <ListItem key={index}>
                <ListItemIcon
                  sx={{
                    minWidth: "28px",
                    color: "primary.main",
                  }}
                >
                  <CheckIcon />
                </ListItemIcon>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>

          {/* Buttons */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              gap: 2,
              mt: 3,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              sx={{
                width: "180px",
                py: 1.5,
                borderRadius: "8px",
              }}
              onClick={() => router.push("/dashboard")}
            >
              Get Access Now
            </Button>

            <Button
              variant="outlined"
              color="secondary"
              onClick={handleGoBack}
              sx={{
                width: "130px",
                py: 1.5,
                borderRadius: "8px",
              }}
            >
              Go Back
            </Button>
          </Box>
        </Box>
      </>
    </Modal>
  );
};

export default SubscriptionModal;
