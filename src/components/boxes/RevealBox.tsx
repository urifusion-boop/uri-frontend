import { useLeadTrackingHook } from '@/hooks/leads-tracking/leadsTracking.hook';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import VerifiedIcon from '@mui/icons-material/Verified';
import { Box, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import Spinner from '../loaders/Spinner';

const RevealBox = ({ type, value, leadIds }: { type: 'email' | 'phone'; value?: string; leadIds?: string[] }) => {
  const [revealed, setRevealed] = useState<boolean>(!!value);
  const { enrichLead, isEnrichingLead } = useLeadTrackingHook('leads');

  useEffect(() => {
    if (value) setRevealed(true);
  }, [value]);

  const handleReveal = () => {
    if (revealed || !leadIds || leadIds.length === 0) return;

    enrichLead({
      lead_ids: leadIds,
      reveal_email: type === 'email',
      reveal_phone: type === 'phone',
      webhook_url: '',
    });
  };

  if (isEnrichingLead) return <Spinner color="primary" />;

  return (
    <Box
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        px: 2,
        py: 1,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        cursor: revealed ? 'default' : 'pointer',
        backgroundColor: '#f8f8f8',
      }}
      onClick={handleReveal}
    >
      {type === 'email' ? <EmailIcon fontSize="small" /> : <PhoneIcon fontSize="small" />}

      <Typography fontWeight={400}>{revealed ? value || 'N/A' : `Access ${type === 'email' ? 'email' : 'mobile'}`}</Typography>

      {revealed && value && <VerifiedIcon fontSize="small" color="success" />}
    </Box>
  );
};

export default RevealBox;
