import Text from "@/components/atoms/CustomText";
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

interface AddWorkDetailsProps {
  clientProfile: ClientProfileDto;
}

const AddWorkDetails = ({ clientProfile }: AddWorkDetailsProps) => {
  const queryClient = useQueryClient();
  const { themeColors } = useCustomTheme();
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { userProfile, saveClientUserProfile } = useAuth();
  const [bio, setBio] = useState(userProfile.specialDetails ?? "");
  const matches = useMediaQuery("(max-width: 500px)");
  const route = useRouter();
  const { id } = route.query;

  const addBio = useMutation({
    mutationFn: async () => {
      setLoading(true);
      await ClientProfileService.updateProfileApi({
        ...clientProfile,
        specialDetails: bio,
      })
        .catch((res) => console.log(res))
        .finally(() => {
          setLoading(false);
          setOpenModal(false);
        });
    },
    onSuccess: () => {
      queryClient.invalidateQueries([QueryKeyEnum.CLIENT_PROFILE]);
      toast.success("Bio Updated");
      saveClientUserProfile({ ...userProfile, specialDetails: bio });
      setLoading(false);
    },
  });

  return (
    <>
      {userProfile.userId === id ? (
        clientProfile?.specialDetails &&
        clientProfile?.specialDetails.length > 0 ? (
          <>
            <Box
              sx={{
                backgroundColor: `#FFF8FC`,
                borderRadius: "8px",
              }}
            >
              <Box
                className="d-flex"
                sx={{ justifyContent: "space-between !important" }}
              >
                <Text size={16} weight={600} color={themeColors.primary}>
                  Why work with us?
                </Text>

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
              <Box mt={2}>
                <Text
                  size={matches ? 14 : 16}
                  weight={600}
                  color={themeColors.blackWhite}
                  sx={{ wordBreak: "break-all" }}
                >
                  {clientProfile?.specialDetails}
                </Text>
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
              marginLeft={"auto"}
            >
              <Box
                className="d-flex"
                sx={{ justifyContent: "space-between !important" }}
              >
                <Text size={16} weight={600} color={themeColors.primary}>
                  Why work with us?
                </Text>

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
      ) : clientProfile &&
        clientProfile.specialDetails &&
        clientProfile.specialDetails.length > 0 ? (
        <Box mb={3}>
          <Box marginLeft={"auto"}>
            <Text size={16} weight={600} color={themeColors.primary}>
              Why work with us?
            </Text>
          </Box>
          <Box mt={"10px"}>
            <Text
              size={matches ? 14 : 16}
              weight={600}
              color={themeColors.blackWhite}
              sx={{ wordBreak: "break-all" }}
            >
              {clientProfile.specialDetails}
            </Text>
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
            <Text size={16} weight={600} color={themeColors.primary}>
              {`This client doesn't have a work summary yet`}
            </Text>
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
            Why work with us?
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
            placeholder="Not more than 500 characters."
            onChange={(e) => {
              setBio(
                String(e.target.value).trim().length <= 500
                  ? e.target.value
                  : bio
              );
            }}
            maxLength={500}
          ></textarea>
          {TextHelper.containsPhoneNumber(bio) ||
          TextHelper.containsEmail(bio) ? (
            <Text size={12} weight={400} color="red">
              No display of personal contact details is allowed.
            </Text>
          ) : null}
          <CustomButton
            mode="primary"
            style={{ width: "253px", marginTop: "30px" }}
            onClick={() => addBio.mutate()}
            disabled={
              loading ||
              TextHelper.containsPhoneNumber(bio) ||
              TextHelper.containsEmail(bio)
            }
          >
            {loading ? <Spinner color={themeColors.secondary} /> : "Done"}
          </CustomButton>
        </Box>
      </CustomModal>
    </>
  );
};

export default AddWorkDetails;
