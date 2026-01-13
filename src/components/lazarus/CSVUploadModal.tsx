import { LazarusService } from '@/api/LazarusService';
import { CSVUploadRow, LazarusMonitorType } from '@/types/lazarus.types';
import CloseIcon from '@mui/icons-material/Close';
import DescriptionIcon from '@mui/icons-material/Description';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, LinearProgress, Link, Typography } from '@mui/material';
import { useState } from 'react';

interface CSVUploadModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  onSuccess: () => void;
}

const CSVUploadModal = ({ open, onClose, userId, onSuccess }: CSVUploadModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadResult, setUploadResult] = useState<{
    added_count: number;
    failed_count: number;
    errors: string[];
  } | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        setError('Please select a valid CSV file');
        return;
      }
      setFile(selectedFile);
      setError('');
      setUploadResult(null);
    }
  };

  const parseCSV = (csvText: string): CSVUploadRow[] => {
    const lines = csvText.split('\n');
    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());

    const rows: CSVUploadRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(',').map((v) => v.trim());
      const row: Partial<CSVUploadRow> = {};

      headers.forEach((header, index) => {
        const value = values[index]?.replace(/^["']|["']$/g, ''); // Remove quotes

        if (header === 'company' || header === 'company_name') {
          row.name = value;
          row.type = LazarusMonitorType.COMPANY;
        } else if (header === 'website' || header === 'website_url') {
          row.website_url = value;
        } else if (header === 'contact' || header === 'contact_name' || header === 'name') {
          row.name = value;
          row.type = LazarusMonitorType.FOCUS_CONTACT;
        } else if (header === 'social_handle' || header === 'handle' || header === 'twitter') {
          row.social_handle = value;
        }
      });

      if (row.name && row.type) {
        rows.push(row as CSVUploadRow);
      }
    }

    return rows;
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const fileText = await file.text();
      const csvRows = parseCSV(fileText);

      if (csvRows.length === 0) {
        setError('No valid data found in CSV file');
        setLoading(false);
        return;
      }

      const response = await LazarusService.bulkUploadCSV(userId, csvRows);

      if (response.status) {
        setUploadResult(response.responseData as any);
        onSuccess();

        // Auto-close after 3 seconds if all succeeded
        if (response.responseData?.failed_count === 0) {
          setTimeout(() => {
            handleClose();
          }, 3000);
        }
      } else {
        setError(response.responseMessage || 'Upload failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setError('');
    setUploadResult(null);
    onClose();
  };

  const downloadTemplate = () => {
    const template =
      'Company,Website,Contact Name,Social Handle\n' + 'Kobo360,https://kobo360.com,Emeka Okonkwo,@emeka_tech\n' + 'Moniepoint,,Chinedu Echeruo,@chinedu\n' + ',https://example.com,Jane Doe,@janedoe';

    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lazarus_template.csv';
    a.click();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1.5}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 3px 10px rgba(124, 58, 237, 0.3)',
              }}
            >
              <UploadFileIcon sx={{ color: '#fff', fontSize: 20 }} />
            </Box>
            <Typography variant="h6" fontWeight={600}>
              CSV Bulk Upload
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {uploadResult && (
            <Alert severity={uploadResult.failed_count === 0 ? 'success' : 'warning'} sx={{ mb: 2 }}>
              <Typography fontSize="13px" fontWeight={600} mb={0.5}>
                Upload Complete!
              </Typography>
              <Typography fontSize="12px">
                ✅ {uploadResult.added_count} added successfully
                <br />
                {uploadResult.failed_count > 0 && `❌ ${uploadResult.failed_count} failed`}
              </Typography>
              {uploadResult.errors.length > 0 && (
                <Box mt={1}>
                  <Typography fontSize="11px" color="error">
                    Errors:
                    {uploadResult.errors.slice(0, 3).map((err, i) => (
                      <div key={i}>• {err}</div>
                    ))}
                  </Typography>
                </Box>
              )}
            </Alert>
          )}

          <Box
            sx={{
              p: 3,
              border: '2px dashed #E5E7EB',
              borderRadius: '12px',
              textAlign: 'center',
              background: file ? '#F9FAFB' : '#FAFBFC',
              mb: 2,
            }}
          >
            {file ? (
              <Box>
                <DescriptionIcon sx={{ fontSize: 48, color: '#7C3AED', mb: 1 }} />
                <Typography fontSize="14px" fontWeight={600} color="#374151">
                  {file.name}
                </Typography>
                <Typography fontSize="12px" color="#6B7280" mt={0.5}>
                  {(file.size / 1024).toFixed(2)} KB
                </Typography>
                <Button size="small" onClick={() => setFile(null)} sx={{ mt: 1, textTransform: 'none', fontSize: '12px' }}>
                  Remove
                </Button>
              </Box>
            ) : (
              <Box>
                <UploadFileIcon sx={{ fontSize: 48, color: '#D1D5DB', mb: 1 }} />
                <Typography fontSize="14px" fontWeight={600} color="#374151" mb={0.5}>
                  Drop CSV file here
                </Typography>
                <Typography fontSize="12px" color="#6B7280" mb={2}>
                  or click to browse
                </Typography>
                <Button variant="outlined" component="label" sx={{ textTransform: 'none', fontSize: '13px' }}>
                  Select File
                  <input type="file" hidden accept=".csv" onChange={handleFileSelect} />
                </Button>
              </Box>
            )}
          </Box>

          <Box
            sx={{
              p: 2,
              background: '#FFFBEB',
              borderRadius: '10px',
              border: '1px solid #FDE68A',
              mb: 2,
            }}
          >
            <Typography fontSize="12px" fontWeight={600} color="#92400E" mb={1}>
              CSV FORMAT
            </Typography>
            <Typography fontSize="11px" color="#666" lineHeight={1.6} mb={1}>
              Your CSV should have these columns:
              <br />• <strong>Company</strong> - Company name (for company monitors)
              <br />• <strong>Website</strong> - Company website URL
              <br />• <strong>Contact Name</strong> - Individual name (for focus contacts)
              <br />• <strong>Social Handle</strong> - Twitter/X handle
            </Typography>
            <Link
              onClick={downloadTemplate}
              sx={{
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                color: '#7C3AED',
              }}
            >
              Download Template CSV
            </Link>
          </Box>

          {loading && (
            <Box>
              <Typography fontSize="12px" color="#6B7280" mb={1}>
                Uploading...
              </Typography>
              <LinearProgress />
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} variant="outlined" sx={{ textTransform: 'none' }}>
          {uploadResult ? 'Close' : 'Cancel'}
        </Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          disabled={loading || !file || !!uploadResult}
          sx={{
            background: 'linear-gradient(135deg, #7C3AED 0%, #5B21B6 100%)',
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #5B21B6 0%, #7C3AED 100%)',
            },
          }}
        >
          {loading ? 'Uploading...' : 'Upload CSV'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CSVUploadModal;
