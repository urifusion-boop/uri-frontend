import { isFeatureUnlimited } from '@/configs/rules.config';
import { LeadHelper } from '@/helpers/LeadHelper';
import { TextHelper } from '@/helpers/TextHelper';
import { useLeadTrackingHook } from '@/hooks/leads-tracking/leadsTracking.hook';
import { useRealtimeLeads } from '@/hooks/leads-tracking/useRealtimeLeads.hook';
import { LeadTypeEnum } from '@/models/enum-models/LeadTypeEnum';
import { useAuth } from '@/providers/AuthProvider';
import { useFeatureLimitStore } from '@/store/useFeatureLimitStore';
import ContactedIcon from '@/utils/icon/ContactedIcon';
import InboxSolid from '@/utils/icon/InboxSolid';
import { Box, Grid, useMediaQuery } from '@mui/material';
import router from 'next/router';
import { parseAsStringLiteral, useQueryState } from 'nuqs';
import { useCallback, useMemo, useState } from 'react';
import { FaCheckCircle, FaTrophy } from 'react-icons/fa';
import { HiMiniMinusCircle } from 'react-icons/hi2';
import CustomTabs from '../atoms/CustomTabs';
import MetricCard from '../cards/MetricCard';
import SummaryCard from '../cards/SummaryCard';
import { LEAD_TOUR_STEPS } from '../guide-tour/tour-steps/lead-tour';
import useGuideTour from '../guide-tour/useGuideTour';
import LeadsImportModal from '../imports/LeadsImportModal';
import ExportLeadsModal from '../modals/ExportLeadsModal';
import TrackLimit from '../trackers/TrackLimit';
import AnalyticsTab from './AnalyticsTab';
import FeatureHeader from './FeatureHeader';
import FormSnapshotTab from './FormSnapshotTab';
import LeadsTab from './LeadsTab';
import ManageLeadsTab from './ManageLeadsTab';

// components/lead-tracking/LeadsView.tsx
type LeadsViewProps = {
  leadType: LeadTypeEnum;
  label: string;
  icon: React.ReactElement;
  excludeTabs?: string[]; // optional list of tabs to hide
};

