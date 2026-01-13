import { Table, TableColumn } from '@/components/atoms/AlertTable';
import MarkAsDeadModal from '@/components/lazarus/MarkAsDeadModal';
import { accountIcons } from '@/constants/accountIcons';
import { PlatformHelper } from '@/helpers/PlatformHelper';
import useClipboard from '@/hooks/clipboard';
import { useLeadTrackingHook } from '@/hooks/leads-tracking/leadsTracking.hook';
import { LeadDto } from '@/models/dtos/LeadsDto';
import { CampaignPlatformEnum } from '@/models/enum-models/PlatformEnum';
import EmailIcon from '@mui/icons-material/Email';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PhoneIcon from '@mui/icons-material/Phone';
import { Box, Button, Chip, FormControl, IconButton, Menu, MenuItem, Pagination, Select, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaHeartbeat, FaSkull } from 'react-icons/fa';
import { MdAutorenew } from 'react-icons/md';
import IdentityBox from '../boxes/IdentityBox';
import RevealBox from '../boxes/RevealBox';
import Spinner from '../loaders/Spinner';

interface OrganizationTableColumnProps {
  data: LeadDto[];
  total: number;
  search: string;
  setSearch: (value: string) => void;
  page: number;
  pageSize: number;
  setPage: (value: number) => void;
  setPageSize: (value: number) => void;
}

