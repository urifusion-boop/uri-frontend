import { Table, TableColumn } from '@/components/atoms/AlertTable';
import { accountIcons } from '@/constants/accountIcons';
import { PlatformHelper } from '@/helpers/PlatformHelper';
import useClipboard from '@/hooks/clipboard';
import { useLeadTrackingHook } from '@/hooks/leads-tracking/leadsTracking.hook';
import { LeadDto } from '@/models/dtos/LeadsDto';
import { CampaignPlatformEnum } from '@/models/enum-models/PlatformEnum';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import { Box, Button, FormControl, MenuItem, Pagination, Select, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import IdentityBox from '../boxes/IdentityBox';
import RevealBox from '../boxes/RevealBox';
import Spinner from '../loaders/Spinner';
import LeadProfile from '../profile/lead/LeadProfile';

interface IndividualTableColumnProps {
  data: LeadDto[];
  total: number;
  search: string;
  setSearch: (value: string) => void;
  page: number;
  pageSize: number;
  setPage: (value: number) => void;
  setPageSize: (value: number) => void;
}

const IndividualTableCard = ({ data, total, page, pageSize, search, setPage, setPageSize, setSearch }: IndividualTableColumnProps) => {
  const { copyToClipboard } = useClipboard();
  const { enrichLead, isEnrichingLead } = useLeadTrackingHook('leads');
  const [selectedLead, setSelectedLead] = useState<LeadDto | null>(null);

  // NEW: keep selected lead ids from the table
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<LeadDto[]>([]);
  const [isRevealingEmail, setIsRevealingEmail] = useState<boolean>(false);
  const [isRevealingPhone, setIsRevealingPhone] = useState<boolean>(false);

  // Clear selection when page/data changes (optional but nice)
  useEffect(() => {
    setSelectedLeadIds([]);
    setSelectedLeads([]);
    setIsRevealingEmail(false);
    setIsRevealingPhone(false);
  }, [page, data]);

  const handleClick = (lead: LeadDto) => {
    setSelectedLead(lead);
  };

  const handleClose = () => {
    setSelectedLead(null);
  };

  const handleTableSelect = (selectedRows: LeadDto[]) => {
    setSelectedLeads(selectedRows);
    setSelectedLeadIds(selectedRows.map((lead) => lead.lead_id ?? '').filter((id) => id !== ''));
  };

  const handleBulkReveal = (type: 'email' | 'phone') => {
    if (selectedLeadIds.length === 0) return;

    const payload: any = {
      lead_ids: selectedLeadIds,
      webhook_url: '',
    };

    if (type === 'email') {
      payload.reveal_email = true;
      setIsRevealingEmail(true);
    } else {
      payload.reveal_phone = true;
      setIsRevealingPhone(true);
    }

    enrichLead(payload);
  };

  // Reset loading states when the global loading state changes
  useEffect(() => {
    if (!isEnrichingLead) {
      setIsRevealingEmail(false);
      setIsRevealingPhone(false);
    }
  }, [isEnrichingLead]);

  if (selectedLead) {
    return <LeadProfile lead={selectedLead} onClose={handleClose} />;
  }

  const columns: TableColumn<LeadDto>[] = [
    {
      key: 'id',
      title: 'Name',
      render: (_, row) => (
        <IdentityBox
          name={`${row.first_name ?? ''} ${row.last_name ?? ''}`.trim() || row.username || '-'}
          jobTitle={row.job_title ?? ''}
          imageUrl={row.picture_url}
          onClick={() => {}}
          // onClick={() => setSelectedLead(row)} // <-- fix here
          // onClick={() => router.push(`/leads-tracking/forms/leads?type=${LeadTypeEnum.PERSON}&id=${row.lead_id}`)}
          // LeadProfile
        />
      ),
    },
    {
      key: 'company_name',
      title: 'Company',
      render: (_, row) => <IdentityBox name={row.company_name ?? '-'} jobTitle={row.industry ?? ''} imageUrl={row.company_logo} />,
    },
    {
      key: 'lead_email',
      title: 'Email',
      render: (_, row) => <RevealBox type="email" value={row.lead_email} leadIds={[row.lead_id ?? '']} />,
    },
    {
      key: 'phone',
      title: 'Phone',
      render: (_, row) => <RevealBox type="phone" value={row.phone} leadIds={[row.lead_id ?? '']} />,
    },
    {
      key: 'location',
      title: 'Location',
      render: (_, row) => <Typography className="text-sm text-gray-600">{row.location ?? '-'}</Typography>,
    },
    {
      key: 'social_profile_link',
      title: 'Profile Links',
      render: (_, row) => {
        const links: { url: string | null | undefined; key: keyof typeof accountIcons; platform: string }[] = [
          { url: row.linkedin_url, key: 'Linkedin', platform: CampaignPlatformEnum.LINKEDIN },
          { url: row.facebook_url, key: 'Facebook', platform: CampaignPlatformEnum.FACEBOOK },
          { url: row.twitter_url, key: 'Twitter', platform: CampaignPlatformEnum.TWITTER },
          { url: row.github_url, key: 'X', platform: CampaignPlatformEnum.X }, // You can adjust this key if using GitHub differently
          { url: row.website_url, key: 'Instagram', platform: CampaignPlatformEnum.INSTAGRAM }, // Replace with appropriate platform
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
  ];

  return (
    <Box
      sx={{
        width: '100%',
        overflowX: { xs: 'auto', md: 'visible' },
        mt: 2,
      }}
    >
      {/* Bulk Action Buttons */}
      {selectedLeadIds.length > 0 && (
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            mb: 2,
            p: 2,
            backgroundColor: '#f8f9fa',
            borderRadius: 1,
            border: '1px solid #e9ecef',
          }}
        >
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
            {selectedLeadIds.length} selected
          </Typography>
          <Button
            variant="outlined"
            startIcon={isRevealingEmail ? <Spinner color="primary" size={16} /> : <EmailIcon />}
            onClick={() => handleBulkReveal('email')}
            disabled={isRevealingEmail || isRevealingPhone}
            size="small"
            sx={{ textTransform: 'none' }}
          >
            Reveal Emails
          </Button>
          <Button
            variant="outlined"
            startIcon={isRevealingPhone ? <Spinner color="primary" size={16} /> : <PhoneIcon />}
            onClick={() => handleBulkReveal('phone')}
            disabled={isRevealingEmail || isRevealingPhone}
            size="small"
            sx={{ textTransform: 'none' }}
          >
            Reveal Phones
          </Button>
        </Box>
      )}

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
          onSelect={handleTableSelect}
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

export default IndividualTableCard;
