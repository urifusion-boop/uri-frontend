import { LazarusService } from '@/api/LazarusService';
import { LightThemeColors } from '@/configs/colors.config';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Button, Checkbox, Dialog, DialogContent, FormControlLabel, IconButton, Typography } from '@mui/material';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaCheckCircle, FaFileUpload, FaLink } from 'react-icons/fa';
import { MdBusiness } from 'react-icons/md';
import ConnectCRMModal from './ConnectCRMModal';
import CSVUploadModal from './CSVUploadModal';
import PasteAndGoModal from './PasteAndGoModal';

interface LazarusOnboardingProps {
  userId: string;
  onComplete: () => void;
}

type OnboardingStep = 'choose-method' | 'buying-signals';
type UploadMethod = 'manual' | 'crm';

interface BuyingSignal {
  id: string;
  name: string;
  description: string;
}

const BUYING_SIGNALS: BuyingSignal[] = [
  { id: 'funding', name: 'Funding', description: 'Company received investment or raised capital' },
  { id: 'hiring', name: 'Hiring', description: 'Company is hiring for relevant roles' },
  { id: 'pain', name: 'Pain Points', description: 'Expressing frustration with current solution' },
  { id: 'switch', name: 'Switching Intent', description: 'Considering or evaluating alternatives' },
];

