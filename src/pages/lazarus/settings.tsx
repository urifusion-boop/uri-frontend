import { LazarusService } from '@/api/LazarusService';
import DashboardLayout from '@/components/atoms/DashboardLayout';
import SeoHead from '@/components/atoms/SeoHead';
import { useAuth } from '@/providers/AuthProvider';
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

  if (loading) {
    return (
      <DashboardLayout>
        <SeoHead title="Lazarus Auto-Detection Settings" />
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
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
            <MdAutorenew size={32} color="#7C3AED" />
            <Typography variant="h4" fontWeight={700}>
              Auto-Detection Settings
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary">
            Automatically scan your leads and mark as DEAD based on rules below
          </Typography>
        </Box>

        {/* Enable/Disable Card */}
        <Card sx={{ mb: 3, p: 3 }}>
          <FormControlLabel
            control={<Switch checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />}
            label={
              <Box>
                <Typography variant="h6" fontWeight={600}>
                  Enable Automatic Dead Lead Detection
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Automatically scan your leads daily and mark as DEAD based on rules
                </Typography>
              </Box>
            }
          />
        </Card>

        {/* Detection Rules Card */}
        <Card sx={{ mb: 3, p: 3 }}>
          <Typography variant="h6" fontWeight={600} mb={3}>
            Detection Rules
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="No Response Days"
              type="number"
              value={noResponseDays}
              onChange={(e) => setNoResponseDays(parseInt(e.target.value))}
              helperText="Mark as dead if no activity in X days"
              fullWidth
              disabled={!enabled}
            />

            <TextField
              label="Minimum Contact Attempts"
              type="number"
              value={minContactAttempts}
              onChange={(e) => setMinContactAttempts(parseInt(e.target.value))}
              helperText="Require at least X contact attempts before marking dead"
              fullWidth
              disabled={!enabled}
            />

            <FormControlLabel
              control={<Checkbox checked={autoAddToLazarus} onChange={(e) => setAutoAddToLazarus(e.target.checked)} disabled={!enabled} />}
              label={
                <Box>
                  <Typography variant="body1" fontWeight={500}>
                    Automatically add dead leads to Lazarus Monitoring
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Dead leads will be monitored for resurrection signals
                  </Typography>
                </Box>
              }
            />
          </Box>
        </Card>

        {/* Schedule Card */}
        <Card sx={{ mb: 3, p: 3 }}>
          <Typography variant="h6" fontWeight={600} mb={2}>
            Scan Schedule
          </Typography>

          <FormControl fullWidth disabled={!enabled}>
            <InputLabel>Schedule</InputLabel>
            <Select value={schedule} label="Schedule" onChange={(e) => setSchedule(e.target.value)}>
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </Select>
          </FormControl>

          {nextScanDate && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Next scheduled scan: {new Date(nextScanDate).toLocaleString()}
            </Alert>
          )}
        </Card>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Button variant="contained" onClick={handleSave} disabled={saving || loading} startIcon={saving ? <CircularProgress size={16} /> : null} sx={{ flex: 1 }}>
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>

          <Button variant="outlined" onClick={handleManualScan} disabled={!enabled || scanning || loading} startIcon={scanning ? <CircularProgress size={16} /> : <FaPlay />} sx={{ flex: 1 }}>
            {scanning ? 'Scanning...' : 'Run Scan Now'}
          </Button>
        </Box>

        {/* Scan History */}
        <Card sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <FaHistory size={20} />
            <Typography variant="h6" fontWeight={600}>
              Scan History
            </Typography>
          </Box>

          {scanHistory.length === 0 ? (
            <Alert severity="info">No scans yet. Run your first scan or wait for the scheduled scan.</Alert>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Date</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Scanned</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Marked Dead</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Added to Lazarus</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Status</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {scanHistory.map((scan, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{new Date(scan.scan_date).toLocaleString()}</TableCell>
                    <TableCell>{scan.scanned_leads}</TableCell>
                    <TableCell>
                      <Chip label={scan.marked_dead} color={scan.marked_dead > 0 ? 'error' : 'default'} size="small" />
                    </TableCell>
                    <TableCell>
                      <Chip label={scan.added_to_lazarus} color={scan.added_to_lazarus > 0 ? 'success' : 'default'} size="small" />
                    </TableCell>
                    <TableCell>
                      {scan.errors && scan.errors.length > 0 ? <Chip label={`${scan.errors.length} errors`} color="warning" size="small" /> : <Chip label="Success" color="success" size="small" />}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      </Box>
    </DashboardLayout>
  );
};

export default LazarusSettingsPage;
