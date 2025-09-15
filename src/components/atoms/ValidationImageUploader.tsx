import React, { useRef, useState } from "react";
import { Box, Grid } from "@mui/material";
import Text from "./CustomText";
import useCustomTheme from "../../hooks/theme.hook";
import CustomButton from "./CustomButton";
import CustomModal from "../modals/CustomModal";
import { IFile } from "../../hooks/profile/client/clientProfileSetup.hook";
import { IoClose } from "react-icons/io5";
import { FaRegImage } from "react-icons/fa6";
import { DocumentService } from "../../api/DocumentService";
import { ImageDetectionService } from "../../api/ImageDetectionService";
import Badge from "./ErrorBadge";
import SuccessBadge from "./SuccessBadge";
import { FaEdit } from "react-icons/fa";
import { useAuth } from "../../providers/AuthProvider";

type IValidationMethod = "face" | "fullBody";

interface IProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  validate: IValidationMethod;
  onSave: (data: IFile) => void;
}

const ValidationImageUploader: React.FC<IProps> = ({
  open,
  setOpen,
  validate,
  onSave,
}) => {
  const { themeColors } = useCustomTheme();
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<File | null | undefined>();
  const [validated, setValidated] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [stage, setStage] = useState("upload");
  const { userProfile } = useAuth();

  const validateFace = async () => {
    setStage("processing");
    setLoading(true);

    const fileData = new FormData();
    fileData.append("file", image as File);

    const response = await ImageDetectionService.analyze(fileData);
    if (
      response.status &&
      response.responseData.faces.length > 0 &&
      !response.responseData.sensitiveContent
    )
      setValidated(true);
    else setValidated(false);
    setLoading(false);
  };

  const validateFullBody = async () => {};

  const validateImage = async () => {
    switch (validate) {
      case "face":
        await validateFace();

      case "fullBody":
        await validateFullBody();

      default:
        return;
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileObj = event.target.files && event.target.files[0];
    if (fileObj && fileObj.size < 2000000) setImage(fileObj);
  };

  const handleSave = async () => {
    setLoading(true);
    const fileData = new FormData();
    fileData.append("file", image as File);

    const response = await DocumentService.uploadFile(
      fileData,
      `${userProfile?.userId}/GeneralImages/${Date.now()}_${image?.name ?? ""}`
    );
    if (response.status) {
      let img = {
        docName: response.responseData?.docName!,
        docType: response.responseData?.docType!,
        publicId: response.responseData?.publicId!,
        url: response.responseData?.url!,
      };

      onSave(img);
      setOpen(false);
    }

    setLoading(false);
  };

  return (
    <CustomModal
      width="656px"
      open={open}
      setOpen={setOpen}
      closeOnOverlayClick={true}
    >
      <Box
        style={{
          width: "30px",
          height: "30px",
          position: "absolute",
          top: "20px",
          right: "20px",
          borderRadius: "20px",
          backgroundColor: "whitesmoke",
          cursor: "pointer",
        }}
        onClick={() => {
          setImage(null);
          setStage("upload");
          setOpen(false);
          setLoading(false);
        }}
      >
        <IoClose
          style={{
            width: "24px",
            height: "24px",
            color: themeColors.primary,
            margin: "3px",
          }}
        />
      </Box>
      <Box
        sx={{
          margin: "10px 30px",
          position: "relative",
        }}
      >
        {stage === "upload" && (
          <>
            <Text size={28} weight={600} sx={{}} center>
              Upload Image
            </Text>
            <Text size={15} weight={500} sx={{ mt: 1 }} center>
              Your image will be scanned to verify it conforms with our picture
              media guidelines.{" "}
              <span style={{ color: "red" }}>
                {" "}
                Note: Images less than 2MB only. AVIF files are not supported.
              </span>
            </Text>
            {image ? (
              <Box
                style={{
                  height: "300px",
                  borderRadius: "10px",
                  marginTop: "10px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  position: "relative",
                }}
              >
                <img
                  src={URL.createObjectURL(image)}
                  alt="image not found"
                  style={{
                    width: "90%",
                    height: "90%",
                    objectFit: "contain",
                  }}
                />

                <Box
                  style={{
                    width: "30px",
                    height: "30px",
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                    borderRadius: "20px",
                    backgroundColor: themeColors.primary,
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    setImage(null);
                  }}
                >
                  <FaEdit
                    style={{
                      width: "18px",
                      height: "18px",
                      color: "white",
                      margin: "6px",
                    }}
                  />
                </Box>
              </Box>
            ) : (
              <Box
                style={{
                  height: "200px",
                  borderRadius: "10px",
                  margin: "30px 0px",
                  position: "relative",
                  backgroundColor: "#E5E5E5",
                  border: "5px dashed lightgray",
                  cursor: "pointer",
                }}
                onClick={() => inputRef.current?.click()}
              >
                <FaRegImage
                  style={{
                    width: "50px",
                    height: "50px",
                    margin: "50px calc(50% - 25px) 10px calc(50% - 25px)",
                  }}
                />
                <Text size={15} weight={500} center>
                  Click to upload image.
                </Text>
                <input
                  style={{ display: "none" }}
                  ref={inputRef}
                  type="file"
                  accept=".png,.jpg,.jpeg"
                  onChange={handleImageUpload}
                />
              </Box>
            )}
            <CustomButton
              mode="primary"
              style={{ marginTop: "16px" }}
              onClick={() => validateImage()}
              disabled={!image}
              loading={loading}
            >
              Validate Image
            </CustomButton>
          </>
        )}
        {stage === "processing" && (
          <>
            <Text size={20} weight={500} sx={{ mt: 1 }} center>
              Please wait a few moments while your image is being processed.
            </Text>
            <Box
              style={{
                height: "300px",
                borderRadius: "10px",
                marginTop: "10px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
              }}
            >
              <img
                src={URL.createObjectURL(image as File)}
                alt="image not found"
                style={{
                  width: "90%",
                  height: "90%",
                  objectFit: "contain",
                }}
              />

              <Box
                style={{
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: "0px",
                  right: "0px",
                  borderRadius: "20px",
                  backgroundImage: "url(/assets/gif/scanner.gif)",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  pointerEvents: "none",
                  display: loading && !validated ? "block" : "none",
                }}
              ></Box>
            </Box>
            {loading && (
              <Text size={15} weight={500} sx={{ mt: 1 }} center>
                Processing. Please wait...
              </Text>
            )}
            {loading && validated && (
              <>
                <Grid container spacing={2} mb={3}>
                  <Grid item xs={12} md={6}>
                    <CustomButton
                      mode="inverse"
                      style={{ marginTop: "16px" }}
                      onClick={() => {
                        setStage("upload");
                        setImage(null);
                      }}
                      disabled={loading}
                    >
                      Choose another image
                    </CustomButton>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CustomButton
                      mode="primary"
                      style={{ marginTop: "16px" }}
                      onClick={() => handleSave()}
                      disabled={loading}
                      loading={loading}
                    >
                      Save
                    </CustomButton>
                  </Grid>
                </Grid>
              </>
            )}
            {!loading && validated && (
              <>
                <SuccessBadge>
                  Your image was successfully validated!
                </SuccessBadge>
                <Grid container spacing={2} mb={3}>
                  <Grid item xs={12} md={6}>
                    <CustomButton
                      mode="inverse"
                      style={{ marginTop: "16px" }}
                      onClick={() => {
                        setStage("upload");
                        setImage(null);
                      }}
                      disabled={loading}
                    >
                      Choose another image
                    </CustomButton>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CustomButton
                      mode="primary"
                      style={{ marginTop: "16px" }}
                      onClick={() => handleSave()}
                      disabled={loading}
                      loading={loading}
                    >
                      Save
                    </CustomButton>
                  </Grid>
                </Grid>
              </>
            )}
            {!loading && !validated && (
              <>
                <Badge>
                  {`Sorry, this image doesn't conform with our picture guidelines.`}
                </Badge>
                <Grid container spacing={2} mb={3}>
                  <Grid item xs={12} md={6}>
                    <CustomButton
                      mode="inverse"
                      style={{ marginTop: "16px" }}
                      onClick={() => {
                        setStage("upload");
                        setImage(null);
                      }}
                      disabled={loading}
                    >
                      Choose another image
                    </CustomButton>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <CustomButton
                      mode="primary"
                      style={{ marginTop: "16px" }}
                      onClick={() => {
                        setStage("upload");
                        setImage(null);
                        setOpen(false);
                      }}
                      disabled={loading}
                    >
                      Cancel
                    </CustomButton>
                  </Grid>
                </Grid>
              </>
            )}
          </>
        )}
      </Box>
    </CustomModal>
  );
};

export default ValidationImageUploader;
