import { LazarusService } from '@/api/LazarusService';
import DashboardLayout from '@/components/atoms/DashboardLayout';
import AddCompanyMonitorModal from '@/components/lazarus/AddCompanyMonitorModal';
import AddFocusContactModal from '@/components/lazarus/AddFocusContactModal';
import ConnectCRMModal from '@/components/lazarus/ConnectCRMModal';
import CSVUploadModal from '@/components/lazarus/CSVUploadModal';
import LazarusOnboarding from '@/components/lazarus/LazarusOnboarding';
import PasteAndGoModal from '@/components/lazarus/PasteAndGoModal';
import ScanLogViewerModal from '@/components/lazarus/ScanLogViewerModal';
import { useAuth } from '@/providers/AuthProvider';
import { CompanyMonitor, FocusContact, LazarusAlert, LazarusAlertStatus, LazarusMetrics, LazarusMonitoringStatus, SocialMediaPost } from '@/types/lazarus.types';
import AddIcon from '@mui/icons-material/Add';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BusinessIcon from '@mui/icons-material/Business';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import EmailIcon from '@mui/icons-material/Email';
import LinkIcon from '@mui/icons-material/Link';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import PersonIcon from '@mui/icons-material/Person';
import RefreshIcon from '@mui/icons-material/Refresh';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ScienceIcon from '@mui/icons-material/Science';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { Box, Button, Chip, Container, Grid, IconButton, LinearProgress, Menu, MenuItem, Tab, Tabs, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

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
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingDismissed, setOnboardingDismissed] = useState(false);
  const [showAddContactModal, setShowAddContactModal] = useState(false);
  const [showAddCompanyModal, setShowAddCompanyModal] = useState(false);
  const [showCSVUploadModal, setShowCSVUploadModal] = useState(false);
  const [showPasteAndGoModal, setShowPasteAndGoModal] = useState(false);
  const [showCRMModal, setShowCRMModal] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedContact, setSelectedContact] = useState<FocusContact | null>(null);
  const [selectedMonitor, setSelectedMonitor] = useState<CompanyMonitor | null>(null);
  const [scanningContactId, setScanningContactId] = useState<string | null>(null);
  const [scanningMonitorId, setScanningMonitorId] = useState<string | null>(null);
  const [showScanLogViewer, setShowScanLogViewer] = useState(false);
  const [scanLogType, setScanLogType] = useState<'contact' | 'company'>('contact');
  const [scanSamplePosts, setScanSamplePosts] = useState<SocialMediaPost[]>([]);

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

  const loadDashboardContent = async () => {
    // Load all dashboard data WITHOUT checking onboarding conditions
    try {
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
    } catch (error) {
      console.error('Failed to load Lazarus dashboard data:', error);
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      const metricsResponse = await LazarusService.getUserMetrics(userId!);

      if (metricsResponse.responseData) {
        setMetrics(metricsResponse.responseData);

        // PRD: Show onboarding if user has never added any contacts/companies (first-time)
        // But respect if user already dismissed it
        const isFirstTime = metricsResponse.responseData.used_slots === 0;

        if (isFirstTime && !onboardingDismissed) {
          setShowOnboarding(true);
          setLoading(false);
          return; // Don't load other data yet
        }
      } else {
        // responseData is null - likely first time user with no data yet
        if (!onboardingDismissed) {
          setShowOnboarding(true);
          setLoading(false);
          return;
        }
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
    } catch (error) {
      console.error('Failed to load Lazarus dashboard data:', error);

      // If API fails and we have no existing data, show onboarding (first-time user)
      if ((!metrics || metrics.used_slots === 0) && !onboardingDismissed) {
        setShowOnboarding(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOnboardingComplete = async () => {
    setShowOnboarding(false);
    setOnboardingDismissed(true); // Mark as dismissed so it doesn't show again
    setLoading(true);
    await loadDashboardContent(); // Load data without checking onboarding conditions
    setLoading(false);
  };

  const handleTabChange = async (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);

    // Load analytics data when Analytics tab is selected
    if (newValue === 3 && userId && !analyticsData) {
      try {
        const analyticsResponse = await LazarusService.getAnalyticsData(userId, 30);
        if (analyticsResponse.responseData) {
          setAnalyticsData(analyticsResponse.responseData);
        }
      } catch (error) {
        console.error('❌ Failed to load analytics data:', error);
      }
    }
  };

  const handleContactAlert = async (alertId: string) => {
    try {
      await LazarusService.markAlertContacted(userId!, alertId);
      loadDashboardData();
    } catch (error) {
      console.error('Failed to mark alert as contacted:', error);
    }
  };

  const handleUpdateContactFrequency = async (focusId: string, days: number) => {
    try {
      await LazarusService.updateFocusContactScanFrequency(userId!, focusId, days);
      setMenuAnchor(null);
      setSelectedContact(null);
      loadDashboardContent();
    } catch (error) {
      console.error('Failed to update scan frequency:', error);
    }
  };

  const handleUpdateMonitorFrequency = async (monitorId: string, days: number) => {
    try {
      await LazarusService.updateCompanyMonitorScanFrequency(userId!, monitorId, days);
      setMenuAnchor(null);
      setSelectedMonitor(null);
      loadDashboardContent();
    } catch (error) {
      console.error('Failed to update scan frequency:', error);
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

  const handleResurrectLead = async (alert: LazarusAlert) => {
    // Note: Backend expects source_lead_id which should be linked to the original dead lead
    // For now, we'll use the alert's source_id (which is the focus_id or monitor_id)
    // This may need adjustment based on your backend implementation

    try {
      // You may need to fetch the source_lead_id from the focus contact or company monitor
      // For now, attempting with alert.source_id
      const response = await LazarusService.resurrectLead(userId!, alert.source_id, alert.alert_type);

      if (response.status) {
        console.log('✅ Lead resurrected successfully:', response.responseData);
        // Reload dashboard to refresh alert status
        loadDashboardData();
      } else {
        console.error('Failed to resurrect lead:', response.responseMessage);
      }
    } catch (error) {
      console.error('Error resurrecting lead:', error);
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

  const handleScanContact = async (focusId: string) => {
    setScanningContactId(focusId);
    setScanLogType('contact');
    setScanSamplePosts([]);
    setShowScanLogViewer(true);

    try {
      console.log(`[SCAN] Starting scan for contact: ${focusId}`);
      const response = await LazarusService.scanFocusContacts(10);
      console.log('[SCAN] Scan response:', response);

      // Store sample posts for modal display
      if (response.responseData?.sample_posts) {
        console.log('[SCAN] Sample posts fetched:', response.responseData.sample_posts);
        setScanSamplePosts(response.responseData.sample_posts);
      }

      await loadDashboardContent();

      // Don't close modal automatically - user can close it
    } catch (error: any) {
      console.error('[SCAN ERROR] Failed to scan contact:', error);
      toast.error(`❌ Scan failed: ${error.message || 'Unknown error'}`, {
        duration: 5000,
      });
    } finally {
      // Keep modal open, just stop the scanning state after a delay
      setTimeout(() => {
        setScanningContactId(null);
      }, 1000);
    }
  };

  const handleScanMonitor = async (monitorId: string) => {
    setScanningMonitorId(monitorId);
    setScanLogType('company');
    setScanSamplePosts([]);
    setShowScanLogViewer(true);

    try {
      console.log(`[SCAN] Starting scan for company monitor: ${monitorId}`);
      const response = await LazarusService.scanCompanyMonitors(10);
      console.log('[SCAN] Scan response:', response);

      // Store sample posts for modal display
      if (response.responseData?.sample_posts) {
        console.log('[SCAN] Sample posts fetched:', response.responseData.sample_posts);
        setScanSamplePosts(response.responseData.sample_posts);
      }

      await loadDashboardContent();

      // Don't close modal automatically - user can close it
    } catch (error: any) {
      console.error('[SCAN ERROR] Failed to scan monitor:', error);
      toast.error(`❌ Scan failed: ${error.message || 'Unknown error'}`, {
        duration: 5000,
      });
    } finally {
      // Keep modal open, just stop the scanning state after a delay
      setTimeout(() => {
        setScanningMonitorId(null);
      }, 1000);
    }
  };

  // Show onboarding for first-time users (PRD flow)
  if (showOnboarding && userId) {
    return <LazarusOnboarding userId={userId} onComplete={handleOnboardingComplete} />;
  }

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
              variant="contained"
              startIcon={<LinkIcon />}
              onClick={() => setShowCRMModal(true)}
              sx={{
                background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
                color: '#fff',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '13px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #6D28D9 0%, #4C1D95 100%)',
                  boxShadow: '0 6px 16px rgba(124, 58, 237, 0.4)',
                },
              }}
            >
              Connect CRM
            </Button>
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
                {metrics?.used_slots || 0}
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
                  {metrics ? metrics.max_slots - metrics.used_slots : 0} available
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
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
            <Tab label="Analytics" />
          </Tabs>

          {/* Tab Action Buttons */}
          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', pb: 1 }}>
            {tabValue === 1 && (
              <Button
                variant="contained"
                size="small"
                onClick={() => setShowAddContactModal(true)}
                sx={{
                  background: 'linear-gradient(135deg, #C91A79 0%, #A01560 100%)',
                  color: '#fff',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '12px',
                  px: 2,
                  py: 0.75,
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(201, 26, 121, 0.25)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #A01560 0%, #801248 100%)',
                    boxShadow: '0 4px 12px rgba(201, 26, 121, 0.35)',
                  },
                }}
              >
                + Add Focus Contact
              </Button>
            )}
            {tabValue === 2 && (
              <Button
                variant="contained"
                size="small"
                onClick={() => setShowAddCompanyModal(true)}
                sx={{
                  background: 'linear-gradient(135deg, #C91A79 0%, #A01560 100%)',
                  color: '#fff',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '12px',
                  px: 2,
                  py: 0.75,
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(201, 26, 121, 0.25)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #A01560 0%, #801248 100%)',
                    boxShadow: '0 4px 12px rgba(201, 26, 121, 0.35)',
                  },
                }}
              >
                + Add Company Monitor
              </Button>
            )}
          </Box>
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
                              variant="contained"
                              size="small"
                              onClick={() => handleResurrectLead(alert)}
                              sx={{
                                backgroundColor: '#10B981',
                                color: '#fff',
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '11px',
                                px: 1.5,
                                py: 0.5,
                                borderRadius: '6px',
                                '&:hover': {
                                  backgroundColor: '#059669',
                                },
                                '&:disabled': {
                                  backgroundColor: '#D1D5DB',
                                  color: '#9CA3AF',
                                },
                              }}
                            >
                              Resurrect Lead
                            </Button>
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
                        borderRadius: '16px',
                        background: '#fff',
                        border: '1px solid #F5F5F5',
                        p: 3,
                        height: '100%',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          boxShadow: '0 8px 20px rgba(201, 26, 121, 0.08)',
                          borderColor: '#C91A7915',
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2.5}>
                        <Box display="flex" alignItems="center" gap={2} flex={1}>
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: '12px',
                              background: '#F9F9F9',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <PersonIcon sx={{ color: '#C91A79', fontSize: 22 }} />
                          </Box>
                          <Box flex={1}>
                            <Typography fontSize="16px" fontWeight={600} color="#1A1A1A" mb={0.5}>
                              {contact.name}
                            </Typography>
                            {contact.social_handle && (
                              <Typography fontSize="12px" color="#9CA3AF" fontWeight={500}>
                                {contact.social_handle}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                        <Box display="flex" gap={0.5}>
                          <IconButton
                            size="small"
                            sx={{
                              color: scanningContactId === contact.focus_id ? '#7C3AED' : '#9CA3AF',
                              '&:hover': { color: '#7C3AED', backgroundColor: '#7C3AED10' },
                            }}
                            onClick={() => handleScanContact(contact.focus_id)}
                            disabled={scanningContactId === contact.focus_id}
                            title="Scan Now"
                          >
                            <RefreshIcon
                              fontSize="small"
                              sx={{
                                animation: scanningContactId === contact.focus_id ? 'spin 1s linear infinite' : 'none',
                                '@keyframes spin': {
                                  '0%': { transform: 'rotate(0deg)' },
                                  '100%': { transform: 'rotate(360deg)' },
                                },
                              }}
                            />
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{ color: '#9CA3AF' }}
                            onClick={(e) => {
                              setMenuAnchor(e.currentTarget);
                              setSelectedContact(contact);
                            }}
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                      {contact.industry_keywords && contact.industry_keywords.length > 0 && (
                        <Box display="flex" gap={1} flexWrap="wrap" mb={2.5}>
                          {contact.industry_keywords.slice(0, 3).map((keyword, idx) => (
                            <Chip
                              key={idx}
                              label={keyword}
                              size="small"
                              sx={{
                                fontSize: '11px',
                                fontWeight: 600,
                                background: '#FFF5FA',
                                color: '#C91A79',
                                border: '1px solid #FFEBF4',
                                height: '24px',
                              }}
                            />
                          ))}
                          {contact.industry_keywords.length > 3 && (
                            <Chip
                              label={`+${contact.industry_keywords.length - 3}`}
                              size="small"
                              sx={{
                                fontSize: '11px',
                                fontWeight: 600,
                                background: '#C91A79',
                                color: '#fff',
                                height: '24px',
                              }}
                            />
                          )}
                        </Box>
                      )}
                      <Box
                        sx={{
                          pt: 2,
                          borderTop: '1px solid #F5F5F5',
                        }}
                      >
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography fontSize="12px" color="#9CA3AF" fontWeight={600}>
                            {contact.scan_count} scans
                          </Typography>
                          <Typography fontSize="12px" color="#C91A79" fontWeight={700}>
                            {contact.alert_count} alerts
                          </Typography>
                        </Box>
                        <Typography fontSize="11px" color="#9CA3AF" fontWeight={500}>
                          Scans every {contact.scan_frequency_days || 7} days
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
                        borderRadius: '16px',
                        background: '#fff',
                        border: '1px solid #F5F5F5',
                        p: 3,
                        height: '100%',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          boxShadow: '0 8px 20px rgba(201, 26, 121, 0.08)',
                          borderColor: '#C91A7915',
                          transform: 'translateY(-2px)',
                        },
                      }}
                    >
                      <Box display="flex" alignItems="flex-start" justifyContent="space-between" mb={2.5}>
                        <Box display="flex" alignItems="center" gap={2} flex={1}>
                          <Box
                            sx={{
                              width: 48,
                              height: 48,
                              borderRadius: '12px',
                              background: '#F9F9F9',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <BusinessIcon sx={{ color: '#10B981', fontSize: 22 }} />
                          </Box>
                          <Box flex={1}>
                            <Typography fontSize="16px" fontWeight={600} color="#1A1A1A" mb={0.5}>
                              {monitor.company_name}
                            </Typography>
                            {monitor.website_url && (
                              <Typography fontSize="12px" color="#9CA3AF" fontWeight={500} sx={{ wordBreak: 'break-all' }}>
                                {monitor.website_url}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                        <Box display="flex" gap={0.5}>
                          <IconButton
                            size="small"
                            sx={{
                              color: scanningMonitorId === monitor.monitor_id ? '#10B981' : '#9CA3AF',
                              '&:hover': { color: '#10B981', backgroundColor: '#10B98110' },
                            }}
                            onClick={() => handleScanMonitor(monitor.monitor_id)}
                            disabled={scanningMonitorId === monitor.monitor_id}
                            title="Scan Now"
                          >
                            <RefreshIcon
                              fontSize="small"
                              sx={{
                                animation: scanningMonitorId === monitor.monitor_id ? 'spin 1s linear infinite' : 'none',
                                '@keyframes spin': {
                                  '0%': { transform: 'rotate(0deg)' },
                                  '100%': { transform: 'rotate(360deg)' },
                                },
                              }}
                            />
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{ color: '#9CA3AF' }}
                            onClick={(e) => {
                              setMenuAnchor(e.currentTarget);
                              setSelectedMonitor(monitor);
                            }}
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                      <Box
                        sx={{
                          px: 2.5,
                          py: 2,
                          background: '#FAFAFA',
                          borderRadius: '12px',
                          mb: 2.5,
                        }}
                      >
                        <Typography fontSize="11px" color="#6B7280" fontWeight={600} mb={0.5} textTransform="uppercase" letterSpacing="0.5px">
                          Current Job Openings
                        </Typography>
                        <Typography fontSize="28px" fontWeight={700} color="#1A1A1A">
                          {monitor.last_job_count}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          pt: 2,
                          borderTop: '1px solid #F5F5F5',
                        }}
                      >
                        <Box display="flex" justifyContent="space-between" mb={1}>
                          <Typography fontSize="12px" color="#9CA3AF" fontWeight={500}>
                            {monitor.scan_count} scans
                          </Typography>
                          <Typography fontSize="12px" color="#C91A79" fontWeight={600}>
                            {monitor.alert_count} alerts
                          </Typography>
                        </Box>
                        <Typography fontSize="11px" color="#9CA3AF" fontWeight={500}>
                          Scans every {monitor.scan_frequency_days || 7} days
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                ))
              )}
            </Grid>
          </TabPanel>

          {/* Analytics Tab */}
          <TabPanel value={tabValue} index={3}>
            {!analyticsData ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="body1" color="text.secondary" mb={2}>
                  Loading analytics...
                </Typography>
                <LinearProgress sx={{ maxWidth: 300, mx: 'auto' }} />
              </Box>
            ) : (
              <Box>
                {/* KPI Cards Row */}
                <Grid container spacing={3} mb={4}>
                  {/* Resurrection Rate Card */}
                  <Grid item xs={12} md={4}>
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: '14px',
                        border: '1px solid #F3F4F6',
                        background: analyticsData.resurrection_rate_status === 'above_target' ? '#F0FDF4' : '#FEF3C7',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        {analyticsData.resurrection_rate_status === 'above_target' ? (
                          <TrendingUpIcon sx={{ color: '#10B981', fontSize: 20 }} />
                        ) : (
                          <TrendingDownIcon sx={{ color: '#F59E0B', fontSize: 20 }} />
                        )}
                        <Typography fontSize="13px" fontWeight={600} color="#6B7280">
                          Resurrection Rate
                        </Typography>
                      </Box>
                      <Typography fontSize="36px" fontWeight={700} color="#111827" lineHeight={1} mb={0.5}>
                        {analyticsData.resurrection_rate}%
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1}>
                        {analyticsData.resurrection_rate_status === 'above_target' ? (
                          <Chip
                            label="✅ Above Target"
                            size="small"
                            sx={{
                              backgroundColor: '#10B981',
                              color: '#fff',
                              fontWeight: 700,
                              fontSize: '10px',
                            }}
                          />
                        ) : (
                          <Chip
                            label="⚠️ Below Target"
                            size="small"
                            sx={{
                              backgroundColor: '#F59E0B',
                              color: '#fff',
                              fontWeight: 700,
                              fontSize: '10px',
                            }}
                          />
                        )}
                        <Typography fontSize="11px" color="#6B7280">
                          Target: {analyticsData.resurrection_rate_target}%
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>

                  {/* Quota Utilization Card */}
                  <Grid item xs={12} md={4}>
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: '14px',
                        border: '1px solid #F3F4F6',
                        background: '#fff',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      }}
                    >
                      <Typography fontSize="13px" fontWeight={600} color="#6B7280" mb={1}>
                        Quota Utilization
                      </Typography>
                      <Typography fontSize="36px" fontWeight={700} color="#111827" lineHeight={1} mb={1}>
                        {analyticsData.quota_utilization}%
                      </Typography>
                      <Typography fontSize="12px" color="#6B7280" mb={2}>
                        {analyticsData.slots_used} of {analyticsData.slots_total} slots used
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={analyticsData.quota_utilization}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: '#E5E7EB',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: analyticsData.quota_utilization >= 90 ? '#EF4444' : '#7C3AED',
                            borderRadius: 4,
                          },
                        }}
                      />
                      {analyticsData.should_upgrade && (
                        <Typography fontSize="11px" color="#EF4444" fontWeight={700} mt={1}>
                          🔔 {analyticsData.slots_remaining} slots remaining - Consider upgrading!
                        </Typography>
                      )}
                    </Box>
                  </Grid>

                  {/* Accuracy Rate Card */}
                  <Grid item xs={12} md={4}>
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: '14px',
                        border: '1px solid #F3F4F6',
                        background: '#F0FDF4',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <CheckCircleIcon sx={{ color: '#10B981', fontSize: 20 }} />
                        <Typography fontSize="13px" fontWeight={600} color="#6B7280">
                          Accuracy Rate
                        </Typography>
                      </Box>
                      <Typography fontSize="36px" fontWeight={700} color="#111827" lineHeight={1} mb={0.5}>
                        {analyticsData.accuracy_rate}%
                      </Typography>
                      <Typography fontSize="11px" color="#6B7280">
                        {analyticsData.dismissed_count} of {analyticsData.total_alerts} alerts dismissed ({analyticsData.false_positive_rate}% false positive)
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* Line Chart - Resurrection Rate Trend */}
                <Box
                  sx={{
                    p: 3,
                    borderRadius: '14px',
                    border: '1px solid #F3F4F6',
                    background: '#fff',
                    mb: 4,
                  }}
                >
                  <Typography fontSize="16px" fontWeight={700} color="#111827" mb={3}>
                    📈 Resurrection Rate Trend (Last 4 Weeks)
                  </Typography>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={analyticsData.weekly_trends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="week" stroke="#6B7280" style={{ fontSize: 12 }} />
                      <YAxis stroke="#6B7280" style={{ fontSize: 12 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #E5E7EB',
                          borderRadius: 8,
                        }}
                      />
                      <Line type="monotone" dataKey="resurrection_rate" stroke="#7C3AED" strokeWidth={3} dot={{ fill: '#7C3AED', r: 5 }} activeDot={{ r: 7 }} />
                      {/* Target line at 15% */}
                      <Line type="monotone" dataKey={() => 15} stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>

                {/* Alert Performance Stats */}
                <Grid container spacing={3} mb={4}>
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: '14px',
                        border: '1px solid #F3F4F6',
                        background: '#fff',
                      }}
                    >
                      <Typography fontSize="16px" fontWeight={700} color="#111827" mb={2}>
                        🎯 Alert Performance
                      </Typography>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography fontSize="11px" color="#6B7280" mb={0.5}>
                            Total Alerts
                          </Typography>
                          <Typography fontSize="24px" fontWeight={700} color="#111827">
                            {analyticsData.total_alerts}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography fontSize="11px" color="#6B7280" mb={0.5}>
                            Acted Upon
                          </Typography>
                          <Typography fontSize="24px" fontWeight={700} color="#10B981">
                            {analyticsData.acted_upon_count}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography fontSize="11px" color="#6B7280" mb={0.5}>
                            Dismissed
                          </Typography>
                          <Typography fontSize="24px" fontWeight={700} color="#EF4444">
                            {analyticsData.dismissed_count}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography fontSize="11px" color="#6B7280" mb={0.5}>
                            Pending
                          </Typography>
                          <Typography fontSize="24px" fontWeight={700} color="#F59E0B">
                            {analyticsData.pending_count}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        p: 3,
                        borderRadius: '14px',
                        border: '1px solid #F3F4F6',
                        background: '#fff',
                      }}
                    >
                      <Typography fontSize="16px" fontWeight={700} color="#111827" mb={2}>
                        📊 Alert Actions Breakdown
                      </Typography>
                      <Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                          <Typography fontSize="12px" color="#6B7280">
                            Contacted
                          </Typography>
                          <Typography fontSize="14px" fontWeight={700} color="#10B981">
                            {analyticsData.contacted_percentage}%
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                          <Typography fontSize="12px" color="#6B7280">
                            Dismissed
                          </Typography>
                          <Typography fontSize="14px" fontWeight={700} color="#EF4444">
                            {analyticsData.dismissed_percentage}%
                          </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography fontSize="12px" color="#6B7280">
                            Pending
                          </Typography>
                          <Typography fontSize="14px" fontWeight={700} color="#F59E0B">
                            {analyticsData.pending_percentage}%
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>

                {/* Bar Chart - Alert Type Performance */}
                <Box
                  sx={{
                    p: 3,
                    borderRadius: '14px',
                    border: '1px solid #F3F4F6',
                    background: '#fff',
                  }}
                >
                  <Typography fontSize="16px" fontWeight={700} color="#111827" mb={3}>
                    🔥 Top Performing Alert Types
                  </Typography>
                  {analyticsData.alert_types_performance && analyticsData.alert_types_performance.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={analyticsData.alert_types_performance}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="alert_type" stroke="#6B7280" style={{ fontSize: 11 }} />
                        <YAxis stroke="#6B7280" style={{ fontSize: 12 }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #E5E7EB',
                            borderRadius: 8,
                          }}
                        />
                        <Bar dataKey="action_rate" fill="#7C3AED" radius={[8, 8, 0, 0]}>
                          {analyticsData.alert_types_performance.map((entry: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={index === 0 ? '#10B981' : '#7C3AED'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <Typography fontSize="13px" color="#6B7280" textAlign="center" py={4}>
                      No alert data available yet
                    </Typography>
                  )}
                </Box>
              </Box>
            )}
          </TabPanel>
        </Box>
      </Container>

      {/* Modals */}
      <ConnectCRMModal open={showCRMModal} onClose={() => setShowCRMModal(false)} userId={userId || ''} onSuccess={loadDashboardData} />

      <AddFocusContactModal open={showAddContactModal} onClose={() => setShowAddContactModal(false)} userId={userId || ''} onSuccess={loadDashboardContent} />

      <AddCompanyMonitorModal open={showAddCompanyModal} onClose={() => setShowAddCompanyModal(false)} userId={userId || ''} onSuccess={loadDashboardContent} />

      <CSVUploadModal open={showCSVUploadModal} onClose={() => setShowCSVUploadModal(false)} userId={userId || ''} onSuccess={loadDashboardContent} />

      <PasteAndGoModal open={showPasteAndGoModal} onClose={() => setShowPasteAndGoModal(false)} userId={userId || ''} onSuccess={loadDashboardContent} />

      <ScanLogViewerModal
        open={showScanLogViewer}
        onClose={() => setShowScanLogViewer(false)}
        scanType={scanLogType}
        scanningId={scanLogType === 'contact' ? scanningContactId : scanningMonitorId}
        samplePosts={scanSamplePosts}
      />

      {/* Scan Frequency Menu */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => {
          setMenuAnchor(null);
          setSelectedContact(null);
          setSelectedMonitor(null);
        }}
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            minWidth: 200,
          },
        }}
      >
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid #F3F4F6' }}>
          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
            <ScheduleIcon sx={{ fontSize: 16, color: '#C91A79' }} />
            <Typography fontSize="13px" fontWeight={600} color="#1A1A1A">
              Scan Frequency
            </Typography>
          </Box>
          <Typography fontSize="11px" color="#9CA3AF">
            How often to check for signals
          </Typography>
        </Box>
        {[1, 3, 7, 14, 30].map((days) => (
          <MenuItem
            key={days}
            onClick={() => {
              if (selectedContact) {
                handleUpdateContactFrequency(selectedContact.focus_id, days);
              } else if (selectedMonitor) {
                handleUpdateMonitorFrequency(selectedMonitor.monitor_id, days);
              }
            }}
            sx={{
              py: 1.5,
              fontSize: '14px',
              '&:hover': {
                background: '#FFF5FA',
              },
            }}
          >
            <Box display="flex" alignItems="center" justifyContent="space-between" width="100%">
              <Typography fontSize="14px">{days === 1 ? 'Daily' : days === 7 ? 'Weekly' : days === 30 ? 'Monthly' : `Every ${days} days`}</Typography>
              <Typography fontSize="12px" color="#9CA3AF">
                {days}d
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </DashboardLayout>
  );
};

export default LazarusProtocolPage;
