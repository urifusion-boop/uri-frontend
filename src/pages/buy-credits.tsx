import DashboardLayout from '@/components/atoms/DashboardLayout';
import SeoHead from '@/components/atoms/SeoHead';
import { CreditBundleCard } from '@/components/wallet/CreditBundleCard';
import { LightThemeColors } from '@/configs/colors.config';
import { useCreditBundle } from '@/hooks/credits/useCreditBundle';
import { CreditBundleTierEnum } from '@/models/dtos/CreditBundleDto';
import { useAuth } from '@/providers/AuthProvider';
import { Alert, Box, Button, Card, CardContent, Chip, CircularProgress, Container, Divider, Grid, InputAdornment, Skeleton, Stack, TextField, Typography, alpha } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FaCheck, FaCoins } from 'react-icons/fa';

const CREDIT_RATE = 140; // ₦140 per credit
const MIN_AMOUNT = 5000;

const CREDIT_COSTS = {
  emailEnrichment: 1,
  verifiedSalesSignal: 1,
  salesSignalScan: 7,
  phoneEnrichment: 7,
  lazarusScan: 10,
};

export default function BuyCreditsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { bundles, isLoadingBundles, isBundlesError, purchaseBundle, isPurchasing } = useCreditBundle();
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isProcessingCustom, setIsProcessingCustom] = useState(false);

  const calculateCredits = (amount: number): number => {
    return Math.floor(amount / CREDIT_RATE);
  };

  const customCredits = customAmount && !isNaN(parseFloat(customAmount)) ? calculateCredits(parseFloat(customAmount)) : 0;
  const isValidCustomAmount = customAmount && !isNaN(parseFloat(customAmount)) && parseFloat(customAmount) >= MIN_AMOUNT;
  const isInvalidAmount = customAmount && !isNaN(parseFloat(customAmount)) && parseFloat(customAmount) > 0 && parseFloat(customAmount) < MIN_AMOUNT;

  const handlePurchase = async (bundleTier?: CreditBundleTierEnum) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (bundleTier) {
      await purchaseBundle(bundleTier);
    }
  };

  const handleCustomPurchase = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    if (!isValidCustomAmount) return;
    setIsProcessingCustom(true);
    try {
      await purchaseBundle(undefined, parseFloat(customAmount), customCredits);
      setCustomAmount('');
    } catch (error) {
      console.error('Custom purchase failed:', error);
    } finally {
      setIsProcessingCustom(false);
    }
  };

  return (
    <>
      <SeoHead title="Buy Credits" />

      <DashboardLayout>
        <Box sx={{ minHeight: '100vh', backgroundColor: '#fafafa', py: { xs: 4, md: 8 } }}>
          <Container maxWidth="xl" sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
            {/* Hero Section */}
            <Box textAlign="center" mb={{ xs: 4, md: 8 }} mt={{ xs: 2, md: 4 }}>
              <Chip
                label="LEAD GENERATION"
                sx={{
                  backgroundColor: alpha(LightThemeColors.uriColor, 0.1),
                  color: LightThemeColors.uriColor,
                  fontWeight: 700,
                  mb: 2,
                  fontSize: '0.85rem',
                  px: 2,
                }}
              />
              <Typography variant="h3" fontWeight={900} sx={{ color: '#141414', mb: 3, fontSize: { xs: '2rem', md: '3rem' } }}>
                Power Your Lead Generation
              </Typography>
              <Typography variant="h6" sx={{ color: '#6B6B6B', maxWidth: 800, mx: 'auto', mb: 4, fontSize: { xs: '1rem', md: '1.25rem' }, lineHeight: 1.6 }}>
                Buy credit bundles for the best value on lead generation. Credits are valid for 30 days and roll over when you top up.
              </Typography>
              {!isAuthenticated && (
                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => router.push('/login')}
                  sx={{
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    fontWeight: 700,
                    borderColor: LightThemeColors.uriColor,
                    color: LightThemeColors.uriColor,
                    '&:hover': {
                      borderColor: '#B8186A',
                      backgroundColor: alpha(LightThemeColors.uriColor, 0.05),
                    },
                  }}
                >
                  Sign In to Get Started
                </Button>
              )}
            </Box>

            {/* Credit Benefits Card */}
            <Card
              sx={{
                borderRadius: 5,
                mb: { xs: 4, md: 8 },
                border: `2px solid ${LightThemeColors.uriColor}`,
                position: 'relative',
                overflow: 'visible',
                boxShadow: '0 4px 20px rgba(205, 27, 120, 0.08)',
              }}
            >
              <Chip
                label="BEST VALUE"
                sx={{
                  position: 'absolute',
                  top: -12,
                  right: { xs: 16, md: 24 },
                  backgroundColor: LightThemeColors.uriColor,
                  color: 'white',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                }}
              />
              <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                <Stack direction="row" alignItems="center" gap={2} mb={3}>
                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: `linear-gradient(135deg, ${LightThemeColors.uriColor} 0%, #B8186A 100%)`,
                      color: 'white',
                    }}
                  >
                    <FaCoins size={24} />
                  </Box>
                  <Box>
                    <Typography variant="h5" fontWeight={800}>
                      Credit Bundles
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                      Buy in bulk, save more
                    </Typography>
                  </Box>
                </Stack>

                <Grid container spacing={{ xs: 3, md: 5 }}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" fontWeight={700} sx={{ color: '#141414', mb: 2, fontSize: '0.95rem' }}>
                      Benefits:
                    </Typography>
                    <Stack spacing={1}>
                      <Stack direction="row" alignItems="center" gap={1}>
                        <FaCheck size={12} color="#27ae60" />
                        <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                          Best value for lead generation
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" gap={1}>
                        <FaCheck size={12} color="#27ae60" />
                        <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                          Credits valid for 30 days
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" gap={1}>
                        <FaCheck size={12} color="#27ae60" />
                        <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                          Unused credits roll over when you top up
                        </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" gap={1}>
                        <FaCheck size={12} color="#27ae60" />
                        <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                          Get notified before expiry
                        </Typography>
                      </Stack>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body2" fontWeight={700} sx={{ color: '#141414', mb: 2, fontSize: '0.95rem' }}>
                      Credit Usage:
                    </Typography>
                    <Stack spacing={2}>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                          Email reveal
                        </Typography>
                        <Typography variant="body2" fontWeight={700}>
                          {CREDIT_COSTS.emailEnrichment} credit
                        </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                          Verified sales signal
                        </Typography>
                        <Typography variant="body2" fontWeight={700}>
                          {CREDIT_COSTS.verifiedSalesSignal} credit
                        </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                          Phone reveal
                        </Typography>
                        <Typography variant="body2" fontWeight={700}>
                          {CREDIT_COSTS.phoneEnrichment} credits
                        </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                          Sales signal scan
                        </Typography>
                        <Typography variant="body2" fontWeight={700}>
                          {CREDIT_COSTS.salesSignalScan} credits
                        </Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                          Lazarus scan
                        </Typography>
                        <Typography variant="body2" fontWeight={700}>
                          {CREDIT_COSTS.lazarusScan} credits
                        </Typography>
                      </Stack>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Bundle Cards Section */}
            <Box mb={{ xs: 4, md: 8 }}>
              <Typography variant="h5" fontWeight={800} sx={{ color: '#141414', mb: { xs: 3, md: 5 }, textAlign: 'center', fontSize: { xs: '1.5rem', md: '2rem' } }}>
                Choose Your Bundle
              </Typography>

              {isBundlesError && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
                  Unable to load credit bundles. Please refresh the page.
                </Alert>
              )}

              <Grid container spacing={{ xs: 2, md: 4 }} justifyContent="center">
                {isLoadingBundles ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <Grid item xs={12} sm={6} lg={2.4} key={idx}>
                      <Card sx={{ borderRadius: 4 }}>
                        <CardContent sx={{ p: 3 }}>
                          <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 2 }} />
                        </CardContent>
                      </Card>
                    </Grid>
                  ))
                ) : bundles.length === 0 ? (
                  <Grid item xs={12}>
                    <Card sx={{ borderRadius: 4, textAlign: 'center', py: 4 }}>
                      <CardContent>
                        <Typography variant="h6" fontWeight={700} sx={{ color: '#141414', mb: 1 }}>
                          No bundles available
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                          Credit bundles are temporarily unavailable. Please try again later.
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ) : (
                  <>
                    {bundles.map((bundle) => (
                      <Grid item xs={12} sm={6} lg={2.4} key={bundle.tier}>
                        <CreditBundleCard bundle={bundle} onPurchase={handlePurchase} isPurchasing={isPurchasing(bundle.tier)} isPopular={bundle.tier === CreditBundleTierEnum.MEDIUM} />
                      </Grid>
                    ))}

                    {/* Custom Credit Card */}
                    <Grid item xs={12} sm={6} lg={2.4}>
                      <Card
                        sx={{
                          borderRadius: 4,
                          overflow: 'hidden',
                          transition: 'all 200ms ease',
                          border: `2px solid ${alpha(LightThemeColors.uriColor, 0.3)}`,
                          position: 'relative',
                          height: '100%',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
                          },
                        }}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Stack spacing={2}>
                            <Stack direction="row" alignItems="center" spacing={1.5}>
                              <Box
                                sx={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: 2,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  backgroundColor: alpha(LightThemeColors.uriColor, 0.12),
                                  color: LightThemeColors.uriColor,
                                }}
                              >
                                <FaCoins size={18} />
                              </Box>
                              <Box>
                                <Typography variant="h6" fontWeight={800} sx={{ color: '#141414' }}>
                                  Custom Plan
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#6B6B6B' }}>
                                  Enter your amount
                                </Typography>
                              </Box>
                            </Stack>

                            <Box textAlign="center" py={2}>
                              <Typography variant="h3" fontWeight={900} sx={{ color: LightThemeColors.uriColor }}>
                                {customCredits > 0 ? customCredits.toLocaleString() : '0'}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#6B6B6B', fontWeight: 600 }}>
                                credits
                              </Typography>
                            </Box>

                            <Box
                              sx={{
                                p: 2,
                                borderRadius: 3,
                                backgroundColor: alpha(LightThemeColors.uriColor, 0.06),
                                border: `1px solid ${alpha(LightThemeColors.uriColor, 0.15)}`,
                              }}
                            >
                              <TextField
                                fullWidth
                                size="small"
                                type="number"
                                value={customAmount}
                                onChange={(e) => setCustomAmount(e.target.value)}
                                placeholder="Enter amount"
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      <Typography fontWeight={800} sx={{ color: '#141414', fontSize: '0.9rem' }}>
                                        ₦
                                      </Typography>
                                    </InputAdornment>
                                  ),
                                }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    fontWeight: 700,
                                    backgroundColor: 'white',
                                    '& input': { fontSize: '0.95rem', textAlign: 'center' },
                                    '& fieldset': { borderColor: alpha('#000', 0.1) },
                                    '&:hover fieldset': { borderColor: alpha(LightThemeColors.uriColor, 0.4) },
                                    '&.Mui-focused fieldset': { borderColor: LightThemeColors.uriColor },
                                  },
                                }}
                              />
                              {isInvalidAmount && (
                                <Typography variant="caption" sx={{ color: '#d32f2f', display: 'block', mt: 0.5, textAlign: 'center' }}>
                                  Min ₦{MIN_AMOUNT.toLocaleString()}
                                </Typography>
                              )}
                            </Box>

                            <Button
                              variant="contained"
                              fullWidth
                              onClick={handleCustomPurchase}
                              disabled={!isValidCustomAmount || isProcessingCustom}
                              sx={{
                                borderRadius: 3,
                                py: 1.5,
                                fontWeight: 800,
                                backgroundColor: LightThemeColors.uriColor,
                                '&:hover': {
                                  backgroundColor: '#B8186A',
                                },
                                '&:disabled': {
                                  backgroundColor: alpha('#000', 0.1),
                                  color: '#BDBDBD',
                                },
                              }}
                            >
                              {isProcessingCustom ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Buy Now'}
                            </Button>
                          </Stack>
                        </CardContent>
                      </Card>
                    </Grid>
                  </>
                )}
              </Grid>
            </Box>

            {/* FAQ Section */}
            <Card sx={{ borderRadius: 5, boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
              <CardContent sx={{ p: { xs: 3, md: 5 } }}>
                <Typography variant="h5" fontWeight={800} sx={{ color: '#141414', mb: 4, textAlign: 'center', fontSize: { xs: '1.5rem', md: '2rem' } }}>
                  Frequently Asked Questions
                </Typography>
                <Divider sx={{ mb: 4 }} />
                <Grid container spacing={{ xs: 3, md: 4 }}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1" fontWeight={700} sx={{ color: '#141414', mb: 1 }}>
                      Do credits expire?
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                      Yes, credits are valid for 30 days from purchase. However, unused credits automatically roll over when you purchase a new bundle, extending their validity.
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1" fontWeight={700} sx={{ color: '#141414', mb: 1 }}>
                      How does the rollover work?
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                      When you top up with a new bundle, any unused credits from previous purchases are added to your new balance and get a fresh 30-day validity period.
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1" fontWeight={700} sx={{ color: '#141414', mb: 1 }}>
                      Will I be notified before expiry?
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                      Yes, we'll send you email notifications 7 days and 3 days before your credits expire, giving you time to use them or top up to roll them over.
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography variant="body1" fontWeight={700} sx={{ color: '#141414', mb: 1 }}>
                      What can I use credits for?
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                      Credits can be used for email reveals, phone reveals, sales signal scans, verified lead generation, and Lazarus CRM contact scans.
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Container>
        </Box>
      </DashboardLayout>
    </>
  );
}