const OrganizationTableCard = ({ data, total, page, pageSize, search, setPage, setPageSize, setSearch }: OrganizationTableColumnProps) => {
  const router = useRouter();
  const { copyToClipboard } = useClipboard();
  const { enrichLead, isEnrichingLead } = useLeadTrackingHook('leads');

  // State for selected leads
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [selectedLeads, setSelectedLeads] = useState<LeadDto[]>([]);
  const [isRevealingEmail, setIsRevealingEmail] = useState<boolean>(false);
  const [isRevealingPhone, setIsRevealingPhone] = useState<boolean>(false);

  // Lazarus integration - Mark as Dead modal
  const [markDeadModalOpen, setMarkDeadModalOpen] = useState(false);
  const [selectedLeadForAction, setSelectedLeadForAction] = useState<LeadDto | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Clear selection when page/data changes
  useEffect(() => {
    setSelectedLeadIds([]);
    setSelectedLeads([]);
    setIsRevealingEmail(false);
    setIsRevealingPhone(false);
  }, [page, data]);

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
      key: 'company_name',
      title: 'Company',
      render: (_, row) => <IdentityBox name={row.company_name ?? '-'} jobTitle={row.industry ?? ''} imageUrl={row.company_logo} />,
    },
    {
      key: 'organization_revenue',
      title: 'Revenue',
      render: (_, row) => <Typography className="text-sm text-center font-bold">{row.organization_revenue ?? '-'}</Typography>,
    },
    {
      key: 'lead_email',
      title: 'Email',
      render: (_, row) => <RevealBox type="email" value={row.lead_email} leadIds={[row.lead_id ?? '']} />,
    },
    {
      key: 'founded_year',
      title: 'Founded',
      render: (_, row) => <Typography className="text-sm text-center font-bold">{row.founded_year ?? '-'}</Typography>,
    },

    {
      key: 'phone',
      title: 'Phone',
      render: (_, row) => <RevealBox type="phone" value={row.phone} leadIds={[row.lead_id ?? '']} />,
    },
    {
      key: 'location',
      title: 'Location',
      render: (_, row) => <Typography className="text-sm text-center text-gray-600">{row.location ?? '-'}</Typography>,
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
        leadName={selectedLeadForAction?.company_name || ''}
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

export default OrganizationTableCard;

// {
//   "data": [
//       {
//           "lead_id": "6867c127ebeefb4ca1108e80",
//           "username": "Electrical Wholesalers Inc. - CT",
//           "first_name": null,
//           "last_name": null,
//           "phone": "+1 860-357-6064",
//           "company_name": "Electrical Wholesalers Inc. - CT",
//           "job_title": null,
//           "keywords": [],
//           "industry": "Energy & Utilities",
//           "location": null,
//           "lead_email": null,
//           "lead_source": "Other",
//           "lead_status": "New",
//           "interest_level": "High",
//           "assigned_to": "6565a3353feb35b81394d3d4",
//           "notes": null,
//           "tags": null,
//           "score": null,
//           "social_profile": "http://www.linkedin.com/company/electricalwholesalersct",
//           "social_profile_link": "http://www.linkedin.com/company/electricalwholesalersct",
//           "picture_url": "https://zenprospect-production.s3.amazonaws.com/uploads/pictures/685e3950d2faa80001e42185/picture",
//           "company_logo": "https://zenprospect-production.s3.amazonaws.com/uploads/pictures/685e3950d2faa80001e42185/picture",
//           "blog_url": null,
//           "angellist_url": null,
//           "crunchbase_url": null,
//           "languages": [
//               "English"
//           ],
//           "founded_year": 1956,
//           "primary_domain": "ew-ct.com",
//           "organization_revenue": 11855000,
//           "organization_revenue_printed": "11.9M",
//           "organization_headcount_six_month_growth": 0,
//           "organization_headcount_twelve_month_growth": 0,
//           "organization_headcount_twenty_four_month_growth": 0,
//           "linkedin_url": "http://www.linkedin.com/company/electricalwholesalersct",
//           "facebook_url": "https://www.facebook.com/Electrical-Wholesalers-623192564546243/",
//           "twitter_url": "https://twitter.com/electwholesaler",
//           "github_url": null,
//           "website_url": "http://www.ew-ct.com",
//           "communication_history": null,
//           "campaign_id": null,
//           "mention": null,
//           "summary_of_mention": null,
//           "opportunity_type": null,
//           "lead_reason": "Discovered Electrical Wholesalers Inc. - CT through Apollo's organization database. Potential partnership or client opportunity.",
//           "lead_link": "http://www.linkedin.com/company/electricalwholesalersct",
//           "follow_up_message": "Hi team at Electrical Wholesalers Inc. - CT! I came across your company and was impressed by your expertise in the electrical wholesale industry. I believe there are great opportunities for us to collaborate and support each other's growth. Let's discuss how we can work together!",
//           "follow_up_approach": "LinkedIn",
//           "starred": false,
//           "lead_type": "ORGANIZATION",
//           "emailed": false,
//           "called": false,
//           "lead_form_snapshot_id": null,
//           "created_date": "2025-07-04T11:55:19.460355",
//           "last_updated": "2025-07-04T11:55:19.460360",
//           "id": "5f423876975e5b00012c883f"
//       },
//       {
//           "lead_id": "6867c127ebeefb4ca1108e7f",
//           "username": "Progressive Grocer",
//           "first_name": null,
//           "last_name": null,
//           "phone": "+1 978-671-0449",
//           "company_name": "Progressive Grocer",
//           "job_title": null,
//           "keywords": [],
//           "industry": "Retail & Consumer Goods",
//           "location": null,
//           "lead_email": null,
//           "lead_source": "Other",
//           "lead_status": "New",
//           "interest_level": "High",
//           "assigned_to": "6565a3353feb35b81394d3d4",
//           "notes": null,
//           "tags": null,
//           "score": null,
//           "social_profile": "http://www.linkedin.com/company/progressive-grocer",
//           "social_profile_link": "http://www.linkedin.com/company/progressive-grocer",
//           "picture_url": "https://zenprospect-production.s3.amazonaws.com/uploads/pictures/6866091cda76bc0001e04ac9/picture",
//           "company_logo": "https://zenprospect-production.s3.amazonaws.com/uploads/pictures/6866091cda76bc0001e04ac9/picture",
//           "blog_url": null,
//           "angellist_url": null,
//           "crunchbase_url": null,
//           "languages": [],
//           "founded_year": 1922,
//           "primary_domain": "progressivegrocer.com",
//           "organization_revenue": 5372000,
//           "organization_revenue_printed": "5.4M",
//           "organization_headcount_six_month_growth": 0,
//           "organization_headcount_twelve_month_growth": 0,
//           "organization_headcount_twenty_four_month_growth": 0,
//           "linkedin_url": "http://www.linkedin.com/company/progressive-grocer",
//           "facebook_url": "https://www.facebook.com/progressivegrocer",
//           "twitter_url": "https://twitter.com/pgrocer",
//           "github_url": null,
//           "website_url": "http://www.progressivegrocer.com",
//           "communication_history": null,
//           "campaign_id": null,
//           "mention": null,
//           "summary_of_mention": null,
//           "opportunity_type": null,
//           "lead_reason": "Discovered Progressive Grocer through Apollo's organization database. Potential partnership or client opportunity.",
//           "lead_link": "http://www.linkedin.com/company/progressive-grocer",
//           "follow_up_message": "Hi Progressive Grocer team, I hope this message finds you well! I came across your company and was impressed by your long-standing reputation in the grocery industry. I’d love to explore potential ways we can collaborate to enhance your offerings or support your goals. Looking forward to hearing from you!",
//           "follow_up_approach": "LinkedIn",
//           "starred": false,
//           "lead_type": "ORGANIZATION",
//           "emailed": false,
//           "called": false,
//           "lead_form_snapshot_id": null,
//           "created_date": "2025-07-04T11:55:19.460328",
//           "last_updated": "2025-07-04T11:55:19.460332",
//           "id": "6867c10cebeefb4ca1108e5f"
//       },
//       {
//           "lead_id": "6867c127ebeefb4ca1108e7e",
//           "username": "Agencias MOTTA, S.A.",
//           "first_name": null,
//           "last_name": null,
//           "phone": null,
//           "company_name": "Agencias MOTTA, S.A.",
//           "job_title": null,
//           "keywords": [],
//           "industry": "Transportation & Logistics",
//           "location": null,
//           "lead_email": null,
//           "lead_source": "Other",
//           "lead_status": "New",
//           "interest_level": "High",
//           "assigned_to": "6565a3353feb35b81394d3d4",
//           "notes": null,
//           "tags": null,
//           "score": null,
//           "social_profile": "http://www.linkedin.com/company/agenciasmottasa",
//           "social_profile_link": "http://www.linkedin.com/company/agenciasmottasa",
//           "picture_url": "https://zenprospect-production.s3.amazonaws.com/uploads/pictures/6863d7d547b07900019d86d7/picture",
//           "company_logo": "https://zenprospect-production.s3.amazonaws.com/uploads/pictures/6863d7d547b07900019d86d7/picture",
//           "blog_url": null,
//           "angellist_url": null,
//           "crunchbase_url": null,
//           "languages": [
//               "Spanish"
//           ],
//           "founded_year": 1967,
//           "primary_domain": "agenciasmotta.com",
//           "organization_revenue": 0,
//           "organization_revenue_printed": null,
//           "organization_headcount_six_month_growth": 0,
//           "organization_headcount_twelve_month_growth": 0,
//           "organization_headcount_twenty_four_month_growth": 0,
//           "linkedin_url": "http://www.linkedin.com/company/agenciasmottasa",
//           "facebook_url": "https://www.facebook.com/grupoagenciasmotta/",
//           "twitter_url": null,
//           "github_url": null,
//           "website_url": "http://www.agenciasmotta.com",
//           "communication_history": null,
//           "campaign_id": null,
//           "mention": null,
//           "summary_of_mention": null,
//           "opportunity_type": null,
//           "lead_reason": "Discovered Agencias MOTTA, S.A. through Apollo's organization database. Potential partnership or client opportunity.",
//           "lead_link": "http://www.linkedin.com/company/agenciasmottasa",
//           "follow_up_message": "Hi team at Agencias MOTTA, S.A.! I noticed your impressive work in the transportation and logistics sector. I believe there are several opportunities where we could collaborate effectively. Looking forward to connecting!",
//           "follow_up_approach": "LinkedIn",
//           "starred": false,
//           "lead_type": "ORGANIZATION",
//           "emailed": false,
//           "called": false,
//           "lead_form_snapshot_id": null,
//           "created_date": "2025-07-04T11:55:19.460299",
//           "last_updated": "2025-07-04T11:55:19.460303",
//           "id": "54a11f1b69702da10f58cc01"
//       },
//       {
//           "lead_id": "6867c127ebeefb4ca1108e7d",
//           "username": "Feeser's Food Distributors",
//           "first_name": null,
//           "last_name": null,
//           "phone": "+1 800-326-2828",
//           "company_name": "Feeser's Food Distributors",
//           "job_title": null,
//           "keywords": [],
//           "industry": "Retail & Consumer Goods",
//           "location": null,
//           "lead_email": null,
//           "lead_source": "Other",
//           "lead_status": "New",
//           "interest_level": "High",
//           "assigned_to": "6565a3353feb35b81394d3d4",
//           "notes": null,
//           "tags": [],
//           "score": null,
//           "social_profile": "http://www.linkedin.com/company/feesers-food-distributors",
//           "social_profile_link": "http://www.linkedin.com/company/feesers-food-distributors",
//           "picture_url": "https://zenprospect-production.s3.amazonaws.com/uploads/pictures/6863dd8c6d63ec0001d45e12/picture",
//           "company_logo": "https://zenprospect-production.s3.amazonaws.com/uploads/pictures/6863dd8c6d63ec0001d45e12/picture",
//           "blog_url": null,
//           "angellist_url": null,
//           "crunchbase_url": null,
//           "languages": [],
//           "founded_year": 1901,
//           "primary_domain": "feesers.com",
//           "organization_revenue": 172500000,
//           "organization_revenue_printed": "172.5M",
//           "organization_headcount_six_month_growth": 0,
//           "organization_headcount_twelve_month_growth": 0,
//           "organization_headcount_twenty_four_month_growth": 0,
//           "linkedin_url": "http://www.linkedin.com/company/feesers-food-distributors",
//           "facebook_url": "https://www.facebook.com/FeesersFoodDistributors/",
//           "twitter_url": null,
//           "github_url": null,
//           "website_url": "http://www.feesers.com",
//           "communication_history": [],
//           "campaign_id": null,
//           "mention": null,
//           "summary_of_mention": null,
//           "opportunity_type": null,
//           "lead_reason": "Discovered Feeser's Food Distributors through Apollo's organization database. Potential partnership or client opportunity.",
//           "lead_link": "http://www.linkedin.com/company/feesers-food-distributors",
//           "follow_up_message": "Hi team at Feeser's Food Distributors, I'm really impressed by your extensive history since 1901 and your commitment to quality food distribution. I’d love to explore potential collaboration opportunities that could benefit both our organizations. Looking forward to connecting!",
//           "follow_up_approach": "LinkedIn",
//           "starred": false,
//           "lead_type": "ORGANIZATION",
//           "emailed": false,
//           "called": false,
//           "lead_form_snapshot_id": null,
//           "created_date": "2025-07-04T11:55:19.460270",
//           "last_updated": "2025-07-04T11:55:19.460274",
//           "id": "5fdb03c353c80c00012029b9"
//       },
//       {
//           "lead_id": "6867c127ebeefb4ca1108e7c",
//           "username": "Beverage Trade Network",
//           "first_name": null,
//           "last_name": null,
//           "phone": "+1 855-481-1112",
//           "company_name": "Beverage Trade Network",
//           "job_title": null,
//           "keywords": [],
//           "industry": "Retail & Consumer Goods",
//           "location": null,
//           "lead_email": null,
//           "lead_source": "Other",
//           "lead_status": "New",
//           "interest_level": "High",
//           "assigned_to": "6565a3353feb35b81394d3d4",
//           "notes": null,
//           "tags": null,
//           "score": null,
//           "social_profile": "http://www.linkedin.com/company/beveragetradenetwork-com",
//           "social_profile_link": "http://www.linkedin.com/company/beveragetradenetwork-com",
//           "picture_url": "https://zenprospect-production.s3.amazonaws.com/uploads/pictures/6864fbea35cd8b00013762bc/picture",
//           "company_logo": "https://zenprospect-production.s3.amazonaws.com/uploads/pictures/6864fbea35cd8b00013762bc/picture",
//           "blog_url": null,
//           "angellist_url": null,
//           "crunchbase_url": null,
//           "languages": [
//               "English"
//           ],
//           "founded_year": 2012,
//           "primary_domain": "beveragetradenetwork.com",
//           "organization_revenue": 6015000,
//           "organization_revenue_printed": "6M",
//           "organization_headcount_six_month_growth": 0,
//           "organization_headcount_twelve_month_growth": 0,
//           "organization_headcount_twenty_four_month_growth": 0,
//           "linkedin_url": "http://www.linkedin.com/company/beveragetradenetwork-com",
//           "facebook_url": "https://www.facebook.com/BeverageTradeNetwork",
//           "twitter_url": "https://twitter.com/Beveragetrade",
//           "github_url": null,
//           "website_url": "http://www.beveragetradenetwork.com",
//           "communication_history": null,
//           "campaign_id": null,
//           "mention": null,
//           "summary_of_mention": null,
//           "opportunity_type": null,
//           "lead_reason": "Discovered Beverage Trade Network through Apollo's organization database. Potential partnership or client opportunity.",
//           "lead_link": "http://www.linkedin.com/company/beveragetradenetwork-com",
//           "follow_up_message": "Hi team at Beverage Trade Network, I came across your company and was impressed by your mission. I’d love to explore potential ways we can collaborate or support your goals.",
//           "follow_up_approach": "LinkedIn",
//           "starred": false,
//           "lead_type": "ORGANIZATION",
//           "emailed": false,
//           "called": false,
//           "lead_form_snapshot_id": null,
//           "created_date": "2025-07-04T11:55:19.460240",
//           "last_updated": "2025-07-04T11:55:19.460245",
//           "id": "54a1273b69702dc128b81800"
//       },
//       {
//           "lead_id": "6867c127ebeefb4ca1108e7b",
//           "username": "Apeel",
//           "first_name": null,
//           "last_name": null,
//           "phone": "+1 877-926-5184",
//           "company_name": "Apeel",
//           "job_title": null,
//           "keywords": [],
//           "industry": "Technology & Telecommunications",
//           "location": null,
//           "lead_email": null,
//           "lead_source": "Other",
//           "lead_status": "New",
//           "interest_level": "High",
//           "assigned_to": "6565a3353feb35b81394d3d4",
//           "notes": null,
//           "tags": null,
//           "score": null,
//           "social_profile": "http://www.linkedin.com/company/apeel",
//           "social_profile_link": "http://www.linkedin.com/company/apeel",
//           "picture_url": "https://zenprospect-production.s3.amazonaws.com/uploads/pictures/68654d9f8b28b800014784de/picture",
//           "company_logo": "https://zenprospect-production.s3.amazonaws.com/uploads/pictures/68654d9f8b28b800014784de/picture",
//           "blog_url": null,
//           "angellist_url": null,
//           "crunchbase_url": null,
//           "languages": [
//               "English"
//           ],
//           "founded_year": 2012,
//           "primary_domain": "apeel.com",
//           "organization_revenue": 200000000,
//           "organization_revenue_printed": "200M",
//           "organization_headcount_six_month_growth": 0,
//           "organization_headcount_twelve_month_growth": 2,
//           "organization_headcount_twenty_four_month_growth": 0,
//           "linkedin_url": "http://www.linkedin.com/company/apeel",
//           "facebook_url": "https://www.facebook.com/Apeel/",
//           "twitter_url": "https://twitter.com/apeelsciences",
//           "github_url": null,
//           "website_url": "http://www.apeel.com",
//           "communication_history": null,
//           "campaign_id": null,
//           "mention": null,
//           "summary_of_mention": null,
//           "opportunity_type": null,
//           "lead_reason": "Discovered Apeel through Apollo's organization database. Potential partnership or client opportunity.",
//           "lead_link": "http://www.linkedin.com/company/apeel",
//           "follow_up_message": "Hi team at Apeel, I came across your company and was impressed by your mission to reduce food waste through innovative solutions. I’d love to explore potential ways we can collaborate or support your goals in sustainability!",
//           "follow_up_approach": "LinkedIn",
//           "starred": false,
//           "lead_type": "ORGANIZATION",
//           "emailed": false,
//           "called": false,
//           "lead_form_snapshot_id": null,
//           "created_date": "2025-07-04T11:55:19.460211",
//           "last_updated": "2025-07-04T11:55:19.460215",
//           "id": "556d3c2c7369641284caba00"
//       },
//       {
//           "lead_id": "6867c127ebeefb4ca1108e7a",
//           "username": "Dastgyr",
//           "first_name": null,
//           "last_name": null,
//           "phone": "+1 326-809-6142",
//           "company_name": "Dastgyr",
//           "job_title": null,
//           "keywords": [],
//           "industry": "Technology & Telecommunications",
//           "location": null,
//           "lead_email": null,
//           "lead_source": "Other",
//           "lead_status": "New",
//           "interest_level": "Medium",
//           "assigned_to": "6565a3353feb35b81394d3d4",
//           "notes": null,
//           "tags": null,
//           "score": null,
//           "social_profile": "http://www.linkedin.com/company/dastgyr",
//           "social_profile_link": "http://www.linkedin.com/company/dastgyr",
//           "picture_url": "https://zenprospect-production.s3.amazonaws.com/uploads/pictures/685cfb9222333f000186f7c2/picture",
//           "company_logo": "https://zenprospect-production.s3.amazonaws.com/uploads/pictures/685cfb9222333f000186f7c2/picture",
//           "blog_url": null,
//           "angellist_url": null,
//           "crunchbase_url": null,
//           "languages": [],
//           "founded_year": 2020,
//           "primary_domain": "dastgyr.com",
//           "organization_revenue": 1800000,
//           "organization_revenue_printed": "1.8M",
//           "organization_headcount_six_month_growth": 0,
//           "organization_headcount_twelve_month_growth": 0,
//           "organization_headcount_twenty_four_month_growth": 0,
//           "linkedin_url": "http://www.linkedin.com/company/dastgyr",
//           "facebook_url": "https://facebook.com/Dastgyr-100950988478834/",
//           "twitter_url": "https://twitter.com/dastgyr",
//           "github_url": null,
//           "website_url": "http://www.dastgyr.com",
//           "communication_history": null,
//           "campaign_id": null,
//           "mention": null,
//           "summary_of_mention": null,
//           "opportunity_type": null,
//           "lead_reason": "Discovered Dastgyr through Apollo's organization database. Potential partnership or client opportunity.",
//           "lead_link": "http://www.linkedin.com/company/dastgyr",
//           "follow_up_message": "Hi team at Dastgyr, I came across your company and was impressed by your mission. I’d love to explore potential ways we can collaborate or support your goals.",
//           "follow_up_approach": "LinkedIn",
//           "starred": false,
//           "lead_type": "ORGANIZATION",
//           "emailed": false,
//           "called": false,
//           "lead_form_snapshot_id": null,
//           "created_date": "2025-07-04T11:55:19.460181",
//           "last_updated": "2025-07-04T11:55:19.460186",
//           "id": "5f4a7400a0b4f80001c2d001"
//       },
//       {
//           "lead_id": "6867c127ebeefb4ca1108e79",
//           "username": "Airalo",
//           "first_name": null,
//           "last_name": null,
//           "phone": null,
//           "company_name": "Airalo",
//           "job_title": null,
//           "keywords": [],
//           "industry": "Technology & Telecommunications",
//           "location": null,
//           "lead_email": null,
//           "lead_source": "Other",
//           "lead_status": "New",
//           "interest_level": "High",
//           "assigned_to": "6565a3353feb35b81394d3d4",
//           "notes": null,
//           "tags": [],
//           "score": null,
//           "social_profile": "http://www.linkedin.com/company/airalocom",
//           "social_profile_link": "http://www.linkedin.com/company/airalocom",
//           "picture_url": "https://zenprospect-production.s3.amazonaws.com/uploads/pictures/686398dc8899450001c1be0c/picture",
//           "company_logo": "https://zenprospect-production.s3.amazonaws.com/uploads/pictures/686398dc8899450001c1be0c/picture",
//           "blog_url": null,
//           "angellist_url": null,
//           "crunchbase_url": null,
//           "languages": [],
//           "founded_year": 2019,
//           "primary_domain": "airalo.com",
//           "organization_revenue": 5000000,
//           "organization_revenue_printed": "5M",
//           "organization_headcount_six_month_growth": 0,
//           "organization_headcount_twelve_month_growth": 0,
//           "organization_headcount_twenty_four_month_growth": 0,
//           "linkedin_url": "http://www.linkedin.com/company/airalocom",
//           "facebook_url": "https://facebook.com/airalocom",
//           "twitter_url": "https://twitter.com/airalocom",
//           "github_url": null,
//           "website_url": "http://www.airalo.com",
//           "communication_history": null,
//           "campaign_id": null,
//           "mention": null,
//           "summary_of_mention": null,
//           "opportunity_type": null,
//           "lead_reason": "Discovered Airalo through Apollo's organization database. Potential partnership or client opportunity.",
//           "lead_link": "http://www.linkedin.com/company/airalocom",
//           "follow_up_message": "Hi team at Airalo, I came across your company and was impressed by your mission to provide eSIM solutions globally. I’d love to explore potential ways we can collaborate or support your goals.",
//           "follow_up_approach": "LinkedIn",
//           "starred": false,
//           "lead_type": "ORGANIZATION",
//           "emailed": false,
//           "called": false,
//           "lead_form_snapshot_id": null,
//           "created_date": "2025-07-04T11:55:19.460150",
//           "last_updated": "2025-07-04T11:55:19.460154",
//           "id": "5da395aead1de800da9e257d"
//       },
//       {
//           "lead_id": "6867c127ebeefb4ca1108e78",
//           "username": "G&C Food Distributors Inc",
//           "first_name": null,
//           "last_name": null,
//           "phone": "+1 800-333-0949",
//           "company_name": "G&C Food Distributors Inc",
//           "job_title": null,
//           "keywords": [],
//           "industry": "Retail & Consumer Goods",
//           "location": null,
//           "lead_email": null,
//           "lead_source": "Other",
//           "lead_status": "New",
//           "interest_level": "High",
//           "assigned_to": "6565a3353feb35b81394d3d4",
//           "notes": null,
//           "tags": null,
//           "score": null,
//           "social_profile": "http://www.linkedin.com/company/g-c-food-distributors-inc",
//           "social_profile_link": "http://www.linkedin.com/company/g-c-food-distributors-inc",
//           "picture_url": "https://zenprospect-production.s3.amazonaws.com/uploads/pictures/685b1a682cd3f10001d6f29d/picture",
//           "company_logo": "https://zenprospect-production.s3.amazonaws.com/uploads/pictures/685b1a682cd3f10001d6f29d/picture",
//           "blog_url": null,
//           "angellist_url": null,
//           "crunchbase_url": null,
//           "languages": [
//               "English"
//           ],
//           "founded_year": 1976,
//           "primary_domain": "gcfoods.com",
//           "organization_revenue": 8504000,
//           "organization_revenue_printed": "8.5M",
//           "organization_headcount_six_month_growth": 0,
//           "organization_headcount_twelve_month_growth": 0,
//           "organization_headcount_twenty_four_month_growth": 0,
//           "linkedin_url": "http://www.linkedin.com/company/g-c-food-distributors-inc",
//           "facebook_url": "https://facebook.com/gcfoodsinc",
//           "twitter_url": null,
//           "github_url": null,
//           "website_url": "http://www.gcfoods.com",
//           "communication_history": null,
//           "campaign_id": null,
//           "mention": null,
//           "summary_of_mention": null,
//           "opportunity_type": null,
//           "lead_reason": "Discovered G&C Food Distributors Inc through Apollo's organization database. Potential partnership or client opportunity.",
//           "lead_link": "http://www.linkedin.com/company/g-c-food-distributors-inc",
//           "follow_up_message": "Hi G&C Food Distributors Team! I hope this message finds you well. I recently came across your company and am impressed by your mission in the food distribution industry. I'd love to discuss potential partnership opportunities and how we can support each other’s goals. Looking forward to connecting!",
//           "follow_up_approach": "LinkedIn",
//           "starred": false,
//           "lead_type": "ORGANIZATION",
//           "emailed": false,
//           "called": false,
//           "lead_form_snapshot_id": null,
//           "created_date": "2025-07-04T11:55:19.460116",
//           "last_updated": "2025-07-04T11:55:19.460121",
//           "id": "54a2009074686938253f8a04"
//       },
//       {
//           "lead_id": "6867c127ebeefb4ca1108e77",
//           "username": "Perfect Snacks",
//           "first_name": null,
//           "last_name": null,
//           "phone": "+1 866-628-8548",
//           "company_name": "Perfect Snacks",
//           "job_title": null,
//           "keywords": [],
//           "industry": "Retail & Consumer Goods",
//           "location": null,
//           "lead_email": null,
//           "lead_source": "Other",
//           "lead_status": "New",
//           "interest_level": "High",
//           "assigned_to": "6565a3353feb35b81394d3d4",
//           "notes": null,
//           "tags": null,
//           "score": null,
//           "social_profile": "http://www.linkedin.com/company/perfect-snacks",
//           "social_profile_link": "http://www.linkedin.com/company/perfect-snacks",
//           "picture_url": "https://zenprospect-production.s3.amazonaws.com/uploads/pictures/6862ac60a3d05f000122c3bd/picture",
//           "company_logo": "https://zenprospect-production.s3.amazonaws.com/uploads/pictures/6862ac60a3d05f000122c3bd/picture",
//           "blog_url": null,
//           "angellist_url": null,
//           "crunchbase_url": null,
//           "languages": [],
//           "founded_year": 2005,
//           "primary_domain": "perfectsnacks.com",
//           "organization_revenue": 120000000,
//           "organization_revenue_printed": "120M",
//           "organization_headcount_six_month_growth": 0,
//           "organization_headcount_twelve_month_growth": 0,
//           "organization_headcount_twenty_four_month_growth": 0,
//           "linkedin_url": "http://www.linkedin.com/company/perfect-snacks",
//           "facebook_url": "https://facebook.com/perfectbar.co",
//           "twitter_url": "https://twitter.com/Perfect_Bar",
//           "github_url": null,
//           "website_url": "http://www.perfectsnacks.com",
//           "communication_history": null,
//           "campaign_id": null,
//           "mention": null,
//           "summary_of_mention": null,
//           "opportunity_type": null,
//           "lead_reason": "Discovered Perfect Snacks through Apollo's organization database. Potential partnership or client opportunity.",
//           "lead_link": "http://www.linkedin.com/company/perfect-snacks",
//           "follow_up_message": "Hi team at Perfect Snacks, I came across your company and was impressed by your mission of providing nutritious snacks. I’d love to explore potential ways we can collaborate or support your goals.",
//           "follow_up_approach": "LinkedIn",
//           "starred": false,
//           "lead_type": "ORGANIZATION",
//           "emailed": false,
//           "called": false,
//           "lead_form_snapshot_id": null,
//           "created_date": "2025-07-04T11:55:19.460060",
//           "last_updated": "2025-07-04T11:55:19.460074",
//           "id": "615e10063f28f9011235ece2"
//       }
//   ],
//   "total": 51,
//   "page": 1,
//   "pageSize": 10,
//   "metaData": null
// }
