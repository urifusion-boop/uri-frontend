import CustomText from "@/components/atoms/CustomText";
import useCustomTheme from "@/hooks/theme.hook";
import { Box, Typography, useMediaQuery } from "@mui/material";
import React, { useState } from "react";
import { BiSolidEdit } from "react-icons/bi";
import CustomModal from "../modals/CustomModal";
import CustomButton from "@/components/atoms/CustomButton";
import { useAuth } from "@/providers/AuthProvider";
import toast from "react-hot-toast";
import Spinner from "@/components/loaders/Spinner";
import { useRouter } from "next/router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ClientProfileService } from "@/api/ClientProfileService";
import { ClientProfileDto } from "@/models/dtos/ClientProfileDto";
import { QueryKeyEnum } from "@/models/enum-models/QueryKeyEnum";
import { TextHelper } from "../../helpers/TextHelper";

interface BusinessDetailsProps {
  clientProfile: ClientProfileDto;
}

const AddSummary = ({ clientProfile }: BusinessDetailsProps) => {
  const queryClient = useQueryClient();
  const { themeColors } = useCustomTheme();
  const [openModal, setOpenModal] = useState(false);
  const { userProfile, saveClientUserProfile } = useAuth();
  const [bio, setBio] = useState(userProfile.bio ?? "");
  const matches = useMediaQuery("(max-width: 500px)");
  const route = useRouter();
  const { id } = route.query;

  const addBio = useMutation({
    mutationFn: async () => {
      const response = await ClientProfileService.updateProfileApi({
        ...clientProfile,
        bio: bio,
      });

      if (response.status) {
        saveClientUserProfile({
          ...clientProfile,
          bio,
        });
        toast.success("Bio Updated");

        setOpenModal(false);
        queryClient.invalidateQueries([QueryKeyEnum.CLIENT_PROFILE]);
      } else {
        toast.error(response.responseMessage);
      }
    },
  });

  return (
    <>
      {userProfile.userId === id ? (
        clientProfile?.bio && clientProfile?.bio.length > 0 ? (
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
                  Profile summary
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
                  size={matches ? 14 : 16}
                  weight={600}
                  color={themeColors.blackWhite}
                >
                  {clientProfile?.bio}
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
                <CustomText size={16} weight={600} color={themeColors.primary}>
                  Add your profile summary now.
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
      ) : clientProfile && clientProfile.bio && clientProfile.bio.length > 0 ? (
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
              Profile summary
            </CustomText>
          </Box>
          <Box mt={"10px"}>
            <CustomText
              size={matches ? 14 : 16}
              weight={600}
              color={themeColors.blackWhite}
            >
              {clientProfile.bio}
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
              {`This client doesn't have a summary yet.`}
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
            Add your profile summary now.
          </Typography>
          <textarea
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
            value={bio}
            placeholder="Not more than 300 characters."
            onChange={(e) => {
              setBio(
                String(e.target.value).trim().length <= 500
                  ? e.target.value
                  : bio
              );
            }}
            maxLength={300}
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
            {addBio.isLoading ? (
              <Spinner color={themeColors.secondary} />
            ) : (
              "Done"
            )}
          </CustomButton>
        </Box>
      </CustomModal>
    </>
  );
};

export default AddSummary;
