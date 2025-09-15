import React, { useRef } from "react";
import { Box, Button, IconButton, Typography } from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import DeleteIcon from "@mui/icons-material/Delete";
import { useImageUploaderHook } from "@/hooks/image/imageUploader.hook";
import { TextHelper } from "@/helpers/TextHelper";
import Spinner from "../loaders/Spinner";
import { LightThemeColors } from "@/configs/colors.config";
import { UserDocDto } from "@/models/dtos/base/UserDocDto";
import { DocumentService } from "@/api/DocumentService";
import { useMutation } from "@tanstack/react-query";
import { triggerToast } from "../atoms/CustomToast";
import { MediaHelper } from "@/helpers/MediaHelper";
import { MediaTypeEnum } from "@/models/enum-models/MediaTypeEnum";

interface ImageUploadProps {
  onImageUpload: (file: File) => void;
  imagesUpdate?: UserDocDto[];
  onChange?: (images: UserDocDto[]) => void;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  imagesUpdate,
  onChange,
  disabled,
}) => {
  const { images, handleImageUpload, upLoadingImages, setImages } =
    useImageUploaderHook(imagesUpdate, onChange);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Image container component
  const ImageContainer = ({ preview }: { preview: UserDocDto }) => {
    const { mutate: deleteImage, isLoading: isDeletingImage } = useMutation({
      mutationFn: async (publicId: string) => {
        const deletedImageResponse = await DocumentService.deleteFile(publicId);

        if (deletedImageResponse.status) {
          setImages(
            images
              ? images?.filter((image) => image.publicId !== publicId)
              : null
          );

          onChange &&
            onChange(
              images?.filter((image) => image.publicId !== publicId) ?? []
            );
        } else {
          triggerToast("error", "Error", "bottom-right");
        }
      },
    });
    return (
      <Box
        key={preview.publicId}
        sx={{
          position: "relative",
          width: "150px",
          height: "100px",
        }}
      >
        <IconButton
          size="small"
          sx={{
            position: "absolute",
            right: 5,
            top: 5,
            backgroundColor: "rgba(255,255,255,0.8)",
            "&:hover": { backgroundColor: "rgba(255,255,255,0.9)" },
            zIndex: 2,
          }}
          onClick={() => deleteImage(preview.publicId)}
          disabled={isDeletingImage || disabled}
        >
          {isDeletingImage ? (
            <Spinner size={10} color={LightThemeColors.uriColor} />
          ) : (
            <DeleteIcon fontSize="small" />
          )}
        </IconButton>

        {MediaHelper.getMediaType(preview?.docType) === MediaTypeEnum.IMAGE ? (
          <img
            src={TextHelper.setUrl(preview?.url)}
            alt={preview?.docName}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "5px",
            }}
          />
        ) : (
          <video
            src={TextHelper.setUrl(preview?.url)}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "5px",
            }}
            autoPlay
            muted
            loop
          />
        )}
      </Box>
    );
  };

  return (
    <Box sx={{ mb: 1 }}>
      {images && images.length > 0 && (
        <Box
          sx={{
            mt: 2,
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            mb: 2,
          }}
        >
          {images &&
            images.map((preview, index) => (
              <ImageContainer preview={preview} key={index} />
            ))}
        </Box>
      )}
      <input
        type="file"
        accept="image/*,video/*"
        hidden
        multiple
        ref={fileInputRef}
        onChange={handleImageUpload}
      />
      <Button
        variant="outlined"
        startIcon={
          upLoadingImages ? (
            <Spinner size={15} color={LightThemeColors.uriColor} />
          ) : (
            <ImageIcon />
          )
        }
        onClick={() => fileInputRef.current?.click()}
        sx={{ mb: 2 }}
        disabled={upLoadingImages || disabled}
      >
        {upLoadingImages ? (
          <Typography variant="caption">Uploading...</Typography>
        ) : images && images?.length > 0 ? (
          "Upload More Media"
        ) : (
          "Upload Media"
        )}
      </Button>
    </Box>
  );
};

export default ImageUpload;
