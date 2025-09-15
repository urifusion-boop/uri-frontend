import { TextHelper } from '@/helpers/TextHelper';
import { LeadOpportunityTypeEnum } from '@/models/enum-models/LeadOpportunityTypeEnum';
import { LeadStatusEnum } from '@/models/enum-models/LeadStatusEnum';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContactedIcon from '@mui/icons-material/ContactMail';
import HandshakeIcon from '@mui/icons-material/Handshake';
import NewIcon from '@mui/icons-material/NewReleases';
import OtherIcon from '@mui/icons-material/OtherHouses';
import PaymentsIcon from '@mui/icons-material/Payments';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import { Box, Tooltip, Typography } from '@mui/material';
import React from 'react';

type IconContentBoxProps = {
  icon?: React.ReactNode;
  content?: string;
  type?: LeadOpportunityTypeEnum | LeadStatusEnum;
  onClick?: () => void;
};

// Color map (MUI palette tokens)
const getColorForType = (type?: LeadOpportunityTypeEnum | LeadStatusEnum) => {
  switch (type) {
    // Opportunity types
    // case LeadOpportunityTypeEnum.Sales:
    //   return 'secondary.main';       // green
    // case LeadOpportunityTypeEnum.Partnership:
    //   return 'secondary.main';     // your brand accent (e.g. #CD1B78)
    // case LeadOpportunityTypeEnum.Recruitment:
    //   return 'info.main';          // blue
    // case LeadOpportunityTypeEnum.Other:
    //   return 'text.secondary';     // neutral

    // // Statuses
    // case LeadStatusEnum.NEW:
    //   return 'secondary.main';       // amber
    // case LeadStatusEnum.CONTACTED:
    //   return 'info.main';          // blue
    // case LeadStatusEnum.QUALIFIED:
    //   return 'secondary.main';       // green
    // case LeadStatusEnum.UNQUALIFIED:
    //   return 'secondary.main';         // red
    // case LeadStatusEnum.CONVERTED:
    //   return 'secondary.dark';       // deeper green

    default:
      return 'text.secondary';
  }
};

const IconContentBox = ({ icon, content, type, onClick }: IconContentBoxProps) => {
  const getIconAndContent = () => {
    switch (type) {
      case LeadOpportunityTypeEnum.Sales:
        return { icon: <PaymentsIcon />, content: 'Sales' };
      case LeadOpportunityTypeEnum.Partnership:
        return { icon: <HandshakeIcon />, content: 'Partnership' };
      case LeadOpportunityTypeEnum.Recruitment:
        return { icon: <WorkHistoryIcon />, content: 'Recruitment' };
      case LeadOpportunityTypeEnum.Other:
        return { icon: <OtherIcon />, content: 'Other' };
      case LeadStatusEnum.NEW:
        return { icon: <NewIcon />, content: 'New' };
      case LeadStatusEnum.CONTACTED:
        return { icon: <ContactedIcon />, content: 'Contacted' };
      case LeadStatusEnum.QUALIFIED:
        return { icon: <CheckCircleIcon />, content: 'Qualified' };
      case LeadStatusEnum.UNQUALIFIED:
        return { icon: <CancelIcon />, content: 'Unqualified' };
      case LeadStatusEnum.CONVERTED:
        return { icon: <CheckCircleIcon />, content: 'Converted' };
      default:
        return undefined;
    }
  };

  const mapped = getIconAndContent();
  const label = content ?? mapped?.content ?? '';
  const secondary = content && mapped?.content && content !== mapped.content ? content : undefined;

  const iconColor = getColorForType(type);
  const baseIcon = (icon ?? mapped?.icon ?? <OtherIcon />) as React.ReactElement<any, any>;

  // Color + size the icon directly (no circular background)
  const coloredIcon = React.cloneElement(baseIcon, {
    sx: { color: iconColor, fontSize: 26, verticalAlign: 'middle' },
  });

  return (
    <Box display="flex" alignItems="center" gap={2} onClick={onClick} sx={{ cursor: onClick ? 'pointer' : 'default', '&:hover .icb-label': { textDecoration: 'underline' } }}>
      <Tooltip title={label} arrow>
        <Box component="span" aria-label={label} sx={{ lineHeight: 0 }}>
          {typeof coloredIcon === 'string' ? (
            // If someone passes an image URL as `icon`, render it plainly (no bg)
            <Box component="img" src={coloredIcon as unknown as string} alt={label} sx={{ width: 26, height: 26, display: 'block' }} />
          ) : (
            coloredIcon
          )}
        </Box>
      </Tooltip>

      <Box>
        {label && (
          <Tooltip title={label} arrow>
            <Typography variant="caption" fontWeight={400} fontSize="14px" noWrap>
              {TextHelper.truncateText(label, 33, '...')}
            </Typography>
          </Tooltip>
        )}

        {secondary && (
          <Tooltip title={secondary} arrow>
            <Typography fontSize="13px" color="text.secondary" noWrap>
              {TextHelper.truncateText(secondary, 33, '...')}
            </Typography>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};

export default IconContentBox;
