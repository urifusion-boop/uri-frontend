import { LazarusService } from '@/api/LazarusService';
import { LightThemeColors } from '@/configs/colors.config';
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
    const headers = lines[0].split(',').map((h) => h.trim().toLowerCase().replace(/\s+/g, '_'));

    const rows: CSVUploadRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values = line.split(',').map((v) => v.trim());

      // Extract data from CSV columns
      let companyName = '';
      let websiteUrl = '';
      let contactName = '';
      let socialHandle = '';
      let location = '';
      let countryCode = '';
      let scanFrequency = 7; // Default to 7 days
      let keywords: string[] = [];

      headers.forEach((header, index) => {
        const value = values[index]?.replace(/^["']|["']$/g, '');

        if (header === 'company' || header === 'company_name') {
          companyName = value;
        } else if (header === 'website' || header === 'website_url') {
          websiteUrl = value;
        } else if (header === 'contact' || header === 'contact_name' || header === 'name') {
          contactName = value;
        } else if (header === 'social_handle' || header === 'handle' || header === 'twitter') {
          socialHandle = value;
        } else if (header === 'location' || header === 'city' || header === 'country') {
          location = value;
        } else if (header === 'country_code' || header === 'code') {
          countryCode = value.toLowerCase(); // Lowercase for consistency (ng, us, uk)
        } else if (header === 'scan_frequency' || header === 'scan_frequency_days' || header === 'frequency') {
          const parsed = parseInt(value);
          if (!isNaN(parsed) && parsed >= 1 && parsed <= 30) {
            scanFrequency = parsed;
          }
        } else if (header === 'keywords' || header === 'industry_keywords') {
          // Parse keywords - support comma-separated or pipe-separated
          keywords = value
            .split(/[,|;]/)
            .map((k) => k.trim())
            .filter((k) => k.length > 0);
        }
      });

      // Create company monitor entry if company exists
      if (companyName) {
        rows.push({
          type: LazarusMonitorType.COMPANY,
          name: companyName,
          website_url: websiteUrl || undefined,
          location: location || undefined,
          country_code: countryCode || undefined,
          scan_frequency_days: scanFrequency,
          industry_keywords: keywords.length > 0 ? keywords : undefined,
        } as CSVUploadRow);
      }

      // Create focus contact entry if contact exists
      if (contactName) {
        rows.push({
          type: LazarusMonitorType.FOCUS_CONTACT,
          name: contactName,
          social_handle: socialHandle || undefined,
          scan_frequency_days: scanFrequency,
          industry_keywords: keywords.length > 0 ? keywords : undefined,
        } as CSVUploadRow);
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

      console.log('📤 Uploading CSV rows:', csvRows.length, 'rows');
      console.log('📤 Sample row:', csvRows[0]);

      const response = await LazarusService.bulkUploadCSV(userId, csvRows);

      console.log('📥 Upload response:', response);
      console.log('📥 Response data:', response.responseData);

      if (response.status) {
        setUploadResult(response.responseData as any);
        onSuccess();

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
      'Company,Website,Contact Name,Social Handle,Keywords\n' +
      'Kobo360,https://kobo360.com,Emeka Okonkwo,@emeka_tech,"logistics,supply chain,Africa"\n' +
      'Moniepoint,,Chinedu Echeruo,@chinedu,"fintech,payments,banking"\n' +
      ',https://example.com,Jane Doe,@janedoe,"SaaS,marketing,automation"';

    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'lazarus_template.csv';
    a.click();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '12px' } }}>
      <DialogTitle sx={{ pb: 2 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1.5}>
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: '8px',
                background: LightThemeColors.primary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <UploadFileIcon sx={{ color: '#fff', fontSize: 18 }} />
            </Box>
            <Typography variant="h6" fontWeight={600} fontSize="16px" color={LightThemeColors.blackWhite}>
              CSV Bulk Upload
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box>
          {error && (
            <Alert severity="error" sx={{ mb: 2, fontSize: '13px' }}>
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
                {uploadResult.failed_count > 0 && (
                  <>
                    <br />❌ {uploadResult.failed_count} failed
                    {uploadResult.errors && uploadResult.errors.length > 0 && (
                      <Box component="ul" sx={{ mt: 1, pl: 2, fontSize: '11px' }}>
                        {uploadResult.errors.slice(0, 5).map((err: any, idx: number) => (
                          <li key={idx}>
                            {err.name}: {err.error}
                          </li>
                        ))}
                        {uploadResult.errors.length > 5 && <li>...and {uploadResult.errors.length - 5} more</li>}
                      </Box>
                    )}
                  </>
                )}
              </Typography>
            </Alert>
          )}

          <Box
            sx={{
              p: 3,
              border: `2px dashed ${LightThemeColors.borderColor}`,
              borderRadius: '10px',
              textAlign: 'center',
              background: file ? LightThemeColors.background : '#FAFBFC',
              mb: 2,
            }}
          >
            {file ? (
              <Box>
                <DescriptionIcon sx={{ fontSize: 42, color: LightThemeColors.primary, mb: 1 }} />
                <Typography fontSize="14px" fontWeight={600} color={LightThemeColors.blackWhite}>
                  {file.name}
                </Typography>
                <Typography fontSize="12px" color={LightThemeColors.secondary} mt={0.5}>
                  {(file.size / 1024).toFixed(2)} KB
                </Typography>
                <Button size="small" onClick={() => setFile(null)} sx={{ mt: 1, textTransform: 'none', fontSize: '12px', color: LightThemeColors.secondary }}>
                  Remove
                </Button>
              </Box>
            ) : (
              <Box>
                <UploadFileIcon sx={{ fontSize: 42, color: LightThemeColors.secondary, mb: 1 }} />
                <Typography fontSize="14px" fontWeight={600} color={LightThemeColors.blackWhite} mb={0.5}>
                  Drop CSV file here
                </Typography>
                <Typography fontSize="12px" color={LightThemeColors.secondary} mb={2}>
                  or click to browse
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  sx={{
                    textTransform: 'none',
                    fontSize: '13px',
                    borderColor: LightThemeColors.borderColor,
                    color: LightThemeColors.blackWhite,
                    '&:hover': { borderColor: LightThemeColors.primary },
                  }}
                >
                  Select File
                  <input type="file" hidden accept=".csv" onChange={handleFileSelect} />
                </Button>
              </Box>
            )}
          </Box>

          <Box
            sx={{
              p: 2,
              background: `${LightThemeColors.primary}08`,
              borderRadius: '8px',
              border: `1px solid ${LightThemeColors.borderColor}`,
              mb: 2,
            }}
          >
            <Typography fontSize="11px" fontWeight={600} color={LightThemeColors.blackWhite} mb={1}>
              CSV FORMAT
            </Typography>
            <Typography fontSize="11px" color={LightThemeColors.secondary} lineHeight={1.6} mb={1}>
              Columns: <strong>Company</strong>, <strong>Website</strong>, <strong>Contact Name</strong>, <strong>Social Handle</strong>, <strong>Keywords</strong> (comma-separated)
            </Typography>
            <Typography fontSize="10px" color={LightThemeColors.secondary} lineHeight={1.4} mb={1} fontStyle="italic">
              Keywords column is optional but recommended for better monitoring
            </Typography>
            <Link
              onClick={downloadTemplate}
              sx={{
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                color: LightThemeColors.primary,
              }}
            >
              Download Template CSV
            </Link>
          </Box>

          {loading && (
            <Box>
              <Typography fontSize="12px" color={LightThemeColors.secondary} mb={1}>
                Uploading...
              </Typography>
              <LinearProgress sx={{ '& .MuiLinearProgress-bar': { backgroundColor: LightThemeColors.primary } }} />
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            textTransform: 'none',
            fontSize: '13px',
            borderColor: LightThemeColors.borderColor,
            color: LightThemeColors.secondary,
          }}
        >
          {uploadResult ? 'Close' : 'Cancel'}
        </Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          disabled={loading || !file || !!uploadResult}
          sx={{
            background: LightThemeColors.primary,
            textTransform: 'none',
            fontWeight: 600,
            fontSize: '13px',
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
          {loading ? 'Uploading...' : 'Upload CSV'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CSVUploadModal;
