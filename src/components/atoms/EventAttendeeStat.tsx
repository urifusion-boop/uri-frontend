import React from "react";
import { Box, Grid } from "@mui/material";
import Text from "./CustomText";
import useCustomTheme from "../../hooks/theme.hook";
import CustomProgressBar from "./CustomProgressBar";

interface IProps {
  icon: any;
  name: string;
  genderData: {
    gender: string;
    currentAmount: number;
    totalAmount: number;
  }[];
}

const EventAttendeeStat: React.FC<IProps> = ({ icon, name, genderData }) => {
  const { themeColors } = useCustomTheme();
  const AttendeeIcon = icon;

  return (
    <Box
      sx={{
        borderRadius: "8px",
        border: "1px solid #D6DDEB",
        boxShadow: "0px 14px 54px 0px rgba(0, 0, 0, 0.03)",
        backgroundColor: themeColors.background,
        padding: "15px",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={12} sm={2}>
          <AttendeeIcon width={35} height={35} />
        </Grid>
        <Grid item xs={12} sm={10}>
          <Text size={16} weight={700} sx={{ marginBottom: "10px" }}>
            {name}
          </Text>
          <Grid container spacing={2}>
            {genderData.length &&
              genderData.map((data, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={9}>
                        <Text size={12} weight={500}>
                          {data.gender}
                        </Text>
                      </Grid>
                      <Grid item xs={12} sm={3}>
                        <Box
                          className="d-flex"
                          sx={{ marginTop: "3px", marginBottom: "3px" }}
                        >
                          <Text
                            size={10}
                            weight={500}
                            color={themeColors.primary}
                          >
                            {data.currentAmount}
                          </Text>
                          <Text
                            size={10}
                            weight={500}
                            color={themeColors.placeholder}
                          >
                            /{data.totalAmount}
                          </Text>
                        </Box>
                      </Grid>
                    </Grid>

                    <CustomProgressBar
                      percentage={data.currentAmount / data.totalAmount}
                    />

                    <Text
                      size={10}
                      weight={500}
                      color={themeColors.placeholder}
                      sx={{ marginTop: "3px" }}
                    >
                      {data.currentAmount < data.totalAmount
                        ? `${data.totalAmount - data.currentAmount} slots left`
                        : "No slots left"}
                    </Text>
                  </Box>
                </Grid>
              ))}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default EventAttendeeStat;
