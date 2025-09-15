import { CloudUpload } from '@mui/icons-material';
import { Box, Paper, Typography } from '@mui/material';

interface FileUploadProps {
  file: File | null;
  setFile: (file: File | null) => void;
}

const UploadCard = ({ file, setFile }: FileUploadProps) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
  };

  return (
    <Box>
      <Typography variant="body2" sx={{ fontWeight: 500, color: '#374151', mb: 1 }}>
        Upload File (optional)
      </Typography>

      <Paper
        sx={{
          border: '2px dashed #d1d5db',
          borderRadius: 1,
          p: 4,
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'border-color 0.2s',
          '&:hover': {
            borderColor: '#9ca3af',
          },
        }}
      >
        <input type="file" onChange={handleFileChange} style={{ display: 'none' }} id="file-upload" accept=".pdf,.doc,.docx,.txt" />

        <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                backgroundColor: '#fce4ec',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <CloudUpload sx={{ fontSize: 24, color: '#e91e63' }} />
            </Box>

            <Typography variant="body2">
              <Typography component="span" sx={{ color: '#e91e63', fontWeight: 500 }}>
                Drag, Drop or Browse
              </Typography>
            </Typography>

            {file && (
              <Typography variant="caption" sx={{ color: '#6b7280', mt: 1 }}>
                Selected: {file.name}
              </Typography>
            )}
          </Box>
        </label>

        <Box sx={{ mt: 2 }}>
          <Typography variant="caption" sx={{ color: '#9ca3af', display: 'block' }}>
            Supported Format: PDF
          </Typography>
          <Typography variant="caption" sx={{ color: '#9ca3af' }}>
            Maximum Size: 2MB
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
};

export default UploadCard;
