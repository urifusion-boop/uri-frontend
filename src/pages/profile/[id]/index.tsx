import Text from "@/components/atoms/CustomText";
import { Box, Grid } from "@mui/material";
import { bodySizes, eyeColors, skinColors } from "@/data/creatives";
import dayjs from "dayjs";
import SeoHead from "../../../components/atoms/SeoHead";
import { TextHelper } from "@/helpers/TextHelper";
import { useMyProfileHook } from "@/hooks/creatives/my-profile.hooks";
import { CreativeProfileDto } from "@/models/dtos/CreativeProfileDto";
import CreativeUserProfileHead from "@/pages/creatives/profile/components/CreativeUserProfileHead";
import SkeletonLoader from "@/components/loaders/SkeletonLoader";
import AddBio from "@/pages/creatives/profile/components/AddBio";
import CreativeVideos from "@/pages/creatives/profile/components/CreativeVideos";
import ProfileGallery from "@/pages/creatives/profile/components/ProfileGallery";
import CustomTabSelect from "@/components/atoms/CustomTabSelect";
import DashboardLayout from "@/components/atoms/DashboardLayout";
import EditCreativeProfile from "@/pages/creatives/profile/components/EditCreativeProfile";

const ProfilePage = () => {
  const {
    creativeProfile,
    activeTab,
    setActiveTab,
    editProfile,
    isLoading,
    tabButtons,
    setEditProfile,
  } = useMyProfileHook();

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
                creativeUserProfile={creativeProfile as CreativeProfileDto}
                buttonClick={() => setEditProfile(!editProfile)}
                buttonText={editProfile ? "View Profile" : "Edit Profile"}
              />
            </Box>

            {editProfile ? (
              <EditCreativeProfile
                onClick={() => setEditProfile(!editProfile)}
              />
            ) : (
              <Box sx={{ padding: "0px 30px" }}>
                <Grid container spacing={5}>
                  <Grid item xs={12} sm={5}>
                    <AddBio
                      creativeProfile={
                        creativeProfile as CreativeProfileDto | null
                      }
                    />
                    <Box
                      sx={{
                        backgroundColor: `#FFF8FC`,
                        borderRadius: "8px",
                        padding: "25px",
                      }}
                      mb={3}
                      maxWidth={"600px"}
                      marginLeft={"auto"}
                    >
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <Text size={16} weight={500}>
                            Height
                          </Text>
                          <Text size={16} weight={700}>
                            {creativeProfile?.bodyFeature?.height}
                          </Text>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Text size={16} weight={500}>
                            Body Size
                          </Text>
                          <Text size={16} weight={700}>
                            {
                              bodySizes.find(
                                (size) =>
                                  size.value ===
                                  creativeProfile?.bodyFeature?.bodySize
                              )?.label
                            }
                          </Text>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Text size={16} weight={500}>
                            Eye Color
                          </Text>
                          <Text size={16} weight={700}>
                            {
                              eyeColors.find(
                                (color) =>
                                  color.value ===
                                  creativeProfile?.bodyFeature?.eyeColor
                              )?.label
                            }
                          </Text>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Text size={16} weight={500}>
                            Skin Color
                          </Text>
                          <Text size={16} weight={700}>
                            {
                              skinColors.find(
                                (color) =>
                                  color.value ===
                                  creativeProfile?.bodyFeature?.skinColor
                              )?.label
                            }
                          </Text>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Text size={16} weight={500}>
                            Age
                          </Text>
                          <Text size={16} weight={700}>
                            {dayjs().diff(
                              dayjs(creativeProfile?.dateOfBirth),
                              "year"
                            )}
                          </Text>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <Text size={16} weight={500}>
                            Gender
                          </Text>
                          <Text size={16} weight={700}>
                            {TextHelper.capitalize(creativeProfile?.gender)}
                          </Text>
                        </Grid>
                        <Grid item xs={12} sm={12}>
                          <Text size={16} weight={500}>
                            Languages
                          </Text>
                          <Text size={16} weight={700}>
                            {languageList || "None"}
                          </Text>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={7}>
                    <Box>
                      <CustomTabSelect
                        active={activeTab}
                        buttons={tabButtons}
                        onClick={(value) => setActiveTab(value)}
                        isMobile
                      />
                      {activeTab === "pictures" && (
                        <ProfileGallery
                          creativeProfile={
                            creativeProfile as CreativeProfileDto | null
                          }
                        />
                      )}
                      {activeTab === "videos" && (
                        <CreativeVideos
                          creativeProfile={
                            creativeProfile as CreativeProfileDto | null
                          }
                        />
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Box>
        )}
      </DashboardLayout>
    </>
  );
};

export default ProfilePage;
