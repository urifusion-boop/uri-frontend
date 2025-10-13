import { Box, Typography, Tooltip, IconButton, Chip } from '@mui/material';
import { WebSocketStatus } from '@/hooks/network/webSockets.hook';
import RefreshIcon from '@mui/icons-material/Refresh';
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import SignalCellularConnectedNoInternet0BarIcon from '@mui/icons-material/SignalCellularConnectedNoInternet0Bar';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { BrowsercloudPlatformEnum, PlatformDisplayNames } from '@/models/enum-models/BrowsercloudPlatformEnum';

interface ConnectionStatusIndicatorProps {
  status: WebSocketStatus;
  isConnected: boolean;
  isConnecting: boolean;
  activeForms?: number;
  monitoringPlatforms?: BrowsercloudPlatformEnum[];
  onReconnect?: () => void;
}

const ConnectionStatusIndicator: React.FC<ConnectionStatusIndicatorProps> = ({
  status,
  isConnected,
  isConnecting,
  activeForms = 0,
  monitoringPlatforms = [],
  onReconnect,
}) => {
  const getStatusConfig = () => {
    if (isConnected) {
      return {
        color: '#10b981',
        backgroundColor: '#d1fae5',
        icon: <SignalCellularAltIcon sx={{ fontSize: 16, color: '#10b981' }} />,
        label: 'Connected',
        tooltip: 'Real-time monitoring is active',
      };
    }

    if (isConnecting) {
      return {
        color: '#f59e0b',
        backgroundColor: '#fef3c7',
        icon: <SignalCellularConnectedNoInternet0BarIcon sx={{ fontSize: 16, color: '#f59e0b' }} />,
        label: 'Connecting...',
        tooltip: 'Establishing connection to real-time service',
      };
    }

    if (status === WebSocketStatus.ERROR) {
      return {
        color: '#ef4444',
        backgroundColor: '#fee2e2',
        icon: <ErrorOutlineIcon sx={{ fontSize: 16, color: '#ef4444' }} />,
        label: 'Error',
        tooltip: 'Connection error. Click refresh to reconnect.',
      };
    }

    return {
      color: '#6b7280',
      backgroundColor: '#f3f4f6',
      icon: <SignalCellularConnectedNoInternet0BarIcon sx={{ fontSize: 16, color: '#6b7280' }} />,
      label: 'Disconnected',
      tooltip: 'Not connected to real-time service',
    };
  };

  const statusConfig = getStatusConfig();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        backgroundColor: statusConfig.backgroundColor,
        borderRadius: '12px',
        px: 2,
        py: 1.5,
        border: `1px solid ${statusConfig.color}33`,
      }}
    >
      {/* Status Indicator */}
      <Tooltip title={statusConfig.tooltip}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {statusConfig.icon}
          <Typography variant="body2" sx={{ fontWeight: 600, color: statusConfig.color }}>
            {statusConfig.label}
          </Typography>
        </Box>
      </Tooltip>

      {/* Active Forms Count */}
      {isConnected && activeForms > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography variant="caption" sx={{ color: '#6b7280' }}>
            {activeForms} active form{activeForms > 1 ? 's' : ''}
          </Typography>
        </Box>
      )}

      {/* Monitoring Platforms */}
      {isConnected && monitoringPlatforms.length > 0 && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography variant="caption" sx={{ color: '#6b7280' }}>
            •
          </Typography>
          <Typography variant="caption" sx={{ color: '#6b7280' }}>
            Monitoring:
          </Typography>
          {monitoringPlatforms.slice(0, 3).map((platform, index) => (
            <Chip
              key={index}
              label={PlatformDisplayNames[platform]}
              size="small"
              sx={{
                height: 18,
                fontSize: '10px',
                backgroundColor: '#fff',
                color: '#4b5563',
                fontWeight: 500,
              }}
            />
          ))}
          {monitoringPlatforms.length > 3 && (
            <Typography variant="caption" sx={{ color: '#6b7280' }}>
              +{monitoringPlatforms.length - 3}
            </Typography>
          )}
        </Box>
      )}

      {/* Reconnect Button */}
      {!isConnected && !isConnecting && onReconnect && (
        <Tooltip title="Reconnect">
          <IconButton
            size="small"
            onClick={onReconnect}
            sx={{
              ml: 'auto',
              backgroundColor: '#fff',
              '&:hover': {
                backgroundColor: '#f9fafb',
              },
            }}
          >
            <RefreshIcon sx={{ fontSize: 18, color: statusConfig.color }} />
          </IconButton>
        </Tooltip>
      )}

      {/* Pulse Animation for Connected Status */}
      {isConnected && (
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: statusConfig.color,
            ml: 'auto',
            animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            '@keyframes pulse': {
              '0%, 100%': {
                opacity: 1,
              },
              '50%': {
                opacity: 0.5,
              },
            },
          }}
        />
      )}
    </Box>
  );
};

export default ConnectionStatusIndicator;
