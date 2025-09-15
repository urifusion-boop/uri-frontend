import { ClientProfileService } from "@/api/ClientProfileService";
import { CreativeProfileService } from "@/api/CreativeProfileService";
import { DocumentService } from "@/api/DocumentService";
import { queryClient } from "@/configs/query-client.config";
import { IFile } from "@/hooks/profile/client/clientProfileSetup.hook";
import { ClientProfileDto } from "@/models/dtos/ClientProfileDto";
import { CreativeProfileDto } from "@/models/dtos/CreativeProfileDto";
import { QueryKeyEnum } from "@/models/enum-models/QueryKeyEnum";
import { ChangeEvent, SetStateAction } from "react";
import toast from "react-hot-toast";

export class ImageUpload {
  constructor() {}

  static async creativeHeaderUpload(
    event: ChangeEvent<HTMLInputElement>,
    setLoading: (value: SetStateAction<boolean>) => void,
    creativeUserProfile: CreativeProfileDto | null,
    type: "coverImage"
  ) {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) return;

    const fileData = new FormData();
    fileData.append("file", fileObj);

    setLoading(true);

    if (creativeUserProfile)
      // delete former header pic first
      await DocumentService.deleteFile(
        creativeUserProfile[type]?.publicId!
      ).catch((response) => {
        return;
      });

    // Then upload a new on and update profile
    await DocumentService.uploadFile(
      fileData,
      `${creativeUserProfile?.userId}/CoverImages/${Date.now()}_${fileObj.name}`
    )
      .then(async (response: any) => {
        await CreativeProfileService.updateProfileApi({
          ...creativeUserProfile,
          [type]: {
            docName: response.responseData?.docName!,
            docType: response.responseData?.docType!,
            publicId: response.responseData?.publicId!,
            url: response.responseData?.url!,
          },
        })
          .then((res) => {
            toast.success("Profile Updated");
          })
          .catch((res) => console.log(res));
      })
      .catch((response) => {
        console.log(response);
      })
      .finally(() => {
        setLoading(false);
        queryClient.invalidateQueries([QueryKeyEnum.CREATIVE_PROFILE]);
      });

