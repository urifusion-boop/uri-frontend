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
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { Box, Button, Chip, Pagination, Tooltip, Typography } from '@mui/material';
import { useState } from 'react';
import ConfirmBulkDeleteModal from '../modals/ConfirmBulkDeleteModal';
import ConfirmPromoteModal from '../modals/ConfirmPromoteModal';
import SpamDetailsModal from '../modals/SpamDetailsModal';

interface SpamTableCardProps {
  data: SpamLeadDto[];
  total: number;
  page: number;
  pageSize: number;
  setPage: (value: number) => void;
  setPageSize: (value: number) => void;
  onPromote: (spamId: string) => void;
  onDelete?: (spamId: string) => void;
  onBulkDelete?: (spamIds: string[]) => void;
  onUpdateNotes?: (spamId: string, notes: string) => void;
  isPromoting?: boolean;
  isDeleting?: boolean;
}

const SpamTableCard = ({ data, total, page, pageSize, setPage, setPageSize, onPromote, onDelete, onBulkDelete, onUpdateNotes, isPromoting = false, isDeleting = false }: SpamTableCardProps) => {
  const { getReasonColor } = useSpamReasonColor();
  const [selectedSpam, setSelectedSpam] = useState<SpamLeadDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showBulkDeleteConfirm, setShowBulkDeleteConfirm] = useState(false);
  const [spamToPromote, setSpamToPromote] = useState<SpamLeadDto | null>(null);
  const [showPromoteConfirm, setShowPromoteConfirm] = useState(false);

  const handleRowClick = (spam: SpamLeadDto) => {
    setSelectedSpam(spam);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSpam(null);
  };

  const handlePromoteClick = (e: React.MouseEvent, spam: SpamLeadDto) => {
    e.stopPropagation();
    setSpamToPromote(spam);
    setShowPromoteConfirm(true);
  };

  const handleConfirmPromote = () => {
    if (spamToPromote) {
      onPromote(spamToPromote.spam_id);
      setShowPromoteConfirm(false);
      setSpamToPromote(null);
    }
  };

  const handleBulkDeleteClick = () => {
    setShowBulkDeleteConfirm(true);
  };

  const handleConfirmBulkDelete = () => {
    if (onBulkDelete && selectedIds.length > 0) {
      onBulkDelete(selectedIds);
      setSelectedIds([]);
      setShowBulkDeleteConfirm(false);
    }
  };

  const handleTableSelect = (selectedRows: SpamLeadDto[]) => {
    setSelectedIds(selectedRows.map((spam) => spam.spam_id));
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
      key: 'actions' as keyof SpamLeadDto,
      title: 'Actions',
      render: (_value, spam) => {
        const isPromoted = spam.promoted_to_leads === true;
        return (
          <Box display="flex" gap={1} alignItems="center" onClick={(e) => e.stopPropagation()}>
            <Button size="small" variant="outlined" onClick={() => handleRowClick(spam)} sx={{ textTransform: 'none', fontSize: '12px', minWidth: 60 }}>
              View
            </Button>
            {isPromoted ? (
              <Tooltip title="Already promoted to leads">
                <Button
                  size="small"
                  variant="contained"
                  disabled
                  startIcon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
                  sx={{
                    backgroundColor: '#10B981',
                    textTransform: 'none',
                    fontSize: '12px',
                    minWidth: 95,
                    '&.Mui-disabled': {
                      backgroundColor: '#10B981',
                      color: '#fff',
                      opacity: 0.9,
                    },
                  }}
                >
                  Promoted
                </Button>
              </Tooltip>
            ) : (
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
            )}
          </Box>
        );
      },
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
        {/* Bulk Actions Bar */}
        {selectedIds.length > 0 && onBulkDelete && (
          <Box
            sx={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FCA5A5',
              borderRadius: '8px',
              p: 2,
              mb: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Typography fontSize="14px" fontWeight={600} color="#374151">
              {selectedIds.length} {selectedIds.length === 1 ? 'item' : 'items'} selected
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<DeleteSweepIcon />}
              onClick={handleBulkDeleteClick}
              disabled={isDeleting}
              sx={{
                backgroundColor: '#EF4444',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#DC2626',
                },
              }}
            >
              {isDeleting ? 'Deleting...' : `Delete ${selectedIds.length} ${selectedIds.length === 1 ? 'Item' : 'Items'}`}
            </Button>
          </Box>
        )}

        <Table columns={columns} data={data} onRowClick={handleRowClick} onSelect={handleTableSelect} />

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
      <SpamDetailsModal
        open={isModalOpen}
        onClose={handleCloseModal}
        spam={selectedSpam}
        onPromote={onPromote}
        onDelete={onDelete}
        onUpdateNotes={onUpdateNotes}
        isPromoting={isPromoting}
        isDeleting={isDeleting}
      />

      {/* Promote Confirmation from Table */}
      <ConfirmPromoteModal
        open={showPromoteConfirm}
        onClose={() => setShowPromoteConfirm(false)}
        onConfirm={handleConfirmPromote}
        spamTitle={spamToPromote?.display_title}
        isProcessing={isPromoting}
      />

      {/* Bulk Delete Confirmation */}
      <ConfirmBulkDeleteModal open={showBulkDeleteConfirm} onClose={() => setShowBulkDeleteConfirm(false)} onConfirm={handleConfirmBulkDelete} count={selectedIds.length} isProcessing={isDeleting} />
    </>
  );
};

export default SpamTableCard;
