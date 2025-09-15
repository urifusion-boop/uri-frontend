import CustomText from "@/components/atoms/CustomText";
import useCustomTheme from "@/hooks/theme.hook";
import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import { BiSolidEdit } from "react-icons/bi";
import CustomModal from "../../../../components/modals/CustomModal";
import CustomButton from "@/components/atoms/CustomButton";
import { CreativeProfileService } from "@/api/CreativeProfileService";
import { useAuth } from "@/providers/AuthProvider";
import toast from "react-hot-toast";
import Spinner from "@/components/loaders/Spinner";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreativeProfileDto } from "@/models/dtos/CreativeProfileDto";
import { QueryKeyEnum } from "@/models/enum-models/QueryKeyEnum";
import { TextHelper } from "../../../../helpers/TextHelper";

interface AddBioProps {
  creativeProfile: CreativeProfileDto | null;
}

const AddBio = ({ creativeProfile }: AddBioProps) => {
  const queryClient = useQueryClient();
  const { themeColors } = useCustomTheme();
  const [openModal, setOpenModal] = useState(false);
  const [bio, setBio] = useState(creativeProfile?.bio || "");
  const { userProfile, saveCreativeUserProfile } = useAuth();
  const route = useRouter();
  const { id } = route.query;

  const addBio = useMutation({
    mutationFn: async () => {
      await CreativeProfileService.updateProfileApi({
        ...creativeProfile,
        bio: bio,
      })
        .then((res) => saveCreativeUserProfile(res.responseData!))
        .catch((res) => console.log(res))
        .finally(() => {
          setOpenModal(false);
        });
    },
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeyEnum.CREATIVE_PROFILE]);
      toast.success("Bio Updated");
    },
  });

  return (
    <>
      {userProfile.userId === id ? (
        userProfile.bio && userProfile.bio.length > 0 ? (
          <>
            <Box
              sx={{
                backgroundColor: `#FFF8FC`,
                borderRadius: "8px",
                padding: "15px",
              }}
              mb={3}
              maxWidth={"600px"}
              marginLeft={"auto"}
            >
              <Box className="d-flex" sx={{ justifyContent: "space-between" }}>
                <CustomText size={16} weight={600} color={themeColors.primary}>
                  About Me
                </CustomText>

                <BiSolidEdit
                  onClick={() => setOpenModal(true)}
                  style={{
                    width: "24px",
                    height: "24px",
                    marginLeft: "auto",
                    color: themeColors.primary,
                    cursor: "pointer",
                  }}
                />
              </Box>
              <Box mt={"25px"}>
                <CustomText
                  size={16}
                  weight={600}
                  color={themeColors.blackWhite}
                  sx={{ overflow: "hidden", wordBreak: "break-word" }}
                >
                  {creativeProfile?.bio}
                </CustomText>
              </Box>
            </Box>
          </>
        ) : (
          <>
            <Box
              sx={{
                backgroundColor: `#FFF8FC`,
                borderRadius: "8px",
                padding: "15px",
              }}
              mb={3}
              maxWidth={"600px"}
              marginLeft={"auto"}
            >
              <Box className="d-flex" sx={{ justifyContent: "space-between" }}>
                <CustomText size={14} weight={600} color={themeColors.primary}>
                  Add bio to complete profile
                </CustomText>

                <BiSolidEdit
                  onClick={() => setOpenModal(true)}
                  style={{
                    width: "24px",
                    height: "24px",
                    marginLeft: "auto",
                    color: themeColors.primary,
                    cursor: "pointer",
                  }}
                />
              </Box>
            </Box>
          </>
        )
      ) : creativeProfile &&
        creativeProfile.bio &&
        creativeProfile.bio.length > 0 ? (
        <Box
          sx={{
            backgroundColor: `#FFF8FC`,
            borderRadius: "8px",
            padding: "15px",
          }}
          mb={3}
          maxWidth={"600px"}
          marginLeft={"auto"}
        >
          <Box
            className="d-flex"
            sx={{ justifyContent: "space-between" }}
            maxWidth={"600px"}
            marginLeft={"auto"}
          >
            <CustomText size={16} weight={600} color={themeColors.primary}>
              About Me
            </CustomText>
          </Box>
          <Box mt={"10px"}>
            <CustomText size={16} weight={600} color={themeColors.blackWhite}>
              {creativeProfile.bio}
            </CustomText>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            backgroundColor: `#FFF8FC`,
            borderRadius: "8px",
            padding: "15px",
          }}
          mb={3}
          maxWidth={"600px"}
          marginLeft={"auto"}
        >
          <Box className="d-flex" sx={{ justifyContent: "space-between" }}>
            <CustomText size={16} weight={600} color={themeColors.primary}>
              {`This creative doesn't have a bio`}
            </CustomText>
          </Box>
        </Box>
      )}
      <CustomModal
        open={openModal}
        closeOnOverlayClick
        closeModal={() => setOpenModal(false)}
        maxWidth="733px"
        width="733px"
        showCloseIcon
      >
        <Box padding={"40px"}>
          <Typography fontSize={24} fontWeight={700} color={"#141416"}>
            Add your bio
          </Typography>
          <textarea
            maxLength={200}
            required
            style={{
              width: "100%",
              minHeight: "173px",
              maxHeight: "173px",
              margin: "20px 0 0px",
              border: "1px solid #E0DEF7",
              borderRadius: "5px",
              outline: "1px solid #E0DEF7",
              padding: "18px",
              background: themeColors.background,
            }}
            placeholder="Not more than 500 characters."
            onChange={(e) => {
              setBio(
                String(e.target.value).trim().length <= 500 &&
                  !TextHelper.containsNumber(e.target.value)
                  ? e.target.value
                  : bio
              );
            }}
            value={bio}
          ></textarea>
          {TextHelper.containsPhoneNumber(bio) ||
          TextHelper.containsEmail(bio) ? (
            <CustomText size={12} weight={400} color="red">
              No display of personal contact details is allowed.
            </CustomText>
          ) : null}
          <CustomButton
            mode="primary"
            style={{ width: "253px", marginTop: "30px" }}
            onClick={() => addBio.mutate()}
            disabled={
              addBio.isLoading ||
              TextHelper.containsPhoneNumber(bio) ||
              TextHelper.containsEmail(bio)
            }
          >
            {addBio.isLoading ? <Spinner color={"#fff"} /> : "Done"}
          </CustomButton>
        </Box>
      </CustomModal>
    </>
  );
};

export default AddBio;
