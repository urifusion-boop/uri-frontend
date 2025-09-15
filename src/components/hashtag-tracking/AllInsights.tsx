import { HashtagMentionFrequency, HashtagTrackPost, PostTypeDistribution } from '@/models/dtos/HashTagDto';
import { Box, Skeleton } from '@mui/material';

import ErrorStateMessage from '@/components/atoms/ErrorStateMessage';
import HashtagCard from '@/components/hashtag-tracking/HashtagCard';
import { LightThemeColors } from '@/configs/colors.config';
import { InsightHelper } from '@/helpers/InsightHelper';
import { useMemo } from 'react';
import MentionsEngagementChart from '../charts/MentionsEngagementChart';
import PostTypePieChart from '../charts/PostTypePieChart';
import WordsBarChart from '../charts/WordsBarChart';

interface AllInsightsProps {
  posts: HashtagTrackPost[];
  isLoading?: boolean;
  relatedHashtags?: string[];
  trendingHashtags?: string[];
  hashtagMentionFrequency: HashtagMentionFrequency[] | [];
  aiPostReportLoading?: boolean;
  aiPostReportError?: string;
  refetchAiPostReport?: () => void;
  hashtagReportLoading?: boolean;
  postTypeDistribution?: PostTypeDistribution[];
}

const AllInsights = ({
  posts,
  isLoading,
  relatedHashtags,
  trendingHashtags,
  hashtagMentionFrequency,
  aiPostReportLoading,
  aiPostReportError,
  refetchAiPostReport,
  hashtagReportLoading,
  postTypeDistribution,
}: AllInsightsProps) => {
  const chartData = useMemo(() => {
    return InsightHelper.prepareHashtagEngagementChartData(posts)?.reverse();
  }, [posts]);

  // const allReportsLoading = isLoading || aiPostReportLoading || hashtagReportLoading;

  return (
    <Box
      sx={{
        padding: '16px',
        display: 'flex',
        gap: '29px',
        flexDirection: { xs: 'column', md: 'row' },
      }}
    >
      <Box sx={{ width: { xs: '100%', md: '60%' } }}>
        {/* Mention, Reach and Sentiment */}
        <Box>
          {isLoading ? (
            <Skeleton
              variant="rectangular"
              height={435}
              width={'100%'}
              sx={{
                borderRadius: '5px',
                height: '150px',
              }}
              animation="wave"
            />
          ) : (
            <MentionsEngagementChart data={chartData?.slice(-20)} />
          )}
        </Box>

        <Box marginTop={2} borderRadius="5px">
          {isLoading ? (
            <Skeleton
              variant="rectangular"
              width={'100%'}
              sx={{
                borderRadius: '5px',
                height: { xs: '300px', md: '710px' },
                mt: '30px',
              }}
              animation="wave"
            />
          ) : (
            <WordsBarChart dataset={hashtagMentionFrequency ?? []} />
          )}
        </Box>

        {/*Recent Post  */}
      </Box>

      {/* Second */}
      <Box sx={{ width: { xs: '100%', md: '40%' } }}>
        <Box
          sx={{
            backgroundColor: '#fff',
            borderRadius: '10px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.05)',
            padding: '16px',
          }}
        >
          <Box mt={1}>
            {isLoading ? (
              <Skeleton
                variant="rectangular"
                width={'100%'}
                sx={{
                  borderRadius: '5px',
                  height: { xs: '300px', md: '400px' },
                }}
                animation="wave"
              />
            ) : (
              <Box py={2} borderRadius={2} gap={2} px={2} bgcolor="white" height={430}>
                <PostTypePieChart
                  // TODO: remove check when BE update gets merged
                  data={
                    postTypeDistribution
                      ? Array.isArray(postTypeDistribution)
                        ? postTypeDistribution
                        : Object.keys(postTypeDistribution).map((key) => ({ media_type: key, count: postTypeDistribution?.[key] }))
                      : []
                  }
                  xKey="media_type"
                  yKey="count"
                  title="Post Type Distribution"
                  subtitle="Distribution of web post types by keyword"
                  colorSet={[LightThemeColors.uriColor, 'gray', '#333', '#90A3AE']}
                  isLoading={isLoading}
                  marginTop={40}
                />
              </Box>
            )}
          </Box>
        </Box>

        {/* Hashtags */}
        <Box sx={{ mt: '30px' }} py={3} borderRadius="10px" gap={2} px={4} bgcolor={'white'} minHeight={'250px'} maxHeight="350px" width={'100%'} overflow="auto" className="scroll">
          {aiPostReportError ? (
            <ErrorStateMessage message={aiPostReportError} hasBtn btnText="Retry" btnProps={{ onClick: refetchAiPostReport }} />
          ) : (
            <HashtagCard
              data={(relatedHashtags ?? [])?.map((value, index) => ({
                hashtags: value ?? '',
              }))}
              title="Related Hashtags"
              isLoading={aiPostReportLoading}
              maxHeight="350px"
            />
          )}
        </Box>
        <Box sx={{ mt: '30px' }} py={3} borderRadius="10px" gap={2} px={4} bgcolor={'white'} minHeight={'250px'} maxHeight="350px" width={'100%'} overflow="auto" className="scroll">
          {aiPostReportError ? (
            <ErrorStateMessage message={aiPostReportError} hasBtn btnText="Retry" btnProps={{ onClick: refetchAiPostReport }} />
          ) : (
            <HashtagCard
              data={(trendingHashtags ?? [])?.map((value, index) => ({
                hashtags: value ?? '',
              }))}
              title="Trending Hashtags"
              isLoading={aiPostReportLoading}
              maxHeight="350px"
            />
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default AllInsights;
