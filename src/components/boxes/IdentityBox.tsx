import { LeadHelper } from '@/helpers/LeadHelper';
import { TextHelper } from '@/helpers/TextHelper';
import { LeadDto } from '@/models/dtos/LeadsDto';
import { Avatar, Box, Tooltip, Typography } from '@mui/material';

type IdentityBoxProps = {
  name?: string;
  jobTitle?: string;
  imageUrl?: string;
  lead?: LeadDto;
  onClick?: () => void;
};

const IdentityBox = ({ name, lead, jobTitle = 'Unknown', imageUrl, onClick }: IdentityBoxProps) => {
  return (
    <Box display="flex" alignItems="center" gap={2} onClick={onClick} sx={{ cursor: onClick ? 'pointer' : 'default' }}>
      <Avatar src={imageUrl} alt={name} sx={{ width: 40, height: 40, fontSize: '14px', bgcolor: '#ccc' }}>
        {!imageUrl && LeadHelper.getLeadInitials(lead)}
      </Avatar>
      <Box>
        <Tooltip title={name} arrow>
          <Typography fontWeight={600} fontSize="14px" color="text.primary" noWrap>
            {TextHelper.truncateText(name, 33, '...')}
          </Typography>
        </Tooltip>
        <Tooltip title={jobTitle} arrow>
          <Typography fontSize="13px" color="text.secondary" noWrap>
            {TextHelper.truncateText(jobTitle, 33, '...')}
          </Typography>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default IdentityBox;
