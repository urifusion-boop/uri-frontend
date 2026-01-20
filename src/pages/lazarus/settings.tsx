import { LazarusService } from '@/api/LazarusService';
import DashboardLayout from '@/components/atoms/DashboardLayout';
import SeoHead from '@/components/atoms/SeoHead';
import { LightThemeColors } from '@/configs/colors.config';
import { useAuth } from '@/providers/AuthProvider';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  Alert,
  Box,
  Button,
  Card,
  Checkbox,
  Chip,
  CircularProgress,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaHistory, FaPlay } from 'react-icons/fa';
import { MdAutorenew } from 'react-icons/md';

interface BuyingSignal {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const BUYING_SIGNALS: BuyingSignal[] = [
  { id: 'funding', name: 'Funding', description: 'Company received investment or raised capital', icon: '💰' },
  { id: 'hiring', name: 'Hiring', description: 'Company is hiring for relevant roles', icon: '👥' },
  { id: 'pain', name: 'Pain Points', description: 'Expressing frustration with current solution', icon: '😤' },
  { id: 'switch', name: 'Switching Intent', description: 'Considering or evaluating alternatives', icon: '🔄' },
];

const LazarusSettingsPage = () => {
  const { userDetails } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [noResponseDays, setNoResponseDays] = useState(30);
  const [minContactAttempts, setMinContactAttempts] = useState(2);
  const [autoAddToLazarus, setAutoAddToLazarus] = useState(false);
  const [schedule, setSchedule] = useState('weekly');
  const [signalTypes, setSignalTypes] = useState<string[]>(['pain', 'switch', 'hiring', 'funding']);
  const [scanHistory, setScanHistory] = useState<any[]>([]);
  const [nextScanDate, setNextScanDate] = useState<string | null>(null);

  useEffect(() => {
    loadSettings();
  }, [userDetails?.userId]);

  const loadSettings = async () => {
    if (!userDetails?.userId) return;

    try {
      setLoading(true);
      const response = await LazarusService.getAutoDetectionRules(userDetails.userId);

      if (response.status && response.responseData) {
        const settings = response.responseData;
        setEnabled(settings.enabled || false);
        setNoResponseDays(settings.detection_rules?.no_response_days || 30);
        setMinContactAttempts(settings.detection_rules?.min_contact_attempts || 2);
        setAutoAddToLazarus(settings.detection_rules?.auto_add_to_lazarus || false);
        setSignalTypes(settings.detection_rules?.signal_types || ['pain', 'switch', 'hiring', 'funding']);
        setSchedule(settings.schedule || 'weekly');
        setNextScanDate(settings.next_scan_date);
      }

      // Load scan history
      const historyResponse = await LazarusService.getAutoDetectionHistory(userDetails.userId, 0, 10);
      if (historyResponse.status && historyResponse.responseData) {
        setScanHistory(historyResponse.responseData);
      }
    } catch (error: any) {
      console.error('Error loading settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!userDetails?.userId) return;

    setSaving(true);
    try {
      const response = await LazarusService.updateAutoDetectionRules(userDetails.userId, {
        enabled,
        detection_rules: {
          no_response_days: noResponseDays,
          min_contact_attempts: minContactAttempts,
          auto_add_to_lazarus: autoAddToLazarus,
          signal_types: signalTypes,
          exclude_statuses: ['Qualified', 'Converted'],
          monitor_type: 'focus_contact',
        },
        schedule,
      });

      if (response.status) {
        toast.success('Settings saved successfully!');
        loadSettings(); // Reload to get updated next_scan_date
      } else {
        toast.error(response.responseMessage || 'Failed to save settings');
      }
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleManualScan = async () => {
    if (!userDetails?.userId) return;

    if (!enabled) {
      toast.error('Please enable auto-detection first');
      return;
    }

    setScanning(true);
    try {
      const response = await LazarusService.triggerAutoDetectionScan(userDetails.userId);

      if (response.status && response.responseData) {
        const result = response.responseData;
        toast.success(`Scan complete! Scanned ${result.scanned_leads} leads, marked ${result.marked_dead} as dead, added ${result.added_to_lazarus} to Lazarus`, { duration: 5000 });
        loadSettings(); // Reload to refresh history
      } else {
        toast.error(response.responseMessage || 'Scan failed');
      }
    } catch (error: any) {
      console.error('Error running scan:', error);
      toast.error('Failed to run scan');
    } finally {
      setScanning(false);
    }
  };

  const toggleSignalType = (signalId: string) => {
    if (signalTypes.includes(signalId)) {
      // Don't allow removing all signal types
      if (signalTypes.length === 1) {
        toast.error('At least one signal type must be selected');
        return;
      }
      setSignalTypes(signalTypes.filter((s) => s !== signalId));
    } else {
      setSignalTypes([...signalTypes, signalId]);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <SeoHead title="Lazarus Auto-Detection Settings" />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress sx={{ color: LightThemeColors.primary }} />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <SeoHead title="Lazarus Auto-Detection Settings" />

      <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${LightThemeColors.primary} 0%, #A01560 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: `0 4px 12px ${LightThemeColors.primary}40`,
              }}
            >
              <MdAutorenew size={28} color="#fff" />
            </Box>
            <Box>
              <Typography variant="h4" fontWeight={700} color={LightThemeColors.blackWhite}>
                Auto-Detection Settings
              </Typography>
              <Typography variant="body2" color={LightThemeColors.secondary} sx={{ mt: 0.5 }}>
                Automatically scan your leads and detect resurrection signals
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Enable/Disable Card */}
        <Card
          sx={{
            mb: 3,
            p: 3,
            borderRadius: '16px',
            border: `2px solid ${enabled ? LightThemeColors.primary : '#E5E7EB'}`,
            background: enabled ? `${LightThemeColors.primary}08` : '#fff',
            transition: 'all 0.3s ease',
          }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: LightThemeColors.primary,
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: LightThemeColors.primary,
                  },
                }}
              />
            }
            label={
              <Box>
                <Typography variant="h6" fontWeight={600} color={LightThemeColors.blackWhite}>
                  Enable Automatic Dead Lead Detection
                </Typography>
                <Typography variant="body2" color={LightThemeColors.secondary} sx={{ mt: 0.5 }}>
                  Automatically scan your leads {schedule === 'daily' ? 'daily' : schedule === 'weekly' ? 'weekly' : 'monthly'} and mark as DEAD based on rules below
                </Typography>
              </Box>
            }
          />
        </Card>

        {/* Buying Signals Card */}
        <Card sx={{ mb: 3, p: 3, borderRadius: '16px', border: '1px solid #F3F4F6' }}>
          <Typography variant="h6" fontWeight={600} mb={1} color={LightThemeColors.blackWhite}>
            Buying Signals to Monitor
          </Typography>
          <Typography variant="body2" color={LightThemeColors.secondary} mb={3}>
            Select which signals you want to detect for resurrection opportunities
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
            {BUYING_SIGNALS.map((signal) => {
              const isSelected = signalTypes.includes(signal.id);
              return (
                <Box
                  key={signal.id}
                  onClick={() => toggleSignalType(signal.id)}
                  sx={{
                    p: 2.5,
                    borderRadius: '12px',
                    border: `2px solid ${isSelected ? LightThemeColors.primary : '#E5E7EB'}`,
                    background: isSelected ? `${LightThemeColors.primary}08` : '#FAFBFC',
                    cursor: enabled ? 'pointer' : 'not-allowed',
                    opacity: enabled ? 1 : 0.6,
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    '&:hover': enabled
                      ? {
                          borderColor: LightThemeColors.primary,
                          transform: 'translateY(-2px)',
                          boxShadow: `0 4px 12px ${LightThemeColors.primary}20`,
                        }
                      : {},
                  }}
                >
                  {isSelected && (
                    <CheckCircleIcon
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        color: LightThemeColors.primary,
                        fontSize: 20,
                      }}
                    />
                  )}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
                    <Typography fontSize={24}>{signal.icon}</Typography>
                    <Typography variant="subtitle1" fontWeight={600} color={LightThemeColors.blackWhite}>
                      {signal.name}
                    </Typography>
                  </Box>
                  <Typography variant="body2" color={LightThemeColors.secondary} fontSize="13px">
                    {signal.description}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Card>

        {/* Detection Rules Card */}
        <Card sx={{ mb: 3, p: 3, borderRadius: '16px', border: '1px solid #F3F4F6' }}>
          <Typography variant="h6" fontWeight={600} mb={3} color={LightThemeColors.blackWhite}>
            Detection Rules
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="No Response Days"
              type="number"
              value={noResponseDays}
              onChange={(e) => setNoResponseDays(parseInt(e.target.value))}
              helperText="Mark as dead if no activity in this many days"
              fullWidth
              disabled={!enabled}
              InputProps={{ inputProps: { min: 1, max: 365 } }}
              sx={{
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: LightThemeColors.primary,
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: LightThemeColors.primary,
                },
              }}
            />

            <TextField
              label="Minimum Contact Attempts"
              type="number"
              value={minContactAttempts}
              onChange={(e) => setMinContactAttempts(parseInt(e.target.value))}
              helperText="Require at least this many contact attempts before marking dead"
              fullWidth
              disabled={!enabled}
              InputProps={{ inputProps: { min: 1, max: 10 } }}
              sx={{
                '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: LightThemeColors.primary,
                },
                '& .MuiInputLabel-root.Mui-focused': {
                  color: LightThemeColors.primary,
                },
              }}
            />

            <Box
              sx={{
                p: 2,
                borderRadius: '12px',
                background: autoAddToLazarus ? `${LightThemeColors.primary}08` : '#FAFBFC',
                border: `2px solid ${autoAddToLazarus ? LightThemeColors.primary : '#E5E7EB'}`,
              }}
            >
              <FormControlLabel
                control={
                  <Checkbox
                    checked={autoAddToLazarus}
                    onChange={(e) => setAutoAddToLazarus(e.target.checked)}
                    disabled={!enabled}
                    sx={{
                      color: LightThemeColors.primary,
                      '&.Mui-checked': {
                        color: LightThemeColors.primary,
                      },
                    }}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1" fontWeight={600} color={LightThemeColors.blackWhite}>
                      Automatically add dead leads to Lazarus Monitoring
                    </Typography>
                    <Typography variant="caption" color={LightThemeColors.secondary}>
                      Dead leads will be monitored for resurrection signals based on selected buying signals above
                    </Typography>
                  </Box>
                }
              />
            </Box>
          </Box>
        </Card>

        {/* Schedule Card */}
        <Card sx={{ mb: 3, p: 3, borderRadius: '16px', border: '1px solid #F3F4F6' }}>
          <Typography variant="h6" fontWeight={600} mb={2} color={LightThemeColors.blackWhite}>
            Scan Schedule
          </Typography>

          <FormControl
            fullWidth
            disabled={!enabled}
            sx={{
              '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: LightThemeColors.primary,
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: LightThemeColors.primary,
              },
            }}
          >
            <InputLabel>Schedule</InputLabel>
            <Select value={schedule} label="Schedule" onChange={(e) => setSchedule(e.target.value)}>
              <MenuItem value="daily">Daily - Scan every day</MenuItem>
              <MenuItem value="weekly">Weekly - Scan every week</MenuItem>
              <MenuItem value="monthly">Monthly - Scan every month</MenuItem>
            </Select>
          </FormControl>

