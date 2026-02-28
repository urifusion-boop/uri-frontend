import { Table, TableColumn } from '@/components/atoms/AlertTable';
import MarkAsDeadModal from '@/components/lazarus/MarkAsDeadModal';
import useClipboard from '@/hooks/clipboard';
import { LeadDto } from '@/models/dtos/LeadsDto';
import LaunchIcon from '@mui/icons-material/Launch';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PhoneIcon from '@mui/icons-material/Phone';
import PlaceIcon from '@mui/icons-material/Place';
import StarIcon from '@mui/icons-material/Star';
import WebIcon from '@mui/icons-material/Web';
import { Box, Chip, FormControl, IconButton, Link, Menu, MenuItem, Pagination, Select, Tooltip, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { FaHeartbeat, FaMapMarkerAlt, FaSkull } from 'react-icons/fa';
import { MdAttachMoney, MdAutorenew } from 'react-icons/md';

interface GoogleMapsTableCardProps {
  data: LeadDto[];
  total: number;
  search: string;
  setSearch: (value: string) => void;
  page: number;
  pageSize: number;
  setPage: (value: number) => void;
  setPageSize: (value: number) => void;
}

const GoogleMapsTableCard = ({ data, total, page, pageSize, search, setPage, setPageSize, setSearch }: GoogleMapsTableCardProps) => {
  const router = useRouter();
  const { copyToClipboard } = useClipboard();

  // Lazarus integration - Mark as Dead modal
  const [markDeadModalOpen, setMarkDeadModalOpen] = useState(false);
  const [selectedLeadForAction, setSelectedLeadForAction] = useState<LeadDto | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  // Action menu handlers
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

  // Price level renderer
  const renderPriceLevel = (priceLevel: number | null | undefined) => {
    if (!priceLevel || priceLevel === 0) return <Typography sx={{ fontSize: 12, color: '#9ca3af' }}>-</Typography>;

    const levels = ['Free', '$', '$$', '$$$', '$$$$', '$$$$$'];
    const label = levels[priceLevel] || '-';
    const colors = ['#10b981', '#22c55e', '#eab308', '#f97316', '#ef4444', '#dc2626'];

    return (
      <Chip
        icon={<MdAttachMoney size={16} />}
        label={label}
        size="small"
        sx={{
          backgroundColor: colors[priceLevel] + '20',
          color: colors[priceLevel],
          fontWeight: 600,
          fontSize: 11,
        }}
      />
    );
  };

  // Business status renderer
  const renderBusinessStatus = (status: string | null | undefined) => {
    const statusMap: Record<string, { label: string; color: string; bgColor: string }> = {
      OPERATIONAL: { label: 'Open', color: '#10b981', bgColor: '#10b98120' },
      CLOSED_TEMPORARILY: { label: 'Temp Closed', color: '#f59e0b', bgColor: '#f59e0b20' },
      CLOSED_PERMANENTLY: { label: 'Closed', color: '#ef4444', bgColor: '#ef444420' },
    };

    const statusInfo = statusMap[status || 'OPERATIONAL'] || { label: 'Unknown', color: '#6b7280', bgColor: '#6b728020' };

    return (
      <Chip
        label={statusInfo.label}
        size="small"
        sx={{
          backgroundColor: statusInfo.bgColor,
          color: statusInfo.color,
          fontWeight: 600,
          fontSize: 11,
        }}
      />
    );
  };

  // Rating renderer
  const renderRating = (rating: number | null | undefined, reviewCount: number | null | undefined) => {
    if (!rating) {
      return <Typography sx={{ fontSize: 12, color: '#9ca3af' }}>No rating</Typography>;
    }

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
        <StarIcon sx={{ fontSize: 16, color: '#fbbf24' }} />
        <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{rating.toFixed(1)}</Typography>
        {reviewCount && reviewCount > 0 && <Typography sx={{ fontSize: 11, color: '#6b7280' }}>({reviewCount})</Typography>}
      </Box>
    );
  };

  const columns: TableColumn<LeadDto>[] = [
    {
      key: 'company_name' as any,
      title: 'Business Details',
      render: (_, row) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, minWidth: 180 }}>
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#111827' }}>{row.company_name || 'Unknown Business'}</Typography>
          {row.business_category && (
            <Chip
              label={row.business_category.replace(/_/g, ' ')}
              size="small"
              sx={{
                fontSize: 10,
                height: 20,
                backgroundColor: '#CD1B7820',
                color: '#CD1B78',
                fontWeight: 500,
                width: 'fit-content',
              }}
            />
          )}
        </Box>
      ),
    },
    {
      key: 'google_rating' as any,
      title: 'Rating',
      render: (_, row) => renderRating(row.google_rating, row.google_reviews_count),
    },
    {
      key: 'price_level',
      title: 'Price',
      render: (_, row) => renderPriceLevel(row.price_level),
    },
    {
      key: 'business_status' as any,
      title: 'Status',
      render: (_, row) => renderBusinessStatus(row.business_status),
    },
    {
      key: 'formatted_address' as any,
      title: 'Address',
      render: (_, row) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, minWidth: 200 }}>
          <Typography
            sx={{
              fontSize: 12,
              color: '#374151',
              lineHeight: 1.4,
              wordWrap: 'break-word',
              whiteSpace: 'normal',
            }}
          >
            {row.formatted_address || row.location || '-'}
          </Typography>
          {row.latitude && row.longitude && (
            <Tooltip title={`Lat: ${row.latitude.toFixed(6)}, Lng: ${row.longitude.toFixed(6)}`}>
              <Typography
                sx={{
                  fontSize: 10,
                  color: '#9ca3af',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.3,
                  cursor: 'pointer',
                  '&:hover': { color: '#CD1B78' },
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(`${row.latitude}, ${row.longitude}`);
                  toast.success('Coordinates copied!');
                }}
              >
                <PlaceIcon sx={{ fontSize: 12 }} />
                {row.latitude.toFixed(4)}, {row.longitude.toFixed(4)}
              </Typography>
            </Tooltip>
          )}
        </Box>
      ),
    },
    {
      key: 'phone' as any,
      title: 'Contact',
      render: (_, row) => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, minWidth: 150 }}>
          {row.phone && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PhoneIcon sx={{ fontSize: 14, color: '#6b7280' }} />
              <Typography
                sx={{
                  fontSize: 12,
                  color: '#374151',
                  cursor: 'pointer',
                  '&:hover': { color: '#CD1B78', textDecoration: 'underline' },
                  wordWrap: 'break-word',
                  whiteSpace: 'normal',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(row.phone!);
                  toast.success('Phone copied!');
                }}
              >
                {row.phone}
              </Typography>
            </Box>
          )}
          {row.website_url && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <WebIcon sx={{ fontSize: 14, color: '#6b7280' }} />
              <Link
                href={row.website_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                sx={{
                  fontSize: 12,
                  color: '#2563eb',
                  textDecoration: 'none',
                  '&:hover': { textDecoration: 'underline' },
                  wordWrap: 'break-word',
                  whiteSpace: 'normal',
                }}
              >
                Website
              </Link>
            </Box>
          )}
          {!row.phone && !row.website_url && <Typography sx={{ fontSize: 12, color: '#9ca3af' }}>-</Typography>}
        </Box>
      ),
    },
    {
      key: 'id' as any,
      title: 'Actions',
      render: (_, row) => (
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {/* View on Google Maps */}
          {row.google_place_id && (
            <Tooltip title="View on Google Maps">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`https://www.google.com/maps/place/?q=place_id:${row.google_place_id}`, '_blank');
                }}
                sx={{
                  color: '#CD1B78',
                  '&:hover': { backgroundColor: '#CD1B7810' },
                }}
              >
                <FaMapMarkerAlt size={16} />
              </IconButton>
            </Tooltip>
          )}

          {/* Lazarus Status Indicators */}
          {row.is_lazarus_monitored && (
            <Tooltip title={`Lazarus: ${row.resurrection_count || 0} resurrections`}>
              <IconButton
                size="small"
                sx={{
                  color: row.lead_status === 'Dead' ? '#ef4444' : '#10b981',
                }}
              >
                {row.lead_status === 'Dead' ? <FaSkull size={14} /> : <FaHeartbeat size={14} />}
              </IconButton>
            </Tooltip>
          )}

          {row.resurrection_count && row.resurrection_count > 0 && (
            <Chip
              icon={<MdAutorenew size={12} />}
              label={row.resurrection_count}
              size="small"
              sx={{
                height: 20,
                fontSize: 10,
                backgroundColor: '#10b98120',
                color: '#10b981',
              }}
            />
          )}

          {/* More actions menu */}
          <IconButton size="small" onClick={(e) => handleOpenMenu(e, row)}>
            <MoreVertIcon fontSize="small" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <>
      <Box sx={{ width: '100%', overflowX: { xs: 'auto', md: 'visible' }, mt: 2 }}>
        <div style={{ tableLayout: 'fixed', width: '100%' }}>
          <Table<any>
            columns={columns}
            data={data.map((lead) => ({
              ...lead,
              id: lead.lead_id || lead.id || lead.company_name || '-',
            }))}
            onRowClick={(row) => router.push(`/leads-tracking/overview?lead_id=${row.lead_id}`)}
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

      {/* Action Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseMenu}>
        <MenuItem onClick={() => router.push(`/leads-tracking/overview?lead_id=${selectedLeadForAction?.lead_id}`)}>View Details</MenuItem>
        {selectedLeadForAction?.google_place_id && (
          <MenuItem
            onClick={() => {
              window.open(`https://www.google.com/maps/place/?q=place_id:${selectedLeadForAction.google_place_id}`, '_blank');
              handleCloseMenu();
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LaunchIcon fontSize="small" />
              Open in Google Maps
            </Box>
          </MenuItem>
        )}
        {selectedLeadForAction?.phone && (
          <MenuItem
            onClick={() => {
              copyToClipboard(selectedLeadForAction.phone!);
              toast.success('Phone copied!');
              handleCloseMenu();
            }}
          >
            Copy Phone Number
          </MenuItem>
        )}
        {selectedLeadForAction?.is_lazarus_monitored && (
          <MenuItem onClick={handleViewInLazarus}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <FaHeartbeat size={14} />
              View in Lazarus
            </Box>
          </MenuItem>
        )}
        <MenuItem onClick={handleMarkAsDead} sx={{ color: '#ef4444' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FaSkull size={14} />
            Mark as Dead
          </Box>
        </MenuItem>
      </Menu>

      {/* Mark as Dead Modal */}
      <MarkAsDeadModal
        open={markDeadModalOpen}
        onClose={() => setMarkDeadModalOpen(false)}
        leadId={selectedLeadForAction?.lead_id || ''}
        leadName={selectedLeadForAction?.first_name || selectedLeadForAction?.company_name}
        leadCompanyName={selectedLeadForAction?.company_name}
      />
    </>
  );
};

export default GoogleMapsTableCard;
