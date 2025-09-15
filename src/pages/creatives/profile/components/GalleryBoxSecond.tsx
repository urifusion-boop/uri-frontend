import { Box } from "@mui/material";
import { CreativeProfileDto } from "@/models/dtos/CreativeProfileDto";
import { TextHelper } from "../../../../helpers/TextHelper";
import { AdminProfileService } from "../../../../api/admin/AdminProfileService";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { MdDeleteOutline } from "react-icons/md";
import CustomModal from "../../../../components/modals/CustomModal";
import CustomButton from "../../../../components/atoms/CustomButton";
import Spinner from "../../../../components/loaders/Spinner";
import Text from "../../../../components/atoms/CustomText";
import useCustomTheme from "../../../../hooks/theme.hook";
import { useAuth } from "../../../../providers/AuthProvider";
import { UserRoleEnum } from "../../../../models/enum-models/UserRoleEnums";

interface IGalleryBox {
  item: {
    name: string;
    height: number;
  };
  index: number;
  creativeProfile: CreativeProfileDto;
  onClick: (imageUrl: string) => void; // Add onClick prop
}

const GalleryBoxSecond = ({
  item,
  index,
  creativeProfile,
  onClick,
}: IGalleryBox) => {
  const [imageUrl, setImageUrl] = useState(
    creativeProfile?.images![index].url ?? ""
  );
  const [adminDeletionReason, setAdminDeletionReason] = useState("");
  const [adminDeleteImageModal, setAdminDeleteImageModal] = useState(false);

  const { themeColors } = useCustomTheme();
  const { userDetails } = useAuth();

  const handleImageClick = () => {
    const url = creativeProfile?.images![index].url || "";
    if (url) {
      onClick(url);
    }
  };

  const adminDeleteImage = useMutation({
    mutationFn: async () => {
      const result = await AdminProfileService.deleteCreativeProfileDoc({
        url: imageUrl,
        deletionReason: adminDeletionReason,
      });
      if (result.status) {
        if (result.responseData?.images) {
          setImageUrl(result.responseData?.images[index].url);
        }
      }
      setAdminDeletionReason("");
      setAdminDeleteImageModal(false);
    },
    onSuccess: () => {
      // queryClient.invalidateQueries([QueryKeyEnum.CREATIVE_PROFILE]);
      toast.success("Deleted Image");
    },
  });

  return (
    <>
      {creativeProfile &&
        creativeProfile?.images &&
        creativeProfile?.images[index] &&
        creativeProfile?.images[index].docName !== "test" && (
          <Box
            gridArea={item.name}
            sx={{ width: "100%", height: item.height }}
            position={"relative"}
            borderRadius={"10px"}
            overflow={"hidden"}
            display={"grid"}
            onClick={handleImageClick} // Set up the click handler here
          >
            {/* <Image
              src={TextHelper.setUrl(creativeProfile?.images[index]?.url || "")}
              alt={creativeProfile.user?.firstName || ""}
              fill
              objectFit="cover"
            /> */}

            <img
              src={TextHelper.setUrl(imageUrl || "")}
              alt={creativeProfile.user?.firstName || ""}
              loading="lazy"
              width="100%"
              height={item.height}
              style={{
                objectFit: "cover",
              }}
            />

            {userDetails?.role === UserRoleEnum.ADMIN && imageUrl && (
              <Box
                style={{
                  width: "30px",
                  height: "30px",
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  borderRadius: "20px",
                  backgroundColor: "whitesmoke",
                  cursor: "pointer",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setAdminDeleteImageModal(true);
                }}
              >
                <MdDeleteOutline
                  style={{
                    width: "20px",
                    height: "20px",
                    color: themeColors.primary,
                    margin: "5px",
                  }}
                />
              </Box>
            )}
          </Box>
        )}

      <CustomModal
        open={adminDeleteImageModal}
        showCloseIcon
        width="600px"
        setOpen={setAdminDeleteImageModal}
        bgColor="#fff"
      >
        <Box
          sx={{
            padding: "10px 20px",
          }}
        >
          <Text size={22} weight={500} sx={{ mb: 1 }}>
            Delete Creative Image
          </Text>
          <Text size={13} weight={500}>
            Add a reason for deleting this file.
          </Text>
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
            placeholder="Not more than 50 characters."
            onChange={(e) => {
              setAdminDeletionReason(
                String(e.target.value).trim().length <= 50
                  ? e.target.value
                  : adminDeletionReason
              );
            }}
            value={adminDeletionReason}
          ></textarea>
          <CustomButton
            mode="primary"
            style={{ width: "253px", marginTop: "30px" }}
            onClick={() => adminDeleteImage.mutate()}
            disabled={adminDeleteImage.isLoading}
          >
            {adminDeleteImage.isLoading ? <Spinner color={"#fff"} /> : "Done"}
          </CustomButton>
        </Box>
      </CustomModal>
    </>
  );
};

export default GalleryBoxSecond;
