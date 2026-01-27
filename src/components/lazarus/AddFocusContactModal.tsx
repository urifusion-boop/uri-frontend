import { LazarusService } from '@/api/LazarusService';
import { FocusContactCreate } from '@/types/lazarus.types';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import { Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

interface AddFocusContactModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  onSuccess: () => void;
  initialData?: {
    name?: string;
    socialHandle?: string;
    company?: string;
    role?: string;
  };
  editMode?: boolean;
  contactId?: string;
  existingContact?: {
    name: string;
    social_handle?: string;
    last_bio_text?: string;
    industry_keywords: string[];
  };
}

const AddFocusContactModal = ({ open, onClose, userId, onSuccess, initialData, editMode = false, contactId, existingContact }: AddFocusContactModalProps) => {
  const [name, setName] = useState(initialData?.name || '');
  const [socialHandle, setSocialHandle] = useState(initialData?.socialHandle || '');
  const [bioText, setBioText] = useState('');
  const [keywordInput, setKeywordInput] = useState('');
  const [keywords, setKeywords] = useState<string[]>(initialData?.company ? [initialData.company] : []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Update form when initialData or existingContact changes
  useEffect(() => {
    if (open) {
      if (editMode && existingContact) {
        // Editing existing contact
        setName(existingContact.name);
        setSocialHandle(existingContact.social_handle || '');
        setBioText(existingContact.last_bio_text || '');
        setKeywords(existingContact.industry_keywords || []);
      } else if (initialData) {
        // Adding new contact from lead data
        setName(initialData.name || '');
        setSocialHandle(initialData.socialHandle || '');
        const initialKeywords = [];
        if (initialData.company) initialKeywords.push(initialData.company);
        if (initialData.role) initialKeywords.push(initialData.role);
        setKeywords(initialKeywords);
      }
    }
  }, [open, initialData, editMode, existingContact]);

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

      let response;
      if (editMode && contactId) {
        // Update existing contact
        response = await LazarusService.updateFocusContact(userId, contactId, contactData);
      } else {
        // Add new contact
        response = await LazarusService.addFocusContact(userId, contactData);
      }

      if (response.status) {
        onSuccess();
        handleClose();
      } else {
        setError(response.responseMessage || `Failed to ${editMode ? 'update' : 'add'} focus contact`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || `Failed to ${editMode ? 'update' : 'add'} focus contact`);
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
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(201, 26, 121, 0.15)',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1.5}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #C91A79 0%, #A01560 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(201, 26, 121, 0.4)',
              }}
            >
              <PersonIcon sx={{ color: '#fff', fontSize: 24 }} />
            </Box>
            <Box>
              <Typography variant="h6" fontWeight={700} color="#1A1A1A" letterSpacing="-0.02em">
                {editMode ? 'Edit Focus Contact' : 'Add Focus Contact'}
              </Typography>
              <Typography fontSize="12px" color="#6B7280" fontWeight={500}>
                Monitor for buying signals & job changes
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{
              color: '#9CA3AF',
              '&:hover': {
                backgroundColor: '#FFF5FA',
                color: '#C91A79',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 3 }}>
        <Box sx={{ pt: 1 }}>
          {error && (
            <Alert
              severity="error"
              sx={{
                mb: 3,
                borderRadius: '12px',
                backgroundColor: '#FEF2F2',
                border: '1px solid #FEE2E2',
                '& .MuiAlert-icon': { color: '#EF4444' },
              }}
            >
              {error}
            </Alert>
          )}

          <TextField
            label="Name"
            placeholder="e.g., Emeka Okonkwo"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            sx={{
              mb: 2.5,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                '&:hover fieldset': { borderColor: '#C91A79' },
                '&.Mui-focused fieldset': { borderColor: '#C91A79' },
              },
              '& .MuiInputLabel-root.Mui-focused': { color: '#C91A79' },
            }}
          />

          <TextField
            label="Social Handle (Optional)"
            placeholder="e.g., @emeka_tech or twitter.com/emeka_tech"
            fullWidth
            value={socialHandle}
            onChange={(e) => setSocialHandle(e.target.value)}
            helperText="Twitter/X handle for monitoring job changes"
            sx={{
              mb: 2.5,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                '&:hover fieldset': { borderColor: '#C91A79' },
                '&.Mui-focused fieldset': { borderColor: '#C91A79' },
              },
              '& .MuiInputLabel-root.Mui-focused': { color: '#C91A79' },
              '& .MuiFormHelperText-root': { fontSize: '11px', color: '#6B7280' },
            }}
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
            sx={{
              mb: 2.5,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                '&:hover fieldset': { borderColor: '#C91A79' },
                '&.Mui-focused fieldset': { borderColor: '#C91A79' },
              },
              '& .MuiInputLabel-root.Mui-focused': { color: '#C91A79' },
              '& .MuiFormHelperText-root': { fontSize: '11px', color: '#6B7280' },
            }}
          />

          <Box sx={{ mb: 3 }}>
            <Typography fontSize="13px" fontWeight={700} color="#1A1A1A" mb={1.5}>
              Industry Keywords{' '}
              <Box component="span" sx={{ color: '#C91A79' }}>
                *
              </Box>
            </Typography>
            <Box display="flex" gap={1} mb={1.5}>
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
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '10px',
                    '&:hover fieldset': { borderColor: '#C91A79' },
                    '&.Mui-focused fieldset': { borderColor: '#C91A79' },
                  },
                }}
              />
              <Button
                variant="outlined"
                onClick={handleAddKeyword}
                startIcon={<AddIcon />}
                sx={{
                  minWidth: '100px',
                  borderRadius: '10px',
                  borderColor: '#C91A79',
                  color: '#C91A79',
                  textTransform: 'none',
                  fontWeight: 600,
                  '&:hover': {
                    borderColor: '#A01560',
                    backgroundColor: '#FFF5FA',
                  },
                }}
              >
                Add
              </Button>
            </Box>
            <Typography fontSize="11px" color="#6B7280" mb={1.5} fontWeight={500}>
              Keywords to monitor for buying intent (e.g., "logistics", "solar", "CRM")
            </Typography>
            <Box
              display="flex"
              gap={0.75}
              flexWrap="wrap"
              sx={{
                p: 2,
                background: '#FAFAFA',
                borderRadius: '12px',
                border: '1px solid #F0F0F0',
                minHeight: '56px',
              }}
            >
              {keywords.map((keyword) => (
                <Chip
                  key={keyword}
                  label={keyword}
                  onDelete={() => handleRemoveKeyword(keyword)}
                  size="small"
                  sx={{
                    background: 'linear-gradient(135deg, #C91A79 0%, #A01560 100%)',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '11px',
                    height: '28px',
                    borderRadius: '8px',
                    '& .MuiChip-deleteIcon': {
                      color: 'rgba(255, 255, 255, 0.8)',
                      '&:hover': { color: '#fff' },
                    },
                  }}
                />
              ))}
              {keywords.length === 0 && (
                <Typography fontSize="12px" color="#9CA3AF" fontStyle="italic" sx={{ py: 0.5 }}>
                  No keywords added yet
                </Typography>
              )}
            </Box>
          </Box>

          <Box
            sx={{
              p: 3,
              background: 'linear-gradient(135deg, #FFF5FA 0%, #FFEBF4 100%)',
              borderRadius: '14px',
              border: '1px solid #FFEBF4',
            }}
          >
            <Typography fontSize="13px" color="#C91A79" fontWeight={700} mb={1} letterSpacing="0.3px">
              HOW IT WORKS
            </Typography>
            <Typography fontSize="12px" color="#6B7280" lineHeight={1.8} fontWeight={500}>
              • Weekly scans for job changes via bio updates
              <br />
              • Monitors tweets for pain signals & buying intent
              <br />• Alerts you when they're ready to buy again
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3, pt: 2, gap: 1.5 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '12px',
            px: 3,
            py: 1.25,
            borderColor: '#E5E7EB',
            color: '#6B7280',
            '&:hover': {
              borderColor: '#D1D5DB',
              backgroundColor: '#F9FAFB',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading || !name.trim() || keywords.length === 0}
          sx={{
            background: 'linear-gradient(135deg, #C91A79 0%, #A01560 100%)',
            textTransform: 'none',
            fontWeight: 700,
            fontSize: '14px',
            borderRadius: '12px',
            px: 4,
            py: 1.25,
            boxShadow: '0 6px 20px rgba(201, 26, 121, 0.35)',
            '&:hover': {
              background: 'linear-gradient(135deg, #A01560 0%, #C91A79 100%)',
              boxShadow: '0 8px 24px rgba(201, 26, 121, 0.45)',
              transform: 'translateY(-1px)',
            },
            '&:disabled': {
              background: '#D1D5DB',
              color: '#9CA3AF',
              boxShadow: 'none',
            },
            transition: 'all 0.2s ease',
          }}
        >
          {loading ? (editMode ? 'Updating...' : 'Adding...') : editMode ? 'Update Contact' : 'Add to Watchlist'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddFocusContactModal;
