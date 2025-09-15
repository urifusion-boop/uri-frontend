import { NotificationService } from '@/api/NotificationService';
import { queryClient } from '@/configs/query-client.config';
import { FIVE_MINUTES } from '@/data/time';
import { UserNotificationDto } from '@/models/dtos/UserNotificationDto';
import { useAuth } from '@/providers/AuthProvider';
import HardDrive from '@/utils/icon/HardDrive';
import { Backdrop, Badge, Box, ClickAwayListener, Skeleton, styled, Tooltip, TooltipProps, Typography } from '@mui/material';
import { useInfiniteQuery, useMutation } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import Spinner from '../loaders/Spinner';
import CustomModal from '../modals/CustomModal';
import Text from './CustomText';
import { DashboardNotificationIcon } from './Icons';

const StyledTooltip = styled(({ className, ...props }: TooltipProps) => <Tooltip {...props} classes={{ popper: className }} />)(({ theme }) => ({
  [`& .MuiTooltip-tooltip`]: {
    backgroundColor: 'transparent',
    color: '#333',
    // boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    // overflow: 'hidden',
    fontSize: '14px',
    padding: '0',
    maxWidth: 426,
    minWidth: 426,
    marginLeft: '10px',

    [theme.breakpoints.down('sm')]: {
      maxWidth: '90vw',
      minWidth: '90vw',
    },
    [theme.breakpoints.between('sm', 'md')]: {
      maxWidth: '70vw',
      minWidth: '70vw',
    },
  },
  [`& .MuiTooltip-arrow`]: {
    color: '#fff',
    fontSize: '40px',
  },
}));

