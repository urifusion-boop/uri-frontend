import { Table, TableColumn } from '@/components/atoms/AlertTable';
import { accountIcons } from '@/constants/accountIcons';
import { PlatformHelper } from '@/helpers/PlatformHelper';
import useClipboard from '@/hooks/clipboard';
import { LeadDto } from '@/models/dtos/LeadsDto';
import { TwitterFetchResponseDto } from '@/models/dtos/TwitterDto';
import { LeadOpportunityTypeEnum } from '@/models/enum-models/LeadOpportunityTypeEnum';
import { LeadStatusEnum } from '@/models/enum-models/LeadStatusEnum';
import { CampaignPlatformEnum } from '@/models/enum-models/PlatformEnum';
import TurnedInIcon from '@mui/icons-material/TurnedIn';
import { Box, FormControl, MenuItem, Pagination, Select, Typography } from '@mui/material';
import IconContentBox from '../boxes/IconContentBox';
import IdentityBox from '../boxes/IdentityBox';
import TwitterDetailsModal from '../modals/TwitterDetailsModal';
import { useState } from 'react';
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

  // Convert Twitter data to LeadDto format for display
  const convertTwitterDataToLeads = (twitterData: TwitterFetchResponseDto): LeadDto[] => {
    return twitterData.responseData.tweets.map((tweet, index) => ({
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
    } as LeadDto));
  };

  const handleRowClick = (lead: LeadDto) => {
    setSelectedLead(lead);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedLead(null);
  };

  // Use Twitter data if available, otherwise use regular lead data
  const displayData = twitterData ? convertTwitterDataToLeads(twitterData) : data;
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
      render: (_, row) => <IconContentBox content={row.lead_reason ?? '-'} type={row.opportunity_type as LeadOpportunityTypeEnum} />,
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
            displayData.map((lead) => ({
              ...lead,
              id: lead.username?.trim() ?? `${lead.first_name ?? ''} ${lead.last_name ?? ''}`.trim() ?? '-',
            })) ?? []
          }
          onRowClick={handleRowClick}
        />
      </div>

      {/* Twitter Details Modal */}
      <TwitterDetailsModal open={isModalOpen} onClose={handleCloseModal} lead={selectedLead} />

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
