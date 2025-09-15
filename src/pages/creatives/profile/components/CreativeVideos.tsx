import { Grid } from "@mui/material";
import VideoUploader from "../../../../components/creatives/VideoUploader";
import { CreativeProfileProps } from "@/types";
import EmptyProfileDetails from "@/components/creatives/EmptyProfileDetails";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/router";

const CreativeVideos = ({ creativeProfile }: CreativeProfileProps) => {
  const videos = [1, 2, 3, 4];
  const route = useRouter();
  const { id } = route.query;
  const { userDetails } = useAuth();

  return (
    <Grid
      container
      spacing={"25px"}
      sx={{ display: "flex", justifyContent: "center" }}
      mt={4}
    >
      {creativeProfile?.videos && creativeProfile?.videos.length > 0 ? (
        videos.map((video, index) => (
          <Grid item xs={12} md={6} key={video}>
            <VideoUploader creativeProfile={creativeProfile} index={index} />
          </Grid>
        ))
      ) : userDetails?.userId === id ? (
        videos.map((video, index) => (
          <Grid item xs={12} md={6} key={video}>
            <VideoUploader creativeProfile={creativeProfile} index={index} />
          </Grid>
        ))
      ) : (
        <EmptyProfileDetails
          header="No Videos"
          image="/assets/images/no-video.png"
          text="This creative is yet to add their videos. Stay tuned!"
          height={800}
          width={800}
        />
      )}
    </Grid>
  );
};

export default CreativeVideos;
