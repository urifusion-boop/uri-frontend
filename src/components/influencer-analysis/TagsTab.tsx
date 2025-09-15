import { Box, Button, Grid, Skeleton } from "@mui/material";
import EmptyState from "../atoms/EmptyState";
import { FaVideoSlash } from "react-icons/fa";
import MediaInsight from "../atoms/MediaInsight";
import {
  BusinessProfileInsight,
  CommentSentimentAnalysis,
} from "@/models/dtos/InstagramInsights";
import { MetricVariantEnum } from "@/models/enum-models/MetricEnum";
import TagsPostCard from "../cards/TagsPostCard";

interface TagsTabProps {
  activeTab: string;
  selectedTag: BusinessProfileInsight | undefined;
  fetchTagsLoading: boolean;
  fetchTags: () => void;
  tagsMedia: BusinessProfileInsight[];
  tagSentimentLoading: boolean;
  tagSentimentData: CommentSentimentAnalysis | null | undefined;
  setSelectedTag: (tag: BusinessProfileInsight | undefined) => void;
  tagsAfterPagination: string | undefined;
  authenticated?: boolean;
}

const TagsTab = ({
  activeTab,
  selectedTag,
  fetchTagsLoading,
  fetchTags,
  tagsMedia,
  tagSentimentLoading,
  tagSentimentData,
  setSelectedTag,
  tagsAfterPagination,
  authenticated
}: TagsTabProps) => {
  return (
    <>
      {activeTab === "tags" && !selectedTag ? (
        /* Tags Tab Content */
        <Box
          sx={{
            maxWidth: "2000px",
            px: 3,
          }}
        >
          <Box sx={{ flexGrow: 1, py: 2 }}>
            <Grid container spacing={3}>
              {tagsMedia && tagsMedia.length > 0 ? (
                tagsMedia.map((post: BusinessProfileInsight) => (
                  <Grid
                    item
                    alignItems={"stretch"}
                    xs={12}
                    sm={6}
                    md={3}
                    key={post.id}
                  >
                    <TagsPostCard
                      post={post}
                      onShowSentiments={() => {
                        setSelectedTag(post);
                      }}
                      authenticated={authenticated}
                    />
                  </Grid>
                ))
              ) : (
                <Box
                  style={{
                    width: "100%",
                  }}
                >
                  <EmptyState
                    message="No tags found."
                    actionRequired={false}
                    icon={<FaVideoSlash size={60} color="#000" />}
                  />
                </Box>
              )}
              {fetchTagsLoading &&
                [1, 2, 3, 4].map((skeleton, index) => (
                  <Grid
                    item
                    alignItems={"stretch"}
                    xs={12}
                    sm={6}
                    md={3}
                    key={index}
                  >
                    <Skeleton
                      animation="wave"
                      variant="rectangular"
                      height={"400px"}
                    />
                  </Grid>
                ))}
            </Grid>
            <Box
              sx={{
                display: tagsAfterPagination ? "flex" : "none",
                justifyContent: "center",
                mt: 2,
              }}
            >
              <Button onClick={() => fetchTags}>Next</Button>
            </Box>
          </Box>
        </Box>
      ) : selectedTag && activeTab === "tags" ? (
        <MediaInsight
          mediaLoading={tagSentimentLoading}
          mediaTypeData={undefined}
          sentimentData={tagSentimentData ?? null}
          clearSelected={() => setSelectedTag(undefined)}
          variant={MetricVariantEnum.TAGS}
        />
      ) : null}
    </>
  );
};

export default TagsTab;
