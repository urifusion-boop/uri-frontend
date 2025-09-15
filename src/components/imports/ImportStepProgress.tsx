import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { Box, Button, LinearProgress, Typography } from '@mui/material';
import React from 'react';

interface ImportStepProgressProps {
  file: File;
  progress: number;
  onBack: () => void;
  onNext: () => void;
}

const ImportStepProgress: React.FC<ImportStepProgressProps> = ({ file, progress, onBack, onNext }) => (
  <>
    <Typography align="center" fontWeight={700} fontSize={28} mt={2} mb={1}>
      Import <span style={{ color: '#CD1B78' }}>Leads</span>
    </Typography>
    <Typography align="center" color="#65676B" fontSize={16} mb={3}>
      Already have lead data? Upload your spreadsheet to bring them into your dashboard and manage them easily.
    </Typography>
    <Box
      sx={{
        border: '1.5px solid #e5e7eb',
        borderRadius: '11px',
        p: 2,
        my: 2,
        display: 'flex',
        alignItems: 'center',
        bgcolor: '#fafbfc',
        minHeight: 80,
      }}
    >
      <InsertDriveFileIcon sx={{ fontSize: 32, color: '#1A6F46', mr: 1 }} />
      <Box flex={1}>
        <Typography fontSize={15} fontWeight={500}>
          {file.name}
        </Typography>
        <Typography fontSize={13} color="#A0A0A0">
          {(file.size / 1024).toFixed(1)} KB
        </Typography>
        <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 2, my: 1 }} />
        <Typography color="#1A6F46" fontSize={12}>
          Uploading...{progress}%
        </Typography>
      </Box>
    </Box>
    <Box mb={3}>
      <Box display="flex" alignItems="center" mb={1}>
        <InfoOutlinedIcon sx={{ color: '#CD1B78', mr: 0.5, fontSize: 20 }} />
        <Typography fontWeight={600} fontSize={15}>
          Note
        </Typography>
      </Box>
      <ul style={{ margin: 0, paddingLeft: 24 }}>
        <li style={{ color: '#CD1B78', fontSize: 14, marginBottom: 3 }}>Email is required for each lead.</li>
        <li style={{ color: '#CD1B78', fontSize: 14, marginBottom: 3 }}>Make sure there are no empty header cells.</li>
        <li style={{ color: '#CD1B78', fontSize: 14, marginBottom: 3 }}>Invalid or duplicate leads will be skipped during import.</li>
      </ul>
    </Box>
    <Box display="flex" gap={2} mt={2} justifyContent="center">
      <Button variant="outlined" onClick={onBack} sx={{ minWidth: 120 }}>
        Back
      </Button>
      <Button
        variant="contained"
        onClick={onNext}
        sx={{
          bgcolor: '#CD1B78',
          minWidth: 120,
          '&:hover': { bgcolor: '#ad1766' },
        }}
      >
        Next
      </Button>
    </Box>
  </>
);

export default ImportStepProgress;