const LeadsView = ({ leadType, label, icon, excludeTabs = [] }: LeadsViewProps) => {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:800px)');
  const tabs = ['leads', 'manage', 'snapshots', 'analytics'] as string[];
  const filteredTabs = useMemo(() => tabs.filter((t) => !excludeTabs.includes(t)), [excludeTabs]);

  const defaultTab = filteredTabs.includes('leads') ? 'leads' : filteredTabs[0];
  const [activeTab, setActiveTab] = useQueryState('active_tab', parseAsStringLiteral(filteredTabs).withDefault(defaultTab as (typeof filteredTabs)[number]));

  const leadsHookData = useLeadTrackingHook(activeTab, leadType);

  const toggleExportModal = useCallback(() => setIsExportModalOpen((prev) => !prev), []);
  const generateButtonText = useMemo(() => (leadsHookData.existingLeadForm ? `Update ${label} Form` : `Generate ${label} Form`), [leadsHookData.existingLeadForm, label]);

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const toggleImportModal = useCallback(() => setIsImportModalOpen((prev) => !prev), []);

  const [progressOpen, setProgressOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importId, setImportId] = useState<string | null>(null);

  const { run, startTour, steps, handleTourFinish } = useGuideTour({
    initialRun: true,
    steps: LEAD_TOUR_STEPS,
    tourKey: 'hasSeenLeadTour',
  });

  const { subscriptionPlanType } = useAuth();
  const { userDetails } = useAuth();
  const userId = userDetails?.userId;
  const wsDisabled = true;

  // Connect to realtime updates to auto-update stats and remaining leads
  useRealtimeLeads({ userId, autoConnect: !wsDisabled });

  const featureLimit = useFeatureLimitStore((state) => state.featureLimit);
  const isLimitInitialState = useFeatureLimitStore((state) => state.isInitialState);

  const metricsData: any[] = [
    {
      title: 'New',
      value: leadsHookData.leadAnalyticsData?.new_leads ?? 0,
      icon: <InboxSolid style={{ width: '24px', height: '24px' }} />,
    },
    {
      title: 'Contacted',
      value: leadsHookData.leadAnalyticsData?.contacted ?? 0,
      icon: <ContactedIcon style={{ width: '24px', height: '24px' }} />,
    },
    {
      title: 'Qualified',
      value: leadsHookData.leadAnalyticsData?.qualified ?? 0,
      icon: <FaCheckCircle size={24} color="#CD1B78" />,
    },
    {
      title: 'Unqualified',
      value: leadsHookData.leadAnalyticsData?.unqualified ?? 0,
      icon: <HiMiniMinusCircle size={24} color="#CD1B78" />,
    },
    {
      title: 'Converted',
      value: leadsHookData.leadAnalyticsData?.converted ?? 0,
      icon: <FaTrophy size={24} color="#CD1B78" />,
    },
  ];

  return (
    <>
      <FeatureHeader
        isMobile={isMobile}
        onClick={() => router.push(`/leads-tracking/forms/manage?type=${LeadHelper.getLeadFormType(leadType)}`)}
        loading={leadsHookData.isLoadingLeadForm}
        buttonText={generateButtonText}
        onExportClick={toggleExportModal}
        //onImportClick={toggleImportModal}
        icon={icon}
        title={`${label} Leads`}
      />

      {/* Summary Section */}
      <Grid container spacing={2} mb={2} mt={2} bgcolor="#f9fafb" p={2} borderRadius={2}>
        <Grid item md={2.5} xs={12} className="tour-lead-total">
          <SummaryCard count={(featureLimit.lead?.noOfLeads?.limit ?? 0) - (featureLimit.lead?.noOfLeads?.count ?? 0)} label="No of Leads Remaining" />
        </Grid>
        <Grid item md={2.5} xs={12} className="tour-lead-total">
          <SummaryCard
            count={(featureLimit.lead?.credits?.limit ?? 0) - (featureLimit?.lead?.credits?.count ?? 0)}
            label="Credit Balance"
            tooltipText={`1 Credit = Unlock 1 Email Address\n 9 Credits = Unlock 1 Phone Number`}
          />
        </Grid>
        {!isLimitInitialState && (
          <Grid item md={7} xs={12} className="tour-keyword-limit">
            <TrackLimit
              planName={TextHelper.removeChar(subscriptionPlanType ?? '', '_')}
              planLimit={featureLimit?.lead?.noOfLeads?.limit}
              currentUsage={featureLimit?.lead?.noOfLeads?.count}
              description={`This plan allows you to track ${isFeatureUnlimited(featureLimit?.lead?.noOfLeads?.limit) ? 'unlimited.\n 1 Credit = Unlock 1 Email Address\n 9 Credits = Unlock 1 Phone Number' : featureLimit?.lead?.noOfLeads?.limit} leads.`}
            />
          </Grid>
        )}
      </Grid>

      <Box sx={{ bgcolor: '#FAFAFA', py: 4, mt: 4, px: { xs: 2, sm: 4, md: 6 } }}>
        <Grid container spacing={2}>
          {metricsData?.map((metric, index) => (
            <Grid item xs={12} sm={6} md={2.4} key={index}>
              <MetricCard metric={metric} isMobile={isMobile} isLoading={leadsHookData.isLoadingAnalytics} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <CustomTabs
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab as (typeof filteredTabs)[number]);
          leadsHookData.setPage(1);
        }}
        tabs={filteredTabs}
        tourKey="tour-lead"
      />

      {useMemo(() => {
        switch (activeTab) {
          case 'leads':
            return (
              <LeadsTab
                layout={leadsHookData.layout}
                setLayout={leadsHookData.setLayout}
                search={leadsHookData.search}
                setSearch={leadsHookData.setSearch}
                page={leadsHookData.page}
                pageSize={leadsHookData.pageSize}
                setPage={leadsHookData.setPage}
                setPageSize={leadsHookData.setPageSize}
                isGettingLeads={leadsHookData.isLoadingLeads}
                leadsData={leadsHookData.leadsQuery}
                allLeads={leadsHookData.allLeads}
                getPaginationFunction={leadsHookData.getPaginationFunction}
                leadType={leadType}
                refresh={leadsHookData.leadsQuery.refetch}
              />
            );
          case 'manage':
            return (
              <ManageLeadsTab
                leadsData={leadsHookData.leadsQuery.data}
                page={leadsHookData.page}
                pageSize={leadsHookData.pageSize}
                setPage={leadsHookData.setPage}
                setPageSize={leadsHookData.setPageSize}
                loading={leadsHookData.leadsQuery.isLoading}
              />
            );
          case 'snapshots':
            return <FormSnapshotTab leadType={leadType} />;
          case 'analytics':
            return <AnalyticsTab leadAnalyticsData={leadsHookData.leadAnalyticsData} loading={leadsHookData.isLoadingAnalytics} leadType={leadType} />;
        }
      }, [activeTab, leadsHookData])}

      <ExportLeadsModal
        open={isExportModalOpen}
        toggleModal={toggleExportModal}
        feature="Leads"
        generateLeadReport={leadsHookData.generateLeadReport}
        isGeneratingReport={leadsHookData.isGeneratingReport}
        extraParams={{
          leadType: leadType,
        }}
      />

      {/* <LeadsImportModal open={isImportModalOpen} onClose={toggleImportModal} onNext={() => setProgressOpen(true)} onSyncApp={() => { }} isSyncingDisabled={true} /> */}

      <LeadsImportModal open={isImportModalOpen} onClose={toggleImportModal} isSyncingDisabled={true} />
    </>
  );
};

export default LeadsView;
