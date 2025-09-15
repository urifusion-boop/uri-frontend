// components/input/CustomCheckbox.tsx
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Checkbox, FormControlLabel, Tooltip, Typography } from '@mui/material';

interface CustomCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  tooltip?: string;
}

const CustomCheckbox = ({ label, checked, onChange, tooltip }: CustomCheckboxProps) => {
  return (
    <FormControlLabel
      control={<Checkbox checked={checked} onChange={(e) => onChange(e.target.checked)} />}
      label={
        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
          {label}
          {tooltip && (
            <Tooltip title={tooltip} arrow>
              <InfoOutlinedIcon sx={{ fontSize: 16, ml: 0.5, color: '#9ca3af' }} />
            </Tooltip>
          )}
        </Typography>
      }
    />
  );
};

export default CustomCheckbox;
