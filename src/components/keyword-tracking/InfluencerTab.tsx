import {
  Box,
  Checkbox,
  Divider,
  Grid,
  Pagination,
  Skeleton,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import InfluencerCard from "./InfluencersCard";
import { FaUser } from "react-icons/fa6";
import { KeywordTrackingInfluencers } from "@/models/dtos/TrackerDto";
import PeopleIcon from "@mui/icons-material/People";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ChatIcon from "@mui/icons-material/Chat";
import FavoriteIcon from "@mui/icons-material/Favorite";
import EmptyState from "../atoms/EmptyState";
import { LightThemeColors } from "@/configs/colors.config";
import { TextHelper } from "@/helpers/TextHelper";
import { parseAsInteger, useQueryState } from "nuqs";

interface InfluencerTabProps {
  influencersData: KeywordTrackingInfluencers[] | null | undefined;
  loading?: boolean;
  locations?: (string | undefined)[];
}

const InfluencerTab = ({
  influencersData,
  loading,
  locations,
}: InfluencerTabProps) => {
  const metricsIcons = {
    followers_count: <PeopleIcon />,
    following_count: <PersonAddIcon />,
    tweet_count: <ChatIcon />,
    like_count: <FavoriteIcon />,
  };

  const [influencersDataState, setInfluencerDataState] = React.useState<
    KeywordTrackingInfluencers[] | null | undefined
  >(influencersData);
  const [selectedInfluencer, setSelectedInfluencer] = useState<
    string[] | null
  >();

  const getSocialStats = (influencer: KeywordTrackingInfluencers) => {
    return Object.entries(influencer?.metrics ?? {})
      .filter(([key]) => key !== "listed_count")
      .map(([key, value]) => {
        return {
          platform: key,
          icon: metricsIcons[key as keyof typeof metricsIcons],
          followers: value,
        };
      });
  };

  const [page, setPage] = useQueryState(
    "influencer_page_num",
    parseAsInteger.withDefault(1)
  );

  useEffect(() => {
    setInfluencerDataState(influencersData);
  }, [influencersData]);

  const filterByLocation = (location: string) => {
    setSelectedInfluencer((prev) => {
      // Toggle selected location
      const updatedSelection = prev?.includes(location.toLowerCase())
        ? prev?.filter((item) => item !== location.toLowerCase()) // Remove location
        : [...(prev ?? []), location.toLowerCase()]; // Add location

      // Update the data based on the updated selection
      const filteredInfluencers =
        updatedSelection.length === 0 || updatedSelection.includes("world")
          ? influencersData // Reset if "world" or no location is selected
          : influencersData?.filter((influencer) =>
              updatedSelection.includes(
                influencer?.location?.toLowerCase() ?? ""
              )
            );

      // Update the influencers data state
      setInfluencerDataState(filteredInfluencers);

      return updatedSelection; // Update selected influencers state
    });
  };

  return (
    <Box
      display="flex"
      pb={4}
      alignItems="flex-start"
      flexDirection={{
        xs: "column",
        sm: "row",
      }}
    >
      <Grid container spacing={3} mx="auto" width="100%">
        {loading ? (
          <>
            {Array.from({ length: 6 }).map((_, index) => (
              <Grid item key={index} xs={12} sm={6} lg={4} xl={3}>
                <Skeleton variant="rectangular" height={200} />
              </Grid>
            ))}
          </>
        ) : influencersDataState && influencersDataState.length > 0 ? (
          influencersDataState
            .slice((page - 1) * 10, page * 10)
            .map((influencer) => (
              <Grid
                item
                key={influencer.id}
                xs={12}
                lg={6}
                xl={4}
                width={"100%"}
                px={2}
              >
                <InfluencerCard
                  address={influencer?.location ?? ""}
                  name={influencer?.username ?? ""}
                  occupation={influencer?.name ?? ""}
                  socialStats={getSocialStats(influencer)}
                  // tags={["Tech", "Software Developer", "Lagos"]}
                  image={influencer?.profile_image_url ?? ""}
                  bio={influencer?.bio}
                />
              </Grid>
            ))
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "80vh",
              width: "100%",
            }}
          >
            <EmptyState
              icon={<FaUser color={LightThemeColors.uriColor} size={40} />}
              message="No influencers found"
              actionRequired={false}
            />
          </Box>
        )}
        {!loading &&
          influencersDataState &&
          influencersDataState?.length > 0 && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                mt: 3,
              }}
            >
              <Pagination
                count={Math.ceil(influencersDataState?.length / 10)}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
                siblingCount={0}
                boundaryCount={1}
              />
            </Box>
          )}
      </Grid>
      <Box
        sx={{
          width: {
            xs: "100%",
            md: "40%",
          },
          borderRadius: 2,
          boxShadow: 2,
          height: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          alignItems: "start",
          border: "1px solid lightgray",
          justifyContent: "start",
        }}
      >
        <Box sx={{ display: "grid", width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              px: 2,
              py: 1,
            }}
          >
            <Typography variant="subtitle1"> FIlters</Typography>
            <Typography variant="caption" color="text.secondary">
              Total feeds:{" "}
              <Typography variant="caption" sx={{ fontWeight: 600 }}>
                {" "}
                {influencersData?.length}{" "}
              </Typography>
            </Typography>
          </Box>

          <Divider sx={{ border: "1px solid gray" }} />
          <Box sx={{ p: 2, pt: 1 }}>
            <Typography variant="caption"> Location </Typography>
            {(locations ?? ["World"]).map((platform, index) => (
              <Box key={index}>
                <Checkbox
                  key={index}
                  onChange={() => filterByLocation(platform ?? "")}
                  checked={selectedInfluencer?.includes(
                    (platform ?? "").toLowerCase()
                  )}
                />
                <Typography variant="caption">
                  {TextHelper.capitalize(platform)}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
        <Divider />
      </Box>
    </Box>
  );
};

export default InfluencerTab;
