import { LightThemeColors } from '@/configs/colors.config';
import { SocialMessagingHelper } from '@/helpers/SocialMessagingHelper';
import { TextHelper } from '@/helpers/TextHelper';
import useClipboard from '@/hooks/clipboard';
import { useLeadTabHook } from '@/hooks/leads-tracking/leadsTab.hook';
import { LeadDto } from '@/models/dtos/LeadsDto';
import { LeadStatusEnum } from '@/models/enum-models/LeadStatusEnum';
import LeadStatusIcon from '@/utils/icon/LeadStatusIcon';
import CloseIcon from '@mui/icons-material/Close';
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Collapse,
  Grid,
  IconButton,
  InputAdornment,
  ListItemText,
  MenuItem,
  Popover,
  Select,
  styled,
  TextField,
  Tooltip,
  TooltipProps,
  Typography,
} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import moment from 'moment';
import { ChangeEvent, Dispatch, KeyboardEvent, MouseEvent, SetStateAction, useState } from 'react';
import { BsArrowRepeat, BsSendFill } from 'react-icons/bs';
import { FaRegCircleQuestion } from 'react-icons/fa6';
import { HiPencil } from 'react-icons/hi2';
import { IoClose, IoCopyOutline, IoStar, IoStarOutline } from 'react-icons/io5';
import { triggerToast } from '../atoms/CustomToast';
import PlatformIcon from '../atoms/PlatformIcons';

import { LeadTypeEnum } from '@/models/enum-models/LeadTypeEnum';
import RevealBox from '../boxes/RevealBox';

interface MentionCardProps {
  lead: LeadDto;
  selectedLeadForDelete: string[];
  deleteSelection: boolean;
  setSelectedLeadForDelete: Dispatch<SetStateAction<string[]>>;
  disabledCheckbox?: boolean;
}

type InterestLevel = 'high' | 'medium' | 'low';

const StyledTooltip = styled(({ className, ...props }: TooltipProps) => <Tooltip {...props} classes={{ popper: className }} />)({
  [`& .MuiTooltip-tooltip`]: {
    backgroundColor: '#fff',
    color: '#333',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    borderRadius: '6px',
    fontSize: '14px',
    padding: '8px',
    maxWidth: 400,
    whiteSpace: 'normal',
  },
  [`& .MuiTooltip-arrow`]: {
    color: '#fff',
  },
});

