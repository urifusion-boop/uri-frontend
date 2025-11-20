import { Box, Grid, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { WorkflowAnalyticsService, WorkflowStats, WorkflowTrend } from '@/api/WorkflowAnalyticsService';
import ReusableBarChart from '@/components/charts/ReuseableBarChart';
import ReusableLineChart from '@/components/charts/ReusableLineChart';
import LoaderWrapper from '@/components/atoms/LoaderWrapper';
import useCustomTheme from '@/hooks/theme.hook';

const WORKFLOW_NAMES: Record<string, string> = {
  'social-listening': 'Social Listening',
  'lead-generation': 'Lead Generation',
  'crm': 'CRM',
};

const WorkflowAnalyticsTab = () => {
  const { themeColors } = useCustomTheme();
  const [workflowStats, setWorkflowStats] = useState<WorkflowStats[]>([]);
  const [trends, setTrends] = useState<WorkflowTrend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [statsRes, trendsRes] = await Promise.all([
          WorkflowAnalyticsService.getWorkflowStats(),
          WorkflowAnalyticsService.getAdoptionTrend(30),
        ]);

        if (statsRes.status && statsRes.responseData) {
          setWorkflowStats(statsRes.responseData);
        }

        if (trendsRes.status && trendsRes.responseData) {
          setTrends(trendsRes.responseData);
        }
      } catch (error) {
        console.error('Error fetching workflow analytics:', error);
        toast.error('Failed to load workflow analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const totalSelections = workflowStats.reduce((sum, stat) => sum + stat.count, 0);
  const totalUsers = workflowStats.reduce((sum, stat) => sum + stat.uniqueUsers, 0);

  return (
    <Box sx={{ mt: 3 }}>
      <LoaderWrapper isLoading={loading} numberOfSkeletons={3} skeletonHeight="200px">
        {/* Summary Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                p: 3,
                boxShadow: '1px 1px 6px 3px #00000011',
              }}
            >
              <Typography sx={{ fontSize: 14, color: '#666', mb: 1 }}>Total Workflow Selections</Typography>
              <Typography sx={{ fontSize: 32, fontWeight: 700, color: themeColors.primary }}>
                {totalSelections}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                p: 3,
                boxShadow: '1px 1px 6px 3px #00000011',
              }}
            >
              <Typography sx={{ fontSize: 14, color: '#666', mb: 1 }}>Unique Users</Typography>
              <Typography sx={{ fontSize: 32, fontWeight: 700, color: themeColors.primary }}>
                {totalUsers}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                p: 3,
                boxShadow: '1px 1px 6px 3px #00000011',
              }}
            >
              <Typography sx={{ fontSize: 14, color: '#666', mb: 1 }}>Most Popular</Typography>
              <Typography sx={{ fontSize: 24, fontWeight: 700, color: themeColors.primary }}>
                {workflowStats.length > 0
                  ? WORKFLOW_NAMES[
                      workflowStats.reduce((prev, curr) =>
                        prev.count > curr.count ? prev : curr
                      )._id
                    ] || 'N/A'
                  : 'N/A'}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Workflow Popularity Bar Chart */}
        <Box
          sx={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            p: 3,
            boxShadow: '1px 1px 6px 3px #00000011',
            mb: 4,
          }}
        >
          <Typography sx={{ fontSize: 18, fontWeight: 600, mb: 3 }}>Workflow Popularity</Typography>
          {workflowStats.length > 0 ? (
            <ReusableBarChart
              height={300}
              xAxis={[
                {
                  scaleType: 'band',
                  data: workflowStats.map((stat) => WORKFLOW_NAMES[stat._id] || stat._id),
                },
              ]}
              series={[
                {
                  data: workflowStats.map((stat) => stat.count),
                  label: 'Selections',
                  color: '#CD1B78',
                },
              ]}
              grid={{ horizontal: true }}
            />
          ) : (
            <Typography sx={{ textAlign: 'center', color: '#666', py: 4 }}>
              No workflow data available yet
            </Typography>
          )}
        </Box>

        {/* Workflow Adoption Trends */}
        <Box
          sx={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            p: 3,
            boxShadow: '1px 1px 6px 3px #00000011',
          }}
        >
          <Typography sx={{ fontSize: 18, fontWeight: 600, mb: 3 }}>Adoption Trends (Last 30 Days)</Typography>
          {trends.length > 0 ? (
            <ReusableLineChart
              height={300}
              xAxis={[
                {
                  scaleType: 'point',
                  data: trends.map((t) => new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
                },
              ]}
              series={[
                {
                  data: trends.map((t) => t.count),
                  label: 'Selections',
                  color: '#CD1B78',
                },
              ]}
              grid={{ horizontal: true }}
            />
          ) : (
            <Typography sx={{ textAlign: 'center', color: '#666', py: 4 }}>
              No trend data available yet
            </Typography>
          )}
        </Box>

        {/* Detailed Stats Table */}
        <Box
          sx={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            p: 3,
            boxShadow: '1px 1px 6px 3px #00000011',
            mt: 4,
          }}
        >
          <Typography sx={{ fontSize: 18, fontWeight: 600, mb: 3 }}>Detailed Breakdown</Typography>
          <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                  <th style={{ textAlign: 'left', padding: '12px', color: '#666', fontWeight: 600 }}>Workflow</th>
                  <th style={{ textAlign: 'right', padding: '12px', color: '#666', fontWeight: 600 }}>Total Selections</th>
                  <th style={{ textAlign: 'right', padding: '12px', color: '#666', fontWeight: 600 }}>Unique Users</th>
                </tr>
              </thead>
              <tbody>
                {workflowStats.map((stat) => (
                  <tr key={stat._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '12px', fontWeight: 500 }}>
                      {WORKFLOW_NAMES[stat._id] || stat._id}
                    </td>
                    <td style={{ textAlign: 'right', padding: '12px' }}>{stat.count}</td>
                    <td style={{ textAlign: 'right', padding: '12px' }}>{stat.uniqueUsers}</td>
                  </tr>
                ))}
                {workflowStats.length === 0 && (
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'center', padding: '24px', color: '#666' }}>
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </Box>
        </Box>
      </LoaderWrapper>
    </Box>
  );
};

export default WorkflowAnalyticsTab;
