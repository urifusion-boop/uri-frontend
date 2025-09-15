import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

// Define the prop types
interface ConversationVelocityProps {
  growth_rate: number;
  peak_times: string[];
}

const ConversationVelocityCard: React.FC<ConversationVelocityProps> = ({
  growth_rate,
  peak_times,
}) => {
  return (
    <Card
      sx={{
        maxWidth: 500,
        margin: "20px auto",
        padding: 3,
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        borderRadius: "12px",
        backgroundColor: "#f9f9f9",
      }}
    >
      <CardContent>
        {/* Title */}
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            color: "#1976d2",
          }}
        >
          Conversation Velocity
        </Typography>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{
            marginBottom: 2,
            textAlign: "justify",
            color: "#555",
          }}
        >
          Conversation Velocity measures how quickly discussions and
          interactions grow around your content. A higher growth rate indicates
          increased audience interest and engagement. Use this insight to post
          during peak times to maximize reach and sustain momentum in your
          campaigns.
        </Typography>

        {/* Growth Rate */}
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          sx={{ marginBottom: 3 }}
        >
          <TrendingUpIcon
            fontSize="large"
            sx={{ color: "#4caf50", marginRight: 1 }}
          />
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              color: "#4caf50",
            }}
          >
            {growth_rate}%
          </Typography>
        </Box>

        <Divider />

        {/* Peak Times */}
        <Box mt={2}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: "bold",
              marginBottom: 1,
            }}
          >
            Peak Times:
          </Typography>
          <List>
            {peak_times.map((time, index) => (
              <ListItem key={index} disableGutters>
                <ListItemIcon>
                  <AccessTimeIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary={time} />
              </ListItem>
            ))}
          </List>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ConversationVelocityCard;
