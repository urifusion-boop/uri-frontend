import { MediaTypeEnum } from "@/models/enum-models/MediaTypeEnum";

export class MediaHelper {
  static getMediaType = (docType: string) => {
    return docType?.toLowerCase().startsWith("image")
      ? MediaTypeEnum.IMAGE
      : MediaTypeEnum.VIDEO;
  };
}
