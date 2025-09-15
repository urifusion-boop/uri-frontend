import { Typography, Box, Grid, Paper, useMediaQuery } from "@mui/material";
import { FaUsers } from "react-icons/fa";
import { TbWorldSearch } from "react-icons/tb";
import styles from "../../styles/landing.module.css";

export default function ComingSoon() {
  const matches = useMediaQuery("(max-width: 920px)");

  return (
    <div className={styles.comingSoonContainer}>
      <Box
        maxWidth={"1100px"}
        mx={"auto"}
        pt={4}
        sx={{
          width: "100%",
          mb: 10,
          px: { xs: 2 },
        }}
      >
        {/* Heading */}
        <h2 className={styles.connectTitle}>Coming Soon</h2>\
        {/* Phone Section */}
        <Grid
          container
          alignItems="flex-start"
          sx={{
            mt: { lg: 10, xs: 0 },
          }}
          columnSpacing={12}
          mx={"auto"}
        >
          <Grid
            // item
            mt={"20px"}
            lg={3}
            alignSelf={"flex-start"}
            display={!matches ? "block" : "none"}
          >
            <img
              src="/assets/images/soon/iphone.png"
              alt="pics"
              style={{ width: "230px", height: "444.12px" }}
            />
          </Grid>

          <Grid
            // item
            lg={6}
            sx={{
              display: "flex",
              flexDirection: !matches ? "row" : "column",
              alignItems: "center",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  gap: { lg: 5, xs: 2 },
                  alignItems: "flex-start",
                }}
              >
                <Paper
                  sx={{
                    p: { lg: 2.5, xs: 1.5 },
                    borderRadius: "50%",
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                    bgcolor: "#FFF1F8",
                  }}
                >
                  <FaUsers
                    style={{
                      width: matches ? 20 : 40,
                      height: matches ? 20 : 40,
                      color: "#CD1B78",
                    }}
                  />
                </Paper>

                <Box
                  width="100%"
                  sx={{ maxWidth: { lg: "440px", xs: "250px" } }}
                >
                  <Typography
                    variant="h2"
                    sx={{
                      fontSize: 20,
                      color: "#474747",
                      fontFamily: "Plus Jakarta Sans,sans-serif",
                      fontWeight: 500,
                      textAlign: "left",
                      mb: 2,
                    }}
                  >
                    One Platform for All Your Needs
                  </Typography>
                  <Typography
                    variant="h3"
                    sx={{
                      fontSize: 16,
                      color: "#707070",
                      fontFamily: "Plus Jakarta Sans,sans-serif",
                      fontWeight: 400,
                      textAlign: "left",
                    }}
                  >
                    Effortlessly handle every step of your projects, from
                    discovery to completion, all in one place.
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: { lg: 5, xs: 2 },
                  alignItems: "flex-start",
                }}
              >
                <Paper
                  sx={{
                    p: { lg: 2.5, xs: 1.5 },
                    borderRadius: "50%",
                    alignItems: "center",
                    justifyContent: "center",
                    display: "flex",
                    bgcolor: "#FFF1F8",
                  }}
                >
                  <TbWorldSearch
                    style={{
                      width: matches ? 20 : 40,
                      height: matches ? 20 : 40,
                      color: "#CD1B78",
                    }}
                  />
                </Paper>
                <Box
                  sx={{ maxWidth: { lg: "440px", xs: "250px" } }}
                  width="100%"
                >
                  <Box width="100%">
                    <Typography
                      variant="h2"
                      sx={{
                        fontSize: 20,
                        color: "#474747",
                        fontFamily: "Plus Jakarta Sans,sans-serif",
                        mb: 2,
                        fontWeight: 500,
                      }}
                    >
                      Connect Globally
                    </Typography>
                  </Box>
                  <Typography
                    variant="h3"
                    sx={{
                      fontSize: 16,
                      color: "#707070",
                      fontFamily: "Plus Jakarta Sans,sans-serif",
                      fontWeight: 400,
                      textAlign: "left",
                    }}
                  >
                    Reach clients from around the world looking for top talent
                    and get access to high-quality job listings tailored to your
                    expertise.
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          <Grid
            lg={3}
            alignItems="center"
            marginX={"auto"}
            // item
            mt={!matches ? "15px" : "40px"}
          >
            <Box
              sx={{
                position: "relative",
              }}
            >
              <img
                src="/assets/images/soon/iphone2.png"
                alt="phone1"
                style={{ width: 300, height: 530 }}
              />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
