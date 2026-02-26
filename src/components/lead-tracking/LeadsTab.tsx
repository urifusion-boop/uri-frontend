import { GetByFiltersLeadsDto, LeadDto } from '@/models/dtos/LeadsDto';
import { TwitterFetchResponseDto } from '@/models/dtos/TwitterDto';
import { ViewColumn, ViewModule } from '@mui/icons-material';
import { Box, Button, Chip, IconButton, Skeleton, Tooltip, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';

import { LightThemeColors } from '@/configs/colors.config';
import { useLeadFormHooks } from '@/hooks/lead-form/leadForm.hook';
import { FormTypeEnum } from '@/models/enum-models/FormTypeEnum';
import { LeadStatusEnum } from '@/models/enum-models/LeadStatusEnum';
import { LeadTypeEnum } from '@/models/enum-models/LeadTypeEnum';
import { useAuth } from '@/providers/AuthProvider';
import { useLeadTrackingStore } from '@/store/leads-tracking/useLeadTrackingStore';
import BoltIcon from '@mui/icons-material/Bolt';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import RefreshIcon from '@mui/icons-material/Refresh';
import { UseQueryResult } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import Select from '../atoms/Select';
import LeadKanban from '../features/alert/LeadKanban';
import SingleFieldInput from '../input/SingleFieldInput';
import BusinessTableCard from './BusinessTableCard';
import ConversationalTableCard from './ConversationalTableCard';
import IndividualTableCard from './IndividualTableCard';
import OrganizationTableCard from './OrganizationTableCard';
import RealtimeLeadsDashboard from './RealtimeLeadsDashboard';
// Removed manual Save Twitter Leads functionality; auto-save now handled in fetch flow

interface LeadsTabProps {
  setLayout: (value: string) => void;
  isGettingLeads: boolean;
  page: number;
  pageSize: number;
  leadsData: UseQueryResult<GetByFiltersLeadsDto | null | undefined, unknown>;
  allLeads: (LeadDto | undefined)[];
  getPaginationFunction: any;
  setPage: (value: number) => void;
  setPageSize: (value: number) => void;
  search: string;
  setSearch: (value: string) => void;
  layout: string;
  leadType?: LeadTypeEnum;
  refresh?: () => void;
}

const LeadsTab = ({ allLeads, leadsData, isGettingLeads, getPaginationFunction, page, pageSize, setPage, setPageSize, search, setSearch, layout, setLayout, leadType, refresh }: LeadsTabProps) => {
  const filtersStore = useLeadTrackingStore((state) => state);
  const router = useRouter();
  const { userDetails } = useAuth();
  const userId = userDetails?.userId;
  const [twitterData, setTwitterData] = useState<TwitterFetchResponseDto | null>(null);

  // Fetch forms for the current lead type
  const { useGetFormsByUserAndType } = useLeadFormHooks();

  // Map LeadTypeEnum to FormTypeEnum
  const formTypeMap: Record<LeadTypeEnum, FormTypeEnum> = {
    [LeadTypeEnum.PERSON]: FormTypeEnum.PERSON,
    [LeadTypeEnum.ORGANIZATION]: FormTypeEnum.ORGANIZATION,
    [LeadTypeEnum.CONVERSATIONAL]: FormTypeEnum.CONVERSATIONAL,
    [LeadTypeEnum.BUSINESS]: FormTypeEnum.BUSINESS,
    [LeadTypeEnum.GOOGLE_MAPS]: FormTypeEnum.GOOGLE_MAPS,
  };

  const formType = leadType ? formTypeMap[leadType] : undefined;

  const { data: formsResponse } = useGetFormsByUserAndType(userId || '', formType || FormTypeEnum.PERSON);

  // Create form options for the dropdown
  const formOptions = useMemo((): { value: string; label: string; form_title: string }[] => {
    if (!formsResponse || !Array.isArray(formsResponse)) {
      const forms = (formsResponse as any)?.data || [];
      if (!forms || forms.length === 0) return [];

      const formsList = forms.map((form: any) => ({
        value: form.lead_form_id,
        label: form.form_title,
        form_title: form.form_title,
      }));

      return formsList as { value: string; label: string; form_title: string }[];
    }
    return [];
  }, [formsResponse]);

  // Check if conversational type for real-time option
  const isConversationalType = leadType === LeadTypeEnum.CONVERSATIONAL;

  // Check if we're coming from Twitter source
  const isTwitterSource = router.query.source === 'twitter';

  // Load Twitter data from localStorage when coming from Twitter source
  useEffect(() => {
    if (isTwitterSource && isConversationalType) {
      const storedTwitterData = localStorage.getItem('twitterResults');
      if (storedTwitterData) {
        try {
          const parsedData = JSON.parse(storedTwitterData);
          setTwitterData(parsedData);
        } catch (error) {
          console.error('Error parsing Twitter data:', error);
        }
      }
    }
  }, [isTwitterSource, isConversationalType]);

  return (
    <Box className="bg-white h-full p-4 border-l">
      <Box className="flex items-center justify-between">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography className="text-2xl font-medium">{isTwitterSource && twitterData ? `${twitterData.responseData.total_tweets} Twitter Results` : `${leadsData?.data?.total} Leads`}</Typography>
          {isConversationalType && layout === 'realtime' && (
            <Chip
              icon={<BoltIcon sx={{ fontSize: 14 }} />}
              label="Real-time V2"
              size="small"
              sx={{
                backgroundColor: '#fef3c7',
                color: '#92400e',
                fontWeight: 600,
                fontSize: '11px',
              }}
            />
          )}
          {isTwitterSource && twitterData && (
            <Chip
              label="Twitter Data"
              size="small"
              sx={{
                backgroundColor: '#dbeafe',
                color: '#1e40af',
                fontWeight: 600,
                fontSize: '11px',
              }}
            />
          )}
          {/* Save Twitter Leads button removed: auto-save now occurs on fetch */}
          {isConversationalType && !isTwitterSource && (
            <Button
              variant="outlined"
              size="small"
              sx={{ ml: 1, textTransform: 'none', borderRadius: 2 }}
              onClick={() => router.push('/leads-tracking/forms/leads?type=conversational&source=twitter')}
            >
              Open Twitter View
            </Button>
          )}
        </Box>
      </Box>
      <Box
        sx={{
          justifyContent: 'space-between',
          display: 'flex',
          flexWrap: { xs: 'nowrap', md: 'wrap' },
          overflowX: { xs: 'auto', md: 'visible' },
          gap: 2,
          alignItems: 'center',
          pb: 1,
          mt: 2,
          width: '100%',
          '& > *': { flexShrink: 0 }, // prevent shrinking
        }}
      >
        {layout === 'row' ? (
          <>
            <Box className="flex items-center gap-3">
              <Box className="mt-4 flex gap-3">
                <Select
                  options={Object.values(LeadStatusEnum).map((status) => ({
                    value: status,
                    label: status,
                  }))}
                  placeholder="Lead Status"
                  onChange={(value) => filtersStore.setLeadStatus(value)}
                  value={filtersStore.leadStatus ?? ''}
                  containerClassName="max-w-[150px] w-full min-w-[120px]"
                />
                <Select
                  options={[
                    { value: 'High', label: 'High' },
                    { value: 'Low', label: 'Low' },
                    { value: 'Medium', label: 'Medium' },
                  ]}
                  placeholder="Interests Level"
                  onChange={(value) => filtersStore.setInterestLevel(value)}
                  value={filtersStore.interestLevel ?? ''}
                  containerClassName="max-w-[300px] w-full"
                />
                {formOptions.length > 0 && (
                  <Select
                    options={formOptions}
                    placeholder="Form"
                    onChange={(value) => filtersStore.setLeadFormSnapshotId(value)}
                    value={filtersStore.leadFormSnapshotId ?? ''}
                    containerClassName="max-w-[250px] w-full min-w-[180px]"
                  />
                )}
              </Box>
              <Box className="flex items-center gap-3 ml-3 mb-3">
                <SingleFieldInput value={search} setValue={(e) => setSearch(e)} placeholder="Search" required={false} />
              </Box>
            </Box>
            {/* <Box className="border rounded-lg p-2 w-[25%] px-3 flex items-center gap-2 font-urbanist">
              <SearchIcon />
              <input type="text" placeholder="Search" className="w-full outline-none" value={search} onChange={(e) => setSearch(e.target.value)} />
            </Box> */}
          </>
        ) : (
          <Box />
        )}
        <Box className="flex gap-3 items-center ml-2">
          <Box className="flex-1" />
          <IconButton onClick={refresh} sx={{ border: '1px solid #f5dbb3', background: '#fff', borderRadius: 2, height: 36, width: 36 }}>
            <RefreshIcon sx={{ color: LightThemeColors.uriColor }} />
          </IconButton>
          <Box className="flex items-center gap-3">
            <Box className="flex gap-2 items-center">
              <Box className="border rounded-lg overflow-hidden flex">
                <button onClick={() => setLayout('column')} className={`p-2 transition-all ${layout === 'column' ? 'bg-gray-100 text-primary-600' : 'hover:bg-gray-50'}`}>
                  <ViewColumn />
                </button>
                <button onClick={() => setLayout('row')} className={`p-2 transition-all ${layout === 'row' ? 'bg-gray-100 text-primary-600' : 'hover:bg-gray-50'}`}>
                  <ViewModule />
                </button>
                {isConversationalType && (
                  <Tooltip title="Real-time View (VTweet) (disabled)">
                    <button disabled className={`p-2 transition-all opacity-50 cursor-not-allowed ${layout === 'realtime' ? 'bg-gray-100 text-primary-600' : ''}`}>
                      <NotificationsActiveIcon />
                    </button>
                  </Tooltip>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      {isGettingLeads && layout !== 'realtime' ? (
        <Box
          sx={{
            height: '60vh',
            mt: 4,
          }}
        >
          <Skeleton variant="rectangular" sx={{ height: '100%' }} animation="wave" />
        </Box>
      ) : (
        <Box className="transition-all duration-300 ease-in-out">
          {layout === 'realtime' && isConversationalType ? (
            <RealtimeLeadsDashboard
              onViewLeadDetails={(lead) => {
                router.push(`/leads-tracking/lead/${lead.lead_id}`);
              }}
            />
          ) : layout === 'column' ? (
            <LeadKanban leads={(allLeads ?? []) as LeadDto[]} getPaginationFunction={getPaginationFunction} />
          ) : leadType === LeadTypeEnum.PERSON ? (
            <IndividualTableCard
              data={leadsData?.data?.data ?? []}
              page={page}
              pageSize={pageSize}
              setPage={setPage}
              setPageSize={setPageSize}
              search={search}
              setSearch={setSearch}
              total={leadsData?.data?.total ?? 0}
            />
          ) : leadType === LeadTypeEnum.ORGANIZATION ? (
            <OrganizationTableCard
              data={leadsData?.data?.data ?? []}
              page={page}
              pageSize={pageSize}
              setPage={setPage}
              setPageSize={setPageSize}
              search={search}
              setSearch={setSearch}
              total={leadsData?.data?.total ?? 0}
            />
          ) : leadType === LeadTypeEnum.BUSINESS ? (
            <BusinessTableCard
              data={leadsData?.data?.data ?? []}
              page={page}
              pageSize={pageSize}
              setPage={setPage}
              setPageSize={setPageSize}
              search={search}
              setSearch={setSearch}
              total={leadsData?.data?.total ?? 0}
            />
          ) : leadType === LeadTypeEnum.CONVERSATIONAL ? (
            <ConversationalTableCard
              data={leadsData?.data?.data ?? []}
              page={page}
              pageSize={pageSize}
              setPage={setPage}
              setPageSize={setPageSize}
              search={search}
              setSearch={setSearch}
              total={leadsData?.data?.total ?? 0}
              twitterData={isTwitterSource ? twitterData : null}
            />
          ) : null}
        </Box>
      )}
    </Box>
  );
};

export default LeadsTab;
