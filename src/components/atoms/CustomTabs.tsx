import { Box, SxProps, Typography } from '@mui/material';

import { TextHelper } from '@/helpers/TextHelper';

interface CustomTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: string[];
  tourKey?: string;
  wrapperStyles?: SxProps;
}

const CustomTabs = ({ activeTab, setActiveTab, tabs, tourKey, wrapperStyles }: CustomTabsProps) => {
  return (
    <Box display="flex" borderBottom="1px solid #E0E0E0" justifyContent="flex-start" sx={{ overflow: 'auto', my: 3, ...wrapperStyles }}>
      {tabs.map((tab) => (
        <Box
          key={tab}
          px={3}
          py={1}
          className={`${tourKey}-${tab}`}
          sx={{
            cursor: 'pointer',
            borderBottom: activeTab === tab ? '3px solid #CD1B78' : '3px solid transparent',
            transition: 'border-bottom 0.3s ease',
          }}
          onClick={() => setActiveTab(tab)}
        >
          <Typography
            style={{
              textTransform: 'capitalize',
              whiteSpace: 'nowrap',
            }}
            fontSize={14}
            fontWeight={600}
            color={activeTab === tab ? '#CD1B78' : '#6F6F6F'}
          >
            {tab === 'all-insights' ? 'All Insights' : TextHelper.removeChar(tab, '-')}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default CustomTabs;
