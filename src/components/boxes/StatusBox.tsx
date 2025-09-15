import { Box } from '@mui/material';

interface StatusBoxProps {
  label: string;
}

const statusStyleMap: Record<string, { color: string; background: string; border: string }> = {
  Customer: {
    color: '#059669',
    background: 'rgba(16, 185, 129, 0.1)', // emerald-500 with opacity
    border: '1px solid #34D399',
  },
  Qualified: {
    color: '#D97706',
    background: 'rgba(251, 191, 36, 0.1)', // amber-500 with opacity
    border: '1px solid #FBBF24',
  },
  Working: {
    color: '#4B5563',
    background: 'rgba(107, 114, 128, 0.1)', // gray-600
    border: '1px solid #9CA3AF',
  },
  Contacted: {
    color: '#374151',
    background: 'rgba(156, 163, 175, 0.15)', // gray-500
    border: '1px solid #D1D5DB',
  },
  'Proposal Sent': {
    color: '#1F2937',
    background: 'rgba(75, 85, 99, 0.1)',
    border: '1px solid #9CA3AF',
  },
  New: {
    color: '#2563EB',
    background: 'rgba(59, 130, 246, 0.1)',
    border: '1px solid #60A5FA',
  },
  Unqualified: {
    color: '#DC2626',
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid #F87171',
  },
  Converted: {
    color: '#10B981',
    background: 'rgba(52, 211, 153, 0.1)',
    border: '1px solid #6EE7B7',
  },
};

const StatusBox = ({ label }: StatusBoxProps) => {
  const styles = statusStyleMap[label] || {
    color: '#6B7280',
    background: 'rgba(209, 213, 219, 0.15)',
    border: '1px solid #E5E7EB',
  };

  return (
    <Box
      sx={{
        display: 'inline-block',
        px: 1.5,
        py: 0.5,
        borderRadius: '9999px',
        fontSize: '13px',
        fontWeight: 800,
        color: styles.color,
        backgroundColor: styles.background,
        border: styles.border,
        textAlign: 'center',
        minWidth: '90px',
      }}
    >
      {label}
    </Box>
  );
};

export default StatusBox;
