import { LeadsService } from '@/api/LeadFormService';
import { LeadsService as LeadsAPI } from '@/api/LeadsService';
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
import { JobSignalAnalytics } from '@/utils/analytics';
import { canFindDecisionMakers, getSignalLabel, isLowConfidence } from '@/utils/jobSignalHelpers';
import ListAltIcon from '@mui/icons-material/ListAlt';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Box, Button, Chip, FormControl, MenuItem, Pagination, Select, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import IconContentBox from '../boxes/IconContentBox';
import IdentityBox from '../boxes/IdentityBox';
import DecisionMakerModal from '../modals/DecisionMakerModal';
import NextStepsModal from '../modals/NextStepsModal';
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
  const [isNextStepsModalOpen, setIsNextStepsModalOpen] = useState(false);
  const [nextStepsLead, setNextStepsLead] = useState<LeadDto | null>(null);
  const [isUpdatingStep, setIsUpdatingStep] = useState(false);

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
    // PRD Section 12: Track job signal clicked
    if (lead.lead_source === LeadSourceEnum.JOB_BOARDS) {
      JobSignalAnalytics.trackJobSignalClicked({
        lead_id: lead.lead_id || '',
        company_name: lead.hiring_company || lead.company_name,
        commercial_relevance: lead.commercial_relevance,
        problem_solution_match: lead.problem_solution_match,
        job_source: lead.job_source,
        timestamp: lead.created_date ? new Date(lead.created_date).getTime() : undefined,
      });
    }
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLead(null);
  };

  const handleOpenNextSteps = (lead: LeadDto) => {
    setNextStepsLead(lead);
    setIsNextStepsModalOpen(true);
  };

  const handleCloseNextSteps = () => {
    setIsNextStepsModalOpen(false);
    setNextStepsLead(null);
  };

  const handleMarkStepComplete = async (stepId: string, completed: boolean) => {
    if (!nextStepsLead?.lead_id) return;

    setIsUpdatingStep(true);
    try {
      await LeadsAPI.markNextStepComplete(nextStepsLead.lead_id, stepId, completed);
      triggerToast('success', completed ? 'Step marked as complete' : 'Step unmarked');

      // Update local state
      if (nextStepsLead.ai_next_steps) {
        const updatedSteps = nextStepsLead.ai_next_steps.steps.map((step: any) =>
          step.step_id === stepId
            ? {
                ...step,
                completed,
                completed_at: completed ? new Date().toISOString() : null,
              }
            : step
        );
        setNextStepsLead({
          ...nextStepsLead,
          ai_next_steps: {
            ...nextStepsLead.ai_next_steps,
            steps: updatedSteps,
          },
        });
      }
    } catch (error: any) {
      triggerToast('error', error.message || 'Error updating step');
    } finally {
      setIsUpdatingStep(false);
    }
  };

  const handleFindDecisionMaker = async (lead: LeadDto) => {
    if (!lead.lead_id) {
      triggerToast('error', 'Lead ID not found');
      return;
    }

    // PRD Section 12: Track decision-maker requested
    JobSignalAnalytics.trackDecisionMakerRequested({
      lead_id: lead.lead_id,
      company_name: lead.hiring_company || lead.company_name,
      commercial_relevance: lead.commercial_relevance,
      problem_solution_match: lead.problem_solution_match,
      job_source: lead.job_source,
    });

    const searchStartTime = Date.now();
    setLoadingDecisionMaker(lead.lead_id);
    try {
      const response = await LeadsService.findDecisionMakers(lead.lead_id);
      if (response.status && response.responseData) {
        const count = response.responseData.decision_makers?.length || 0;
        const searchDuration = Date.now() - searchStartTime;

        // PRD Section 12: Track decision-makers found
        JobSignalAnalytics.trackDecisionMakerFound({
          lead_id: lead.lead_id,
          company_name: lead.hiring_company || lead.company_name,
          commercial_relevance: lead.commercial_relevance,
          problem_solution_match: lead.problem_solution_match,
          job_source: lead.job_source,
          decision_makers_found: count,
          search_duration_ms: searchDuration,
        });

        triggerToast('success', `Found ${count} decision-maker(s)`);

        // Open modal with decision-makers
        setDecisionMakersData({
          ...response.responseData,
          jobTitle: lead.job_title,
          companyName: lead.company_name,
          parentJobSignalId: lead.lead_id, // Link back to job signal for Individual Lead creation
          errorMessage: null,
          suggestion: null,
        });
        setIsDecisionMakerModalOpen(true);
      } else {
        // API returned error - show modal with error message
        const errorMsg = response.responseMessage || 'Unable to find decision-makers at this time';
        const suggestion = response.responseData?.suggestion;

        setDecisionMakersData({
          decision_makers: [],
          jobTitle: lead.job_title || lead.job_title_field,
          companyName: lead.company_name || lead.hiring_company,
          parentJobSignalId: lead.lead_id,
          errorMessage: errorMsg,
          suggestion: suggestion,
        });
        setIsDecisionMakerModalOpen(true);
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
          {/* For Job Board Signals - show AI explanation prominently */}
          {row.lead_source === LeadSourceEnum.JOB_BOARDS && row.lead_reason ? (
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#1f2937', mb: 0.5 }}>
                💡 Why this is a signal:
              </Typography>
              <Typography variant="body2" sx={{ color: '#4b5563', mb: 1 }}>
                {row.lead_reason}
              </Typography>
              {/* Show job details if available */}
              {(row.hiring_company || row.job_title_field) && (
                <Typography variant="caption" sx={{ color: '#6b7280', display: 'block', mt: 0.5 }}>
                  {row.hiring_company && (
                    <>
                      <strong>{row.hiring_company}</strong>
                    </>
                  )}
                  {row.hiring_company && row.job_title_field && ' • '}
                  {row.job_title_field && <>{row.job_title_field}</>}
                </Typography>
              )}
            </Box>
          ) : (
            <IconContentBox content={row.lead_reason ?? '-'} type={row.opportunity_type as LeadOpportunityTypeEnum} />
          )}
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
      key: 'form_title',
      title: 'Generated From',
      render: (_, row) => (
        <Typography className="text-sm text-gray-600" sx={{ fontWeight: 500 }}>
          {row.form_title || '-'}
        </Typography>
      ),
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
      key: 'ai_next_steps',
      title: 'Next Steps',
      render: (_, row) => {
        if (!row.ai_next_steps || !row.ai_next_steps.steps || row.ai_next_steps.steps.length === 0) {
          return null;
        }

        const totalSteps = row.ai_next_steps.steps.length;
        const pendingSteps = row.ai_next_steps.steps.filter((s: any) => !s.completed).length;
        const highPriorityCount = row.ai_next_steps.steps.filter((s: any) => !s.completed && s.priority === 'high').length;

        return (
          <Box>
            <Button
              variant="outlined"
              size="small"
              startIcon={<ListAltIcon />}
              onClick={(e) => {
                e.stopPropagation();
                handleOpenNextSteps(row);
              }}
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                fontSize: '12px',
                px: 2,
                py: 0.5,
                borderColor: highPriorityCount > 0 ? '#DC2626' : '#D1D5DB',
                color: highPriorityCount > 0 ? '#DC2626' : '#374151',
                '&:hover': {
                  borderColor: highPriorityCount > 0 ? '#B91C1C' : '#9CA3AF',
                  backgroundColor: highPriorityCount > 0 ? '#FEE2E2' : '#F3F4F6',
                },
              }}
            >
              {pendingSteps > 0 ? `${pendingSteps} action${pendingSteps > 1 ? 's' : ''}` : 'View steps'}
            </Button>
            {highPriorityCount > 0 && (
              <Typography variant="caption" display="block" sx={{ mt: 0.5, color: '#DC2626', fontSize: '10px', fontWeight: 600 }}>
                {highPriorityCount} high priority
              </Typography>
            )}
          </Box>
        );
      },
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
        parentJobSignalId={decisionMakersData?.parentJobSignalId}
        errorMessage={decisionMakersData?.errorMessage}
        suggestion={decisionMakersData?.suggestion}
      />

      {/* Next Steps Modal */}
      <NextStepsModal
        open={isNextStepsModalOpen}
        onClose={handleCloseNextSteps}
        leadName={`${nextStepsLead?.first_name ?? ''} ${nextStepsLead?.last_name ?? ''}`.trim() || nextStepsLead?.username || 'Lead'}
        nextSteps={nextStepsLead?.ai_next_steps || null}
        onMarkComplete={handleMarkStepComplete}
        isUpdating={isUpdatingStep}
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
