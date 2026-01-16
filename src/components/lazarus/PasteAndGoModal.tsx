import { LightThemeColors } from '@/configs/colors.config';
import BusinessIcon from '@mui/icons-material/Business';
import CloseIcon from '@mui/icons-material/Close';
import LinkIcon from '@mui/icons-material/Link';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import { Alert, Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { LazarusService } from '../../api/LazarusService';

interface PasteAndGoModalProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  onSuccess?: () => void;
}

interface ParsedURL {
  type: 'linkedin' | 'twitter' | 'website' | 'unknown';
  handle?: string;
  name?: string;
  domain?: string;
  url: string;
}

const PasteAndGoModal: React.FC<PasteAndGoModalProps> = ({ open, onClose, userId, onSuccess }) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [parsedData, setParsedData] = useState<ParsedURL | null>(null);

  const parseURL = (inputUrl: string): ParsedURL | null => {
    try {
      const trimmedUrl = inputUrl.trim();
      const urlObj = new URL(trimmedUrl.startsWith('http') ? trimmedUrl : `https://${trimmedUrl}`);
      const hostname = urlObj.hostname.toLowerCase();
      const pathname = urlObj.pathname;

      if (hostname.includes('linkedin.com')) {
        const linkedinMatch = pathname.match(/\/in\/([^\/\?]+)/);
        if (linkedinMatch) {
          const handle = linkedinMatch[1];
          const name = handle
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

          return {
            type: 'linkedin',
            handle: handle,
            name: name,
            url: trimmedUrl,
          };
        }
      }

      if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
        const twitterMatch = pathname.match(/\/([^\/\?]+)/);
        if (twitterMatch) {
          const handle = twitterMatch[1].replace('@', '');

          if (!['home', 'explore', 'notifications', 'messages', 'i'].includes(handle)) {
            return {
              type: 'twitter',
              handle: `@${handle}`,
              name: handle,
              url: trimmedUrl,
            };
          }
        }
      }

      const domainParts = hostname.replace('www.', '').split('.');
      const companyName = domainParts[0].charAt(0).toUpperCase() + domainParts[0].slice(1);

      return {
        type: 'website',
        domain: hostname.replace('www.', ''),
        name: companyName,
        url: trimmedUrl,
      };
    } catch (e) {
      return null;
    }
  };

  const handleParse = () => {
    setError(null);
    setParsedData(null);

    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    const parsed = parseURL(url);

    if (!parsed) {
      setError('Invalid URL. Please enter a valid LinkedIn, Twitter, or website URL.');
      return;
    }

    setParsedData(parsed);
  };

  const handleSubmit = async () => {
    if (!parsedData) return;

    setLoading(true);
    setError(null);

    try {
      if (parsedData.type === 'linkedin' || parsedData.type === 'twitter') {
        const contactData = {
          name: parsedData.name || 'Unknown',
          social_handle: parsedData.handle,
          industry_keywords: [],
        };

        await LazarusService.addFocusContact(userId, contactData);
      } else if (parsedData.type === 'website') {
        const monitorData = {
          company_name: parsedData.name || 'Unknown Company',
          website_url: parsedData.url,
          industry_keywords: [],
        };

        await LazarusService.addCompanyMonitor(userId, monitorData);
      }

      if (onSuccess) onSuccess();
      handleClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add monitor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setUrl('');
    setParsedData(null);
    setError(null);
    onClose();
  };

  const getIcon = () => {
    if (!parsedData) return <LinkIcon />;
    switch (parsedData.type) {
      case 'linkedin':
        return <LinkedInIcon sx={{ color: '#0077B5' }} />;
      case 'twitter':
        return <TwitterIcon sx={{ color: '#1DA1F2' }} />;
      case 'website':
        return <BusinessIcon sx={{ color: LightThemeColors.primary }} />;
      default:
        return <LinkIcon />;
    }
  };

  const getMonitorType = () => {
    if (!parsedData) return '';
    if (parsedData.type === 'linkedin' || parsedData.type === 'twitter') {
      return 'Focus Contact';
    }
    return 'Company Monitor';
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: '12px' } }}>
      <DialogTitle sx={{ pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
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
              <LinkIcon sx={{ color: '#fff', fontSize: 18 }} />
            </Box>
            <Typography variant="h6" fontWeight={600} fontSize="16px" color={LightThemeColors.blackWhite}>
              Paste & Go
            </Typography>
          </Box>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
        <Typography variant="body2" color={LightThemeColors.secondary} sx={{ mt: 1, fontSize: '13px' }}>
          Paste a LinkedIn, Twitter, or company website URL
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            fullWidth
            label="Paste URL"
            placeholder="https://linkedin.com/in/john-doe"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleParse();
              }
            }}
            disabled={loading}
            size="small"
            helperText="LinkedIn, Twitter/X, or company website"
            InputProps={{
              endAdornment: (
                <Button onClick={handleParse} disabled={loading || !url.trim()} size="small" sx={{ minWidth: 'auto', color: LightThemeColors.primary }}>
                  Parse
                </Button>
              ),
            }}
          />

          {error && (
            <Alert severity="error" onClose={() => setError(null)} sx={{ fontSize: '13px' }}>
              {error}
            </Alert>
          )}

          {parsedData && (
            <Box
              sx={{
                p: 2,
                borderRadius: '10px',
                border: `1px solid ${LightThemeColors.borderColor}`,
                bgcolor: LightThemeColors.background,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#fff',
                    border: `1px solid ${LightThemeColors.borderColor}`,
                  }}
                >
                  {getIcon()}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight={600} fontSize="14px" color={LightThemeColors.blackWhite}>
                    {parsedData.name}
                  </Typography>
                  <Typography variant="body2" color={LightThemeColors.secondary} fontSize="12px">
                    {parsedData.handle || parsedData.domain}
                  </Typography>
                </Box>
                <Chip label={getMonitorType()} size="small" sx={{ bgcolor: `${LightThemeColors.primary}15`, color: LightThemeColors.primary, fontWeight: 600, fontSize: '11px' }} />
              </Box>

              <Box
                sx={{
                  p: 1.5,
                  borderRadius: '6px',
                  bgcolor: '#fff',
                }}
              >
                <Typography variant="caption" color={LightThemeColors.secondary} fontSize="11px">
                  URL:
                </Typography>
                <Typography
                  variant="body2"
                  fontSize="12px"
                  color={LightThemeColors.blackWhite}
                  sx={{
                    wordBreak: 'break-all',
                    mt: 0.5,
                  }}
                >
                  {parsedData.url}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          sx={{
            textTransform: 'none',
            fontSize: '13px',
            color: LightThemeColors.secondary,
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!parsedData || loading}
          startIcon={loading ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : null}
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
          {loading ? 'Adding...' : 'Add Monitor'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PasteAndGoModal;
