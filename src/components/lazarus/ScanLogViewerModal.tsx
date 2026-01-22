import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import SearchIcon from '@mui/icons-material/Search';
import TwitterIcon from '@mui/icons-material/Twitter';
import WarningIcon from '@mui/icons-material/Warning';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, LinearProgress, Typography } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

interface ScanLog {
  timestamp: string;
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
  icon?: 'linkedin' | 'twitter' | 'search' | 'check' | 'info' | 'warning' | 'error';
}

interface ScanLogViewerModalProps {
  open: boolean;
  onClose: () => void;
  scanType: 'contact' | 'company';
  scanningId?: string | null;
}

const ScanLogViewerModal: React.FC<ScanLogViewerModalProps> = ({ open, onClose, scanType, scanningId }) => {
  const [logs, setLogs] = useState<ScanLog[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const logContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs added
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  // Simulate scan progress
  useEffect(() => {
    if (open && scanningId) {
      setIsScanning(true);
      setProgress(0);
      setLogs([]);

      // Initial log
      addLog('info', `🔍 Starting ${scanType} scan...`, 'search');

      // Simulated progress updates
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 500);

      // Simulated log updates (in production, these would come from backend)
      setTimeout(() => addLog('info', '📦 Processing batch for user...', 'info'), 800);
      setTimeout(() => addLog('info', '🔍 Detecting platform type...', 'search'), 1500);
      setTimeout(() => {
        const platform = Math.random() > 0.5 ? 'linkedin' : 'twitter';
        if (platform === 'linkedin') {
          addLog('success', '✅ Platform detected: LinkedIn', 'linkedin');
          addLog('info', '🚀 Starting Apify actor to fetch LinkedIn posts...', 'linkedin');
          addLog('info', '   Deep scrape: ✅ Enabled', 'info');
          addLog('info', '   Limit per source: 10 posts', 'info');
        } else {
          addLog('success', '✅ Platform detected: Twitter/X', 'twitter');
          addLog('info', '🔍 Building Origami query...', 'twitter');
          addLog('info', '   Query: (from:handle) AND ("keywords")', 'info');
        }
      }, 2200);

      setTimeout(() => {
        const platform = Math.random() > 0.5 ? 'linkedin' : 'twitter';
        if (platform === 'linkedin') {
          addLog('info', '📦 Retrieved items from Apify dataset...', 'linkedin');
          addLog('success', `✅ Fetched ${Math.floor(Math.random() * 15 + 5)} LinkedIn posts`, 'check');
        } else {
          addLog('success', `✅ Fetched ${Math.floor(Math.random() * 20 + 10)} tweets via Origami method`, 'check');
        }
      }, 3500);

      setTimeout(() => {
        addLog('info', '🤖 Analyzing content with AI for buying signals...', 'search');
      }, 4200);

      setTimeout(() => {
        const signalDetected = Math.random() > 0.5;
        if (signalDetected) {
          addLog('success', '🎯 Buying signal detected!', 'check');
          addLog('success', '   Signal Type: Pain / Switch Intent', 'check');
          addLog('success', '   Confidence: 85%', 'check');
          addLog('info', '📬 Creating alert...', 'info');
        } else {
          addLog('info', 'ℹ️  No buying signals detected in recent posts', 'info');
        }
      }, 5500);

      setTimeout(() => {
        addLog('success', '✅ Scan completed successfully!', 'check');
        setProgress(100);
        setIsScanning(false);
      }, 6500);

      return () => {
        clearInterval(progressInterval);
      };
    }
  }, [open, scanningId, scanType]);

  const addLog = (level: ScanLog['level'], message: string, icon?: ScanLog['icon']) => {
    setLogs((prev) => [
      ...prev,
      {
        timestamp: new Date().toLocaleTimeString(),
        level,
        message,
        icon,
      },
    ]);
  };

  const getLogIcon = (log: ScanLog) => {
    if (log.icon === 'linkedin') return <LinkedInIcon fontSize="small" sx={{ color: '#0A66C2' }} />;
    if (log.icon === 'twitter') return <TwitterIcon fontSize="small" sx={{ color: '#1DA1F2' }} />;
    if (log.icon === 'search') return <SearchIcon fontSize="small" sx={{ color: '#7C3AED' }} />;
    if (log.icon === 'check') return <CheckCircleIcon fontSize="small" sx={{ color: '#10B981' }} />;
    if (log.icon === 'warning') return <WarningIcon fontSize="small" sx={{ color: '#F59E0B' }} />;
    if (log.icon === 'error') return <ErrorIcon fontSize="small" sx={{ color: '#EF4444' }} />;

    // Default icons based on level
    if (log.level === 'success') return <CheckCircleIcon fontSize="small" sx={{ color: '#10B981' }} />;
    if (log.level === 'warning') return <WarningIcon fontSize="small" sx={{ color: '#F59E0B' }} />;
    if (log.level === 'error') return <ErrorIcon fontSize="small" sx={{ color: '#EF4444' }} />;
    return <InfoIcon fontSize="small" sx={{ color: '#6B7280' }} />;
  };

  const getLogColor = (level: ScanLog['level']) => {
    switch (level) {
      case 'success':
        return '#10B981';
      case 'warning':
        return '#F59E0B';
      case 'error':
        return '#EF4444';
      default:
        return '#374151';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={isScanning ? undefined : onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(124, 58, 237, 0.2)',
          minHeight: '600px',
        },
      }}
    >
      <DialogTitle sx={{ pb: 2, borderBottom: '1px solid #F3F4F6' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1.5}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(124, 58, 237, 0.4)',
              }}
            >
              <SearchIcon sx={{ color: '#fff', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={700} color="#1A1A1A" letterSpacing="-0.02em">
                Live Scan Monitor
              </Typography>
              <Typography fontSize="12px" color="#6B7280" fontWeight={500}>
                Real-time scan progress and logs
              </Typography>
            </Box>
          </Box>
          {!isScanning && (
            <IconButton
              onClick={onClose}
              size="small"
              sx={{
                color: '#9CA3AF',
                '&:hover': {
                  backgroundColor: '#F3F4F6',
                  color: '#7C3AED',
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 3, py: 3 }}>
        {/* Progress Bar */}
        {isScanning && (
          <Box sx={{ mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography fontSize="13px" fontWeight={600} color="#374151">
                Scan Progress
              </Typography>
              <Typography fontSize="13px" fontWeight={700} color="#7C3AED">
                {progress}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: '4px',
                backgroundColor: '#E5E7EB',
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #7C3AED 0%, #A78BFA 100%)',
                  borderRadius: '4px',
                },
              }}
            />
          </Box>
        )}

        {/* Logs Container */}
        <Box
          ref={logContainerRef}
          sx={{
            backgroundColor: '#1F2937',
            borderRadius: '12px',
            padding: 2.5,
            minHeight: '400px',
            maxHeight: '400px',
            overflowY: 'auto',
            fontFamily: '"Fira Code", "Monaco", "Courier New", monospace',
            fontSize: '13px',
            lineHeight: 1.8,
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: '#374151',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#6B7280',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: '#9CA3AF',
              },
            },
          }}
        >
          {logs.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: '#9CA3AF',
              }}
            >
              <SearchIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
              <Typography fontSize="14px">Waiting for scan to start...</Typography>
            </Box>
          ) : (
            logs.map((log, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1.5,
                  mb: 1,
                  pb: 1,
                  borderBottom: index < logs.length - 1 ? '1px solid #374151' : 'none',
                }}
              >
                <Box sx={{ mt: 0.3, flexShrink: 0 }}>{getLogIcon(log)}</Box>
                <Box sx={{ flex: 1 }}>
                  <Typography fontSize="11px" color="#9CA3AF" fontWeight={500} sx={{ mb: 0.3, fontFamily: '"Fira Code", monospace' }}>
                    [{log.timestamp}]
                  </Typography>
                  <Typography
                    fontSize="13px"
                    color={getLogColor(log.level)}
                    sx={{
                      fontFamily: '"Fira Code", monospace',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {log.message}
                  </Typography>
                </Box>
              </Box>
            ))
          )}

          {isScanning && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 2 }}>
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: '#10B981',
                  animation: 'pulse 1.5s ease-in-out infinite',
                  '@keyframes pulse': {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.3 },
                  },
                }}
              />
              <Typography fontSize="12px" color="#9CA3AF" fontStyle="italic">
                Scanning in progress...
              </Typography>
            </Box>
          )}
        </Box>

        {/* Summary Stats */}
        {!isScanning && logs.length > 0 && (
          <Box
            sx={{
              mt: 3,
              p: 2,
              borderRadius: '12px',
              backgroundColor: '#F9FAFB',
              display: 'flex',
              gap: 3,
            }}
          >
            <Box>
              <Typography fontSize="11px" color="#6B7280" fontWeight={600} textTransform="uppercase">
                Total Logs
              </Typography>
              <Typography fontSize="20px" fontWeight={700} color="#1F2937">
                {logs.length}
              </Typography>
            </Box>
            <Box>
              <Typography fontSize="11px" color="#6B7280" fontWeight={600} textTransform="uppercase">
                Success
              </Typography>
              <Typography fontSize="20px" fontWeight={700} color="#10B981">
                {logs.filter((l) => l.level === 'success').length}
              </Typography>
            </Box>
            <Box>
              <Typography fontSize="11px" color="#6B7280" fontWeight={600} textTransform="uppercase">
                Warnings
              </Typography>
              <Typography fontSize="20px" fontWeight={700} color="#F59E0B">
                {logs.filter((l) => l.level === 'warning').length}
              </Typography>
            </Box>
            <Box>
              <Typography fontSize="11px" color="#6B7280" fontWeight={600} textTransform="uppercase">
                Errors
              </Typography>
              <Typography fontSize="20px" fontWeight={700} color="#EF4444">
                {logs.filter((l) => l.level === 'error').length}
              </Typography>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 0 }}>
        <Button
          onClick={onClose}
          disabled={isScanning}
          variant="outlined"
          sx={{
            borderRadius: '10px',
            textTransform: 'none',
            fontWeight: 600,
            borderColor: '#E5E7EB',
            color: '#374151',
            '&:hover': {
              borderColor: '#7C3AED',
              backgroundColor: '#7C3AED10',
            },
          }}
        >
          {isScanning ? 'Scanning...' : 'Close'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ScanLogViewerModal;
