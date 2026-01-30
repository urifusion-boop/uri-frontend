import { LazarusService } from '@/api/LazarusService';
import { CompanyMonitorCreate } from '@/types/lazarus.types';
import AddIcon from '@mui/icons-material/Add';
import BusinessIcon from '@mui/icons-material/Business';
import CloseIcon from '@mui/icons-material/Close';
import { Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Typography } from '@mui/material';
import { useState } from 'react';

interface AddCompanyMonitorModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  onSuccess: () => void;
}

const AddCompanyMonitorModal = ({ open, onClose, userId, onSuccess }: AddCompanyMonitorModalProps) => {
  const [companyName, setCompanyName] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAddKeyword = () => {
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword));
  };

  const handleSubmit = async () => {
    if (!companyName.trim()) {
      setError('Company name is required');
      return;
    }

    if (!websiteUrl.trim()) {
      setError('Website URL is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const monitorData: CompanyMonitorCreate = {
        company_name: companyName.trim(),
        website_url: websiteUrl.trim(),
        industry_keywords: keywords,
      };

      const response = await LazarusService.addCompanyMonitor(userId, monitorData);

      if (response.status) {
        onSuccess();
        handleClose();
      } else {
        setError(response.responseMessage || 'Failed to add company monitor');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add company monitor');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setCompanyName('');
    setWebsiteUrl('');
    setKeywords([]);
    setKeywordInput('');
    setError('');
    onClose();
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
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 3px 10px rgba(16, 185, 129, 0.3)',
              }}
            >
              <BusinessIcon sx={{ color: '#fff', fontSize: 20 }} />
            </Box>
            <Typography variant="h6" fontWeight={600}>
              Add Company Monitor
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

          <TextField label="Company Name" placeholder="e.g., Kobo360" fullWidth value={companyName} onChange={(e) => setCompanyName(e.target.value)} required sx={{ mb: 2 }} />

          <TextField
            label="Website URL"
            placeholder="e.g., https://kobo360.com"
            fullWidth
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            required
            helperText="We'll monitor this for 404 errors and content changes"
            sx={{ mb: 2 }}
          />

          <Box sx={{ mb: 2 }}>
            <Typography fontSize="13px" fontWeight={600} color="#374151" mb={1}>
              Industry Keywords (Optional)
            </Typography>
            <Box display="flex" gap={1} mb={1}>
              <TextField
                placeholder="e.g., logistics, fintech, saas"
                fullWidth
                size="small"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddKeyword();
                  }
                }}
              />
              <Button variant="outlined" onClick={handleAddKeyword} startIcon={<AddIcon />} sx={{ minWidth: '100px' }}>
                Add
              </Button>
            </Box>
            <Typography fontSize="11px" color="#6B7280" mb={1}>
              Keywords for Google News monitoring (e.g., "logistics", "fintech")
            </Typography>
            <Box display="flex" gap={0.75} flexWrap="wrap">
              {keywords.map((keyword) => (
                <Chip
                  key={keyword}
                  label={keyword}
                  onDelete={() => handleRemoveKeyword(keyword)}
                  size="small"
                  sx={{
                    background: '#10B981',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '11px',
                  }}
                />
              ))}
              {keywords.length === 0 && (
                <Typography fontSize="11px" color="#9CA3AF" fontStyle="italic">
                  No keywords added yet
                </Typography>
              )}
            </Box>
          </Box>

          <Box
            sx={{
              p: 2,
              background: '#F0FDF4',
              borderRadius: '10px',
              border: '1px solid #D1FAE5',
            }}
          >
            <Typography fontSize="12px" color="#10B981" fontWeight={600} mb={0.5}>
              WHAT WE MONITOR
            </Typography>
            <Typography fontSize="11px" color="#666" lineHeight={1.6}>
              • <strong>Hiring Sprees:</strong> Detect when they add 3+ new job openings
              <br />• <strong>Cash Injection:</strong> Google News for funding announcements
              <br />• <strong>Strategic Pivots:</strong> New product launches or expansions
              <br />• <strong>Company Health:</strong> Website 404 detection (company dead)
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} variant="outlined" sx={{ textTransform: 'none' }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !companyName.trim() || !websiteUrl.trim()}
          sx={{
            background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
            },
          }}
        >
          {loading ? 'Adding...' : 'Add to Watchlist'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCompanyMonitorModal;
