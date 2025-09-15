import { Grid } from "@mui/material";
import ImageUploader from "../atoms/ImageUploader";
import { ClientProfileProps } from "@/types";
import EmptyProfileDetails from "@/components/creatives/EmptyProfileDetails";
import { useRouter } from "next/router";
import { useAuth } from "@/providers/AuthProvider";

const ClientPhotos = ({ clientProfile }: ClientProfileProps) => {
  const images = [1, 2, 3];
  const route = useRouter();
  const { id } = route.query;
  const { userDetails } = useAuth();

  return (
    <Grid
      container
      spacing={"25px"}
      sx={{ display: "flex", justifyContent: "center" }}
    >
      {clientProfile.images && clientProfile.images.length > 0 ? (
        images.map((image, index) => (
          <Grid item xs={12} md={4} key={image}>
            <ImageUploader clientProfile={clientProfile} index={index} />
          </Grid>
        ))
      ) : userDetails?.userId === id ? (
        images.map((image, index) => (
          <Grid item xs={12} md={4} key={image}>
            <ImageUploader clientProfile={clientProfile} index={index} />
          </Grid>
        ))
      ) : (
        <EmptyProfileDetails
          header="No Pictures"
          image="/assets/images/camera.png"
          text="This client is yet to add their pictures. Stay tuned!"
          height={800}
          width={800}
        />
      )}
    </Grid>
  );
};

export default ClientPhotos;
