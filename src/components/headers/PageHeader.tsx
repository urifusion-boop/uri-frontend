import { Box, Menu, MenuItem, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { BiLogOutCircle, BiMenuAltRight } from 'react-icons/bi';

import { TextHelper } from '@/helpers/TextHelper';
import useCustomTheme from '@/hooks/theme.hook';
import { SubscriptionTypeEnum } from '@/models/enum-models/SubscriptionStatusEnum';
import styles from '@/styles/Dashboard.module.css';
import Link from 'next/link';
import { FiHelpCircle } from 'react-icons/fi';
import { IoSettingsOutline } from 'react-icons/io5';
import { UserTypeEnum } from '../../models/enum-models/UserTypeEnum';
import { useAuth } from '../../providers/AuthProvider';
import Text from '../atoms/CustomText';
import NotificationDropDown from '../atoms/NotificationDropDown';
import { MessageIcon } from '../messages/MessageIcon';
import CustomSubscriptionHeader from './CustomSubscriptionHeader';

interface IProps {
  toggleSideNav: () => void;
}

const PageHeader: React.FC<IProps> = ({ toggleSideNav }) => {
  const { themeColors } = useCustomTheme();
  const { userDetails, userProfile, logoutUser, subscriptionPlanType } = useAuth();
  const [totalUnreadMessageCount, setTotalUnreadMessageCount] = useState<number>(0);
  const [profileRoute, setProfileRoute] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  // const { unreadCount, setUnreadCount } = useContext(NotificationSoundContext);

  const userImage = TextHelper.setUrl(userProfile?.headshot?.url ?? userProfile?.logo?.url ?? '');

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (userDetails?.userId) setProfileRoute(`/${userDetails?.userType === UserTypeEnum.BUSINESS ? 'clients' : 'profile'}/${userDetails?.userId ?? ''}`);
  }, [userDetails]);

  // useEffect(() => {
  //   if (!userDetails?.userId) return;

  //   const unsubscribe = FirebaseService.getTotalUnreadMessageCountForParticipant(userDetails.userId, (count) => {
  //     if (count > unreadCount) {
  //       const beepSound = new Audio('/assets/sounds/new-message.mp3');
  //       beepSound.volume = 0.08;
  //       beepSound.play();
  //     }
  //     setUnreadCount(count);
  //     setTotalUnreadMessageCount(count);
  //   });

  //   return () => unsubscribe?.();
  // }, [userDetails, setUnreadCount, unreadCount]);

  return (
    <Box
      className="no-print"
      sx={{
        py: { xs: 1, md: 2 },
        borderBottom: `2px solid ${themeColors.borderColor}`,
        backgroundColor: themeColors.surface,
      }}
    >
      <Box className={styles.dashHeader}>
        <Box className="d-flex justify-between" sx={{ alignItems: 'center' }}>
          <Box className="d-flex justify-start">
            <Box sx={{ ml: 2 }}>
              <BiMenuAltRight
                className="font-32 font-800 pointer"
                style={{
                  color: '#353F50',
                  fontSize: '32px',
                  fontWeight: 800,
                  transform: 'rotateY(180deg)',
                }}
                onClick={() => toggleSideNav()}
              />
            </Box>
          </Box>
          <Box className="d-flex justify-end">
            <Box className="d-flex items-center justify-end">
              <CustomSubscriptionHeader subscribed={!!subscriptionPlanType && subscriptionPlanType !== SubscriptionTypeEnum.FreeTrial} />
              <MessageIcon count={totalUnreadMessageCount} />
              <NotificationDropDown />
              <button className="d-flex items-center pointer" onClick={handleClick}>
                <Box
                  sx={{
                    width: 50,
                    height: 50,
                    borderRadius: '10px',
                    bgcolor: '#CD1B78',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    border: '1.5px solid',
                    borderColor: '#999',
                  }}
                >
                  {userImage?.length > 0 ? (
                    <img
                      alt="user pic"
                      src={userImage}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '10px',
                      }}
                    />
                  ) : (
                    <Typography
                      sx={{
                        fontSize: '18px',
                        fontWeight: 'bold',
                        color: '#fff',
                        textTransform: 'uppercase',
                      }}
                    >
                      {(userDetails?.email?.charAt(0) ?? '') + (userDetails?.email?.charAt(1) ?? '')}
                    </Typography>
                  )}
                </Box>

                <Box className="ml-2">
                  <Typography className="font-semibold text-left">
                    {TextHelper.truncateText(userDetails?.email ?? '', 10, '...')}
                    {/* {userDetails?.lastName?.charAt(0) ?? ""}. */}
                  </Typography>
                  {/* <Typography className="text-left">
                    {userDetails?.phoneNumber}
                  </Typography> */}
                </Box>
              </button>
              <Menu
                id="long-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                sx={{
                  '.MuiMenu-paper': {
                    minWidth: '250px',
                    backgroundColor: '#fff',
                  },
                }}
              >
                <MenuItem onClick={handleClose}>
                  <Link href={profileRoute}>
                    <Box className="d-flex justify-between" sx={{ padding: '0px 15px 5px 15px' }}>
                      <Box
                        sx={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '40px',
                          bgcolor: '#CD1B78',
                          color: '#fff',
                          marginTop: '3px',
                          mr: '10px',
                        }}
                        className="d-flex justify-center items-center"
                      >
                        {userDetails?.email?.charAt(0) + userDetails?.email?.charAt(0)!}
                      </Box>
                      <Box
                        sx={{
                          // height: "fit-content",
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Text size={18} weight={500} sx={{ mt: '0px' }}>
                          {/* {userDetails?.firstName} */}
                          {TextHelper.truncateText(userDetails?.email ?? '', 30, '...')}
                        </Text>
                        {/* <Text size={12} weight={400} sx={{ mt: "0px" }}>
                          {userDetails?.phoneNumber}
                        </Text> */}
                      </Box>
                    </Box>
                  </Link>
                </MenuItem>
                <hr style={{ margin: '10px 0px' }} />
                <Text size={15} weight={600} color="dimgray" sx={{ padding: '0px 15px', opacity: '0.5' }}>
                  Account
                </Text>
                <MenuItem onClick={handleClose}>
                  {/* <Link href={profileRoute}>
                    <Box
                      className="d-flex pointer"
                      sx={{
                        padding: "10px 15px",
                      }}
                    >
                      <RiAccountCircleLine
                        style={{
                          width: "24px",
                          height: "24px",
                          color: "#CD1B78",
                        }}
                      />
                      <Text size={16} weight={500} sx={{ ml: 1 }}>
                        Profile
                      </Text>
                    </Box>
                  </Link> */}
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Link href="/settings">
                    <Box
                      className="d-flex pointer"
                      sx={{
                        padding: '10px 15px',
                      }}
                    >
                      <IoSettingsOutline
                        style={{
                          width: '24px',
                          height: '24px',
                          color: '#CD1B78',
                        }}
                      />
                      <Text size={16} weight={500} sx={{ ml: 1 }}>
                        Settings
                      </Text>
                    </Box>
                  </Link>
                </MenuItem>
                <hr style={{ margin: '10px 0px' }} />
                <Text size={15} weight={600} color="dimgray" sx={{ padding: '0px 15px', opacity: '0.5' }}>
                  Support
                </Text>
                <MenuItem onClick={handleClose}>
                  <Link href="/help">
                    <Box
                      className="d-flex pointer"
                      sx={{
                        padding: '10px 15px',
                      }}
                    >
                      <img src="/assets/images/ticket.svg" width={24} height={24} alt="ticket" />
                      <Text size={16} weight={500} sx={{ ml: 1 }}>
                        Raise a ticket
                      </Text>
                    </Box>
                  </Link>
                </MenuItem>
                <MenuItem onClick={handleClose}>
                  <Link href="/help">
                    <Box
                      className="d-flex pointer"
                      sx={{
                        padding: '10px 15px',
                      }}
                    >
                      <FiHelpCircle
                        style={{
                          width: '24px',
                          height: '24px',
                          color: '#CD1B78',
                        }}
                      />
                      <Text size={16} weight={500} sx={{ ml: 1 }}>
                        Help & Support
                      </Text>
                    </Box>
                  </Link>
                </MenuItem>

                <hr style={{ margin: '10px 0px' }} />
                <MenuItem onClick={handleClose}>
                  <Box
                    className="d-flex pointer"
                    sx={{
                      padding: '10px 15px',
                    }}
                    onClick={() => logoutUser()}
                  >
                    <BiLogOutCircle
                      style={{
                        width: '24px',
                        height: '24px',
                        color: '#CD1B78',
                      }}
                    />
                    <Text size={16} weight={500} sx={{ ml: 1 }}>
                      Log Out
                    </Text>
                  </Box>
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PageHeader;
