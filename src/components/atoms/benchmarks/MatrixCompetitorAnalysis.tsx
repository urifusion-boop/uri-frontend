import React from "react";
import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import useCustomTheme from "@/hooks/theme.hook";
import { RxDividerHorizontal } from "react-icons/rx";
import { CardElement } from "./components/CardComponent";
import { SliderComponent } from "./components/SliderComponent";

export const MatrixCompetitorAnalysis: React.FC = () => {
  const { themeColors } = useCustomTheme();

  const [selectedTab, setSelectedTab] = React.useState("Market");
  const [companyDetail, setCompanyDetail] = React.useState([
    "orange",
    "lightblue",
    "lightgreen",
    themeColors.primary,
  ]);

  const isMobile = useMediaQuery("(max-width:600px)");

  const tabs = ["Market", "Customer", "Branding", "Price", "Promotional"];
  const tabColors: { [key: string]: string[] } = {
    Market: ["lightblue", "skyblue", "lightblue", "blue"],
    Customer: ["orange", themeColors.primary, "#F11", "#D11"],
    Branding: ["gray", "lightgray", "teal", "gray"],
    Price: ["green", "yellowgreen", "lightgreen", "chartreuse"],
    Promotional: ["red", "orangered", "tomato", "crimson"],
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        // backgroundColor: "lightgray",
        color: "black",
        width: "100%",
        height: "100%",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "grid",
          gap: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 0,
            fontWeight: 800,
            width: "100%",
            fontSize: {
              xl: "24px",
              md: "24px",
              sm: "20px",
            },
          }}
        >
          <Typography>
            <RxDividerHorizontal color={themeColors.primary} size={40} />{" "}
          </Typography>
          <Typography
            variant="h3"
            sx={{
              width: "100%",
              fontWeight: 800,
              fontSize: isMobile ? "20px" : "24px",
              marginBottom: isMobile ? 2 : 0,
            }}
          >
            {" "}
            Competitor{" "}
            <span
              style={{
                color: themeColors.primary,
              }}
            >
              {" "}
              Analysis
            </span>{" "}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
          justifyItems: "center",
          justifyContent: "center",
          alignItems: "center",
          gap: 3,
        }}
      >
        {/* <Box sx={{ display: "relative",width:"100%" }}>
                    <Box sx={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", gap: 3 }}>
                        <CardElement bg={companyDetail[0]} number={"01"} name={`${selectedTab} 01`} />
                        <CardElement bg={companyDetail[1]} number={"02"} name={`${selectedTab} 02`} />
                        <CardElement bg={companyDetail[2]} number={"03"} name={`${selectedTab} 03`} />
                        <CardElement bg={companyDetail[3]} number={"04"} name={`${selectedTab} 04`} />
                    </Box>
                </Box> */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "stretch",
            width: "100%",
            height: "100%",
            flexWrap: "wrap",
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)",
              gap: 3,
              flexBasis: "48%",
            }}
          >
            <CardElement
              bg={companyDetail[0]}
              number={"01"}
              name={`${selectedTab} 01`}
            />
            <CardElement
              bg={companyDetail[1]}
              number={"02"}
              name={`${selectedTab} 02`}
            />
            <CardElement
              bg={companyDetail[2]}
              number={"03"}
              name={`${selectedTab} 03`}
            />
            <CardElement
              bg={companyDetail[3]}
              number={"04"}
              name={`${selectedTab} 04`}
            />
          </Box>
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyItems: "center",
            gap: 3,
            width: "100%",
            padding: isMobile ? 0 : 4,
          }}
        >
          <Box sx={{ display: "grid", gap: 2 }}>
            <Typography variant="h6"> Competitor Analysis </Typography>
            <Typography>
              {" "}
              A 4X4 Matrix of Price & Quality <br /> amongst 4 companies{" "}
            </Typography>
          </Box>
          <Box sx={{ display: "grid", gap: 2 }}>
            <SliderComponent
              title={"Management"}
              initialValue={30}
              color={"blue"}
            />
            <SliderComponent
              title={"Negotiation"}
              initialValue={60}
              color={"orange"}
            />
            <SliderComponent
              title={"Presentation"}
              initialValue={90}
              color={"gray"}
            />
          </Box>
        </Box>
      </Box>

      {/* Down section for selection  */}
      <Box
        sx={{
          width: "100%",
          display: "grid",
          alignItems: "center",
          gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(5, 1fr)",
          boxShadow: 0.3,
          gap: 0.2,
        }}
      >
        {tabs.map((tab) => (
          <Button
            key={tab}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: tab === selectedTab ? "#FFF" : "#000",
              fontWeight: 600,
              padding: 2,
              backgroundColor:
                tab === selectedTab ? themeColors.primary : "lightgray",
              "&:hover": {
                backgroundColor:
                  tab === selectedTab ? themeColors.primary : "gray",
                color: "#FFF",
              },
            }}
            onClick={() => {
              setSelectedTab(tab);
              setCompanyDetail(tabColors[tab]);
            }}
          >
            {tab}
          </Button>
        ))}
      </Box>
    </Box>
  );
};
