import { ColorHelper } from '@/helpers/ColorHelper';
import { TextHelper } from '@/helpers/TextHelper';
import { LeadAnalyticsDto } from '@/models/dtos/LeadsDto';
import { DateFilterEnum } from '@/models/enum-models/DateFIlterEnum';
import { LeadTypeEnum } from '@/models/enum-models/LeadTypeEnum';
import { useLeadTrackingStore } from '@/store/leads-tracking/useLeadTrackingStore';
import { Box, Grid, ListItemText, MenuItem, Select, Typography, useMediaQuery } from '@mui/material';
import { FaCalendarAlt } from 'react-icons/fa';
import DynamicEngagementBarChart from '../charts/DynamicEngagementsBarChart';
import PostTypePieChart from '../charts/PostTypePieChart';
import ComparisonBarChart from '../charts/benchmark/ComparisonBarChart';

function roundDownOrLimit(num?: number): number {
  if (!num) return 1;

  if (num > 1000) {
    return 1000;
  }
  return Math.floor(num);
}

interface AnalyticsTabProps {
  leadAnalyticsData: LeadAnalyticsDto | null | undefined;
  leadType?: LeadTypeEnum;
  loading?: boolean;
}
const AnalyticsTab = ({ leadAnalyticsData, loading }: AnalyticsTabProps) => {
  const filtersStore = useLeadTrackingStore((state: any) => state);

  const isMobile = useMediaQuery('(max-width:800px)');

  const colors = ['#CD1B78', '#DFDFDF', '#141416'];

  const leadSourcesBreakdownData = Object.entries(leadAnalyticsData?.lead_sources_breakdown ?? {}).map(([source, value]) => ({ x: source, y: value }));

  const leadDistributionByIndustryData = Object.entries(leadAnalyticsData?.leads_by_industry ?? {}).map(([source, value]) => ({ date: source, value: value }));

  const xAxisData = Object.keys(leadAnalyticsData?.interest_by_platform ?? {});
  const platforms = Object.keys(leadAnalyticsData?.lead_sources_breakdown ?? {});

  const yAxisData = platforms.map((platform, index) => ({
    label: platform,
    color: colors[index] ?? ColorHelper.generateRandomColor(platform),
    data: xAxisData.map((val) => roundDownOrLimit((leadAnalyticsData?.interest_by_platform as any)?.[val][platform])),
  }));

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography>Loading analytics...</Typography>
      </Box>
    );
  }

  if (!leadAnalyticsData) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography>No analytics data available</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: '#FAFAFA',
        width: '100%',
        py: 4,
        px: { xs: 2, sm: 4, md: 6 },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
          gap: '20px',
          my: 4,
          width: '100%',
        }}
      >
        <Select
          labelId="icon-select-label"
          value={filtersStore.dateFilter ?? 'Select Date Range'}
          onChange={(e) => {
            filtersStore.setDateFilter?.(e.target.value);
          }}
          sx={{
            backgroundColor: '#fff',
            width: '100%',
            height: '48px',
            maxWidth: '300px',
            color: '#7E7E7E',
            '& .MuiSelect-select': {
              fontSize: '14px !important',
            },
          }}
          startAdornment={<FaCalendarAlt size={20} />}
        >
          <MenuItem disabled value={'Select Date Range'}>
            <ListItemText
              primary={'Select Date Range'}
              sx={{
                ml: 1,
                fontSize: '14px', // Adjusts the font size inside the dropdown
              }}
            />
          </MenuItem>
          {Object.values(DateFilterEnum).map((fil) => (
            <MenuItem value={fil} key={fil}>
              <ListItemText
                primary={TextHelper.removeChar(fil, '_')}
                sx={{
                  ml: 1,
                  fontSize: '14px', // Adjusts the font size inside the dropdown
                }}
              />
            </MenuItem>
          ))}
        </Select>
      </Box>
      {/* ✅ End of Filter Section */}
      <Grid container spacing={3} alignItems="stretch" mt={2}>
        {/* Lead Sources Breakdown Chart */}
        <Grid item xs={12} md={5}>
          <Box
            p={3}
            borderRadius={2}
            bgcolor="white"
            sx={{
              boxShadow: '-1px -1px 2px 1px #0000000D',
              borderRadius: '10px',
              height: '100%', // Ensure it stretches to match height
            }}
          >
            <PostTypePieChart
              data={leadSourcesBreakdownData}
              xKey="x"
              yKey="y"
              title="Lead Sources Breakdown"
              subtitle="See which platforms drive the most leads."
              colorSet={colors}
              isLoading={loading}
            />
          </Box>
        </Grid>

        {/* Leads Distribution By Industry Chart */}
        <Grid item xs={12} md={7}>
          <Box
            p={3}
            borderRadius={2}
            bgcolor="white"
            sx={{
              boxShadow: '-1px -1px 2px 1px #0000000D',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
              gap: '20px',
              borderRadius: '10px',
              height: '100%', // Ensure it stretches to match height
            }}
          >
            <Typography fontWeight={600} variant="h6" fontSize={24} color="#181818">
              Leads Distribution By Industry
            </Typography>
            <DynamicEngagementBarChart
              data={leadDistributionByIndustryData}
              noYLabel
              gridVertical
              gridHorizontal
              colors={['#CD1B78CC']}
              height={350}
              width={undefined}
              loading={loading}
              loadingType="placeholder"
              tickPlacement="end"
              tickLabelPlacement="tick"
            />
          </Box>
        </Grid>
      </Grid>

      <Box
        p={3}
        borderRadius={2}
        bgcolor="white"
        sx={{
          boxShadow: '-1px -1px 8px 3px #0000000D',
          borderRadius: '10px',
          width: '100%',
        }}
        mt={4}
      >
        <ComparisonBarChart
          title="Interest Level By Platforms"
          description="Comparing Lead Interest Levels Across Various Platforms"
          series={yAxisData}
          xAxisData={xAxisData}
          yAxisLabel=""
          gridVertical
          gridHorizontal
          loading={loading}
          width={undefined}
        />
      </Box>
    </Box>
  );
};

export default AnalyticsTab;
