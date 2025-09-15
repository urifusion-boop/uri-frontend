import Spinner from '@/components/loaders/Spinner';
import useCustomTheme from '@/hooks/theme.hook';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, Menu, MenuItem } from '@mui/material';
import { useState } from 'react';

interface Option {
  label: string;
  onClick: () => void;
  loading?: boolean;
  disabled?: boolean;
}

interface IProps {
  options: Option[];
  loading?: boolean;
  icon?: React.ReactNode;
}

const CardHeaderDropdown: React.FC<IProps> = ({ options, loading, icon }) => {
  const { themeColors } = useCustomTheme();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>
      <button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={(e) => {
          e.stopPropagation();
          handleClick(e);
        }}
        style={{
          whiteSpace: 'nowrap',
        }}
      >
        {loading ? (
          <Spinner color="#CD1B78" />
        ) : (
          icon || (
            <MoreVertIcon
              sx={{
                color: '#000',
                cursor: 'pointer',
                fontSize: '1.5rem',
              }}
            />
          )
        )}
      </button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {options.map((option, index) => (
          <MenuItem
            key={index}
            onClick={(e) => {
              e.stopPropagation();

              handleClose();
              option.onClick();
            }}
            sx={{ px: '30px', color: '#000' }}
          >
            {option.loading ? <Spinner color={themeColors.primary} /> : option.label}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default CardHeaderDropdown;
