import { SocialConnection, SocialMediaAgentService } from '@/api/SocialMediaAgentService';
import DashboardLayout from '@/components/atoms/DashboardLayout';
import SeoHead from '@/components/atoms/SeoHead';
import ConnectFacebookModal from '@/components/social-media/ConnectFacebookModal';
import ConnectedAccountCard from '@/components/social-media/ConnectedAccountCard';
import { ToastTypeEnum } from '@/models/enum-models/ToastTypeEnum';
import { ToastService } from '@/utils/toast.util';
import { Box, Button, CircularProgress, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { MdOutlineCampaign } from 'react-icons/md';

const SocialAccountsPage = () => {
  const router = useRouter();
  const [connections, setConnections] = useState<SocialConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchConnections = useCallback(async () => {
    setLoading(true);
    try {
      const response = await SocialMediaAgentService.getConnections();
      if (response.status && response.responseData) {
        // Backend returns { connections: { facebook: [...], instagram: [...] }, ... }
        // Flatten the platform-keyed dict into a single array
        const raw = response.responseData as any;
        const platformMap: Record<string, SocialConnection[]> = raw.connections ?? {};
        // Inject the platform key from the dict key into each connection object
        const flat: SocialConnection[] = Object.entries(platformMap).flatMap(([platform, conns]) => conns.map((conn) => ({ ...conn, platform })));
        setConnections(flat);
      }
    } catch {
      // silently ignore — user may have no connections yet
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConnections();
  }, [fetchConnections]);

  // Handle OAuth callback: ?platform=facebook&connected=true
  useEffect(() => {
    const { platform, connected } = router.query;
    if (platform && connected === 'true') {
      ToastService.showToast(`${platform} connected successfully!`, ToastTypeEnum.Success);
      fetchConnections();
      // clean up query params
      router.replace('/settings/social-accounts', undefined, { shallow: true });
    }
  }, [router.query, fetchConnections, router]);

  return (
    <>
      <SeoHead title="Social Accounts" />
      <DashboardLayout excludeHeader>
        <Box sx={{ backgroundColor: '#FAFAFA', minHeight: '100vh' }}>
          {/* Header */}
          <Box sx={{ backgroundColor: '#fff', pt: '52px', pb: '24px', px: 3, borderBottom: '1px solid #E5E7EB' }}>
            <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
              <Box display="flex" alignItems="center" gap={1.5}>
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
                  <Typography sx={{ fontSize: 'clamp(20px, 1.5vw + 10px, 28px)', color: '#212529', fontWeight: 800, lineHeight: 1 }}>Social Accounts</Typography>
                  <Typography fontSize="13px" color="#6B7280" mt={0.25}>
                    Manage connected social media platforms
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                onClick={() => setModalOpen(true)}
                sx={{
                  background: 'linear-gradient(135deg, #1877F2 0%, #0D5FD9 100%)',
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(24, 119, 242, 0.3)',
                  '&:hover': { background: 'linear-gradient(135deg, #0D5FD9 0%, #1877F2 100%)' },
                }}
              >
                + Connect Facebook
              </Button>
            </Box>
          </Box>

          {/* Content */}
          <Box sx={{ px: 3, py: 4 }}>
            {loading ? (
              <Box display="flex" justifyContent="center" py={8}>
                <CircularProgress sx={{ color: '#CD1B78' }} />
              </Box>
            ) : connections.length === 0 ? (
              <Box
                sx={{
                  border: '2px dashed #E5E7EB',
                  borderRadius: '16px',
                  p: 6,
                  textAlign: 'center',
                  background: '#fff',
                }}
              >
                <MdOutlineCampaign size={48} color="#D1D5DB" />
                <Typography fontWeight={600} fontSize="18px" color="#374151" mt={2} mb={1}>
                  No social accounts connected
                </Typography>
                <Typography fontSize="14px" color="#6B7280" mb={3}>
                  Connect your Facebook page to start publishing AI-generated content
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => setModalOpen(true)}
                  sx={{
                    background: 'linear-gradient(135deg, #1877F2 0%, #0D5FD9 100%)',
                    textTransform: 'none',
                    fontWeight: 600,
                  }}
                >
                  Connect Facebook Page
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 640 }}>
                {connections.map((conn) => (
                  <ConnectedAccountCard key={`${conn.platform}-${conn.page_id}`} connection={conn} onDisconnect={fetchConnections} />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </DashboardLayout>

      <ConnectFacebookModal open={modalOpen} onClose={() => setModalOpen(false)} onSuccess={fetchConnections} />
    </>
  );
};

export default SocialAccountsPage;
