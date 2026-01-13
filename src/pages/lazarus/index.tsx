import { LazarusService } from '@/api/LazarusService';
import DashboardLayout from '@/components/atoms/DashboardLayout';
import AddCompanyMonitorModal from '@/components/lazarus/AddCompanyMonitorModal';
import AddFocusContactModal from '@/components/lazarus/AddFocusContactModal';
import CSVUploadModal from '@/components/lazarus/CSVUploadModal';
import PasteAndGoModal from '@/components/lazarus/PasteAndGoModal';
import { useAuth } from '@/providers/AuthProvider';
import { CompanyMonitor, FocusContact, LazarusAlert, LazarusAlertStatus, LazarusMetrics, LazarusMonitoringStatus } from '@/types/lazarus.types';
import AddIcon from '@mui/icons-material/Add';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import LinkIcon from '@mui/icons-material/Link';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import PersonIcon from '@mui/icons-material/Person';
import RefreshIcon from '@mui/icons-material/Refresh';
import ScienceIcon from '@mui/icons-material/Science';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Box, Button, Chip, Container, Grid, IconButton, Tab, Tabs, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const LazarusProtocolPage = () => {
  const { userDetails } = useAuth();
  const userId = userDetails?.userId;

  const [tabValue, setTabValue] = useState(0);
  const [metrics, setMetrics] = useState<LazarusMetrics | null>(null);
  const [alerts, setAlerts] = useState<LazarusAlert[]>([]);
  const [focusContacts, setFocusContacts] = useState<FocusContact[]>([]);
  const [companyMonitors, setCompanyMonitors] = useState<CompanyMonitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [showCSVUploadModal, setShowCSVUploadModal] = useState(false);
  const [showPasteAndGoModal, setShowPasteAndGoModal] = useState(false);

  useEffect(() => {
    if (userId) {
      loadDashboardData();
    } else {
      const timeout = setTimeout(() => {
        setLoading(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [userId]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Loading Lazarus data for user:', userId);

      const metricsResponse = await LazarusService.getUserMetrics(userId!);
      if (metricsResponse.responseData) {
        setMetrics(metricsResponse.responseData);
      }

      const alertsResponse = await LazarusService.getAlerts(userId!, LazarusAlertStatus.NEW, 0, 50);
      if (alertsResponse.responseData) {
        setAlerts(alertsResponse.responseData);
      }

      const contactsResponse = await LazarusService.getFocusContacts(userId!, LazarusMonitoringStatus.ACTIVE, 0, 50);
      if (contactsResponse.responseData) {
        setFocusContacts(contactsResponse.responseData);
      }

      const monitorsResponse = await LazarusService.getCompanyMonitors(userId!, LazarusMonitoringStatus.ACTIVE, 0, 50);
      if (monitorsResponse.responseData) {
        setCompanyMonitors(monitorsResponse.responseData);
      }

      console.log('✅ All Lazarus data loaded successfully');
    } catch (error) {
      console.error('❌ Failed to load Lazarus dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleContactAlert = async (alertId: string) => {
    try {
      await LazarusService.markAlertContacted(userId!, alertId);
      loadDashboardData();
    } catch (error) {
      console.error('Failed to mark alert as contacted:', error);
    }
  };

  const handleDismissAlert = async (alertId: string) => {
    try {
      await LazarusService.dismissAlert(userId!, alertId);
      loadDashboardData();
    } catch (error) {
      console.error('Failed to dismiss alert:', error);
    }
  };

  const handleDraftPitch = (alert: LazarusAlert) => {
    const pitch = alert.suggested_pitch || `Hi! I noticed ${alert.alert_message}. Would love to reconnect and see how we can help.`;

    // Copy to clipboard
    navigator.clipboard.writeText(pitch);

    // You could also open an email draft
    const subject = encodeURIComponent(`Re: ${alert.alert_message}`);
    const body = encodeURIComponent(pitch);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  const handleWhatsApp = (alert: LazarusAlert) => {
    const pitch = alert.suggested_pitch || `Hi! I noticed ${alert.alert_message}. Would love to reconnect and see how we can help.`;
    const message = encodeURIComponent(pitch);

    // Open WhatsApp Web with pre-filled message
    window.open(`https://wa.me/?text=${message}`, '_blank');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Container maxWidth="lg">
          <Box
            sx={{
              py: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
            }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1, transform: 'scale(1)' },
                  '50%': { opacity: 0.7, transform: 'scale(1.05)' },
                },
              }}
            >
              <ScienceIcon sx={{ color: '#fff', fontSize: 28 }} />
            </Box>
            <Typography variant="h6" fontWeight={600} color="#111827">
              Loading Lazarus Protocol...
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Initializing resurrection engine
            </Typography>
          </Box>
        </Container>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Header */}
        <Box mb={4} display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Box display="flex" alignItems="center" gap={1.5} mb={1}>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
                }}
              >
                <ScienceIcon sx={{ color: '#fff', fontSize: 22 }} />
              </Box>
              <Typography variant="h4" fontWeight={700} color="#111827" letterSpacing="-0.02em">
                Lazarus Protocol
              </Typography>
            </Box>
            <Typography variant="body1" color="#6B7280" fontSize="14px" fontWeight={500}>
              Automated CRM Resurrection Engine - Monitor dead leads for buying signals
            </Typography>
          </Box>
          <Box display="flex" gap={1.5}>
            <Button
              variant="outlined"
              startIcon={<LinkIcon />}
              onClick={() => setShowPasteAndGoModal(true)}
              sx={{
                borderColor: '#7C3AED40',
                color: '#7C3AED',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '13px',
                borderRadius: '8px',
                '&:hover': {
                  borderColor: '#7C3AED',
                  backgroundColor: '#7C3AED08',
                },
              }}
            >
              Paste & Go
            </Button>
            <Button
              variant="outlined"
              startIcon={<UploadFileIcon />}
              onClick={() => setShowCSVUploadModal(true)}
              sx={{
                borderColor: '#7C3AED40',
                color: '#7C3AED',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '13px',
                borderRadius: '8px',
                '&:hover': {
                  borderColor: '#7C3AED',
                  backgroundColor: '#7C3AED08',
                },
              }}
            >
              CSV Upload
            </Button>
            <IconButton
              onClick={loadDashboardData}
              sx={{
                width: 40,
                height: 40,
                color: '#7C3AED',
                '&:hover': {
                  backgroundColor: '#7C3AED10',
                  transform: 'rotate(180deg)',
                },
                transition: 'all 0.4s ease',
              }}
            >
              <RefreshIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Metrics Cards */}
        <Grid container spacing={3} mb={4}>
          <Grid item xs={12} md={3}>
            <Box
              sx={{
                borderRadius: '14px',
                background: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                border: '1px solid #F3F4F6',
                p: 3,
                height: '100%',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  boxShadow: '0 12px 24px rgba(124, 58, 237, 0.12)',
                  transform: 'translateY(-4px)',
                  borderColor: '#7C3AED30',
                },
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  boxShadow: '0 3px 10px rgba(124, 58, 237, 0.3)',
                }}
              >
                <AutoAwesomeIcon sx={{ color: '#fff', fontSize: 20 }} />
              </Box>
              <Typography fontSize="32px" fontWeight={700} color="#111827" lineHeight={1} mb={1} letterSpacing="-0.03em">
                {metrics?.slots_used || 0}
              </Typography>
              <Typography fontSize="13px" color="#6B7280" fontWeight={600} mb={0.5}>
                Slots Used
              </Typography>
              <Box
                sx={{
                  mt: 1.5,
                  px: 1.5,
                  py: 0.5,
                  background: '#F9FAFB',
                  borderRadius: '6px',
                  border: '1px solid #E5E7EB',
                  display: 'inline-block',
                }}
              >
                <Typography fontSize="11px" color="#9CA3AF" fontWeight={600}>
                  {metrics?.slots_available || 0} available
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={3}>
            <Box
              sx={{
                borderRadius: '14px',
                background: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                border: '1px solid #F3F4F6',
                p: 3,
                height: '100%',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  boxShadow: '0 12px 24px rgba(239, 68, 68, 0.12)',
                  transform: 'translateY(-4px)',
                  borderColor: '#EF444430',
                },
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  boxShadow: '0 3px 10px rgba(239, 68, 68, 0.3)',
                }}
              >
                <NotificationsActiveIcon sx={{ color: '#fff', fontSize: 20 }} />
              </Box>
              <Typography fontSize="32px" fontWeight={700} color="#111827" lineHeight={1} mb={1} letterSpacing="-0.03em">
                {metrics?.new_alerts_count || 0}
              </Typography>
              <Typography fontSize="13px" color="#6B7280" fontWeight={600} mb={0.5}>
                New Alerts
              </Typography>
              <Box
                sx={{
                  mt: 1.5,
                  px: 1.5,
                  py: 0.5,
                  background: metrics?.plan_type === 'PRO' ? '#7C3AED' : '#6B7280',
                  borderRadius: '6px',
                  display: 'inline-block',
                }}
              >
                <Typography fontSize="11px" color="#fff" fontWeight={700} letterSpacing="0.5px">
                  {metrics?.plan_type || 'BASIC'}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={3}>
            <Box
              sx={{
                borderRadius: '14px',
                background: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                border: '1px solid #F3F4F6',
                p: 3,
                height: '100%',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  boxShadow: '0 12px 24px rgba(59, 130, 246, 0.12)',
                  transform: 'translateY(-4px)',
                  borderColor: '#3B82F630',
                },
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  boxShadow: '0 3px 10px rgba(59, 130, 246, 0.3)',
                }}
              >
                <PersonIcon sx={{ color: '#fff', fontSize: 20 }} />
              </Box>
              <Typography fontSize="32px" fontWeight={700} color="#111827" lineHeight={1} mb={1} letterSpacing="-0.03em">
                {metrics?.active_focus_contacts || 0}
              </Typography>
              <Typography fontSize="13px" color="#6B7280" fontWeight={600}>
                Focus Contacts
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={3}>
            <Box
              sx={{
                borderRadius: '14px',
                background: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                border: '1px solid #F3F4F6',
                p: 3,
                height: '100%',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  boxShadow: '0 12px 24px rgba(16, 185, 129, 0.12)',
                  transform: 'translateY(-4px)',
                  borderColor: '#10B98130',
                },
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                  boxShadow: '0 3px 10px rgba(16, 185, 129, 0.3)',
                }}
              >
                <BusinessIcon sx={{ color: '#fff', fontSize: 20 }} />
              </Box>
              <Typography fontSize="32px" fontWeight={700} color="#111827" lineHeight={1} mb={1} letterSpacing="-0.03em">
                {metrics?.active_company_monitors || 0}
              </Typography>
              <Typography fontSize="13px" color="#6B7280" fontWeight={600}>
                Company Monitors
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Tabs */}
        <Box
          sx={{
            borderBottom: 1,
            borderColor: '#E5E7EB',
            mb: 0,
            background: '#fff',
            borderRadius: '14px 14px 0 0',
            border: '1px solid #F3F4F6',
            px: 2,
          }}
        >
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '14px',
                color: '#6B7280',
                '&.Mui-selected': {
                  color: '#7C3AED',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#7C3AED',
                height: 3,
                borderRadius: '3px 3px 0 0',
              },
            }}
          >
            <Tab label={`Alerts (${alerts.length})`} />
            <Tab label={`Focus Contacts (${focusContacts.length})`} />
            <Tab label={`Company Monitors (${companyMonitors.length})`} />
          </Tabs>
        </Box>

        {/* Tab Content Container */}
        <Box
          sx={{
            background: '#fff',
            border: '1px solid #F3F4F6',
            borderTop: 'none',
            borderRadius: '0 0 14px 14px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            p: 3,
            minHeight: '400px',
          }}
        >
          {/* Alerts Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={2.5}>
              {alerts.length === 0 ? (
                <Grid item xs={12}>
                  <Box
                    sx={{
                      py: 8,
                      textAlign: 'center',
                      borderRadius: '12px',
                      background: '#FAFBFC',
                      border: '2px dashed #E5E7EB',
                    }}
                  >
                    <NotificationsActiveIcon sx={{ fontSize: 48, color: '#D1D5DB', mb: 2 }} />
                    <Typography variant="h6" fontWeight={600} color="#374151" mb={1}>
                      No New Alerts
                    </Typography>
                    <Typography variant="body2" color="#6B7280" mb={3}>
                      Your monitors are scanning weekly for resurrection signals.
                    </Typography>
                  </Box>
                </Grid>
              ) : (
                alerts.map((alert) => (
                  <Grid item xs={12} key={alert.alert_id}>
                    <Box
                      sx={{
                        borderRadius: '12px',
                        background: '#fff',
                        border: '1px solid #F3F4F6',
                        p: 3,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
                          borderColor: '#7C3AED30',
                        },
                      }}
                    >
                      <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Box flex={1}>
                          <Box display="flex" alignItems="center" gap={1} mb={2}>
                            <Chip
                              label={alert.alert_type.replace('_', ' ')}
                              size="small"
                              sx={{
                                background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                                color: '#fff',
                                fontWeight: 600,
                                fontSize: '11px',
                              }}
                            />
                            <Typography variant="caption" color="#9CA3AF" fontWeight={500}>
                              {new Date(alert.created_date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </Typography>
                          </Box>
                          <Typography variant="h6" fontWeight={600} color="#111827" mb={1.5}>
                            {alert.alert_message}
                          </Typography>
                          <Typography variant="body2" color="#6B7280" fontSize="13px">
                            Source: {alert.evidence.signal_source}
                          </Typography>
                          {alert.suggested_pitch && (
                            <Box
                              sx={{
                                mt: 2.5,
                                p: 2.5,
                                background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)',
                                borderRadius: '10px',
                                border: '1px solid #E5E7EB',
                              }}
                            >
                              <Typography fontSize="11px" fontWeight={700} color="#7C3AED" mb={1} textTransform="uppercase" letterSpacing="0.8px">
                                AI-Generated Pitch
                              </Typography>
                              <Typography fontSize="13px" color="#374151" lineHeight={1.6}>
                                {alert.suggested_pitch}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                        <Box display="flex" gap={1} ml={2} flexDirection="column">
                          <Box display="flex" gap={1}>
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<EmailIcon sx={{ fontSize: 16 }} />}
                              onClick={() => handleDraftPitch(alert)}
                              sx={{
                                background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '12px',
                                px: 2,
                                py: 0.75,
                                borderRadius: '8px',
                                boxShadow: '0 2px 8px rgba(124, 58, 237, 0.3)',
                                '&:hover': {
                                  background: 'linear-gradient(135deg, #5B21B6 0%, #7C3AED 100%)',
                                  boxShadow: '0 4px 12px rgba(124, 58, 237, 0.4)',
                                },
                              }}
                            >
                              Draft Pitch
                            </Button>
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<WhatsAppIcon sx={{ fontSize: 16 }} />}
                              onClick={() => handleWhatsApp(alert)}
                              sx={{
                                background: '#25D366',
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '12px',
                                px: 2,
                                py: 0.75,
                                borderRadius: '8px',
                                '&:hover': {
                                  background: '#1DA851',
                                },
                              }}
                            >
                              WhatsApp
                            </Button>
                          </Box>
                          <Box display="flex" gap={1}>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleContactAlert(alert.alert_id)}
                              sx={{
                                borderColor: '#7C3AED40',
                                color: '#7C3AED',
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '11px',
                                px: 1.5,
                                py: 0.5,
                                borderRadius: '6px',
                                '&:hover': {
                                  borderColor: '#7C3AED',
                                  backgroundColor: '#7C3AED08',
                                },
                              }}
                            >
                              Mark Contacted
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => handleDismissAlert(alert.alert_id)}
                              sx={{
                                borderColor: '#E5E7EB',
                                color: '#6B7280',
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '11px',
                                px: 1.5,
                                py: 0.5,
                                borderRadius: '6px',
                                '&:hover': {
                                  borderColor: '#9CA3AF',
                                  backgroundColor: '#F9FAFB',
                                },
                              }}
                            >
                              Dismiss
                            </Button>
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                ))
              )}
            </Grid>
          </TabPanel>

          {/* Focus Contacts Tab */}
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={2.5}>
              {focusContacts.length === 0 ? (
                <Grid item xs={12}>
                  <Box
                    sx={{
                      py: 8,
                      textAlign: 'center',
                      borderRadius: '12px',
                      background: '#FAFBFC',
                      border: '2px dashed #E5E7EB',
                    }}
                  >
                    <PersonIcon sx={{ fontSize: 48, color: '#D1D5DB', mb: 2 }} />
                    <Typography variant="h6" fontWeight={600} color="#374151" mb={1}>
                      No Focus Contacts
                    </Typography>
                    <Typography variant="body2" color="#6B7280" mb={3}>
                      Add individuals to monitor for job changes and buying signals.
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => setShowAddContactModal(true)}
                      sx={{
                        background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '13px',
                        px: 3,
                        py: 1.25,
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                      }}
                    >
                      Add Focus Contact
                    </Button>
                  </Box>
                </Grid>
              ) : (
                focusContacts.map((contact) => (
                  <Grid item xs={12} md={6} key={contact.focus_id}>
                    <Box
                      sx={{
                        borderRadius: '12px',
                        background: '#fff',
                        border: '1px solid #F3F4F6',
                        p: 2.5,
                        height: '100%',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
                          borderColor: '#3B82F630',
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                        <Box
                          sx={{
                            width: 38,
                            height: 38,
                            borderRadius: '9px',
                            background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)',
                          }}
                        >
                          <PersonIcon sx={{ color: '#fff', fontSize: 18 }} />
                        </Box>
                        <Box flex={1}>
                          <Typography fontSize="15px" fontWeight={700} color="#111827">
                            {contact.name}
                          </Typography>
                          {contact.social_handle && (
                            <Typography fontSize="12px" color="#6B7280" fontWeight={500}>
                              @{contact.social_handle}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                      <Box display="flex" gap={0.75} flexWrap="wrap" mb={2}>
                        {contact.industry_keywords.slice(0, 4).map((keyword, idx) => (
                          <Chip
                            key={idx}
                            label={keyword}
                            size="small"
                            sx={{
                              fontSize: '11px',
                              fontWeight: 600,
                              background: '#F3F4F6',
                              color: '#374151',
                              border: '1px solid #E5E7EB',
                            }}
                          />
                        ))}
                        {contact.industry_keywords.length > 4 && (
                          <Chip
                            label={`+${contact.industry_keywords.length - 4}`}
                            size="small"
                            sx={{
                              fontSize: '11px',
                              fontWeight: 600,
                              background: '#3B82F6',
                              color: '#fff',
                            }}
                          />
                        )}
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          pt: 1.5,
                          borderTop: '1px solid #F3F4F6',
                        }}
                      >
                        <Typography fontSize="11px" color="#9CA3AF" fontWeight={600}>
                          {contact.scan_count} scans
                        </Typography>
                        <Typography fontSize="11px" color="#3B82F6" fontWeight={700}>
                          {contact.alert_count} alerts
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))
              )}
            </Grid>
          </TabPanel>

          {/* Company Monitors Tab */}
          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={2.5}>
              {companyMonitors.length === 0 ? (
                <Grid item xs={12}>
                  <Box
                    sx={{
                      py: 8,
                      textAlign: 'center',
                      borderRadius: '12px',
                      background: '#FAFBFC',
                      border: '2px dashed #E5E7EB',
                    }}
                  >
                    <BusinessIcon sx={{ fontSize: 48, color: '#D1D5DB', mb: 2 }} />
                    <Typography variant="h6" fontWeight={600} color="#374151" mb={1}>
                      No Company Monitors
                    </Typography>
                    <Typography variant="body2" color="#6B7280" mb={3}>
                      Add companies to track hiring sprees, funding, and strategic pivots.
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => setShowAddCompanyModal(true)}
                      sx={{
                        background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '13px',
                        px: 3,
                        py: 1.25,
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                      }}
                    >
                      Add Company Monitor
                    </Button>
                  </Box>
                </Grid>
              ) : (
                companyMonitors.map((monitor) => (
                  <Grid item xs={12} md={6} key={monitor.monitor_id}>
                    <Box
                      sx={{
                        borderRadius: '12px',
                        background: '#fff',
                        border: '1px solid #F3F4F6',
                        p: 2.5,
                        height: '100%',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 8px 16px rgba(0,0,0,0.08)',
                          borderColor: '#10B98130',
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                        <Box
                          sx={{
                            width: 38,
                            height: 38,
                            borderRadius: '9px',
                            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)',
                          }}
                        >
                          <BusinessIcon sx={{ color: '#fff', fontSize: 18 }} />
                        </Box>
                        <Box flex={1}>
                          <Typography fontSize="15px" fontWeight={700} color="#111827">
                            {monitor.company_name}
                          </Typography>
                          <Typography fontSize="12px" color="#6B7280" fontWeight={500}>
                            {monitor.website_url}
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          px: 2,
                          py: 1.5,
                          background: '#F9FAFB',
                          borderRadius: '8px',
                          border: '1px solid #E5E7EB',
                          mb: 1.5,
                        }}
                      >
                        <Typography fontSize="11px" color="#6B7280" fontWeight={600} mb={0.5}>
                          Current Job Openings
                        </Typography>
                        <Typography fontSize="20px" fontWeight={700} color="#10B981">
                          {monitor.last_job_count}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          pt: 1.5,
                          borderTop: '1px solid #F3F4F6',
                        }}
                      >
                        <Typography fontSize="11px" color="#9CA3AF" fontWeight={600}>
                          {monitor.scan_count} scans
                        </Typography>
                        <Typography fontSize="11px" color="#10B981" fontWeight={700}>
                          {monitor.alert_count} alerts
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))
              )}
            </Grid>
          </TabPanel>
        </Box>
      </Container>

      {/* Modals */}
      <AddFocusContactModal open={showAddContactModal} onClose={() => setShowAddContactModal(false)} userId={userId || ''} onSuccess={loadDashboardData} />

      <AddCompanyMonitorModal open={showAddCompanyModal} onClose={() => setShowAddCompanyModal(false)} userId={userId || ''} onSuccess={loadDashboardData} />

      <CSVUploadModal open={showCSVUploadModal} onClose={() => setShowCSVUploadModal(false)} userId={userId || ''} onSuccess={loadDashboardData} />

      <PasteAndGoModal open={showPasteAndGoModal} onClose={() => setShowPasteAndGoModal(false)} userId={userId || ''} onSuccess={loadDashboardData} />
    </DashboardLayout>
  );
};

export default LazarusProtocolPage;
