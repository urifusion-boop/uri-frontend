import { ChangeEvent, useRef, useState } from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import Text from "../../../../components/atoms/CustomText";
import useCustomTheme from "../../../../hooks/theme.hook";
import CustomButton from "../../../../components/atoms/CustomButton";
import { useAuth } from "../../../../providers/AuthProvider";
import { BiSolidEdit } from "react-icons/bi";
import Spinner from "../../../../components/loaders/Spinner";
import { CreativeProfileDto } from "@/models/dtos/CreativeProfileDto";
import { useRouter } from "next/router";
import { FiEdit } from "react-icons/fi";
import { TextHelper } from "@/helpers/TextHelper";
import { useMutation } from "@tanstack/react-query";
import { ImageUpload } from "@/helpers/ImageUpload";
import ImageModal from "../../../../components/modals/ImageModal";
import toast from "react-hot-toast";
import { UserRoleEnum } from "../../../../models/enum-models/UserRoleEnums";
import CustomModal from "../../../../components/modals/CustomModal";
import { MdOutlineDelete } from "react-icons/md";
import { AdminProfileService } from "../../../../api/admin/AdminProfileService";
import ImageProcessing from "../../../../components/atoms/ImageProcessing";
interface IProps {
  creativeUserProfile: CreativeProfileDto;
  buttonClick: () => void;
  buttonText: string;
}

const MIN_DIMENSION = 250;

