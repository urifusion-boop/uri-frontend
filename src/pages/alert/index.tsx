import { Avatar, Box, Button, Tooltip, Typography, useMediaQuery } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { FaStar, FaTrash } from 'react-icons/fa6';

import CustomTabs from '@/components/atoms/CustomTabs';
import DashboardLayout from '@/components/atoms/DashboardLayout';
import EmptyState from '@/components/atoms/EmptyState';
import FeatureLimitLock from '@/components/atoms/FeatureLimitLock';
import LoaderWrapper from '@/components/atoms/LoaderWrapper';
import SeoHead from '@/components/atoms/SeoHead';
import AlertDetail from '@/components/features/alert/AlertDetail';
import AlertList from '@/components/features/alert/AlertList';
import AlertSideBar from '@/components/features/alert/AlertSideBar';
import AnalyticsTab from '@/components/features/alert/AnalyticsTab';
import InboxFilters from '@/components/features/alert/InboxFilters';
import BeaconBubble from '@/components/guide-tour/bubble';
import GuideTour from '@/components/guide-tour/guide-tour';
import { ALERT_TOUR_STEPS } from '@/components/guide-tour/tour-steps/alert-tour';
import useGuideTour from '@/components/guide-tour/useGuideTour';
import ExportLeadsModal from '@/components/modals/ExportLeadsModal';
import { isFeatureDisabled } from '@/configs/rules.config';
import { useAlertHook } from '@/hooks/alert/alert.hook';
import { MentionDto } from '@/models/dtos/MentionInsightsDto';
import { useFeatureLimitStore } from '@/store/useFeatureLimitStore';
import AlertOnFilled from '@/utils/icon/AlertOnFilled';
import { useQueryState } from 'nuqs';
import { HiMailOpen } from 'react-icons/hi';

