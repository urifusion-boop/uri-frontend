import { LazarusService } from '@/api/LazarusService';
import { FocusContactCreate } from '@/types/lazarus.types';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import { Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Typography } from '@mui/material';
import { useState } from 'react';

interface AddFocusContactModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  onSuccess: () => void;
}

const AddFocusContactModal = ({ open, onClose, userId, onSuccess }: AddFocusContactModalProps) => {
  const [name, setName] = useState('');
  const [socialHandle, setSocialHandle] = useState('');
  const [bioText, setBioText] = useState('');
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
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    if (keywords.length === 0) {
      setError('At least one industry keyword is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const contactData: FocusContactCreate = {
        name: name.trim(),
        social_handle: socialHandle.trim() || undefined,
        last_bio_text: bioText.trim() || undefined,
        industry_keywords: keywords,
      };

      const response = await LazarusService.addFocusContact(userId, contactData);

      if (response.status) {
        onSuccess();
        handleClose();
      } else {
        setError(response.responseMessage || 'Failed to add focus contact');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add focus contact');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setName('');
    setSocialHandle('');
    setBioText('');
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
                background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 3px 10px rgba(59, 130, 246, 0.3)',
              }}
            >
              <PersonIcon sx={{ color: '#fff', fontSize: 20 }} />
            </Box>
            <Typography variant="h6" fontWeight={600}>
              Add Focus Contact
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

          <TextField label="Name" placeholder="e.g., Emeka Okonkwo" fullWidth value={name} onChange={(e) => setName(e.target.value)} required sx={{ mb: 2 }} />

          <TextField
            label="Social Handle (Optional)"
            placeholder="e.g., @emeka_tech or twitter.com/emeka_tech"
            fullWidth
            value={socialHandle}
            onChange={(e) => setSocialHandle(e.target.value)}
            helperText="Twitter/X handle for monitoring job changes"
            sx={{ mb: 2 }}
          />

          <TextField
            label="Current Bio (Optional)"
            placeholder="e.g., Head of Ops @ Kobo360"
            fullWidth
            multiline
            rows={2}
            value={bioText}
            onChange={(e) => setBioText(e.target.value)}
            helperText="We'll track changes to detect job moves"
            sx={{ mb: 2 }}
          />

          <Box sx={{ mb: 2 }}>
            <Typography fontSize="13px" fontWeight={600} color="#374151" mb={1}>
              Industry Keywords *
            </Typography>
            <Box display="flex" gap={1} mb={1}>
              <TextField
                placeholder="e.g., logistics, inverter, diesel"
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
              Keywords to monitor for buying intent (e.g., "logistics", "solar", "CRM")
            </Typography>
            <Box display="flex" gap={0.75} flexWrap="wrap">
              {keywords.map((keyword) => (
                <Chip
                  key={keyword}
                  label={keyword}
                  onDelete={() => handleRemoveKeyword(keyword)}
                  size="small"
                  sx={{
                    background: '#3B82F6',
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
              background: '#F0F4FF',
              borderRadius: '10px',
              border: '1px solid #E0E7FF',
            }}
          >
            <Typography fontSize="12px" color="#6366F1" fontWeight={600} mb={0.5}>
              HOW IT WORKS
            </Typography>
            <Typography fontSize="11px" color="#666" lineHeight={1.6}>
              • Weekly scans for job changes via bio updates
              <br />
              • Monitors tweets for pain signals & buying intent
              <br />• Alerts you when they're ready to buy again
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
          disabled={loading || !name.trim() || keywords.length === 0}
          sx={{
            background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
            textTransform: 'none',
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #2563EB 0%, #3B82F6 100%)',
            },
          }}
        >
          {loading ? 'Adding...' : 'Add to Watchlist'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddFocusContactModal;
