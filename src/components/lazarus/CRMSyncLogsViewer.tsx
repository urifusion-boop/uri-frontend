import { LazarusService } from '@/api/LazarusService';
import { Box, Chip, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { FaCheckCircle, FaClock, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';

interface CRMSyncLogsViewerProps {
  userId: string;
  limit?: number;
}

interface SyncLog {
  _id: string;
  user_id: string;
  crm_type: string;
  status: 'in_progress' | 'success' | 'failed';
  started_at: string;
  completed_at?: string;
  duration_seconds?: number;
  contacts_added: number;
  companies_added: number;
  deals_processed: number;
  error_message?: string;
  error_type?: string;
}

const CRMSyncLogsViewer: React.FC<CRMSyncLogsViewerProps> = ({ userId, limit = 10 }) => {
  const [logs, setLogs] = useState<SyncLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, [userId]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const response = await LazarusService.getCRMSyncLogs(userId, limit);
      if (response.status && response.responseData) {
        setLogs(response.responseData);
      }
    } catch (error) {
      console.error('Failed to fetch sync logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'success':
        return <Chip icon={<FaCheckCircle />} label="Success" size="small" sx={{ bgcolor: '#10B981', color: '#fff', fontWeight: 600 }} />;
      case 'failed':
        return <Chip icon={<FaExclamationTriangle />} label="Failed" size="small" sx={{ bgcolor: '#DC2626', color: '#fff', fontWeight: 600 }} />;
      case 'in_progress':
        return <Chip icon={<FaSpinner />} label="In Progress" size="small" sx={{ bgcolor: '#F59E0B', color: '#fff', fontWeight: 600 }} />;
      default:
        return <Chip label={status} size="small" />;
    }
  };

  const formatDuration = (seconds?: number) => {
    if (!seconds) return '-';
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <CircularProgress size={40} sx={{ color: '#7C3AED' }} />
        <Typography variant="body2" color="#6B7280" mt={2}>
          Loading sync logs...
        </Typography>
      </Box>
    );
  }

  if (logs.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <FaClock size={40} color="#9CA3AF" />
        <Typography variant="body2" color="#6B7280" mt={2}>
          No sync logs yet. Run your first CRM sync to see history here.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} color="#111827" mb={2}>
        Sync History
      </Typography>

      <TableContainer component={Paper} sx={{ border: '1px solid #E5E7EB', borderRadius: '8px' }}>
        <Table size="small">
          <TableHead sx={{ bgcolor: '#F9FAFB' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, color: '#374151' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#374151' }}>CRM</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#374151' }}>Started</TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#374151' }}>Duration</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: '#374151' }}>
                Contacts
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: '#374151' }}>
                Companies
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: 700, color: '#374151' }}>
                Deals
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: '#374151' }}>Error</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log._id} sx={{ '&:hover': { bgcolor: '#F9FAFB' } }}>
                <TableCell>{getStatusChip(log.status)}</TableCell>
                <TableCell>
                  <Chip label={log.crm_type === 'hubspot' ? 'HubSpot' : 'Salesforce'} size="small" variant="outlined" sx={{ textTransform: 'capitalize' }} />
                </TableCell>
                <TableCell>
                  <Typography variant="caption" color="#374151">
                    {new Date(log.started_at).toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="caption" color="#6B7280">
                    {formatDuration(log.duration_seconds)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight={600} color={log.contacts_added > 0 ? '#10B981' : '#6B7280'}>
                    {log.contacts_added}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight={600} color={log.companies_added > 0 ? '#7C3AED' : '#6B7280'}>
                    {log.companies_added}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" color="#6B7280">
                    {log.deals_processed || 0}
                  </Typography>
                </TableCell>
                <TableCell>
                  {log.error_message ? (
                    <Typography
                      variant="caption"
                      color="#DC2626"
                      sx={{ maxWidth: 200, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      title={log.error_message}
                    >
                      {log.error_message}
                    </Typography>
                  ) : (
                    <Typography variant="caption" color="#9CA3AF">
                      -
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="#6B7280">
          Showing {logs.length} most recent sync{logs.length !== 1 ? 's' : ''}
        </Typography>
      </Box>
    </Box>
  );
};

export default CRMSyncLogsViewer;
