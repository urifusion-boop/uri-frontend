import { TextHelper } from "@/helpers/TextHelper";
import { SentimentData } from "@/models/dtos/TrackerDto";
import { Typography, Box, Avatar } from "@mui/material";
import { ImHappy2 } from "react-icons/im";
import { IoPersonSharp } from "react-icons/io5";
import PlatformIcon from "../PlatformIcons";
import dayjs from "dayjs";

interface FeedsCardDto {
  sentiment: SentimentData;
  tags: string[];
}

const FeedsCard: React.FC<FeedsCardDto> = ({ sentiment, tags }) => {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "#27ae60";
      case "negative":
        return "#e74c3c";
      case "neutral":
        return "#f39c12";
      default:
        return "#f39c12";
    }
  };

  const formattedDate = (date: string) => {
    return dayjs(date).format("MMM DD, YYYY") === "Invalid Date"
      ? date
      : dayjs(date).format("MMM DD, YYYY");
  };

  return (
    <>
      <Box
        sx={{
          borderLeft: `10px solid lightblue`,
          borderRadius: 2,
          p: 2,
          bgcolor: "white",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", gap: 1, alignItems: "start", py: 1 }}>
            {sentiment.image ? (
              <Avatar
                src={sentiment.image}
                alt={sentiment.author}
                sx={{ width: 48, height: 48 }}
              />
            ) : (
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  backgroundColor: "lightgray",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <IoPersonSharp color="gray" size={20} />
              </Box>
            )}
            <Box>
              {sentiment?.website && sentiment?.website?.length > 1 && (
                <Box sx={{ display: "flex", gap: 0.5, alignItems: "center" }}>
                  <Typography variant="subtitle2" fontWeight={700}>
                    {TextHelper.getDomainName(sentiment.website ?? "")}
                  </Typography>
                </Box>
              )}
              {sentiment?.website && sentiment?.website?.length > 1 && (
                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                  <PlatformIcon
                    platform={TextHelper.getDomainName(
                      sentiment?.website ?? ""
                    )}
                  />
                  <Typography variant="body2" color="gray">
                    {formattedDate(sentiment.timestamp ?? "")}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
          <ImHappy2
            color={getSentimentColor(sentiment?.sentiment?.sentiment ?? "")}
            size={20}
          />
        </Box>
        <Box>
          <Typography variant="subtitle2">{sentiment.comment}</Typography>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              gap: 2,
              mt: 2,
              flexWrap: "wrap",
            }}
          >
            {tags.map((tag) => (
              <Box
                px={1}
                key={tag}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  backgroundColor: "lightgray",
                  borderRadius: 2,
                  color: "gray",
                  "&:hover": {
                    backgroundColor: "lightblue",
                    cursor: "pointer",
                  },
                }}
              >
                {tag}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default FeedsCard;
