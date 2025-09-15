import { Grid } from "@mui/material";
import VideoUpload from "./VideoUpload";
import { ClientProfileProps } from "@/types";
import EmptyProfileDetails from "@/components/creatives/EmptyProfileDetails";
import { useAuth } from "@/providers/AuthProvider";
import { useRouter } from "next/router";

const ClientVideos = ({ clientProfile }: ClientProfileProps) => {
  const videos = [1, 2, 3];
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
      {clientProfile.videos && clientProfile.videos?.length > 0 ? (
        videos.map((video, index) => (
          <Grid item xs={12} md={4} key={video}>
            <VideoUpload clientProfile={clientProfile} index={index} />
          </Grid>
        ))
      ) : userDetails?.userId === id ? (
        videos.map((video, index) => (
          <Grid item xs={12} md={4} key={video}>
            <VideoUpload clientProfile={clientProfile} index={index} />
          </Grid>
        ))
      ) : (
        <EmptyProfileDetails
          header="No Videos"
          image="/assets/images/no-video.png"
          text="This client is yet to add their videos. Stay tuned!"
          height={800}
          width={800}
        />
      )}
    </Grid>
  );
};

export default ClientVideos;
