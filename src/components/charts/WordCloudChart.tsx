// components/WordCloudChart.tsx

import dynamic from "next/dynamic";

const WordCloudChart = dynamic(() => import("./ClientWordCloudChart"), {
  ssr: false,
});

export default WordCloudChart;
