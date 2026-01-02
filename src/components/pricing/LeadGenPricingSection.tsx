import { LightThemeColors } from '@/configs/colors.config';
import { NumberHelper } from '@/helpers/NumberHelper';
import { alpha, Box, Card, CardContent, Chip, Divider, Grid, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { FaCheck, FaCoins, FaWallet } from 'react-icons/fa';

// PAYG Wallet Costs
const WALLET_COSTS = {
  scan: 750,
  lead: 225,
  emailEnrichment: 75,
  phoneEnrichment: 750,
};

// Credit Costs
const CREDIT_COSTS = {
  scan: 1,
  lead: 1,
  emailEnrichment: 1,
  phoneEnrichment: 10,
};

// Credit Bundle Pricing
const CREDIT_BUNDLES = [
  { name: 'Small', credits: 10, price: 7500, pricePerCredit: 750 },
  { name: 'Medium', credits: 30, price: 20500, pricePerCredit: 683 },
  { name: 'Large', credits: 80, price: 55000, pricePerCredit: 687.5 },
  { name: 'Enterprise', credits: 150, price: 112500, pricePerCredit: 750 },
];

export const LeadGenPricingSection = () => {
  return (
    <Box sx={{ py: 6 }}>
      {/* Section Header */}
      <Box textAlign="center" mb={5}>
        <Chip
          label="LEAD GENERATION"
          sx={{
            backgroundColor: alpha(LightThemeColors.uriColor, 0.1),
            color: LightThemeColors.uriColor,
            fontWeight: 700,
            mb: 2,
          }}
        />
        <Typography variant="h4" fontWeight={800} sx={{ color: '#141414', mb: 1 }}>
          Pay As You Go or Buy Credits
        </Typography>
        <Typography variant="body1" sx={{ color: '#6B6B6B', maxWidth: 600, mx: 'auto' }}>
          Choose how you want to pay for lead generation. Use your wallet for instant access or buy credit bundles for bulk savings.
        </Typography>
      </Box>

      {/* Two Payment Options Cards */}
      <Grid container spacing={4} sx={{ mb: 5, pt: 2 }}>
        {/* PAYG Wallet Option */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: 4,
              height: '100%',
              border: '2px solid #e0e0e0',
              transition: 'all 200ms ease',
              '&:hover': {
                borderColor: '#3498db',
                boxShadow: '0 8px 32px rgba(52, 152, 219, 0.15)',
              },
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Stack direction="row" alignItems="center" gap={2} mb={3}>
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: 3,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'linear-gradient(135deg, #3498db 0%, #2980b9 100%)',
                    color: 'white',
                  }}
                >
                  <FaWallet size={24} />
                </Box>
                <Box>
                  <Typography variant="h5" fontWeight={800}>
                    Wallet (PAYG)
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                    Pay per action, fund as needed
                  </Typography>
                </Box>
              </Stack>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" fontWeight={700} sx={{ color: '#141414', mb: 1 }}>
                  How it works:
                </Typography>
                <Stack spacing={1}>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <FaCheck size={12} color="#27ae60" />
                    <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                      Fund wallet with minimum ₦5,000
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <FaCheck size={12} color="#27ae60" />
                    <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                      Pay exact amount per action
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <FaCheck size={12} color="#27ae60" />
                    <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                      No expiry on wallet balance
                    </Typography>
                  </Stack>
                </Stack>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" fontWeight={700} sx={{ color: '#141414', mb: 2 }}>
                Action Costs:
              </Typography>
              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                    Scan (per result)
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    ₦{NumberHelper.formatNumber(WALLET_COSTS.scan)}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                    Lead save
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    ₦{NumberHelper.formatNumber(WALLET_COSTS.lead)}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                    Email enrichment
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    ₦{NumberHelper.formatNumber(WALLET_COSTS.emailEnrichment)}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                    Phone enrichment
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    ₦{NumberHelper.formatNumber(WALLET_COSTS.phoneEnrichment)}
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Credits Option */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: 4,
              height: '100%',
              border: `2px solid ${LightThemeColors.uriColor}`,
              position: 'relative',
              overflow: 'visible',
              transition: 'all 200ms ease',
              '&:hover': {
                boxShadow: `0 8px 32px ${alpha(LightThemeColors.uriColor, 0.2)}`,
              },
            }}
          >
            <Chip
              label="BEST VALUE"
              sx={{
                position: 'absolute',
                top: -12,
                right: 20,
                backgroundColor: LightThemeColors.uriColor,
                color: 'white',
                fontWeight: 800,
              }}
            />
            <CardContent sx={{ p: 4 }}>
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

              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" fontWeight={700} sx={{ color: '#141414', mb: 1 }}>
                  Benefits:
                </Typography>
                <Stack spacing={1}>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <FaCheck size={12} color="#27ae60" />
                    <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                      Up to 10% savings vs PAYG
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <FaCheck size={12} color="#27ae60" />
                    <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                      Predictable budgeting
                    </Typography>
                  </Stack>
                  <Stack direction="row" alignItems="center" gap={1}>
                    <FaCheck size={12} color="#27ae60" />
                    <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                      Credits never expire
                    </Typography>
                  </Stack>
                </Stack>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="body2" fontWeight={700} sx={{ color: '#141414', mb: 2 }}>
                Credit Usage:
              </Typography>
              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                    Scan (per result)
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {CREDIT_COSTS.scan} credit
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                    Lead save
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {CREDIT_COSTS.lead} credit
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                    Email enrichment
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {CREDIT_COSTS.emailEnrichment} credit
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                    Phone enrichment
                  </Typography>
                  <Typography variant="body2" fontWeight={700}>
                    {CREDIT_COSTS.phoneEnrichment} credits
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Credit Bundles Table */}
      <Box>
        <Typography variant="h6" fontWeight={800} sx={{ color: '#141414', mb: 2, textAlign: 'center' }}>
          Available Credit Bundles
        </Typography>
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: alpha(LightThemeColors.uriColor, 0.05) }}>
                <TableCell sx={{ fontWeight: 700 }}>Bundle</TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>
                  Credits
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>
                  Price
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>
                  Per Credit
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: 700 }}>
                  Savings
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {CREDIT_BUNDLES.map((bundle) => {
                const savings = Math.round(((WALLET_COSTS.scan - bundle.pricePerCredit) / WALLET_COSTS.scan) * 100);
                return (
                  <TableRow
                    key={bundle.name}
                    sx={{
                      '&:hover': {
                        backgroundColor: alpha(LightThemeColors.uriColor, 0.02),
                      },
                    }}
                  >
                    <TableCell>
                      <Typography fontWeight={700}>{bundle.name}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={`${bundle.credits} credits`}
                        size="small"
                        sx={{
                          backgroundColor: alpha('#9b59b6', 0.1),
                          color: '#9b59b6',
                          fontWeight: 700,
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Typography fontWeight={700}>₦{NumberHelper.formatNumber(bundle.price)}</Typography>
                    </TableCell>
                    <TableCell align="center">
                      <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                        ₦{NumberHelper.formatNumber(Math.round(bundle.pricePerCredit))}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      {savings > 0 ? (
                        <Chip
                          label={`${savings}% off`}
                          size="small"
                          sx={{
                            backgroundColor: alpha('#27ae60', 0.1),
                            color: '#27ae60',
                            fontWeight: 700,
                          }}
                        />
                      ) : (
                        <Typography variant="body2" sx={{ color: '#6B6B6B' }}>
                          -
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default LeadGenPricingSection;
