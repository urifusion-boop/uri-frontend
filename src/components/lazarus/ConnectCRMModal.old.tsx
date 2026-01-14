import { LazarusService } from '@/api/LazarusService';
import CloseIcon from '@mui/icons-material/Close';
import { Alert, Box, Button, Card, CircularProgress, Dialog, DialogContent, DialogTitle, IconButton, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaCheckCircle } from 'react-icons/fa';
import { SiHubspot, SiSalesforce } from 'react-icons/si';

interface ConnectCRMModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  onSuccess: () => void;
}

type CRMType = 'hubspot' | 'salesforce';

interface CRMConnection {
  crm_type: CRMType;
  connected: boolean;
  connected_at?: string;
  last_sync?: string;
}

const ConnectCRMModal: React.FC<ConnectCRMModalProps> = ({ open, onClose, userId, onSuccess }) => {
  const [selectedCRM, setSelectedCRM] = useState<CRMType | null>(null);
  const [loading, setLoading] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<CRMConnection | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    if (open && userId) {
      checkCRMStatus();
    }
  }, [open, userId]);

  const checkCRMStatus = async () => {
    setChecking(true);
    try {
      const response = await LazarusService.getCRMStatus(userId);
      if (response.status && response.responseData) {
        setConnectionStatus(response.responseData);
      }
    } catch (error) {
      console.error('Failed to check CRM status:', error);
    } finally {
      setChecking(false);
    }
  };

  const handleConnect = async (crmType: CRMType) => {
    setLoading(true);
    setSelectedCRM(crmType);

    try {
      // Request OAuth URL from backend
      const response = await LazarusService.initiateCRMConnection(userId, crmType);

      if (response.status && response.responseData?.authorization_url) {
        const authUrl = response.responseData.authorization_url;

        // Open OAuth flow in popup
        const width = 600;
        const height = 700;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        const popup = window.open(authUrl, `${crmType}-oauth`, `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no`);

        // Listen for OAuth callback
        const checkPopup = setInterval(() => {
          if (popup && popup.closed) {
            clearInterval(checkPopup);
            setLoading(false);
            // Check if connection succeeded
            checkCRMStatus();
          }
        }, 500);

        // Listen for postMessage from OAuth callback
        const handleMessage = (event: MessageEvent) => {
          if (event.data.type === 'crm-oauth-success') {
            clearInterval(checkPopup);
            if (popup) popup.close();
            toast.success(`${crmType === 'hubspot' ? 'HubSpot' : 'Salesforce'} connected successfully!`);
            checkCRMStatus();
            onSuccess();
          } else if (event.data.type === 'crm-oauth-error') {
            clearInterval(checkPopup);
            if (popup) popup.close();
            toast.error(`Failed to connect ${crmType === 'hubspot' ? 'HubSpot' : 'Salesforce'}`);
            setLoading(false);
          }
        };

        window.addEventListener('message', handleMessage);

        // Cleanup
        setTimeout(() => {
          window.removeEventListener('message', handleMessage);
        }, 300000); // 5 minutes timeout
      } else {
        throw new Error('Failed to get authorization URL');
      }
    } catch (error: any) {
      console.error(`Failed to connect ${crmType}:`, error);
      toast.error(error.response?.data?.responseMessage || `Failed to connect ${crmType}`);
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!connectionStatus) return;

    try {
      setLoading(true);
      const response = await LazarusService.disconnectCRM(userId);

      if (response.status) {
        toast.success('CRM disconnected successfully');
        setConnectionStatus(null);
        onClose();
      } else {
        throw new Error('Failed to disconnect');
      }
    } catch (error) {
      console.error('Failed to disconnect CRM:', error);
      toast.error('Failed to disconnect CRM');
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setLoading(true);
      const response = await LazarusService.syncCRM(userId);

      if (response.status && response.responseData) {
        const { contacts_added, companies_added } = response.responseData;
        toast.success(`Synced ${contacts_added} contacts and ${companies_added} companies!`);
        onSuccess();
      } else {
        throw new Error('Sync failed');
      }
    } catch (error) {
      console.error('Failed to sync CRM:', error);
      toast.error('Failed to sync CRM data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          maxWidth: 650,
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h5" fontWeight={700} color="#111827">
              Connect Your CRM
            </Typography>
            <Typography variant="body2" color="#6B7280" mt={0.5}>
              Automatically sync your stalled deals and closed-lost leads
            </Typography>
          </Box>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pb: 4 }}>
        {checking ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CircularProgress size={40} sx={{ color: '#7C3AED' }} />
            <Typography variant="body2" color="#6B7280" mt={2}>
              Checking CRM connection status...
            </Typography>
          </Box>
        ) : connectionStatus?.connected ? (
          // Already Connected
          <Box>
            <Alert severity="success" sx={{ mb: 3 }}>
              <Typography fontWeight={600}>{connectionStatus.crm_type === 'hubspot' ? 'HubSpot' : 'Salesforce'} is connected!</Typography>
              <Typography variant="caption" display="block" mt={0.5}>
                Connected on {connectionStatus.connected_at ? new Date(connectionStatus.connected_at).toLocaleDateString() : 'Unknown'}
              </Typography>
              {connectionStatus.last_sync && (
                <Typography variant="caption" display="block">
                  Last synced: {new Date(connectionStatus.last_sync).toLocaleString()}
                </Typography>
              )}
            </Alert>

            <Box display="flex" gap={2}>
              <Button
                variant="contained"
                onClick={handleSync}
                disabled={loading}
                sx={{
                  background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
                  color: '#fff',
                  flex: 1,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(135deg, #6D28D9 0%, #4C1D95 100%)',
                  },
                }}
              >
                {loading ? 'Syncing...' : 'Sync Now'}
              </Button>
              <Button
                variant="outlined"
                onClick={handleDisconnect}
                disabled={loading}
                sx={{
                  borderColor: '#DC2626',
                  color: '#DC2626',
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: '#B91C1C',
                    backgroundColor: '#FEE2E2',
                  },
                }}
              >
                Disconnect
              </Button>
            </Box>
          </Box>
        ) : (
          // Not Connected - Show Options
          <Box>
            <Typography variant="body2" color="#6B7280" mb={3}>
              Choose your CRM platform to connect. We'll automatically sync your leads and notify you of buying signals.
            </Typography>

            {/* HubSpot Card */}
            <Card
              onClick={() => !loading && handleConnect('hubspot')}
              sx={{
                p: 3,
                mb: 2,
                cursor: loading ? 'not-allowed' : 'pointer',
                border: '2px solid #E5E7EB',
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                opacity: loading && selectedCRM !== 'hubspot' ? 0.5 : 1,
                '&:hover': {
                  borderColor: loading ? '#E5E7EB' : '#FF7A59',
                  boxShadow: loading ? 'none' : '0 4px 12px rgba(255, 122, 89, 0.2)',
                },
              }}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '12px',
                    background: '#FF7A59',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <SiHubspot size={32} color="#fff" />
                </Box>
                <Box flex={1}>
                  <Typography variant="h6" fontWeight={700} color="#111827">
                    HubSpot
                  </Typography>
                  <Typography variant="body2" color="#6B7280" fontSize="13px">
                    Sync contacts, deals, and pipeline data
                  </Typography>
                </Box>
                {loading && selectedCRM === 'hubspot' && <CircularProgress size={24} sx={{ color: '#FF7A59' }} />}
              </Box>

              <List dense sx={{ mt: 2 }}>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <FaCheckCircle size={14} color="#10B981" />
                  </ListItemIcon>
                  <ListItemText primary="Auto-sync stalled & closed-lost deals" primaryTypographyProps={{ fontSize: '13px', color: '#374151' }} />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <FaCheckCircle size={14} color="#10B981" />
                  </ListItemIcon>
                  <ListItemText primary="Sync insights back to HubSpot" primaryTypographyProps={{ fontSize: '13px', color: '#374151' }} />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <FaCheckCircle size={14} color="#10B981" />
                  </ListItemIcon>
                  <ListItemText primary="Read-only access (we don't modify your data)" primaryTypographyProps={{ fontSize: '13px', color: '#374151' }} />
                </ListItem>
              </List>
            </Card>

            {/* Salesforce Card */}
            <Card
              onClick={() => !loading && handleConnect('salesforce')}
              sx={{
                p: 3,
                cursor: loading ? 'not-allowed' : 'pointer',
                border: '2px solid #E5E7EB',
                borderRadius: '12px',
                transition: 'all 0.3s ease',
                opacity: loading && selectedCRM !== 'salesforce' ? 0.5 : 1,
                '&:hover': {
                  borderColor: loading ? '#E5E7EB' : '#00A1E0',
                  boxShadow: loading ? 'none' : '0 4px 12px rgba(0, 161, 224, 0.2)',
                },
              }}
            >
              <Box display="flex" alignItems="center" gap={2}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '12px',
                    background: '#00A1E0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <SiSalesforce size={32} color="#fff" />
                </Box>
                <Box flex={1}>
                  <Typography variant="h6" fontWeight={700} color="#111827">
                    Salesforce
                  </Typography>
                  <Typography variant="body2" color="#6B7280" fontSize="13px">
                    Sync leads, opportunities, and accounts
                  </Typography>
                </Box>
                {loading && selectedCRM === 'salesforce' && <CircularProgress size={24} sx={{ color: '#00A1E0' }} />}
              </Box>

              <List dense sx={{ mt: 2 }}>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <FaCheckCircle size={14} color="#10B981" />
                  </ListItemIcon>
                  <ListItemText primary="Auto-sync closed-lost opportunities" primaryTypographyProps={{ fontSize: '13px', color: '#374151' }} />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <FaCheckCircle size={14} color="#10B981" />
                  </ListItemIcon>
                  <ListItemText primary="Push resurrection signals to Salesforce" primaryTypographyProps={{ fontSize: '13px', color: '#374151' }} />
                </ListItem>
                <ListItem disablePadding>
                  <ListItemIcon sx={{ minWidth: 28 }}>
                    <FaCheckCircle size={14} color="#10B981" />
                  </ListItemIcon>
                  <ListItemText primary="Enterprise-grade security & compliance" primaryTypographyProps={{ fontSize: '13px', color: '#374151' }} />
                </ListItem>
              </List>
            </Card>

            <Alert severity="info" sx={{ mt: 3 }}>
              <Typography variant="caption">
                <strong>Privacy:</strong> We only read contact names, company names, deal status, and roles. We never access sensitive data like phone numbers, emails, or financial information stored
                in your CRM.
              </Typography>
            </Alert>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ConnectCRMModal;
