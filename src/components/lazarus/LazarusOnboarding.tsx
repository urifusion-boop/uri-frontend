import { LazarusService } from '@/api/LazarusService';
import { Box, Button, Card, Checkbox, Chip, FormControlLabel, Grid, Typography } from '@mui/material';
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

type OnboardingStep = 'welcome' | 'choose-method' | 'buying-signals' | 'crm-connect';
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
  const [selectedSignals, setSelectedSignals] = useState<string[]>(['funding', 'hiring', 'pain', 'switch']); // All selected by default
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
      // Open CRM connection modal
      setShowCRMModal(true);
      return;
    }

    // Go to buying signals selection
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
      // Save buying signal preferences
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
      // Still complete onboarding even if preferences fail
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
    // Go to buying signals step
    setStep('buying-signals');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      <Box sx={{ maxWidth: 900, width: '100%' }}>
        {/* STEP 1: Choose Method */}
        {step === 'choose-method' && (
          <Box>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 5 }}>
              <Box
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  boxShadow: '0 8px 24px rgba(124, 58, 237, 0.3)',
                }}
              >
                <Typography fontSize="36px">🧬</Typography>
              </Box>
              <Typography variant="h3" fontWeight={700} color="#111827" mb={2} letterSpacing="-0.02em">
                Lazarus Protocol
              </Typography>
              <Typography variant="h5" fontWeight={600} color="#374151" mb={1}>
                Who do you want us to monitor for buying signals?
              </Typography>
              <Typography variant="body1" color="#6B7280" fontSize="15px" maxWidth={600} mx="auto">
                Choose how you'd like to add contacts and companies to monitor. We'll watch them for signals that they're ready to buy.
              </Typography>
            </Box>

            {/* Two Option Cards */}
            <Grid container spacing={3} mb={4}>
              {/* Option 1: Manual Upload */}
              <Grid item xs={12} md={6}>
                <Card
                  onClick={() => handleMethodSelect('manual')}
                  sx={{
                    p: 4,
                    cursor: 'pointer',
                    border: selectedMethod === 'manual' ? '3px solid #7C3AED' : '2px solid #E5E7EB',
                    borderRadius: '16px',
                    transition: 'all 0.3s ease',
                    height: '100%',
                    position: 'relative',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 32px rgba(0,0,0,0.1)',
                      borderColor: '#7C3AED',
                    },
                  }}
                >
                  {selectedMethod === 'manual' && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: '#7C3AED',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <FaCheckCircle size={18} color="#fff" />
                    </Box>
                  )}

                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '12px',
                      background: '#F3E8FF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                    }}
                  >
                    <FaFileUpload size={28} color="#7C3AED" />
                  </Box>

                  <Typography variant="h6" fontWeight={700} color="#111827" mb={1.5}>
                    Manual Upload
                  </Typography>

                  <Typography variant="body2" color="#6B7280" mb={3} lineHeight={1.6}>
                    Upload a CSV or paste contacts directly. Great for quick setup and full control.
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#7C3AED' }} />
                      <Typography fontSize="13px" color="#374151" fontWeight={500}>
                        Upload CSV file
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#7C3AED' }} />
                      <Typography fontSize="13px" color="#374151" fontWeight={500}>
                        Paste contacts directly
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#7C3AED' }} />
                      <Typography fontSize="13px" color="#374151" fontWeight={500}>
                        Quick 5-minute setup
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>

              {/* Option 2: Connect CRM */}
              <Grid item xs={12} md={6}>
                <Card
                  onClick={() => handleMethodSelect('crm')}
                  sx={{
                    p: 4,
                    cursor: 'pointer',
                    border: selectedMethod === 'crm' ? '3px solid #7C3AED' : '2px solid #E5E7EB',
                    borderRadius: '16px',
                    transition: 'all 0.3s ease',
                    height: '100%',
                    position: 'relative',
                    background: 'linear-gradient(135deg, #FEFCFF 0%, #F9F5FF 100%)',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 32px rgba(124, 58, 237, 0.2)',
                      borderColor: '#7C3AED',
                    },
                  }}
                >
                  {/* Recommended Badge */}
                  <Chip
                    label="⭐ RECOMMENDED"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      backgroundColor: '#7C3AED',
                      color: '#fff',
                      fontWeight: 700,
                      fontSize: '11px',
                      height: 26,
                    }}
                  />

                  {selectedMethod === 'crm' && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: '#7C3AED',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <FaCheckCircle size={18} color="#fff" />
                    </Box>
                  )}

                  <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                      boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
                    }}
                  >
                    <FaLink size={28} color="#fff" />
                  </Box>

                  <Typography variant="h6" fontWeight={700} color="#111827" mb={1.5}>
                    Connect CRM
                  </Typography>

                  <Typography variant="body2" color="#6B7280" mb={3} lineHeight={1.6}>
                    Automatically sync your stalled deals, closed-lost leads, and active prospects.
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#7C3AED' }} />
                      <Typography fontSize="13px" color="#374151" fontWeight={500}>
                        HubSpot & Salesforce
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#7C3AED' }} />
                      <Typography fontSize="13px" color="#374151" fontWeight={500}>
                        Auto-sync stalled deals
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#7C3AED' }} />
                      <Typography fontSize="13px" color="#374151" fontWeight={500}>
                        Sync insights back to CRM
                      </Typography>
                    </Box>
                  </Box>
                </Card>
              </Grid>
            </Grid>

            {/* Continue Button */}
            <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                size="large"
                disabled={!selectedMethod}
                onClick={handleContinueFromMethodSelection}
                sx={{
                  background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
                  color: '#fff',
                  px: 6,
                  py: 1.5,
                  fontSize: '16px',
                  fontWeight: 700,
                  borderRadius: '10px',
                  textTransform: 'none',
                  boxShadow: '0 4px 14px rgba(124, 58, 237, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #6D28D9 0%, #4C1D95 100%)',
                    boxShadow: '0 6px 20px rgba(124, 58, 237, 0.5)',
                  },
                  '&:disabled': {
                    background: '#E5E7EB',
                    color: '#9CA3AF',
                  },
                }}
              >
                Continue
              </Button>

              {selectedMethod === 'manual' && (
                <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'center' }}>
                  <Button
                    variant="outlined"
                    startIcon={<FaFileUpload />}
                    onClick={() => handleManualUploadChoice('csv')}
                    sx={{
                      borderColor: '#7C3AED',
                      color: '#7C3AED',
                      textTransform: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: '#6D28D9',
                        backgroundColor: '#F3E8FF',
                      },
                    }}
                  >
                    Upload CSV
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<MdBusiness />}
                    onClick={() => handleManualUploadChoice('paste')}
                    sx={{
                      borderColor: '#7C3AED',
                      color: '#7C3AED',
                      textTransform: 'none',
                      fontWeight: 600,
                      '&:hover': {
                        borderColor: '#6D28D9',
                        backgroundColor: '#F3E8FF',
                      },
                    }}
                  >
                    Paste & Go
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        )}

        {/* STEP 2: Buying Signals Selection */}
        {step === 'buying-signals' && (
          <Box>
            <Box sx={{ textAlign: 'center', mb: 5 }}>
              <Typography variant="h4" fontWeight={700} color="#111827" mb={2}>
                What buying signals matter to you?
              </Typography>
              <Typography variant="body1" color="#6B7280" fontSize="15px" maxWidth={600} mx="auto">
                Select the signals you want us to watch for. We'll notify you when contacts show these signs.
              </Typography>
            </Box>

            <Card sx={{ p: 4, borderRadius: '16px', maxWidth: 600, mx: 'auto', mb: 4 }}>
              <Grid container spacing={2}>
                {BUYING_SIGNALS.map((signal) => (
                  <Grid item xs={12} key={signal.id}>
                    <Box
                      onClick={() => handleSignalToggle(signal.id)}
                      sx={{
                        p: 2.5,
                        borderRadius: '12px',
                        border: selectedSignals.includes(signal.id) ? '2px solid #7C3AED' : '2px solid #E5E7EB',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        background: selectedSignals.includes(signal.id) ? '#F9F5FF' : '#fff',
                        '&:hover': {
                          borderColor: '#7C3AED',
                          background: '#F9F5FF',
                        },
                      }}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={selectedSignals.includes(signal.id)}
                            sx={{
                              color: '#7C3AED',
                              '&.Mui-checked': {
                                color: '#7C3AED',
                              },
                            }}
                          />
                        }
                        label={
                          <Box>
                            <Typography fontWeight={600} color="#111827" fontSize="15px">
                              {signal.name}
                            </Typography>
                            <Typography variant="caption" color="#6B7280" fontSize="13px">
                              {signal.description}
                            </Typography>
                          </Box>
                        }
                        sx={{ m: 0, width: '100%' }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Card>

            <Box sx={{ textAlign: 'center', display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={() => setStep('choose-method')}
                sx={{
                  borderColor: '#E5E7EB',
                  color: '#6B7280',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                size="large"
                disabled={selectedSignals.length === 0 || saving}
                onClick={handleCompleteOnboarding}
                sx={{
                  background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
                  color: '#fff',
                  px: 6,
                  py: 1.5,
                  fontSize: '16px',
                  fontWeight: 700,
                  borderRadius: '10px',
                  textTransform: 'none',
                  boxShadow: '0 4px 14px rgba(124, 58, 237, 0.4)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #6D28D9 0%, #4C1D95 100%)',
                  },
                  '&:disabled': {
                    background: '#E5E7EB',
                    color: '#9CA3AF',
                  },
                }}
              >
                {saving ? 'Saving...' : 'Complete Setup'}
              </Button>
            </Box>
          </Box>
        )}
      </Box>

      {/* Modals */}
      <CSVUploadModal open={showCSVModal} onClose={() => setShowCSVModal(false)} userId={userId} onSuccess={handleUploadSuccess} />
      <PasteAndGoModal open={showPasteModal} onClose={() => setShowPasteModal(false)} userId={userId} onSuccess={handleUploadSuccess} />
      <ConnectCRMModal open={showCRMModal} onClose={() => setShowCRMModal(false)} userId={userId} onSuccess={handleUploadSuccess} />
    </Box>
  );
};

export default LazarusOnboarding;
