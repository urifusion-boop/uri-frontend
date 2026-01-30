import { Box, Typography } from '@mui/material';

const tabOptions = [
  { label: 'Individual Form', value: 'individual', desc: 'Capture people interested in your product or service.' },
  { label: 'Organization Form', value: 'organization', desc: 'Find businesses or organizations interested in your product or service.' },
  { label: 'Business Form', value: 'business', desc: 'Find businesses or organizations interested in your product or service.' },
  { label: 'Sales Signals Form', value: 'conversational', desc: 'Public online conversations indicating buying intent, pain, or opportunity.' },
];

export default function LeadFormTab({ value, onChange }: { value: string; onChange: (val: any) => void }) {
  return (
    <Box display="flex" justifyContent="space-between" flexWrap="wrap" gap={2}>
      {tabOptions.map((tab) => (
        <Box
          key={tab.value}
          onClick={() => onChange(tab.value)}
          sx={{
            cursor: 'pointer',
            border: value === tab.value ? '2px solid #CD1B78' : '1px solid #ddd',
            borderRadius: '8px',
            p: 2,
            flex: '1 1 200px',
            bgcolor: value === tab.value ? '#FFF1F7' : '#fff',
          }}
        >
          <Typography fontWeight="bold" color={value === tab.value ? '#CD1B78' : '#333'}>
            {tab.label}
          </Typography>
          <Typography fontSize="14px" mt={1}>
            {tab.desc}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