const Alert = () => {
  const [mentionsState, setMentionsState] = useState<(MentionDto | undefined)[]>([]);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const featureLimit = useFeatureLimitStore((state) => state.featureLimit);

  const { run, startTour, steps, handleTourFinish } = useGuideTour({
    initialRun: true,
    steps: ALERT_TOUR_STEPS,
    tourKey: 'hasSeenAlertTour',
  });

  const toggleExportModal = () => setIsExportModalOpen(!isExportModalOpen);

  const {
    filter,
    setFilter,
    selectedMention,
    setSelectedMention,
    markAsReadMutation,
    useMentions,
    markAsDeleteMutation,
    markAsStarredMutation,
    alertAnalysisData,
    selectedDate,
    setSelectedDate,
    readInbox,
    setReadInbox,
  } = useAlertHook();

  const tabs = ['mentions', 'analytics'];

  const [activeTab, setActiveTab] = useQueryState('active_tab', {
    defaultValue: 'mentions',
  });

  const isMobile = useMediaQuery('(max-width:800px)');

  const { data: mentionsData, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useMentions();

  const mentions = useMemo(() => mentionsData?.pages.flatMap((page) => page.mentions?.data ?? []) ?? [], [mentionsData]);

  const getIcon = (filter: string) => {
    switch (filter) {
      case 'inbox':
        return <HiMailOpen color="#000" size={50} />;
      case 'starred':
        return <FaStar color="#000" size={50} />;
      default:
        return <FaTrash color="#000" size={50} />;
    }
  };

  useEffect(() => {
    if (mentions) {
      setMentionsState(mentions);
    }
  }, [mentions]);

  return (
    <>
      <SeoHead title="Alerts" />
      <DashboardLayout excludeHeader={true} bgColor="#fff">
        <GuideTour run={run} steps={steps} onFinish={handleTourFinish} onSkip={handleTourFinish} />
        <Box
          sx={{
            bgcolor: '#fff',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: isMobile ? 'flex-start' : 'center',
              justifyContent: 'space-between',
              flexDirection: isMobile ? 'column' : 'row',
              gap: 2,
              pt: 3,
              px: 3,
              bgcolor: '#fff',
            }}
          >
            <Header startTour={startTour} isMobile={isMobile} onExportClick={toggleExportModal} />
          </Box>
          {/* Tabs */}

          {!isFeatureDisabled(featureLimit, 'alert') ? (
            <>
              <CustomTabs activeTab={activeTab} setActiveTab={setActiveTab} tabs={tabs} tourKey="tour-alert" />

              {activeTab === 'mentions' && (
                <Box sx={{ display: 'flex' }}>
                  <AlertSideBar
                    onClick={(filter) => {
                      setFilter(filter);
                      setSelectedMention(null);
                    }}
                    selectedFilter={filter}
                    totalAlerts={mentionsData?.pages?.[0]?.mentions?.pageSize ?? 0}
                  />
                  <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }} className="pl-[5px] md:pl-[30px]">
                    <Box
                      sx={{
                        display: 'flex',
                        flex: 1,
                        alignItems: 'flex-start',
                      }}
                    >
                      <Box
                        sx={{
                          width: '40%',
                          borderRight: '1px solid #eaeaea',
                          overflowY: 'auto',
                          maxHeight: 'calc(100vh - 200px)',
                          overflowX: 'hidden',
                        }}
                        className="scroll pr-[5px] md:pr-[30px]"
                        onScroll={(e) => {
                          const bottom = Math.ceil(e.currentTarget.scrollTop + e.currentTarget.clientHeight) >= e.currentTarget.scrollHeight;

                          if (bottom && !isFetchingNextPage) {
                            hasNextPage && fetchNextPage();
                          }
                        }}
                      >
                        <LoaderWrapper isLoading={isLoading} skeletonHeight="calc(100vh - 200px)">
                          {mentionsState.length === 0 ? (
                            <Box
                              sx={{
                                height: 'calc(100vh - 200px)',
                              }}
                            >
                              <Box>
                                <EmptyState icon={getIcon(filter)} actionRequired={false} heading={`No ${filter} alerts`} subtitle={`You have no ${filter} alerts`} />
                              </Box>
                            </Box>
                          ) : (
                            <>
                              <InboxFilters selectedInboxFilter={readInbox} selectedFilter={filter} setSelectedInboxFilter={setReadInbox} />
                              <AlertList
                                alerts={mentionsState}
                                onClick={(mention) => {
                                  setSelectedMention(mention);
                                  setMentionsState(
                                    mentionsState.map((m) => {
                                      if (m?.mention_id === mention.mention_id) {
                                        return {
                                          ...m,
                                          is_read: true,
                                        };
                                      }
                                      return m;
                                    })
                                  );

                                  markAsReadMutation.mutate(mention.mention_id ?? '');
                                }}
                                isFetchingMore={isFetchingNextPage}
                              />
                            </>
                          )}
                        </LoaderWrapper>
                      </Box>
                      <Box
                        sx={{
                          width: '60%',
                          overflowY: 'auto',
                          maxHeight: 'calc(100vh - 200px)',
                          overflowX: 'hidden',
                        }}
                        className="scroll"
                      >
                        <LoaderWrapper isLoading={isLoading} skeletonHeight="500px">
                          <AlertDetail
                            data={selectedMention}
                            handleDeleteClick={(data) => markAsDeleteMutation.mutate(data?.mention_id)}
                            handleStarClick={(data) =>
                              markAsStarredMutation.mutate({
                                mentionId: data?.mention_id ?? '',
                                starred: !data?.starred,
                              })
                            }
                          />
                        </LoaderWrapper>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}

              {activeTab === 'analytics' && (
                <AnalyticsTab alertAnalysisData={alertAnalysisData.data} selectedDate={selectedDate} setSelectedDate={setSelectedDate} loading={alertAnalysisData.isLoading} />
              )}
            </>
          ) : (
            <FeatureLimitLock />
          )}
        </Box>
      </DashboardLayout>

      <ExportLeadsModal open={isExportModalOpen} toggleModal={toggleExportModal} feature="Data" />
    </>
  );
};

export default Alert;

type HeaderProps = {
  isMobile: boolean;
  onExportClick?: () => void;
  startTour?: () => void;
};

const Header = ({ isMobile, onExportClick, startTour }: HeaderProps) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
    }}
  >
    <Typography fontWeight="bold" display="flex" alignItems="center" sx={{ whiteSpace: 'nowrap' }} fontSize={isMobile ? 22 : 30}>
      <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
        <AlertOnFilled
          style={{
            height: '30px',
            width: '30px',
            color: '#fff',
          }}
        />
      </Avatar>
      Alerts
      {startTour && <BeaconBubble onClick={startTour} />}
    </Typography>
    <Tooltip title="Coming soon">
      <Button
        variant="contained"
        color="primary"
        sx={{
          px: 3,
          py: 1,
          width: isMobile ? '100%' : 'auto',
        }}
        onClick={() => {
          return;
          // onExportClick?.();
        }}
        className="tour-alert-export-btn"
      >
        Export
      </Button>
    </Tooltip>
  </Box>
);
