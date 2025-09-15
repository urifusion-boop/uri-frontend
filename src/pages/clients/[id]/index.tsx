import { Box } from "@mui/material";
import { useProfileHook } from "@/hooks/clients/profilePage.hook";
import SkeletonLoader from "@/components/loaders/SkeletonLoader";
import SeoHead from "../../../components/atoms/SeoHead";
import CustomTabSelect from "@/components/atoms/CustomTabSelect";
import DashboardLayout from "@/components/atoms/DashboardLayout";
import BusinessDetails from "../../../components/clients/BusinessDetails";
import ClientUserProfileHead from "../../../components/profile/ClientUserProfileHead";
import EditProfile from "../../../components/profile/EditProfile";
import Photos from "../../../components/profile/ClientPhotos";
import ClientVideos from "../../../components/profile/ClientVideos";

const ProfilePage = () => {
  const {
    editProfile,
    setEditProfile,
    clientProfile,
    isLoading,
    setActiveTab,
    activeTab,
    tabButtons,
  } = useProfileHook();

  return (
    <>
      <SeoHead title="Profile" />
      <DashboardLayout>
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <Box sx={{ paddingBottom: "100px" }}>
            <ClientUserProfileHead
              clientUserProfile={clientProfile!}
              buttonClick={() => setEditProfile(!editProfile)}
              buttonText={editProfile ? "View Profile" : "Edit Profile"}
            />

            {editProfile ? (
              <EditProfile
                onClick={() => setEditProfile(false)}
                profile={clientProfile!}
              />
            ) : (
              <Box
                sx={{ padding: "0px 20px" }}
                maxWidth={"1200px"}
                m={"0 auto"}
              >
                <Box>
                  <CustomTabSelect
                    active={activeTab}
                    buttons={tabButtons}
                    onClick={(value) => setActiveTab(value)}
                    isMobile
                    isCenter
                  />
                  {activeTab === "business details" && (
                    <BusinessDetails clientProfile={clientProfile!} />
                  )}
                  {activeTab === "photos" && (
                    <Photos clientProfile={clientProfile!} />
                  )}
                  {activeTab === "videos" && (
                    <ClientVideos clientProfile={clientProfile!} />
                  )}
                </Box>
              </Box>
            )}
          </Box>
        )}
      </DashboardLayout>
    </>
  );
};

export default ProfilePage;
