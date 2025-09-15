import { TextHelper } from "@/helpers/TextHelper";
import { KeywordTrackerPostTypeDto } from "@/models/dtos/TrackerDto";
import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { FaDiamond } from "react-icons/fa6";
import { VictoryPie, VictoryTooltip } from "victory";
import Spinner from "../loaders/Spinner";
import { LightThemeColors } from "@/configs/colors.config";

interface PostTypePieChartProps {
  data: KeywordTrackerPostTypeDto[];
  loading?: boolean;
}

const PostTypePieChart = ({ data, loading }: PostTypePieChartProps) => {
  const [endAngle, setEndAngle] = useState(0);

  const formattedData = data.map((item) => ({
    x: item.post_type,
    y: item.count,
  }));

  useEffect(() => {
    setTimeout(() => {
      setEndAngle(360);
    }, 100);
  }, []);

  const generateColor = (index: number) => `hsl(${index * 60}, 70%, 50%)`;

  const colorMap = data.map((item, index) => generateColor(index));

  return (
    <Box pt={3} borderRadius={2} gap={2} px={4} pb={3} bgcolor="white">
      <Typography fontWeight={600} fontSize={16}>
        Social media post types
      </Typography>

      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Spinner
            color={LightThemeColors.uriColor}
            size={25}
            text="Just a sec...."
          />
        </Box>
      ) : (
        <>
          <Box
            display="flex"
            gap={2}
            sx={{
              flexWrap: "wrap",
            }}
            mt={2}
          >
            {data.map((item, index) => (
              <Box display="flex" alignItems="center" gap={1} key={index}>
                <FaDiamond color={generateColor(index)} size={12} />
                <Typography variant="caption" fontSize={12}>
                  {TextHelper.removeChar(item?.post_type ?? "", "_")}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* VictoryPie with width, height, and alignment adjustments */}
          {data.length > 0 ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              mt={3}
            >
              <VictoryPie
                data={formattedData}
                endAngle={endAngle}
                colorScale={colorMap}
                labels={({ datum }) =>
                  `${TextHelper.removeChar(datum.x, "_")}: ${datum.y}`
                }
                width={200} // Set desired width
                height={170} // Set desired height
                padding={{ top: 20, bottom: 20, left: 20, right: 20 }}
                style={{
                  labels: { fontSize: 12, fill: "#333" },
                }}
                innerRadius={50}
                labelComponent={
                  <VictoryTooltip
                    flyoutStyle={{
                      fill: "white",
                      stroke: "gray",
                      strokeWidth: 0.5,
                      filter: "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1))",
                      pointerEvents: "none",
                      textAnchor: "middle",
                    }}
                    pointerOrientation="top"
                    cornerRadius={5}
                    center={{ x: 100, y: -10 }}
                  />
                }
                animate={{
                  duration: 2000,
                  onLoad: { duration: 1000 },
                }}
              />
            </Box>
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                pb: 3,
              }}
            >
              <Typography>No data available</Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default PostTypePieChart;
