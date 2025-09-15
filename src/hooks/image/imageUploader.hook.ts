import { DocumentService } from "@/api/DocumentService";
import { triggerToast } from "@/components/atoms/CustomToast";
import { TextHelper } from "@/helpers/TextHelper";
import { UserDocDto } from "@/models/dtos/base/UserDocDto";
import {
  UploadBasePathEnum,
  UploadFilePathsEnum,
} from "@/models/enum-models/UploadFilePath";
import { UserTypeEnum } from "@/models/enum-models/UserTypeEnum";
import { useAuth } from "@/providers/AuthProvider";
import { useEffect, useState } from "react";

export const useImageUploaderHook = (
  imagesUpdate?: UserDocDto[],
  onChange?: ((images: UserDocDto[]) => void) | undefined
) => {
  const [images, setImages] = useState<UserDocDto[] | null>(
    imagesUpdate ?? null
  );
  const { userDetails } = useAuth();

  const [upLoadingImages, setUpLoadingImages] = useState<boolean>(false);

  const imagePath =
    userDetails?.userType === UserTypeEnum.CREATIVE
      ? UploadBasePathEnum.CREATIVE_PHOTO_PATH
      : UploadBasePathEnum.CLIENT_PHOTO_PATH;

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files || []);

    let uploadedImage: UserDocDto[] = [];

    setUpLoadingImages(true);
    if (files.length > 0) {
      const uploadPromises = files.map(async (image, index) => {
        const fileData = new FormData();
        fileData.append("file", image);

        const HIGHEST_FILE_SIZE = 60 * 1024 * 1024;

        if (image.size > HIGHEST_FILE_SIZE) {
          triggerToast(
            "error",
            "Image size should be less than 60MB",
            "top-right"
          );
          return;
        }

        const uploadedImageResponse = await DocumentService.uploadFile(
          fileData,
          TextHelper.setFilePath(
            imagePath,
            UploadFilePathsEnum.CONTENT_MANAGEMENT,
            userDetails?.userId ?? "",
            image.name
          )
        );

        if (uploadedImageResponse.status) {
          uploadedImage.push(uploadedImageResponse.responseData as UserDocDto);
        } else {
          triggerToast(
            "error",
            "Something went wrong while uploading images/video",
            "bottom-right"
          );
        }
      });

      await Promise.all(uploadPromises);
      setUpLoadingImages(false);
      setImages([...(images ?? []), ...uploadedImage]);
      onChange && onChange([...(images ?? []), ...uploadedImage]);

      event.target.value = "";
    }
  };

  useEffect(() => {
    if (imagesUpdate) {
      setImages(imagesUpdate);
    }
  }, [imagesUpdate]);

  return {
    images,
    handleImageUpload,
    upLoadingImages,
    setImages,
  };
};
