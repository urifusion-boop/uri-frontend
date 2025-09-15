import { Box, Menu, MenuItem } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { BiLogOutCircle, BiMenuAltRight } from 'react-icons/bi';

import useCustomTheme from '@/hooks/theme.hook';
import styles from '@/styles/Dashboard.module.css';
import Link from 'next/link';
import { IoIosArrowDown } from 'react-icons/io';
import { IoSettingsOutline } from 'react-icons/io5';
import { UserTypeEnum } from '../../models/enum-models/UserTypeEnum';
import { useAuth } from '../../providers/AuthProvider';
import Text from '../atoms/CustomText';
import CustomSubscriptionHeader from '../headers/CustomSubscriptionHeader';

interface IProps {
  toggleSideNav: () => void;
}

const AdminPageHeader: React.FC<IProps> = ({ toggleSideNav }) => {
  const { themeColors } = useCustomTheme();
  const { userDetails, logoutUser } = useAuth();
  const [profileRoute, setProfileRoute] = useState('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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

  return (
    <Box
      sx={{
        py: { xs: 1, md: 2 },
        borderBottom: `2px solid ${themeColors.borderColor}`,
        backgroundColor: themeColors.surface,
      }}
    >
      <Box className={styles.dashHeader}>
        <Box className="d-flex justify-between">
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
              <CustomSubscriptionHeader subscribed={true} />
              <button className="d-flex items-center pointer" onClick={handleClick}>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    bgcolor: '#CD1B78',
                    color: '#fff',
                  }}
                  className="d-flex justify-center items-center"
                >
                  {userDetails?.firstName?.charAt(0) ?? ''}
                  {userDetails?.lastName?.charAt(0) ?? ''}
                </Box>
                <IoIosArrowDown style={{ marginLeft: '10px' }} />
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
                {}
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
                        {userDetails?.firstName?.charAt(0) + userDetails?.lastName?.charAt(0)!}
                      </Box>
                      <Box
                        sx={{
                          height: 'fit-content',
                        }}
                      >
                        <Text size={18} weight={500} sx={{ mt: '0px' }}>
                          {userDetails?.firstName} {userDetails?.lastName}
                        </Text>
                        <Text size={12} weight={400} sx={{ mt: '0px' }}>
                          ADMIN
                        </Text>
                      </Box>
                    </Box>
                  </Link>
                </MenuItem>
                <hr style={{ margin: '10px 0px' }} />
                <Text size={15} weight={600} color="dimgray" sx={{ padding: '0px 15px', opacity: '0.5' }}>
                  Account
                </Text>
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
                        Issues
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

export default AdminPageHeader;
