import { LazarusService } from '@/api/LazarusService';
import ArticleIcon from '@mui/icons-material/Article';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FacebookIcon from '@mui/icons-material/Facebook';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import MessageIcon from '@mui/icons-material/Message';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import TwitterIcon from '@mui/icons-material/Twitter';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Chip, CircularProgress, Divider, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

interface ScannedPost {
  post_id: string;
  post_url: string;
  post_text: string;
  post_platform: string;
  post_author?: string;
  post_created_at?: string;
  post_likes: number;
  post_comments: number;
  post_index: number;
  is_triggering_post: boolean;
}

interface ScanGroup {
  scan_id: string;
  source_type: string;
  source_id: string;
  source_name: string;
  scan_date: string;
  platform: string;
  posts_scanned_count: number;
  scanned_posts: ScannedPost[];
  signal_detected: boolean;
  alert_id?: string;
  signal_type?: string;
  confidence?: number;
  triggering_post_index?: number;
}

interface ScannedContentTabProps {
  userId: string;
}

const ScannedContentTab = ({ userId }: ScannedContentTabProps) => {
  const [loading, setLoading] = useState(true);
  const [scanGroups, setScanGroups] = useState<ScanGroup[]>([]);
  const [expandedScans, setExpandedScans] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    loadScannedContent();
  }, [userId]);

  const loadScannedContent = async () => {
    try {
      setLoading(true);
      const response = await LazarusService.getScannedContent(userId);
      if (response.responseData) {
        setScanGroups(response.responseData.scan_groups || []);
        // Auto-expand the first scan with signal detected
        const firstAlertScan = response.responseData.scan_groups?.find((sg: ScanGroup) => sg.signal_detected);
        if (firstAlertScan) {
          setExpandedScans({ [firstAlertScan.scan_id]: true });
        }
      }
    } catch (error) {
      console.error('Failed to load scanned content:', error);
      toast.error('Failed to load scanned content');
    } finally {
      setLoading(false);
    }
  };

  const toggleScan = (scanId: string) => {
    setExpandedScans((prev) => ({
      ...prev,
      [scanId]: !prev[scanId],
    }));
  };

  const getPlatformIcon = (platform: string) => {
    const platformLower = platform.toLowerCase();
    if (platformLower.includes('linkedin')) return <LinkedInIcon sx={{ fontSize: 18 }} />;
    if (platformLower.includes('twitter') || platformLower.includes('x.com')) return <TwitterIcon sx={{ fontSize: 18 }} />;
    if (platformLower.includes('facebook')) return <FacebookIcon sx={{ fontSize: 18 }} />;
    return <ArticleIcon sx={{ fontSize: 18 }} />;
  };

  const getPlatformColor = (platform: string) => {
    const platformLower = platform.toLowerCase();
    if (platformLower.includes('linkedin')) return '#0077B5';
    if (platformLower.includes('twitter') || platformLower.includes('x.com')) return '#1DA1F2';
    if (platformLower.includes('facebook')) return '#1877F2';
    return '#6B7280';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const formatSignalType = (signalType?: string) => {
    if (!signalType) return 'Unknown Signal';
    return signalType
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={10}>
        <CircularProgress sx={{ color: '#C91A79' }} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h5" fontWeight={700} color="#1A1A1A" mb={1}>
          Scanned Content
        </Typography>
        <Typography variant="body2" color="#6B7280">
          View all posts scanned from your monitored contacts, grouped by scan date and contact. Posts that triggered alerts are highlighted.
        </Typography>
      </Box>

      {/* Scan Groups */}
      {scanGroups.length === 0 ? (
        <Box
          sx={{
            py: 8,
            textAlign: 'center',
            borderRadius: '16px',
            background: '#FAFBFC',
            border: '2px dashed #E5E7EB',
          }}
        >
          <ArticleIcon sx={{ fontSize: 56, color: '#D1D5DB', mb: 2 }} />
          <Typography variant="h6" fontWeight={600} color="#374151" mb={1}>
            No Scanned Content Yet
          </Typography>
          <Typography variant="body2" color="#6B7280" maxWidth="400px" mx="auto">
            Once you run a scan on your monitored contacts, all their posts will appear here - even if they didn't trigger an alert.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {scanGroups.map((scanGroup) => (
            <Accordion
              key={scanGroup.scan_id}
              expanded={expandedScans[scanGroup.scan_id] || false}
              onChange={() => toggleScan(scanGroup.scan_id)}
              sx={{
                borderRadius: '16px !important',
                border: scanGroup.signal_detected ? '2px solid #C91A79' : '1px solid #E5E7EB',
                boxShadow: scanGroup.signal_detected ? '0 4px 16px rgba(201, 26, 121, 0.12)' : '0 2px 8px rgba(0, 0, 0, 0.04)',
                background: scanGroup.signal_detected ? '#FFF9FC' : '#fff',
                '&:before': {
                  display: 'none',
                },
                '&.Mui-expanded': {
                  margin: 0,
                  mb: 2,
                },
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  boxShadow: scanGroup.signal_detected ? '0 8px 24px rgba(201, 26, 121, 0.16)' : '0 4px 12px rgba(0, 0, 0, 0.08)',
                },
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: scanGroup.signal_detected ? '#C91A79' : '#6B7280' }} />}
                sx={{
                  px: 3,
                  py: 2,
                  minHeight: '80px !important',
                  '&.Mui-expanded': {
                    minHeight: '80px !important',
                  },
                }}
              >
                <Box display="flex" alignItems="center" justifyContent="space-between" width="100%" pr={2}>
                  {/* Left Section: Contact Info */}
                  <Box display="flex" alignItems="center" gap={2}>
                    {/* Signal Status Icon */}
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '12px',
                        background: scanGroup.signal_detected ? 'linear-gradient(135deg, #C91A79 0%, #A01560 100%)' : '#F3F4F6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: scanGroup.signal_detected ? '0 4px 12px rgba(201, 26, 121, 0.2)' : 'none',
                      }}
                    >
                      {scanGroup.signal_detected ? <WarningAmberIcon sx={{ color: '#fff', fontSize: 24 }} /> : <CheckCircleIcon sx={{ color: '#9CA3AF', fontSize: 24 }} />}
                    </Box>

                    {/* Contact Details */}
                    <Box>
                      <Typography fontSize="16px" fontWeight={700} color="#1A1A1A" mb={0.5}>
                        {scanGroup.source_name}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            px: 1,
                            py: 0.25,
                            borderRadius: '6px',
                            background: getPlatformColor(scanGroup.platform) + '12',
                          }}
                        >
                          {getPlatformIcon(scanGroup.platform)}
                          <Typography fontSize="11px" fontWeight={600} color={getPlatformColor(scanGroup.platform)}>
                            {scanGroup.platform}
                          </Typography>
                        </Box>
                        <Typography fontSize="12px" color="#9CA3AF">
                          • {formatDate(scanGroup.scan_date)}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  {/* Right Section: Scan Stats */}
                  <Box display="flex" alignItems="center" gap={3}>
                    {/* Posts Count */}
                    <Box textAlign="center">
                      <Typography fontSize="11px" color="#9CA3AF" fontWeight={600} mb={0.5}>
                        Posts Scanned
                      </Typography>
                      <Typography fontSize="20px" fontWeight={700} color="#7C3AED">
                        {scanGroup.posts_scanned_count}
                      </Typography>
                    </Box>

                    {/* Signal Detection Status */}
                    <Box>
                      {scanGroup.signal_detected ? (
                        <Chip
                          label={`🎯 ${formatSignalType(scanGroup.signal_type)}`}
                          sx={{
                            height: '32px',
                            fontSize: '12px',
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #C91A79 0%, #A01560 100%)',
                            color: '#fff',
                            border: 'none',
                            boxShadow: '0 2px 8px rgba(201, 26, 121, 0.25)',
                          }}
                        />
                      ) : (
                        <Chip
                          icon={<RemoveCircleIcon sx={{ fontSize: 16 }} />}
                          label="No Signal"
                          sx={{
                            height: '32px',
                            fontSize: '12px',
                            fontWeight: 600,
                            background: '#F3F4F6',
                            color: '#6B7280',
                            border: '1px solid #E5E7EB',
                          }}
                        />
                      )}
                    </Box>

                    {/* Confidence Badge */}
                    {scanGroup.confidence && (
                      <Box
                        sx={{
                          px: 1.5,
                          py: 0.75,
                          borderRadius: '8px',
                          background: '#ECFDF5',
                          border: '1px solid #D1FAE5',
                        }}
                      >
                        <Typography fontSize="11px" color="#059669" fontWeight={700}>
                          {Math.round(scanGroup.confidence * 100)}% Confidence
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>
              </AccordionSummary>

              <AccordionDetails sx={{ px: 3, pb: 3, pt: 0 }}>
                <Divider sx={{ mb: 3 }} />

                {/* Scanned Posts */}
                {scanGroup.scanned_posts.length === 0 ? (
                  <Typography fontSize="13px" color="#9CA3AF" textAlign="center" py={2}>
                    No posts available for this scan
                  </Typography>
                ) : (
                  <Grid container spacing={2}>
                    {scanGroup.scanned_posts.map((post) => (
                      <Grid item xs={12} key={post.post_id}>
                        <Box
                          sx={{
                            borderRadius: '12px',
                            background: post.is_triggering_post ? '#FFF0F7' : '#FAFBFC',
                            border: post.is_triggering_post ? '2px solid #C91A79' : '1px solid #E5E7EB',
                            p: 2.5,
                            position: 'relative',
                            transition: 'all 0.2s',
                            '&:hover': {
                              boxShadow: post.is_triggering_post ? '0 4px 16px rgba(201, 26, 121, 0.15)' : '0 4px 12px rgba(0, 0, 0, 0.06)',
                              transform: 'translateX(4px)',
                            },
                          }}
                        >
                          {/* Triggering Post Badge */}
                          {post.is_triggering_post && (
                            <Box
                              sx={{
                                position: 'absolute',
                                top: 10,
                                right: 10,
                                background: 'linear-gradient(135deg, #C91A79 0%, #A01560 100%)',
                                color: '#fff',
                                px: 1.5,
                                py: 0.5,
                                borderRadius: '6px',
                                fontSize: '10px',
                                fontWeight: 700,
                                letterSpacing: '0.5px',
                                textTransform: 'uppercase',
                                boxShadow: '0 2px 8px rgba(201, 26, 121, 0.3)',
                              }}
                            >
                              ⚡ Alert Trigger
                            </Box>
                          )}

                          {/* Post Author & Date */}
                          <Box display="flex" alignItems="center" justifyContent="space-between" mb={1.5}>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Typography fontSize="13px" fontWeight={600} color="#374151">
                                {post.post_author || 'Unknown Author'}
                              </Typography>
                              {post.post_created_at && (
                                <>
                                  <Typography fontSize="12px" color="#D1D5DB">
                                    •
                                  </Typography>
                                  <Typography fontSize="12px" color="#9CA3AF">
                                    {formatDate(post.post_created_at)}
                                  </Typography>
                                </>
                              )}
                            </Box>
                          </Box>

                          {/* Post Content */}
                          <Typography
                            fontSize="13px"
                            color="#4B5563"
                            lineHeight={1.7}
                            mb={2}
                            sx={{
                              display: '-webkit-box',
                              WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {post.post_text}
                          </Typography>

                          {/* Post Footer */}
                          <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Box display="flex" gap={2.5}>
                              <Box display="flex" alignItems="center" gap={0.5}>
                                <FavoriteIcon sx={{ fontSize: 14, color: '#EF4444' }} />
                                <Typography fontSize="12px" color="#6B7280" fontWeight={600}>
                                  {post.post_likes}
                                </Typography>
                              </Box>
                              <Box display="flex" alignItems="center" gap={0.5}>
                                <MessageIcon sx={{ fontSize: 14, color: '#3B82F6' }} />
                                <Typography fontSize="12px" color="#6B7280" fontWeight={600}>
                                  {post.post_comments}
                                </Typography>
                              </Box>
                            </Box>
                            {post.post_url && (
                              <Button
                                variant="text"
                                size="small"
                                href={post.post_url}
                                target="_blank"
                                sx={{
                                  color: '#7C3AED',
                                  textTransform: 'none',
                                  fontWeight: 700,
                                  fontSize: '11px',
                                  px: 1.5,
                                  '&:hover': {
                                    backgroundColor: '#7C3AED12',
                                  },
                                }}
                              >
                                View Post →
                              </Button>
                            )}
                          </Box>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default ScannedContentTab;