const LazarusOnboarding: React.FC<LazarusOnboardingProps> = ({ userId, onComplete }) => {
  const [step, setStep] = useState<OnboardingStep>('choose-method');
  const [selectedMethod, setSelectedMethod] = useState<UploadMethod | null>(null);
  const [selectedSignals, setSelectedSignals] = useState<string[]>(['funding', 'hiring', 'pain', 'switch']);
  const [showCSVModal, setShowCSVModal] = useState(false);
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [showCRMModal, setShowCRMModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleMethodSelect = (method: UploadMethod) => {
    setSelectedMethod(method);
  };

  const handleContinueFromMethodSelection = () => {
    if (!selectedMethod) {
      toast.error('Please select a method to continue');
      return;
    }

    if (selectedMethod === 'crm') {
      setShowCRMModal(true);
      return;
    }

    setStep('buying-signals');
  };

  const handleSignalToggle = (signalId: string) => {
    setSelectedSignals((prev) => (prev.includes(signalId) ? prev.filter((s) => s !== signalId) : [...prev, signalId]));
  };

  const handleCompleteOnboarding = async () => {
    if (selectedSignals.length === 0) {
      toast.error('Please select at least one buying signal');
      return;
    }

    setSaving(true);
    try {
      await LazarusService.updateAutoDetectionRules(userId, {
        enabled: true,
        detection_rules: {
          signal_types: selectedSignals,
          auto_add_to_lazarus: false,
        },
      });

      toast.success('Lazarus Protocol setup complete!');
      onComplete();
    } catch (error) {
      console.error('Error saving onboarding preferences:', error);
      toast.error('Failed to save preferences. You can configure this later in Settings.');
      onComplete();
    } finally {
      setSaving(false);
    }
  };

  const handleManualUploadChoice = (choice: 'csv' | 'paste') => {
    if (choice === 'csv') {
      setShowCSVModal(true);
    } else {
      setShowPasteModal(true);
    }
  };

  const handleUploadSuccess = () => {
    setShowCSVModal(false);
    setShowPasteModal(false);
    setShowCRMModal(false);
    setStep('buying-signals');
  };

  return (
    <Dialog open={true} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '12px', maxWidth: '500px' } }}>
      <DialogContent sx={{ p: 4, position: 'relative' }}>
        {/* Close Button */}
        <IconButton
          onClick={onComplete}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: LightThemeColors.secondary,
          }}
          size="small"
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        {/* STEP 1: Choose Method */}
        {step === 'choose-method' && (
          <Box>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 3, pr: 4 }}>
              <Typography variant="h5" fontWeight={700} color={LightThemeColors.blackWhite} mb={1}>
                Who do you want us to monitor for buying signals?
              </Typography>
              <Typography variant="body2" color={LightThemeColors.secondary} fontSize="14px">
                Choose how you'd like to add contacts and companies
              </Typography>
            </Box>

            {/* Two Options */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 3 }}>
              {/* Option 1: Manual Upload */}
              <Box
                onClick={() => handleMethodSelect('manual')}
                sx={{
                  p: 2.5,
                  border: `2px solid ${selectedMethod === 'manual' ? LightThemeColors.primary : LightThemeColors.borderColor}`,
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: selectedMethod === 'manual' ? `${LightThemeColors.primary}08` : '#fff',
                  '&:hover': {
                    borderColor: LightThemeColors.primary,
                    background: `${LightThemeColors.primary}08`,
                  },
                  position: 'relative',
                }}
              >
                {selectedMethod === 'manual' && (
                  <Box sx={{ position: 'absolute', top: 12, right: 12 }}>
                    <FaCheckCircle size={18} color={LightThemeColors.primary} />
                  </Box>
                )}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: '8px',
                      background: `${LightThemeColors.primary}15`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <FaFileUpload size={20} color={LightThemeColors.primary} />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600} color={LightThemeColors.blackWhite} mb={0.5}>
                      Manual Upload
                    </Typography>
                    <Typography variant="body2" color={LightThemeColors.secondary} fontSize="13px">
                      Upload CSV or paste contacts directly
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Option 2: Connect CRM */}
              <Box
                onClick={() => handleMethodSelect('crm')}
                sx={{
                  p: 2.5,
                  border: `2px solid ${selectedMethod === 'crm' ? LightThemeColors.primary : LightThemeColors.borderColor}`,
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  background: selectedMethod === 'crm' ? `${LightThemeColors.primary}08` : '#fff',
                  '&:hover': {
                    borderColor: LightThemeColors.primary,
                    background: `${LightThemeColors.primary}08`,
                  },
                  position: 'relative',
                }}
              >
                <Box
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    px: 1.5,
                    py: 0.5,
                    background: LightThemeColors.primary,
                    borderRadius: '6px',
                  }}
                >
                  <Typography fontSize="10px" fontWeight={700} color="#fff">
                    RECOMMENDED
                  </Typography>
                </Box>
                {selectedMethod === 'crm' && (
                  <Box sx={{ position: 'absolute', top: 40, right: 12 }}>
                    <FaCheckCircle size={18} color={LightThemeColors.primary} />
                  </Box>
                )}
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box
                    sx={{
                      width: 42,
                      height: 42,
                      borderRadius: '8px',
                      background: LightThemeColors.primary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <FaLink size={20} color="#fff" />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" fontWeight={600} color={LightThemeColors.blackWhite} mb={0.5}>
                      Connect CRM
                    </Typography>
                    <Typography variant="body2" color={LightThemeColors.secondary} fontSize="13px">
                      Auto-sync from HubSpot or Salesforce
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              {selectedMethod === 'manual' && (
                <>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<FaFileUpload size={14} />}
                    onClick={() => handleManualUploadChoice('csv')}
                    sx={{
                      borderColor: LightThemeColors.borderColor,
                      color: LightThemeColors.blackWhite,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '13px',
                      py: 1.2,
                      '&:hover': {
                        borderColor: LightThemeColors.primary,
                        background: `${LightThemeColors.primary}05`,
                      },
                    }}
                  >
                    Upload CSV
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    startIcon={<MdBusiness size={16} />}
                    onClick={() => handleManualUploadChoice('paste')}
                    sx={{
                      borderColor: LightThemeColors.borderColor,
                      color: LightThemeColors.blackWhite,
                      textTransform: 'none',
                      fontWeight: 600,
                      fontSize: '13px',
                      py: 1.2,
                      '&:hover': {
                        borderColor: LightThemeColors.primary,
                        background: `${LightThemeColors.primary}05`,
                      },
                    }}
                  >
                    Paste & Go
                  </Button>
                </>
              )}
              {selectedMethod === 'crm' && (
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleContinueFromMethodSelection}
                  sx={{
                    background: LightThemeColors.primary,
                    color: '#fff',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '14px',
                    py: 1.2,
                    boxShadow: 'none',
                    '&:hover': {
                      background: LightThemeColors.primary,
                      opacity: 0.9,
                      boxShadow: 'none',
                    },
                  }}
                >
                  Continue
                </Button>
              )}
              {!selectedMethod && (
                <Button
                  fullWidth
                  variant="contained"
                  disabled
                  sx={{
                    background: LightThemeColors.borderColor,
                    color: LightThemeColors.secondary,
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '14px',
                    py: 1.2,
                    boxShadow: 'none',
                  }}
                >
                  Select a method to continue
                </Button>
              )}
            </Box>
          </Box>
        )}

        {/* STEP 2: Buying Signals */}
        {step === 'buying-signals' && (
          <Box>
            <Box sx={{ textAlign: 'center', mb: 3, pr: 4 }}>
              <Typography variant="h5" fontWeight={700} color={LightThemeColors.blackWhite} mb={1}>
                What buying signals matter to you?
              </Typography>
              <Typography variant="body2" color={LightThemeColors.secondary} fontSize="14px">
                Select signals to monitor
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
              {BUYING_SIGNALS.map((signal) => (
                <Box
                  key={signal.id}
                  onClick={() => handleSignalToggle(signal.id)}
                  sx={{
                    p: 2,
                    borderRadius: '8px',
                    border: `2px solid ${selectedSignals.includes(signal.id) ? LightThemeColors.primary : LightThemeColors.borderColor}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    background: selectedSignals.includes(signal.id) ? `${LightThemeColors.primary}08` : '#fff',
                    '&:hover': {
                      borderColor: LightThemeColors.primary,
                      background: `${LightThemeColors.primary}08`,
                    },
                  }}
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={selectedSignals.includes(signal.id)}
                        sx={{
                          color: LightThemeColors.borderColor,
                          '&.Mui-checked': {
                            color: LightThemeColors.primary,
                          },
                        }}
                      />
                    }
                    label={
                      <Box>
                        <Typography fontWeight={600} color={LightThemeColors.blackWhite} fontSize="14px">
                          {signal.name}
                        </Typography>
                        <Typography variant="caption" color={LightThemeColors.secondary} fontSize="12px">
                          {signal.description}
                        </Typography>
                      </Box>
                    }
                    sx={{ m: 0, width: '100%' }}
                  />
                </Box>
              ))}
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setStep('choose-method')}
                sx={{
                  borderColor: LightThemeColors.borderColor,
                  color: LightThemeColors.secondary,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '14px',
                  px: 3,
                  py: 1.2,
                }}
              >
                Back
              </Button>
              <Button
                fullWidth
                variant="contained"
                disabled={selectedSignals.length === 0 || saving}
                onClick={handleCompleteOnboarding}
                sx={{
                  background: LightThemeColors.primary,
                  color: '#fff',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '14px',
                  py: 1.2,
                  boxShadow: 'none',
                  '&:hover': {
                    background: LightThemeColors.primary,
                    opacity: 0.9,
                    boxShadow: 'none',
                  },
                  '&:disabled': {
                    background: LightThemeColors.borderColor,
                    color: LightThemeColors.secondary,
                  },
                }}
              >
                {saving ? 'Saving...' : 'Complete Setup'}
              </Button>
            </Box>
          </Box>
        )}
      </DialogContent>

      {/* Modals */}
      <CSVUploadModal open={showCSVModal} onClose={() => setShowCSVModal(false)} userId={userId} onSuccess={handleUploadSuccess} />
      <PasteAndGoModal open={showPasteModal} onClose={() => setShowPasteModal(false)} userId={userId} onSuccess={handleUploadSuccess} />
      <ConnectCRMModal open={showCRMModal} onClose={() => setShowCRMModal(false)} userId={userId} onSuccess={handleUploadSuccess} />
    </Dialog>
  );
};

export default LazarusOnboarding;
