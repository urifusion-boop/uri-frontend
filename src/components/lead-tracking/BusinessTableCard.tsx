import { Table, TableColumn } from '@/components/atoms/AlertTable';
import MarkAsDeadModal from '@/components/lazarus/MarkAsDeadModal';
import { accountIcons } from '@/constants/accountIcons';
import { PlatformHelper } from '@/helpers/PlatformHelper';
import useClipboard from '@/hooks/clipboard';
import { LeadDto } from '@/models/dtos/LeadsDto';
import { CampaignPlatformEnum } from '@/models/enum-models/PlatformEnum';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Box, Chip, FormControl, IconButton, Menu, MenuItem, Pagination, Select, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaHeartbeat, FaSkull } from 'react-icons/fa';
import { MdAutorenew } from 'react-icons/md';
import IdentityBox from '../boxes/IdentityBox';

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
  const router = useRouter();
  const { copyToClipboard } = useClipboard();

  // Lazarus integration - Mark as Dead modal
  const [markDeadModalOpen, setMarkDeadModalOpen] = useState(false);
  const [selectedLeadForAction, setSelectedLeadForAction] = useState<LeadDto | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const getCompanyOrJobOrIndustry = (row: LeadDto) => {
    if (row.job_title && row.job_title !== '' && row.job_title.length > 1) return row.job_title;
    if (row.company_name && row.company_name !== '' && row.company_name.length > 1) return row.company_name;
    if (row.industry && row.industry !== '' && row.industry.length > 1) return row.industry;
    return 'Other';
  };

  // Action menu handlers for Lazarus integration
  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>, lead: LeadDto) => {
    event.stopPropagation();
    setSelectedLeadForAction(lead);
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleMarkAsDead = () => {
    handleCloseMenu();
    setMarkDeadModalOpen(true);
  };

  const handleViewInLazarus = () => {
    handleCloseMenu();
    if (selectedLeadForAction?.lazarus_focus_id) {
      router.push(`/lazarus?focus_id=${selectedLeadForAction.lazarus_focus_id}`);
    }
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
      render: (_, row) => <Typography className="text-sm text-center">{row.created_date ? new Date(row.created_date).toLocaleDateString() : '-'}</Typography>,
    },
    {
      key: 'id' as any,
      title: 'Actions',
      render: (_, row) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {/* Lazarus Monitoring Badge */}
          {row.is_lazarus_monitored && (
            <Chip
              icon={<FaHeartbeat size={12} />}
              label="Lazarus"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/lazarus?focus_id=${row.lazarus_focus_id}`);
              }}
              sx={{
                backgroundColor: '#F3E8FF',
                color: '#7C3AED',
                fontWeight: 600,
                fontSize: '10px',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#E9D5FF',
                },
              }}
            />
          )}

          {/* Resurrection Count Badge */}
          {row.resurrection_count && row.resurrection_count > 0 && (
            <Chip
              icon={<MdAutorenew size={12} />}
              label={`${row.resurrection_count}x`}
              size="small"
              sx={{
                backgroundColor: '#D1FAE5',
                color: '#059669',
                fontWeight: 600,
                fontSize: '10px',
              }}
            />
          )}

          {/* Action Menu */}
          <IconButton size="small" onClick={(e) => handleOpenMenu(e, row)} sx={{ ml: 'auto' }}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>
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

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleMarkAsDead}>
          <FaSkull size={14} style={{ marginRight: 8 }} />
          Mark as Dead
        </MenuItem>
        {selectedLeadForAction?.is_lazarus_monitored && (
          <MenuItem onClick={handleViewInLazarus}>
            <FaHeartbeat size={14} style={{ marginRight: 8 }} />
            View in Lazarus
          </MenuItem>
        )}
      </Menu>

      {/* Mark as Dead Modal */}
      <MarkAsDeadModal
        open={markDeadModalOpen}
        onClose={() => {
          setMarkDeadModalOpen(false);
          setSelectedLeadForAction(null);
        }}
        leadId={selectedLeadForAction?.lead_id || ''}
        leadName={`${selectedLeadForAction?.first_name || ''} ${selectedLeadForAction?.last_name || ''}`.trim() || selectedLeadForAction?.username || ''}
        leadCompanyName={selectedLeadForAction?.company_name || ''}
        onSuccess={(addedToLazarus) => {
          // Refresh the leads list would go here
          if (addedToLazarus) {
            toast.success('Lead marked as dead and added to Lazarus monitoring!', {
              duration: 4000,
            });
          } else {
            toast.success('Lead marked as dead');
          }
        }}
      />
    </Box>
  );
};

export default BusinessTableCard;
