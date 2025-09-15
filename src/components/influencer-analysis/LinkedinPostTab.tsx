import React from "react";
import { Box, Grid, Skeleton } from "@mui/material";
import { LinkedinPostsDto } from "@/models/dtos/LinkedinInsightsDto";
import FacebookPostCard from "../cards/FacebookPostCard";
import { FaLinkedin } from "react-icons/fa6";
import EmptyState from "../atoms/EmptyState";
import LoaderWrapper from "../atoms/LoaderWrapper";

interface Props {
  posts: LinkedinPostsDto[];
  onClick: (postId: string) => void;
  loading?: boolean;
  isRefetching?: boolean;
}

const LinkedinPostsTab: React.FC<Props> = ({
  posts,
  onClick,
  loading,
  isRefetching,
}) => {
  return (
    <Box>
      <LoaderWrapper
        isLoading={loading}
        isGrid
        numberOfSkeletons={6}
        skeletonHeight="300px"
        skeletonWidth="300px"
      >
        {posts.length > 0 ? (
          <Grid container spacing={2}>
            <>
              {posts.map((post) => {
                const content =
                  post?.specificContent?.["com.linkedin.ugc.ShareContent"];

                return (
                  <Grid item key={post.id} xs={12} md={6} lg={3}>
                    <FacebookPostCard
                      post={{
                        id: post.id,
                        created_time: post.firstPublishedAt,
                        attachments: {
                          data: [
                            {
                              media: {
                                image: {
                                  src: content?.media?.[0]?.originalUrl,
                                  height: 200,
                                  width: 200,
                                },
                              },
                              media_type: "",
                              url: "",
                              description: content?.shareCommentary.text,
                            },
                          ],
                        },
                      }}
                      PlatformIcon={FaLinkedin}
                      onClick={() => onClick(post.id)}
                    />
                  </Grid>
                );
              })}
            </>
            {isRefetching &&
              Array.from({ length: 4 }).map((_, index) => (
                <Grid key={"skeleton" + index} item xs={12} md={6} lg={3}>
                  <Skeleton
                    variant="rectangular"
                    sx={{ height: "410px" }}
                    animation="wave"
                  />
                </Grid>
              ))}
          </Grid>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <EmptyState
              icon={<FaLinkedin color="#3b5998" size={100} />}
              actionRequired={false}
              heading="No Posts Found"
              subtitle="This account has not posted anything yet."
            />
          </Box>
        )}
      </LoaderWrapper>
    </Box>
  );
};

export default LinkedinPostsTab;
