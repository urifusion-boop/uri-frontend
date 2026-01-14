import { LazarusService } from '@/api/LazarusService';
import CustomButton from '@/components/atoms/CustomButton';
import { useAuth } from '@/providers/AuthProvider';
import { Alert, Box, Checkbox, Chip, FormControl, FormControlLabel, InputLabel, MenuItem, Modal, Radio, RadioGroup, Select, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

interface MarkAsDeadModalProps {
  open: boolean;
  onClose: () => void;
  leadId: string;
  leadName?: string;
  leadCompanyName?: string;
  onSuccess?: (addedToLazarus: boolean) => void;
}

const DEAD_REASONS = [
  { value: 'not_responding', label: 'Not Responding' },
  { value: 'budget_constraints', label: 'Budget Constraints' },
  { value: 'wrong_timing', label: 'Wrong Timing' },
  { value: 'chose_competitor', label: 'Chose Competitor' },
  { value: 'not_decision_maker', label: 'Not Decision Maker' },
  { value: 'other', label: 'Other (specify below)' },
];

const MarkAsDeadModal: React.FC<MarkAsDeadModalProps> = ({ open, onClose, leadId, leadName, leadCompanyName, onSuccess }) => {
  const { userDetails } = useAuth();
  const [reason, setReason] = useState('not_responding');
  const [customReason, setCustomReason] = useState('');
  const [addToLazarus, setAddToLazarus] = useState(false);
  const [monitorType, setMonitorType] = useState<'focus_contact' | 'company_monitor'>('focus_contact');
  const [industryKeywords, setIndustryKeywords] = useState<string[]>([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !industryKeywords.includes(keywordInput.trim())) {
      setIndustryKeywords([...industryKeywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const handleDeleteKeyword = (keyword: string) => {
    setIndustryKeywords(industryKeywords.filter((k) => k !== keyword));
  };

  const handleSubmit = async () => {
    if (!userDetails?.userId) {
      toast.error('User not authenticated');
      return;
    }

    // Build final reason string
    let finalReason = DEAD_REASONS.find((r) => r.value === reason)?.label || '';
    if (reason === 'other' && customReason.trim()) {
      finalReason = customReason.trim();
    }

    if (!finalReason) {
      toast.error('Please provide a reason');
      return;
    }

    setLoading(true);

    try {
      const response = await LazarusService.markLeadAsDead(userDetails.userId, leadId, finalReason, addToLazarus);

      if (response.status) {
        const addedToMonitoring = response.responseData?.monitoring_added || false;

        if (addedToMonitoring) {
          toast.success('Lead marked as dead and added to Lazarus monitoring!', {
            duration: 4000,
          });
        } else {
          toast.success('Lead marked as dead');
        }

        if (onSuccess) {
          onSuccess(addedToMonitoring);
        }

        handleClose();
      } else {
        toast.error(response.responseMessage || 'Failed to mark lead as dead');
      }
    } catch (error: any) {
      console.error('Error marking lead as dead:', error);
      toast.error(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setReason('not_responding');
    setCustomReason('');
    setAddToLazarus(false);
    setMonitorType('focus_contact');
    setIndustryKeywords([]);
    setKeywordInput('');
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', md: 600 },
          maxHeight: '90vh',
          overflow: 'auto',
          bgcolor: 'background.paper',
          borderRadius: '16px',
          boxShadow: 24,
          p: 4,
        }}
      >
        {/* Header */}
        <Typography variant="h5" fontWeight={700} mb={1}>
          Mark Lead as Dead
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          {leadName && `${leadName} `}
          {leadCompanyName && `from ${leadCompanyName}`}
        </Typography>

        {/* Reason Selection */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Reason</InputLabel>
          <Select value={reason} label="Reason" onChange={(e) => setReason(e.target.value)}>
            {DEAD_REASONS.map((r) => (
              <MenuItem key={r.value} value={r.value}>
                {r.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Custom Reason (if "Other" selected) */}
        {reason === 'other' && <TextField fullWidth label="Specify Reason" value={customReason} onChange={(e) => setCustomReason(e.target.value)} multiline rows={2} sx={{ mb: 2 }} />}

        {/* Add to Lazarus Checkbox */}
        <Box sx={{ mb: 2, p: 2, bgcolor: '#F9FAFB', borderRadius: 2 }}>
          <FormControlLabel
            control={<Checkbox checked={addToLazarus} onChange={(e) => setAddToLazarus(e.target.checked)} />}
            label={
              <Box>
                <Typography variant="body1" fontWeight={600}>
                  Add to Lazarus Monitoring
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Monitor this lead for resurrection signals (job changes, pain points, buying intent)
                </Typography>
              </Box>
            }
          />

          {/* Monitor Type Selection (if checkbox checked) */}
          {addToLazarus && (
            <Box sx={{ mt: 2, pl: 4 }}>
              <Typography variant="body2" fontWeight={600} mb={1}>
                Monitor Type:
              </Typography>
              <RadioGroup value={monitorType} onChange={(e) => setMonitorType(e.target.value as 'focus_contact' | 'company_monitor')}>
                <FormControlLabel
                  value="focus_contact"
                  control={<Radio size="small" />}
                  label={
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        Focus Contact (Individual)
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Track job changes, social signals, pain points
                      </Typography>
                    </Box>
                  }
                />
                <FormControlLabel
                  value="company_monitor"
                  control={<Radio size="small" />}
                  label={
                    <Box>
                      <Typography variant="body2" fontWeight={500}>
                        Company Monitor
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Track hiring, funding, pivots, website changes
                      </Typography>
                    </Box>
                  }
                />
              </RadioGroup>

              {/* Industry Keywords */}
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" fontWeight={600} mb={1}>
                  Industry Keywords (Optional):
                </Typography>
                <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                  Add keywords to monitor for in social posts (e.g., "logistics", "inverter", "diesel")
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                  <TextField
                    size="small"
                    placeholder="Enter keyword"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddKeyword();
                      }
                    }}
                    fullWidth
                  />
                  <CustomButton mode="secondary" onClick={handleAddKeyword} style={{ minWidth: 80 }}>
                    Add
                  </CustomButton>
                </Box>

                {/* Keywords Display */}
                {industryKeywords.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {industryKeywords.map((keyword, idx) => (
                      <Chip key={idx} label={keyword} onDelete={() => handleDeleteKeyword(keyword)} size="small" />
                    ))}
                  </Box>
                )}
              </Box>

              <Alert severity="info" sx={{ mt: 2 }}>
                This will use 1 of your Lazarus monitoring slots (50 on Basic plan, 500 on Pro)
              </Alert>
            </Box>
          )}
        </Box>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <CustomButton mode="secondary" onClick={handleClose} disabled={loading} style={{ flex: 1 }}>
            Cancel
          </CustomButton>
          <CustomButton mode="primary" onClick={handleSubmit} loading={loading} style={{ flex: 1 }}>
            Mark as Dead
          </CustomButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default MarkAsDeadModal;
