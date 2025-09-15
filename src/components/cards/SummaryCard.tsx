import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';

interface SummaryCardProps {
  count: number | string;
  label: string;
  tooltipText?: string;
}

const SummaryCard = ({ count, label, tooltipText }: SummaryCardProps) => {
  return (
    <Box
      p={3}
      bgcolor="white"
      borderRadius={2}
      textAlign="center"
      height={'100%'}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      position="relative"
      sx={{
        boxShadow: '0px 2px 5px 0px rgba(124, 115, 115, 0.1), borderRadius: 2',
      }}
    >
      {/* Top-right info icon */}
      {tooltipText && (
        <Box position="absolute" top={8} right={8} zIndex={1}>
          <Tooltip
            title={
              <Typography variant="caption" sx={{ fontSize: '11px', whiteSpace: 'pre-line' }}>
                {tooltipText}
              </Typography>
            }
            placement="left"
            arrow
          >
            <IconButton size="small" sx={{ p: 0.5 }}>
              <InfoOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )}

      {/* Main content remains centered */}
      <Typography variant="h5" fontWeight="bold">
        {count}
      </Typography>

      <Box display="flex" alignItems="center" gap={0.5}>
        <Typography>{label}</Typography>
        {/* Remove inline tooltip/icon here */}
      </Box>
    </Box>
  );
};

export default SummaryCard;
