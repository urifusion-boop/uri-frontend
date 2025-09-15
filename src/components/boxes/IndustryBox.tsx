import { IndustryEnum } from '@/models/enum-models/IndustryEnum';
import {
  Agriculture as AgricultureIcon,
  HelpOutline as DefaultIcon,
  ElectricalServices as EnergyIcon,
  AttachMoney as FinanceIcon,
  HealthAndSafety as HealthIcon,
  PrecisionManufacturing as ManufacturingIcon,
  Movie as MediaIcon,
  HomeWork as RealEstateIcon,
  ShoppingCart as RetailIcon,
  Devices as TechIcon,
  LocalShipping as TransportIcon,
} from '@mui/icons-material';
import { Box, Tooltip } from '@mui/material';

interface IndustryBoxProps {
  industry: string | null | undefined;
  size?: number;
}

const industryIconMap: Record<string, JSX.Element> = {
  [IndustryEnum.ENERGY_UTILITIES]: <EnergyIcon sx={{ color: '#FF9800' }} />,
  [IndustryEnum.MANUFACTURING_INDUSTRIAL]: <ManufacturingIcon sx={{ color: '#3F51B5' }} />,
  [IndustryEnum.TECHNOLOGY_TELECOMMUNICATIONS]: <TechIcon sx={{ color: '#2196F3' }} />,
  [IndustryEnum.HEALTHCARE_PHARMACEUTICALS]: <HealthIcon sx={{ color: '#4CAF50' }} />,
  [IndustryEnum.FINANCIAL_SERVICES]: <FinanceIcon sx={{ color: '#009688' }} />,
  [IndustryEnum.RETAIL_CONSUMER_GOODS]: <RetailIcon sx={{ color: '#795548' }} />,
  [IndustryEnum.TRANSPORTATION_LOGISTICS]: <TransportIcon sx={{ color: '#9C27B0' }} />,
  [IndustryEnum.REAL_ESTATE_CONSTRUCTION]: <RealEstateIcon sx={{ color: '#607D8B' }} />,
  [IndustryEnum.MEDIA_ENTERTAINMENT]: <MediaIcon sx={{ color: '#E91E63' }} />,
  [IndustryEnum.AGRICULTURE_FOOD_INDUSTRY]: <AgricultureIcon sx={{ color: '#8BC34A' }} />,
  [IndustryEnum.OTHER]: <DefaultIcon sx={{ color: '#9E9E9E' }} />,
};

const IndustryBox = ({ industry, size = 24 }: IndustryBoxProps) => {
  const icon = industry ? industryIconMap[industry] : <DefaultIcon sx={{ color: '#9E9E9E' }} />;
  const label = industry ?? 'Unknown';

  return (
    <Tooltip title={label}>
      <Box display="inline-flex" alignItems="center" justifyContent="center" sx={{ fontSize: size }}>
        {icon}
      </Box>
    </Tooltip>
  );
};

export default IndustryBox;
