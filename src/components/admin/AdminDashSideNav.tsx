import { dashboardAdminBottomLinks, dashboardAdminLinks } from '@/data/dashboard';
import useCustomTheme from '@/hooks/theme.hook';
import styles from '@/styles/Dashboard.module.css';
import { Box } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { GrClose } from 'react-icons/gr';
import Text from '../atoms/CustomText';
import { UriLogo } from '../atoms/Icons';

interface IProps {
  open: boolean;
  setOpen: (state: boolean) => void;
  bgColor?: string;
}

const AdminDashSideNav: React.FC<IProps> = ({ open, setOpen, bgColor }) => {
  const { themeColors } = useCustomTheme();
  const { pathname } = useRouter();

  const activeLink = (str: string) => {
    return pathname.includes(str);
  };

  return (
    <>
      <Box
        className={`${styles.dSidebar} desktop-only`}
        sx={{
          width: open ? '300px !important' : '80px',
          backgroundColor: bgColor || themeColors.borderColor,
        }}
        onMouseLeave={() => setOpen(false)}
      >
        <Box className="d-flex justify-between" mb={7}>
          <Box sx={{ mt: 2, ml: open ? 3 : '15px' }}>
            <UriLogo />
          </Box>
          {open && (
            <GrClose
              className="pointer"
              style={{
                color: '#353F50',
                fontSize: 18,
                fontWeight: 800,
                margin: '25px 30px 0px 0px',
              }}
              onClick={() => setOpen(false)}
            />
          )}
        </Box>
        <Box>
          {dashboardAdminLinks.map((item, index) => {
            return item.route ? (
              <Link key={index} href={item.route} onMouseEnter={() => setOpen(true)}>
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
                          width: '25px',
                          height: '25px',
                          color: activeLink(item.route) ? 'white' : themeColors.secondary,
                        }}
                      />
                      {/* <Image
                        src={userRoutes.profile === asPath ? item?.activeIcon : item?.icon}
                        alt={item.label}
                        width={24}
                        height={24}
                      /> */}
                      {open && (
                        <Text size={16} weight={500} sx={{ ml: 2 }} color={activeLink(item.route) ? 'white' : themeColors.secondary}>
                          {item.label}
                        </Text>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Link>
            ) : null;
          })}
        </Box>
        <Box sx={{ mt: { xs: 3, md: 5 }, mb: 5 }}>
          {dashboardAdminBottomLinks.map((item, index) => {
            return item.route ? (
              <Link key={index} href={item.route} onMouseEnter={() => setOpen(true)}>
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
                          width: '25px',
                          height: '25px',
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
            ) : null;
          })}
        </Box>
      </Box>

      <Box
        className={`${styles.mSidebar} mobile-only`}
        sx={{
          left: open ? '0px !important' : '-100vw',
          backgroundColor: themeColors.borderColor,
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
              fontSize: 18,
              fontWeight: 800,
              margin: '25px 30px 0px 0px',
            }}
            onClick={() => setOpen(false)}
          />
        </Box>
        <Box>
          {dashboardAdminLinks.map((item, index) => {
            return item.route ? (
              <Link key={index} href={item.route} onMouseEnter={() => setOpen(true)}>
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
                          width: '25px',
                          height: '25px',
                          color: activeLink(item.route) ? 'white' : themeColors.secondary,
                        }}
                      />
                      {/* <Image
                        src={activeLink(item.route) ? item?.activeIcon : item?.icon}
                        alt={item.label}
                        width={24}
                        height={24}
                      /> */}
                      {open && (
                        <Text size={16} weight={500} sx={{ ml: 2 }} color={activeLink(item.route) ? 'white' : themeColors.secondary}>
                          {item.label}
                        </Text>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Link>
            ) : null;
          })}
        </Box>
        <Box sx={{ mt: { xs: 3, md: 5 }, mb: 5 }}>
          {dashboardAdminBottomLinks.map((item, index) => {
            return item.route ? (
              <Link key={index} href={item.route} onMouseEnter={() => setOpen(true)}>
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
                          width: '25px',
                          height: '25px',
                          color: activeLink(item.route) ? 'white' : themeColors.secondary,
                        }}
                      />
                      {/* <Image
                        src={activeLink(item.route) ? item?.activeIcon : item?.icon}
                        alt={item.label}
                        width={24}
                        height={24}
                      /> */}
                      {open && (
                        <Text size={16} weight={500} sx={{ ml: 2 }} color={activeLink(item.route) ? 'white' : themeColors.secondary}>
                          {item.label}
                        </Text>
                      )}
                    </Box>
                  </Box>
                </Box>
              </Link>
            ) : null;
          })}
        </Box>
      </Box>
    </>
  );
};

export default AdminDashSideNav;
