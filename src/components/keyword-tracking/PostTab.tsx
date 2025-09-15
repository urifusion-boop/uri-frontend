import { Box, Grid, Pagination, Skeleton } from "@mui/material";
import { FaUser } from "react-icons/fa6";
import { KeywordTrackerPostDto } from "@/models/dtos/TrackerDto";
import EmptyState from "../atoms/EmptyState";
import { LightThemeColors } from "@/configs/colors.config";
import KeywordTrackerPostCard from "./PostCard";
import { parseAsInteger, useQueryState } from "nuqs";

interface PostTabProps {
  postData: KeywordTrackerPostDto | null | undefined;
  loading?: boolean;
  keywords?: string[];
}

const PostTab = ({ postData, loading, keywords }: PostTabProps) => {
  const [page, setPage] = useQueryState(
    "post_page_num",
    parseAsInteger.withDefault(1)
  );

  return (
    <Box pb={4}>
      <Grid container spacing={3} mx="auto" width="100%">
        {loading ? (
          <>
            {Array.from({ length: 6 }).map((_, index) => (
              <Grid item key={index} xs={12} sm={6} lg={4} xl={3}>
                <Skeleton variant="rectangular" height={200} />
              </Grid>
            ))}
          </>
        ) : postData?.posts_data && postData.posts_data.length > 0 ? (
          postData?.posts_data
            .slice((page - 1) * 10, page * 10)
            .map((post, index) => (
              <Grid
                item
                key={post?.username ?? "" + index}
                xs={12}
                sm={6}
                lg={4}
                xl={3}
                width={"100%"}
                px={2}
              >
                <KeywordTrackerPostCard tweet={post} keywords={keywords} />
              </Grid>
            ))
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "500px",
              width: "100%",
            }}
          >
            <EmptyState
              icon={<FaUser color={LightThemeColors.uriColor} size={40} />}
              message="No posts found"
              actionRequired={false}
            />
          </Box>
        )}
      </Grid>
      {!loading && postData?.posts_data && postData.posts_data?.length > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            mt: 4,
          }}
        >
          <Pagination
            count={Math.ceil(postData.posts_data?.length / 10)}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            siblingCount={0}
            boundaryCount={1}
          />
        </Box>
      )}
      <Box></Box>
    </Box>
  );
};

export default PostTab;
