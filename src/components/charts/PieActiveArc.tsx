import { PieChart } from '@mui/x-charts/PieChart';

const dynamicColors = [
  '#4e79a7', // blue
  '#f28e2c', // orange
  '#e15759', // red
  '#76b7b2', // teal
  '#59a14f', // green
  '#edc949', // yellow
  '#af7aa1', // purple
  '#ff9da7', // pink
  '#9c755f', // brown
  '#bab0ab', // gray
];

export default function PieActiveArc({
  data,
}: {
  data: {
    x: string;
    y: number;
  }[];
}) {
  const formattedData = data?.map((item, index) => ({
    id: item.x,
    value: item.y,
    label: `${item.x}: ${item.y}`, // Add formatted label here
    color: dynamicColors[index % dynamicColors.length],
  }));

  return (
    <>
      <PieChart
        margin={{ left: 10, right: 10 }}
        series={[
          {
            data: formattedData,
            highlightScope: { fade: 'global' },
            faded: { innerRadius: 80, additionalRadius: -30, color: 'gray' },

            color: '#FFC107',
          },
        ]}
        slotProps={{ legend: { hidden: true } }}
        rightAxis={null}
        height={250}
      />
    </>
  );
}
