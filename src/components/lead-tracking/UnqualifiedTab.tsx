/**
 * UnqualifiedTab - Main container for spam/unqualified leads view
 * PRD Feature 1: Spam Visibility - Section 3.1-3.4
 *
 * NEW COMPONENT - Does not modify existing tabs
 */

import { useSpamLeads } from '@/hooks/spam/useSpamLeads.hook';
import { SpamReasonEnum } from '@/models/dtos/SpamLeadDto';
import BlockIcon from '@mui/icons-material/Block';
import FilterListIcon from '@mui/icons-material/FilterList';
import SourceIcon from '@mui/icons-material/Source';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Box, Grid, MenuItem, Select, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import SpamTableCard from './SpamTableCard';

interface UnqualifiedTabProps {
  userId: string;
  leadFormSnapshotId?: string;
}

const UnqualifiedTab = ({ userId, leadFormSnapshotId }: UnqualifiedTabProps) => {
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [reasonFilter, setReasonFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  console.log('🚀 [UnqualifiedTab] Rendering with userId:', userId, 'leadFormSnapshotId:', leadFormSnapshotId);

  const { spamLeads, total, page, pageSize, isLoading, setPage, setPageSize, promoteToLead, updateNotes, deleteSpamLead, bulkDeleteSpamLeads, isPromoting, isDeleting, stats } = useSpamLeads(userId, {
    lead_form_snapshot_id: leadFormSnapshotId,
    lead_source: sourceFilter !== 'all' ? sourceFilter : undefined,
    spam_reason: reasonFilter !== 'all' ? reasonFilter : undefined,
    search: searchQuery || undefined,
  });

  // Filter spam leads based on current filters
  const filteredSpamLeads = spamLeads;

  // Calculate stats from spam leads
  const totalSpam = stats?.total_spam || total || 0;
  const bySource = stats?.by_source || {};
  const byReason = stats?.by_spam_reason || {};

  // Get unique sources and reasons from stats
  const sources = Object.keys(bySource);
  const reasons = Object.keys(byReason);

  console.log('📋 [UnqualifiedTab] Component state:', {
    spamLeadsCount: spamLeads.length,
    filteredCount: filteredSpamLeads.length,
    total,
    totalSpam,
    isLoading,
    sourceFilter,
    reasonFilter,
    searchQuery,
    bySource,
    byReason,
    sources,
    reasons,
  });

  return (
    <Box className="bg-white h-full p-4">
      {/* Stats Summary Cards */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
          <Box
            sx={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              p: 3,
              border: '1px solid #E5E7EB',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              flex: 1,
            }}
          >
            <Box display="flex" alignItems="center" gap={1} mb={1.5}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '10px',
                  backgroundColor: '#FFF0F7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BlockIcon sx={{ color: '#C91A79', fontSize: 22 }} />
              </Box>
              <Typography fontSize="14px" color="#6C727F" fontWeight={600}>
                Total Unqualified
              </Typography>
            </Box>
            <Typography fontSize="32px" fontWeight={700} color="#374151" lineHeight={1.2}>
              {totalSpam.toLocaleString()}
            </Typography>
            <Typography fontSize="12px" color="#9CA3AF" mt={0.5}>
              Filtered leads analyzed
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
          <Box
            sx={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              p: 3,
              border: '1px solid #E5E7EB',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              flex: 1,
            }}
          >
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '10px',
                  backgroundColor: '#F0F9FF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <SourceIcon sx={{ color: '#0EA5E9', fontSize: 22 }} />
              </Box>
              <Typography fontSize="14px" color="#6C727F" fontWeight={600}>
                By Source
              </Typography>
            </Box>
            {sources.length > 0 ? (
              sources.slice(0, 3).map((source, index) => (
                <Box key={source} display="flex" justifyContent="space-between" alignItems="center" mb={index < 2 ? 1 : 0}>
                  <Typography fontSize="13px" color="#374151" fontWeight={500}>
                    {source}
                  </Typography>
                  <Typography fontSize="13px" fontWeight={700} color="#C91A79">
                    {bySource[source]}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography fontSize="13px" color="#9CA3AF">
                No data
              </Typography>
            )}
          </Box>
        </Grid>

        <Grid item xs={12} md={4} sx={{ display: 'flex' }}>
          <Box
            sx={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              p: 3,
              border: '1px solid #E5E7EB',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              flex: 1,
            }}
          >
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '10px',
                  backgroundColor: '#FEF3C7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <WarningAmberIcon sx={{ color: '#F59E0B', fontSize: 22 }} />
              </Box>
              <Typography fontSize="14px" color="#6C727F" fontWeight={600}>
                Top Filter Reasons
              </Typography>
            </Box>
            {reasons.length > 0 ? (
              reasons.slice(0, 3).map((reason, index) => (
                <Box key={reason} display="flex" justifyContent="space-between" alignItems="center" mb={index < 2 ? 1 : 0}>
                  <Typography fontSize="13px" color="#374151" fontWeight={500} noWrap sx={{ maxWidth: 200 }}>
                    {reason}
                  </Typography>
                  <Typography fontSize="13px" fontWeight={700} color="#C91A79" sx={{ ml: 1 }}>
                    {byReason[reason]}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography fontSize="13px" color="#9CA3AF">
                No data
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>

      {/* Filters */}
      <Box
        sx={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          p: 2.5,
          mb: 3,
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <FilterListIcon sx={{ fontSize: 20, color: '#6C727F' }} />
          <Typography fontSize="14px" fontWeight={600} color="#374151">
            Filters
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Typography fontSize="12px" color="#6C727F" fontWeight={500} mb={1}>
              Search
            </Typography>
            <TextField
              fullWidth
              size="small"
              placeholder="Search by title, company, keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: '13px',
                  backgroundColor: '#F9FAFB',
                },
              }}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography fontSize="12px" color="#6C727F" fontWeight={500} mb={1}>
              Source
            </Typography>
            <Select
              fullWidth
              size="small"
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              sx={{
                fontSize: '13px',
                backgroundColor: '#F9FAFB',
              }}
            >
              <MenuItem value="all">All Sources</MenuItem>
              {sources.map((source) => (
                <MenuItem key={source} value={source}>
                  {source}
                </MenuItem>
              ))}
            </Select>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography fontSize="12px" color="#6C727F" fontWeight={500} mb={1}>
              Filter Reason
            </Typography>
            <Select
              fullWidth
              size="small"
              value={reasonFilter}
              onChange={(e) => setReasonFilter(e.target.value)}
              sx={{
                fontSize: '13px',
                backgroundColor: '#F9FAFB',
              }}
            >
              <MenuItem value="all">All Reasons</MenuItem>
              {Object.values(SpamReasonEnum).map((reason) => (
                <MenuItem key={reason} value={reason}>
                  {reason}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>
      </Box>

      {/* Spam Table */}
      <Box
        sx={{
          backgroundColor: '#fff',
          borderRadius: '12px',
          p: 2.5,
          border: '1px solid #E5E7EB',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <Typography fontSize="16px" fontWeight={600} color="#374151" mb={2}>
          Unqualified Leads ({total.toLocaleString()})
        </Typography>

        {isLoading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <Typography fontSize="14px" color="#6C727F">
              Loading unqualified leads...
            </Typography>
          </Box>
        ) : (
          <SpamTableCard
            data={filteredSpamLeads}
            total={total}
            page={page}
            pageSize={pageSize}
            setPage={setPage}
            setPageSize={setPageSize}
            onPromote={promoteToLead}
            onDelete={deleteSpamLead}
            onBulkDelete={bulkDeleteSpamLeads}
            onUpdateNotes={updateNotes}
            isPromoting={isPromoting}
            isDeleting={isDeleting}
          />
        )}
      </Box>
    </Box>
  );
};

export default UnqualifiedTab;
