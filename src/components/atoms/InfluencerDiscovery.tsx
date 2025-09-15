import InstagramIcon from "@mui/icons-material/Instagram";
import SearchIcon from "@mui/icons-material/Search";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import { Box, Button, Grid, MenuItem, Select, TextField } from "@mui/material";
import { useState } from "react";

const InfluencerDiscovery = () => {
  const [platform, setPlatform] = useState("Instagram");
  const [location, setLocation] = useState("United Kingdom");
  const [size, setSize] = useState("All");
  const [age, setAge] = useState("All");
  const [gender, setGender] = useState("All");

  const handlePlatformChange = (event: any) => {
    setPlatform(event.target.value);
  };

  const handleLocationChange = (event: any) => {
    setLocation(event.target.value);
  };

  return (
    <Box p={3} bgcolor="white" borderRadius={2} width="100%">
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={1.5}>
          <Select
            value={platform}
            onChange={handlePlatformChange}
            displayEmpty
            fullWidth
            sx={{
              borderRadius: "8px",
              padding: "5px",
              backgroundColor: "#f5f5f5",
            }}
          >
            <MenuItem value="Instagram">
              <InstagramIcon fontSize="small" /> Instagram
            </MenuItem>
            <MenuItem value="YouTube">
              <YouTubeIcon fontSize="small" /> YouTube
            </MenuItem>
            <MenuItem value="Twitter">
              <TwitterIcon fontSize="small" /> Twitter
            </MenuItem>
          </Select>
        </Grid>
        <Grid item xs={3}>
          <TextField
            placeholder="Filter using AI Search or Keyword Match..."
            variant="outlined"
            fullWidth
            InputProps={{
              startAdornment: <SearchIcon />,
              style: { padding: "10px" },
            }}
            sx={{ borderRadius: "8px" }}
          />
        </Grid>
        <Grid item xs={1.5}>
          <Select
            value={location}
            onChange={handleLocationChange}
            fullWidth
            displayEmpty
            sx={{
              borderRadius: "8px",
              padding: "5px",
              backgroundColor: "#f5f5f5",
            }}
          >
            <MenuItem value="United Kingdom">United Kingdom</MenuItem>
            <MenuItem value="United States">United States</MenuItem>
            <MenuItem value="Germany">Germany</MenuItem>
            <MenuItem value="France">France</MenuItem>
            <MenuItem value="Brazil">Brazil</MenuItem>
            <MenuItem value="India">India</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={1.5}>
          <Select
            value={size}
            onChange={(e) => setSize(e.target.value)}
            fullWidth
            displayEmpty
            sx={{
              borderRadius: "8px",
              padding: "5px",
              backgroundColor: "#f5f5f5",
            }}
          >
            <MenuItem value="All">Influencer size</MenuItem>
            <MenuItem value="Micro">Micro</MenuItem>
            <MenuItem value="Mega">Mega</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={1.5}>
          <Select
            value={age}
            onChange={(e) => setAge(e.target.value)}
            fullWidth
            displayEmpty
            sx={{
              borderRadius: "8px",
              padding: "5px",
              backgroundColor: "#f5f5f5",
            }}
          >
            <MenuItem value="All">Audience age</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={1.5}>
          <Select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            fullWidth
            displayEmpty
            sx={{
              borderRadius: "8px",
              padding: "5px",
              backgroundColor: "#f5f5f5",
            }}
          >
            <MenuItem value="All">Audience gender</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={1.5}>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            sx={{
              borderRadius: "8px",
              height: "100%",
              backgroundColor: "#FF6B6B",
              color: "white",
              fontWeight: "bold",
            }}
          >
            Show 42.9M results
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InfluencerDiscovery;
