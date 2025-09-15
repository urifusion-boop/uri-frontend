import { Avatar, Box, Button, Skeleton, Typography } from "@mui/material";
import { useState } from "react";
import Text from "./CustomText";
import PlatformIcon from "./PlatformIcons";
import { TextHelper } from "@/helpers/TextHelper";
import dayjs from "dayjs";

type Post = {
  text?: string;
  displayLink?: string;
  date?: string;
  image?: string;
  username?: string;
};

interface TopPostProps {
  posts?: Post[];
  tabs?: string[];
  seeAllBtn?: () => void;
  loading?: boolean;
  keywords?: string[];
  maxHeight?: string;
}

export default function TopPost({
  posts,
  tabs,
  seeAllBtn,
  loading,
  keywords,
  maxHeight,
}: Readonly<TopPostProps>) {
  const [selectedTab, setSelectedTab] = useState<number>(0);

  return (
    <Box
      py={3}
      borderRadius={2}
      px={4}
      bgcolor={"white"}
      height="100%"
      sx={{
        maxHeight: maxHeight ?? "auto",
        overflowY: "auto",
      }}
      className="scroll"
    >
      <Text weight={600} size={22}>
        Top Posts
      </Text>
      <Box display={"flex"} mt={2} justifyContent={"space-between"}>
        {tabs?.map((tab, index) => (
          <button key={tab} onClick={() => setSelectedTab(index)}>
            <Text
              color={selectedTab === index ? "#CD1B78" : ""}
              weight={selectedTab === index ? 700 : 400}
              size={16}
            >
              {tab}
            </Text>
          </button>
        ))}
      </Box>

      {loading ? (
        <Box
          sx={{
            height: "80%",
            minHeight: "200px",
          }}
        >
          <Skeleton
            variant="rectangular"
            width="100%"
            height="100%"
            animation="wave"
          />
        </Box>
      ) : (
        posts?.map((post, index) => (
          <Box
            key={index + "posts"}
            my={2}
            pt={2}
            display={"flex"}
            gap={2}
            borderTop={"1px solid #D3D3D3"}
            alignItems={"center"}
          >
            <Box
              sx={{
                alignSelf: "flex-start",
              }}
            >
              {post.image ? (
                <Avatar src={post.image} sx={{ width: 30, height: 30 }} />
              ) : (
                <PlatformIcon
                  platform={TextHelper.getDomainName(post.displayLink)}
                  size={24}
                />
              )}
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
                width: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "100%",
                  alignItems: "center",
                }}
              >
                <Text weight={600} size={16}>
                  {post?.username ??
                    TextHelper.getDomainName(post.displayLink) ??
                    ""}
                </Text>
                {post.date && (
                  <Text weight={400} size={14}>
                    {dayjs(post.date).format("DD MMM YYYY")}
                  </Text>
                )}
              </Box>
              <Typography
                dangerouslySetInnerHTML={{
                  __html: TextHelper.highlightKeywords(
                    post.text ?? "",
                    keywords
                  ),
                }}
                variant="body2"
                component="div"
              />
            </Box>
          </Box>
        ))
      )}

      {!loading && seeAllBtn && posts && posts?.length > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
            marginTop: "10px",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            sx={{
              fontSize: "16px",
            }}
            onClick={seeAllBtn}
          >
            See All Post
          </Button>
        </Box>
      )}
    </Box>
  );
}
