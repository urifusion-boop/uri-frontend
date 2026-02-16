import { LazarusService } from '@/api/LazarusService';
import DashboardLayout from '@/components/atoms/DashboardLayout';
import AddCompanyMonitorModal from '@/components/lazarus/AddCompanyMonitorModal';
import AddFocusContactModal from '@/components/lazarus/AddFocusContactModal';
import AdvancedAnalytics from '@/components/lazarus/AdvancedAnalytics';
import ConnectCRMModal from '@/components/lazarus/ConnectCRMModal';
import CSVUploadModal from '@/components/lazarus/CSVUploadModal';
import EmailComposerModal from '@/components/lazarus/EmailComposerModal';
import LazarusOnboarding from '@/components/lazarus/LazarusOnboarding';
import PasteAndGoModal from '@/components/lazarus/PasteAndGoModal';
import PostViewerModal from '@/components/lazarus/PostViewerModal';
import RejectedPostsTab from '@/components/lazarus/RejectedPostsTab';
import ScanLogViewerModal from '@/components/lazarus/ScanLogViewerModal';
import ScannedContentTab from '@/components/lazarus/ScannedContentTab';
import { useAuth } from '@/providers/AuthProvider';
import { AlertDetectionData, CompanyMonitor, FocusContact, LazarusAlert, LazarusAlertStatus, LazarusMetrics, LazarusMonitoringStatus, SocialMediaPost } from '@/types/lazarus.types';
import AddIcon from '@mui/icons-material/Add';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import BusinessIcon from '@mui/icons-material/Business';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EmailIcon from '@mui/icons-material/Email';
import LinkIcon from '@mui/icons-material/Link';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import RadarIcon from '@mui/icons-material/Radar';
import RefreshIcon from '@mui/icons-material/Refresh';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ScienceIcon from '@mui/icons-material/Science';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TwitterIcon from '@mui/icons-material/Twitter';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
  Select,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
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
  const [showPostViewer, setShowPostViewer] = useState(false);
  const [showEmailComposer, setShowEmailComposer] = useState(false);
  const [selectedAlertForEmail, setSelectedAlertForEmail] = useState<LazarusAlert | null>(null);
  const [selectedAlertEvidence, setSelectedAlertEvidence] = useState<LazarusAlert | null>(null);
  const [selectedContactPhoto, setSelectedContactPhoto] = useState<string | undefined>(undefined);
  const [selectedContactEmail, setSelectedContactEmail] = useState<string | undefined>(undefined);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedContact, setSelectedContact] = useState<FocusContact | null>(null);
  const [selectedMonitor, setSelectedMonitor] = useState<CompanyMonitor | null>(null);
  const [scanningContactId, setScanningContactId] = useState<string | null>(null);
  const [scanningMonitorId, setScanningMonitorId] = useState<string | null>(null);
  const [enrichingContactId, setEnrichingContactId] = useState<string | null>(null);
  const [enrichingMonitorId, setEnrichingMonitorId] = useState<string | null>(null);
  const [revealingEmailId, setRevealingEmailId] = useState<string | null>(null);
  const [revealingPhoneId, setRevealingPhoneId] = useState<string | null>(null);
  const [showScanLogViewer, setShowScanLogViewer] = useState(false);
  const [scanLogType, setScanLogType] = useState<'contact' | 'company'>('contact');
  const [scanSamplePosts, setScanSamplePosts] = useState<SocialMediaPost[]>([]);
  const [scanAlertData, setScanAlertData] = useState<AlertDetectionData | undefined>(undefined);
  const [isBatchScanning, setIsBatchScanning] = useState(false);
  const [editingContact, setEditingContact] = useState<FocusContact | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<FocusContact | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Alert filters
  const [filterSignalType, setFilterSignalType] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // System status
  const [quotaExceeded, setQuotaExceeded] = useState(false);

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

    // Load analytics data when Analytics tab is selected (now tab 4)
    if (newValue === 4 && userId && !analyticsData) {
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
      toast.success('✅ Alert marked as contacted');
      loadDashboardData();
    } catch (error) {
      console.error('Failed to mark alert as contacted:', error);
      toast.error('Failed to mark alert as contacted');
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

  const handleDeleteContact = async () => {
    if (!contactToDelete) return;

    setIsDeleting(true);
    try {
      await LazarusService.removeFocusContact(userId!, contactToDelete.focus_id);
      setShowDeleteModal(false);
      setContactToDelete(null);
      setMenuAnchor(null);
      setSelectedContact(null);
      toast.success('✅ Contact deleted successfully');
      loadDashboardContent();
    } catch (error) {
      console.error('Failed to delete contact:', error);
      toast.error('Failed to delete contact');
    } finally {
      setIsDeleting(false);
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

  const handleMarkContacted = async (alertId: string) => {
    try {
      await LazarusService.markAlertContacted(userId!, alertId);
      toast.success('Alert marked as contacted');
      loadDashboardData();
    } catch (error) {
      console.error('Failed to mark alert as contacted:', error);
      toast.error('Failed to mark alert as contacted');
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

  const handleDraftEmail = async (alert: LazarusAlert) => {
    // Fetch enriched contact email
    try {
      const contactResponse = await LazarusService.getFocusContactDetail(userId!, alert.source_id);
      const email = contactResponse.responseData?.email;

      setSelectedContactEmail(email);
      setSelectedAlertForEmail(alert);
      setShowEmailComposer(true);
    } catch (error) {
      console.error('Error fetching contact email:', error);
      // Open composer anyway, user can enter email manually
      setSelectedAlertForEmail(alert);
      setShowEmailComposer(true);
    }
  };

  const handleEmailSent = async () => {
    if (!selectedAlertForEmail) return;

    // Log outreach
    try {
      await LazarusService.logOutreach(userId!, selectedAlertForEmail.alert_id, 'email', 'Email sent via Email Composer');
      toast.success('Outreach logged successfully!');

      // Reload alerts
      loadDashboardData();
    } catch (error) {
      console.error('Error logging outreach:', error);
    }
  };

  const handleLinkedInMessage = async (alert: LazarusAlert) => {
    try {
      // Only works for focus contacts, not company monitors
      if (alert.source_type !== 'FOCUS_CONTACT') {
        toast.error('LinkedIn messaging only available for individual contacts');
        return;
      }

      // Get contact details to find LinkedIn URL
      const contactResponse = await LazarusService.getFocusContactDetail(userId!, alert.source_id);

      if (!contactResponse.responseData) {
        toast.error('Contact not found');
        return;
      }

      const contact = contactResponse.responseData;

      // Build LinkedIn URL from linkedin_url field or social_handle
      let linkedinUrl = contact?.linkedin_url;
      if (!linkedinUrl && contact?.social_handle) {
        // If social_handle is just the handle (e.g., "john-doe"), build the full URL
        const handle = contact.social_handle.replace('@', '').replace('https://www.linkedin.com/in/', '');
        linkedinUrl = `https://www.linkedin.com/in/${handle}`;
      }

      if (linkedinUrl) {
        // Open LinkedIn profile
        window.open(linkedinUrl, '_blank');
        toast.success('LinkedIn profile opened!');

        // Log outreach
        await LazarusService.logOutreach(userId!, alert.alert_id, 'linkedin', 'LinkedIn profile opened for messaging');
      } else {
        toast.error('No LinkedIn URL found for this contact');
      }
    } catch (error) {
      console.error('Error opening LinkedIn:', error);
      toast.error('Failed to load contact details');
    }
  };

  const handleTwitterMessage = async (alert: LazarusAlert) => {
    try {
      // Get contact details to find Twitter URL
      const contactResponse = await LazarusService.getFocusContactDetail(userId!, alert.source_id);
      const twitterUrl = contactResponse.responseData?.twitter_url;

      if (twitterUrl) {
        // Extract Twitter handle and open DM page
        const handle = twitterUrl.split('/').pop()?.replace('@', '');
        if (handle) {
          window.open(`https://twitter.com/messages/compose?recipient_id=${handle}`, '_blank');
          toast.success('Twitter DM opened!');

          // Log outreach
          await LazarusService.logOutreach(userId!, alert.alert_id, 'twitter', 'Twitter DM opened');
        }
      } else {
        toast.error('No Twitter URL found for this contact');
      }
    } catch (error) {
      console.error('Error opening Twitter:', error);
      toast.error('Failed to open Twitter');
    }
  };

  const handleScanContact = async (focusId: string) => {
    setScanningContactId(focusId);
    setScanLogType('contact');
    setScanSamplePosts([]);
    setScanAlertData(undefined);
    setShowScanLogViewer(true);

    try {
      console.log(`[SCAN] Starting scan for SPECIFIC contact: ${focusId}`);
      const response = await LazarusService.scanSingleFocusContact(userId!, focusId);
      console.log('[SCAN] Full response:', JSON.stringify(response, null, 2));
      console.log('[SCAN] responseData:', response.responseData);
      console.log('[SCAN] sample_posts:', response.responseData?.sample_posts);
      console.log('[SCAN] alert_data:', response.responseData?.alert_data);

      // Store alert data if available
      if (response.responseData?.alert_data) {
        console.log('[SCAN] Alert detected:', response.responseData.alert_data);
        setScanAlertData(response.responseData.alert_data);
      }

      // Store sample posts for modal display - sanitize the data
      if (response.responseData && response.responseData.sample_posts && response.responseData.sample_posts.length > 0) {
        console.log('[SCAN] Raw sample posts:', response.responseData.sample_posts);

        // Sanitize posts to ensure all fields are proper types
        const sanitizedPosts = response.responseData.sample_posts.map((post: any) => ({
          text: post.text || 'No content',
          author: typeof post.author === 'object' ? post.author.name || `${post.author.firstName || ''} ${post.author.lastName || ''}`.trim() || 'Unknown' : post.author || 'Unknown',
          platform: post.platform || 'Unknown',
          created_at: post.created_at,
          likes: post.likes || 0,
          comments: Array.isArray(post.comments) ? post.comments.length : post.comments || 0,
          retweets: post.retweets || 0,
          shares: post.shares || 0,
        }));

        console.log('[SCAN] Sanitized posts:', sanitizedPosts);
        setScanSamplePosts(sanitizedPosts);
      } else {
        console.error('[SCAN] No sample posts in response!');
      }

      await loadDashboardContent();

      // Don't close modal automatically - user can close it
    } catch (error: any) {
      console.error('[SCAN ERROR] Failed to scan contact:', error);

      // Check if it's a quota error (infrastructure issue)
      const errorMsg = error.message || error.toString() || '';
      if (errorMsg.toLowerCase().includes('usage') && errorMsg.toLowerCase().includes('limit')) {
        setQuotaExceeded(true);
        toast.error('Scanning temporarily unavailable. Our team has been notified.', {
          duration: 6000,
        });
      } else {
        toast.error(`❌ Scan failed: ${error.message || 'Unknown error'}`, {
          duration: 5000,
        });
      }
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

  const handleEnrichContact = async (focusId: string) => {
    setEnrichingContactId(focusId);
    try {
      console.log(`[ENRICH] Starting enrichment for contact: ${focusId}`);
      const response = await LazarusService.enrichFocusContact(userId!, focusId);
      console.log('[ENRICH] Enrichment response:', response);

      if (response.status) {
        toast.success('✨ Contact enriched successfully!', {
          duration: 4000,
        });
        // Reload contacts to show updated enrichment data
        await loadDashboardContent();
      } else {
        toast.error(`❌ Enrichment failed: ${response.responseMessage || 'Unknown error'}`, {
          duration: 5000,
        });
      }
    } catch (error: any) {
      console.error('[ENRICH ERROR] Failed to enrich contact:', error);
      toast.error(`❌ Enrichment failed: ${error.message || 'Unknown error'}`, {
        duration: 5000,
      });
    } finally {
      setTimeout(() => {
        setEnrichingContactId(null);
      }, 1000);
    }
  };

  const handleEnrichMonitor = async (monitorId: string) => {
    setEnrichingMonitorId(monitorId);
    try {
      console.log(`[ENRICH] Starting enrichment for company: ${monitorId}`);
      const response = await LazarusService.enrichCompanyMonitor(userId!, monitorId);
      console.log('[ENRICH] Enrichment response:', response);

      if (response.status) {
        toast.success('✨ Company enriched successfully!', {
          duration: 4000,
        });
        // Reload monitors to show updated enrichment data
        await loadDashboardContent();
      } else {
        toast.error(`❌ Enrichment failed: ${response.responseMessage || 'Unknown error'}`, {
          duration: 5000,
        });
      }
    } catch (error: any) {
      console.error('[ENRICH ERROR] Failed to enrich company:', error);
      toast.error(`❌ Enrichment failed: ${error.message || 'Unknown error'}`, {
        duration: 5000,
      });
    } finally {
      setTimeout(() => {
        setEnrichingMonitorId(null);
      }, 1000);
    }
  };

  const handleRevealEmail = async (focusId: string) => {
    setRevealingEmailId(focusId);
    try {
      const response = await LazarusService.revealFocusContactEmail(userId!, focusId);
      if (response.status) {
        toast.success(`✅ Email revealed! 1 credit deducted.`);
        await loadDashboardContent();
      } else {
        toast.error(`❌ Failed to reveal email`);
      }
    } catch (error: any) {
      toast.error(`❌ ${error.message || 'Unknown error'}`);
    } finally {
      setRevealingEmailId(null);
    }
  };

  const handleRevealPhone = async (focusId: string) => {
    setRevealingPhoneId(focusId);
    try {
      const response = await LazarusService.revealFocusContactPhone(userId!, focusId);
      if (response.status) {
        toast.success(`✅ Phone reveal initiated! 7 credits deducted. Processing...`);
        await loadDashboardContent();
      } else {
        toast.error(`❌ Failed to reveal phone`);
      }
    } catch (error: any) {
      toast.error(`❌ ${error.message || 'Unknown error'}`);
    } finally {
      setRevealingPhoneId(null);
    }
  };

  const handleBatchScanAll = async () => {
    setIsBatchScanning(true);
    setScanLogType('contact');
    setScanSamplePosts([]);
    setShowScanLogViewer(true);

    try {
      console.log('[BATCH SCAN] Starting batch scan for all due contacts...');
      const response = await LazarusService.scanFocusContacts(100);
      console.log('[BATCH SCAN] Scan response:', response);

      // Store sample posts for modal display
      if (response.responseData?.sample_posts) {
        console.log('[BATCH SCAN] Sample posts fetched:', response.responseData.sample_posts);
        setScanSamplePosts(response.responseData.sample_posts);
      }

      const scanned = response.responseData?.total_scanned || 0;
      const alerts = response.responseData?.total_alerts || 0;

      toast.success(`✅ Scanned ${scanned} contacts, created ${alerts} alerts`, {
        duration: 5000,
      });

      await loadDashboardContent();
    } catch (error: any) {
      console.error('[BATCH SCAN ERROR] Failed to batch scan:', error);
      toast.error(`❌ Batch scan failed: ${error.message || 'Unknown error'}`, {
        duration: 5000,
      });
    } finally {
      setTimeout(() => {
        setIsBatchScanning(false);
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
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Service Issue Banner - Internal infrastructure problem */}
        {quotaExceeded && (
          <Alert severity="info" onClose={() => setQuotaExceeded(false)} sx={{ mb: 3 }}>
            <AlertTitle>Scanning Temporarily Unavailable</AlertTitle>
            We're experiencing high demand. Our team has been notified and is working to restore full scanning capacity. Your existing alerts and monitoring will continue to work normally.
          </Alert>
        )}

        {/* Header */}
        <Box mb={4}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Box display="flex" alignItems="center" gap={1.5}>
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
              <Box>
                <Typography variant="h4" fontWeight={700} color="#111827" letterSpacing="-0.02em">
                  Lazarus Protocol
                </Typography>
                <Typography variant="body2" color="#6B7280" fontSize="13px" fontWeight={500}>
                  Automated CRM Resurrection Engine
                </Typography>
              </Box>
            </Box>
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

          {/* Action Buttons Row */}
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button
              variant="contained"
              startIcon={
                isBatchScanning ? (
                  <RefreshIcon sx={{ animation: 'spin 1s linear infinite', '@keyframes spin': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } } }} />
                ) : (
                  <RadarIcon />
                )
              }
              onClick={handleBatchScanAll}
              disabled={isBatchScanning}
              sx={{
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                color: '#fff',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '13px',
                borderRadius: '8px',
                px: 2.5,
                py: 1,
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  boxShadow: '0 6px 16px rgba(16, 185, 129, 0.4)',
                },
                '&:disabled': {
                  background: '#D1D5DB',
                  color: '#9CA3AF',
                },
              }}
            >
              {isBatchScanning ? 'Scanning...' : 'Scan All Due'}
            </Button>

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
                px: 2.5,
                py: 1,
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
                borderColor: '#C91A7940',
                color: '#C91A79',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '13px',
                borderRadius: '8px',
                px: 2.5,
                py: 1,
                '&:hover': {
                  borderColor: '#C91A79',
                  backgroundColor: '#C91A7908',
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
                borderColor: '#C91A7940',
                color: '#C91A79',
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '13px',
                borderRadius: '8px',
                px: 2.5,
                py: 1,
                '&:hover': {
                  borderColor: '#C91A79',
                  backgroundColor: '#C91A7908',
                },
              }}
            >
              CSV Upload
            </Button>
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
                {metrics?.new_alerts || 0}
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
            <Tab label="Scanned Content" />
            <Tab label="Rejected Posts" />
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
            {/* Alert Filters */}
            <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
              {/* Search */}
              <TextField
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="small"
                sx={{
                  flexGrow: 1,
                  minWidth: 200,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  },
                }}
              />

              {/* Signal Type Filter */}
              <Select
                value={filterSignalType}
                onChange={(e) => setFilterSignalType(e.target.value)}
                size="small"
                sx={{
                  minWidth: 180,
                  borderRadius: '8px',
                }}
              >
                <MenuItem value="all">All Signals</MenuItem>
                <MenuItem value="promoted">🎯 Promoted</MenuItem>
                <MenuItem value="changed_jobs">🚀 Changed Jobs</MenuItem>
                <MenuItem value="new_decision_maker">👑 Decision Maker</MenuItem>
                <MenuItem value="raised_funds">💰 Raised Funds</MenuItem>
                <MenuItem value="hiring">👥 Hiring</MenuItem>
                <MenuItem value="expansion">📈 Expansion</MenuItem>
                <MenuItem value="pain">😫 Pain Signal</MenuItem>
                <MenuItem value="competitor_complaint">🔴 Competitor Complaint</MenuItem>
                <MenuItem value="switch">🔄 Switch Signal</MenuItem>
              </Select>

              {/* Priority Filter */}
              <Select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                size="small"
                sx={{
                  minWidth: 150,
                  borderRadius: '8px',
                }}
              >
                <MenuItem value="all">All Priority</MenuItem>
                <MenuItem value="HOT">🔥 Hot (80+)</MenuItem>
                <MenuItem value="WARM">🟠 Warm (50-79)</MenuItem>
                <MenuItem value="COLD">🟡 Cold (&lt;50)</MenuItem>
              </Select>

              {/* Clear Filters */}
              {(filterSignalType !== 'all' || filterPriority !== 'all' || searchQuery) && (
                <Button
                  variant="text"
                  size="small"
                  onClick={() => {
                    setFilterSignalType('all');
                    setFilterPriority('all');
                    setSearchQuery('');
                  }}
                  sx={{ textTransform: 'none', color: '#6B7280' }}
                >
                  Clear Filters
                </Button>
              )}
            </Box>

            <Grid container spacing={2.5}>
              {(() => {
                // Apply filters
                const filteredAlerts = alerts
                  .filter((alert) => {
                    // Search filter
                    if (searchQuery && !alert.source_name.toLowerCase().includes(searchQuery.toLowerCase())) {
                      return false;
                    }

                    // Signal type filter
                    if (filterSignalType !== 'all') {
                      const signalType = (alert.evidence?.signal_type || '').toLowerCase();
                      if (!signalType.includes(filterSignalType.toLowerCase())) {
                        return false;
                      }
                    }

                    // Priority filter
                    if (filterPriority !== 'all' && alert.priority_level !== filterPriority) {
                      return false;
                    }

                    return true;
                  })
                  .sort((a, b) => (b.priority_score || 0) - (a.priority_score || 0)); // Sort by priority (highest first)

                return filteredAlerts.length === 0 ? (
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
                        {alerts.length === 0 ? 'No New Alerts' : 'No Alerts Match Filters'}
                      </Typography>
                      <Typography variant="body2" color="#6B7280" mb={3}>
                        {alerts.length === 0 ? 'Your monitors are scanning weekly for resurrection signals.' : 'Try adjusting your filters to see more alerts.'}
                      </Typography>
                    </Box>
                  </Grid>
                ) : (
                  filteredAlerts.map((alert) => (
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
                                label="🎯 BUYING SIGNAL"
                                size="small"
                                sx={{
                                  background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                                  color: '#fff',
                                  fontWeight: 600,
                                  fontSize: '11px',
                                }}
                              />
                              <Typography variant="caption" color="#9CA3AF" fontWeight={500}>
                                {new Date(alert.created_at).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </Typography>
                            </Box>
                            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={0.5}>
                              <Typography variant="h6" fontWeight={600} color="#111827">
                                {alert.source_name}
                              </Typography>
                              {/* Priority Score */}
                              {alert.priority_score !== undefined && (
                                <Box display="flex" alignItems="center" gap={0.5}>
                                  {alert.priority_level === 'HOT' && (
                                    <Box sx={{ display: 'flex', gap: 0.25 }}>
                                      <Typography fontSize="16px">🔥🔥🔥🔥🔥</Typography>
                                    </Box>
                                  )}
                                  {alert.priority_level === 'WARM' && (
                                    <Box sx={{ display: 'flex', gap: 0.25 }}>
                                      <Typography fontSize="16px">🔥🔥🔥</Typography>
                                    </Box>
                                  )}
                                  {alert.priority_level === 'COLD' && <Typography fontSize="16px">🟡</Typography>}
                                  <Typography fontSize="12px" fontWeight={700} color={alert.priority_level === 'HOT' ? '#EF4444' : alert.priority_level === 'WARM' ? '#F59E0B' : '#6B7280'}>
                                    {alert.priority_score}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                            <Typography variant="body2" color="#6B7280" fontSize="13px" mb={1.5}>
                              {alert.alert_message}
                            </Typography>

                            {/* Signal Details */}
                            <Box sx={{ mb: 1.5 }}>
                              <Typography variant="caption" color="#9CA3AF" fontSize="11px">
                                Signal: <strong>{alert.evidence?.signal_type || alert.alert_type}</strong>
                                {alert.evidence?.confidence && ` (${Math.round(alert.evidence.confidence * 100)}% confidence)`}
                              </Typography>
                            </Box>

                            {/* Evidence/Post */}
                            {alert.evidence?.evidence_text && (
                              <Box
                                sx={{
                                  mb: 2,
                                  p: 1.5,
                                  background: '#F9FAFB',
                                  borderRadius: '8px',
                                  borderLeft: '3px solid #7C3AED',
                                }}
                              >
                                <Typography variant="body2" fontSize="12px" color="#374151" fontStyle="italic">
                                  "{alert.evidence.evidence_text}"
                                </Typography>
                                {/* View Post Button - Opens actual LinkedIn/Twitter post */}
                                {(alert.evidence?.post_url || alert.evidence?.post_text) && (
                                  <Button
                                    variant="text"
                                    size="small"
                                    onClick={() => {
                                      if (alert.evidence?.post_url) {
                                        window.open(alert.evidence.post_url, '_blank');
                                        toast.success('Opening post...');
                                      } else {
                                        // Fallback: show modal if no URL but has text
                                        setSelectedAlertEvidence(alert);
                                        setShowPostViewer(true);
                                      }
                                    }}
                                    sx={{
                                      mt: 1,
                                      color: '#7C3AED',
                                      textTransform: 'none',
                                      fontWeight: 600,
                                      fontSize: '11px',
                                      '&:hover': {
                                        backgroundColor: '#7C3AED08',
                                      },
                                    }}
                                  >
                                    📄 {alert.evidence?.post_url ? 'View Original Post' : 'View Full Post'}
                                  </Button>
                                )}
                              </Box>
                            )}

                            {/* Post Platform Badge */}
                            {alert.evidence?.post_platform && (
                              <Box sx={{ mb: 2 }}>
                                <Chip
                                  label={`From ${alert.evidence.post_platform}`}
                                  size="small"
                                  sx={{
                                    fontSize: '10px',
                                    fontWeight: 600,
                                    background: '#7C3AED15',
                                    color: '#7C3AED',
                                  }}
                                />
                              </Box>
                            )}
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
                              {/* Only show LinkedIn button if signal is from LinkedIn or if we don't know the platform */}
                              {(!alert.evidence?.post_platform || alert.evidence?.post_platform === 'LinkedIn') && (
                                <Button
                                  variant="contained"
                                  size="small"
                                  startIcon={<LinkedInIcon sx={{ fontSize: 16 }} />}
                                  onClick={() => handleLinkedInMessage(alert)}
                                  sx={{
                                    background: '#0077B5',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    fontSize: '12px',
                                    px: 2,
                                    py: 0.75,
                                    borderRadius: '8px',
                                    '&:hover': {
                                      background: '#005582',
                                    },
                                  }}
                                >
                                  LinkedIn
                                </Button>
                              )}
                            </Box>
                            <Box display="flex" gap={1}>
                              {/* Only show Twitter button if signal is from Twitter */}
                              {alert.evidence?.post_platform === 'Twitter' && (
                                <Button
                                  variant="contained"
                                  size="small"
                                  startIcon={<TwitterIcon sx={{ fontSize: 16 }} />}
                                  onClick={() => handleTwitterMessage(alert)}
                                  sx={{
                                    background: '#1DA1F2',
                                    textTransform: 'none',
                                    fontWeight: 600,
                                    fontSize: '12px',
                                    px: 2,
                                    py: 0.75,
                                    borderRadius: '8px',
                                    '&:hover': {
                                      background: '#0C8BD9',
                                    },
                                  }}
                                >
                                  Twitter
                                </Button>
                              )}
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
                );
              })()}
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
                          {/* Profile Photo - Use enriched photo or fallback to icon */}
                          <Box
                            sx={{
                              width: 56,
                              height: 56,
                              borderRadius: '14px',
                              background: contact.profile_photo ? `url(${contact.profile_photo})` : 'linear-gradient(135deg, #F9F9F9 0%, #F0F0F0 100%)',
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: '2px solid #fff',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                              position: 'relative',
                            }}
                          >
                            {!contact.profile_photo && <PersonIcon sx={{ color: '#C91A79', fontSize: 24 }} />}
                            {/* Platform badge */}
                            <Box
                              sx={{
                                position: 'absolute',
                                bottom: -4,
                                right: -4,
                                width: 20,
                                height: 20,
                                borderRadius: '6px',
                                background: '#fff',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                              }}
                            >
                              {contact.linkedin_url ? (
                                <LinkedInIcon sx={{ fontSize: 12, color: '#0A66C2' }} />
                              ) : contact.twitter_url ? (
                                <TwitterIcon sx={{ fontSize: 12, color: '#1DA1F2' }} />
                              ) : (
                                <PersonIcon sx={{ fontSize: 12, color: '#9CA3AF' }} />
                              )}
                            </Box>
                          </Box>
                          <Box flex={1}>
                            <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                              <Typography fontSize="16px" fontWeight={600} color="#1A1A1A">
                                {contact.name}
                              </Typography>
                              {contact.enrichment_status === 'completed' && (
                                <Chip
                                  icon={<CheckCircleIcon sx={{ fontSize: 12 }} />}
                                  label="Enriched"
                                  size="small"
                                  sx={{
                                    height: '18px',
                                    fontSize: '10px',
                                    fontWeight: 600,
                                    background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                                    color: '#fff',
                                    '& .MuiChip-icon': { color: '#fff' },
                                  }}
                                />
                              )}
                            </Box>
                            {/* Headline from Bright Data */}
                            {contact.headline && (
                              <Typography fontSize="12px" color="#4B5563" fontWeight={500} mb={1} sx={{ lineHeight: 1.4 }}>
                                {contact.headline}
                              </Typography>
                            )}
                            {/* Current Company */}
                            {contact.current_company && (
                              <Box display="flex" alignItems="center" gap={0.5} mb={1}>
                                <BusinessIcon sx={{ fontSize: 12, color: '#6366F1' }} />
                                <Typography fontSize="11px" color="#6366F1" fontWeight={500}>
                                  {contact.current_company}
                                </Typography>
                              </Box>
                            )}
                            {/* Contact Actions - Email & Phone Reveal Buttons */}
                            <Box display="flex" gap={1} mt={1} mb={1} flexWrap="wrap">
                              {/* Email - Reveal or Show */}
                              {contact.email && contact.email !== 'PROCESSING' && contact.email !== 'UNAVAILABLE' ? (
                                <Box display="flex" alignItems="center" gap={0.5}>
                                  <EmailIcon sx={{ fontSize: 12, color: '#7C3AED' }} />
                                  <Typography fontSize="11px" color="#7C3AED" fontWeight={500}>
                                    {contact.email}
                                  </Typography>
                                </Box>
                              ) : contact.email === 'PROCESSING' ? (
                                <Box display="flex" alignItems="center" gap={0.5}>
                                  <EmailIcon sx={{ fontSize: 12, color: '#FFA500' }} />
                                  <Typography fontSize="11px" color="#FFA500" fontWeight={500}>
                                    Processing...
                                  </Typography>
                                </Box>
                              ) : contact.email === 'UNAVAILABLE' ? (
                                <Box display="flex" alignItems="center" gap={0.5}>
                                  <EmailIcon sx={{ fontSize: 12, color: '#EF4444' }} />
                                  <Typography fontSize="11px" color="#EF4444" fontWeight={500}>
                                    Email unavailable
                                  </Typography>
                                </Box>
                              ) : (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={revealingEmailId === contact.focus_id ? <CircularProgress size={12} /> : <EmailIcon sx={{ fontSize: 12 }} />}
                                  disabled={revealingEmailId === contact.focus_id}
                                  onClick={() => handleRevealEmail(contact.focus_id)}
                                  sx={{
                                    fontSize: '10px',
                                    padding: '4px 12px',
                                    borderColor: '#7C3AED',
                                    color: '#7C3AED',
                                    textTransform: 'none',
                                    '&:hover': {
                                      borderColor: '#6D28D9',
                                      backgroundColor: '#F3F4F6',
                                    },
                                  }}
                                >
                                  Reveal Email (1 credit)
                                </Button>
                              )}
                              {/* Phone - Reveal or Show */}
                              {contact.phone && contact.phone !== 'PROCESSING' && contact.phone !== 'UNAVAILABLE' ? (
                                <Box display="flex" alignItems="center" gap={0.5}>
                                  <PhoneIcon sx={{ fontSize: 12, color: '#10B981' }} />
                                  <Typography fontSize="11px" color="#10B981" fontWeight={500}>
                                    {contact.phone}
                                  </Typography>
                                </Box>
                              ) : contact.phone === 'PROCESSING' ? (
                                <Box display="flex" alignItems="center" gap={0.5}>
                                  <PhoneIcon sx={{ fontSize: 12, color: '#FFA500' }} />
                                  <Typography fontSize="11px" color="#FFA500" fontWeight={500}>
                                    Processing...
                                  </Typography>
                                </Box>
                              ) : contact.phone === 'UNAVAILABLE' ? (
                                <Box display="flex" alignItems="center" gap={0.5}>
                                  <PhoneIcon sx={{ fontSize: 12, color: '#EF4444' }} />
                                  <Typography fontSize="11px" color="#EF4444" fontWeight={500}>
                                    Phone unavailable
                                  </Typography>
                                </Box>
                              ) : (
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={revealingPhoneId === contact.focus_id ? <CircularProgress size={12} /> : <PhoneIcon sx={{ fontSize: 12 }} />}
                                  disabled={revealingPhoneId === contact.focus_id}
                                  onClick={() => handleRevealPhone(contact.focus_id)}
                                  sx={{
                                    fontSize: '10px',
                                    padding: '4px 12px',
                                    borderColor: '#10B981',
                                    color: '#10B981',
                                    textTransform: 'none',
                                    '&:hover': {
                                      borderColor: '#059669',
                                      backgroundColor: '#F3F4F6',
                                    },
                                  }}
                                >
                                  Reveal Phone (7 credits)
                                </Button>
                              )}
                            </Box>
                            {/* Location & Connections */}
                            <Box display="flex" alignItems="center" gap={1.5} flexWrap="wrap">
                              {contact.location && (
                                <Typography fontSize="11px" color="#9CA3AF" fontWeight={500}>
                                  📍 {contact.location}
                                </Typography>
                              )}
                              {contact.connections_count && contact.connections_count > 0 && (
                                <Typography fontSize="11px" color="#9CA3AF" fontWeight={500}>
                                  🔗 {contact.connections_count.toLocaleString()} connections
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        </Box>
                        <Box display="flex" gap={0.5}>
                          {/* Enrichment Button - Show if not enriched or failed, and has LinkedIn URL */}
                          {contact.linkedin_url && (!contact.enrichment_status || contact.enrichment_status === 'failed') && (
                            <IconButton
                              size="small"
                              sx={{
                                color: '#10B981',
                                '&:hover': { color: '#059669', backgroundColor: '#10B98110' },
                              }}
                              onClick={() => handleEnrichContact(contact.focus_id)}
                              disabled={enrichingContactId === contact.focus_id}
                              title="Enrich Profile (Email, Phone, Bio)"
                            >
                              <AutoAwesomeIcon
                                fontSize="small"
                                sx={{
                                  animation: enrichingContactId === contact.focus_id ? 'pulse 1.5s ease-in-out infinite' : 'none',
                                  '@keyframes pulse': {
                                    '0%, 100%': { opacity: 1 },
                                    '50%': { opacity: 0.5 },
                                  },
                                }}
                              />
                            </IconButton>
                          )}
                          {/* Enrichment Pending Indicator */}
                          {contact.enrichment_status === 'pending' && (
                            <IconButton size="small" sx={{ color: '#F59E0B' }} disabled title="Enrichment in progress...">
                              <CircularProgress size={16} sx={{ color: '#F59E0B' }} />
                            </IconButton>
                          )}
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
                      {/* Bio/About from Bright Data enrichment */}
                      {contact.about && (
                        <Box
                          sx={{
                            mb: 2,
                            p: 1.5,
                            borderRadius: '8px',
                            background: '#FAFAFA',
                            border: '1px solid #F0F0F0',
                          }}
                        >
                          <Typography fontSize="11px" color="#6B7280" fontWeight={500} sx={{ lineHeight: 1.5 }}>
                            {contact.about.length > 150 ? `${contact.about.substring(0, 150)}...` : contact.about}
                          </Typography>
                        </Box>
                      )}
                      <Box
                        sx={{
                          pt: 2,
                          borderTop: '1px solid #F5F5F5',
                        }}
                      >
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                          <Box>
                            <Typography fontSize="12px" color="#9CA3AF" fontWeight={600}>
                              {contact.scan_count} scans • {contact.alert_count} alerts
                            </Typography>
                            <Typography fontSize="11px" color="#9CA3AF" fontWeight={500}>
                              Scans every {contact.scan_frequency_days || 7} days
                            </Typography>
                          </Box>
                          <Button
                            variant="text"
                            size="small"
                            onClick={() => {
                              // Try different platform URLs in priority order
                              let profileUrl = contact.linkedin_url || contact.twitter_url;

                              // Fallback: Build URL from social_handle
                              if (!profileUrl && contact.social_handle) {
                                const handle = contact.social_handle.replace('@', '');

                                // Detect platform from social_handle
                                if (handle.includes('linkedin.com')) {
                                  profileUrl = handle.startsWith('http') ? handle : `https://www.linkedin.com/in/${handle}`;
                                } else if (handle.includes('twitter.com') || handle.includes('x.com')) {
                                  profileUrl = handle.startsWith('http') ? handle : `https://twitter.com/${handle}`;
                                } else if (handle.includes('tiktok.com')) {
                                  profileUrl = handle.startsWith('http') ? handle : `https://www.tiktok.com/@${handle}`;
                                } else if (handle.includes('facebook.com')) {
                                  profileUrl = handle.startsWith('http') ? handle : `https://www.facebook.com/${handle}`;
                                } else {
                                  // Default to LinkedIn if no platform detected
                                  profileUrl = `https://www.linkedin.com/in/${handle}`;
                                }
                              }

                              if (profileUrl) {
                                window.open(profileUrl, '_blank');
                                toast.success('Opening profile...');
                              } else {
                                toast.error('No profile URL found');
                              }
                            }}
                            sx={{
                              color: '#7C3AED',
                              textTransform: 'none',
                              fontWeight: 600,
                              fontSize: '11px',
                              minWidth: 'auto',
                              px: 1,
                              '&:hover': {
                                backgroundColor: '#7C3AED08',
                              },
                            }}
                          >
                            View →
                          </Button>
                        </Box>
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
                          {/* Enrichment Button - Show if not enriched or failed, and has LinkedIn URL */}
                          {monitor.linkedin_url && (!monitor.enrichment_status || monitor.enrichment_status === 'failed') && (
                            <IconButton
                              size="small"
                              sx={{
                                color: '#10B981',
                                '&:hover': { color: '#059669', backgroundColor: '#10B98110' },
                              }}
                              onClick={() => handleEnrichMonitor(monitor.monitor_id)}
                              disabled={enrichingMonitorId === monitor.monitor_id}
                              title="Enrich Company (About, Employees, Funding)"
                            >
                              <AutoAwesomeIcon
                                fontSize="small"
                                sx={{
                                  animation: enrichingMonitorId === monitor.monitor_id ? 'pulse 1.5s ease-in-out infinite' : 'none',
                                  '@keyframes pulse': {
                                    '0%, 100%': { opacity: 1 },
                                    '50%': { opacity: 0.5 },
                                  },
                                }}
                              />
                            </IconButton>
                          )}
                          {/* Enrichment Pending Indicator */}
                          {monitor.enrichment_status === 'pending' && (
                            <IconButton size="small" sx={{ color: '#F59E0B' }} disabled title="Enrichment in progress...">
                              <CircularProgress size={16} sx={{ color: '#F59E0B' }} />
                            </IconButton>
                          )}
                          {/* Enriched Badge */}
                          {monitor.enrichment_status === 'completed' && (
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                px: 1,
                                py: 0.5,
                                borderRadius: '6px',
                                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                              }}
                            >
                              <CheckCircleIcon sx={{ fontSize: 12, color: '#fff' }} />
                              <Typography fontSize="10px" fontWeight={600} color="#fff">
                                Enriched
                              </Typography>
                            </Box>
                          )}
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

          {/* Scanned Content Tab */}
          <TabPanel value={tabValue} index={3}>
            <ScannedContentTab userId={userId || ''} />
          </TabPanel>

          {/* Rejected Posts Tab */}
          <TabPanel value={tabValue} index={4}>
            {userId && <RejectedPostsTab userId={userId} />}
          </TabPanel>

          {/* Analytics Tab */}
          <TabPanel value={tabValue} index={5}>
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
                    mb: 4,
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

                {/* Advanced Analytics - Phase 3 */}
                <AdvancedAnalytics
                  data={
                    analyticsData
                      ? {
                          resurrection_funnel: analyticsData.funnel_metrics
                            ? {
                                contacts_monitored: analyticsData.funnel_metrics.contacts_monitored || 0,
                                scans_completed: analyticsData.funnel_metrics.scans_completed || 0,
                                alerts_created: analyticsData.funnel_metrics.alerts_created || 0,
                                contacts_reached: analyticsData.funnel_metrics.contacts_reached || 0,
                                deals_resurrected: analyticsData.funnel_metrics.deals_resurrected || 0,
                                resurrection_rate: analyticsData.resurrection_rate || 0,
                              }
                            : {
                                contacts_monitored: analyticsData.slots_used || 0,
                                scans_completed: analyticsData.total_alerts || 0,
                                alerts_created: analyticsData.total_alerts || 0,
                                contacts_reached: analyticsData.acted_upon_count || 0,
                                deals_resurrected: analyticsData.resurrected_leads_count || 0,
                                resurrection_rate: analyticsData.resurrection_rate || 0,
                              },
                          signal_performance:
                            analyticsData.alert_types_performance?.map((type: any) => ({
                              signal_type: type.alert_type,
                              detected: type.total,
                              contacted: type.acted_upon,
                              resurrected: Math.floor(type.acted_upon * 0.7),
                              conversion_rate: type.action_rate,
                            })) || [],
                          roi_metrics: {
                            leads_resurrected: analyticsData.resurrected_leads_count || 0,
                            avg_deal_value: 5000,
                            total_revenue: (analyticsData.resurrected_leads_count || 0) * 5000,
                            monthly_cost: analyticsData.plan_type === 'PRO' ? 97 : 47,
                            time_invested_hours: Math.floor((analyticsData.acted_upon_count || 0) * 0.5),
                            hourly_rate: 50,
                            total_cost: (analyticsData.plan_type === 'PRO' ? 97 : 47) + Math.floor((analyticsData.acted_upon_count || 0) * 0.5) * 50,
                            roi_percentage:
                              analyticsData.resurrected_leads_count > 0
                                ? Math.round(
                                    ((analyticsData.resurrected_leads_count * 5000 - ((analyticsData.plan_type === 'PRO' ? 97 : 47) + Math.floor((analyticsData.acted_upon_count || 0) * 0.5) * 50)) /
                                      ((analyticsData.plan_type === 'PRO' ? 97 : 47) + Math.floor((analyticsData.acted_upon_count || 0) * 0.5) * 50)) *
                                      100
                                  )
                                : 0,
                          },
                          platform_performance: analyticsData.platform_breakdown
                            ? [
                                {
                                  platform: 'LinkedIn',
                                  posts_scanned: 0,
                                  signals_found: analyticsData.platform_breakdown.LinkedIn || 0,
                                  success_rate: 0,
                                },
                                {
                                  platform: 'Twitter',
                                  posts_scanned: 0,
                                  signals_found: analyticsData.platform_breakdown.Twitter || 0,
                                  success_rate: 0,
                                },
                                {
                                  platform: 'Facebook',
                                  posts_scanned: 0,
                                  signals_found: analyticsData.platform_breakdown.Facebook || 0,
                                  success_rate: 0,
                                },
                                {
                                  platform: 'TikTok',
                                  posts_scanned: 0,
                                  signals_found: analyticsData.platform_breakdown.TikTok || 0,
                                  success_rate: 0,
                                },
                              ]
                            : [],
                        }
                      : null
                  }
                  loading={false}
                />
              </Box>
            )}
          </TabPanel>
        </Box>
      </Container>

      {/* Modals */}
      <ConnectCRMModal open={showCRMModal} onClose={() => setShowCRMModal(false)} userId={userId || ''} onSuccess={loadDashboardData} />

      <AddFocusContactModal
        open={showAddContactModal || editingContact !== null}
        onClose={() => {
          setShowAddContactModal(false);
          setEditingContact(null);
        }}
        userId={userId || ''}
        onSuccess={() => {
          loadDashboardContent();
          setEditingContact(null);
        }}
        editMode={editingContact !== null}
        contactId={editingContact?.focus_id}
        existingContact={
          editingContact
            ? {
                name: editingContact.name,
                social_handle: editingContact.social_handle,
                last_bio_text: editingContact.last_bio_text,
                industry_keywords: editingContact.industry_keywords,
              }
            : undefined
        }
      />

      <AddCompanyMonitorModal open={showAddCompanyModal} onClose={() => setShowAddCompanyModal(false)} userId={userId || ''} onSuccess={loadDashboardContent} />

      <CSVUploadModal open={showCSVUploadModal} onClose={() => setShowCSVUploadModal(false)} userId={userId || ''} onSuccess={loadDashboardContent} />

      <PasteAndGoModal open={showPasteAndGoModal} onClose={() => setShowPasteAndGoModal(false)} userId={userId || ''} onSuccess={loadDashboardContent} />

      <ScanLogViewerModal
        open={showScanLogViewer}
        onClose={() => setShowScanLogViewer(false)}
        scanType={scanLogType}
        scanningId={isBatchScanning ? 'batch' : scanLogType === 'contact' ? scanningContactId : scanningMonitorId}
        samplePosts={scanSamplePosts}
        alertData={scanAlertData}
      />

      {/* Post Viewer Modal */}
      <PostViewerModal
        open={showPostViewer}
        onClose={() => {
          setShowPostViewer(false);
          setSelectedAlertEvidence(null);
          setSelectedContactPhoto(undefined);
        }}
        evidence={selectedAlertEvidence?.evidence || null}
        contactName={selectedAlertEvidence?.source_name}
        contactPhoto={selectedContactPhoto}
      />

      {/* Email Composer Modal */}
      <EmailComposerModal
        open={showEmailComposer}
        onClose={() => {
          setShowEmailComposer(false);
          setSelectedAlertForEmail(null);
          setSelectedContactEmail(undefined);
        }}
        alert={selectedAlertForEmail}
        contactEmail={selectedContactEmail}
        onSent={handleEmailSent}
      />

      {/* Contact/Monitor Actions Menu */}
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
        {selectedContact && (
          <>
            <MenuItem
              onClick={() => {
                setEditingContact(selectedContact);
                setMenuAnchor(null);
                setSelectedContact(null);
              }}
              sx={{
                py: 1.5,
                fontSize: '14px',
                '&:hover': {
                  background: '#FFF5FA',
                },
              }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <PersonIcon sx={{ fontSize: 18, color: '#C91A79' }} />
                <Typography fontSize="14px" fontWeight={500}>
                  Edit Contact
                </Typography>
              </Box>
            </MenuItem>
            <MenuItem
              onClick={() => {
                setContactToDelete(selectedContact);
                setShowDeleteModal(true);
                setMenuAnchor(null);
              }}
              sx={{
                py: 1.5,
                fontSize: '14px',
                '&:hover': {
                  background: '#FEF2F2',
                },
              }}
            >
              <Box display="flex" alignItems="center" gap={1}>
                <DeleteIcon sx={{ fontSize: 18, color: '#EF4444' }} />
                <Typography fontSize="14px" fontWeight={500} color="#EF4444">
                  Delete Contact
                </Typography>
              </Box>
            </MenuItem>
            <Box sx={{ height: '1px', background: '#F3F4F6', my: 1 }} />
          </>
        )}
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

      {/* Delete Confirmation Modal */}
      <Dialog
        open={showDeleteModal}
        onClose={() => !isDeleting && setShowDeleteModal(false)}
        maxWidth="xs"
        PaperProps={{
          sx: {
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
          },
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pt: 3, pb: 2, px: 3 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: '#FEE2E2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <DeleteIcon sx={{ color: '#EF4444', fontSize: 28 }} />
          </Box>
          <Typography fontSize="18px" fontWeight={700} color="#1A1A1A" mb={0.5}>
            Delete Contact?
          </Typography>
          <Typography fontSize="13px" color="#6B7280" lineHeight={1.5}>
            Are you sure you want to delete <strong>{contactToDelete?.name}</strong>?
          </Typography>
        </DialogTitle>

        <DialogContent sx={{ px: 3, pb: 2, pt: 0 }}>
          <Typography fontSize="12px" color="#9CA3AF" textAlign="center">
            {contactToDelete?.scan_count || 0} scans • {contactToDelete?.alert_count || 0} alerts will be permanently removed
          </Typography>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 3, gap: 2, flexDirection: 'column' }}>
          <Button
            onClick={handleDeleteContact}
            disabled={isDeleting}
            fullWidth
            variant="contained"
            sx={{
              py: 1.25,
              borderRadius: '8px',
              textTransform: 'none',
              fontSize: '14px',
              fontWeight: 600,
              background: '#EF4444',
              boxShadow: 'none',
              '&:hover': {
                background: '#DC2626',
                boxShadow: 'none',
              },
              '&:disabled': {
                background: '#E5E7EB',
                color: '#9CA3AF',
              },
            }}
          >
            {isDeleting ? (
              <Box display="flex" alignItems="center" gap={1}>
                <CircularProgress size={16} sx={{ color: '#fff' }} />
                Deleting...
              </Box>
            ) : (
              'Yes, Delete'
            )}
          </Button>
          <Button
            onClick={() => setShowDeleteModal(false)}
            disabled={isDeleting}
            fullWidth
            variant="text"
            sx={{
              py: 1.25,
              borderRadius: '8px',
              textTransform: 'none',
              fontSize: '14px',
              fontWeight: 600,
              color: '#6B7280',
              '&:hover': {
                background: '#F9FAFB',
              },
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
};

export default LazarusProtocolPage;
