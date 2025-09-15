import { Box, Typography } from "@mui/material";
import React from "react";
import { GoDotFill } from "react-icons/go";
import LoaderWrapper from "./LoaderWrapper";

const SemiCircleIndicator: React.FC<{
  percentage: number;
  loading?: boolean;
}> = ({ percentage, loading }) => {
  const getMessage = (): string => {
    if (percentage > 70) return "Great! Sentiment is mostly positive";
    else if (percentage > 40 && percentage <= 70)
      return "Mixed sentiment detected. Keep an eye on it";
    else return "    Immediate Attention Required!";
  };

  return (
    <Box
      sx={{
        height: "100%",
      }}
    >
      <Typography
        sx={{
          color: "#181818",
          fontSize: "24px",
          fontWeight: 600,
          mb: 2,
        }}
      >
        Business Health Score
      </Typography>
      <Box
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg
          width="280"
          height="141"
          viewBox="0 0 280 141"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M280 140.5C280 103.37 265.25 67.7601 238.995 41.5051C212.74 15.25 177.13 0.500003 140 0.5C102.87 0.499997 67.2602 15.2499 41.0051 41.505C14.75 67.7601 5.79647e-06 103.37 1.89951e-07 140.5H35C35 112.652 46.0625 85.9451 65.7538 66.2538C85.4451 46.5625 112.152 35.5 140 35.5C167.848 35.5 194.555 46.5625 214.246 66.2538C233.938 85.9451 245 112.652 245 140.5H280Z"
            fill="#2CD423"
          />
          <path
            d="M72.1954 18.0151C50.2585 30.1589 31.9856 47.9712 19.2858 69.591C6.58609 91.2108 -0.074284 115.845 0.000624965 140.918L35.0005 140.814C34.9443 122.008 39.9396 103.533 49.4644 87.3182C58.9892 71.1034 72.6939 57.7441 89.1466 48.6364L72.1954 18.0151Z"
            fill="#D62525"
          />
          <path
            d="M210 19.2564C188.77 6.99951 164.695 0.531748 140.181 0.500117C115.667 0.468486 91.5743 6.87409 70.3131 19.0762L87.7349 49.4321C103.681 40.2806 121.75 35.4764 140.135 35.5001C158.521 35.5238 176.578 40.3746 192.5 49.5673L210 19.2564Z"
            fill="#ECBD16"
          />
        </svg>

        <Box
          sx={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
            bottom: 0,
          }}
        >
          <LoaderWrapper
            isLoading={loading}
            skeletonHeight="30px"
            skeletonWidth="50px"
            mb="10px"
          >
            <Typography
              sx={{
                fontWeight: "bold",
                fontSize: "32px",
                color: "#000000",
              }}
            >
              {percentage}%
            </Typography>
          </LoaderWrapper>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LoaderWrapper
          isLoading={loading}
          skeletonHeight="10px"
          skeletonWidth="150px"
        >
          <Typography
            sx={{ textAlign: "center", fontSize: "12px", color: "#000000CC" }}
          >
            {getMessage()}
          </Typography>
        </LoaderWrapper>
      </Box>
      <Box
        sx={{
          display: "flex",
          gap: "8px",
          alignItems: "center",
          justifyContent: "center",
          mt: "30px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <GoDotFill size={10} color="#D62525" />
          <Typography
            sx={{
              fontSize: "14px",
              color: "#000000",
            }}
          >
            Critical
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <GoDotFill size={10} color="#ECBE18" />
          <Typography
            sx={{
              fontSize: "14px",
              color: "#000000",
            }}
          >
            Moderate
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <GoDotFill size={10} color="#2CD423" />
          <Typography
            sx={{
              fontSize: "14px",
              color: "#000000",
            }}
          >
            Excellent
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SemiCircleIndicator;
