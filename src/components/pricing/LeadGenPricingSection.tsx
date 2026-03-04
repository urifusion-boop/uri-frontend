import { LightThemeColors } from '@/configs/colors.config';
import { NumberHelper } from '@/helpers/NumberHelper';
import { alpha, Box, Card, CardContent, Chip, Divider, Grid, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { FaCheck, FaCoins } from 'react-icons/fa';

// PAYG Wallet Costs
const WALLET_COSTS = {
  scan: 750,
  lead: 225,
  emailEnrichment: 75,
  phoneEnrichment: 750,
};

// Credit Costs (1 credit = ₦140)
const CREDIT_COSTS = {
  emailEnrichment: 1,
  verifiedSalesSignal: 1,
  salesSignalScan: 7,
  phoneEnrichment: 7,
  lazarusScan: 10,
};

// Credit Bundle Pricing (matches backend CreditBundle.ts)
const CREDIT_BUNDLES = [
  { name: 'Small', credits: 35, price: 5000, pricePerCredit: 140 },
  { name: 'Medium', credits: 71, price: 10000, pricePerCredit: 140 },
  { name: 'Large', credits: 142, price: 20000, pricePerCredit: 140 },
  { name: 'Enterprise', credits: 200, price: 30000, pricePerCredit: 150 },
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
          Credit Bundles
        </Typography>
        <Typography variant="body1" sx={{ color: '#6B6B6B', maxWidth: 600, mx: 'auto' }}>
          Buy credit bundles for the best value on lead generation. Credits never expire and can be used for all lead actions.
        </Typography>
      </Box>

      {/* Credit Bundles Info Card */}
      <Grid container spacing={4} sx={{ mb: 5, pt: 2 }}>
        <Grid item xs={12} md={12}>
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
                      Best value for lead generation
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
