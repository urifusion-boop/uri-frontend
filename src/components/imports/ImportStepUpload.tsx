import useLeadsImport from '@/hooks/import/leadsImport.hook';
import { useAuth } from '@/providers/AuthProvider';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { Box, Button, Typography } from '@mui/material';
import React, { useState } from 'react';
import CustomButton from '../atoms/CustomButton';

interface ImportStepUploadProps {
  onFileSelect: (file: File) => void;
  onBack: () => void;
}

const ImportStepUpload: React.FC<ImportStepUploadProps> = ({ onFileSelect, onBack }) => {
  const { userDetails } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { uploadLeadsFile } = useLeadsImport();

  const handleBrowse = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    input.onchange = async (e: any) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) {
        setFile(selectedFile);
        await handleUpload(selectedFile);
      }
    };
    input.click();
  };

  const handleUpload = async (selectedFile: File) => {
    if (!userDetails?.userId) return;

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setUploading(true);
      await uploadLeadsFile.mutateAsync({
        userId: userDetails.userId,
        formData,
      });
      onFileSelect(selectedFile);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Typography align="center" fontWeight={700} fontSize={28} mt={2} mb={1}>
        Import <span style={{ color: '#CD1B78' }}>Leads</span>
      </Typography>
      <Typography align="center" color="#65676B" fontSize={16} mb={3}>
        Already have lead data? Upload your spreadsheet to bring them into your dashboard and manage them easily.
      </Typography>

      <Box
        sx={{
          border: '1.5px dashed #CD1B78',
          borderRadius: '14px',
          p: 3,
          my: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          bgcolor: '#fafbfc',
          width: '600px',
        }}
      >
        <InsertDriveFileIcon sx={{ fontSize: 38, color: '#CD1B78', mb: 1 }} />
        <Typography color="#232323" fontSize={15}>
          Drag, Drop or{' '}
          <span
            style={{
              color: '#CD1B78',
              cursor: 'pointer',
              fontWeight: 500,
              textDecoration: 'underline',
            }}
            onClick={handleBrowse}
          >
            Browse
          </span>
        </Typography>
        <Typography fontSize={12} color="#65676B">
          Only .csv, .xlsx, and .xls file types are supported.
        </Typography>
      </Box>

      <Typography fontSize={11} color="#7B7B7B" mb={2}>
        Maximum Size: 2MB
      </Typography>

      <Box mb={3}>
        <Box display="flex" alignItems="center" mb={1}>
          <InfoOutlinedIcon sx={{ color: '#CD1B78', mr: 0.5, fontSize: 20 }} />
          <Typography fontWeight={600} fontSize={15}>
            Note
          </Typography>
        </Box>
        <ul style={{ margin: 0, paddingLeft: 24 }}>
          <li style={{ color: '#CD1B78', fontSize: 14, marginBottom: 3, listStyle: 'disc', textAlign: 'left' }}>Email is required for each lead.</li>
          <li style={{ color: '#CD1B78', fontSize: 14, marginBottom: 3, listStyle: 'disc', textAlign: 'left' }}>Make sure there are no empty header cells.</li>
          <li style={{ color: '#CD1B78', fontSize: 14, marginBottom: 3, listStyle: 'disc', textAlign: 'left' }}>Invalid or duplicate leads will be skipped during import.</li>
        </ul>
      </Box>

      <Box display="flex" gap={2} mt={2} justifyContent="center">
        <Button variant="outlined" onClick={onBack} sx={{ minWidth: 120 }}>
          Back
        </Button>
        <CustomButton mode="primary" style={{ minWidth: 120 }} onClick={handleBrowse} loading={uploadLeadsFile.isLoading} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Next'}
        </CustomButton>
      </Box>
    </>
  );
};

export default ImportStepUpload;
