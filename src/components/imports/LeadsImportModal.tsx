import { LeadDto } from '@/models/dtos/LeadsDto';
import { Box, Button, Grid, Tooltip, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { FileImportIcon, SyncImportIcon } from '../atoms/Icons';
import SmartModal from '../modals/SmartModal';
import ImportStepError from './ImportStepError';
import ImportStepProgress from './ImportStepProgress';
import ImportStepReview from './ImportStepReview';
import ImportStepSuccess from './ImportStepSuccess';
import ImportStepUpload from './ImportStepUpload';

const ImportStep = {
  LANDING: 'landing',
  UPLOAD: 'upload',
  PROGRESS: 'progress',
  REVIEW: 'review',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

type Step = (typeof ImportStep)[keyof typeof ImportStep];

interface UnifiedLeadImportModalProps {
  open: boolean;
  onClose: () => void;
  isSyncingDisabled?: boolean;
}

const LeadsImportModal: React.FC<UnifiedLeadImportModalProps> = ({ open, onClose, isSyncingDisabled }) => {
  const [step, setStep] = useState<Step>('landing');
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(60);

  const [leads] = useState<LeadDto[]>([
    {
      first_name: 'Fatimah',
      last_name: 'Oladigbolu',
      lead_email: 'fatimah@uri.com',
      phone: '(207) 555-0119',
      job_title: 'Medical Assistant',
      location: 'Algeria',
      website_url: 'https://www.uri.com',
      lead_type: 'Lead',
    },
    {
      first_name: 'Ebube',
      last_name: 'Onwandi',
      lead_email: 'ebube@uri.com',
      phone: '(505) 555-0125',
      job_title: 'Web Designer',
      location: 'Iceland',
      website_url: 'https://www.uri.com',
      lead_type: 'Lead',
    },
  ]);

  useEffect(() => {
    if (step === 'progress' && progress < 100) {
      const timer = setTimeout(() => setProgress((prev) => prev + 10), 450);
      return () => clearTimeout(timer);
    }

    if (step === 'progress' && progress >= 100) {
      setTimeout(() => setStep('review'), 600);
    }
  }, [step, progress]);

  const reset = () => {
    setFile(null);
    setProgress(60);
    setStep('landing');
  };

  return (
    <SmartModal
      open={open}
      onClick={onClose}
      maxWidth="xl"
      fullWidth
      sx={{ '& .MuiDialog-paper': { borderRadius: 4, maxWidth: 950, m: 'auto' } }}
      // mainText="Import Leads"
    >
      {step === 'landing' && (
        <Box sx={{ textAlign: 'center' }}>
          <Typography sx={{ fontSize: 17, color: '#232627', opacity: 0.8, mb: 4, fontWeight: 400, maxWidth: 540, mx: 'auto' }}>
            Ready to get started? Import your leads by uploading a CSV or Excel file, or sync directly from your favorite tools to begin tracking with Uri.
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ border: '1.5px solid #EAEAEA', borderRadius: 2, p: 3, bgcolor: '#fafbfc', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <FileImportIcon width={150} height={150} />
                <Typography fontWeight={600} fontSize={18} mt={2} mb={1}>
                  Import from files
                </Typography>
                <Typography fontSize={15} color="#6E6E6E" mb={2}>
                  Upload a CSV or Excel file to import leads from your existing data sources.
                </Typography>
                <Button onClick={() => setStep('upload')} variant="contained" sx={{ bgcolor: '#CD1B78', mt: 'auto', textTransform: 'none', borderRadius: 2 }}>
                  Import a file
                </Button>
              </Box>
            </Grid>
            <Tooltip title={isSyncingDisabled ? 'Coming Soon...' : ''}>
              <Grid item xs={12} md={6}>
                <Box
                  sx={{
                    border: '1.5px solid #EAEAEA',
                    borderRadius: 2,
                    p: 3,
                    bgcolor: '#fafbfc',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    opacity: isSyncingDisabled ? 0.5 : 1,
                  }}
                >
                  <SyncImportIcon width={150} height={150} />
                  <Typography fontWeight={600} fontSize={18} mt={2} mb={1}>
                    Sync from app
                  </Typography>
                  <Typography fontSize={15} color="#6E6E6E" mb={2}>
                    Connect to external tools to sync leads directly—no manual upload needed.
                  </Typography>
                  <Button variant="contained" disabled sx={{ bgcolor: '#888', mt: 'auto', textTransform: 'none', borderRadius: 2 }}>
                    Sync an app
                  </Button>
                </Box>
              </Grid>
            </Tooltip>
          </Grid>
        </Box>
      )}

      {step === 'upload' && (
        <ImportStepUpload
          onFileSelect={(f) => {
            setFile(f);
            setStep('progress');
          }}
          onBack={reset}
        />
      )}

      {step === 'progress' && file && <ImportStepProgress file={file} progress={progress} onBack={() => setStep('upload')} onNext={() => setStep('review')} />}

      {step === 'review' && <ImportStepReview leads={leads} onBack={() => setStep('upload')} onConfirm={() => setStep('success')} />}

      {step === 'success' && (
        <ImportStepSuccess
          onDone={() => {
            reset();
            onClose();
          }}
        />
      )}

      {step === 'error' && <ImportStepError onRetry={() => setStep('upload')} onCancel={onClose} />}
    </SmartModal>
  );
};

export default LeadsImportModal;
