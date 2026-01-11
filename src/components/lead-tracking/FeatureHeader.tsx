import BeaconBubble from '@/components/guide-tour/bubble';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import { Avatar, Box, Button, Typography } from '@mui/material';
import { ReactElement, memo } from 'react';

type FeatureHeaderProps = {
  isMobile: boolean;
  onClick: () => void;
  loading?: boolean;
  buttonText?: string;
  onExportClick?: () => void;
  onImportClick?: () => void;
  onCreateNewClick?: () => void;
  startTour?: () => void;
  title?: string;
  icon?: ReactElement; // New prop for custom icon
  allowExport?: boolean;
  allowImport?: boolean;
  allowCreateNew?: boolean;
};

const FeatureHeader = memo(
  ({
    isMobile,
    onClick,
    loading,
    buttonText,
    onExportClick,
    onImportClick,
    onCreateNewClick,
    startTour,
    title,
    icon,
    allowExport = true,
    allowImport = true,
    allowCreateNew = false,
  }: FeatureHeaderProps) => (
    <Box
      sx={{
        display: 'flex',
        alignItems: isMobile ? 'flex-start' : 'center',
        justifyContent: 'space-between',
        flexDirection: isMobile ? 'column' : 'row',
        gap: 2,
        pt: 3,
        px: 3,
        bgcolor: '#fff',
      }}
    >
      <Box display="flex" alignItems="center">
        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
          {icon ?? <RecordVoiceOverIcon />} {/* fallback to default */}
        </Avatar>
        <Typography sx={{ whiteSpace: 'nowrap' }} fontSize={isMobile ? 22 : 30} fontWeight="bold">
          {title ?? 'Lead Tracking'}
        </Typography>
        {startTour && <BeaconBubble onClick={startTour} />}
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: isMobile ? 'flex-start' : 'center',
          flexDirection: isMobile ? 'column' : 'row',
          gap: '12px',
          width: '100%',
          justifyContent: isMobile ? 'center' : 'flex-end',
        }}
      >
        {buttonText && (
          <Button
            className="tour-lead-new-btn"
            variant="contained"
            color="primary"
            sx={{
              px: 3,
              py: 1,
              opacity: loading ? 0.5 : 1,
              width: isMobile ? '100%' : 'auto',
              cursor: loading ? 'progress !important' : 'pointer !important',
            }}
            onClick={() => {
              if (loading) return;
              onClick();
            }}
          >
            {buttonText ?? 'Generate Business Info'}
          </Button>
        )}

        {allowCreateNew && (
          <Button
            variant="outlined"
            color="primary"
            sx={{
              px: 3,
              py: 1,
              width: isMobile ? '100%' : 'auto',
              borderColor: '#CD1B78',
              color: '#CD1B78',
              '&:hover': {
                borderColor: '#A01560',
                backgroundColor: '#FFF5FB',
              },
            }}
            onClick={() => {
              onCreateNewClick?.();
            }}
          >
            Create New Form
          </Button>
        )}

        {allowImport && (
          <Button
            variant="outlined"
            color="primary"
            sx={{
              px: 3,
              py: 1,
              width: isMobile ? '100%' : 'auto',
            }}
            onClick={() => {
              onImportClick?.();
            }}
          >
            Import
          </Button>
        )}

        {allowExport && (
          <Button
            variant="outlined"
            color="primary"
            sx={{
              px: 3,
              py: 1,
              width: isMobile ? '100%' : 'auto',
            }}
            onClick={() => {
              onExportClick?.();
            }}
          >
            Export
          </Button>
        )}
      </Box>
    </Box>
  )
);

FeatureHeader.displayName = 'FeatureHeader';
export default FeatureHeader;
