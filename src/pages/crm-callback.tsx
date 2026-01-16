import { Box, CircularProgress, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

/**
 * OAuth Callback Page for CRM Integration
 *
 * This page receives the OAuth redirect from HubSpot/Salesforce,
 * sends a postMessage to the parent window (ConnectCRMModal popup),
 * and automatically closes itself.
 *
 * URL Parameters:
 * - crm_connected: Success case (e.g., "hubspot" or "salesforce")
 * - crm_error: Error case with error message
 */
const CRMCallbackPage: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const { crm_connected, crm_error } = router.query;

    if (crm_connected) {
      // Success - notify parent window
      if (window.opener) {
        window.opener.postMessage(
          {
            type: 'crm-oauth-success',
            crm_type: crm_connected,
          },
          window.location.origin
        );
      }

      // Close popup after 500ms
      setTimeout(() => {
        window.close();
      }, 500);
    } else if (crm_error) {
      // Error - notify parent window
      if (window.opener) {
        window.opener.postMessage(
          {
            type: 'crm-oauth-error',
            error: crm_error,
          },
          window.location.origin
        );
      }

      // Close popup after 2 seconds (give user time to see error)
      setTimeout(() => {
        window.close();
      }, 2000);
    }
  }, [router.query]);

  const { crm_connected, crm_error } = router.query;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #F9FAFB 0%, #F3F4F6 100%)',
        p: 3,
      }}
    >
      <Box sx={{ textAlign: 'center' }}>
        {crm_connected ? (
          <>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
              }}
            >
              <Typography fontSize="48px">✓</Typography>
            </Box>
            <Typography variant="h5" fontWeight={700} color="#111827" mb={1}>
              {crm_connected === 'hubspot' ? 'HubSpot' : 'Salesforce'} Connected!
            </Typography>
            <Typography variant="body1" color="#6B7280" mb={3}>
              Successfully connected your CRM. Closing window...
            </Typography>
          </>
        ) : crm_error ? (
          <>
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #EF4444 0%, #DC2626 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                boxShadow: '0 8px 24px rgba(239, 68, 68, 0.3)',
              }}
            >
              <Typography fontSize="48px" color="#fff">
                ✕
              </Typography>
            </Box>
            <Typography variant="h5" fontWeight={700} color="#111827" mb={1}>
              Connection Failed
            </Typography>
            <Typography variant="body1" color="#6B7280" mb={1}>
              {crm_error}
            </Typography>
            <Typography variant="body2" color="#9CA3AF">
              Closing window...
            </Typography>
          </>
        ) : (
          <>
            <CircularProgress size={60} sx={{ color: '#7C3AED', mb: 3 }} />
            <Typography variant="h5" fontWeight={700} color="#111827" mb={1}>
              Processing CRM Connection
            </Typography>
            <Typography variant="body1" color="#6B7280">
              Please wait while we complete the connection...
            </Typography>
          </>
        )}
      </Box>
    </Box>
  );
};

export default CRMCallbackPage;
