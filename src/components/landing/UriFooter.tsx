import React from "react";
import { Box, Typography, Link, Button, Grid } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const Footer: React.FC = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#1b1b1b",
        color: "#ffffff",
        padding: "3rem 5rem",
      }}
    >
      {/* Upper Footer Section */}
      <Grid container spacing={6}>
        {/* Left Column - Digital Business Transformation */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Digital Business Transformation
          </Typography>
          <Typography variant="body2" color="grey.500" gutterBottom>
            Transform your businesses in order to survive in a completely
            digitized and connected world driven by software innovation.
          </Typography>

          <Typography
            variant="subtitle1"
            fontWeight="bold"
            gutterBottom
            sx={{ marginTop: "1.5rem" }}
          >
            Web Scale
          </Typography>
          <Typography variant="body2" color="grey.500" gutterBottom>
            Globally scale websites with innovative content management and
            infrastructure approaches.
          </Typography>

          <Typography
            variant="subtitle1"
            fontWeight="bold"
            gutterBottom
            sx={{ marginTop: "1.5rem" }}
          >
            Omni-Channel Engagement
          </Typography>
          <Typography variant="body2" color="grey.500" gutterBottom>
            Content-focused web and mobile solution for empowering marketers.
          </Typography>

          <Typography
            variant="subtitle1"
            fontWeight="bold"
            gutterBottom
            sx={{ marginTop: "1.5rem" }}
          >
            Enterprise Mobility
          </Typography>
          <Typography variant="body2" color="grey.500">
            Faster, tailored mobile experiences for any device and data source.
          </Typography>
        </Grid>

        {/* Quick Links */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            QUICK LINKS
          </Typography>
          {[
            "Products",
            "Trials",
            "Partners",
            "Support",
            "Training",
            "Consulting",
            "Blogs",
          ].map((link, index) => (
            <Link
              href="#"
              key={index}
              color="inherit"
              underline="hover"
              display="block"
              sx={{ marginBottom: "0.5rem" }}
            >
              {link}
            </Link>
          ))}
        </Grid>

        {/* About Section */}
        <Grid item xs={12} sm={6} md={3}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            ABOUT
          </Typography>
          {[
            "Company",
            "Customers",
            "Investor relations",
            "Offices",
            "Careers",
          ].map((link, index) => (
            <Link
              href="#"
              key={index}
              color="inherit"
              underline="hover"
              display="block"
              sx={{ marginBottom: "0.5rem" }}
            >
              {link}
            </Link>
          ))}
          <Button
            variant="outlined"
            href="#"
            sx={{
              color: "#ffffff",
              borderColor: "#ffffff",
              borderRadius: "5px",
              marginTop: "1rem",
              padding: "0.5rem 1.5rem",
              "&:hover": {
                borderColor: "#ffffff",
              },
            }}
          >
            CONTACT US
          </Button>
          <Typography
            variant="body2"
            sx={{ marginTop: "0.5rem", color: "#ffffff" }}
          >
            1-800-477-6473
          </Typography>
        </Grid>

        {/* Social Media and Logo */}
        <Grid
          item
          xs={12}
          sm={6}
          md={3}
          sx={{ textAlign: { xs: "center", md: "left" } }}
        >
          <Box sx={{ marginBottom: "1.5rem" }}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/99/Example_logo.svg/120px-Example_logo.svg.png"
              alt="Progress Logo"
              style={{ width: "120px" }}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "center", md: "start" },
              gap: "1.5rem",
            }}
          >
            <FacebookIcon
              sx={{ color: "#ffffff", cursor: "pointer", fontSize: "1.5rem" }}
            />
            <TwitterIcon
              sx={{ color: "#ffffff", cursor: "pointer", fontSize: "1.5rem" }}
            />
            <YouTubeIcon
              sx={{ color: "#ffffff", cursor: "pointer", fontSize: "1.5rem" }}
            />
            <LinkedInIcon
              sx={{ color: "#ffffff", cursor: "pointer", fontSize: "1.5rem" }}
            />
          </Box>
        </Grid>
      </Grid>

      {/* Lower Footer Section */}
      <Box
        sx={{
          borderTop: "1px solid #444",
          marginTop: "2rem",
          paddingTop: "1rem",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          color: "grey.500",
          fontSize: "0.875rem",
        }}
      >
        {/* Terms Links */}
        <Box
          sx={{
            display: "flex",
            gap: "1rem",
            marginBottom: { xs: "1rem", md: 0 },
          }}
        >
          <Link href="#" color="inherit" underline="hover">
            Terms of Use
          </Link>
          <Link href="#" color="inherit" underline="hover">
            Privacy Policy
          </Link>
          <Link href="#" color="inherit" underline="hover">
            Trademarks
          </Link>
          <Link href="#" color="inherit" underline="hover">
            License Agreements
          </Link>
        </Box>

        {/* Copyright */}
        <Typography
          variant="caption"
          sx={{
            textAlign: "center",
            color: "grey.500",
            fontSize: "0.75rem",
            marginBottom: { xs: "1rem", md: 0 },
          }}
        >
          © 2016, Progress Software Corporation and/or its subsidiaries or
          affiliates. All Rights Reserved.
        </Typography>

        {/* Powered by Progress */}
        <Typography
          variant="caption"
          sx={{
            color: "grey.500",
            fontSize: "0.75rem",
            textAlign: "center",
          }}
        >
          Powered by{" "}
          <Link href="#" sx={{ color: "#00a2e3", fontWeight: "bold" }}>
            Progress Sitefinity
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
