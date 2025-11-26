import { Box, Button, Collapse, Divider, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, Menu, MenuItem, Typography, Avatar } from '@mui/material';
import React, { useState } from 'react';

import { authRoutes, dashboardRoutes } from '@/constants/ClientRoute';
import useResponsiveness from '@/hooks/useResponsiveness';
import { useAuth } from '@/providers/AuthProvider';
import AppsIcon from '@mui/icons-material/Apps';
import BarChartIcon from '@mui/icons-material/BarChart';
import BuildIcon from '@mui/icons-material/Build';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import CloseIcon from '@mui/icons-material/Close';
import DashboardIcon from '@mui/icons-material/Dashboard';
import FolderIcon from '@mui/icons-material/Folder';
import GroupsIcon from '@mui/icons-material/Groups';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import MovieIcon from '@mui/icons-material/Movie';
import PersonIcon from '@mui/icons-material/Person';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import SettingsIcon from '@mui/icons-material/Settings';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { BiBot } from 'react-icons/bi';
import { FaHashtag } from 'react-icons/fa';
import { MdRecordVoiceOver } from 'react-icons/md';

const Header = () => {
  const router = useRouter();
  const { isMobile } = useResponsiveness();
  const { userDetails, logoutUser } = useAuth();

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);
  const [profileAnchor, setProfileAnchor] = useState<null | HTMLElement>(null);

  const handleMenuOpen = (menu: string) => (event: React.MouseEvent<HTMLElement>) => {
    setActiveMenu(menu);
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = (url?: string) => {
    // if (url) {
    //   router.push(url);
    // }
    setMenuAnchor(null);
    setActiveMenu(null);
  };

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  const handleExpandMenu = (menuName: string) => {
    setExpandedMenu(expandedMenu === menuName ? null : menuName);
  };

  const navLinks = [
    {
      name: 'Features',
      menu: [
        {
          text: 'Keyword Tracking',
          icon: <MenuBookIcon sx={{ color: '#CD1B78', fontSize: '20px' }} />,
          url: '/#keyword-tracking',
        },
        {
          text: 'Account Tracking',
          icon: <BarChartIcon sx={{ color: '#CD1B78', fontSize: '20px' }} />,
          url: '/#account-tracking',
        },
        {
          text: 'Lead Tracking',
          icon: <MdRecordVoiceOver color="#CD1B78" size={20} />,
          url: '/#lead-tracking',
        },
        {
          text: 'Content Management',
          icon: <FolderIcon sx={{ color: '#CD1B78', fontSize: '18px' }} />,
          url: '/#content-management',
        },
        {
          text: 'Hashtag Tracking',
          icon: <FaHashtag color="#CD1B78" size={20} />,
          url: '/#hashtag-tracking',
        },
        {
          text: 'Insight Assistant',
          icon: <BiBot color="#CD1B78" size={20} />,
          url: '/#insight-assistant',
        },
      ],
    },
    {
      name: 'Use Case',
      menu: [
        {
          text: 'For Business',
          icon: <BusinessCenterIcon sx={{ color: '#CD1B78', fontSize: '20px' }} />,
          url: '/business-owners',
        },
        {
          text: 'For Agencies',
          icon: <GroupsIcon sx={{ color: '#CD1B78', fontSize: '20px' }} />,
          url: '/agencies',
        },
        {
          text: 'For Startups',
          icon: <RocketLaunchIcon sx={{ color: '#CD1B78', fontSize: '20px' }} />,
          url: '/startups',
        },
        {
          text: 'For Product Teams',
          icon: <AppsIcon sx={{ color: '#CD1B78', fontSize: '20px' }} />,
          url: '/product-teams',
        },
        {
          text: 'For Media and Entertainment',
          icon: <MovieIcon sx={{ color: '#CD1B78', fontSize: '20px' }} />,
          url: '/media-and-entertainment',
        },
      ],
    },
    {
      name: 'Resources',
      menu: [
        {
          text: 'How It Works',
          icon: <BuildIcon sx={{ color: '#CD1B78', fontSize: '20px' }} />,
          url: '/#how-it-works',
        },
        {
          text: 'FAQ',
          icon: <HelpOutlineIcon sx={{ color: '#CD1B78', fontSize: '20px' }} />,
          url: '/faqs',
        },
      ],
    },
    {
      name: 'Pricing',
      url: '/pricing',
    },
  ];

  const MobileMenu = () => (
    <Box sx={{ width: '80vw', height: '100%', position: 'relative' }}>
      {/* Drawer Header */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #eee',
        }}
      >
        <Link href="/">
          <img src="/assets/images/landing/logo.png" alt="Logo" width={60} height={25} />
        </Link>
        <IconButton onClick={() => toggleDrawer(false)}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Menu Items */}
      <Box sx={{ overflow: 'auto', height: 'calc(100% - 180px)' }}>
        <List>
          {navLinks.map((link) => {
            if (link.menu) {
              return (
                <Box key={link.name}>
                  <ListItem
                    // button
                    onClick={() => handleExpandMenu(link.name)}
                    sx={{
                      py: 1.5,
                      '&:hover': { backgroundColor: 'rgba(205, 27, 120, 0.04)' },
                    }}
                  >
                    <ListItemText
                      primary={link.name}
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontWeight: 600,
                          color: '#111',
                        },
                      }}
                    />
                    <KeyboardArrowDownIcon
                      sx={{
                        transform: expandedMenu === link.name ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.3s ease',
                        color: '#666',
                      }}
                    />
                  </ListItem>
                  <Collapse in={expandedMenu === link.name} timeout="auto">
                    <List component="div" disablePadding>
                      {link.menu.map((item: { text: string; icon: React.ReactNode; url?: string }) => (
                        <ListItem
                          key={item.text}
                          sx={{
                            pl: 4,
                            py: 1.5,
                            '&:hover': {
                              backgroundColor: 'rgba(205, 27, 120, 0.04)',
                            },
                          }}
                        >
                          <Link href={item.url || '#'} onClick={() => toggleDrawer(false)}>
                            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
                            <ListItemText
                              primary={item.text}
                              sx={{
                                '& .MuiListItemText-primary': {
                                  fontSize: '0.9rem',
                                  color: '#444',
                                },
                              }}
                            />
                          </Link>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                  <Divider sx={{ my: 1 }} />
                </Box>
              );
            }
            return (
              <Link key={link.name} href={link.url}>
                <Box sx={{ py: 1.5, '&:hover': { backgroundColor: 'rgba(205, 27, 120, 0.04)' } }}>
                  <ListItem>
                    <ListItemText primary={link.name} sx={{ '& .MuiListItemText-primary': { fontWeight: 600, color: '#111' } }} />
                  </ListItem>

                  <Divider sx={{ my: 1 }} />
                </Box>
              </Link>
            );
          })}
        </List>
      </Box>

      {/* Fixed Bottom Actions */}
      <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, p: 2, borderTop: '1px solid #eee', backgroundColor: '#fff' }}>
        {userDetails ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, pb: 2, borderBottom: '1px solid #eee' }}>
              <Avatar sx={{ width: 40, height: 40, bgcolor: '#CD1B78', fontSize: '16px', fontWeight: 600 }}>
                {userDetails.firstName?.[0]}{userDetails.lastName?.[0]}
              </Avatar>
              <Box>
                <Typography sx={{ fontWeight: 600, fontSize: '14px', color: '#111' }}>
                  {userDetails.firstName} {userDetails.lastName}
                </Typography>
                <Typography sx={{ fontSize: '12px', color: '#666' }}>
                  {userDetails.email}
                </Typography>
              </Box>
            </Box>
            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                router.push(dashboardRoutes.dashboardClients);
                toggleDrawer(false);
              }}
              sx={{ backgroundColor: '#CD1B78', '&:hover': { backgroundColor: '#D13D80' }, mb: 1, py: 1 }}
            >
              Go to Dashboard
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                logoutUser();
                toggleDrawer(false);
              }}
              sx={{ borderColor: '#CD1B78', color: '#CD1B78', '&:hover': { borderColor: '#D13D80', backgroundColor: '#fff5f9' }, py: 1 }}
            >
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button
              fullWidth
              variant="contained"
              onClick={() => {
                router.push(authRoutes.login);
                toggleDrawer(false);
              }}
              sx={{ backgroundColor: '#CD1B78', '&:hover': { backgroundColor: '#D13D80' }, mb: 1, py: 1 }}
            >
              Log in
            </Button>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => {
                router.push(authRoutes.signupAs);
                toggleDrawer(false);
              }}
              sx={{ borderColor: '#CD1B78', color: '#CD1B78', '&:hover': { borderColor: '#D13D80' }, py: 1 }}
            >
              Sign Up
            </Button>
          </>
        )}
      </Box>
    </Box>
  );

  return (
    <Box height={'90px'} width={'100%'} display={'flex'} bgcolor={'#fff'}>
      <Box className="flex justify-between items-center container" px={3}>
        {/* Logo */}
        <Link href="/">
          <img src="/assets/images/landing/logo.png" alt="Logo not found" width={60} height={25} />
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <Box display={'flex'} alignItems={'center'} gap={4}>
            {navLinks.map((link) => {
              if (link.menu) {
                return (
                  <Box key={link.name} onMouseEnter={handleMenuOpen(link.name)} onMouseLeave={() => handleMenuClose()} sx={{ position: 'relative' }}>
                    <Typography variant="body1" sx={{ fontWeight: 500, fontSize: '16px', color: '#111', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {link.name}
                      <KeyboardArrowDownIcon sx={{ color: 'gray', fontSize: '20px' }} />
                    </Typography>
                    {activeMenu === link.name && (
                      <Menu
                        anchorEl={menuAnchor}
                        open={Boolean(menuAnchor)}
                        onClose={() => handleMenuClose()}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'center',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'center',
                        }}
                        sx={{ '& .MuiPaper-root': { boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)', borderRadius: '8px', padding: '10px', minWidth: '220px' } }}
                      >
                        {link.menu.map((menuItem) => (
                          <Link href={menuItem.url} key={menuItem.text}>
                            <MenuItem
                              onClick={() => {
                                if ((menuItem as any)?.href) {
                                  // router.push((menuItem as any)?.href);
                                }

                                handleMenuClose((menuItem as any)?.url);
                              }}
                              sx={{
                                color: '#111',
                                fontSize: '14px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '8px 16px',
                                backgroundColor: 'inherit !important',
                                '&:hover': {
                                  backgroundColor: '#EDEDED !important', // Lighter grey hover effect
                                },
                              }}
                            >
                              {menuItem.icon}
                              {menuItem.text}
                            </MenuItem>
                          </Link>
                        ))}
                      </Menu>
                    )}
                  </Box>
                );
              }
              return (
                <Link href={link.url} key={link.name}>
                  <Box>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: 500,
                        fontSize: '16px',
                        color: '#111',
                        cursor: 'pointer',

                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {link.name}
                    </Typography>
                  </Box>
                </Link>
              );
            })}
            {userDetails ? (
              <>
                <Box
                  onClick={(e) => setProfileAnchor(e.currentTarget)}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    cursor: 'pointer',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    '&:hover': {
                      backgroundColor: '#f5f5f5',
                    },
                  }}
                >
                  <Avatar sx={{ width: 36, height: 36, bgcolor: '#CD1B78', fontSize: '14px', fontWeight: 600 }}>
                    {userDetails.firstName?.[0]}{userDetails.lastName?.[0]}
                  </Avatar>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: '#111' }}>
                    {userDetails.firstName}
                  </Typography>
                  <KeyboardArrowDownIcon sx={{ color: '#666' }} />
                </Box>
                <Menu
                  anchorEl={profileAnchor}
                  open={Boolean(profileAnchor)}
                  onClose={() => setProfileAnchor(null)}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  sx={{
                    '& .MuiPaper-root': {
                      boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)',
                      borderRadius: '8px',
                      padding: '10px',
                      minWidth: '200px',
                      mt: 1,
                    },
                  }}
                >
                  <MenuItem
                    onClick={() => {
                      router.push(dashboardRoutes.dashboardClients);
                      setProfileAnchor(null);
                    }}
                    sx={{
                      color: '#111',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 16px',
                      borderRadius: '6px',
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                      },
                    }}
                  >
                    <DashboardIcon sx={{ color: '#CD1B78', fontSize: '20px' }} />
                    Dashboard
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      router.push('/profile');
                      setProfileAnchor(null);
                    }}
                    sx={{
                      color: '#111',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 16px',
                      borderRadius: '6px',
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                      },
                    }}
                  >
                    <PersonIcon sx={{ color: '#CD1B78', fontSize: '20px' }} />
                    Profile
                  </MenuItem>
                  <MenuItem
                    onClick={() => {
                      router.push('/settings');
                      setProfileAnchor(null);
                    }}
                    sx={{
                      color: '#111',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 16px',
                      borderRadius: '6px',
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                      },
                    }}
                  >
                    <SettingsIcon sx={{ color: '#CD1B78', fontSize: '20px' }} />
                    Settings
                  </MenuItem>
                  <Divider sx={{ my: 1 }} />
                  <MenuItem
                    onClick={() => {
                      logoutUser();
                      setProfileAnchor(null);
                    }}
                    sx={{
                      color: '#CD1B78',
                      fontSize: '14px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '10px 16px',
                      borderRadius: '6px',
                      '&:hover': {
                        backgroundColor: '#fff5f9',
                      },
                    }}
                  >
                    <LogoutIcon sx={{ color: '#CD1B78', fontSize: '20px' }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Typography variant="body1" sx={{ fontWeight: 500, fontSize: '16px', color: '#CD1B78', cursor: 'pointer' }} onClick={() => router.push(authRoutes.login)}>
                  Log in
                </Typography>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#CD1B78',
                    borderRadius: '8px',
                    textTransform: 'none',

                    '&:hover': {
                      backgroundColor: '#D13D80',
                    },
                  }}
                  onClick={() => router.push(authRoutes.signupAs)}
                >
                  Sign Up
                </Button>
              </>
            )}
          </Box>
        )}

        {/* Mobile Menu Icon */}
        {isMobile && (
          <IconButton edge="end" color="inherit" aria-label="menu" onClick={() => toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
        )}

        {/* Mobile Drawer */}
        <Drawer anchor="right" open={drawerOpen} onClose={() => toggleDrawer(false)}>
          <MobileMenu />
        </Drawer>
      </Box>
    </Box>
  );
};

export default Header;
