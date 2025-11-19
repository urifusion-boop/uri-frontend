import { useState, useEffect } from 'react';
import { Box, Typography, Button, Badge, Tab, Tabs, Alert, CircularProgress } from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useRealtimeLeads } from '@/hooks/leads-tracking/useRealtimeLeads.hook';
import { useAuth } from '@/providers/AuthProvider';
import RealtimeLeadNotification from './RealtimeLeadNotification';
import ConnectionStatusIndicator from './ConnectionStatusIndicator';
import { RealtimeLeadDto } from '@/models/dtos/RealtimeLeadDto';
import { BrowsercloudPlatformEnum } from '@/models/enum-models/BrowsercloudPlatformEnum';

interface RealtimeLeadsDashboardProps {
  leadFormId?: string;
  onViewLeadDetails?: (lead: RealtimeLeadDto) => void;
}

const RealtimeLeadsDashboard: React.FC<RealtimeLeadsDashboardProps> = ({
  leadFormId,
  onViewLeadDetails,
}) => {
  const { userDetails } = useAuth();
  const userId = userDetails?.userId;

  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [dismissedLeads, setDismissedLeads] = useState<Set<string>>(new Set());

  const {
    realtimeLeads,
    unreadCount,
    connectionStatus,
    status,
    isConnected,
    isConnecting,
    clearUnreadCount,
    reconnect,
  } = useRealtimeLeads({
    userId,
    leadFormId,
    autoConnect: true,
    onNewLead: (lead) => {
      console.log('New lead received:', lead);
    },
  });

  // Clear unread count when user views the dashboard
  useEffect(() => {
    if (unreadCount > 0) {
      const timer = setTimeout(() => {
        clearUnreadCount();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [unreadCount, clearUnreadCount]);

  const handleDismissLead = (leadId: string) => {
    setDismissedLeads((prev) => new Set(prev).add(leadId));
  };

  // Filter leads by platform and dismissed status
  const filteredLeads = realtimeLeads
    .filter((lead) => !dismissedLeads.has(lead.lead_id))
    .filter((lead) => {
      if (selectedPlatform === 'all') return true;
      return lead.source.platform === selectedPlatform;
    });

  // Get unique platforms from leads
  const platforms = Array.from(
    new Set(realtimeLeads.map((lead) => lead.source.platform))
  );

  const monitoringPlatforms = connectionStatus?.monitoring_platforms || [];

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsActiveIcon sx={{ fontSize: 32, color: '#3b82f6' }} />
          </Badge>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#1f2937' }}>
              Real-time Leads
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7280' }}>
              Monitor and engage with leads as they appear
            </Typography>
          </Box>
        </Box>

        <Button
          variant="outlined"
          startIcon={<FilterListIcon />}
          sx={{
            textTransform: 'none',
            borderColor: '#e5e7eb',
            color: '#4b5563',
          }}
        >
          Filters
        </Button>
      </Box>

      {/* Connection Status */}
      <Box sx={{ mb: 3 }}>
        <ConnectionStatusIndicator
          status={status}
          isConnected={isConnected}
          isConnecting={isConnecting}
          activeForms={connectionStatus?.active_forms}
          monitoringPlatforms={monitoringPlatforms}
          onReconnect={reconnect}
        />
      </Box>

      {/* Info Alert for V2 */}
      {isConnected && (
        <Alert severity="success" sx={{ mb: 3, backgroundColor: '#d1fae5', border: '1px solid #86efac' }}>
          <Typography variant="body2" sx={{ fontWeight: 500, color: '#065f46' }}>
            V2 Real-time Monitoring Active
          </Typography>
          <Typography variant="caption" sx={{ color: '#047857' }}>
            You're receiving instant notifications from {monitoringPlatforms.length} platform
            {monitoringPlatforms.length > 1 ? 's' : ''}. Leads appear here as soon as they're detected.
          </Typography>
        </Alert>
      )}

      {/* Platform Tabs */}
      {platforms.length > 0 && (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={selectedPlatform}
            onChange={(_, value) => setSelectedPlatform(value)}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '14px',
              },
            }}
          >
            <Tab label="All" value="all" />
            {platforms.map((platform) => (
              <Tab
                key={platform}
                label={platform}
                value={platform}
                icon={
                  <Badge
                    badgeContent={
                      realtimeLeads.filter(
                        (l) => l.source.platform === platform && !dismissedLeads.has(l.lead_id)
                      ).length
                    }
                    color="primary"
                    sx={{ ml: 1 }}
                  />
                }
                iconPosition="end"
              />
            ))}
          </Tabs>
        </Box>
      )}

      {/* Leads List */}
      <Box>
        {isConnecting && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
            <CircularProgress />
            <Typography variant="body2" sx={{ ml: 2, color: '#6b7280' }}>
              Connecting to real-time service...
            </Typography>
          </Box>
        )}

        {isConnected && filteredLeads.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              backgroundColor: '#f9fafb',
              borderRadius: '12px',
              border: '1px dashed #e5e7eb',
            }}
          >
            <NotificationsActiveIcon sx={{ fontSize: 64, color: '#d1d5db', mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#4b5563', mb: 1 }}>
              No leads yet
            </Typography>
            <Typography variant="body2" sx={{ color: '#6b7280' }}>
              We're monitoring your selected platforms. New leads will appear here in real-time.
            </Typography>
          </Box>
        )}

        {!isConnected && !isConnecting && (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              backgroundColor: '#fef2f2',
              borderRadius: '12px',
              border: '1px solid #fecaca',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#991b1b', mb: 1 }}>
              Connection Lost
            </Typography>
            <Typography variant="body2" sx={{ color: '#dc2626', mb: 2 }}>
              Unable to receive real-time updates. Please check your connection.
            </Typography>
            <Button variant="contained" onClick={reconnect}>
              Reconnect
            </Button>
          </Box>
        )}

        {filteredLeads.map((lead) => (
          <RealtimeLeadNotification
            key={lead.lead_id}
            lead={lead}
            onDismiss={() => handleDismissLead(lead.lead_id)}
            onViewDetails={onViewLeadDetails}
          />
        ))}
      </Box>

      {/* Footer Stats */}
      {isConnected && filteredLeads.length > 0 && (
        <Box
          sx={{
            mt: 3,
            p: 2,
            backgroundColor: '#f9fafb',
            borderRadius: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="caption" sx={{ color: '#6b7280' }}>
            Showing {filteredLeads.length} lead{filteredLeads.length > 1 ? 's' : ''}
          </Typography>
          <Typography variant="caption" sx={{ color: '#6b7280' }}>
            {dismissedLeads.size} dismissed
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default RealtimeLeadsDashboard;
