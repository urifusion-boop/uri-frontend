import { LazarusService } from '@/api/LazarusService';
import ArticleIcon from '@mui/icons-material/Article';
import BusinessIcon from '@mui/icons-material/Business';
import FacebookIcon from '@mui/icons-material/Facebook';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import MessageIcon from '@mui/icons-material/Message';
import PersonIcon from '@mui/icons-material/Person';
import RadarIcon from '@mui/icons-material/Radar';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TwitterIcon from '@mui/icons-material/Twitter';
import { Box, Button, Chip, CircularProgress, Grid, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

interface ScannedPost {
  post_id: string;
  alert_id: string;
  source_type: string;
  source_id: string;
  source_name: string;
  platform: string;
  text: string;
  author?: string;
  url?: string;
  created_at?: string;
  likes: number;
  comments: number;
  alert_type: string;
  alert_created: string;
  signal_type?: string;
  confidence?: number;
  is_triggering_post?: boolean;
  post_index?: number;
}

interface ProfileScan {
  scan_id: string;
  source_type: string;
  source_id: string;
  source_name: string;
  scan_date: string;
  next_scan_date?: string;
  scan_count: number;
  alert_count: number;
  scan_frequency_days: number;
  status: string;
  platforms: string[];
}

interface ScannedContentTabProps {
  userId: string;
}

const ScannedContentTab = ({ userId }: ScannedContentTabProps) => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<ScannedPost[]>([]);
  const [profileScans, setProfileScans] = useState<ProfileScan[]>([]);
  const [activeSection, setActiveSection] = useState<'posts' | 'scans'>('posts');

  useEffect(() => {
    loadScannedContent();
  }, [userId]);

  const loadScannedContent = async () => {
    try {
      setLoading(true);
      const response = await LazarusService.getScannedContent(userId);
      if (response.responseData) {
        setPosts(response.responseData.posts || []);
        setProfileScans(response.responseData.profile_scans || []);
      }
    } catch (error) {
      console.error('Failed to load scanned content:', error);
      toast.error('Failed to load scanned content');
    } finally {
      setLoading(false);
    }
  };

  const getPlatformIcon = (platform: string) => {
    const platformLower = platform.toLowerCase();
    if (platformLower.includes('linkedin')) return <LinkedInIcon sx={{ fontSize: 16 }} />;
    if (platformLower.includes('twitter') || platformLower.includes('x.com')) return <TwitterIcon sx={{ fontSize: 16 }} />;
    if (platformLower.includes('facebook')) return <FacebookIcon sx={{ fontSize: 16 }} />;
    return <ArticleIcon sx={{ fontSize: 16 }} />;
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
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatSignalType = (alertType: string) => {
    return alertType
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
      {/* Section Selector */}
      <Box display="flex" gap={2} mb={3}>
        <Button
          variant={activeSection === 'posts' ? 'contained' : 'outlined'}
          startIcon={<ArticleIcon />}
          onClick={() => setActiveSection('posts')}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '10px',
            px: 3,
            py: 1,
            ...(activeSection === 'posts'
              ? {
                  background: 'linear-gradient(135deg, #C91A79 0%, #A01560 100%)',
                  color: '#fff',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #A01560 0%, #C91A79 100%)',
                  },
                }
              : {
                  borderColor: '#E5E7EB',
                  color: '#6B7280',
                  '&:hover': {
                    borderColor: '#C91A79',
                    backgroundColor: '#FFF5FA',
                  },
                }),
          }}
        >
          Posts ({posts.length})
        </Button>
        <Button
          variant={activeSection === 'scans' ? 'contained' : 'outlined'}
          startIcon={<RadarIcon />}
          onClick={() => setActiveSection('scans')}
          sx={{
            textTransform: 'none',
            fontWeight: 600,
            borderRadius: '10px',
            px: 3,
            py: 1,
            ...(activeSection === 'scans'
              ? {
                  background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
                  color: '#fff',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #6D28D9 0%, #7C3AED 100%)',
                  },
                }
              : {
                  borderColor: '#E5E7EB',
                  color: '#6B7280',
                  '&:hover': {
                    borderColor: '#7C3AED',
                    backgroundColor: '#F5F3FF',
                  },
                }),
          }}
        >
          Scan History ({profileScans.length})
        </Button>
      </Box>

      {/* Posts Section */}
      {activeSection === 'posts' && (
        <Box>
          {posts.length === 0 ? (
            <Box
              sx={{
                py: 8,
                textAlign: 'center',
                borderRadius: '12px',
                background: '#FAFBFC',
                border: '2px dashed #E5E7EB',
              }}
            >
              <ArticleIcon sx={{ fontSize: 48, color: '#D1D5DB', mb: 2 }} />
              <Typography variant="h6" fontWeight={600} color="#374151" mb={1}>
                No Scanned Posts Yet
              </Typography>
              <Typography variant="body2" color="#6B7280">
                Posts that trigger alerts will appear here
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2.5}>
              {posts.map((post) => (
                <Grid item xs={12} key={post.post_id}>
                  <Box
                    sx={{
                      borderRadius: '16px',
                      background: post.is_triggering_post ? '#FFF9FC' : '#fff',
                      border: post.is_triggering_post ? '2px solid #C91A79' : '1px solid #F5F5F5',
                      p: 3,
                      position: 'relative',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        boxShadow: post.is_triggering_post ? '0 8px 20px rgba(201, 26, 121, 0.15)' : '0 8px 20px rgba(201, 26, 121, 0.08)',
                        borderColor: post.is_triggering_post ? '#C91A79' : '#C91A7915',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    {/* Triggering Post Badge */}
                    {post.is_triggering_post && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          background: 'linear-gradient(135deg, #C91A79 0%, #A01560 100%)',
                          color: '#fff',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: '6px',
                          fontSize: '10px',
                          fontWeight: 700,
                          letterSpacing: '0.5px',
                          textTransform: 'uppercase',
                          boxShadow: '0 2px 8px rgba(201, 26, 121, 0.25)',
                        }}
                      >
                        ⚡ Alert Trigger
                      </Box>
                    )}

                    {/* Post Header */}
                    <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                      <Box display="flex" alignItems="center" gap={1.5}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '10px',
                            background: getPlatformColor(post.platform) + '15',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: getPlatformColor(post.platform),
                          }}
                        >
                          {getPlatformIcon(post.platform)}
                        </Box>
                        <Box>
                          <Typography fontSize="14px" fontWeight={600} color="#1A1A1A">
                            {post.source_name}
                          </Typography>
                          <Typography fontSize="11px" color="#9CA3AF">
                            {post.platform} • {formatDate(post.created_at || post.alert_created)}
                          </Typography>
                        </Box>
                      </Box>
                      <Chip
                        label={formatSignalType(post.alert_type)}
                        size="small"
                        sx={{
                          height: '24px',
                          fontSize: '11px',
                          fontWeight: 600,
                          background: '#FFF5FA',
                          color: '#C91A79',
                          border: '1px solid #FFEBF4',
                        }}
                      />
                    </Box>

                    {/* Post Content */}
                    <Typography
                      fontSize="14px"
                      color="#374151"
                      lineHeight={1.7}
                      mb={2}
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {post.text}
                    </Typography>

                    {/* Post Footer */}
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                      <Box display="flex" gap={2}>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <FavoriteIcon sx={{ fontSize: 14, color: '#EF4444' }} />
                          <Typography fontSize="12px" color="#6B7280" fontWeight={500}>
                            {post.likes}
                          </Typography>
                        </Box>
                        <Box display="flex" alignItems="center" gap={0.5}>
                          <MessageIcon sx={{ fontSize: 14, color: '#3B82F6' }} />
                          <Typography fontSize="12px" color="#6B7280" fontWeight={500}>
                            {post.comments}
                          </Typography>
                        </Box>
                        {post.confidence && (
                          <Box display="flex" alignItems="center" gap={0.5}>
                            <TrendingUpIcon sx={{ fontSize: 14, color: '#10B981' }} />
                            <Typography fontSize="12px" color="#10B981" fontWeight={500}>
                              {Math.round(post.confidence * 100)}% confidence
                            </Typography>
                          </Box>
                        )}
                      </Box>
                      {post.url && (
                        <Button
                          variant="text"
                          size="small"
                          href={post.url}
                          target="_blank"
                          sx={{
                            color: '#7C3AED',
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '11px',
                            '&:hover': {
                              backgroundColor: '#7C3AED08',
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
        </Box>
      )}

      {/* Profile Scans Section */}
      {activeSection === 'scans' && (
        <Box>
          {profileScans.length === 0 ? (
            <Box
              sx={{
                py: 8,
                textAlign: 'center',
                borderRadius: '12px',
                background: '#FAFBFC',
                border: '2px dashed #E5E7EB',
              }}
            >
              <RadarIcon sx={{ fontSize: 48, color: '#D1D5DB', mb: 2 }} />
              <Typography variant="h6" fontWeight={600} color="#374151" mb={1}>
                No Profile Scans Yet
              </Typography>
              <Typography variant="body2" color="#6B7280">
                Scan history will appear here
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2.5}>
              {profileScans.map((scan) => (
                <Grid item xs={12} md={6} key={scan.scan_id}>
                  <Box
                    sx={{
                      borderRadius: '16px',
                      background: '#fff',
                      border: '1px solid #F5F5F5',
                      p: 3,
                      height: '100%',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        boxShadow: '0 8px 20px rgba(124, 58, 237, 0.08)',
                        borderColor: '#7C3AED15',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    {/* Scan Header */}
                    <Box display="flex" alignItems="center" gap={2} mb={2.5}>
                      <Box
                        sx={{
                          width: 48,
                          height: 48,
                          borderRadius: '12px',
                          background: scan.source_type === 'FOCUS_CONTACT' ? '#FFF5FA' : '#F0FDF4',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {scan.source_type === 'FOCUS_CONTACT' ? <PersonIcon sx={{ color: '#C91A79', fontSize: 22 }} /> : <BusinessIcon sx={{ color: '#10B981', fontSize: 22 }} />}
                      </Box>
                      <Box flex={1}>
                        <Typography fontSize="16px" fontWeight={600} color="#1A1A1A">
                          {scan.source_name}
                        </Typography>
                        <Typography fontSize="11px" color="#9CA3AF" fontWeight={500}>
                          Last scanned {formatDate(scan.scan_date)}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Platforms */}
                    <Box display="flex" gap={1} flexWrap="wrap" mb={2.5}>
                      {scan.platforms.map((platform, idx) => (
                        <Chip
                          key={idx}
                          label={platform}
                          size="small"
                          icon={getPlatformIcon(platform)}
                          sx={{
                            fontSize: '11px',
                            fontWeight: 600,
                            background: '#F9FAFB',
                            color: '#6B7280',
                            border: '1px solid #E5E7EB',
                            height: '24px',
                            '& .MuiChip-icon': {
                              color: getPlatformColor(platform),
                            },
                          }}
                        />
                      ))}
                    </Box>

                    {/* Scan Stats */}
                    <Box
                      sx={{
                        pt: 2,
                        borderTop: '1px solid #F5F5F5',
                      }}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Typography fontSize="12px" color="#9CA3AF" fontWeight={600} mb={0.5}>
                            Total Scans
                          </Typography>
                          <Typography fontSize="20px" fontWeight={700} color="#7C3AED">
                            {scan.scan_count}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography fontSize="12px" color="#9CA3AF" fontWeight={600} mb={0.5}>
                            Alerts Generated
                          </Typography>
                          <Typography fontSize="20px" fontWeight={700} color="#C91A79">
                            {scan.alert_count}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Typography fontSize="11px" color="#9CA3AF" fontWeight={500} mt={1.5}>
                        Scans every {scan.scan_frequency_days} days • Next: {formatDate(scan.next_scan_date || '')}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ScannedContentTab;
