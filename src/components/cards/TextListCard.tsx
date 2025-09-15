import React from "react";
import {
  Paper,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { LightbulbOutlined, TrendingUp, Bolt } from "@mui/icons-material";

interface StringListCardProps {
  title: string;
  description: string;
  items: string[];
  variant: "recommendations" | "engagementDrivers" | "engagementOpportunities";
}

const TextListCard: React.FC<StringListCardProps> = ({
  title,
  description,
  items,
  variant,
}) => {
  // Icon customization based on variant
  const getIcon = () => {
    switch (variant) {
      case "recommendations":
        return <LightbulbOutlined color="primary" />;
      case "engagementDrivers":
        return <TrendingUp color="secondary" />;
      case "engagementOpportunities":
        return <Bolt color="error" />;
      default:
        return null;
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        p: 3,
        borderRadius: 2,
        mx: "auto",
        mt: 4,
      }}
    >
      {/* Title */}
      <Typography variant="h6" fontWeight="bold">
        {title}
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        {description}
      </Typography>

      <Divider sx={{ my: 2 }} />

      {/* List of Items */}
      <List>
        {items.map((item, index) => (
          <ListItem key={index}>
            <ListItemIcon>{getIcon()}</ListItemIcon>
            <ListItemText primary={item} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default TextListCard;
