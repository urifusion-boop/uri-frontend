// components/ClientWordCloudChart.tsx

import { Box, Typography } from "@mui/material";
import React, { useEffect, useRef } from "react";
import WordCloud, { ListEntry } from "wordcloud";

type Word = {
  text: string;
  value: number;
};

type WordCloudChartProps = {
  words: Word[];
  width?: string;
  height?: string;
};

const ClientWordCloudChart: React.FC<WordCloudChartProps> = ({
  words,
  height,
  width,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const wordArray = words.map((word) => [word.text, word.value]);

    WordCloud(canvasRef.current, {
      list: wordArray as ListEntry[],
      gridSize: 10, // Higher gridSize for better separation
      weightFactor: 1, // Fixed weight factor
      fontFamily: "Roboto, sans-serif",
      color: () => `hsl(${Math.random() * 360}, 100%, 50%)`,
      rotateRatio: 0.5,
      rotationSteps: 2,
      backgroundColor: "#ffffff",
    });
  }, [words]);

  return words.length > 0 ? (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: height ?? 300,
        width: width ?? 300,
      }}
    >
      <canvas ref={canvasRef} width={width ?? 300} height={height ?? 300} />
    </Box>
  ) : (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: height ?? 300,
        width: width ?? 300,
        bgcolor: "background.paper",
      }}
    >
      <Typography fontSize={14} fontWeight={600}>
        No Data Available
      </Typography>
    </Box>
  );
};

export default ClientWordCloudChart;
