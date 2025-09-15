import React from "react";
import { Box, Grid, Typography, useMediaQuery } from "@mui/material";
import CustomButton from "@/components/atoms/CustomButton";
import useCustomTheme from "@/hooks/theme.hook";

const Track = () => {
  const matches = useMediaQuery("(max-width: 920px)");
  const { themeColors } = useCustomTheme();

  return (
    <Box
      px={1}
      sx={{
        maxWidth: "1200px",
        mx: "auto",
        my: "100px",
      }}
    >
      <Typography
        sx={{ fontWeight: 700, zIndex: 10 }}
        variant={"h4"}
        align="center"
        marginLeft={"auto"}
        marginRight={"auto"}
        maxWidth={"md"}
      >
        Track, Analyze, and Elevate
        <span
          style={{
            color: themeColors.primary,
            marginLeft: "10px",
            marginRight: "10px",
          }}
        >
          {" "}
          Your Brand with Uri Insights
        </span>{" "}
      </Typography>
      <Typography
        variant="body2"
        align="justify"
        sx={{
          maxWidth: "500px",
          textAlign: "center",
          fontFamily: "Plus Jakarta Sans,sans-serif",
          margin: "0 auto",
        }}
      >
        Gain insights to boost your performance and drive growth
      </Typography>

      {/* Write */}
      <Grid container mt={!matches ? 10 : 2} spacing={3} alignItems={"center"}>
        {/* first Box */}
        <Grid item xs={12} sm={6} md={4}>
          <Box
            sx={{
              maxWidth: "346px",
              bgcolor: "transparent",
              gap: "13px",
              display: "flex",
              alignItems: "center",
              mx: "auto",
              mb: "20px",
            }}
          >
            <Box
              sx={{
                width: "35px",
                height: "35px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img src="/assets/images/soon/Frame.png" alt="Frame" />
            </Box>
            <Box
              sx={{
                maxWidth: "264px",
                gap: "11px",
                bgcolor: "transparent",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  maxWidth: "245px",
                  bgcolor: "transparent",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: 500,
                    color: "#2F2F2F",
                    fontFamily: "Plus Jakarta Sans,sans-serif",
                    textAlign: "left",
                    lineHeight: "24.77px",
                  }}
                >
                  Insights and Keyword Tracker
                </Typography>
              </Box>
              <Box
                sx={{
                  maxWidth: "246px",
                  bgcolor: "transparent",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: "normal",
                    color: "#474747",
                    fontFamily: "Plus Jakarta Sans,sans-serif",
                    textAlign: "left",
                    lineHeight: "18.02px",
                  }}
                >
                  Track the most relevant conversations about your brand or
                  industry.
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              maxWidth: "346px",
              bgcolor: "transparent",
              gap: "13px",
              display: "flex",
              alignItems: "center",
              mx: "auto",
            }}
          >
            <Box
              sx={{
                width: "35px",
                height: "35px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img src="/assets/images/soon/Celebrity.png" alt="Frame" />
            </Box>
            <Box
              sx={{
                maxWidth: "264px",
                gap: "11px",
                bgcolor: "transparent",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  maxWidth: "245px",
                  bgcolor: "transparent",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: 500,
                    color: "#2F2F2F",
                    fontFamily: "Plus Jakarta Sans,sans-serif",
                    textAlign: "left",
                    lineHeight: "24.77px",
                  }}
                >
                  Sentiment & Competitive Analysis
                </Typography>
              </Box>
              <Box
                sx={{
                  maxWidth: "246px",
                  bgcolor: "transparent",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: "normal",
                    color: "#474747",
                    fontFamily: "Plus Jakarta Sans,sans-serif",
                    textAlign: "left",
                    lineHeight: "18.02px",
                  }}
                >
                  Monitor competitors’ activities and public sentiment towards
                  them to identify opportunities and threats.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* fIrst Box Ends */}

        <Grid item xs={12} sm={6} md={4}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              my: "20px",
            }}
          >
            <img
              src="assets/images/soon/chart.png"
              height={230}
              width={245.18}
              alt="chart"
            />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Box
            sx={{
              maxWidth: "346px",
              bgcolor: "transparent",
              gap: "13px",
              display: "flex",
              alignItems: "center",
              mx: "auto",
              mb: "20px",
            }}
          >
            <Box
              sx={{
                width: "35px",
                height: "35px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img src="/assets/images/soon/Campaign.png" alt="Frame" />
            </Box>
            <Box
              sx={{
                maxWidth: "264px",
                gap: "11px",
                bgcolor: "transparent",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  maxWidth: "245px",
                  bgcolor: "transparent",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: 500,
                    color: "#2F2F2F",
                    fontFamily: "Plus Jakarta Sans,sans-serif",
                    textAlign: "left",
                    lineHeight: "24.77px",
                  }}
                >
                  Campaign Monitoring & Analytics  
                </Typography>
              </Box>
              <Box
                sx={{
                  maxWidth: "246px",
                  bgcolor: "transparent",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: "normal",
                    color: "#474747",
                    fontFamily: "Plus Jakarta Sans,sans-serif",
                    textAlign: "left",
                    lineHeight: "18.02px",
                  }}
                >
                  Measure the success of your campaigns with detailed analytics.
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box
            sx={{
              maxWidth: "346px",
              bgcolor: "transparent",
              gap: "13px",
              display: "flex",
              alignItems: "center",
              mx: "auto",
            }}
          >
            <Box
              sx={{
                width: "35px",
                height: "35px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img src="/assets/images/soon/Data.png" alt="Frame" />
            </Box>
            <Box
              sx={{
                maxWidth: "264px",
                gap: "11px",
                bgcolor: "transparent",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  maxWidth: "245px",
                  bgcolor: "transparent",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 16,
                    fontWeight: 500,
                    color: "#2F2F2F",
                    fontFamily: "Plus Jakarta Sans,sans-serif",
                    textAlign: "left",
                    lineHeight: "24.77px",
                  }}
                >
                  Data-Driven Decisions
                </Typography>
              </Box>
              <Box
                sx={{
                  maxWidth: "246px",
                  bgcolor: "transparent",
                }}
              >
                <Typography
                  sx={{
                    fontSize: 14,
                    fontWeight: "normal",
                    color: "#474747",
                    fontFamily: "Plus Jakarta Sans,sans-serif",
                    textAlign: "left",
                    lineHeight: "18.02px",
                  }}
                >
                  Make informed decisions with actionable data insights.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
      {/* Write */}

      <Box
        sx={{
          maxWidth: "311px",
          marginTop: "90px",
          mx: "auto",
        }}
      >
        <CustomButton mode="primary">Explore Insights</CustomButton>
      </Box>
    </Box>
  );
};

export default Track;
