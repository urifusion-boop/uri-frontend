import { BrandProfileService } from '@/api/BrandProfileService';
import { AutoGenerateSettings, ContentDraft, SocialMediaAgentService } from '@/api/SocialMediaAgentService';
import DashboardLayout from '@/components/atoms/DashboardLayout';
import SeoHead from '@/components/atoms/SeoHead';
import AutoGenerateTab from '@/components/social-media/AutoGenerateTab';
import ContentGeneratorForm from '@/components/social-media/ContentGeneratorForm';
import DraftCard from '@/components/social-media/DraftCard';
import ScheduledCard from '@/components/social-media/ScheduledCard';
import { Box, CircularProgress, Tab, Tabs, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { MdOutlineCampaign } from 'react-icons/md';

type TabKey = 'create' | 'drafts' | 'scheduled' | 'auto';

const SocialMediaPage = () => {
  const router = useRouter();
  const [brandCheckDone, setBrandCheckDone] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('create');
  // Keep a ref in sync with activeTab so delayed callbacks can read current value
  const activeTabRef = useRef<TabKey>('create');
  const [drafts, setDrafts] = useState<ContentDraft[]>([]);
  const [scheduled, setScheduled] = useState<ContentDraft[]>([]);
  const [autoSettings, setAutoSettings] = useState<AutoGenerateSettings | null>(null);
  const [loadingDrafts, setLoadingDrafts] = useState(false);
  const [draftsError, setDraftsError] = useState(false);
  const [loadingScheduled, setLoadingScheduled] = useState(false);
  const [loadingAutoSettings, setLoadingAutoSettings] = useState(false);

  // ── Brand profile gate ─────────────────────────────────────────────────────
  // Redirect to onboarding if the user hasn't completed brand setup yet.
  useEffect(() => {
    BrandProfileService.isOnboardingDone().then((done) => {
      if (!done) {
        router.replace('/social-media/brand-setup');
      } else {
        setBrandCheckDone(true);
      }
    });
  }, [router]);

  const fetchDrafts = useCallback(async () => {
    setLoadingDrafts(true);
    setDraftsError(false);
    try {
      const response = await SocialMediaAgentService.getContentCalendar();
      if (response.status && response.responseData) {
        const allDrafts = response.responseData.drafts ?? [];
        // Terminal states that belong to other tabs or are done — exclude from Drafts
        const EXCLUDE_FROM_DRAFTS = new Set(['published', 'scheduled', 'approved', 'ready_to_publish', 'denied', 'replaced']);
        setDrafts(
          allDrafts.filter((d) => {
            const s = d.status;
            const a = d.approval_status;
            if (s) return !EXCLUDE_FROM_DRAFTS.has(s);
            if (a) return a === 'pending'; // only pending approval_status shown in drafts
            return true; // no status at all — newly generated, show it
          })
        );
      } else {
        setDraftsError(true);
      }
    } catch {
      setDraftsError(true);
    } finally {
      setLoadingDrafts(false);
    }
  }, []);

  const fetchScheduled = useCallback(async () => {
    setLoadingScheduled(true);
    try {
      const response = await SocialMediaAgentService.getScheduled();
      if (response.status && response.responseData) {
        setScheduled(response.responseData.scheduled_drafts ?? []);
      }
    } catch {
      // no-op
    } finally {
      setLoadingScheduled(false);
    }
  }, []);

  const fetchAutoSettings = useCallback(async () => {
    setLoadingAutoSettings(true);
    try {
      const response = await SocialMediaAgentService.getAutoGenerateSettings();
      if (response.status && response.responseData) {
        setAutoSettings(response.responseData);
      }
    } catch {
      // no-op
    } finally {
      setLoadingAutoSettings(false);
    }
  }, []);

  useEffect(() => {
    activeTabRef.current = activeTab;
    if (activeTab === 'drafts') fetchDrafts();
    if (activeTab === 'scheduled') fetchScheduled();
    if (activeTab === 'auto') fetchAutoSettings();
  }, [activeTab, fetchDrafts, fetchScheduled, fetchAutoSettings]);

  const handleGenerated = () => {
    setActiveTab('drafts');
    fetchDrafts();
  };

  // Silent background refresh — only re-fetches if the user is already on drafts.
  // Used by AutoGenerateTab to pick up images after they finish generating.
  const handleRefreshDrafts = useCallback(() => {
    if (activeTabRef.current === 'drafts') fetchDrafts();
  }, [fetchDrafts]);

  // Show a full-screen loader while checking brand profile (avoids flash of dashboard)
  if (!brandCheckDone) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFAFA' }}>
        <CircularProgress sx={{ color: '#1a1a2e' }} />
      </Box>
    );
  }

  return (
    <>
      <SeoHead title="Social Media" />
      <DashboardLayout excludeHeader>
        <Box sx={{ backgroundColor: '#FAFAFA', minHeight: '100vh' }}>
          {/* Header */}
          <Box sx={{ backgroundColor: '#fff', pt: '52px', pb: 0, px: 3, borderBottom: '1px solid #E5E7EB' }}>
            <Box display="flex" alignItems="center" gap={1.5} mb={3}>
              <Box
                sx={{
                  backgroundColor: '#CD1B78',
                  padding: '8px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MdOutlineCampaign size={24} color="#fff" />
              </Box>
              <Box>
                <Typography sx={{ fontSize: 'clamp(20px, 1.5vw + 10px, 28px)', color: '#212529', fontWeight: 800, lineHeight: 1 }}>Content Manager</Typography>
                <Typography fontSize="13px" color="#6B7280" mt={0.25}>
                  AI-powered social media content creation
                </Typography>
              </Box>
            </Box>

            <Tabs
              value={activeTab}
              onChange={(_, v) => setActiveTab(v)}
              sx={{
                '& .MuiTab-root': { textTransform: 'none', fontWeight: 600, fontSize: '14px' },
                '& .Mui-selected': { color: '#CD1B78' },
                '& .MuiTabs-indicator': { backgroundColor: '#CD1B78' },
              }}
            >
              <Tab label="Create" value="create" />
              <Tab label={`Drafts${drafts.length > 0 ? ` (${drafts.length})` : ''}`} value="drafts" />
              <Tab label={`Scheduled${scheduled.length > 0 ? ` (${scheduled.length})` : ''}`} value="scheduled" />
              <Tab label="Auto" value="auto" />
            </Tabs>
          </Box>

          {/* Tab Content */}
          <Box sx={{ px: 3, py: 4 }}>
            {activeTab === 'create' && <ContentGeneratorForm onGenerated={handleGenerated} />}

            {activeTab === 'drafts' && (
              <>
                {loadingDrafts ? (
                  <Box display="flex" justifyContent="center" py={8}>
                    <CircularProgress sx={{ color: '#CD1B78' }} />
                  </Box>
                ) : draftsError ? (
                  <EmptyState message="Could not load drafts. Please try again." retry={fetchDrafts} />
                ) : drafts.length === 0 ? (
                  <EmptyState message="No drafts yet. Generate content from the Create tab." />
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 720 }}>
                    {drafts.map((draft) => (
                      <DraftCard key={draft.draft_id ?? draft.id} draft={draft} onRefresh={fetchDrafts} />
                    ))}
                  </Box>
                )}
              </>
            )}

            {activeTab === 'scheduled' && (
              <>
                {loadingScheduled ? (
                  <Box display="flex" justifyContent="center" py={8}>
                    <CircularProgress sx={{ color: '#CD1B78' }} />
                  </Box>
                ) : scheduled.length === 0 ? (
                  <EmptyState message="No scheduled posts. Approve a draft and choose 'Schedule' to add one." />
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 720 }}>
                    {scheduled.map((item) => (
                      <ScheduledCard key={item.draft_id ?? item.id} draft={item} onRefresh={fetchScheduled} />
                    ))}
                  </Box>
                )}
              </>
            )}

            {activeTab === 'auto' && (
              <>
                {loadingAutoSettings ? (
                  <Box display="flex" justifyContent="center" py={8}>
                    <CircularProgress sx={{ color: '#CD1B78' }} />
                  </Box>
                ) : (
                  <AutoGenerateTab settings={autoSettings} onGenerated={handleGenerated} onSettingsChange={fetchAutoSettings} onRefreshDrafts={handleRefreshDrafts} />
                )}
              </>
            )}
          </Box>
        </Box>
      </DashboardLayout>
    </>
  );
};

const EmptyState = ({ message, retry }: { message: string; retry?: () => void }) => (
  <Box
    sx={{
      border: '2px dashed #E5E7EB',
      borderRadius: '16px',
      p: 6,
      textAlign: 'center',
      background: '#fff',
      maxWidth: 480,
    }}
  >
    <MdOutlineCampaign size={48} color="#D1D5DB" />
    <Typography fontSize="14px" color="#6B7280" mt={2}>
      {message}
    </Typography>
    {retry && (
      <Typography fontSize="13px" color="#CD1B78" mt={1.5} sx={{ cursor: 'pointer', textDecoration: 'underline' }} onClick={retry}>
        Retry
      </Typography>
    )}
  </Box>
);

export default SocialMediaPage;