    event.target.value = "";
  }

  // static async creativeHeadshotImageChange(
  //   event: ChangeEvent<HTMLInputElement>,
  //   setHeadshotLoading: (value: SetStateAction<boolean>) => void,
  //   creativeUserProfile: CreativeProfileDto
  // ) {
  //   const fileObj = event.target.files && event.target.files[0];
  //   if (!fileObj) return;

  //   const fileData = new FormData();
  //   fileData.append("file", fileObj);

  //   setHeadshotLoading(true);

  //   // delete former header pic first
  //   await DocumentService.deleteFile(
  //     creativeUserProfile.headshot?.publicId!
  //   ).catch((response) => {
  //     return;
  //   });

  //   // Then upload a new on and update profile
  //   await DocumentService.uploadFile(fileData, `${creativeUserProfile?.userId}/Headshots/${Date.now()}_${fileObj.name}`)
  //     .then(async (response: any) => {
  //       await CreativeProfileService.updateProfileApi({
  //         ...creativeUserProfile,
  //         headshot: {
  //           docName: response.responseData?.docName!,
  //           docType: response.responseData?.docType!,
  //           publicId: response.responseData?.publicId!,
  //           url: response.responseData?.url!,
  //         },
  //       })
  //         .then((res) => {
  //           toast.success("Profile Updated");
  //         })
  //         .catch((res) => console.log(res));
  //     })
  //     .catch((response) => {
  //       console.log(response);
  //     })
  //     .finally(() => {
  //       setHeadshotLoading(false);
  //       queryClient.invalidateQueries([QueryKeyEnum.CREATIVE_PROFILE]);
  //     });

  //   queryClient.invalidateQueries([QueryKeyEnum.CREATIVE_PROFILE]);
  // }

  static async creativeHeadshotImageChange(
    file: IFile,
    setHeadshotLoading: (value: SetStateAction<boolean>) => void,
    creativeUserProfile: CreativeProfileDto,
    saveCreativeUserProfile: (data: CreativeProfileDto) => void
  ) {
    setHeadshotLoading(true);

    // delete former header pic first
    await DocumentService.deleteFile(
      creativeUserProfile.headshot?.publicId!
    ).catch((response) => {
      return;
    });

    await CreativeProfileService.updateProfileApi({
      ...creativeUserProfile,
      headshot: file,
    })
      .then((res) => {
        toast.success("Profile Updated");
        saveCreativeUserProfile(res.responseData!);
      })
      .catch((response) => {})
      .finally(() => {
        setHeadshotLoading(false);
        queryClient.invalidateQueries([QueryKeyEnum.CREATIVE_PROFILE]);
      });

    queryClient.invalidateQueries([QueryKeyEnum.CREATIVE_PROFILE]);
  }

  static async clientImageUpload(
    event: ChangeEvent<HTMLInputElement>,
    setLoading: (value: SetStateAction<boolean>) => void,
    clientUserProfile: ClientProfileDto,
    type: "coverImage" | "logo"
  ) {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) return;

    const fileData = new FormData();
    fileData.append("file", fileObj);

    setLoading(true);

    // delete former header pic first
    if (clientUserProfile && clientUserProfile[type]) {
      await DocumentService.deleteFile(
        clientUserProfile[type]?.publicId!
      ).catch((response) => {
        return;
      });
    }

    // Then upload a new on and update profile
    await DocumentService.uploadFile(
      fileData,
      `${clientUserProfile?.userId}/CoverImages/${Date.now()}_${fileObj.name}`
    )
      .then(async (response: any) => {
        await ClientProfileService.updateProfileApi({
          ...clientUserProfile,
          [type]: {
            docName: response.responseData?.docName!,
            docType: response.responseData?.docType!,
            publicId: response.responseData?.publicId!,
            url: response.responseData?.url!,
          },
        })
          .then((res) => {
            queryClient.invalidateQueries([QueryKeyEnum.CLIENT_PROFILE]);
            toast.success("Profile Updated");
          })
          .catch((res) => console.log(res));
      })
      .catch((response) => {
        console.log(response);
      })
      .finally(() => setLoading(false));

    event.target.value = "";
  }

  static async clientLogoImageChange(
    file: IFile,
    setHeadshotLoading: (value: SetStateAction<boolean>) => void,
    clientUserProfile: ClientProfileDto
  ) {
    setHeadshotLoading(true);

    // delete former header pic first
    await DocumentService.deleteFile(clientUserProfile.logo?.publicId!).catch(
      (response) => {
        return;
      }
    );

    await ClientProfileService.updateProfileApi({
      ...clientUserProfile,
      logo: file,
    })
      .then((res) => {
        toast.success("Profile Updated");
      })
      .catch((response) => {})
      .finally(() => {
        setHeadshotLoading(false);
        queryClient.invalidateQueries([QueryKeyEnum.CLIENT_PROFILE]);
      });

    queryClient.invalidateQueries([QueryKeyEnum.CLIENT_PROFILE]);
  }

  static base64ToFile(base64String: string, fileName: string): File {
    // Split the base64 string to extract the content and mime type (optional)
    const dataURI = base64String.split(",");
    const contentType =
      dataURI[0].match(/data:([a-z]+)\/([a-z]+);base64/)?.[1] || "";

    // Decode the base64 string and create a binary string
    const byteString = atob(dataURI[1]);
    const binaryString = Array.from(byteString).map((char) =>
      String.fromCharCode(char.charCodeAt(0))
    );

    // Create a Blob object with the binary data and mime type (if available)
    const blob = new Blob([binaryString.join("")], { type: contentType });

    // Create a File object with the Blob and filename
    return new File([blob], fileName, { type: contentType });
  }
}
