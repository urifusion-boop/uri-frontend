import { Button, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import PersonIcon from "@mui/icons-material/Person";
import { useState } from "react";
import { GrAction } from "react-icons/gr";
import { IoMdPricetags } from "react-icons/io";
import { FaCompass } from "react-icons/fa6";
import { NavigationSteps } from "./NavigationSteps";
import { BiTask } from "react-icons/bi";
import CompetitiveAnalysisPerformance from "@/components/atoms/benchmarks/CompetitiveAnalysisPerformance";

const UxAnalysis: React.FC = () => {
  const [activeTab, setActiveTab] = useState("performance");
  const tabButtons = [
    {
      label: "Performance",
      value: "performance",
      icon: <IoMdPricetags />,
    },
    {
      label: "Navigation",
      value: "navigation",
      icon: <FaCompass />,
      iconSize: 24,
    },
    {
      label: "Features",
      value: "features",
      icon: <GrAction />,
    },
  ];

  return (
    <Box p={3} sx={{ display: "grid", gap: 4, justifyItems: "left" }}>
      <BiTask size={48} color="#CD1B78" />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          alignItems: "start",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          Competitor UX Analysis
        </Typography>
        <Typography>
          For small businesses, entrepreneurs and busy designers{" "}
        </Typography>
      </Box>
      <Box
        border={1}
        p={2}
        sx={{
          display: "flex",
          gap: 3,
          alignItems: "start",
          borderRadius: 3,
          borderColor: "#ddd",
        }}
      >
        <PersonIcon sx={{ color: "#CD1B78" }} />
        <Typography sx={{}}>
          {" "}
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quod,
          quidem! Delectus iusto distinctio rem possimus. Commodi aliquam beatae
          repellat, facilis magni repudiandae eius minima quam quisquam, cumque
          libero modi assumenda reprehenderit harum veritatis. Ratione tempora
          in molestiae distinctio amet ipsum.{" "}
        </Typography>
      </Box>

      <Box
        display="flex"
        borderBottom="1px solid #E0E0E0"
        justifyContent="flex-start"
        width={"100%"}
        overflow={"scroll"}
        mt={3}
        mb={3}
      >
        {tabButtons.map((tab) => (
          <Box
            key={tab.value}
            px={3}
            py={1}
            sx={{
              cursor: "pointer",
              borderBottom:
                activeTab === tab.value ? "3px solid #CD1B78" : "none",
              transition: "border-bottom 0.3s ease",
            }}
            onClick={() => setActiveTab(tab.value)}
          >
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
              style={{ textTransform: "capitalize" }}
              fontSize={14}
              fontWeight={activeTab === tab.value ? 600 : 400}
              color={activeTab === tab.value ? "#CD1B78" : "#6F6F6F"}
            >
              {tab.icon} {tab.value === "navigation" ? "Navigation" : tab.label}
            </Box>
          </Box>
        ))}
      </Box>

      {activeTab === "navigation" && <NavigationSteps />}

      {activeTab === "performance" && <CompetitiveAnalysisPerformance />}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          alignItems: "start",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Competitors
        </Typography>
        <Typography>
          {" "}
          Keep track of all your direct and indirect competitors{" "}
        </Typography>
        <Button sx={{ border: 2 }}>
          <PersonIcon />
          Add a new competitor
        </Button>
      </Box>
    </Box>
  );
};

export default UxAnalysis;
