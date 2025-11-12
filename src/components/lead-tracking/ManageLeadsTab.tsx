import { TextHelper } from '@/helpers/TextHelper';
import { useLeadTabHook } from '@/hooks/leads-tracking/leadsTab.hook';
import { GetByFiltersLeadsDto } from '@/models/dtos/LeadsDto';
import { DateFilterEnum } from '@/models/enum-models/DateFIlterEnum';
import { LeadSourceEnum } from '@/models/enum-models/LeadSourceEnum';
import { LeadStatusEnum } from '@/models/enum-models/LeadStatusEnum';
import { useLeadTrackingStore } from '@/store/leads-tracking/useLeadTrackingStore';
import LeadStatusIcon from '@/utils/icon/LeadStatusIcon';
import ServiceLevelIcon from '@/utils/icon/ServiceLevelIcon';
import { Box, Checkbox, FormControl, IconButton, ListItemText, MenuItem, Pagination, Select, Typography } from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { TwitterFetchResponseDto } from '@/models/dtos/TwitterDto';
import { LeadDto } from '@/models/dtos/LeadsDto';
import { LeadOpportunityTypeEnum } from '@/models/enum-models/LeadOpportunityTypeEnum';
import { BiSolidCalendar, BiX } from 'react-icons/bi';
import { BsStack } from 'react-icons/bs';
import { FaCalendarAlt, FaListUl } from 'react-icons/fa';
import { FaTrashCan } from 'react-icons/fa6';
import { IoMdCloseCircle } from 'react-icons/io';
import CustomButton from '../atoms/CustomButton';
import EmptyState from '../atoms/EmptyState';
import LoaderWrapper from '../atoms/LoaderWrapper';
import MentionCard from './MentionCard';

interface LeadTabsProps {
  leadsData: GetByFiltersLeadsDto | null | undefined;
  loading?: boolean;
  page: number;
  pageSize: number;
  setPage: (value: number) => void;
  setPageSize: (value: number) => void;
}

