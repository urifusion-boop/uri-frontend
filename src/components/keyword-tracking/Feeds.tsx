import {
  Avatar,
  Box,
  Drawer,
  Grid,
  IconButton,
  Skeleton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { TextHelper } from "@/helpers/TextHelper";
import CloseIcon from "@mui/icons-material/Close";
import { KeywordTrackResponseDto, Post } from "@/models/dtos/TrackerDto";
import DynamicWebRenderer from "./DynamicWebRenderer";
import DynamicSearchResultRenderer from "./DynamicSearchResultRenderer";
import { SecurityHelper } from "@/helpers/SecurityHelper";
import PlatformIcon from "../atoms/PlatformIcons";
import { FaVideoSlash } from "react-icons/fa6";
import EmptyState from "../atoms/EmptyState";
import { LightThemeColors } from "@/configs/colors.config";

interface FeedTabProps {
  keywordTrack: KeywordTrackResponseDto | null | undefined;
  keywords: string[];
  loading: boolean;
}

const FeedTab = ({ keywordTrack, keywords, loading }: FeedTabProps) => {
  const [selectedPost, setSelectedPost] = useState<Post | null>(
    keywordTrack?.posts?.[0] ?? null
  );
  const [canEmbed, setCanEmbed] = useState<boolean>(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleCloseDrawer = () => {
    setOpenDrawer(false);
  };

  useEffect(() => {
    if (selectedPost) {
      SecurityHelper.canEmbed(selectedPost?.link ?? "").then((res) => {
        setCanEmbed(res);
      });
    }
  }, [selectedPost]);

  useEffect(() => {
    if (keywordTrack?.posts) {
      setSelectedPost(keywordTrack?.posts?.[0]);
    }
  }, [keywordTrack?.posts]);

  return (
    <Grid
      container
      spacing={2}
      px={{
        xs: 2,
      }}
    >
      {loading ? (
        <>
          <Grid item xs={12} md={6}>
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton
                variant="rectangular"
                width="100%"
                height="60px"
                animation="wave"
                key={index}
                sx={{
                  marginBottom: theme.spacing(1),
                }}
              />
            ))}
          </Grid>
          <Grid item xs={0} md={6}>
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              animation="wave"
            />
          </Grid>
        </>
      ) : keywordTrack?.posts && keywordTrack?.posts?.length < 0 ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
            minHeight: "400px",
          }}
        >
          <EmptyState
            message="No posts found for this tracker"
            actionRequired={false}
            icon={<FaVideoSlash size={100} color={LightThemeColors.uriColor} />}
          />
        </Box>
      ) : (
        <>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              borderRight: "1px solid #ddd",
              overflowY: "auto",
              maxHeight: "calc(100vh - 100px)",
            }}
            className="scroll"
          >
            {keywordTrack?.posts?.map((item, index) => (
              <Box
                key={index}
                onClick={() => {
                  setSelectedPost(item);
                  if (isMobile) {
                    setOpenDrawer(true);
                  }
                }}
                style={{ borderBottom: "1px solid #ddd" }}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: theme.palette.action.hover,
                  },
                  display: "flex",
                  alignItems: "center",
                  padding: "10px",
                  gap: "12px",
                  bgcolor:
                    selectedPost === item ? theme.palette.action.hover : "",
                }}
              >
                <Box
                  sx={{
                    border: "1px solid #ddd",
                    borderRadius: "50%",
                    position: "relative",
                  }}
                >
                  <Avatar src={item?.pagemap?.cse_image?.[0]?.src} />
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: "-10px",
                      right: 0,
                    }}
                  >
                    <PlatformIcon
                      platform={TextHelper.getDomainName(item?.link)}
                    />
                  </Box>
                </Box>
                <Box>
                  <Typography variant="body2">
                    {TextHelper.getDomainName(item?.link)}
                  </Typography>

                  <p
                    dangerouslySetInnerHTML={{
                      __html: TextHelper.highlightKeywords(
                        item?.htmlTitle ?? "",
                        keywords
                      ),
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Grid>
          {isMobile ? (
            <Drawer
              anchor="right"
              open={openDrawer}
              onClose={handleCloseDrawer}
              PaperProps={{
                sx: { width: "90%" },
              }}
            >
              <IconButton onClick={handleCloseDrawer} sx={{ ml: "auto" }}>
                <CloseIcon />
              </IconButton>
              {selectedPost && (
                <>
                  {canEmbed ? (
                    <DynamicWebRenderer url={selectedPost?.link ?? ""} />
                  ) : (
                    <DynamicSearchResultRenderer result={selectedPost} />
                  )}
                </>
              )}
            </Drawer>
          ) : (
            selectedPost && (
              <Grid
                item
                md={6}
                overflow={"auto"}
                maxHeight={"calc(100vh - 100px)"}
              >
                {canEmbed ? (
                  <DynamicWebRenderer url={selectedPost?.link ?? ""} />
                ) : (
                  <DynamicSearchResultRenderer result={selectedPost} />
                )}
              </Grid>
            )
          )}
        </>
      )}
    </Grid>
  );
};

export default FeedTab;
