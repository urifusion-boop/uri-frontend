import { Description, Handshake, Place } from '@mui/icons-material';
import { Box, Paper, Typography } from '@mui/material';

interface FormType {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
}

interface FormTypeSelectorProps {
  selectedType: string;
  onTypeSelect: (type: string) => void;
}

const formTypes: FormType[] = [
  // Temporarily hide the Organization Lead Form
  // { id: 'organization', title: 'Organization Lead Form', description: 'Find businesses or companies that may be interested in your products or services, open to collaboration or partnership opportunities.', icon: Handshake },
  {
    id: 'individual',
    title: 'Individual Lead Form',
    description: 'Capture and Follow up with people that may be interested in your products or services, open to collaboration or partnership opportunities.',
    icon: Description,
  },
  {
    id: 'organization',
    title: 'Organization Lead Form',
    description: 'Find businesses or companies that may be interested in your products or services, open to collaboration or partnership opportunities.',
    icon: Handshake,
  },
  {
    id: 'conversational',
    title: 'Sales Signals Form',
    description: 'Public online conversations indicating buying intent, pain, or opportunity.',
    icon: Description,
  },
  {
    id: 'google-maps',
    title: 'Google Maps Form',
    description: 'Discover local businesses through Google Maps based on location, business type, and other criteria.',
    icon: Place,
  },
];

const FormTypeSelector = ({ selectedType, onTypeSelect }: FormTypeSelectorProps) => {
  return (
    <Box
      className="tour-form-type-selector"
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(2, 1fr)' },
        gap: 3,
        mb: 4,
      }}
    >
      {formTypes.map((formType) => {
        const Icon = formType.icon;
        const isSelected = selectedType === formType.id;

        return (
          <Paper
            key={formType.id}
            onClick={() => onTypeSelect(formType.id)}
            sx={{
              cursor: 'pointer',
              p: 2,
              textAlign: 'center',
              borderRadius: 2,
              border: isSelected ? '2px solid #CD1B78' : '1px solid #e5e7eb',
              boxShadow: isSelected ? '0 0 0 2px #FCE7F3' : 'none',
              transition: 'all 0.3s ease',
            }}
          >
            <Box mb={1}>
              <Icon sx={{ fontSize: 48, color: isSelected ? '#CD1B78' : '#9ca3af' }} />
            </Box>
            <Typography
              sx={{
                fontWeight: 600,
                color: isSelected ? '#CD1B78' : '#1f2937',
                fontSize: '15px',
                mb: 0.5,
              }}
            >
              {formType.title}
            </Typography>
            <Typography sx={{ fontSize: '13px', color: '#6b7280' }}>{formType.description}</Typography>
          </Paper>
        );
      })}
    </Box>
  );
};

export default FormTypeSelector;