const NotificationDropDown = () => {
  const { userDetails } = useAuth();
  const [openNotificationModal, setOpenNotificationModal] = useState(false);
  const [viewNotification, setViewNotification] = useState<UserNotificationDto>({} as UserNotificationDto);
  const [openTooltip, setOpenTooltip] = useState(false);

  const handleTooltipClose = () => {
    setOpenTooltip(false);
  };

  const handleTooltipToggle = (event: React.MouseEvent<HTMLButtonElement>): void => {
    event.stopPropagation();
    setOpenTooltip((prev) => !prev);
  };

  const {
    data: notificationsData,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    refetch: refetchNotifications,
  } = useInfiniteQuery({
    queryKey: ['user-notification', userDetails?.userId],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await NotificationService.getNotificationssByFilterApi({
        pageNumber: pageParam,
        pageSize: 10,
        userId: userDetails?.userId,
      });

      return result.responseData;
    },
    getNextPageParam: (lastPage) => {
      const totalPages = Math.ceil((lastPage?.pageSize ?? 1) / 10);

      return (Number(lastPage?.page) || 1) < totalPages ? Number(lastPage?.page) + 1 : undefined;
    },
    staleTime: FIVE_MINUTES,
  });

  const notifications = useMemo(() => {
    return notificationsData?.pages.flatMap((page) => page?.data ?? []) ?? [];
  }, [notificationsData]);

  const { mutate: readNotification } = useMutation({
    mutationFn: async (notificationId: string) => {
      await NotificationService.marknotificationAsReadApi(notificationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['user-notification']);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const { mutate: readAllNotifications, isLoading: isReadAllLoading } = useMutation({
    mutationFn: async () => {
      await NotificationService.markAllNotificationsAsReadApi(userDetails?.userId ?? '');
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['user-notification']);
      refetchNotifications();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n?.isRead).length;
  }, [notifications]);

  return (
    <>
      <Backdrop sx={(theme) => ({ zIndex: theme.zIndex.drawer + 1 })} open={openTooltip} onClick={handleTooltipClose} />

      <Box sx={{ mx: { xs: 1, md: 2 }, display: 'flex', alignItems: 'center' }}>
        <Box>
          <ClickAwayListener onClickAway={handleTooltipClose}>
            <Box>
              <StyledTooltip
                disableFocusListener
                disableHoverListener
                disableTouchListener
                onClose={handleTooltipClose}
                open={openTooltip}
                arrow
                placement="bottom-end"
                slotProps={{
                  popper: {
                    disablePortal: true,
                    modifiers: [
                      {
                        name: 'offset',
                        options: {
                          offset: [30, 0],
                        },
                      },
                    ],
                  },
                }}
                title={
                  <Box
                    sx={{
                      borderRadius: '20px',
                      backgroundColor: '#F9F9F9',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Header */}
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '19px 21px',
                        borderBottom: '1px solid #C2BCBC99',
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: '20px',
                          fontWeight: '600',
                          color: '#2C2C2C',
                        }}
                      >
                        Notifications
                      </Typography>
                      <Box
                        component="button"
                        sx={{ display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: '#ECECEC', padding: '8px', borderRadius: '6px' }}
                        onClick={() => {
                          if (unreadCount === 0) return;
                          readAllNotifications();
                        }}
                        disabled={isReadAllLoading}
                      >
                        {isReadAllLoading ? (
                          <Spinner size={15} color="#000" />
                        ) : (
                          <>
                            <Badge
                              anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                              }}
                              sx={{
                                '& .MuiBadge-badge': {
                                  top: 5,
                                  left: 2,
                                  backgroundColor: '#EB4135',
                                },
                              }}
                              variant="dot"
                              invisible={notifications?.every((data) => data?.isRead)}
                            >
                              <HardDrive size={20} color="#343333" />
                            </Badge>
                            <Typography
                              sx={{
                                fontSize: '12px',
                                fontWeight: '600',
                                color: '#000000CC',
                              }}
                            >
                              {unreadCount} unread
                            </Typography>
                          </>
                        )}
                      </Box>
                    </Box>

                    {/* Body */}
                    <Box
                      sx={{
                        maxHeight: '362px',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                      }}
                      className="scroll"
                      onScroll={(e) => {
                        const bottom = Math.ceil(e.currentTarget.scrollTop + e.currentTarget.clientHeight) >= e.currentTarget.scrollHeight - 1;

                        if (bottom && hasNextPage && !isFetchingNextPage) {
                          fetchNextPage();
                        }
                      }}
                    >
                      {(notifications ?? [])?.length > 0 ? (
                        notifications?.map((notification) => (
                          <Box
                            component="button"
                            key={notification?.notificationId}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '10.5px',
                              borderBottom: '0.85px solid #C2BCBC99',
                              backgroundColor: notification?.isRead ? 'white' : '#FFD6EC73',
                              ':hover': {
                                bgcolor: notification?.isRead ? '#f9f9f9' : '#FFD6EC73',
                              },
                              padding: '16px 21px',
                              width: '100%',
                              overflow: 'hidden',
                            }}
                            onClick={() => {
                              readNotification(String(notification?.notificationId));
                              if (notification) {
                                setViewNotification(notification);
                              }
                              setOpenNotificationModal(true);
                              handleTooltipClose();
                            }}
                          >
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                bgcolor: '#CD1B78',
                                height: '30px',
                                width: '30px',
                                borderRadius: '50%',
                              }}
                            >
                              {notification?.icon && notification?.icon?.length > 10 ? (
                                <img alt="notification icon" src={notification?.icon} width={15} height={15} />
                              ) : (
                                <Text size={15} weight={600}>
                                  {notification?.icon}
                                </Text>
                              )}
                            </Box>
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                flexDirection: 'column',
                              }}
                            >
                              <Typography
                                sx={{
                                  color: '#292929',
                                  fontSize: '14px',
                                  fontWeight: '600',
                                  textAlign: 'left',
                                }}
                              >
                                {notification?.message?.slice(0, 40) + '...' || ''}
                              </Typography>
                              <Typography
                                sx={{
                                  color: '#5C5C5C',
                                  fontSize: '12px',
                                  fontWeight: '500',
                                }}
                              >
                                {dayjs(notification?.createdAt).format('DD-MM-YYYY')}
                              </Typography>
                            </Box>
                          </Box>
                        ))
                      ) : (
                        <Text size={15} weight={500} sx={{ my: 5 }} center>
                          You have no notifications.
                        </Text>
                      )}
                      {(isLoading || isFetchingNextPage) && <Skeleton variant="rectangular" animation="wave" width={'100%'} height={50} />}
                    </Box>
                  </Box>
                }
              >
                <button
                  style={{
                    padding: '10px',
                    backgroundColor: '#E9E9E94D',
                    borderRadius: '10px',
                  }}
                  onClick={handleTooltipToggle}
                  className="tour-notification-btn"
                >
                  <Badge
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'left',
                    }}
                    sx={{
                      '& .MuiBadge-badge': {
                        top: 5,
                        left: 10,
                        backgroundColor: '#EB4135',
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                      },
                    }}
                    variant="dot"
                    invisible={notifications?.every((data) => data?.isRead)}
                  >
                    <DashboardNotificationIcon />
                  </Badge>
                </button>
              </StyledTooltip>
            </Box>
          </ClickAwayListener>
        </Box>
      </Box>
      <CustomModal width="556px" open={openNotificationModal} setOpen={setOpenNotificationModal} closeOnOverlayClick={true}>
        <Box className="d-flex justify-marginLeft">
          <Box
            style={{
              width: '48px',
            }}
          >
            <Text size={30} weight={600}>
              {viewNotification.icon}
            </Text>
          </Box>
          <Box
            style={{
              width: 'calc(100% - 120px)',
            }}
          >
            <Text size={16} weight={700} sx={{ mb: 1 }}>
              {viewNotification.message}
            </Text>
            <Box className="d-flex justify-between">
              <Text size={16} weight={400} sx={{ mb: 1 }}>
                {dayjs(viewNotification.createdAt).format('DD-MM-YYYY')}
              </Text>
            </Box>
          </Box>
        </Box>
      </CustomModal>
    </>
  );
};

export default NotificationDropDown;
