import { ChangeEvent, useRef, useState } from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import Text from "../atoms/CustomText";
import useCustomTheme from "../../hooks/theme.hook";
import CustomButton from "../atoms/CustomButton";
import { useAuth } from "../../providers/AuthProvider";
import { BiSolidEdit } from "react-icons/bi";
import Spinner from "../loaders/Spinner";
import { ClientProfileDto } from "@/models/dtos/ClientProfileDto";
import { FiEdit } from "react-icons/fi";
import { useRouter } from "next/router";
import { TextHelper } from "@/helpers/TextHelper";
import { useMutation } from "@tanstack/react-query";
import { ImageUpload } from "@/helpers/ImageUpload";
import toast from "react-hot-toast";
import { AdminProfileService } from "../../api/admin/AdminProfileService";
import { UserRoleEnum } from "../../models/enum-models/UserRoleEnums";
import { MdOutlineDelete } from "react-icons/md";
import CustomModal from "../modals/CustomModal";
import ClientImageProcessing from "./ClientImageProcessing";

interface IProps {
  clientUserProfile: ClientProfileDto;
  buttonClick: () => void;
  buttonText: string;
}

const MIN_DIMENSION = 250;

const ClientUserProfileHead: React.FC<IProps> = ({
  clientUserProfile,
  buttonClick,
  buttonText,
}) => {
  const { themeColors } = useCustomTheme();
  const { userDetails } = useAuth();
  const inputHeadShotRef = useRef<any>(null);
  const inputCoverRef = useRef<HTMLInputElement>(null);
  const [adminDeletionReason, setAdminDeletionReason] = useState("");
  const [adminDeleteCoverModal, setAdminDeleteCoverModal] = useState(false);
  const [adminDeleteLogoModal, setAdminDeleteLogoModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [logoLoading, setLogoLoading] = useState(false);
  const router = useRouter();
  const matches = useMediaQuery("(max-width: 500px)");
  const matches2 = useMediaQuery("(max-width: 900px)");
  const [openCropModal, setOpenCropModal] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>();

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
        url: clientUserProfile?.coverImage?.url,
        deletionReason: adminDeletionReason,
      });
      if (result.status) {
        if (result.responseData?.coverImage)
          clientUserProfile.coverImage = result.responseData?.coverImage;
      }
      setAdminDeletionReason("");
      setAdminDeleteCoverModal(false);
    },
    onSuccess: () => {
      toast.success("Deleted Cover Image");
    },
  });

  const adminDeleteLogo = useMutation({
    mutationFn: async () => {
      const result = await AdminProfileService.deleteClientProfileDoc({
        url: clientUserProfile?.logo?.url,
        deletionReason: adminDeletionReason,
      });
      if (result.status) {
        if (result.responseData?.logo)
          clientUserProfile.logo = result.responseData?.logo;
      }
      setAdminDeletionReason("");
      setAdminDeleteLogoModal(false);
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
        mb={5}
      >
        <Box
          sx={{
            backgroundImage: `url('${
              clientUserProfile?.coverImage?.url
                ? TextHelper.setUrl(clientUserProfile.coverImage?.url)
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
          {clientUserProfile?.userId === userDetails?.userId && (
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
                      ImageUpload.clientImageUpload(
                        e,
                        setLoading,
                        clientUserProfile,
                        "coverImage"
                      )
                    }
                  />
                </>
              )}
            </Box>
          )}

          {userDetails?.role === UserRoleEnum.ADMIN &&
            TextHelper.setUrl(clientUserProfile?.logo?.url) && (
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
                  <MdOutlineDelete
                    style={{ color: themeColors.primary, cursor: "pointer" }}
                    size={20}
                    onClick={() => setAdminDeleteCoverModal(true)}
                  />
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
                  width: "100px",
                  height: "100px",
                  backgroundImage: clientUserProfile?.logo?.url
                    ? `url(${TextHelper.setUrl(clientUserProfile?.logo?.url)})`
                    : `url(/assets/images/creative-avatar-0.jpg)`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: "100%",
                  position: "relative",
                }}
              >
                {clientUserProfile?.userId === userDetails?.userId && (
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
                      onClick={(e) => {
                        e.stopPropagation();
                        inputHeadShotRef.current?.click();
                      }}
                    >
                      {logoLoading ? (
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
                  TextHelper.setUrl(clientUserProfile?.logo?.url) && (
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
                          backgroundImage: clientUserProfile?.logo?.url
                            ? `url(${TextHelper.setUrl(
                                clientUserProfile?.logo?.url
                              )})`
                            : `url(/assets/images/creative-avatar-0.jpg)`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                        // onClick={(e) => {
                        //   e.stopPropagation();
                        //   setOpen(true);
                        // }}

                        onClick={(e) => {
                          e.stopPropagation();
                          setAdminDeleteLogoModal(true);
                        }}
                      >
                        {logoLoading ? (
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
                  {clientUserProfile?.user?.firstName ?? ""}{" "}
                  {clientUserProfile?.user?.lastName ?? ""}
                </Typography>
                <Text size={16} weight={600} color={themeColors.placeholder}>
                  {clientUserProfile?.businessDetail?.name}
                </Text>

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
                      clientUserProfile?.businessLocation?.state ?? ""
                    }, ${TextHelper.capitalize(
                      clientUserProfile?.businessLocation?.country ?? ""
                    )}`}
                  </Text>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <ClientImageProcessing
        dimension={MIN_DIMENSION}
        imageSrc={imageSrc}
        openCropModal={openCropModal}
        setImageSrc={setImageSrc}
        setOpenCropModal={setOpenCropModal}
        onSave={(data) => {
          ImageUpload.clientLogoImageChange(
            data,
            setLogoLoading,
            clientUserProfile
          );
          setImageSrc("");
        }}
      />

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
            Delete Client Cover Image
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
        open={adminDeleteLogoModal}
        showCloseIcon
        width="600px"
        setOpen={setAdminDeleteLogoModal}
        bgColor="#fff"
      >
        <Box
          sx={{
            padding: "10px 20px",
          }}
        >
          <Text size={22} weight={500} sx={{ mb: 1 }}>
            Delete Client Logo
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
            onClick={() => adminDeleteLogo.mutate()}
            disabled={adminDeleteLogo.isLoading}
          >
            {adminDeleteLogo.isLoading ? <Spinner color={"#fff"} /> : "Done"}
          </CustomButton>
        </Box>
      </CustomModal>
    </>
  );
};

export default ClientUserProfileHead;