const ManageLeadsTab = ({ leadsData, loading, page, pageSize, setPage, setPageSize }: LeadTabsProps) => {
  const [deleteSelection, setDeleteSelection] = useState(false);
  const [selectedLeadForDelete, setSelectedLeadForDelete] = useState<string[]>([]);
  const [selectAllLeads, setSelectAllLeads] = useState(false);

  const filtersStore = useLeadTrackingStore((state) => state);

  // Detect Twitter source via query and load cached results
  const router = useRouter();
  const isTwitterSource = router.query.source === 'twitter';
  const [twitterData, setTwitterData] = useState<TwitterFetchResponseDto | null>(null);

  useEffect(() => {
    if (isTwitterSource) {
      const storedTwitterData = localStorage.getItem('twitterResults');
      if (storedTwitterData) {
        try {
          const parsed = JSON.parse(storedTwitterData) as TwitterFetchResponseDto;
          setTwitterData(parsed);
        } catch (err) {
          console.error('Error parsing Twitter data:', err);
        }
      }
    }
  }, [isTwitterSource]);

  // Map Twitter data into LeadDto for Manage tab view
  const convertTwitterDataToLeads = (tw: TwitterFetchResponseDto): LeadDto[] => {
    return tw.responseData.tweets.map((tweet, index) => ({
      // No backend ID; keep lead_id undefined so actions are read-only
      id: `twitter-${index}`,
      lead_id: undefined,
      first_name: tweet.author || 'Twitter User',
      last_name: '',
      username: tweet.author || '',
      // Main content and reason
      mention: tweet.text,
      lead_reason: tweet.text,
      lead_status: LeadStatusEnum.NEW,
      opportunity_type: LeadOpportunityTypeEnum.Other,
      tags: [],
      // Links
      twitter_url: tweet.author ? `https://twitter.com/${tweet.author}` : undefined,
      lead_link: tweet.url,
      social_profile_link: tweet.url,
      picture_url: '',
      // Dates
      created_date: tweet.created_at,
      last_updated: tweet.created_at,
      // Types
      lead_type: 'CONVERSATIONAL',
      website_url: tweet.url,
      // Sentiment
      sentiment: tweet.sentiment,
      confidence: tweet.confidence,
      // Optional fields left undefined
      lead_email: undefined,
      phone: undefined,
      company_name: undefined,
      job_title: undefined,
      industry: undefined,
      linkedin_url: undefined,
      facebook_url: undefined,
      github_url: undefined,
      location: undefined,
      interest_level: undefined,
      follow_up_message: undefined,
      starred: false,
    }));
  };

  const displayLeads: LeadDto[] = isTwitterSource && twitterData ? convertTwitterDataToLeads(twitterData) : (leadsData?.data ?? []);
  // Sort by newest first
  const sortedLeads: LeadDto[] = [...(displayLeads ?? [])].sort((a, b) => {
    const aTime = a?.created_date ? new Date(a.created_date).getTime() : 0;
    const bTime = b?.created_date ? new Date(b.created_date).getTime() : 0;
    return bTime - aTime;
  });
  const displayTotal: number = isTwitterSource && twitterData ? Number(twitterData.responseData.total_tweets || 0) : Number(leadsData?.total || 0);

  const filters = [
    {
      label: 'Leads',
      value: filtersStore.leadStarred,
      setValue: filtersStore.setLeadStarred,
      icon: <FaListUl size={18} />,
      options: [
        { value: 'all', label: 'All' },
        { value: 'star', label: 'Star' },
      ],
    },
    {
      label: 'Lead Status',
      value: filtersStore.leadStatus,
      setValue: filtersStore.setLeadStatus,
      placeholder: 'Lead Status',
      icon: (
        <LeadStatusIcon
          style={{
            width: '24px',
            height: '24px',
            color: '#6B6B6B',
          }}
        />
      ),
      options: [
        ...Object.values(LeadStatusEnum).map((status) => ({
          value: status,
          label: status,
        })),
        { value: undefined, label: 'Clear' },
      ],
    },
    {
      label: 'Interest Level',
      value: filtersStore.interestLevel,
      setValue: filtersStore.setInterestLevel,
      placeholder: 'Interest Level',
      icon: (
        <ServiceLevelIcon
          style={{
            width: '24px',
            height: '24px',
            color: '#6B6B6B',
          }}
        />
      ),
      options: [
        { value: 'High', label: 'High' },
        { value: 'Low', label: 'Low' },
        { value: 'Medium', label: 'Medium' },
        { value: undefined, label: 'Clear' },
      ],
    },
    {
      label: 'Platform',
      value: filtersStore.leadSource,
      setValue: filtersStore.setLeadSource,
      placeholder: 'Platform',
      icon: (
        <BsStack
          style={{
            width: '24px',
            height: '24px',
            color: '#6B6B6B',
          }}
        />
      ),
      options: [
        ...Object.values(LeadSourceEnum).map((status) => ({
          value: TextHelper.removeChar(status, '_'),
          label: TextHelper.removeChar(status, '_'),
        })),
        { value: undefined, label: 'Clear' },
      ],
    },
    {
      label: 'Last 30 days',
      value: filtersStore.leadsDateFilter,
      setValue: filtersStore.setLeadsDateFilter,
      placeholder: 'Last 30 days',
      icon: (
        <BiSolidCalendar
          style={{
            width: '24px',
            height: '24px',
            color: '#6B6B6B',
          }}
        />
      ),
      options: [
        ...Object.values(DateFilterEnum).map((status) => ({
          value: status,
          label: TextHelper.removeChar(status, '_'),
        })),
        { value: undefined, label: 'Clear' },
      ],
    },
  ];

  const handleSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectAllLeads(e.target.checked);
    if (e.target.checked) {
      setSelectedLeadForDelete((leadsData?.data ?? [])?.map((lead) => lead.lead_id ?? ''));
    } else {
      setSelectedLeadForDelete([]);
    }
  };

  const { deleteManyLeadsMutation } = useLeadTabHook();

  const handleClearAllFilters = () => filtersStore.clearFilters();

  return (
    <Box
      sx={{
        px: { xs: 2, sm: 4 },
        backgroundColor: '#fff',
        pb: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: { xs: 'flex-start', md: 'center' },
          mb: '50px',
          gap: '13px',
          flexDirection: { xs: 'column', md: 'row' },
        }}
      >
        <Box
          sx={{
            backgroundColor: '#F6F6F6E3',

            p: 2,
            gap: '24px',
            width: '100%',
            display: 'grid',
            borderRadius: '10px',
            gridTemplateColumns: {
              xs: '1fr',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(6, 1fr)',
            },
          }}
        >
          {filters.map((filter) => (
            <Select
              labelId="icon-select-label"
              value={filter.value ?? filter.placeholder ?? ''}
              onChange={(e) => {
                filter.setValue(e.target.value);
              }}
              sx={{
                backgroundColor: '#fff',
                width: '100%',
                height: '48px',
                color: '#7E7E7E',
                '& .MuiSelect-select': {
                  fontSize: '14px !important',
                },
              }}
              key={filter.label}
              startAdornment={filter.icon ?? <FaCalendarAlt size={20} />}
            >
              {filter.placeholder && (
                <MenuItem disabled value={filter.placeholder}>
                  <ListItemText
                    primary={filter.placeholder}
                    sx={{
                      ml: 1,
                      fontSize: '14px', // Adjusts the font size inside the dropdown
                    }}
                  />
                </MenuItem>
              )}
              {[...(filter.options ?? [])].map((fil, index) => (
                <MenuItem value={fil.value} key={(fil.value ?? '') + index}>
                  <ListItemText
                    primary={fil.label}
                    sx={{
                      ml: 1,
                      fontSize: '14px',
                    }}
                  />
                </MenuItem>
              ))}
            </Select>
          ))}
          <Box
            component="button"
            onClick={handleClearAllFilters}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              cursor: 'pointer',
              justifyContent: {
                xs: 'flex-start',
                md: 'center',
              },
            }}
          >
            <Box
              sx={{
                borderBottom: '1px solid #CD1B78',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
              }}
            >
              <Typography
                sx={{
                  fontSize: '14.78px',
                  fontWeight: 600,
                  color: '#CD1B78',
                }}
              >
                Clear All
              </Typography>
              <BiX color="#CD1B78" size={24} />
            </Box>
          </Box>
        </Box>
        {!isTwitterSource && (
          <IconButton onClick={() => setDeleteSelection(!deleteSelection)}>
            {deleteSelection ? <IoMdCloseCircle size={28} color="#B01717" /> : <FaTrashCan size={28} color="#B01717" />}
          </IconButton>
        )}
      </Box>

      {deleteSelection && !isTwitterSource && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '24px',
            mb: '24px',
            px: { xs: 2, sm: 4 },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              gap: '6px',
              alignItems: 'center',
              mb: '24px',
            }}
          >
            <Checkbox disabled={deleteManyLeadsMutation.isLoading} checked={selectAllLeads} onChange={handleSelectAll} />
            <Typography
              variant="body2"
              sx={{
                color: '#000000',
                fontSize: '16px',
                fontWeight: 500,
              }}
            >
              Select All
            </Typography>
          </Box>
          <Box
            sx={{
              width: '200px',
            }}
          >
            <CustomButton
              mode="error"
              loading={deleteManyLeadsMutation.isLoading}
              onClick={() => {
                deleteManyLeadsMutation.mutate(selectedLeadForDelete, {
                  onSuccess: () => {
                    setSelectedLeadForDelete([]);
                    setSelectAllLeads(false);
                  },
                });
              }}
              disabled={selectedLeadForDelete.length === 0}
            >
              Delete Selected leads
            </CustomButton>
          </Box>
        </Box>
      )}
      <LoaderWrapper
        isLoading={loading}
        numberOfSkeletons={5}
        sx={{
          gap: '24px',
          height: '100px',
          mb: 2,
        }}
      >
        {displayLeads && displayLeads.length > 0 ? (
          <Box
            sx={{
              display: 'flex',
              gap: '16px',
              flexDirection: 'column',
            }}
          >
            {sortedLeads?.map((lead) => (
              <MentionCard
                disabledCheckbox={isTwitterSource || deleteManyLeadsMutation.isLoading}
                key={lead.lead_id}
                lead={lead}
                deleteSelection={deleteSelection}
                selectedLeadForDelete={selectedLeadForDelete}
                setSelectedLeadForDelete={setSelectedLeadForDelete}
              />
            ))}
          </Box>
        ) : (
          <EmptyState
            icon={<img src="/assets/images/lead-tracking-empty-state.svg" width="300px" height="300px" alt="No mentions" />}
            actionRequired={false}
            heading="Leads Tracking Active"
            message="We’re keeping an eye out for potential leads, We’ll notify you as soon as we find one that matches your business."
            messageMaxWidth="700px"
          />
        )}
      </LoaderWrapper>

      {displayLeads && displayLeads.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mx: 3,
            my: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Rows per page:
            </Typography>
            <FormControl size="small" sx={{ minWidth: 80 }}>
              <Select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} displayEmpty>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={25}>25</MenuItem>
                <MenuItem value={50}>50</MenuItem>
                <MenuItem value={100}>100</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <Pagination count={Math.ceil(Number(displayTotal || 1) / pageSize)} shape="rounded" size="small" page={Number(page)} onChange={(event, pageNumber) => setPage(pageNumber)} />
        </Box>
      )}
    </Box>
  );
};

export default ManageLeadsTab;
