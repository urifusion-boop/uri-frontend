/**
 * SpamTableCard - Table view for spam/unqualified leads
 * PRD Feature 1: Spam Visibility - Section 3.4
 *
 * NEW COMPONENT - Does not modify existing table components
 */

import { Table, TableColumn } from '@/components/atoms/AlertTable';
import { accountIcons } from '@/constants/accountIcons';
import { DateHelper } from '@/helpers/DateHelper';
import { useSpamReasonColor } from '@/hooks/spam/useSpamLeads.hook';
import { SpamLeadDto } from '@/models/dtos/SpamLeadDto';
import { Box, Button, Chip, Pagination, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import SpamDetailsModal from '../modals/SpamDetailsModal';

interface SpamTableCardProps {
  data: SpamLeadDto[];
  total: number;
  page: number;
  pageSize: number;
  setPage: (value: number) => void;
  setPageSize: (value: number) => void;
  onPromote: (spamId: string) => void;
  onUpdateNotes?: (spamId: string, notes: string) => void;
  isPromoting?: boolean;
}

const SpamTableCard = ({ data, total, page, pageSize, setPage, setPageSize, onPromote, onUpdateNotes, isPromoting = false }: SpamTableCardProps) => {
  const { getReasonColor } = useSpamReasonColor();
  const [selectedSpam, setSelectedSpam] = useState<SpamLeadDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRowClick = (spam: SpamLeadDto) => {
    setSelectedSpam(spam);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSpam(null);
  };

  const handlePromoteClick = (e: React.MouseEvent, spam: SpamLeadDto) => {
    e.stopPropagation(); // Prevent row click
    onPromote(spam.spam_id);
  };

  const columns: TableColumn<SpamLeadDto>[] = [
    {
      key: 'display_title' as keyof SpamLeadDto,
      title: 'Lead Content',
      render: (_value, spam) => (
        <Box sx={{ cursor: 'pointer' }}>
          <Typography fontWeight={600} fontSize="14px" color="#374151" noWrap sx={{ maxWidth: 300 }}>
            {spam.display_title || 'Untitled'}
          </Typography>
          <Typography fontSize="12px" color="#6C727F" noWrap sx={{ maxWidth: 300 }}>
            {spam.display_company || spam.search_keyword}
          </Typography>
        </Box>
      ),
    },
    {
      key: 'lead_source' as keyof SpamLeadDto,
      title: 'Source',
      render: (_value, spam) => {
        const icon = accountIcons[spam.lead_source] || accountIcons['default'];
        return <Chip icon={icon} label={spam.lead_source} size="small" sx={{ backgroundColor: '#F3F4F6', fontWeight: 500 }} />;
      },
    },
    {
      key: 'spam_reason' as keyof SpamLeadDto,
      title: 'Filter Reason',
      render: (_value, spam) => (
        <Tooltip title={spam.spam_reason_detail || spam.spam_reason}>
          <Chip
            label={spam.spam_reason}
            size="small"
            sx={{
              backgroundColor: getReasonColor(spam.spam_reason),
              color: '#fff',
              fontWeight: 600,
              maxWidth: 180,
            }}
          />
        </Tooltip>
      ),
    },
    {
      key: 'intent_score' as keyof SpamLeadDto,
      title: 'Scores',
      render: (_value, spam) => {
        const scores: string[] = [];
        if (spam.intent_score !== undefined) {
          scores.push(`Intent: ${Math.round(spam.intent_score * 100)}%`);
        }
        if (spam.relevance_score !== undefined) {
          scores.push(`Rel: ${Math.round(spam.relevance_score * 100)}%`);
        }
        if (spam.commercial_relevance !== undefined) {
          scores.push(`Comm: ${Math.round(spam.commercial_relevance * 100)}%`);
        }

        return scores.length > 0 ? (
          <Box>
            {scores.map((score, idx) => (
              <Typography key={idx} fontSize="11px" color="#6C727F">
                {score}
              </Typography>
            ))}
          </Box>
        ) : (
          <Typography fontSize="11px" color="#9CA3AF">
            N/A
          </Typography>
        );
      },
    },
    {
      key: 'created_at' as keyof SpamLeadDto,
      title: 'Date',
      render: (_value, spam) => (
        <Typography fontSize="12px" color="#6C727F">
          {DateHelper.formatDate(spam.created_at)}
        </Typography>
      ),
    },
    {
      key: 'spam_id' as keyof SpamLeadDto,
      title: 'Actions',
      render: (_value, spam) => (
        <Box display="flex" gap={1} onClick={(e) => e.stopPropagation()}>
          <Button size="small" variant="outlined" onClick={() => handleRowClick(spam)} sx={{ textTransform: 'none', fontSize: '12px', minWidth: 60 }}>
            View
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={(e) => handlePromoteClick(e, spam)}
            sx={{
              backgroundColor: '#10B981',
              textTransform: 'none',
              fontSize: '12px',
              minWidth: 80,
              '&:hover': {
                backgroundColor: '#059669',
              },
            }}
          >
            Add
          </Button>
        </Box>
      ),
    },
  ];

  // Empty state
  if (data.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
          px: 3,
        }}
      >
        <Typography fontSize="18px" fontWeight={600} color="#374151" mb={1}>
          No Unqualified Leads
        </Typography>
        <Typography fontSize="14px" color="#6C727F" textAlign="center">
          All analyzed leads met your qualification criteria.
          <br />
          Great job on your targeting!
        </Typography>
      </Box>
    );
  }

  const totalPages = Math.ceil(total / pageSize);

  return (
    <>
      <Box>
        <Table columns={columns} data={data} onRowClick={handleRowClick} />

        {/* Pagination */}
        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" alignItems="center" mt={3} gap={2}>
            <Pagination count={totalPages} page={page} onChange={(_, value) => setPage(value)} color="primary" showFirstButton showLastButton />
            <Typography fontSize="13px" color="#6C727F">
              Total: {total} leads
            </Typography>
          </Box>
        )}
      </Box>

      {/* Details Modal */}
      <SpamDetailsModal open={isModalOpen} onClose={handleCloseModal} spam={selectedSpam} onPromote={onPromote} onUpdateNotes={onUpdateNotes} isPromoting={isPromoting} />
    </>
  );
};

export default SpamTableCard;
