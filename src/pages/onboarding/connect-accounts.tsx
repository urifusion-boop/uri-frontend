import { AvailablePage, SocialAccountService } from '@/api/SocialAccountService';
import CustomButton from '@/components/atoms/CustomButton';
import SeoHead from '@/components/atoms/SeoHead';
import useCustomTheme from '@/hooks/theme.hook';
import { useAuth } from '@/providers/AuthProvider';
import { Box, Checkbox, CircularProgress, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaCheckCircle, FaFacebook, FaInstagram } from 'react-icons/fa';

// Platforms available for real OAuth connection
const LIVE_PLATFORMS = [
  {
    id: 'facebook',
    name: 'Facebook',
    description: 'Connect Pages you manage',
    icon: FaFacebook,
    color: '#1877F2',
    bg: '#E7F0FD',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    description: 'Business & creator accounts via Facebook',
    icon: FaInstagram,
    color: '#E4405F',
    bg: '#FDE7EC',
  },
];

// Platforms that are coming soon (grayed out)
const COMING_SOON_PLATFORMS = ['LinkedIn', 'TikTok', 'YouTube', 'X (Twitter)'];

type PageState = 'selecting' | 'connecting' | 'pending' | 'finalizing' | 'success' | 'error';

const ConnectAccountsPage = () => {
  const router = useRouter();
  const { themeColors } = useCustomTheme();
  const { userDetails } = useAuth();

  const [pageState, setPageState] = useState<PageState>('selecting');
  const [selectedPlatformId, setSelectedPlatformId] = useState<string | null>(null);
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [availablePages, setAvailablePages] = useState<AvailablePage[]>([]);
  const [selectedPageIds, setSelectedPageIds] = useState<string[]>([]);
  const [connectedAccounts, setConnectedAccounts] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [networkName, setNetworkName] = useState<string>('');

  // Protect route
  useEffect(() => {
    if (!userDetails?.userId) {
      router.push('/login');
    }
  }, [userDetails, router]);

  // Handle OAuth callback redirect — Outstand sends back ?sessionToken=...&connected=pending
  useEffect(() => {
    if (!router.isReady) return;

    const { sessionToken: token, connected, error } = router.query;

    if (connected === 'pending' && typeof token === 'string' && token) {
      setSessionToken(token);
      setPageState('connecting');
      fetchPendingConnection(token);
    } else if (connected === 'false') {
      const msg = typeof error === 'string' ? decodeURIComponent(error) : 'Connection was cancelled or failed.';
      setErrorMessage(msg);
      setPageState('error');
    }
  }, [router.isReady, router.query]);

  const fetchPendingConnection = async (token: string) => {
    try {
      const response = await SocialAccountService.getPendingConnection(token);
      if (response.status && response.responseData) {
        const data = response.responseData;
        setAvailablePages(data.available_pages ?? []);
        setNetworkName(data.network ?? '');
        // Auto-select all pages if only one
        if (data.available_pages?.length === 1) {
          setSelectedPageIds([data.available_pages[0].id]);
        }
        setPageState('pending');
      } else {
        setErrorMessage('Could not load your accounts. The session may have expired.');
        setPageState('error');
      }
    } catch {
      setErrorMessage('Could not load your accounts. Please try connecting again.');
      setPageState('error');
    }
  };

  const handleConnect = async () => {
    if (!selectedPlatformId) {
      toast.error('Please select a platform first.');
      return;
    }
    setPageState('connecting');
    try {
      const response = await SocialAccountService.initiateConnection([selectedPlatformId]);
      if (response.status && response.responseData?.auth_urls) {
        const authUrl = response.responseData.auth_urls[selectedPlatformId];
        if (authUrl) {
          // Redirect the browser to the OAuth page
          window.location.href = authUrl;
        } else {
          toast.error('Could not get the connection URL. Please try again.');
          setPageState('selecting');
        }
      } else {
        toast.error(response.responseMessage || 'Failed to initiate connection.');
        setPageState('selecting');
      }
    } catch {
      toast.error('Failed to initiate connection. Please try again.');
      setPageState('selecting');
    }
  };

  const handleFinalize = async () => {
    if (selectedPageIds.length === 0) {
      toast.error('Please select at least one account to connect.');
      return;
    }
    if (!sessionToken) return;

    setPageState('finalizing');
    try {
      const response = await SocialAccountService.finalizeConnection(sessionToken, selectedPageIds);
      if (response.status && response.responseData) {
        setConnectedAccounts(response.responseData.accounts_connected ?? []);
        setPageState('success');
        toast.success('Accounts connected successfully!');
      } else {
        toast.error(response.responseMessage || 'Failed to complete connection.');
        setPageState('pending');
      }
    } catch {
      toast.error('Failed to complete connection. Please try again.');
      setPageState('pending');
    }
  };

  const handlePageToggle = (pageId: string) => {
    setSelectedPageIds((prev) => (prev.includes(pageId) ? prev.filter((id) => id !== pageId) : [...prev, pageId]));
  };

  const handleSkip = () => {
    router.push('/onboarding/select-workflow');
  };

  const handleContinue = () => {
    router.push('/onboarding/select-workflow');
  };

  const handleRetry = () => {
    setPageState('selecting');
    setSelectedPlatformId(null);
    setSessionToken(null);
    setAvailablePages([]);
    setSelectedPageIds([]);
    setErrorMessage('');
    // Clear query params
    router.replace('/onboarding/connect-accounts', undefined, { shallow: true });
  };

  // ── Loading / connecting states ───────────────────────────────────────────
  if (pageState === 'connecting' || pageState === 'finalizing') {
    return (
      <>
        <SeoHead title="Connecting Account - Uri Creative" />
        <Box sx={{ background: themeColors.background, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
          <Box sx={{ bgcolor: '#fff', borderRadius: '20px', p: { xs: 4, md: 5 }, boxShadow: '1px 1px 6px 3px #00000011', textAlign: 'center', maxWidth: 400, width: '100%' }}>
            <CircularProgress size={56} sx={{ color: themeColors.primary, mb: 3 }} />
            <Typography sx={{ fontSize: { xs: 18, md: 22 }, fontWeight: 700, color: '#0d0e0f', mb: 1 }}>
              {pageState === 'finalizing' ? 'Connecting your accounts...' : 'Loading your accounts...'}
            </Typography>
            <Typography sx={{ fontSize: 14, color: '#6C727F' }}>{pageState === 'finalizing' ? 'This only takes a moment.' : 'Retrieving available pages from your account.'}</Typography>
          </Box>
        </Box>
      </>
    );
  }

  // ── Success state ─────────────────────────────────────────────────────────
  if (pageState === 'success') {
    return (
      <>
        <SeoHead title="Account Connected - Uri Creative" />
        <Box sx={{ background: themeColors.background, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
          <Box sx={{ bgcolor: '#fff', borderRadius: '20px', p: { xs: 4, md: 5 }, boxShadow: '1px 1px 6px 3px #00000011', textAlign: 'center', maxWidth: 480, width: '100%' }}>
            <FaCheckCircle size={56} color="#4CAF50" style={{ marginBottom: 16 }} />
            <Typography sx={{ fontSize: { xs: 20, md: 26 }, fontWeight: 700, color: '#0d0e0f', mb: 1 }}>Accounts connected!</Typography>
            <Typography sx={{ fontSize: 14, color: '#6C727F', mb: 3 }}>
              {connectedAccounts.length} account{connectedAccounts.length !== 1 ? 's' : ''} connected successfully.
            </Typography>

            {connectedAccounts.map((acc) => (
              <Box key={acc.outstand_account_id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5, p: 1.5, borderRadius: 2, bgcolor: '#F9FAFB', border: '1px solid #E5E7EB' }}>
                <FaCheckCircle color="#4CAF50" size={18} />
                <Box sx={{ textAlign: 'left' }}>
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#0d0e0f' }}>{acc.account_name || acc.username}</Typography>
                  <Typography sx={{ fontSize: 12, color: '#6C727F', textTransform: 'capitalize' }}>{acc.platform}</Typography>
                </Box>
              </Box>
            ))}

            <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <CustomButton mode="primary" onClick={handleContinue} style={{ width: '100%', padding: '12px' }}>
                Continue to Setup
              </CustomButton>
              <Typography
                onClick={() => {
                  setPageState('selecting');
                  setSelectedPlatformId(null);
                  router.replace('/onboarding/connect-accounts', undefined, { shallow: true });
                }}
                sx={{ fontSize: 13, color: themeColors.primary, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
              >
                Connect another account
              </Typography>
            </Box>
          </Box>
        </Box>
      </>
    );
  }

  // ── Error state ───────────────────────────────────────────────────────────
  if (pageState === 'error') {
    return (
      <>
        <SeoHead title="Connection Failed - Uri Creative" />
        <Box sx={{ background: themeColors.background, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
          <Box sx={{ bgcolor: '#fff', borderRadius: '20px', p: { xs: 4, md: 5 }, boxShadow: '1px 1px 6px 3px #00000011', textAlign: 'center', maxWidth: 420, width: '100%' }}>
            <Typography sx={{ fontSize: 40, mb: 2 }}>&#x26A0;</Typography>
            <Typography sx={{ fontSize: { xs: 18, md: 22 }, fontWeight: 700, color: '#0d0e0f', mb: 1 }}>Connection failed</Typography>
            <Typography sx={{ fontSize: 14, color: '#6C727F', mb: 3 }}>{errorMessage}</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <CustomButton mode="primary" onClick={handleRetry} style={{ width: '100%', padding: '12px' }}>
                Try Again
              </CustomButton>
              <Typography onClick={handleSkip} sx={{ fontSize: 13, color: themeColors.primary, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                Skip for now
              </Typography>
            </Box>
          </Box>
        </Box>
      </>
    );
  }

  // ── Pending state — page/account selection ────────────────────────────────
  if (pageState === 'pending') {
    return (
      <>
        <SeoHead title="Select Accounts - Uri Creative" />
        <Box sx={{ background: themeColors.background, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
          <Box sx={{ bgcolor: '#fff', borderRadius: '20px', p: { xs: 3, md: 5 }, boxShadow: '1px 1px 6px 3px #00000011', maxWidth: 520, width: '100%' }}>
            <Typography sx={{ fontSize: { xs: 20, md: 26 }, fontWeight: 700, color: '#0d0e0f', mb: 1 }}>Select accounts to connect</Typography>
            <Typography sx={{ fontSize: 14, color: '#6C727F', mb: 3, textTransform: 'capitalize' }}>Choose which {networkName} accounts you want to manage through Uri Creative.</Typography>

            {availablePages.length === 0 ? (
              <Box sx={{ py: 3, textAlign: 'center' }}>
                <Typography sx={{ fontSize: 14, color: '#6C727F' }}>No accounts were found. Make sure you have admin access to at least one page.</Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                {availablePages.map((page) => {
                  const isSelected = selectedPageIds.includes(page.id);
                  return (
                    <Box
                      key={page.id}
                      onClick={() => handlePageToggle(page.id)}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 2,
                        borderRadius: 2,
                        border: '2px solid',
                        borderColor: isSelected ? themeColors.primary : '#E5E7EB',
                        bgcolor: isSelected ? `${themeColors.primary}0D` : '#fff',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': { borderColor: themeColors.primary },
                      }}
                    >
                      {page.profilePictureUrl ? (
                        <img src={page.profilePictureUrl} alt={page.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: '#E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography sx={{ fontSize: 16, fontWeight: 700, color: '#6C727F' }}>{page.name.charAt(0)}</Typography>
                        </Box>
                      )}
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#0d0e0f' }}>{page.name}</Typography>
                        {page.username && <Typography sx={{ fontSize: 12, color: '#6C727F' }}>@{page.username}</Typography>}
                        {page.type && <Typography sx={{ fontSize: 11, color: '#9CA3AF', textTransform: 'capitalize' }}>{page.type}</Typography>}
                      </Box>
                      <Checkbox
                        checked={isSelected}
                        onChange={() => handlePageToggle(page.id)}
                        sx={{ color: '#E5E7EB', '&.Mui-checked': { color: themeColors.primary }, p: 0 }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Box>
                  );
                })}
              </Box>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <CustomButton mode="primary" onClick={handleFinalize} disabled={selectedPageIds.length === 0} style={{ width: '100%', padding: '12px', opacity: selectedPageIds.length > 0 ? 1 : 0.5 }}>
                Connect {selectedPageIds.length > 0 ? `${selectedPageIds.length} account${selectedPageIds.length !== 1 ? 's' : ''}` : 'accounts'}
              </CustomButton>
              <Typography onClick={handleSkip} sx={{ fontSize: 13, textAlign: 'center', color: themeColors.primary, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                Skip for now
              </Typography>
            </Box>
          </Box>
        </Box>
      </>
    );
  }

  // ── Default: platform selection ───────────────────────────────────────────
  return (
    <>
      <SeoHead title="Connect Your Accounts - Uri Creative" />

      <Box sx={{ background: themeColors.background, minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', p: { xs: 2, md: 3 } }}>
        <Box sx={{ maxWidth: '560px', width: '100%', bgcolor: '#fff', borderRadius: '20px', p: { xs: 3, md: 5 }, boxShadow: '1px 1px 6px 3px #00000011' }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography sx={{ fontSize: { xs: 22, md: 28 }, fontWeight: 700, color: '#0d0e0f', mb: 1 }}>Connect a social account</Typography>
            <Typography sx={{ fontSize: 14, color: '#6C727F' }}>Link an account to start publishing content. You can add more later.</Typography>
          </Box>

          {/* Live platform cards */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
            {LIVE_PLATFORMS.map((platform) => {
              const IconComponent = platform.icon;
              const isSelected = selectedPlatformId === platform.id;

              return (
                <Box
                  key={platform.id}
                  onClick={() => setSelectedPlatformId(platform.id)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 2.5,
                    borderRadius: 3,
                    border: '2px solid',
                    borderColor: isSelected ? themeColors.primary : '#E5E7EB',
                    bgcolor: isSelected ? `${themeColors.primary}0D` : '#fff',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    '&:hover': { borderColor: themeColors.primary, bgcolor: `${themeColors.primary}0D` },
                  }}
                >
                  <Box sx={{ width: 48, height: 48, borderRadius: 2, bgcolor: platform.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <IconComponent size={26} color={platform.color} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontSize: 15, fontWeight: 700, color: '#0d0e0f' }}>{platform.name}</Typography>
                    <Typography sx={{ fontSize: 13, color: '#6C727F' }}>{platform.description}</Typography>
                  </Box>
                  {isSelected && <FaCheckCircle size={20} color={themeColors.primary} />}
                </Box>
              );
            })}
          </Box>

          {/* Coming soon platforms */}
          <Box sx={{ mb: 4 }}>
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#9CA3AF', mb: 1.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>Coming soon</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {COMING_SOON_PLATFORMS.map((name) => (
                <Box key={name} sx={{ px: 2, py: 0.75, borderRadius: 10, border: '1px solid #E5E7EB', bgcolor: '#F9FAFB' }}>
                  <Typography sx={{ fontSize: 13, color: '#9CA3AF' }}>{name}</Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Actions */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <CustomButton mode="primary" onClick={handleConnect} disabled={!selectedPlatformId} style={{ width: '100%', padding: '13px', opacity: selectedPlatformId ? 1 : 0.5 }}>
              Connect {selectedPlatformId ? LIVE_PLATFORMS.find((p) => p.id === selectedPlatformId)?.name : ''}
            </CustomButton>
            <Typography onClick={handleSkip} sx={{ fontSize: 13, textAlign: 'center', color: themeColors.primary, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
              Skip for now
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ConnectAccountsPage;