const CreativeUserProfileHead: React.FC<IProps> = ({
  creativeUserProfile,
  buttonClick,
  buttonText,
}) => {
  const { themeColors } = useCustomTheme();
  const { userDetails, saveCreativeUserProfile } = useAuth();
  const router = useRouter();
  const matches = useMediaQuery("(max-width: 500px)");
  const matches2 = useMediaQuery("(max-width: 900px)");

  const [loading, setLoading] = useState(false);
  const [headshotLoading, setHeadshotLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [openCropModal, setOpenCropModal] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>();
  const [adminDeletionReason, setAdminDeletionReason] = useState("");
  const [adminDeleteCoverModal, setAdminDeleteCoverModal] = useState(false);
  const [adminDeleteHeadshotModal, setAdminDeleteHeadshotModal] =
    useState(false);

  const inputHeadShotRef = useRef<any>(null);
  const inputCoverRef = useRef<HTMLInputElement>(null);

  const handleCloseModal = () => {
    setIsModalOpen(false); // Close the modal
  };

  const onSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    let img = new Image();
    img.src = window.URL.createObjectURL(file);

    img.onload = () => {
      if (img.width < MIN_DIMENSION || img.height < MIN_DIMENSION) {
        toast.error("Image must be at least 250 x 250 pixels.");
        return;
      }

      setImageSrc(img.src);
      setOpenCropModal(true);
    };

    e.target.value = "";
  };

  const adminDeleteCover = useMutation({
    mutationFn: async () => {
      const result = await AdminProfileService.deleteCreativeProfileDoc({
        url: creativeUserProfile?.coverImage?.url,
        deletionReason: adminDeletionReason,
      });
      if (result.status) {
        if (result.responseData?.coverImage)
          creativeUserProfile.coverImage = result.responseData?.coverImage;
      }
      setAdminDeletionReason("");
      setAdminDeleteCoverModal(false);
    },
    onSuccess: () => {
      toast.success("Deleted Cover Image");
    },
  });

  const adminDeleteHeadshot = useMutation({
    mutationFn: async () => {
      const result = await AdminProfileService.deleteCreativeProfileDoc({
        url: creativeUserProfile?.headshot?.url,
        deletionReason: adminDeletionReason,
      });
      if (result.status) {
        if (result.responseData?.headshot)
          creativeUserProfile.headshot = result.responseData?.headshot;
      }
      setAdminDeletionReason("");
      setAdminDeleteHeadshotModal(false);
    },
    onSuccess: () => {
      toast.success("Deleted Headshot");
    },
  });

  return (
    <>
      <Box
        sx={{
          height: "300px",
          padding: matches ? "0" : "0 30px",
        }}
      >
        <Box
          sx={{
            backgroundImage: `url('${
              creativeUserProfile?.coverImage?.url
                ? TextHelper.setUrl(creativeUserProfile.coverImage?.url)
                : "/assets/images/bg.jpg"
            }')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "200px",
            position: "relative",
          }}
        >
          <Box
            onClick={() => router.back()}
            position={"absolute"}
            className="pointer"
            width={20}
            height={20}
            top={"20px"}
            left={"20px"}
          >
            <img
              src="/assets/icons/left-caret-icon.svg"
              alt="image"
              width={25}
              height={25}
              style={{
                backgroundColor: "#fff",
                borderRadius: "100%",
              }}
            />
          </Box>
          {creativeUserProfile?.userId === userDetails?.userId && (
            <Box
              style={{
                position: "absolute",
                right: "20px",
                top: "20px",
                backgroundColor: themeColors.surface,
                height: "30px",
                width: "30px",
                borderRadius: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {loading ? (
                <Spinner color={themeColors.primary} />
              ) : (
                <>
                  <BiSolidEdit
                    style={{ color: themeColors.primary, cursor: "pointer" }}
                    size={20}
                    onClick={() => inputCoverRef.current?.click()}
                  />
                  <input
                    style={{ display: "none" }}
                    ref={inputCoverRef}
                    type="file"
                    accept=".png,.jpg,.jpeg"
                    onChange={(e) =>
                      ImageUpload.creativeHeaderUpload(
                        e,
                        setLoading,
                        creativeUserProfile,
                        "coverImage"
                      )
                    }
                  />
                </>
              )}
            </Box>
          )}

          {userDetails?.role === UserRoleEnum.ADMIN &&
            creativeUserProfile?.coverImage?.url && (
              <Box
                style={{
                  position: "absolute",
                  right: "20px",
                  top: "20px",
                  backgroundColor: themeColors.surface,
                  height: "30px",
                  width: "30px",
                  borderRadius: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {loading ? (
                  <Spinner color={themeColors.primary} />
                ) : (
                  <>
                    <MdOutlineDelete
                      style={{ color: themeColors.primary, cursor: "pointer" }}
                      size={20}
                      onClick={() => setAdminDeleteCoverModal(true)}
                    />
                  </>
                )}
              </Box>
            )}

          <Box
            sx={{
              backgroundColor: themeColors.surface,
              width: matches2 ? "90%" : "80%",
              height: "fit-content",
              borderRadius: "8px",
              position: "absolute",
              top: matches2 ? "80px" : "120px",
              left: "50%",
              translate: "-50% 0px",
              padding: matches ? "20px" : "20px 50px",
              border: `2px solid ${themeColors.borderColor}`,
              maxWidth: "2400px",
            }}
            display={"flex"}
            flexDirection={matches2 ? "column" : "row"}
            justifyContent={"space-between"}
            gap={"20px"}
          >
            <Box display={"flex"} gap={"20px"} alignItems={"center"}>
              <Box
                sx={{
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: "100%",
                  position: "relative",
                  bgcolor: "#e8e8e8",
                  width: matches ? "90px" : "100px",
                  height: matches ? "90px" : "100px",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: "100%",
                    borderRadius: "100%",
                    overflow: "hidden",
                    cursor: "pointer",
                    backgroundColor: "#e8e8e8",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {creativeUserProfile?.headshot?.url ? (
                    <img
                      src={TextHelper.setUrl(
                        creativeUserProfile?.headshot?.url
                      )}
                      alt={creativeUserProfile?.user?.firstName}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <Typography
                      fontSize={24}
                      fontWeight={"700"}
                      color={"#141416"}
                    >
                      {creativeUserProfile?.user?.firstName
                        ?.charAt(0)
                        .toUpperCase()}
                      {creativeUserProfile?.user?.lastName
                        ?.charAt(0)
                        .toUpperCase()}
                    </Typography>
                  )}
                </Box>
                {creativeUserProfile?.userId === userDetails?.userId && (
                  <>
                    <Box
                      sx={{
                        width: "25px",
                        height: "25px",
                        backgroundColor: "#58C27D",
                        borderRadius: "25px",
                        position: "absolute",
                        bottom: "10px",
                        right: "0px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      // onClick={(e) => {
                      //   e.stopPropagation();
                      //   setOpen(true);
                      // }}
                      onClick={(e) => {
                        e.stopPropagation();
                        inputHeadShotRef.current?.click();
                      }}
                    >
                      {headshotLoading ? (
                        <Spinner color="#fff" />
                      ) : (
                        <Box>
                          <FiEdit
                            style={{
                              color: "white",
                              width: "11px",
                              height: "11px",
                              margin: "0px 7px",
                            }}
                          />
                          <input
                            style={{ display: "none" }}
                            ref={inputHeadShotRef}
                            type="file"
                            accept=".png,.jpg,.jpeg"
                            onChange={(e) => onSelectFile(e)}
                          />
                        </Box>
                      )}
                    </Box>
                  </>
                )}

                {userDetails?.role === UserRoleEnum.ADMIN &&
                  creativeUserProfile?.headshot?.url && (
                    <>
                      <Box
                        sx={{
                          width: "25px",
                          height: "25px",
                          backgroundColor: "#58C27D",
                          borderRadius: "25px",
                          position: "absolute",
                          bottom: "10px",
                          right: "0px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                        // onClick={(e) => {
                        //   e.stopPropagation();
                        //   setOpen(true);
                        // }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setAdminDeleteHeadshotModal(true);
                        }}
                      >
                        {headshotLoading ? (
                          <Spinner color="#fff" />
                        ) : (
                          <Box>
                            <MdOutlineDelete
                              style={{
                                color: "white",
                                width: "11px",
                                height: "11px",
                                margin: "0px 7px",
                              }}
                            />
                          </Box>
                        )}
                      </Box>
                    </>
                  )}
              </Box>
              <Box>
                <Typography
                  fontSize={matches ? "16px" : "20px"}
                  fontWeight={"700"}
                  color={"#141416"}
                >
                  {creativeUserProfile?.user?.firstName ?? ""}{" "}
                  {creativeUserProfile?.user?.lastName ?? ""}
                </Typography>
                <Box display={"flex"} flexWrap={"wrap"} gap={"5px"} pt={"8px"}>
                  {creativeUserProfile?.creativeCategories &&
                  creativeUserProfile.creativeCategories?.length > 0
                    ? creativeUserProfile.creativeCategories?.map(
                        (cat, index) => (
                          <Typography
                            variant="caption"
                            fontSize={matches2 ? "11px" : "14px"}
                            borderRadius={"4px"}
                            px={"4px"}
                            sx={{ backgroundColor: "#f3f3f3" }}
                            key={index}
                          >
                            {TextHelper.capitalize(cat.replace("_", " "))}
                          </Typography>
                        )
                      )
                    : "N/A"}
                </Box>
                <Box pt={"8px"} display={"flex"}>
                  <img
                    src="/assets/icons/location-icon.svg"
                    alt="location"
                    width={20}
                    height={20}
                  />
                  <Text
                    size={12}
                    weight={500}
                    sx={{ px: 1 }}
                    color={themeColors.secondary}
                  >
                    {`${
                      creativeUserProfile?.location?.state ?? ""
                    }, ${TextHelper.capitalize(
                      creativeUserProfile?.location?.country ?? ""
                    )}`}
                  </Text>
                </Box>
              </Box>
            </Box>
            <Box
              display={"flex"}
              flexDirection={
                matches ? "column" : matches2 ? "row-reverse" : "column"
              }
              justifyContent={"space-between"}
              alignItems={"center"}
              width={matches2 ? "100%" : "auto"}
            >
              <Box
                display={"flex"}
                alignItems={"center"}
                gap={"2px"}
                sx={{
                  justifyContent: "right",
                  pointerEvents: "none",
                }}
                mb={"12px"}
              ></Box>
              {(userDetails?.role === UserRoleEnum.ADMIN ||
                creativeUserProfile?.userId === userDetails?.userId) && (
                <CustomButton
                  mode="inverse"
                  style={{ width: "150px" }}
                  type="submit"
                  data-testid="edit-profile-button"
                  onClick={() => buttonClick()}
                >
                  {buttonText}
                </CustomButton>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      <ImageProcessing
        dimension={MIN_DIMENSION}
        imageSrc={imageSrc}
        openCropModal={openCropModal}
        setOpenCropModal={setOpenCropModal}
        onSave={(data) =>
          ImageUpload.creativeHeadshotImageChange(
            data,
            setHeadshotLoading,
            creativeUserProfile,
            saveCreativeUserProfile
          )
        }
      />

      {isModalOpen && (
        <ImageModal
          isOpen={isModalOpen}
          imageUrl={TextHelper.setUrl(creativeUserProfile?.headshot?.url)}
          onClose={() => handleCloseModal()}
          modalStyle={{
            width: "350px",
            height: "350px",
            border: "1px solid",
            borderRadius: "999px",
          }}
          imageBorderRadius="999px"
        />
      )}

      <CustomModal
        open={adminDeleteCoverModal}
        showCloseIcon
        width="600px"
        setOpen={setAdminDeleteCoverModal}
        bgColor="#fff"
      >
        <Box
          sx={{
            padding: "10px 20px",
          }}
        >
          <Text size={22} weight={500} sx={{ mb: 1 }}>
            Delete Creative Cover Image
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
            onClick={() => adminDeleteCover.mutate()}
            disabled={adminDeleteCover.isLoading}
          >
            {adminDeleteCover.isLoading ? <Spinner color={"#fff"} /> : "Done"}
          </CustomButton>
        </Box>
      </CustomModal>

      <CustomModal
        open={adminDeleteHeadshotModal}
        showCloseIcon
        width="600px"
        setOpen={setAdminDeleteHeadshotModal}
        bgColor="#fff"
      >
        <Box
          sx={{
            padding: "10px 20px",
          }}
        >
          <Text size={22} weight={500} sx={{ mb: 1 }}>
            Delete Creative Headshot
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
            onClick={() => adminDeleteHeadshot.mutate()}
            disabled={adminDeleteHeadshot.isLoading}
          >
            {adminDeleteHeadshot.isLoading ? (
              <Spinner color={"#fff"} />
            ) : (
              "Done"
            )}
          </CustomButton>
        </Box>
      </CustomModal>
    </>
  );
};

export default CreativeUserProfileHead;
