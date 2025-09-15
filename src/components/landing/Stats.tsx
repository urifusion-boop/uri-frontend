import { Box, Grid, useMediaQuery } from "@mui/material";
import React from "react";
import Text from "../atoms/CustomText";
import styles from "../../../styles/landing.module.css";

const Stats = () => {
  const matches = useMediaQuery("(max-width: 700px)");

  return (
    <Box className={styles.statsContainer} sx={{ backgroundColor: "#FFF7FB" }}>
      <span className={styles.statsTitle} style={{ color: "#141416E3" }}>
        Explore diverse creative profiles
        <br />
        and jobs
      </span>

      <Grid
        container
        spacing={2}
        sx={{ mt: 2 }}
        columnSpacing={0}
        maxWidth={"1200px"}
        alignItems={"center"}
        mx={"auto"}
      >
        <Grid item xs={12} sm={4} sx={{ mt: matches ? "0" : "100px" }} pl={0}>
          <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
            <Text
              size={matches ? 54 : 100}
              weight={600}
              color="#CD1B78"
              style={{ fontFamily: "poorich" }}
              center
            >
              400
            </Text>
            <Text
              size={matches ? 10 : 20}
              weight={600}
              color="#CD1B78"
              sx={{ display: "flex", flexDirection: "column" }}
            >
              <span style={{ fontSize: matches ? "15px" : "30px" }}>+</span>
              <span>Creatives</span>
            </Text>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4} sx={{ mt: matches ? "0" : "45px" }}>
          <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
            <Text
              size={matches ? 54 : 100}
              weight={600}
              color="#CD1B78"
              style={{ fontFamily: "poorich" }}
              center
            >
              20
            </Text>
            <Text
              size={matches ? 10 : 20}
              weight={600}
              color="#CD1B78"
              sx={{ display: "flex", flexDirection: "column" }}
            >
              <span style={{ fontSize: matches ? "15px" : "30px" }}>+</span>
              <span>Clients</span>
            </Text>
          </Box>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
            <Text
              size={matches ? 54 : 100}
              weight={600}
              color="#CD1B78"
              style={{ fontFamily: "poorich" }}
              center
            >
              15
            </Text>
            <Text
              size={matches ? 10 : 20}
              weight={600}
              color="#CD1B78"
              sx={{ display: "flex", flexDirection: "column" }}
            >
              <span style={{ fontSize: matches ? "15px" : "30px" }}>+</span>
            </Text>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Stats;
