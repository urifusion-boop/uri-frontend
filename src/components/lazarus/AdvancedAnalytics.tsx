import { Box, Card, Chip, Grid, LinearProgress, Paper, Typography } from '@mui/material';

interface AnalyticsData {
  resurrection_funnel: {
    contacts_monitored: number;
    scans_completed: number;
    alerts_created: number;
    contacts_reached: number;
    deals_resurrected: number;
    resurrection_rate: number;
  };
  signal_performance: {
    signal_type: string;
    detected: number;
    contacted: number;
    resurrected: number;
    conversion_rate: number;
  }[];
  roi_metrics: {
    leads_resurrected: number;
    avg_deal_value: number;
    total_revenue: number;
    monthly_cost: number;
    time_invested_hours: number;
    hourly_rate: number;
    total_cost: number;
    roi_percentage: number;
  };
  platform_performance: {
    platform: string;
    posts_scanned: number;
    signals_found: number;
    success_rate: number;
  }[];
}

interface AdvancedAnalyticsProps {
  data: AnalyticsData | null;
  loading?: boolean;
}

const AdvancedAnalytics = ({ data, loading }: AdvancedAnalyticsProps) => {
  if (loading) {
    return (
      <Box p={4}>
        <LinearProgress />
        <Typography textAlign="center" mt={2} color="#666">
          Loading advanced analytics...
        </Typography>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box p={4}>
        <Typography textAlign="center" color="#666">
          No analytics data available
        </Typography>
      </Box>
    );
  }

  const funnel = data.resurrection_funnel;
  const roi = data.roi_metrics;

  return (
    <Box>
      {/* Resurrection Funnel */}
      <Card sx={{ p: 4, mb: 3, background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)', border: '2px solid #667eea30' }}>
        <Typography fontSize="20px" fontWeight={700} color="#667eea" mb={3}>
          📊 RESURRECTION FUNNEL (Last 30 Days)
        </Typography>

        <Box sx={{ maxWidth: 600, mx: 'auto' }}>
          {/* Contacts Monitored */}
          <Box mb={3}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
              <Typography fontSize="14px" fontWeight={600} color="#333">
                Contacts Monitored
              </Typography>
              <Typography fontSize="24px" fontWeight={700} color="#667eea">
                {funnel.contacts_monitored}
              </Typography>
            </Box>
            <LinearProgress variant="determinate" value={100} sx={{ height: 8, borderRadius: 4, backgroundColor: '#E5E7EB' }} />
          </Box>

          {/* Scans Completed */}
          <Box mb={3}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
              <Typography fontSize="14px" fontWeight={600} color="#333">
                Scans Completed ({funnel.contacts_monitored > 0 ? Math.round((funnel.scans_completed / funnel.contacts_monitored) * 100) : 0}%)
              </Typography>
              <Typography fontSize="24px" fontWeight={700} color="#667eea">
                {funnel.scans_completed}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={funnel.contacts_monitored > 0 ? (funnel.scans_completed / funnel.contacts_monitored) * 100 : 0}
              sx={{ height: 8, borderRadius: 4, backgroundColor: '#E5E7EB', '& .MuiLinearProgress-bar': { background: '#667eea' } }}
            />
          </Box>

          {/* Alerts Created */}
          <Box mb={3}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
              <Typography fontSize="14px" fontWeight={600} color="#333">
                Alerts Created ({funnel.scans_completed > 0 ? Math.round((funnel.alerts_created / funnel.scans_completed) * 100) : 0}%)
              </Typography>
              <Typography fontSize="24px" fontWeight={700} color="#EF4444">
                {funnel.alerts_created}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={funnel.scans_completed > 0 ? (funnel.alerts_created / funnel.scans_completed) * 100 : 0}
              sx={{ height: 8, borderRadius: 4, backgroundColor: '#E5E7EB', '& .MuiLinearProgress-bar': { background: '#EF4444' } }}
            />
          </Box>

          {/* Contacts Reached */}
          <Box mb={3}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
              <Typography fontSize="14px" fontWeight={600} color="#333">
                Contacts Reached ({funnel.alerts_created > 0 ? Math.round((funnel.contacts_reached / funnel.alerts_created) * 100) : 0}%)
              </Typography>
              <Typography fontSize="24px" fontWeight={700} color="#3B82F6">
                {funnel.contacts_reached}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={funnel.alerts_created > 0 ? (funnel.contacts_reached / funnel.alerts_created) * 100 : 0}
              sx={{ height: 8, borderRadius: 4, backgroundColor: '#E5E7EB', '& .MuiLinearProgress-bar': { background: '#3B82F6' } }}
            />
          </Box>

          {/* Deals Resurrected */}
          <Box mb={3}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
              <Typography fontSize="14px" fontWeight={600} color="#333">
                Deals Resurrected 🎯 ({funnel.contacts_reached > 0 ? Math.round((funnel.deals_resurrected / funnel.contacts_reached) * 100) : 0}%)
              </Typography>
              <Typography fontSize="32px" fontWeight={700} color="#10B981">
                {funnel.deals_resurrected}
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={funnel.contacts_reached > 0 ? (funnel.deals_resurrected / funnel.contacts_reached) * 100 : 0}
              sx={{ height: 12, borderRadius: 6, backgroundColor: '#E5E7EB', '& .MuiLinearProgress-bar': { background: 'linear-gradient(90deg, #10B981 0%, #059669 100%)' } }}
            />
          </Box>

          {/* Resurrection Rate */}
          <Box
            sx={{
              mt: 4,
              p: 3,
              background: funnel.resurrection_rate >= 15 ? 'linear-gradient(135deg, #10B98115 0%, #05966915 100%)' : 'linear-gradient(135deg, #EF444415 0%, #DC262615 100%)',
              borderRadius: '12px',
              border: funnel.resurrection_rate >= 15 ? '2px solid #10B981' : '2px solid #EF4444',
            }}
          >
            <Typography fontSize="16px" fontWeight={700} color={funnel.resurrection_rate >= 15 ? '#10B981' : '#EF4444'} textAlign="center">
              Resurrection Rate: {funnel.resurrection_rate.toFixed(1)}% {funnel.resurrection_rate >= 15 ? '✅ Above Goal!' : '(Goal: >15%)'}
            </Typography>
          </Box>
        </Box>
      </Card>

      {/* Signal Performance Matrix & ROI Calculator */}
      <Grid container spacing={3} mb={3}>
        {/* Signal Performance */}
        <Grid item xs={12} md={7}>
          <Card sx={{ p: 3, height: '100%' }}>
            <Typography fontSize="18px" fontWeight={700} color="#333" mb={2}>
              🎯 Signal Performance Matrix
            </Typography>
            <Box sx={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #E5E7EB' }}>
                    <th style={{ padding: '12px 8px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#666' }}>Signal Type</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#666' }}>Detected</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#666' }}>Contacted</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#666' }}>Resurrected</th>
                    <th style={{ padding: '12px 8px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#666' }}>Conversion</th>
                  </tr>
                </thead>
                <tbody>
                  {data.signal_performance.map((signal, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #F3F4F6' }}>
                      <td style={{ padding: '12px 8px', fontSize: '13px', fontWeight: 600 }}>{signal.signal_type}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', fontSize: '14px', fontWeight: 600, color: '#667eea' }}>{signal.detected}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', fontSize: '14px', fontWeight: 600, color: '#3B82F6' }}>{signal.contacted}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center', fontSize: '14px', fontWeight: 600, color: '#10B981' }}>{signal.resurrected}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'center' }}>
                        <Chip
                          label={`${signal.conversion_rate}%`}
                          size="small"
                          sx={{
                            background: signal.conversion_rate >= 30 ? '#10B98120' : signal.conversion_rate >= 15 ? '#F5970720' : '#EF444420',
                            color: signal.conversion_rate >= 30 ? '#10B981' : signal.conversion_rate >= 15 ? '#F59707' : '#EF4444',
                            fontWeight: 700,
                          }}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>
          </Card>
        </Grid>

        {/* ROI Calculator */}
        <Grid item xs={12} md={5}>
          <Card sx={{ p: 3, height: '100%', background: 'linear-gradient(135deg, #10B98115 0%, #05966915 100%)', border: '2px solid #10B981' }}>
            <Typography fontSize="18px" fontWeight={700} color="#10B981" mb={2}>
              💰 RETURN ON INVESTMENT
            </Typography>

            <Box mb={2}>
              <Typography fontSize="13px" color="#666" mb={0.5}>
                Leads Resurrected: <strong>{roi.leads_resurrected}</strong>
              </Typography>
              <Typography fontSize="13px" color="#666" mb={0.5}>
                × Average Deal Value: <strong>${roi.avg_deal_value.toLocaleString()}</strong>
              </Typography>
              <Typography fontSize="16px" fontWeight={700} color="#10B981" mt={1}>
                = Total Revenue: ${roi.total_revenue.toLocaleString()}
              </Typography>
            </Box>

            <Box mb={2} pt={2} borderTop="1px solid #10B98140">
              <Typography fontSize="13px" color="#666" mb={0.5}>
                - Lazarus Cost: <strong>${roi.monthly_cost}/month</strong>
              </Typography>
              <Typography fontSize="13px" color="#666" mb={0.5}>
                - Time Invested:{' '}
                <strong>
                  {roi.time_invested_hours}h × ${roi.hourly_rate}/hr = ${roi.time_invested_hours * roi.hourly_rate}
                </strong>
              </Typography>
              <Typography fontSize="16px" fontWeight={700} color="#333" mt={1}>
                = Total Cost: ${roi.total_cost.toLocaleString()}
              </Typography>
            </Box>

            <Box sx={{ mt: 3, p: 2.5, background: '#10B981', borderRadius: '12px' }}>
              <Typography fontSize="24px" fontWeight={700} color="#fff" textAlign="center">
                🎯 ROI: {roi.roi_percentage.toLocaleString()}%
              </Typography>
            </Box>
          </Card>
        </Grid>
      </Grid>

      {/* Platform Performance */}
      <Card sx={{ p: 3 }}>
        <Typography fontSize="18px" fontWeight={700} color="#333" mb={2}>
          📱 Platform Performance
        </Typography>
        <Grid container spacing={2}>
          {data.platform_performance.map((platform, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Paper sx={{ p: 2.5, textAlign: 'center', background: '#F9FAFB' }}>
                <Typography fontSize="16px" fontWeight={700} color="#333" mb={1}>
                  {platform.platform}
                </Typography>
                <Typography fontSize="28px" fontWeight={700} color="#667eea">
                  {platform.success_rate.toFixed(1)}%
                </Typography>
                <Typography fontSize="12px" color="#666" mt={1}>
                  {platform.signals_found} signals / {platform.posts_scanned} posts
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Card>
    </Box>
  );
};

export default AdvancedAnalytics;
