/**
 * RejectedPostsTab - Shows posts that were scanned but didn't meet alert criteria
 * Displays AI-generated rejection reasons to help users understand why posts didn't qualify
 */

import { LazarusService } from '@/api/LazarusService';
import { DateHelper } from '@/helpers/DateHelper';
import BlockIcon from '@mui/icons-material/Block';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Box, Chip, CircularProgress, Grid, Pagination, Typography } from '@mui/material';
import { useEffect, useState } from 'react';

interface RejectedPost {
  post_id: string;
  post_url: string;
  post_text: string;
  post_platform: string;
  post_author?: string;
  post_created_at?: string;
  post_likes: number;
  post_comments: number;
  post_index: number;
}

interface RejectedScan {
  scan_id: string;
  source_type: string;
  source_id: string;
  source_name: string;
  scan_date: string;
  platform: string;
  posts_scanned_count: number;
  scanned_posts: RejectedPost[];
  rejection_reason: string;
  confidence: number;
}

interface RejectedPostsTabProps {
  userId: string;
}

const RejectedPostsTab = ({ userId }: RejectedPostsTabProps) => {
  const [rejectedScans, setRejectedScans] = useState<RejectedScan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 10;

  useEffect(() => {
    fetchRejectedPosts();
  }, [userId, page]);

  const fetchRejectedPosts = async () => {
    setIsLoading(true);
    try {
      const response = await LazarusService.getRejectedPosts(userId, (page - 1) * pageSize, pageSize);
      if (response.responseData) {
        setRejectedScans(response.responseData.rejected_scans || []);
        setTotalCount(response.responseData.total_count || 0);
      }
    } catch (error) {
      console.error('Failed to fetch rejected posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    if (platform?.toLowerCase() === 'linkedin') {
      return <LinkedInIcon sx={{ fontSize: 16, color: '#0A66C2' }} />;
    }
    return <TwitterIcon sx={{ fontSize: 16, color: '#1DA1F2' }} />;
  };

  return (
    <Box className="bg-white h-full p-4">
      {/* Stats Summary Card */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} md={12} sx={{ display: 'flex' }}>
          <Box
            sx={{
              backgroundColor: '#fff',
              borderRadius: '16px',
              p: 3,
              border: '1px solid #F3F4F6',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              flex: 1,
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: '#F8BBE0',
                boxShadow: '0 4px 6px rgba(205, 27, 120, 0.1)',
              },
            }}
          >
            <Box display="flex" alignItems="center" gap={1.5} mb={1.5}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '12px',
                  backgroundColor: '#FFF5FB',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <BlockIcon sx={{ color: '#CD1B78', fontSize: 20 }} />
              </Box>
              <Typography fontSize="13px" color="#6B7280" fontWeight={600} letterSpacing="0.3px">
                Posts That Didn't Qualify
              </Typography>
            </Box>
            <Typography fontSize="32px" fontWeight={700} color="#1F2937" lineHeight={1.2}>
              {totalCount.toLocaleString()}
            </Typography>
            <Typography fontSize="12px" color="#9CA3AF" mt={0.5}>
              Scans with AI rejection reasons
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Info Banner */}
      <Box
        sx={{
          backgroundColor: '#EFF6FF',
          borderRadius: '12px',
          p: 2,
          mb: 3,
          border: '1px solid #BFDBFE',
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <InfoOutlinedIcon sx={{ fontSize: 20, color: '#3B82F6' }} />
          <Typography fontSize="13px" color="#1E40AF" fontWeight={500}>
            This tab shows posts that were scanned but didn't trigger alerts, with AI explanations of why they didn't qualify.
          </Typography>
        </Box>
      </Box>

      {/* Loading State */}
      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" py={8}>
          <CircularProgress sx={{ color: '#CD1B78' }} />
        </Box>
      ) : rejectedScans.length === 0 ? (
        <Box
          sx={{
            backgroundColor: '#fff',
            borderRadius: '12px',
            p: 6,
            textAlign: 'center',
            border: '1px solid #E5E7EB',
          }}
        >
          <Typography fontSize="16px" color="#6B7280" fontWeight={600} mb={1}>
            No rejected posts yet
          </Typography>
          <Typography fontSize="14px" color="#9CA3AF">
            Posts that don't meet alert criteria will appear here with reasons from AI
          </Typography>
        </Box>
      ) : (
        <>
          {/* Rejected Posts Cards */}
          {rejectedScans.map((scan) => (
            <Box
              key={scan.scan_id}
              sx={{
                backgroundColor: '#fff',
                borderRadius: '12px',
                p: 3,
                mb: 3,
                border: '1px solid #E5E7EB',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: '#C91A79',
                  boxShadow: '0 4px 6px rgba(201, 26, 121, 0.1)',
                },
              }}
            >
              {/* Header */}
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box>
                  <Typography fontSize="16px" fontWeight={700} color="#111827" mb={0.5}>
                    {scan.source_name}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    {getPlatformIcon(scan.platform)}
                    <Typography fontSize="12px" color="#6B7280">
                      {DateHelper.formatDate(scan.scan_date)}
                    </Typography>
                    <Chip
                      label={`${scan.posts_scanned_count} post${scan.posts_scanned_count > 1 ? 's' : ''} scanned`}
                      size="small"
                      sx={{ fontSize: '11px', height: 20, backgroundColor: '#F3F4F6', fontWeight: 500 }}
                    />
                  </Box>
                </Box>
              </Box>

              {/* Why Rejected Section */}
              <Box
                sx={{
                  backgroundColor: '#FFF3CD',
                  border: '2px solid #FF9800',
                  borderRadius: '8px',
                  p: 2,
                  mb: 3,
                }}
              >
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <WarningAmberIcon sx={{ color: '#FF9800' }} />
                  <Typography fontWeight={700} fontSize="14px" color="#856404">
                    Why Posts Didn't Qualify
                  </Typography>
                </Box>
                <Typography fontSize="13px" color="#856404" sx={{ whiteSpace: 'pre-wrap' }}>
                  {scan.rejection_reason}
                </Typography>
                {scan.confidence > 0 && (
                  <Typography fontSize="12px" color="#856404" mt={1} sx={{ opacity: 0.8 }}>
                    Confidence: {Math.round(scan.confidence * 100)}%
                  </Typography>
                )}
              </Box>

              {/* Scanned Posts */}
              <Typography fontSize="14px" fontWeight={600} color="#374151" mb={2}>
                Scanned Posts ({scan.scanned_posts.length})
              </Typography>

              {scan.scanned_posts.map((post, index) => (
                <Box
                  key={post.post_id}
                  sx={{
                    backgroundColor: '#F9FAFB',
                    borderRadius: '8px',
                    p: 2,
                    mb: index < scan.scanned_posts.length - 1 ? 2 : 0,
                    border: '1px solid #E5E7EB',
                  }}
                >
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    {getPlatformIcon(post.post_platform)}
                    <Typography fontSize="12px" color="#6B7280" fontWeight={500}>
                      {post.post_author || 'Unknown'}
                    </Typography>
                    {post.post_created_at && (
                      <>
                        <Typography fontSize="12px" color="#D1D5DB">
                          •
                        </Typography>
                        <Typography fontSize="12px" color="#9CA3AF">
                          {DateHelper.formatDate(post.post_created_at)}
                        </Typography>
                      </>
                    )}
                  </Box>

                  <Typography fontSize="13px" color="#374151" mb={1.5} sx={{ lineHeight: 1.6 }}>
                    {post.post_text.length > 300 ? `${post.post_text.substring(0, 300)}...` : post.post_text}
                  </Typography>

                  <Box display="flex" alignItems="center" gap={2}>
                    {post.post_likes > 0 && (
                      <Typography fontSize="11px" color="#9CA3AF">
                        ❤️ {post.post_likes.toLocaleString()}
                      </Typography>
                    )}
                    {post.post_comments > 0 && (
                      <Typography fontSize="11px" color="#9CA3AF">
                        💬 {post.post_comments.toLocaleString()}
                      </Typography>
                    )}
                    {post.post_url && (
                      <Typography
                        fontSize="11px"
                        color="#C91A79"
                        sx={{
                          cursor: 'pointer',
                          '&:hover': { textDecoration: 'underline' },
                        }}
                        onClick={() => window.open(post.post_url, '_blank')}
                      >
                        View Post →
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          ))}

          {/* Pagination */}
          {totalCount > pageSize && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={Math.ceil(totalCount / pageSize)}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: '#374151',
                  },
                  '& .Mui-selected': {
                    backgroundColor: '#C91A79 !important',
                    color: '#fff',
                  },
                }}
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default RejectedPostsTab;
