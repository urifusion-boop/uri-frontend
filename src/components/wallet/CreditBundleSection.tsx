import { LightThemeColors } from '@/configs/colors.config';
import { NumberHelper } from '@/helpers/NumberHelper';
import { useCreditBundle } from '@/hooks/credits/useCreditBundle';
import { CreditBundleTierEnum } from '@/models/dtos/CreditBundleDto';
import { Alert, Box, Button, Card, CardContent, Chip, CircularProgress, Divider, Grid, InputAdornment, Skeleton, Stack, TextField, Typography, alpha } from '@mui/material';
import { useState } from 'react';
import { FaCoins } from 'react-icons/fa';
import { CreditBundleCard } from './CreditBundleCard';

const CREDIT_RATE = 140; // ₦140 per credit
const MIN_AMOUNT = 5000;

export const CreditBundleSection = () => {
  const { bundles, isLoadingBundles, isBundlesError, creditsAvailable, totalCredits, isLoadingBalance, purchaseBundle, isPurchasing } = useCreditBundle();
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isProcessingCustom, setIsProcessingCustom] = useState(false);

  const calculateCredits = (amount: number): number => {
    return Math.floor(amount / CREDIT_RATE);
  };

  const customCredits = customAmount && !isNaN(parseFloat(customAmount)) ? calculateCredits(parseFloat(customAmount)) : 0;
  const isValidCustomAmount = customAmount && !isNaN(parseFloat(customAmount)) && parseFloat(customAmount) >= MIN_AMOUNT;
  const isInvalidAmount = customAmount && !isNaN(parseFloat(customAmount)) && parseFloat(customAmount) > 0 && parseFloat(customAmount) < MIN_AMOUNT;

  const handleCustomPurchase = async () => {
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

  const clearCustomAmount = () => {
    setCustomAmount('');
  };

  return (
    <Box mt={4}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'stretch', sm: 'center' }} gap={2} mb={3}>
        <Box>
          <Typography variant="h5" fontWeight={800} sx={{ color: '#141414' }}>
            Credit Bundles
          </Typography>
          <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
            Purchase pre-configured credit bundles with better value
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
          Array.from({ length: 5 }).map((_, idx) => (
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
          <>
            {bundles.map((bundle) => (
              <Grid item xs={12} sm={6} md={3} key={bundle.tier}>
                <CreditBundleCard bundle={bundle} onPurchase={purchaseBundle} isPurchasing={isPurchasing(bundle.tier)} isPopular={bundle.tier === CreditBundleTierEnum.MEDIUM} />
              </Grid>
            ))}

            {/* Custom Credit Card */}
            <Grid item xs={12} sm={6} md={3}>
              <Card
                sx={{
                  borderRadius: 4,
                  overflow: 'hidden',
                  transition: 'all 200ms ease',
                  border: `2px solid ${alpha(LightThemeColors.uriColor, 0.3)}`,
                  position: 'relative',
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
                      <Typography variant="caption" sx={{ color: '#8A8A8A', display: 'block', mt: 0.75, textAlign: 'center' }}>
                        ~₦{CREDIT_RATE} per credit
                      </Typography>
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
