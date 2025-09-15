import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { Box, useMediaQuery } from "@mui/material";
import CustomButton from "../atoms/CustomButton";
import CustomModal from "../modals/CustomModal";
import { IFile } from "../../hooks/profile/client/clientProfileSetup.hook";
import { DocumentService } from "../../api/DocumentService";
import ReactCrop, {
  Crop,
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
} from "react-image-crop";
import { CanvasHelper } from "@/helpers/CanvasHelper";
import toast from "react-hot-toast";
import { useRouter } from "next/router";

const ASPECT_RATIO = 1;

interface IProps {
  onSave: (data: IFile) => void;
  dimension: number;
  setImageSrc: Dispatch<SetStateAction<string | undefined>>;
  setOpenCropModal: Dispatch<SetStateAction<boolean>>;
  imageSrc: string | undefined;
  openCropModal: boolean;
}

const ClientImageProcessing: React.FC<IProps> = ({
  onSave,
  dimension,
  imageSrc,
  openCropModal,
  setOpenCropModal,
}) => {
  const router = useRouter();

  const [uploadingImage, setUploadingImage] = useState(false);
  const [outputCropImage, setOutputCropImage] = useState<string | null>();

  const [crop, setCrop] = useState<Crop>();
  const [openPreviewModal, setOpenPreviewModal] = useState(false);

  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const matches = useMediaQuery("(max-width: 500px)");

  const handleSave = async () => {
    if (!outputCropImage) return;

    setUploadingImage(true);

    const blob = await fetch(outputCropImage).then((res) => res.blob());

    const fileData = new FormData();
    fileData.append("file", blob);

    const response = await DocumentService.uploadFile(
      fileData,
      `${router.query.id}/GeneralImages/${Date.now()}_${"headshot"}`
    );

    if (response.responseCode === 200) {
      let img = {
        docName: response.responseData?.docName!,
        docType: response.responseData?.docType!,
        publicId: response.responseData?.publicId!,
        url: response.responseData?.url!,
      };

      onSave(img);
      setOpenPreviewModal(false);
      setOutputCropImage(null);
    } else {
      toast.error("Error uploading image");
      setUploadingImage(false);
    }
    setUploadingImage(false);
  };

  const onImageLoad = (e: any) => {
    const { width, height } = e.currentTarget;
    const cropWidthInPercent = (dimension / width) * 100;

    const crop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthInPercent,
      },
      ASPECT_RATIO,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };

  return (
    <>
      <CustomModal
        open={openCropModal}
        radius="8px"
        bgColor="#fff"
        showCloseIcon
        setOpen={setOpenCropModal}
      >
        <Box>
          <Box
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            my={"40px"}
            gap={"20px"}
          >
            <ReactCrop
              crop={crop}
              keepSelection
              aspect={1}
              onChange={(crop, percentCrop) => {
                setCrop(percentCrop);
              }}
              minHeight={dimension}
              minWidth={dimension}
              maxHeight={dimension}
              maxWidth={dimension}
            >
              <img
                src={imageSrc}
                ref={imgRef}
                alt="image"
                style={{ maxHeight: "300px" }}
                onLoad={onImageLoad}
              />
            </ReactCrop>

            <canvas
              ref={previewCanvasRef}
              style={{
                display: "none",
              }}
            />
          </Box>
          <Box
            display={"flex"}
            alignItems={"center"}
            gap={"12px"}
            mt={"20px"}
            flexDirection={matches ? "column" : "row"}
            maxWidth={"521px"}
            mx={"auto"}
          >
            <CustomButton
              mode="inverse"
              type="submit"
              data-test-id="edit-profile-button"
              onClick={() => setOpenCropModal(false)}
            >
              Cancel
            </CustomButton>
            <CustomButton
              mode="primary"
              type="submit"
              data-testid="edit-profile-button"
              onClick={() => {
                CanvasHelper.setCanvasPreview(
                  imgRef?.current!,
                  previewCanvasRef?.current!,
                  convertToPixelCrop(
                    crop!,
                    imgRef.current?.width!,
                    imgRef.current?.height!
                  ),
                  setOutputCropImage
                );
                setOpenCropModal(false);
                setOpenPreviewModal(true);
              }}
            >
              Done
            </CustomButton>
          </Box>
        </Box>
      </CustomModal>

      <CustomModal
        open={openPreviewModal}
        radius="8px"
        bgColor="#fff"
        showCloseIcon
        setOpen={setOpenPreviewModal}
      >
        <Box>
          <Box
            display={"flex"}
            flexDirection={"column"}
            alignItems={"center"}
            my={"40px"}
            gap={"20px"}
          >
            <img
              src={outputCropImage || ""}
              alt="preview image"
              width={300}
              height={300}
            />
          </Box>
          <Box
            display={"flex"}
            alignItems={"center"}
            gap={"12px"}
            mt={"20px"}
            flexDirection={matches ? "column" : "row"}
            maxWidth={"521px"}
            mx={"auto"}
          >
            <CustomButton
              mode="inverse"
              type="submit"
              data-testid="edit-profile-button"
              onClick={() => {
                setOpenPreviewModal(false);
                setOpenCropModal(true);
              }}
            >
              Back
            </CustomButton>
            <CustomButton
              mode="primary"
              type="submit"
              data-testid="edit-profile-button"
              loading={uploadingImage}
              disabled={uploadingImage}
              onClick={() => {
                handleSave();
              }}
            >
              Done
            </CustomButton>
          </Box>
        </Box>
      </CustomModal>
    </>
  );
};

export default ClientImageProcessing;
