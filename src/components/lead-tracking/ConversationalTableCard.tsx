import { LeadsService } from '@/api/LeadFormService';
import { Table, TableColumn } from '@/components/atoms/AlertTable';
import { triggerToast } from '@/components/atoms/CustomToast';
import { accountIcons } from '@/constants/accountIcons';
import { PlatformHelper } from '@/helpers/PlatformHelper';
import useClipboard from '@/hooks/clipboard';
import { LeadDto } from '@/models/dtos/LeadsDto';
import { TwitterFetchResponseDto } from '@/models/dtos/TwitterDto';
import { LeadOpportunityTypeEnum } from '@/models/enum-models/LeadOpportunityTypeEnum';
import { LeadSourceEnum } from '@/models/enum-models/LeadSourceEnum';
import { LeadStatusEnum } from '@/models/enum-models/LeadStatusEnum';
import { CampaignPlatformEnum } from '@/models/enum-models/PlatformEnum';
import { canFindDecisionMakers, getSignalLabel, isLowConfidence } from '@/utils/jobSignalHelpers';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Box, Button, Chip, FormControl, MenuItem, Pagination, Select, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import IconContentBox from '../boxes/IconContentBox';
import IdentityBox from '../boxes/IdentityBox';
import DecisionMakerModal from '../modals/DecisionMakerModal';
import TwitterDetailsModal from '../modals/TwitterDetailsModal';
interface ConversationalTableColumnProps {
  data: LeadDto[];
  total: number;
  search: string;
  setSearch: (value: string) => void;
  page: number;
  pageSize: number;
  setPage: (value: number) => void;
  setPageSize: (value: number) => void;
  twitterData?: TwitterFetchResponseDto | null;
}

