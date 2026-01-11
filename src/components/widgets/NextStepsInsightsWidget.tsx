/**
 * NextStepsInsightsWidget - Dashboard widget showing aggregated next steps insights
 * Displays pending actions, priorities, and completion stats
 */

import { LeadsService } from '@/api/LeadsService';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { Box, Card, CardContent, Chip, CircularProgress, LinearProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

interface NextStepsSummary {
  total_pending_actions: number;
  by_priority: {
    high: number;
    medium: number;
    low: number;
  };
  leads_requiring_action: number;
  completed_actions_today: number;
  top_actions: Array<{ action: string; count: number }>;
}

interface NextStepsInsightsWidgetProps {
  userId: string;
}

const NextStepsInsightsWidget = ({ userId }: NextStepsInsightsWidgetProps) => {
  const [summary, setSummary] = useState<NextStepsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const response = await LeadsService.getNextStepsSummary(userId);
        if (response.status && response.responseData) {
          setSummary(response.responseData);
        }
      } catch (error) {
        console.error('Error fetching next steps summary:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchSummary();
    }
  }, [userId]);

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  if (!summary || summary.total_pending_actions === 0) {
    return (
      <Card>
        <CardContent>
          <Box textAlign="center" py={3}>
            <CheckCircleIcon sx={{ fontSize: 48, color: '#10B981', mb: 2 }} />
            <Typography variant="h6" color="#10B981" fontWeight={600}>
              All caught up!
            </Typography>
            <Typography variant="body2" color="textSecondary" mt={1}>
              No pending actions. Great work!
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  const highPriorityPercent = summary.total_pending_actions > 0 ? (summary.by_priority.high / summary.total_pending_actions) * 100 : 0;

  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" gap={1} mb={3}>
          <PendingActionsIcon sx={{ color: '#6366F1', fontSize: 24 }} />
          <Typography variant="h6" fontWeight={700}>
            🎯 Next Steps Insights
          </Typography>
        </Box>

        {/* Main Stats */}
        <Box display="grid" gridTemplateColumns="repeat(3, 1fr)" gap={2} mb={3}>
          <Box sx={{ backgroundColor: '#FEF2F2', borderRadius: 2, p: 2, textAlign: 'center' }}>
            <Typography variant="h4" fontWeight={700} color="#DC2626">
              {summary.total_pending_actions}
            </Typography>
            <Typography variant="caption" color="#991B1B">
              Pending Actions
            </Typography>
          </Box>

          <Box sx={{ backgroundColor: '#DBEAFE', borderRadius: 2, p: 2, textAlign: 'center' }}>
            <Typography variant="h4" fontWeight={700} color="#2563EB">
              {summary.leads_requiring_action}
            </Typography>
            <Typography variant="caption" color="#1E40AF">
              Leads Need Action
            </Typography>
          </Box>

          <Box sx={{ backgroundColor: '#D1FAE5', borderRadius: 2, p: 2, textAlign: 'center' }}>
            <Typography variant="h4" fontWeight={700} color="#10B981">
              {summary.completed_actions_today}
            </Typography>
            <Typography variant="caption" color="#065F46">
              Completed Today
            </Typography>
          </Box>
        </Box>

        {/* Priority Breakdown */}
        <Box mb={3}>
          <Typography variant="subtitle2" fontWeight={600} color="#374151" mb={1.5}>
            By Priority
          </Typography>

          <Box display="flex" gap={1} mb={2}>
            <Chip
              label={`🔴 High: ${summary.by_priority.high}`}
              size="small"
              sx={{
                backgroundColor: '#FEE2E2',
                color: '#991B1B',
                fontWeight: 600,
              }}
            />
            <Chip
              label={`🟡 Medium: ${summary.by_priority.medium}`}
              size="small"
              sx={{
                backgroundColor: '#FEF3C7',
                color: '#92400E',
                fontWeight: 600,
              }}
            />
            <Chip
              label={`🔵 Low: ${summary.by_priority.low}`}
              size="small"
              sx={{
                backgroundColor: '#DBEAFE',
                color: '#1E40AF',
                fontWeight: 600,
              }}
            />
          </Box>

          <Box>
            <Box display="flex" justifyContent="space-between" mb={0.5}>
              <Typography variant="caption" color="textSecondary">
                High Priority Focus
              </Typography>
              <Typography variant="caption" fontWeight={600} color={highPriorityPercent > 50 ? '#DC2626' : '#6B7280'}>
                {highPriorityPercent.toFixed(0)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={highPriorityPercent}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: '#F3F4F6',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: highPriorityPercent > 50 ? '#DC2626' : '#6366F1',
                  borderRadius: 3,
                },
              }}
            />
          </Box>
        </Box>

        {/* Top Actions */}
        {summary.top_actions && summary.top_actions.length > 0 && (
          <Box>
            <Typography variant="subtitle2" fontWeight={600} color="#374151" mb={1.5}>
              Top Action Types
            </Typography>
            {summary.top_actions.slice(0, 3).map((action, idx) => (
              <Box
                key={idx}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                py={1}
                px={1.5}
                sx={{
                  backgroundColor: idx === 0 ? '#F3F4F6' : 'transparent',
                  borderRadius: 1,
                  mb: 0.5,
                }}
              >
                <Typography variant="body2" fontSize="13px" color="#374151">
                  {action.action}
                </Typography>
                <Chip
                  label={action.count}
                  size="small"
                  sx={{
                    backgroundColor: '#E0E7FF',
                    color: '#4338CA',
                    fontWeight: 600,
                    fontSize: '11px',
                    height: 22,
                  }}
                />
              </Box>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default NextStepsInsightsWidget;