          {nextScanDate && (
            <Alert
              severity="info"
              sx={{
                mt: 2,
                borderRadius: '10px',
                backgroundColor: `${LightThemeColors.primary}08`,
                color: LightThemeColors.blackWhite,
                '& .MuiAlert-icon': {
                  color: LightThemeColors.primary,
                },
              }}
            >
              Next scheduled scan: <strong>{new Date(nextScanDate).toLocaleString()}</strong>
            </Alert>
          )}
        </Card>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving || loading}
            startIcon={saving ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : null}
            sx={{
              flex: 1,
              background: `linear-gradient(135deg, ${LightThemeColors.primary} 0%, #A01560 100%)`,
              color: '#fff',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '14px',
              py: 1.5,
              borderRadius: '10px',
              boxShadow: `0 4px 12px ${LightThemeColors.primary}40`,
              '&:hover': {
                background: `linear-gradient(135deg, #A01560 0%, #801248 100%)`,
                boxShadow: `0 6px 16px ${LightThemeColors.primary}50`,
              },
              '&:disabled': {
                background: '#E5E7EB',
                color: '#9CA3AF',
              },
            }}
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>

          <Button
            variant="outlined"
            onClick={handleManualScan}
            disabled={!enabled || scanning || loading}
            startIcon={scanning ? <CircularProgress size={16} sx={{ color: LightThemeColors.primary }} /> : <FaPlay />}
            sx={{
              flex: 1,
              borderColor: LightThemeColors.primary,
              color: LightThemeColors.primary,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '14px',
              py: 1.5,
              borderRadius: '10px',
              borderWidth: 2,
              '&:hover': {
                borderColor: LightThemeColors.primary,
                borderWidth: 2,
                backgroundColor: `${LightThemeColors.primary}08`,
              },
              '&:disabled': {
                borderColor: '#E5E7EB',
                color: '#9CA3AF',
              },
            }}
          >
            {scanning ? 'Scanning...' : 'Run Scan Now'}
          </Button>
        </Box>

        {/* Scan History */}
        <Card sx={{ p: 3, borderRadius: '16px', border: '1px solid #F3F4F6' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <FaHistory size={20} color={LightThemeColors.primary} />
            <Typography variant="h6" fontWeight={600} color={LightThemeColors.blackWhite}>
              Scan History
            </Typography>
          </Box>

          {scanHistory.length === 0 ? (
            <Alert
              severity="info"
              sx={{
                borderRadius: '10px',
                backgroundColor: '#F3F4F6',
                color: LightThemeColors.blackWhite,
              }}
            >
              No scans yet. Run your first scan or wait for the scheduled scan.
            </Alert>
          ) : (
            <Box sx={{ overflowX: 'auto' }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#FAFBFC' }}>
                    <TableCell sx={{ fontWeight: 600, color: LightThemeColors.blackWhite }}>Date</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: LightThemeColors.blackWhite }}>Scanned</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: LightThemeColors.blackWhite }}>Marked Dead</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: LightThemeColors.blackWhite }}>Added to Lazarus</TableCell>
                    <TableCell sx={{ fontWeight: 600, color: LightThemeColors.blackWhite }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {scanHistory.map((scan, idx) => (
                    <TableRow key={idx} sx={{ '&:hover': { backgroundColor: '#FAFBFC' } }}>
                      <TableCell sx={{ color: LightThemeColors.blackWhite, fontSize: '13px' }}>{new Date(scan.scan_date).toLocaleString()}</TableCell>
                      <TableCell sx={{ color: LightThemeColors.blackWhite, fontWeight: 600 }}>{scan.scanned_leads}</TableCell>
                      <TableCell>
                        <Chip label={scan.marked_dead} color={scan.marked_dead > 0 ? 'error' : 'default'} size="small" sx={{ fontWeight: 600 }} />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={scan.added_to_lazarus}
                          size="small"
                          sx={{
                            fontWeight: 600,
                            backgroundColor: scan.added_to_lazarus > 0 ? `${LightThemeColors.primary}20` : '#E5E7EB',
                            color: scan.added_to_lazarus > 0 ? LightThemeColors.primary : LightThemeColors.secondary,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {scan.errors && scan.errors.length > 0 ? (
                          <Chip label={`${scan.errors.length} errors`} color="warning" size="small" sx={{ fontWeight: 600 }} />
                        ) : (
                          <Chip
                            label="Success"
                            size="small"
                            sx={{
                              fontWeight: 600,
                              backgroundColor: `${LightThemeColors.primary}20`,
                              color: LightThemeColors.primary,
                            }}
                          />
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          )}
        </Card>
      </Box>
    </DashboardLayout>
  );
};

export default LazarusSettingsPage;
