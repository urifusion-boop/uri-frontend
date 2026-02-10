import { NumberHelper } from '@/helpers/NumberHelper';
import { useCreditBundle } from '@/hooks/credits/useCreditBundle';
import { CreditBundleTierEnum } from '@/models/dtos/CreditBundleDto';
import { Alert, Box, Card, CardContent, Chip, Divider, Grid, Skeleton, Stack, Typography, alpha } from '@mui/material';
import { FaCoins } from 'react-icons/fa';
import { CreditBundleCard } from './CreditBundleCard';

export const CreditBundleSection = () => {
  const { bundles, isLoadingBundles, isBundlesError, creditsAvailable, totalCredits, isLoadingBalance, purchaseBundle, isPurchasing } = useCreditBundle();

  return (
    <Box mt={4}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} gap={2} mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={800} sx={{ color: '#141414' }}>
            Credit Bundles
          </Typography>
          <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
            Purchase credits for lead enrichment. 1 credit = 1 email reveal, 7 credits = 1 phone reveal.
          </Typography>
        </Box>
      </Stack>

      {/* Credit Balance Card */}
      <Card
        sx={{
          borderRadius: 4,
          mb: 3,
          background: `linear-gradient(135deg, ${alpha('#9b59b6', 0.9)} 0%, ${alpha('#8e44ad', 0.95)} 100%)`,
          color: 'white',
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" gap={2}>
            <Stack direction="row" alignItems="center" gap={2}>
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: 999,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                }}
              >
                <FaCoins size={22} />
              </Box>
              <Box>
                <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 600 }}>
                  Your Credit Balance
                </Typography>
                {isLoadingBalance ? (
                  <Skeleton variant="text" width={100} height={40} sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                ) : (
                  <Typography variant="h4" fontWeight={900}>
                    {NumberHelper.formatNumber(creditsAvailable)} credits
                  </Typography>
                )}
              </Box>
            </Stack>
            <Stack direction="row" gap={1}>
              <Chip
                label={`${NumberHelper.formatNumber(totalCredits - creditsAvailable)} used`}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontWeight: 700,
                }}
              />
              <Chip
                label={`${NumberHelper.formatNumber(totalCredits)} total`}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.3)',
                  color: 'white',
                  fontWeight: 700,
                }}
              />
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {isBundlesError && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>
          Unable to load credit bundles. Please refresh the page.
        </Alert>
      )}

      {/* Bundle Cards */}
      <Grid container spacing={3}>
        {isLoadingBundles ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Card sx={{ borderRadius: 4 }}>
                <CardContent sx={{ p: 3 }}>
                  <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2 }} />
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
          bundles.map((bundle) => (
            <Grid item xs={12} sm={6} md={3} key={bundle.tier}>
              <CreditBundleCard bundle={bundle} onPurchase={purchaseBundle} isPurchasing={isPurchasing} isPopular={bundle.tier === CreditBundleTierEnum.MEDIUM} />
            </Grid>
          ))
        )}
      </Grid>

      {/* Credit Usage Info */}
      <Card sx={{ borderRadius: 4, mt: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={800} sx={{ color: '#141414', mb: 2 }}>
            Credit Usage Guide
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Stack direction="row" alignItems="center" gap={2}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: alpha('#3498db', 0.1),
                    color: '#3498db',
                    fontWeight: 900,
                  }}
                >
                  1
                </Box>
                <Box>
                  <Typography fontWeight={700} sx={{ color: '#141414' }}>
                    Email Reveal
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                    1 credit per email address
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack direction="row" alignItems="center" gap={2}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: alpha('#e74c3c', 0.1),
                    color: '#e74c3c',
                    fontWeight: 900,
                  }}
                >
                  7
                </Box>
                <Box>
                  <Typography fontWeight={700} sx={{ color: '#141414' }}>
                    Phone Reveal
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                    7 credits per phone number
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack direction="row" alignItems="center" gap={2}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: alpha('#9b59b6', 0.1),
                    color: '#9b59b6',
                    fontWeight: 900,
                  }}
                >
                  7
                </Box>
                <Box>
                  <Typography fontWeight={700} sx={{ color: '#141414' }}>
                    Sales Signal Scan
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                    7 credits per scan
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack direction="row" alignItems="center" gap={2}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: alpha('#2ecc71', 0.1),
                    color: '#2ecc71',
                    fontWeight: 900,
                  }}
                >
                  1
                </Box>
                <Box>
                  <Typography fontWeight={700} sx={{ color: '#141414' }}>
                    Qualified Lead
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                    1 credit per verified sales signal
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack direction="row" alignItems="center" gap={2}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: alpha('#e67e22', 0.1),
                    color: '#e67e22',
                    fontWeight: 900,
                  }}
                >
                  10
                </Box>
                <Box>
                  <Typography fontWeight={700} sx={{ color: '#141414' }}>
                    Lazarus Scan
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                    10 credits per CRM contact scan
                  </Typography>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};
