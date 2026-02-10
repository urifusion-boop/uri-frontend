import { LightThemeColors } from '@/configs/colors.config';
import { NumberHelper } from '@/helpers/NumberHelper';
import { useCreditBundle } from '@/hooks/credits/useCreditBundle';
import { CreditBundleTierEnum } from '@/models/dtos/CreditBundleDto';
import { Alert, Box, Button, Card, CardContent, Chip, CircularProgress, Divider, Grid, InputAdornment, Skeleton, Stack, TextField, Typography, alpha } from '@mui/material';
import { useState } from 'react';
import { FaCoins, FaTimes } from 'react-icons/fa';
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
    // Custom purchase logic would go here
    // For now, using the smallest bundle tier as placeholder
    await purchaseBundle(CreditBundleTierEnum.SMALL);
    setIsProcessingCustom(false);
    setCustomAmount('');
  };

  const clearCustomAmount = () => {
    setCustomAmount('');
  };

  return (
    <Box mt={4}>
      {/* Custom Credit Plan */}
      <Box mb={4}>
        <Typography variant="h5" fontWeight={800} sx={{ color: '#141414', mb: 1 }}>
          Custom Credit Plan
        </Typography>
        <Typography variant="body2" sx={{ color: '#6B6B6B', mb: 3 }}>
          Enter any amount to see equivalent credits (₦{CREDIT_RATE.toLocaleString()} per credit, min ₦{MIN_AMOUNT.toLocaleString()})
        </Typography>

        <Card
          sx={{
            borderRadius: 4,
            border: `2px solid ${alpha(LightThemeColors.uriColor, 0.2)}`,
            background: `linear-gradient(135deg, ${alpha(LightThemeColors.uriColor, 0.03)} 0%, ${alpha(LightThemeColors.uriColor, 0.01)} 100%)`,
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Enter Amount"
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="5000"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Typography fontWeight={700} sx={{ color: '#141414' }}>
                          ₦
                        </Typography>
                      </InputAdornment>
                    ),
                    endAdornment: customAmount && (
                      <InputAdornment position="end">
                        <Button
                          size="small"
                          onClick={clearCustomAmount}
                          sx={{
                            minWidth: 'auto',
                            p: 0.5,
                            color: '#6B6B6B',
                            '&:hover': {
                              color: LightThemeColors.uriColor,
                              background: 'transparent',
                            },
                          }}
                        >
                          <FaTimes size={16} />
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      fontWeight: 700,
                      '& input': {
                        fontSize: '1.1rem',
                      },
                    },
                  }}
                  helperText={isInvalidAmount ? `Minimum amount is ₦${MIN_AMOUNT.toLocaleString()}` : ' '}
                  error={!!isInvalidAmount}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${alpha(LightThemeColors.uriColor, 0.12)} 0%, ${alpha(LightThemeColors.uriColor, 0.06)} 100%)`,
                    textAlign: 'center',
                    border: `1px solid ${alpha(LightThemeColors.uriColor, 0.2)}`,
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#6B6B6B', fontWeight: 700 }}>
                    Equivalent Credits
                  </Typography>
                  <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mt: 1 }}>
                    <FaCoins size={24} style={{ color: LightThemeColors.uriColor }} />
                    <Typography variant="h4" fontWeight={900} color={LightThemeColors.uriColor}>
                      {customCredits.toLocaleString()}
                    </Typography>
                  </Stack>
                  <Typography variant="caption" sx={{ color: '#6B6B6B', mt: 1, display: 'block' }}>
                    {customAmount && isValidCustomAmount ? `₦${parseFloat(customAmount).toLocaleString()} ÷ ${CREDIT_RATE}` : 'Enter amount above'}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} md={4}>
                <Stack direction="row" spacing={2}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={clearCustomAmount}
                    disabled={!customAmount || isProcessingCustom}
                    sx={{
                      py: 1.5,
                      borderRadius: 3,
                      fontWeight: 700,
                      borderWidth: 2,
                      borderColor: alpha('#000', 0.2),
                      color: '#141414',
                      '&:hover': {
                        borderWidth: 2,
                        borderColor: alpha('#000', 0.4),
                        background: alpha('#000', 0.02),
                      },
                      '&:disabled': {
                        borderWidth: 2,
                        borderColor: alpha('#000', 0.1),
                        color: '#BDBDBD',
                      },
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    fullWidth
                    variant="contained"
                    onClick={handleCustomPurchase}
                    disabled={!isValidCustomAmount || isProcessingCustom}
                    sx={{
                      py: 1.5,
                      borderRadius: 3,
                      fontWeight: 800,
                      background: `linear-gradient(135deg, ${LightThemeColors.uriColor} 0%, ${alpha(LightThemeColors.uriColor, 0.85)} 100%)`,
                      boxShadow: '0 8px 25px rgba(205, 27, 120, 0.2)',
                      '&:hover': {
                        background: `linear-gradient(135deg, ${alpha(LightThemeColors.uriColor, 0.92)} 0%, ${alpha(LightThemeColors.uriColor, 0.78)} 100%)`,
                        boxShadow: '0 10px 30px rgba(205, 27, 120, 0.25)',
                      },
                      '&:disabled': {
                        background: alpha('#000', 0.1),
                        color: '#BDBDBD',
                        boxShadow: 'none',
                      },
                    }}
                  >
                    {isProcessingCustom ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Buy Now'}
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>

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
              <CreditBundleCard bundle={bundle} onPurchase={purchaseBundle} isPurchasing={isPurchasing(bundle.tier)} isPopular={bundle.tier === CreditBundleTierEnum.MEDIUM} />
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