const RoundedTextField = styled(TextField)(({ theme }) => ({
  maxWidth: '536px',
  width: '100%',
  '& .MuiOutlinedInput-root': {
    borderRadius: 10,
    '& fieldset': {
      borderColor: theme.palette.grey[300],
    },
    '&:hover fieldset': {
      borderColor: theme.palette.grey[400],
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
  '& .MuiOutlinedInput-input': {
    padding: '8px 14px',
  },
}));

const MentionCard = ({ lead, deleteSelection, selectedLeadForDelete, setSelectedLeadForDelete, disabledCheckbox }: MentionCardProps) => {
  const [showAiReply, setShowAiReply] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const { copyToClipboard } = useClipboard();
  const { regenerateLeadFollowUpMessage, updateLeadStatus, starMutation } = useLeadTabHook();
  const [leadStatus, setLeadStatus] = useState<string>(lead.lead_status ?? LeadStatusEnum.NEW);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
  };

  const handleSend = () => {
    regenerateLeadFollowUpMessage.mutate({
      lead_id: lead.lead_id ?? '',
      prompt: inputValue,
    });

    setInputValue('');
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      // Do something with inputValue here
      console.log('Input submitted:', inputValue);
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setInputValue('');
    }
  };

  const interestLevelColor: {
    [key in InterestLevel]: { color: string; bgColor: string };
  } = {
    high: {
      color: '#7B7B7B',
      bgColor: '#C5FBA4',
    },
    medium: {
      color: '#5C5C5C',
      bgColor: '#FFEB99',
    },
    low: {
      color: '#8B0000',
      bgColor: '#FFC0CB',
    },
  };

  const handlePopoverOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const messageSteps = SocialMessagingHelper.getMessagingSteps(TextHelper.getDomainName(lead?.lead_link ?? lead?.social_profile_link ?? '')?.toUpperCase());

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        gap: { xs: '18px', md: '30px' },
        alignItems: 'center',
      }}
    >
      {deleteSelection && (
        <Checkbox
          disabled={disabledCheckbox}
          checked={selectedLeadForDelete.includes(lead.lead_id ?? '')}
          onChange={() => {
            if (selectedLeadForDelete.includes(lead.lead_id ?? '')) {
              setSelectedLeadForDelete(selectedLeadForDelete.filter((id) => id !== lead.lead_id));
            } else {
              setSelectedLeadForDelete([...selectedLeadForDelete, lead.lead_id ?? '']);
            }
          }}
        />
      )}

      <Box
        sx={{
          boxShadow: '-1px -0.92px 1.84px 0px #0000001A',
          width: '100%',
          backgroundColor: '#FAFAFA',
          p: 4,
          borderRadius: '10px',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              src={lead.picture_url}
              alt={`${lead.first_name ?? ''} ${lead.last_name ?? lead.username ?? ''}`}
              component="div"
              sx={{
                width: 48,
                height: 48,
                fontWeight: 600,
                fontSize: '16px',
                bgcolor: lead.picture_url ? 'transparent' : '#BDBDBD',
                color: '#fff',
              }}
            >
              {!lead.picture_url && TextHelper.getInitials(`${lead?.first_name ?? ''} ${lead?.last_name ?? lead?.username ?? ''}`)}
            </Avatar>

            <Box>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: '16px',
                  color: '#333',
                  lineHeight: 1.2,
                }}
              >
                {lead.username ?? `${lead.first_name ?? ''} ${lead.last_name ?? ''}`.trim() ?? 'No Name'}
              </Typography>

              {lead.location && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#777" viewBox="0 0 16 16">
                    <path d="M8 16s6-5.686 6-10A6 6 0 1 0 2 6c0 4.314 6 10 6 10zm0-8a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
                  </svg>
                  <Typography sx={{ fontSize: '13px', color: '#777' }}>{lead.location}</Typography>
                </Box>
              )}
            </Box>
          </Box>
          <Box
            mb={1.5}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '15px',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                gap: { xs: '18px', md: '30px' },
                alignItems: 'flex-start', // Align top so avatar is flush
              }}
            >
              <Select
                value={leadStatus}
                onChange={(e) => {
                  const newStatus = e.target.value;

                  // Update local state optimistically
                  setLeadStatus(newStatus);

                  // Send mutation to backend
                  updateLeadStatus.mutate({
                    lead_id: lead.lead_id ?? '',
                    lead_status: newStatus,
                  });
                }}
                sx={{
                  width: '150px',
                  height: '48px',
                  backgroundColor: '#fff',
                  boxShadow: 'none',
                  border: 'none',
                  '.MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '& .MuiSelect-select': {
                    fontSize: '14px',
                    padding: '10px',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    border: 'none',
                  },
                }}
                displayEmpty
                renderValue={(value) => (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LeadStatusIcon style={{ width: 20, height: 20, color: '#6B6B6B' }} />
                    <span>{value || 'Lead Status'}</span>
                  </Box>
                )}
              >
                <MenuItem disabled value="">
                  <ListItemText primary="Lead Status" sx={{ ml: 1, fontSize: '14px' }} />
                </MenuItem>
                {Object.values(LeadStatusEnum).map((status) => (
                  <MenuItem value={status} key={status}>
                    <ListItemText primary={status} sx={{ ml: 1, fontSize: '14px' }} />
                  </MenuItem>
                ))}
              </Select>
            </Box>

            <StyledTooltip
              arrow
              PopperProps={{
                modifiers: [
                  {
                    name: 'preventOverflow',
                    options: {
                      boundary: 'window',
                    },
                  },
                ],
              }}
              title="Show AI generated reply"
            >
              <Button variant="contained" color="primary" onClick={() => setShowAiReply(!showAiReply)}>
                AI reply
              </Button>
            </StyledTooltip>

            <Box
              component="button"
              onClick={() => {
                console.log(lead.lead_id);

                if (!lead.lead_id) return triggerToast('error', 'Lead ID not found', 'top-right');

                starMutation.mutate({
                  lead_id: lead.lead_id,
                  star: !lead.starred,
                });
              }}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              {lead.starred ? <IoStar size={20} color="#E4CE05" /> : <IoStarOutline size={20} color="#E4CE05" />}
            </Box>
          </Box>
        </Box>

        {/* Mention details */}
        <Box
          sx={{
            display: 'flex',
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: '10px',
            mt: '14px',
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          <PlatformIcon platform={TextHelper.getDomainName(lead.lead_link ?? lead.social_profile_link ?? '')} size={20} />
          <Box
            sx={{
              display: 'flex',
              alignItems: { xs: 'flex-start', md: 'center' },
              gap: '10px',
              flexDirection: { xs: 'column', md: 'row' },
              flexWrap: 'wrap',
            }}
          >
            <Typography
              sx={{
                fontSize: '16px',
                fontWeight: 600,
                color: '#818181',
                wordBreak: 'break-word',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
              }}
            >
              Mention of{' '}
              <span
                style={{
                  color: LightThemeColors.uriColor,
                  fontWeight: 400,
                  fontSize: '14px',
                }}
              >
                {(lead?.tags ?? lead.keywords ?? [])?.join(', ')}
              </span>{' '}
              on {TextHelper.getDomainName(lead.lead_link ?? lead.social_profile_link ?? '')}
            </Typography>
            <Box
              sx={{
                height: '5px',
                width: '5px',
                borderRadius: '1000%',
                backgroundColor: '#838282',
                display: { xs: 'none', md: 'block' },
              }}
            />
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <Typography
                sx={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: '#818181',
                }}
              >
                <span style={{ fontWeight: 400 }}>{`${moment(lead.last_updated).fromNow()}`}</span> by{' '}
                {((lead.lead_link ?? lead.social_profile_link)?.length ?? 0) ? (
                  <a
                    href={TextHelper.formatUrl(lead.lead_link ?? lead.social_profile_link ?? '')}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      if (leadStatus === LeadStatusEnum.NEW) {
                        setLeadStatus(LeadStatusEnum.CONTACTED);
                        updateLeadStatus.mutate({
                          lead_id: lead.lead_id ?? '',
                          lead_status: LeadStatusEnum.CONTACTED,
                        });
                      }
                    }}
                  >
                    <Typography
                      component="span"
                      sx={{
                        color: '#818181',
                        fontSize: '16px',
                        fontWeight: 600,
                        textDecoration: 'underline',
                        textDecorationColor: '#818181',
                        display: 'inline',
                      }}
                    >
                      {TextHelper.truncateText(lead?.username, 10, '') ?? 'no_username'}
                    </Typography>
                  </a>
                ) : (
                  <span>{TextHelper.truncateText(lead?.username, 10, '') ?? 'no_username'}</span>
                )}
              </Typography>
              <>
                {messageSteps.length !== 0 && (
                  <IconButton onClick={handlePopoverOpen}>
                    <FaRegCircleQuestion size={16} color="#7B7A7A" />
                  </IconButton>
                )}

                <Popover
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handlePopoverClose}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  slotProps={{
                    paper: {
                      sx: { mt: 1.5 },
                    },
                  }}
                >
                  <Box
                    sx={{
                      p: '19px',
                      minWidth: 250,
                      maxWidth: 300,
                      position: 'relative',
                    }}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Typography fontWeight="bold" fontSize="14px">
                        How to contact this lead on {TextHelper.truncateText(TextHelper.getDomainName(lead.lead_link ?? '') ?? '', 10, '')}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={handlePopoverClose}
                        sx={{
                          position: 'absolute',
                          top: '5px',
                          right: '5px',
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    {/* List of Steps */}
                    <ul style={{ margin: 0, paddingLeft: '18px' }}>
                      {messageSteps.map((step, index) => {
                        const words = step.split(' ');

                        return (
                          <li key={index} style={{ fontSize: '10px' }}>
                            {words.map((word, i) =>
                              word.match(/^(www\.|http)/) ? ( // ✅ Optimized regex check
                                <a
                                  key={i}
                                  href={word.startsWith('http') ? word : `https://${word}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    paddingRight: '5px',
                                  }}
                                >
                                  <Typography
                                    component="span"
                                    sx={{
                                      color: '#CD1B78',
                                      textDecoration: 'underline',
                                      fontSize: '10px',
                                    }}
                                  >
                                    {word}
                                  </Typography>
                                </a>
                              ) : (
                                `${word} `
                              )
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </Box>
                </Popover>
              </>
            </Box>
          </Box>
        </Box>

        {/* Additional Details */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            mt: 2,
          }}
        >
          {lead.lead_type === LeadTypeEnum.ORGANIZATION ||
            (lead.lead_type === LeadTypeEnum.PERSON && (
              <Grid my={2} item xs={6} md={2} sx={{ display: 'flex', gap: 1 }}>
                <RevealBox type="email" value={lead.lead_email} />
                <RevealBox type="phone" value={lead.phone} />
              </Grid>
            ))}

          {/* {(lead.social_profile || lead.location) && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {lead.social_profile_link ? (
                <a href={lead.social_profile_link} target="_blank" rel="noopener noreferrer" style={{ color: LightThemeColors.uriColor, textDecoration: 'underline', fontSize: '14px' }}>
                  @{TextHelper.truncateText(lead.social_profile ?? '', 30, '')}
                </a>
              ) : (
                lead.social_profile && <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>@{lead.social_profile}</Typography>
              )}
              {lead.location && <Typography sx={{ fontSize: '14px', fontWeight: 500, color: '#666' }}>{lead.location}</Typography>}
            </Box>
          )} */}

          {lead.opportunity_type && (
            <Box
              sx={{
                display: 'inline-block',
                mt: 1,
                px: 2,
                py: 0.5,
                backgroundColor: '#F2F2F2',
                color: '#333',
                fontWeight: 500,
                fontSize: '12px',
                borderRadius: '6px',
                width: 'fit-content',
              }}
            >
              {lead.opportunity_type}
            </Box>
          )}
        </Box>

        {/* Mention Content */}
        <Typography
          sx={{
            color: '#7B7B7B',
            fontSize: '16px',
            fontWeight: 500,
            mt: '14px',
          }}
        >
          {lead.mention}
        </Typography>
        <Box
          sx={{
            display: 'flex',
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: '10px',
            mt: '14px',
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          <Typography
            sx={{
              color: interestLevelColor[lead?.interest_level?.toLocaleLowerCase() as 'high' | 'medium' | 'low']?.color,
              fontSize: '12px',
              fontWeight: 700,
              backgroundColor: interestLevelColor[lead?.interest_level?.toLocaleLowerCase() as 'high' | 'medium' | 'low']?.bgColor,
              width: 'fit-content',
              py: '5.52px',
              px: '17.49px',
            }}
          >
            {lead?.interest_level}
          </Typography>
          <Typography
            sx={{
              color: '#7B7B7B',
              fontSize: '13.8px',
              fontWeight: 500,
            }}
          >
            {lead?.lead_reason}
          </Typography>
        </Box>

        {/* Ai Reply */}
        <Collapse in={showAiReply} timeout={500}>
          <Box
            sx={{
              mt: '29px',
              borderLeft: '0.92px solid #3A3A3A73',
              px: '14px',
            }}
          >
            <Typography
              color="primary"
              sx={{
                fontSize: '16px',
                fontWeight: 600,
                fontStyle: 'italic',
              }}
            >
              AI reply:
            </Typography>

            {regenerateLeadFollowUpMessage.isLoading ? (
              <Box
                sx={{
                  backgroundColor: '#EEEEEE',
                  borderRadius: '6px',
                  py: '15px',
                  px: '9px',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  mt: '5px',
                }}
              >
                <img src="/assets/gif/6-dot-triangle-loader.gif" alt="loading" width="20px" height="20px" />
                <Typography
                  color="primary"
                  sx={{
                    fontSize: '16px',
                    fontWeight: 500,
                    color: '#353535',
                  }}
                >
                  AI is generating a new response
                </Typography>
              </Box>
            ) : (
              <Typography
                sx={{
                  fontSize: '16px',
                  fontWeight: 500,
                  color: '#767676',
                  mt: '4px',
                  whiteSpace: 'pre-wrap',
                }}
                fontSize={10}
                variant="body1"
                dangerouslySetInnerHTML={TextHelper.createMarkup(lead.follow_up_message ?? '')}
              />
            )}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mt: '11px',
                color: '#5D5D5D',
              }}
            >
              <StyledTooltip
                arrow
                PopperProps={{
                  modifiers: [
                    {
                      name: 'preventOverflow',
                      options: {
                        boundary: 'window',
                      },
                    },
                  ],
                }}
                title="Copy message"
              >
                <IconButton onClick={() => copyToClipboard(lead.follow_up_message ?? '')}>
                  <IoCopyOutline size={24} />
                </IconButton>
              </StyledTooltip>

              <StyledTooltip
                arrow
                PopperProps={{
                  modifiers: [
                    {
                      name: 'preventOverflow',
                      options: {
                        boundary: 'window',
                      },
                    },
                  ],
                }}
                title="Regenerate message"
              >
                <IconButton
                  disabled={regenerateLeadFollowUpMessage.isLoading}
                  onClick={() =>
                    regenerateLeadFollowUpMessage.mutate({
                      lead_id: lead.lead_id ?? '',
                      prompt: 'Renew follow up message',
                    })
                  }
                >
                  <BsArrowRepeat size={24} />
                </IconButton>
              </StyledTooltip>

              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.div
                    key="input"
                    initial={{ width: 40, opacity: 0 }}
                    animate={{ width: 300, opacity: 1 }}
                    exit={{ width: 40, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    style={{
                      marginLeft: 8,
                      position: 'relative',
                    }}
                  >
                    <RoundedTextField
                      autoFocus
                      size="small"
                      value={inputValue}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      placeholder="Modify response"
                      fullWidth
                      variant="outlined"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <Tooltip title="Send prompt" arrow>
                              <Box
                                disabled={regenerateLeadFollowUpMessage.isLoading}
                                component="button"
                                onClick={handleSend}
                                sx={{
                                  backgroundColor: 'primary.main',
                                  borderRadius: '100%',
                                  padding: '6px',
                                }}
                              >
                                <BsSendFill size={16} color="#fff" />
                              </Box>
                            </Tooltip>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: -20,
                        right: -30,
                      }}
                      onClick={() => setIsEditing(false)}
                    >
                      <IoClose size={20} color="#5C5C5C" />
                    </IconButton>
                  </motion.div>
                ) : (
                  <motion.div key="button" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
                    <StyledTooltip
                      arrow
                      PopperProps={{
                        modifiers: [
                          {
                            name: 'preventOverflow',
                            options: {
                              boundary: 'window',
                            },
                          },
                        ],
                      }}
                      title="Modify Response"
                    >
                      <IconButton onClick={handleEditClick}>
                        <HiPencil size={24} />
                      </IconButton>
                    </StyledTooltip>
                  </motion.div>
                )}
              </AnimatePresence>
            </Box>
          </Box>
        </Collapse>
      </Box>
    </Box>
  );
};

export default MentionCard;
