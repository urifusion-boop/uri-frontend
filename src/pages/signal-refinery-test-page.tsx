/**
 * Signal Refinery Test Page
 *
 * Standalone testing system for Google X-Ray method
 * Does NOT touch existing conversational lead system
 */

import DashboardLayout from '@/components/atoms/DashboardLayout';
import {
  Cancel as CancelIcon,
  CheckCircle as CheckCircleIcon,
  Code as CodeIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  HelpOutline as HelpIcon,
  OpenInNew as OpenInNewIcon,
  Science as ScienceIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Collapse,
  Container,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  LinearProgress,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { signalRefineryApi } from '../api/signalRefineryApi';
import { BuyerSellerClassification, DorkQueryPreview, XRayPlatform, XRaySearchJob, XRaySearchRequest } from '../models/dtos/SignalRefineryDto';
import { useAuth } from '../providers/AuthProvider';

export default function SignalRefineryTestPage() {
  const { userDetails } = useAuth();

  // Form state
  const [keyword, setKeyword] = useState('solar inverter');
  const [location, setLocation] = useState('Nigeria');
  const [maxResults, setMaxResults] = useState(50);
  const [selectedPlatforms, setSelectedPlatforms] = useState<XRayPlatform[]>([XRayPlatform.TWITTER, XRayPlatform.NAIRALAND]);
  const [enableBuyerSeller, setEnableBuyerSeller] = useState(true);
  const [enableNigerianFilter, setEnableNigerianFilter] = useState(true);

  // Job state
  const [currentJob, setCurrentJob] = useState<XRaySearchJob | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dork query preview
  const [dorkPreviews, setDorkPreviews] = useState<DorkQueryPreview[]>([]);
  const [showDorkQueries, setShowDorkQueries] = useState(false);

  // Expanded rows
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Poll job status
  useEffect(() => {
    if (!currentJob || currentJob.status !== 'running') return;

    const interval = setInterval(async () => {
      try {
        const updatedJob = await signalRefineryApi.getJobStatus(currentJob.job_id);
        setCurrentJob(updatedJob);

        if (updatedJob.status === 'completed' || updatedJob.status === 'failed') {
          setIsSearching(false);
        }
      } catch (err: any) {
        console.error('Error polling job:', err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [currentJob]);

  const handlePlatformToggle = (platform: XRayPlatform) => {
    setSelectedPlatforms((prev) => (prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]));
  };

  const handlePreviewQueries = async () => {
    try {
      const previews = await signalRefineryApi.previewDorkQueries(keyword, selectedPlatforms, location);
      setDorkPreviews(previews);
      setShowDorkQueries(true);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Error previewing dork queries');
    }
  };

  const handleStartSearch = async () => {
    if (!userDetails?.userId) {
      setError('User not authenticated');
      return;
    }

    if (selectedPlatforms.length === 0) {
      setError('Please select at least one platform');
      return;
    }

    try {
      setIsSearching(true);
      setError(null);
      setCurrentJob(null);

      const request: XRaySearchRequest = {
        user_id: userDetails.userId,
        keyword,
        platforms: selectedPlatforms,
        location,
        max_results_per_platform: maxResults,
        enable_buyer_seller_classification: enableBuyerSeller,
        enable_nigerian_filter: enableNigerianFilter,
      };

      const response = await signalRefineryApi.startSearch(request);
      // Backend returns { job_id, status, keyword, platforms }
      // We need to fetch the full job details
      const job = await signalRefineryApi.getJobStatus(response.job_id);
      setCurrentJob(job);
    } catch (err: any) {
      setError(err.message || 'Error starting search');
      setIsSearching(false);
    }
  };

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const getClassificationIcon = (classification: BuyerSellerClassification) => {
    switch (classification) {
      case BuyerSellerClassification.BUYER:
        return <CheckCircleIcon sx={{ fontSize: 18, color: '#10B981' }} />;
      case BuyerSellerClassification.SELLER:
        return <CancelIcon sx={{ fontSize: 18, color: '#EF4444' }} />;
      default:
        return <HelpIcon sx={{ fontSize: 18, color: '#9CA3AF' }} />;
    }
  };

  const platformColors: Record<XRayPlatform, string> = {
    [XRayPlatform.TWITTER]: '#1DA1F2',
    [XRayPlatform.NAIRALAND]: '#FF6B00',
    [XRayPlatform.LINKEDIN]: '#0A66C2',
    [XRayPlatform.REDDIT]: '#FF4500',
  };

  return (
    <DashboardLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box mb={4} display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Box display="flex" alignItems="center" gap={1.5} mb={1}>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
                }}
              >
                <ScienceIcon sx={{ color: '#fff', fontSize: 22 }} />
              </Box>
              <Typography variant="h4" fontWeight={700} color="#111827" letterSpacing="-0.02em">
                Signal Refinery
              </Typography>
            </Box>
            <Typography variant="body1" color="#6B7280" fontSize="14px" fontWeight={500}>
              Google X-Ray Testing System - Filter out sellers, keep buyers only
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* LEFT: Search Configuration */}
          <Grid item xs={12} lg={4}>
            <Box
              sx={{
                borderRadius: '14px',
                background: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                border: '1px solid #F3F4F6',
                p: 3,
              }}
            >
              <Typography variant="h6" fontWeight={600} color="#111827" mb={3}>
                Search Configuration
              </Typography>

              <TextField label="Keyword" fullWidth value={keyword} onChange={(e) => setKeyword(e.target.value)} sx={{ mb: 2.5 }} placeholder="e.g., solar inverter, logistics" />

              <TextField label="Location" fullWidth value={location} onChange={(e) => setLocation(e.target.value)} sx={{ mb: 3 }} placeholder="e.g., Nigeria, Lagos" />

              <Box mb={3}>
                <Typography variant="subtitle2" fontWeight={600} color="#374151" mb={1}>
                  Max Results per Platform
                </Typography>
                <Box display="flex" alignItems="center" gap={2}>
                  <Slider
                    value={maxResults}
                    onChange={(_, value) => setMaxResults(value as number)}
                    min={10}
                    max={100}
                    step={10}
                    marks
                    sx={{
                      flex: 1,
                      '& .MuiSlider-thumb': {
                        bgcolor: '#059669',
                      },
                      '& .MuiSlider-track': {
                        bgcolor: '#059669',
                      },
                    }}
                  />
                  <Chip label={maxResults} size="small" sx={{ bgcolor: '#ECFDF5', color: '#059669', fontWeight: 600 }} />
                </Box>
              </Box>

              <Box mb={3}>
                <Typography variant="subtitle2" fontWeight={600} color="#374151" mb={1.5}>
                  Platforms
                </Typography>
                <FormGroup>
                  {Object.values(XRayPlatform).map((platform) => (
                    <FormControlLabel
                      key={platform}
                      control={
                        <Checkbox
                          checked={selectedPlatforms.includes(platform)}
                          onChange={() => handlePlatformToggle(platform)}
                          sx={{
                            color: platformColors[platform],
                            '&.Mui-checked': {
                              color: platformColors[platform],
                            },
                          }}
                        />
                      }
                      label={
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body2" fontWeight={500}>
                            {platform}
                          </Typography>
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: platformColors[platform],
                            }}
                          />
                        </Box>
                      }
                    />
                  ))}
                </FormGroup>
              </Box>

              <Box mb={3}>
                <Typography variant="subtitle2" fontWeight={600} color="#374151" mb={1.5}>
                  Filters
                </Typography>
                <FormControlLabel
                  control={<Checkbox checked={enableBuyerSeller} onChange={(e) => setEnableBuyerSeller(e.target.checked)} sx={{ color: '#059669', '&.Mui-checked': { color: '#059669' } }} />}
                  label={
                    <Typography variant="body2" fontWeight={500}>
                      LLM Buyer/Seller Classification
                    </Typography>
                  }
                />
                <FormControlLabel
                  control={<Checkbox checked={enableNigerianFilter} onChange={(e) => setEnableNigerianFilter(e.target.checked)} sx={{ color: '#059669', '&.Mui-checked': { color: '#059669' } }} />}
                  label={
                    <Typography variant="body2" fontWeight={500}>
                      Nigerian Entity Filter
                    </Typography>
                  }
                />
              </Box>

              <Box display="flex" flexDirection="column" gap={1.5}>
                <Button
                  variant="outlined"
                  startIcon={<CodeIcon />}
                  onClick={handlePreviewQueries}
                  fullWidth
                  sx={{
                    borderColor: '#05966940',
                    color: '#059669',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '13px',
                    borderRadius: '8px',
                    '&:hover': {
                      borderColor: '#059669',
                      backgroundColor: '#05966908',
                    },
                  }}
                >
                  Preview Dork Queries
                </Button>
                <Button
                  variant="contained"
                  startIcon={isSearching ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <SearchIcon />}
                  onClick={handleStartSearch}
                  disabled={isSearching || selectedPlatforms.length === 0}
                  fullWidth
                  sx={{
                    background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                    textTransform: 'none',
                    fontWeight: 600,
                    fontSize: '14px',
                    borderRadius: '8px',
                    py: 1.2,
                    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #047857 0%, #065f46 100%)',
                    },
                  }}
                >
                  {isSearching ? 'Searching...' : 'Start X-Ray Search'}
                </Button>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </Box>

            {/* Dork Query Preview */}
            {showDorkQueries && dorkPreviews && dorkPreviews.length > 0 && (
              <Box
                sx={{
                  borderRadius: '14px',
                  background: '#fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  border: '1px solid #F3F4F6',
                  p: 3,
                  mt: 3,
                }}
              >
                <Typography variant="h6" fontWeight={600} color="#111827" mb={2}>
                  Dork Queries
                </Typography>
                {dorkPreviews.map((preview, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      mb: 2,
                      p: 2,
                      borderRadius: '8px',
                      bgcolor: '#F9FAFB',
                      border: '1px solid #E5E7EB',
                    }}
                  >
                    <Chip
                      label={preview.platform}
                      size="small"
                      sx={{
                        bgcolor: platformColors[preview.platform as XRayPlatform],
                        color: '#fff',
                        fontWeight: 600,
                        mb: 1,
                      }}
                    />
                    <Typography variant="body2" fontFamily="monospace" fontSize="11px" color="#374151">
                      {preview.query}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Grid>

          {/* RIGHT: Results */}
          <Grid item xs={12} lg={8}>
            {currentJob && (
              <Box
                sx={{
                  borderRadius: '14px',
                  background: '#fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  border: '1px solid #F3F4F6',
                  p: 3,
                  mb: 3,
                }}
              >
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="h6" fontWeight={600} color="#111827">
                    {currentJob.status === 'running' && '🔄 Searching...'}
                    {currentJob.status === 'completed' && '✅ Search Complete'}
                    {currentJob.status === 'failed' && '❌ Search Failed'}
                  </Typography>
                  <Chip
                    label={currentJob.status.toUpperCase()}
                    size="small"
                    sx={{
                      bgcolor: currentJob.status === 'completed' ? '#ECFDF5' : currentJob.status === 'failed' ? '#FEE2E2' : '#EFF6FF',
                      color: currentJob.status === 'completed' ? '#059669' : currentJob.status === 'failed' ? '#DC2626' : '#2563EB',
                      fontWeight: 600,
                    }}
                  />
                </Box>

                {currentJob.status === 'running' && (
                  <Box mb={2}>
                    <Typography variant="body2" color="#6B7280" mb={1}>
                      {currentJob.progress_message || 'Processing...'}
                    </Typography>
                    <LinearProgress
                      variant="determinate"
                      value={currentJob.progress_percent || 0}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: '#E5E7EB',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: '#059669',
                        },
                      }}
                    />
                    <Typography variant="caption" color="#9CA3AF" mt={0.5}>
                      {currentJob.progress_percent || 0}%
                    </Typography>
                  </Box>
                )}

                {currentJob.status === 'completed' && currentJob.metrics && (
                  <Grid container spacing={2}>
                    <Grid item xs={6} md={3}>
                      <Box textAlign="center" p={2} borderRadius="8px" bgcolor="#F9FAFB">
                        <Typography variant="h4" fontWeight={700} color="#059669">
                          {currentJob.metrics.total_fetched}
                        </Typography>
                        <Typography variant="caption" color="#6B7280">
                          Total Fetched
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Box textAlign="center" p={2} borderRadius="8px" bgcolor="#F9FAFB">
                        <Typography variant="h4" fontWeight={700} color="#059669">
                          {currentJob.metrics.buyer_leads_count}
                        </Typography>
                        <Typography variant="caption" color="#6B7280">
                          Buyer Leads
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Box textAlign="center" p={2} borderRadius="8px" bgcolor="#F9FAFB">
                        <Typography variant="h4" fontWeight={700} color="#EF4444">
                          {currentJob.metrics.seller_filtered_count}
                        </Typography>
                        <Typography variant="caption" color="#6B7280">
                          Sellers Filtered
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} md={3}>
                      <Box textAlign="center" p={2} borderRadius="8px" bgcolor="#F9FAFB">
                        <Typography variant="h4" fontWeight={700} color="#2563EB">
                          {(currentJob.metrics.buyer_seller_ratio * 100).toFixed(0)}%
                        </Typography>
                        <Typography variant="caption" color="#6B7280">
                          Buyer Ratio
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                )}

                {/* Raw Search Results */}
                {currentJob.results && currentJob.results.length > 0 && (
                  <Box
                    mt={3}
                    sx={{
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      p: 0.2,
                    }}
                  >
                    <Box
                      sx={{
                        borderRadius: '11px',
                        background: '#fff',
                        p: 3,
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1.5} mb={2.5}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <ScienceIcon sx={{ fontSize: 24, color: '#fff' }} />
                        </Box>
                        <Box flex={1}>
                          <Typography variant="h6" fontWeight={700} color="#111827">
                            Raw Google Results
                          </Typography>
                          <Typography variant="caption" color="#6B7280">
                            {currentJob.results.length} posts/threads discovered from search
                          </Typography>
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          borderRadius: '10px',
                          border: '1px solid #E5E7EB',
                          overflow: 'hidden',
                        }}
                      >
                        <TableContainer>
                          <Table>
                            <TableHead>
                              <TableRow sx={{ bgcolor: '#F9FAFB' }}>
                                <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '13px' }}>Platform</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '13px' }}>Post/Thread Details</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '13px', textAlign: 'center' }}>Rank</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '13px', textAlign: 'center' }}>Action</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {currentJob.results.map((result, idx) => (
                                <TableRow
                                  key={idx}
                                  hover
                                  sx={{
                                    cursor: 'pointer',
                                    '&:hover': {
                                      bgcolor: '#F9FAFB',
                                    },
                                    transition: 'all 0.2s ease',
                                  }}
                                  onClick={() => window.open(result.url, '_blank')}
                                >
                                  <TableCell sx={{ py: 2 }}>
                                    <Chip
                                      label={result.platform}
                                      size="small"
                                      sx={{
                                        bgcolor: platformColors[result.platform as XRayPlatform],
                                        color: '#fff',
                                        fontWeight: 600,
                                        fontSize: '11px',
                                        height: '24px',
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell sx={{ py: 2, maxWidth: 500 }}>
                                    <Typography variant="body2" fontWeight={600} color="#111827" sx={{ mb: 0.5 }}>
                                      {result.title}
                                    </Typography>
                                    <Typography variant="caption" color="#6B7280" sx={{ display: 'block', lineHeight: 1.4 }}>
                                      {result.snippet.length > 120 ? `${result.snippet.substring(0, 120)}...` : result.snippet}
                                    </Typography>
                                  </TableCell>
                                  <TableCell align="center" sx={{ py: 2 }}>
                                    <Chip
                                      label={`#${result.google_rank}`}
                                      size="small"
                                      variant="outlined"
                                      sx={{
                                        borderColor: '#667eea',
                                        color: '#667eea',
                                        fontWeight: 600,
                                        fontSize: '11px',
                                      }}
                                    />
                                  </TableCell>
                                  <TableCell align="center" sx={{ py: 2 }}>
                                    <IconButton
                                      size="small"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        window.open(result.url, '_blank');
                                      }}
                                      sx={{
                                        bgcolor: '#F3F4F6',
                                        '&:hover': {
                                          bgcolor: '#667eea',
                                          color: '#fff',
                                        },
                                        transition: 'all 0.2s ease',
                                      }}
                                    >
                                      <OpenInNewIcon fontSize="small" />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                    </Box>
                  </Box>
                )}

                {currentJob.leads && currentJob.leads.length > 0 && (
                  <Box
                    mt={3}
                    sx={{
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      p: 0.2,
                    }}
                  >
                    <Box
                      sx={{
                        borderRadius: '11px',
                        background: '#fff',
                        p: 3,
                      }}
                    >
                      <Box display="flex" alignItems="center" gap={1.5} mb={2.5}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '10px',
                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography fontSize={24}>✅</Typography>
                        </Box>
                        <Box flex={1}>
                          <Typography variant="h6" fontWeight={700} color="#111827">
                            Qualified Buyer Leads
                          </Typography>
                          <Typography variant="caption" color="#6B7280">
                            {currentJob.leads.length} high-intent buyers identified by AI
                          </Typography>
                        </Box>
                      </Box>

                      <Box
                        sx={{
                          borderRadius: '10px',
                          border: '1px solid #E5E7EB',
                          overflow: 'hidden',
                        }}
                      >
                        <TableContainer>
                          <Table>
                            <TableHead>
                              <TableRow sx={{ bgcolor: '#F9FAFB' }}>
                                <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '13px' }}>Platform</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '13px' }}>Lead Details</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '13px', textAlign: 'center' }}>Classification</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '13px', textAlign: 'center' }}>Rank</TableCell>
                                <TableCell sx={{ fontWeight: 600, color: '#374151', fontSize: '13px', textAlign: 'center' }}>Details</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {currentJob.leads.map((lead, idx) => (
                                <React.Fragment key={lead.id}>
                                  <TableRow
                                    hover
                                    sx={{
                                      cursor: 'pointer',
                                      '&:hover': {
                                        bgcolor: '#F9FAFB',
                                      },
                                      transition: 'all 0.2s ease',
                                    }}
                                    onClick={() => toggleRow(lead.id)}
                                  >
                                    <TableCell sx={{ py: 2 }}>
                                      <Chip
                                        label={lead.platform}
                                        size="small"
                                        sx={{
                                          bgcolor: platformColors[lead.platform as XRayPlatform],
                                          color: '#fff',
                                          fontWeight: 600,
                                          fontSize: '11px',
                                          height: '24px',
                                        }}
                                      />
                                    </TableCell>
                                    <TableCell sx={{ py: 2, maxWidth: 400 }}>
                                      <Typography variant="body2" fontWeight={600} color="#111827">
                                        {lead.title}
                                      </Typography>
                                      <Typography variant="caption" color="#6B7280" sx={{ display: 'block', mt: 0.5 }}>
                                        {lead.snippet.length > 100 ? `${lead.snippet.substring(0, 100)}...` : lead.snippet}
                                      </Typography>
                                    </TableCell>
                                    <TableCell align="center" sx={{ py: 2 }}>
                                      <Box display="flex" alignItems="center" justifyContent="center" gap={0.5}>
                                        {getClassificationIcon(lead.buyer_seller.classification)}
                                        <Typography variant="caption" fontWeight={600} color="#10b981">
                                          {lead.buyer_seller.classification}
                                        </Typography>
                                      </Box>
                                    </TableCell>
                                    <TableCell align="center" sx={{ py: 2 }}>
                                      <Chip
                                        label={`#${lead.google_rank}`}
                                        size="small"
                                        variant="outlined"
                                        sx={{
                                          borderColor: '#10b981',
                                          color: '#10b981',
                                          fontWeight: 600,
                                          fontSize: '11px',
                                        }}
                                      />
                                    </TableCell>
                                    <TableCell align="center" sx={{ py: 2 }}>
                                      <IconButton
                                        size="small"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleRow(lead.id);
                                        }}
                                        sx={{
                                          bgcolor: '#F3F4F6',
                                          '&:hover': {
                                            bgcolor: '#10b981',
                                            color: '#fff',
                                          },
                                          transition: 'all 0.2s ease',
                                        }}
                                      >
                                        {expandedRows.has(lead.id) ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
                                      </IconButton>
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell colSpan={5} sx={{ p: 0, border: 0 }}>
                                      <Collapse in={expandedRows.has(lead.id)}>
                                        <Box
                                          p={3}
                                          sx={{
                                            bgcolor: '#F9FAFB',
                                            borderTop: '2px solid #10b981',
                                          }}
                                        >
                                          <Typography variant="body2" color="#374151" mb={2} sx={{ lineHeight: 1.6 }}>
                                            {lead.snippet}
                                          </Typography>

                                          <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
                                            {lead.buyer_seller.pain_point && (
                                              <Box
                                                flex={1}
                                                minWidth={250}
                                                p={2}
                                                sx={{
                                                  bgcolor: '#fff',
                                                  borderRadius: '8px',
                                                  border: '1px solid #E5E7EB',
                                                }}
                                              >
                                                <Typography variant="caption" fontWeight={700} color="#10b981" sx={{ display: 'block', mb: 1 }}>
                                                  💡 Pain Point
                                                </Typography>
                                                <Typography variant="body2" color="#374151" sx={{ lineHeight: 1.5 }}>
                                                  {lead.buyer_seller.pain_point}
                                                </Typography>
                                              </Box>
                                            )}
                                            {lead.buyer_seller.product_needed && (
                                              <Box
                                                flex={1}
                                                minWidth={250}
                                                p={2}
                                                sx={{
                                                  bgcolor: '#fff',
                                                  borderRadius: '8px',
                                                  border: '1px solid #E5E7EB',
                                                }}
                                              >
                                                <Typography variant="caption" fontWeight={700} color="#10b981" sx={{ display: 'block', mb: 1 }}>
                                                  🎯 Product Needed
                                                </Typography>
                                                <Typography variant="body2" color="#374151" sx={{ lineHeight: 1.5 }}>
                                                  {lead.buyer_seller.product_needed}
                                                </Typography>
                                              </Box>
                                            )}
                                          </Box>

                                          <Button
                                            variant="contained"
                                            size="small"
                                            startIcon={<OpenInNewIcon />}
                                            onClick={() => window.open(lead.url, '_blank')}
                                            sx={{
                                              textTransform: 'none',
                                              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                              color: '#fff',
                                              fontWeight: 600,
                                              '&:hover': {
                                                background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                                              },
                                            }}
                                          >
                                            View Source
                                          </Button>
                                        </Box>
                                      </Collapse>
                                    </TableCell>
                                  </TableRow>
                                </React.Fragment>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>
            )}

            {!currentJob && (
              <Box
                sx={{
                  borderRadius: '14px',
                  background: '#fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  border: '1px solid #F3F4F6',
                  p: 8,
                  textAlign: 'center',
                }}
              >
                <ScienceIcon sx={{ fontSize: 64, color: '#D1D5DB', mb: 2 }} />
                <Typography variant="h6" color="#9CA3AF" fontWeight={600} mb={1}>
                  No Search Results Yet
                </Typography>
                <Typography variant="body2" color="#9CA3AF">
                  Configure your search and click "Start X-Ray Search" to begin
                </Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </DashboardLayout>
  );
}
