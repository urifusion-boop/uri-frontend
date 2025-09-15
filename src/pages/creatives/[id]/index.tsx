import Text from "@/components/atoms/CustomText";
import { Box, Grid } from "@mui/material";
import { useProfileHook } from "@/hooks/creatives/profilePage.hook";
import SkeletonLoader from "@/components/loaders/SkeletonLoader";
import dayjs from "dayjs";
import SeoHead from "../../../components/atoms/SeoHead";
import { TextHelper } from "@/helpers/TextHelper";
import { useState } from "react";
import CreativeUserProfileHead from "@/pages/creatives/profile/components/CreativeUserProfileHead";
import AddBio from "@/pages/creatives/profile/components/AddBio";
import DashboardLayout from "@/components/atoms/DashboardLayout";

const ProfilePage = () => {
  const [editProfile, setEditProfile] = useState(false);

  const { creativeProfile, isLoading } = useProfileHook();

  const languageList = creativeProfile?.languages
    ?.map((lang) => TextHelper.capitalize(lang.language))
    .join(", ");

  return (
    <>
      <SeoHead
        title={`${creativeProfile?.user?.firstName ?? ""} ${
          creativeProfile?.user?.lastName ?? ""
        }`}
      />

      <DashboardLayout>
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <Box sx={{ paddingBottom: "100px" }}>
            <Box mb={"50px"}>
              <CreativeUserProfileHead
                creativeUserProfile={creativeProfile!}
                buttonClick={() => setEditProfile(!editProfile)}
                buttonText={editProfile ? "View Profile" : "Edit Profile"}
              />
            </Box>

            <Box sx={{ padding: "0px 30px" }}>
              <Grid container spacing={5}>
                <Grid item xs={12} sm={5}>
                  <AddBio creativeProfile={creativeProfile!} />

                  <Box maxWidth={"600px"} marginLeft={"auto"}>
                    <Box
                      sx={{
                        backgroundColor: `#FFF8FC`,
                        borderRadius: "8px",
                        padding: "25px",
                      }}
                      mb={3}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                          <Text size={16} weight={500}>
                            Height
                          </Text>
                          <Text size={16} weight={700}>
                            {creativeProfile?.bodyFeature?.height ?? ""}
                          </Text>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Text size={16} weight={500}>
                            Body Size
                          </Text>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Text size={16} weight={500}>
                            Eye Color
                          </Text>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Text size={16} weight={500}>
                            Skin Color
                          </Text>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Text size={16} weight={500}>
                            Age
                          </Text>
                          <Text size={16} weight={700}>
                            {dayjs().diff(
                              dayjs(creativeProfile?.dateOfBirth ?? ""),
                              "year"
                            )}
                          </Text>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Text size={16} weight={500}>
                            Gender
                          </Text>
                          <Text size={16} weight={700}>
                            {TextHelper.capitalize(
                              creativeProfile?.gender ?? ""
                            )}
                          </Text>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Text size={16} weight={500}>
                            Languages
                          </Text>
                          <Text size={16} weight={700}>
                            {languageList ?? "None"}
                          </Text>
                        </Grid>
                      </Grid>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}
      </DashboardLayout>
    </>
  );
};

export default ProfilePage;
