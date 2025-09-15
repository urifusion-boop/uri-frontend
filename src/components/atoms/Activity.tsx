import React from "react";
import { Box, Typography, Grid, Divider } from "@mui/material";
import {
  AccessTime,
  ThumbUp,
  Comment,
  PhotoAlbum,
  TrendingUp,
} from "@mui/icons-material";
import { DateHelper } from "@/helpers/DateHelper";

interface ActivityData {
  avg_likes: number;
  avg_comments: number;
  top_performing_media_type: string;
  peak_posting_time: string;
  engagement_trend: string;
}

interface ActivityProps {
  activityData: ActivityData | undefined;
}

const Activity: React.FC<ActivityProps> = ({ activityData }) => {
  return activityData ? (
    <Box
      sx={{
        padding: "24px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Header */}
      <Grid container justifyContent="space-between" alignItems="center">
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Activity Overview
        </Typography>
      </Grid>

      {/* User Info */}
      {/* <Grid
        container
        alignItems="center"
        spacing={2}
        sx={{ marginTop: "16px" }}
      >
        <Grid item>
          <Avatar
            src="https://via.placeholder.com/40"
            sx={{ width: 40, height: 40 }}
          />
        </Grid>
        <Grid item>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Yakova Hisda
          </Typography>
          <Typography variant="body2" sx={{ color: "#757575" }}>
            120 Projects done
          </Typography>
        </Grid>
      </Grid> */}

      <Divider sx={{ marginY: "16px" }} />

      {/* Engagement Metrics */}
      <Typography variant="subtitle2" sx={{ fontWeight: 600, marginBottom: 2 }}>
        Engagement Metrics
      </Typography>

      <Grid container spacing={2}>
        {/* Average Likes */}
        <Grid item xs={6} display="flex" alignItems="center">
          <ThumbUp color="primary" />
          <Box ml={1}>
            <Typography variant="subtitle2">Average Likes</Typography>
            <Typography variant="body2">{activityData.avg_likes}</Typography>
          </Box>
        </Grid>

        {/* Average Comments */}
        <Grid item xs={6} display="flex" alignItems="center">
          <Comment color="primary" />
          <Box ml={1}>
            <Typography variant="subtitle2">Average Comments</Typography>
            <Typography variant="body2">{activityData.avg_comments}</Typography>
          </Box>
        </Grid>

        {/* Top Performing Media Type */}
        <Grid item xs={6} display="flex" alignItems="center">
          <PhotoAlbum color="primary" />
          <Box ml={1}>
            <Typography variant="subtitle2">Top Media Type</Typography>
            <Typography variant="body2">
              {activityData.top_performing_media_type}
            </Typography>
          </Box>
        </Grid>

        {/* Peak Posting Time */}
        <Grid item xs={6} display="flex" alignItems="center">
          <AccessTime color="primary" />
          <Box ml={1}>
            <Typography variant="subtitle2">Peak Posting Time</Typography>
            <Typography variant="body2">
              {DateHelper.convertTo12Hour(activityData.peak_posting_time)}
            </Typography>
          </Box>
        </Grid>

        {/* Engagement Trend */}
        <Grid item xs={12} display="flex" alignItems="center">
          <TrendingUp color="primary" />
          <Box ml={1}>
            <Typography variant="subtitle2">Engagement Trend</Typography>
            <Typography variant="body2">
              {activityData.engagement_trend}
            </Typography>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ marginY: "16px" }} />
    </Box>
  ) : null;
};

export default Activity;
