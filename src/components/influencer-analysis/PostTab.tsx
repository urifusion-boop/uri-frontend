import { BusinessProfileInsight, CommentSentimentAnalysis, InstagramBusinessProfile, MediaInsightResponse } from '@/models/dtos/InstagramInsights';
import { MetricVariantEnum } from '@/models/enum-models/MetricEnum';
import { Box, Button, Grid, Skeleton } from '@mui/material';
import { FaVideoSlash } from 'react-icons/fa';
import EmptyState from '../atoms/EmptyState';
import MediaInsight from '../atoms/MediaInsight';
import TrackerPostCard from '../cards/TrackerPostCard';

interface PostTabProps {
  activeTab: string;
  selectedPost: BusinessProfileInsight | undefined;
  data: InstagramBusinessProfile;
  fetchPostsLoading: boolean;
  fetchPosts: () => void;
  mediaPostLoading: boolean;
  postSentimentLoading: boolean;
  setSelectedPost: (post: BusinessProfileInsight | undefined) => void;
  mediaPostData: MediaInsightResponse | null | undefined;
  postSentimentData: CommentSentimentAnalysis | null | undefined;
  authenticated?: boolean;
}

const PostTab = ({
  activeTab,
  selectedPost,
  data,
  fetchPostsLoading,
  fetchPosts,
  mediaPostLoading,
  mediaPostData,
  postSentimentLoading,
  postSentimentData,
  setSelectedPost,
  authenticated,
}: PostTabProps) => {
  return (
    <>
      {activeTab === 'posts' && !selectedPost && (
        <Box
          sx={{
            maxWidth: '2000px',
            px: 3,
          }}
        >
          {/* Render the posts */}
          <Box sx={{ flexGrow: 1, py: 2 }}>
            <Grid container spacing={3}>
              {data.media.data && data.media.data.length > 0 ? (
                data.media.data?.map((post: BusinessProfileInsight) => (
                  <Grid item alignItems={'stretch'} xs={12} sm={6} md={3} key={post.id}>
                    <TrackerPostCard
                      post={post}
                      onShowSentiments={() => {
                        setSelectedPost(post);
                      }}
                      authenticated={authenticated}
                    />
                  </Grid>
                ))
              ) : (
                <Box
                  style={{
                    width: '100%',
                  }}
                >
                  <EmptyState message="No stories found." actionRequired={false} icon={<FaVideoSlash size={60} color="#000" />} />
                </Box>
              )}
              {fetchPostsLoading &&
                [1, 2, 3, 4].map((skeleton, index) => (
                  <Grid item alignItems={'stretch'} xs={12} sm={6} md={3} key={skeleton}>
                    <Skeleton animation="wave" variant="rectangular" height={'400px'} />
                  </Grid>
                ))}
            </Grid>
            <Box
              sx={{
                display: data?.media?.paging?.next ? 'flex' : 'none',
                justifyContent: 'center',
                mt: 2,
              }}
            >
              <Button onClick={() => fetchPosts()}>Next</Button>
            </Box>
          </Box>
        </Box>
      )}

      {selectedPost && activeTab === 'posts' && (
        <MediaInsight
          mediaLoading={mediaPostLoading || postSentimentLoading}
          mediaTypeData={mediaPostData ?? undefined}
          sentimentData={postSentimentData ?? null}
          clearSelected={() => setSelectedPost(undefined)}
          variant={MetricVariantEnum.POSTS}
        />
      )}
    </>
  );
};

export default PostTab;
