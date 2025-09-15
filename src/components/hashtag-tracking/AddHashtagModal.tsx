import { Box, Dialog, IconButton, Input, Typography } from '@mui/material';

import CustomButton from '@/components/atoms/CustomButton';
import { memo } from 'react';
import { BiX } from 'react-icons/bi';

interface AddHashtagModalProps {
  openModal: boolean;
  onClose: () => void;
  inputValue: string;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearInput: () => void;
  isLoading: boolean;
  onSubmit: () => void;
  isBtnDisabled: boolean;
  btnText: string;
}

const AddHashtagModal = memo(({ openModal, onClose, inputValue, onInputChange, onClearInput, isLoading, onSubmit, isBtnDisabled, btnText }: AddHashtagModalProps) => {
  return (
    <Dialog
      open={openModal}
      onClose={onClose}
      slotProps={{
        backdrop: {
          sx: { backgroundColor: 'rgba(0, 0, 0, 0.8)' },
        },
      }}
      fullWidth
      maxWidth="md"
    >
      <Box
        sx={{
          p: 2,
        }}
      >
        {/* Modal Header */}
        <Typography
          variant="body1"
          sx={{
            fontWeight: 700,
            fontSize: { xs: '24px', sm: '28px', md: '36px' },
            color: '#333333',
            textAlign: 'center',
          }}
        >
          Track a New{' '}
          <span
            style={{
              color: '#CD1B78',
            }}
          >
            Hashtag
          </span>
        </Typography>

        <img
          src="/assets/images/hashtag-create.svg"
          alt="Hashtag Tracking"
          style={{
            width: '100%', // Adjusts image size based on container width
            maxWidth: '238px',
            height: 'auto', // Maintains aspect ratio
            display: 'block',
            margin: 'auto',
            marginTop: '20px', // Reduced spacing for smaller screens
          }}
        />

        <Box
          mt={3}
          sx={{
            maxWidth: '600px',
            width: '100%',
            mx: 'auto',
          }}
        >
          <Input
            id="input-with-icon-adornment"
            placeholder="Search for hashtag"
            value={inputValue}
            fullWidth
            onChange={onInputChange}
            sx={{
              borderBottom: '0.83px solid #CCCCCC',
              '&::placeholder': {
                color: 'red',
                fontStyle: 'italic',
              },
            }}
            endAdornment={
              <IconButton onClick={onClearInput}>
                <BiX size={20} />
              </IconButton>
            }
          />
          <Typography
            sx={{
              fontSize: '12px',
              color: '#6C727F',
              mt: 1,
            }}
          >
            Search by hashtags (without #) to track
          </Typography>
        </Box>

        {/* Save Button */}
        <Box
          mt={3}
          sx={{
            display: 'flex',
            maxWidth: '150px',
            justifyContent: 'center',
            mx: 'auto',
            alignItems: 'center',
          }}
        >
          <CustomButton mode="primary" disabled={isBtnDisabled} loading={isLoading} onClick={onSubmit}>
            {btnText}
          </CustomButton>
        </Box>
      </Box>
    </Dialog>
  );
});

AddHashtagModal.displayName = 'AddHashtagModal';

export default AddHashtagModal;
