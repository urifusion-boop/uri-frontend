import { Box, Typography, useMediaQuery } from "@mui/material";
import React from "react";
import { AiFillStar } from "react-icons/ai";
import { BiTask } from "react-icons/bi";
import { BsFillPuzzleFill } from "react-icons/bs";
import { FaStarOfLife } from "react-icons/fa";
import { LuClock2 } from "react-icons/lu";
import { GiArrowScope } from "react-icons/gi";
import { TfiMenuAlt } from "react-icons/tfi";
import { FaCircleUser } from "react-icons/fa6";

function CompetitorAnalysis() {
  const isMobile = useMediaQuery("(max-width:800px)");
  const isTablet = useMediaQuery("(max-width:1200px)");

  return (
    <div>
      <Typography fontSize={isTablet ? 20 : 24} fontWeight={600} variant="h4">
        Competitor Analysis
      </Typography>
      <Box
        marginTop={4}
        display="grid"
        maxWidth={1300}
        gridTemplateColumns={
          isMobile ? "1fr" : isTablet ? "repeat(2,1fr)" : "repeat(4, 1fr)"
        }
        gap={2}
      >
        {[
          {
            description: "Start here",
            descriptionIcon: <LuClock2 size={20} color="#CD1B78" />,
            icon: <AiFillStar size={40} color="#CD1B78" />,
          },
          {
            description: "Competitors",
            descriptionIcon: <TfiMenuAlt size={20} color="#CD1B78" />,
            icon: <GiArrowScope size={40} color="#CD1B78" />,
          },
          {
            description: "Feature Audit",
            descriptionIcon: <FaStarOfLife size={20} color="#CD1B78" />,
            icon: <BsFillPuzzleFill size={40} color="#CD1B78" />,
          },
          {
            description: "UX Analysis",
            descriptionIcon: <FaStarOfLife size={20} color="#CD1B78" />,
            icon: <BiTask size={40} color="#CD1B78" />,
          },
        ].map((item, i) => (
          <Card key={i} item={item} index={i + 1} />
        ))}
      </Box>
      <Box marginTop={4}>
        <Typography fontSize={isTablet ? 16 : 20} fontWeight={600} variant="h4">
          Competitors
        </Typography>
        <Typography
          color={"#9CA3AF"}
          fontSize={isTablet ? 14 : 16}
          marginTop={2}
        >
          Add your competitors to track their performance and compare it with
          your own. You can add up to 5 competitors.
        </Typography>

        <Box
          display={"flex"}
          alignItems={"center"}
          marginTop={2}
          gap={1}
          padding={1}
          bgcolor={"#Fff"}
          borderRadius={2}
          maxWidth={200}
          paddingInline={2}
          paddingBlock={1}
          sx={{ cursor: "pointer" }}
        >
          <FaCircleUser color={"#9CA3AF"} />
          <Typography
            color={"#9CA3AF"}
            fontWeight={600}
            fontSize={isTablet ? 14 : 16}
            marginLeft={1}
          >
            Add Competitors
          </Typography>
        </Box>
      </Box>
    </div>
  );
}

function Card({
  item,
  index,
}: Readonly<{
  item: {
    description: string;
    descriptionIcon: React.ReactNode;
    icon: React.ReactNode;
  };
  index: number;
}>) {
  return (
    <Box
      bgcolor={"white"}
      minWidth={280}
      boxShadow={"0px 1px 1px #F8F9FA"}
      borderRadius={4}
      overflow={"hidden"}
      sx={{
        transition: "transform 0.3s ease-in-out",
        "&:hover": {
          transform: "scale(1.05)",
          cursor: "pointer",
        },
      }}
      border={"1px solid #F8F9FA"}
    >
      <Box
        paddingInline={2}
        bgcolor={"#F8F9FA"}
        paddingBlock={6}
        display={"flex"}
        justifyContent={"center"}
      >
        {item.icon}
      </Box>
      <Box paddingInline={2} paddingBlock={2} marginTop={2}>
        <Box display={"flex"} alignItems={"center"} gap={1}>
          {item.descriptionIcon}
          <Typography variant="h6" fontSize={14} fontWeight={"bold"}>
            {item.description}
          </Typography>
        </Box>
        <Box
          paddingBlock={0.5}
          paddingInline={1.5}
          maxWidth={"fit-content"}
          bgcolor={"#F7D6E2"}
          marginTop={1.2}
          borderRadius={"8px"}
        >
          <Typography variant="h6" fontSize={14} fontWeight={"bold"}>
            Step {index}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

export default CompetitorAnalysis;
