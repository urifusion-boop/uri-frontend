import BusinessIcon from '@mui/icons-material/Business';
import LinkIcon from '@mui/icons-material/Link';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import { Alert, Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from '@mui/material';
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

      // LinkedIn Profile Detection
      if (hostname.includes('linkedin.com')) {
        // Pattern: linkedin.com/in/{handle}
        const linkedinMatch = pathname.match(/\/in\/([^\/\?]+)/);
        if (linkedinMatch) {
          const handle = linkedinMatch[1];
          // Convert linkedin-handle to readable name
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

      // Twitter/X Profile Detection
      if (hostname.includes('twitter.com') || hostname.includes('x.com')) {
        // Pattern: twitter.com/{handle} or x.com/{handle}
        const twitterMatch = pathname.match(/\/([^\/\?]+)/);
        if (twitterMatch) {
          const handle = twitterMatch[1].replace('@', '');

          // Exclude non-profile paths
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

      // Company Website Detection (fallback for any valid URL)
      // Extract clean domain name
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
        // Create Focus Contact
        const contactData = {
          name: parsedData.name || 'Unknown',
          social_handle: parsedData.handle,
          industry_keywords: [],
        };

        await LazarusService.addFocusContact(userId, contactData);
      } else if (parsedData.type === 'website') {
        // Create Company Monitor
        const monitorData = {
          company_name: parsedData.name || 'Unknown Company',
          website_url: parsedData.url,
          industry_keywords: [],
        };

        await LazarusService.addCompanyMonitor(userId, monitorData);
      }

      // Success
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
        return <BusinessIcon sx={{ color: '#4CAF50' }} />;
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
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LinkIcon />
          <Typography variant="h6">Paste & Go</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Paste a LinkedIn, Twitter, or company website URL to quickly add a monitor
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
          {/* URL Input */}
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
            helperText="Supported: LinkedIn profiles, Twitter/X profiles, company websites"
            InputProps={{
              endAdornment: (
                <Button onClick={handleParse} disabled={loading || !url.trim()} size="small" sx={{ minWidth: 'auto' }}>
                  Parse
                </Button>
              ),
            }}
          />

          {/* Error Display */}
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* Parsed Data Preview */}
          {parsedData && (
            <Box
              sx={{
                p: 2.5,
                borderRadius: '12px',
                border: '1px solid',
                borderColor: 'divider',
                bgcolor: 'background.paper',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: 'action.hover',
                  }}
                >
                  {getIcon()}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {parsedData.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {parsedData.handle || parsedData.domain}
                  </Typography>
                </Box>
                <Chip label={getMonitorType()} size="small" color="primary" variant="outlined" />
              </Box>

              <Box
                sx={{
                  p: 1.5,
                  borderRadius: '8px',
                  bgcolor: 'action.hover',
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  URL:
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    wordBreak: 'break-all',
                    mt: 0.5,
                  }}
                >
                  {parsedData.url}
                </Typography>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                {parsedData.type === 'linkedin' || parsedData.type === 'twitter'
                  ? '🎯 Will monitor this contact for job changes and pain signals'
                  : '🏢 Will monitor this company for hiring sprees, funding, and pivots'}
              </Typography>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={!parsedData || loading} startIcon={loading ? <CircularProgress size={16} /> : null}>
          {loading ? 'Adding...' : 'Add Monitor'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PasteAndGoModal;
