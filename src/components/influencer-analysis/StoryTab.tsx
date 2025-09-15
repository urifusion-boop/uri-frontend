import { BusinessProfileInsight, CommentSentimentAnalysis, MediaInsightResponse } from '@/models/dtos/InstagramInsights';
import { MetricVariantEnum } from '@/models/enum-models/MetricEnum';
import { Box, Grid } from '@mui/material';
import { FaVideoSlash } from 'react-icons/fa';
import EmptyState from '../atoms/EmptyState';
import LoaderWrapper from '../atoms/LoaderWrapper';
import MediaInsight from '../atoms/MediaInsight';
import TrackerPostCard from '../cards/TrackerPostCard';

interface StoryTabProps {
  activeTab: string;
  selectedStory: BusinessProfileInsight | undefined;
  storiesLoading: boolean;
  stories: BusinessProfileInsight[] | undefined;
  storySentimentLoading: boolean;
  storySentimentData: CommentSentimentAnalysis | null | undefined;
  setSelectedStory: (story: BusinessProfileInsight | undefined) => void;
  mediaPostData: MediaInsightResponse | null | undefined;
  authenticated?: boolean;
}

const StoryTab = ({ activeTab, selectedStory, storiesLoading, stories, storySentimentLoading, storySentimentData, setSelectedStory, mediaPostData, authenticated }: StoryTabProps) => {
  return (
    <>
      {activeTab === 'stories' && !selectedStory ? (
        <Box
          sx={{
            maxWidth: '2000px',
            px: 3,
          }}
        >
          <Box sx={{ flexGrow: 1, py: 2 }}>
            <Grid container spacing={3}>
              <LoaderWrapper isLoading={storiesLoading} isGrid numberOfSkeletons={3} skeletonHeight="400px">
                {stories && stories?.length > 0 ? (
                  stories?.map((post: BusinessProfileInsight) => (
                    <Grid item alignItems={'stretch'} xs={12} sm={6} md={3} key={post.id}>
                      <TrackerPostCard
                        post={post}
                        onShowSentiments={() => {
                          setSelectedStory(post);
                        }}
                        isStory
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
              </LoaderWrapper>
            </Grid>
          </Box>
        </Box>
      ) : selectedStory && activeTab === 'stories' ? (
        <MediaInsight
          mediaLoading={storySentimentLoading}
          mediaTypeData={mediaPostData ?? undefined}
          sentimentData={storySentimentData ?? null}
          clearSelected={() => setSelectedStory(undefined)}
          variant={MetricVariantEnum.STORIES}
        />
      ) : null}
    </>
  );
};

export default StoryTab;
