import { Box, useMediaQuery } from '@mui/material';
import { parseAsStringLiteral, useQueryState } from 'nuqs';
import { useCallback, useMemo, useState } from 'react';

import CustomTabs from '@/components/atoms/CustomTabs';
import DashboardLayout from '@/components/atoms/DashboardLayout';
import SeoHead from '@/components/atoms/SeoHead';
import GuideTour from '@/components/guide-tour/guide-tour';
import { LEAD_TOUR_STEPS } from '@/components/guide-tour/tour-steps/lead-tour';
import useGuideTour from '@/components/guide-tour/useGuideTour';
import AnalyticsTab from '@/components/lead-tracking/AnalyticsTab';
import FeatureHeader from '@/components/lead-tracking/FeatureHeader';
import ManageTab from '@/components/lead-tracking/LeadsTab';
import LeadsTrackingDetailsTab from '@/components/lead-tracking/LeadsTrackingDetailsTab';
import LeadTabs from '@/components/lead-tracking/ManageLeadsTab';
import ExportLeadsModal from '@/components/modals/ExportLeadsModal';
import GenerateNewLeadModal from '@/components/modals/GenerateNewLeadModal';
import { useLeadTrackingHook } from '@/hooks/leads-tracking/leadsTracking.hook';

const LeadTracking = () => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [openLeadBusinessInfoModal, setOpenLeadBusinessInfoModal] = useState(false);
  const isMobile = useMediaQuery('(max-width:800px)');

  const { run, startTour, steps, handleTourFinish } = useGuideTour({
    initialRun: true,
    steps: LEAD_TOUR_STEPS,
    tourKey: 'hasSeenLeadTour',
  });

  const tabs = ['leads', 'manage', 'analytics', 'details'] as const;

  const [activeTab, setActiveTab] = useQueryState('active_tab', parseAsStringLiteral(tabs).withDefault('leads'));

  const leadsHookData = useLeadTrackingHook(activeTab);

  // Handle lead generation success
  const handleLeadSuccess = useCallback(() => {
    setActiveTab('leads');
    setOpenLeadBusinessInfoModal(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leadsHookData]);

  const toggleExportModal = useCallback(() => {
    setIsExportModalOpen((prev) => !prev);
  }, []);

  const generateButtonText = useMemo(() => (leadsHookData.businessInfoData ? 'Update Business Info' : 'Generate Business Info'), [leadsHookData.businessInfoData]);

  return (
    <>
      <SeoHead title="Lead Generation" />
      <DashboardLayout excludeHeader={true} bgColor="#fff">
        <GuideTour run={run} steps={steps} onFinish={handleTourFinish} onSkip={handleTourFinish} />
        <Box sx={{ bgcolor: '#fff' }}>
          <FeatureHeader
            isMobile={isMobile}
            onClick={() => setOpenLeadBusinessInfoModal(true)}
            loading={leadsHookData.isLoadingBusinessInfo}
            buttonText={generateButtonText}
            onExportClick={toggleExportModal}
            startTour={startTour}
          />

          {/* Tabs */}
          <CustomTabs
            activeTab={activeTab}
            setActiveTab={(tab) => {
              setActiveTab(tab as (typeof tabs)[number]);
              leadsHookData.setPage(1);
            }}
            tabs={[...tabs]}
            tourKey="tour-lead"
          />

          {/* {activeTab === "leads" && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
                px: 3,
                mb: 2,
              }}
            >
              <LoaderWrapper
                isLoading={leadsHookData.isLoadingBusinessInfo}
                numberOfSkeletons={1}
                skeletonHeight="30px"
                skeletonWidth="150px"
              >
                <CountdownTimer targetTime={nextGenerationTimeInSeconds} />
              </LoaderWrapper>
            </Box>
          )} */}

          {/* Tab Content */}
          {useMemo(() => {
            switch (activeTab) {
              case 'leads':
                return (
                  <LeadTabs
                    leadsData={leadsHookData.leadsQuery.data}
                    page={leadsHookData.page}
                    pageSize={leadsHookData.pageSize}
                    setPage={leadsHookData.setPage}
                    setPageSize={leadsHookData.setPageSize}
                    loading={leadsHookData.leadsQuery.isLoading}
                  />
                );
              case 'manage':
                return (
                  <ManageTab
                    pageSize={leadsHookData.pageSize}
                    setPageSize={leadsHookData.setPageSize}
                    layout={leadsHookData.layout}
                    setLayout={leadsHookData.setLayout}
                    search={leadsHookData.search}
                    setSearch={leadsHookData.setSearch}
                    page={leadsHookData.page}
                    setPage={leadsHookData.setPage}
                    isGettingLeads={leadsHookData.isLoadingLeads}
                    leadsData={leadsHookData.leadsQuery}
                    allLeads={leadsHookData.allLeads}
                    getPaginationFunction={leadsHookData.getPaginationFunction}
                  />
                );
              case 'analytics':
                return <AnalyticsTab leadAnalyticsData={leadsHookData.leadAnalyticsData} loading={leadsHookData.isLoadingAnalytics} />;
              case 'details':
                return <LeadsTrackingDetailsTab leadsTrackingInfoDetails={leadsHookData.businessInfoData || {}} loading={leadsHookData.isLoadingBusinessInfo} />;
              default:
                return null;
            }
          }, [activeTab, leadsHookData])}

          {/* {activeTab === "chats" && <ChatsTab />} */}
        </Box>
      </DashboardLayout>

      <GenerateNewLeadModal
        onSuccessPrimaryAction={() => setActiveTab('leads')}
        openModal={openLeadBusinessInfoModal}
        setOpenModal={setOpenLeadBusinessInfoModal}
        loading={leadsHookData.isGeneratingLead}
        onClick={(data, successFunction) =>
          leadsHookData.generateLead({
            data,
            onSuccessFunction: () => {
              successFunction();
              handleLeadSuccess();
            },
          })
        }
        leadBusinessInfo={leadsHookData.businessInfoData}
      />

      <ExportLeadsModal
        open={isExportModalOpen}
        toggleModal={toggleExportModal}
        feature="Leads"
        generateLeadReport={leadsHookData.generateLeadReport}
        isGeneratingReport={leadsHookData.isGeneratingReport}
      />
    </>
  );
};

export default LeadTracking;