const ConversationalTableCard = ({ data, total, page, pageSize, search, setPage, setPageSize, setSearch, twitterData }: ConversationalTableColumnProps) => {
  const { copyToClipboard } = useClipboard();
  const [selectedLead, setSelectedLead] = useState<LeadDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingDecisionMaker, setLoadingDecisionMaker] = useState<string | null>(null);
  const [decisionMakersData, setDecisionMakersData] = useState<any>(null);
  const [isDecisionMakerModalOpen, setIsDecisionMakerModalOpen] = useState(false);

  // Convert Twitter data to LeadDto format for display
  const convertTwitterDataToLeads = (twitterData: TwitterFetchResponseDto): LeadDto[] => {
    return twitterData.responseData.tweets.map(
      (tweet, index) =>
        ({
          id: `twitter-${index}`,
          first_name: tweet.author || 'Twitter User',
          last_name: '',
          username: tweet.author || '',
          lead_reason: tweet.text,
          lead_status: LeadStatusEnum.NEW,
          opportunity_type: LeadOpportunityTypeEnum.Other,
          tags: [],
          twitter_url: `https://twitter.com/${tweet.author}`,
          lead_link: tweet.url,
          picture_url: '',
          created_date: tweet.created_at,
          lead_type: 'CONVERSATIONAL',
          website_url: tweet.url,
          sentiment: tweet.sentiment,
          confidence: tweet.confidence,
          // Optional fields can be undefined
          lead_email: undefined,
          phone: undefined,
          company_name: undefined,
          job_title: undefined,
          industry: undefined,
          linkedin_url: undefined,
          facebook_url: undefined,
          github_url: undefined,
          location: undefined,
        }) as LeadDto
    );
  };

  const handleRowClick = (lead: LeadDto) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLead(null);
  };

  const handleFindDecisionMaker = async (lead: LeadDto) => {
    if (!lead.lead_id) {
      triggerToast('error', 'Lead ID not found');
      return;
    }

    setLoadingDecisionMaker(lead.lead_id);
    try {
      const response = await LeadsService.findDecisionMakers(lead.lead_id);
      if (response.status && response.responseData) {
        const count = response.responseData.decision_makers?.length || 0;
        triggerToast('success', `Found ${count} decision-maker(s)`);

        // Open modal with decision-makers
        setDecisionMakersData({
          ...response.responseData,
          jobTitle: lead.job_title,
          companyName: lead.company_name,
        });
        setIsDecisionMakerModalOpen(true);
      } else {
        triggerToast('error', response.responseMessage || 'Failed to find decision-makers');
      }
    } catch (error: any) {
      triggerToast('error', error.message || 'Error finding decision-makers');
    } finally {
      setLoadingDecisionMaker(null);
    }
  };

  // Use Twitter data if available, otherwise use regular lead data
  const displayData = twitterData ? convertTwitterDataToLeads(twitterData) : data;

  // Sort by newest first using created_date
  const sortedDisplayData = [...(displayData ?? [])]
    .map((lead, index) => ({ ...lead, originalIndex: index }))
    .sort((a, b) => {
      const aTime = a?.created_date ? new Date(a.created_date).getTime() : 0;
      const bTime = b?.created_date ? new Date(b.created_date).getTime() : 0;
      return aTime === bTime ? a.originalIndex - b.originalIndex : bTime - aTime;
    });
  const displayTotal = twitterData ? twitterData.responseData.total_tweets : total;

  const getCompanyOrJobOrIndustry = (row: LeadDto) => {
    if (row.job_title && row.job_title !== '' && row.job_title.length > 1) return row.job_title;
    if (row.company_name && row.company_name !== '' && row.company_name.length > 1) return row.company_name;
    if (row.industry && row.industry !== '' && row.industry.length > 1) return row.industry;
    return 'Other';
  };

  const columns: TableColumn<LeadDto>[] = [
    {
      key: 'id',
      title: 'Name',
      render: (_, row) => (
        <IdentityBox name={`${row.first_name ?? ''} ${row.last_name ?? ''}`.trim() || row.username || '-'} jobTitle={getCompanyOrJobOrIndustry(row)} imageUrl={row.picture_url} lead={row} />
      ),
    },

    {
      key: 'lead_reason',
      title: 'Lead Reason',
      render: (_, row) => (
        <Box>
          <IconContentBox content={row.lead_reason ?? '-'} type={row.opportunity_type as LeadOpportunityTypeEnum} />
          {/* Signal Label for Job Board Signals */}
          {row.lead_source === LeadSourceEnum.JOB_BOARDS && row.commercial_relevance !== undefined && (
            <Box sx={{ mt: 1 }}>
              <Chip
                label={`${getSignalLabel(row.commercial_relevance).emoji} ${getSignalLabel(row.commercial_relevance).label}`}
                size="small"
                color={getSignalLabel(row.commercial_relevance).color}
                sx={{ fontWeight: 600, fontSize: '11px' }}
              />
            </Box>
          )}
          {/* Low Confidence Warning */}
          {row.lead_source === LeadSourceEnum.JOB_BOARDS && isLowConfidence(row.company_confidence) && (
            <Box sx={{ mt: 1 }}>
              <Tooltip title="Company identity not verified — decision-maker lookup unavailable">
                <Chip
                  icon={<WarningAmberIcon sx={{ fontSize: 14 }} />}
                  label="Low Confidence"
                  size="small"
                  sx={{
                    backgroundColor: '#fef3c7',
                    color: '#92400e',
                    fontWeight: 600,
                    fontSize: '11px',
                  }}
                />
              </Tooltip>
            </Box>
          )}
        </Box>
      ),
    },
    {
      key: 'lead_status',
      title: 'Lead Status',
      render: (_, row) => <IconContentBox content={row.lead_status ?? '-'} type={row.lead_status as LeadStatusEnum} />,
    },
    {
      key: 'tags',
      title: 'Tags',
      render: (_, row) => <IconContentBox content={row.tags?.join(', ') ?? '-'} icon={<TurnedInIcon />} />,
    },
    {
      key: 'opportunity_type',
      title: 'Opportunity Type',
      render: (_, row) => (
        <Typography variant="caption" fontSize="14px" className="text-sm text-gray-600 max-w-[100px] truncate">
          {row.opportunity_type ?? '-'}
        </Typography>
      ),
    },
    {
      key: 'social_profile_link',
      title: 'Profile Links',
      render: (_, row) => {
        const platform = PlatformHelper.getPlatformFromUrl(row.lead_link ?? '');
        const links: { url: string | null | undefined; key: keyof typeof accountIcons; platform: string }[] = [
          { url: row.lead_link, key: platform, platform: platform },
          { url: row.linkedin_url, key: 'Linkedin', platform: CampaignPlatformEnum.LINKEDIN },
          { url: row.facebook_url, key: 'Facebook', platform: CampaignPlatformEnum.FACEBOOK },
          { url: row.twitter_url, key: 'Twitter', platform: CampaignPlatformEnum.TWITTER },
          { url: row.github_url, key: 'X', platform: CampaignPlatformEnum.X },
          { url: row.website_url, key: 'Website', platform: CampaignPlatformEnum.WEBSITE },
        ];

        const validLinks = links.filter((link) => !!link.url);

        if (validLinks.length === 0) return '-';

        return (
          <div className="flex items-center gap-2">
            {validLinks.map((link, index) => {
              const icon = PlatformHelper.getSocialIcon(link.platform, accountIcons);
              return (
                <a key={index} href={link.url!} target="_blank" rel="noopener noreferrer" className="h-8 w-8 flex items-center justify-center">
                  {icon}
                </a>
              );
            })}
          </div>
        );
      },
    },
    {
      key: 'created_date',
      title: 'Created',

      render: (_, row) => (
        <Typography variant="caption" fontSize="14px" className="text-sm text-center">
          {row.created_date ? new Date(row.created_date).toLocaleDateString() : '-'}
        </Typography>
      ),
    },
    {
      key: 'lead_id',
      title: 'Actions',
      render: (_, row) => {
        // Only show Find Decision-Maker button for job board signals
        if (row.lead_source !== LeadSourceEnum.JOB_BOARDS) return null;

        const eligibility = canFindDecisionMakers(row);
        const isLoading = loadingDecisionMaker === row.lead_id;

        return (
          <Box>
            <Button
              variant="outlined"
              size="small"
              startIcon={<PersonSearchIcon />}
              disabled={!eligibility.eligible || isLoading}
              onClick={(e) => {
                e.stopPropagation();
                handleFindDecisionMaker(row);
              }}
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                fontSize: '12px',
                px: 2,
                py: 0.5,
              }}
            >
              {isLoading ? 'Finding...' : 'Find the decision-maker'}
            </Button>
            {/* PRD Section 8.2: Subtext */}
            {eligibility.eligible && !isLoading && (
              <Typography variant="caption" display="block" sx={{ mt: 0.5, color: 'text.secondary', fontSize: '10px', fontStyle: 'italic' }}>
                We'll find the person responsible for this problem.
              </Typography>
            )}
            {/* Show reason when ineligible */}
            {!eligibility.eligible && (
              <Typography variant="caption" display="block" sx={{ mt: 0.5, color: 'error.main', fontSize: '10px' }}>
                {eligibility.reason}
              </Typography>
            )}
          </Box>
        );
      },
    },
  ];

  return (
    <Box
      sx={{
        width: '100%',
        overflowX: { xs: 'auto', md: 'visible' },
        mt: 2,
      }}
    >
      <div
        style={{
          tableLayout: 'fixed',
          width: '100%',
        }}
      >
        <Table<any>
          columns={columns}
          data={
            sortedDisplayData.map((lead) => ({
              ...lead,
              id: lead.username?.trim() ?? `${lead.first_name ?? ''} ${lead.last_name ?? ''}`.trim() ?? '-',
            })) ?? []
          }
          onRowClick={handleRowClick}
        />
      </div>

      {/* Twitter Details Modal */}
      <TwitterDetailsModal open={isModalOpen} onClose={handleCloseModal} lead={selectedLead} />

      {/* Decision-Maker Modal */}
      <DecisionMakerModal
        open={isDecisionMakerModalOpen}
        onClose={() => setIsDecisionMakerModalOpen(false)}
        decisionMakers={decisionMakersData?.decision_makers || []}
        jobTitle={decisionMakersData?.jobTitle}
        companyName={decisionMakersData?.companyName}
      />

      {/* Pagination Controls */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mx: 3, my: 2 }}>
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

        <Pagination count={Math.ceil(Number(displayTotal || 1) / pageSize)} shape="rounded" size="small" page={Number(page)} onChange={(_, p) => setPage(p)} />
      </Box>
    </Box>
  );
};

export default ConversationalTableCard;
