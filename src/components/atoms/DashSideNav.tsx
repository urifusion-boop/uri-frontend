import { dashboardBottomLinks, dashboardLinks } from '@/data/dashboard';
import React, { Fragment, memo, useCallback, useEffect, useState } from 'react';

import useCustomTheme from '@/hooks/theme.hook';
import { SubscriptionStatusEnum } from '@/models/enum-models/SubscriptionStatusEnum';
import styles from '@/styles/Dashboard.module.css';
import { Box } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FaChevronDown } from 'react-icons/fa6';
import { GrClose } from 'react-icons/gr';
import { UserTypeEnum } from '../../models/enum-models/UserTypeEnum';
import { useAuth } from '../../providers/AuthProvider';
import Text from './CustomText';
import { UriLogo } from './Icons';

interface IProps {
  open: boolean;
  setOpen: (state: boolean) => void;
  bgColor?: string;
}

const DashSideNav: React.FC<IProps> = memo(({ open, setOpen, bgColor }) => {
  const { themeColors } = useCustomTheme();
  const { pathname, asPath, query } = useRouter();
  const { userDetails } = useAuth();

  const [profileRoute, setProfileRoute] = useState('');
  const [expandedLinks, setExpandedLinks] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    if (userDetails?.userId) setProfileRoute(`/${userDetails?.userType === UserTypeEnum.BUSINESS ? 'clients' : 'profile'}/${userDetails?.userId ?? ''}`);
  }, [userDetails]);

  const activeLink = useCallback(
    (str: string, subLink?: string) => {
      if (asPath === profileRoute) {
        return str === '/profile';
      }

      return pathname.includes(str) && pathname.endsWith(subLink ?? '');
    },
    [asPath, profileRoute, pathname]
  );

  const toggleLink = (linkName: string) => {
    setExpandedLinks((prev) => ({
      ...prev,
      [linkName]: !prev[linkName],
    }));
  };

  return (
    <>
      {/* Desktop Links */}
      <Box onMouseLeave={() => setOpen(false)} className={`${styles.dSidebar} desktop-only`} sx={{ width: open ? '300px !important' : '80px', backgroundColor: bgColor || '#fff' }}>
        <Box className="d-flex justify-between" mb={7}>
          <Box sx={{ mt: 2, ml: open ? 3 : '15px', width: 50, height: 30 }}>
            <UriLogo href={userDetails?.subscriptionStatus === SubscriptionStatusEnum.ACTIVE ? '/dashboard' : '/'} />
          </Box>

          <GrClose
            className="pointer"
            style={{
              color: '#353F50',
              fontSize: 14,
              fontWeight: 800,
              margin: '25px 30px 0px 0px',
              display: open ? 'block' : 'none',
            }}
            onClick={() => setOpen(false)}
          />
        </Box>
        <Box
          sx={{
            height: 'calc(100vh - 100px)',
            overflowY: 'scroll',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
            msOverflowStyle: 'none',
          }}
        >
          <Box className="tour-features">
            {dashboardLinks.map((item, index) => {
              return item.subLinkers ? (
                <Fragment key={item.route}>
                  <Box
                    className={item.tourKey}
                    sx={{
                      padding: `0px ${open ? '20px' : '10px'}`,
                      mb: 1,
                      cursor: 'pointer',
                    }}
                    onClick={() => toggleLink(item.label)}
                    onMouseEnter={() => setOpen(true)}
                  >
                    <Box
                      className={styles.sidebarButton}
                      sx={{
                        padding: `10px ${open ? '10px' : '16px'}`,
                        backgroundColor: activeLink(item.route) ? `${themeColors.primary} !important` : null,
                        borderColor: activeLink(item.route) ? `${themeColors.primary} !important` : null,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                        }}
                      >
                        <Box className="d-flex">
                          <item.icon
                            style={{
                              width: '18px',
                              height: '18px',
                              color: activeLink(item.route) ? 'white' : themeColors.secondary,
                            }}
                          />
                          {open && (
                            <Text size={14} weight={500} sx={{ ml: 2, whiteSpace: 'nowrap' }} color={activeLink(item.route) ? 'white' : themeColors.secondary}>
                              {item.label}
                            </Text>
                          )}
                        </Box>
                        {open && (
                          <FaChevronDown
                            style={{
                              color: activeLink(item.route) ? 'white' : themeColors.secondary,
                              float: 'right',
                              fontSize: 14,
                              marginTop: 5,
                              transform: expandedLinks[item.label] ? 'rotate(180deg)' : 'rotate(0deg)',
                            }}
                          />
                        )}
                      </Box>
                    </Box>
                  </Box>
                  {expandedLinks[item.label] &&
                    open &&
                    item.subLinkers.map((subLink, index) => (
                      <Link
                        key={index}
                        href={item?.route === '/profile' ? profileRoute : subLink.needId ? `${item.route}/${query.trackerId ?? 0}${subLink?.route}` : `${item.route}${subLink.route}`}
                        onMouseEnter={() => setOpen(true)}
                      >
                        <Box
                          className={styles.sidebarButton}
                          sx={{
                            mx: 4,
                            padding: `6px 10px`,
                            backgroundColor: activeLink(item.route, subLink.route) ? `${themeColors.primary} !important` : null,
                            borderColor: activeLink(item.route, subLink.route) ? `${themeColors.primary} !important` : null,
                            mb: 1,
                          }}
                        >
                          <Box className="d-flex pointer">
                            <subLink.icon
                              style={{
                                width: '18px',
                                height: '18px',
                                color: activeLink(item.route) ? '#dfdfdf' : themeColors.secondary,
                              }}
                            />
                            {open && (
                              <Text size={13} weight={400} sx={{ ml: 2, whiteSpace: 'nowrap' }} color={activeLink(item.route, subLink.route) ? 'white' : themeColors.secondary}>
                                {subLink.label}
                              </Text>
                            )}
                          </Box>
                        </Box>
                      </Link>
                    ))}
                </Fragment>
              ) : (
                <Link key={index} href={item?.route === '/profile' ? profileRoute : item?.route} onMouseEnter={() => setOpen(true)}>
                  <Box className={item.tourKey} sx={{ padding: `0px ${open ? '20px' : '10px'}`, mb: 1 }}>
                    <Box
                      className={styles.sidebarButton}
                      sx={{
                        padding: `10px ${open ? '10px' : '16px'}`,
                        backgroundColor: activeLink(item.route) ? `${themeColors.primary} !important` : null,
                        borderColor: activeLink(item.route) ? `${themeColors.primary} !important` : null,
                      }}
                    >
                      <Box className="d-flex pointer">
                        <item.icon
                          style={{
                            width: '18px',
                            height: '18px',
                            color: activeLink(item.route) ? 'white' : themeColors.secondary,
                          }}
                        />

                        {open && (
                          <Text size={14} weight={500} sx={{ ml: 2, whiteSpace: 'nowrap' }} color={activeLink(item.route) ? 'white' : themeColors.secondary}>
                            {item.label}
                          </Text>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Link>
              );
            })}
          </Box>

          {/* Bottom links */}
          <Box sx={{ mt: { xs: 3, md: 5 }, mb: 5 }}>
            {dashboardBottomLinks.map((item, index) => {
              return (
                <Link key={index} href={item?.route} onMouseEnter={() => setOpen(true)}>
                  <Box className={item.label === 'Settings' ? 'tour-settings-btn' : ''} sx={{ padding: `0px ${open ? '20px' : '10px'}`, mb: 1 }}>
                    <Box
                      className={styles.sidebarButton}
                      sx={{
                        padding: `10px ${open ? '10px' : '16px'}`,
                        backgroundColor: activeLink(item.route) ? `${themeColors.primary} !important` : null,
                        borderColor: activeLink(item.route) ? `${themeColors.primary} !important` : null,
                      }}
                    >
                      <Box className="d-flex pointer">
                        <item.icon
                          style={{
                            width: '18px',
                            height: '18px',
                            color: activeLink(item.route) ? 'white' : themeColors.secondary,
                          }}
                        />
                        {/* <Image
                        src={pathname.includes(item.route) ? item?.activeIcon : item?.icon}
                        alt={item.label}
                        width={24}
                        height={24}
                      /> */}
                        {open && (
                          <Text size={13} weight={500} sx={{ ml: 2 }} color={activeLink(item.route) ? 'white' : themeColors.secondary}>
                            {item.label}
                          </Text>
                        )}
                      </Box>
                    </Box>
                  </Box>
                </Link>
              );
            })}
          </Box>
        </Box>
      </Box>

      {/* Mobile Links */}
      <Box
        className={`${styles.mSidebar} mobile-only`}
        sx={{
          left: open ? '0px !important' : '-100vw',
          backgroundColor: bgColor || themeColors.borderColor,
        }}
      >
        <Box className="d-flex justify-between" mb={4}>
          <Box sx={{ mt: 2, ml: 3 }}>
            <UriLogo />
          </Box>
          <GrClose
            className="pointer"
            style={{
              color: '#353F50',
              fontSize: 13,
              fontWeight: 800,
              margin: '25px 30px 0px 0px',
            }}
            onClick={() => setOpen(false)}
          />
        </Box>
        <Box>
          {dashboardLinks.map((item, index) => {
            return item.subLinkers ? (
              <Fragment key={item.route}>
                <Box
                  sx={{
                    padding: `0px ${open ? '20px' : '10px'}`,
                    mb: 1,
                    cursor: 'pointer',
                  }}
                  onClick={() => toggleLink(item.label)}
                  onMouseEnter={() => setOpen(true)}
                >
                  <Box
                    className={styles.sidebarButton}
                    sx={{
                      padding: `10px 10px`,
                      backgroundColor: activeLink(item.route) ? `${themeColors.primary} !important` : null,
                      borderColor: activeLink(item.route) ? `${themeColors.primary} !important` : null,
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <Box className="d-flex">
                        <item.icon
                          style={{
                            width: '18px',
                            height: '18px',
                            color: activeLink(item.route) ? 'white' : themeColors.secondary,
                          }}
                        />
                        {open && (
                          <Text size={16} weight={500} sx={{ ml: 2 }} color={activeLink(item.route) ? 'white' : themeColors.secondary}>
                            {item.label}
                          </Text>
                        )}
                      </Box>
                      {open && (
                        <FaChevronDown
                          style={{
                            color: activeLink(item.route) ? 'white' : themeColors.secondary,
                            float: 'right',
                            fontSize: 13,
                            marginTop: 5,
                            transform: expandedLinks[item.label] ? 'rotate(180deg)' : 'rotate(0deg)',
                          }}
                        />
                      )}
                    </Box>
                  </Box>
                </Box>

                {expandedLinks[item.label] &&
                  open &&
                  item.subLinkers.map((subLink, index) => (
                    <Link
                      key={index}
                      href={item?.route === '/profile' ? profileRoute : subLink.needId ? `${item.route}/${query.trackerId ?? 0}${subLink?.route}` : `${item.route}${subLink.route}`}
                      onMouseEnter={() => setOpen(true)}
                    >
                      <Box
                        className={styles.sidebarButton}
                        sx={{
                          mx: 4,
                          padding: `10px 16px`,
                          backgroundColor: activeLink(item.route, subLink.route) ? `${themeColors.primary} !important` : null,
                          borderColor: activeLink(item.route, subLink.route) ? `${themeColors.primary} !important` : null,
                          mb: 1,
                        }}
                      >
                        <Box className="d-flex pointer">
                          {open && (
                            <Text size={16} weight={500} sx={{ ml: 2 }} color={activeLink(item.route, subLink.route) ? 'white' : themeColors.secondary}>
                              {subLink.label}
                            </Text>
                          )}
                        </Box>
                      </Box>
                    </Link>
                  ))}
              </Fragment>
            ) : (
              <Link key={index} href={item?.route === '/profile' ? profileRoute : item?.route} onMouseEnter={() => setOpen(true)}>
                <Box sx={{ padding: `0px 20px`, mb: 1 }}>
                  <Box
                    className={styles.sidebarButton}
                    sx={{
                      padding: `10px 10px`,
                      backgroundColor: activeLink(item.route) ? `${themeColors.primary} !important` : null,
                      borderColor: activeLink(item.route) ? `${themeColors.primary} !important` : null,
                    }}
                  >
                    <Box className="d-flex pointer">
                      <item.icon
                        style={{
                          width: '18px',
                          height: '18px',
                          color: activeLink(item.route) ? 'white' : themeColors.secondary,
                        }}
                      />
                      {open && (
                        <Text size={16} weight={500} sx={{ ml: 2 }} color={activeLink(item.route) ? 'white' : themeColors.secondary}>
                          {item.label}
                        </Text>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Link>
            );
          })}
        </Box>
        <Box sx={{ mt: { xs: 3, md: 5 }, mb: 5 }}>
          {dashboardBottomLinks.map((item, index) => {
            return (
              <Link key={index} href={item?.route} onMouseEnter={() => setOpen(true)}>
                <Box sx={{ padding: `0px ${open ? '20px' : '10px'}`, mb: 1 }}>
                  <Box
                    className={styles.sidebarButton}
                    sx={{
                      padding: `10px ${open ? '10px' : '16px'}`,
                      backgroundColor: activeLink(item.route) ? `${themeColors.primary} !important` : null,
                      borderColor: activeLink(item.route) ? `${themeColors.primary} !important` : null,
                    }}
                  >
                    <Box className="d-flex pointer">
                      <item.icon
                        style={{
                          width: '18px',
                          height: '18px',
                          color: activeLink(item.route) ? 'white' : themeColors.secondary,
                        }}
                      />
                      {open && (
                        <Text size={14} weight={500} sx={{ ml: 2 }} color={activeLink(item.route) ? 'white' : themeColors.secondary}>
                          {item.label}
                        </Text>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Link>
            );
          })}
        </Box>
      </Box>
    </>
  );
});

DashSideNav.displayName = 'DashSideNav';

export default DashSideNav;
