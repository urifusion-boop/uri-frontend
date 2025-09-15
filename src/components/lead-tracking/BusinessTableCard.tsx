import { Table, TableColumn } from '@/components/atoms/AlertTable';
import { accountIcons } from '@/constants/accountIcons';
import { PlatformHelper } from '@/helpers/PlatformHelper';
import useClipboard from '@/hooks/clipboard';
import { LeadDto } from '@/models/dtos/LeadsDto';
import { CampaignPlatformEnum } from '@/models/enum-models/PlatformEnum';
import { Box, FormControl, MenuItem, Pagination, Select, Typography } from '@mui/material';
import IdentityBox from '../boxes/IdentityBox';
import StatusBox from '../boxes/StatusBox';

interface BusinessTableColumnProps {
  data: LeadDto[];
  total: number;
  search: string;
  setSearch: (value: string) => void;
  page: number;
  pageSize: number;
  setPage: (value: number) => void;
  setPageSize: (value: number) => void;
}

const BusinessTableCard = ({ data, total, page, pageSize, search, setPage, setPageSize, setSearch }: BusinessTableColumnProps) => {
  const { copyToClipboard } = useClipboard();

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
      render: (_, row) => <IdentityBox name={`${row.first_name ?? ''} ${row.last_name ?? ''}`.trim() || row.username || '-'} jobTitle={getCompanyOrJobOrIndustry(row)} imageUrl={row.picture_url} />,
    },
    {
      key: 'lead_source',
      title: 'Lead Source',
      render: (_, row) => <Typography className="text-sm text-gray-600">{row.lead_source ?? '-'}</Typography>,
    },
    {
      key: 'opportunity_type',
      title: 'Opportunity Type',
      render: (_, row) => <Typography className="text-sm text-gray-600">{row.opportunity_type ?? '-'}</Typography>,
    },
    {
      key: 'tags',
      title: 'Tags',
      render: (_, row) => <Typography className="text-sm text-gray-600">{row.tags?.join(', ') ?? '-'}</Typography>,
    },
    {
      key: 'lead_status',
      title: 'Lead Status',
      render: (_, row) => <StatusBox label={row.lead_status ?? '-'} />,
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
      render: (_, row) => <Typography className="text-sm text-center">{row.created_date ? new Date(row.created_date).toLocaleDateString() : '-'}</Typography>,
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
            data.map((lead) => ({
              ...lead,
              id: lead.username?.trim() ?? `${lead.first_name ?? ''} ${lead.last_name ?? ''}`.trim() ?? '-',
            })) ?? []
          }
        />
      </div>

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

        <Pagination count={Math.ceil(Number(total || 1) / pageSize)} shape="rounded" size="small" page={Number(page)} onChange={(_, p) => setPage(p)} />
      </Box>
    </Box>
  );
};

export default BusinessTableCard;
