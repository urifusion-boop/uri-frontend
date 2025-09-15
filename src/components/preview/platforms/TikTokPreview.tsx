import React from "react";
import { EditorState } from "draft-js";
import { FaHeart, FaComment, FaBookmark, FaShare } from "react-icons/fa";
import { TextHelper } from "@/helpers/TextHelper";
import { MediaTypeEnum } from "@/models/enum-models/MediaTypeEnum";
import { UserDocDto } from "@/models/dtos/base/UserDocDto";
import { MediaHelper } from "@/helpers/MediaHelper";

interface TikTokPreviewProps {
  editorState: EditorState | null;
  attachments: UserDocDto[];
  profileImage: string;
  username: string;
  displayName: string;
}

const TikTokPreview = ({
  editorState,
  attachments,
  profileImage,
  username,
  displayName,
}: TikTokPreviewProps) => {
  const content = editorState?.getCurrentContent().getPlainText() || "";

  return (
    <div className="bg-black text-white max-w-[320px] mx-auto relative aspect-[9/16]">
      {attachments.length >= 0 &&
      MediaHelper.getMediaType(attachments[0]?.docType) ===
        MediaTypeEnum.VIDEO ? (
        <video
          src={TextHelper.setUrl(attachments[0]?.url)}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
        />
      ) : (
        <img
          src={TextHelper.setUrl(attachments[0]?.url)}
          alt="Video thumbnail"
          className="absolute inset-0 w-full h-full object-contain"
        />
      )}

      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
        <div className="flex items-center space-x-2">
          <img
            src={profileImage}
            alt={displayName}
            className="w-10 h-10 rounded-full border-2 border-white"
          />
          <div>
            <div className="font-semibold">{username}</div>
            <div className="text-sm opacity-80">{displayName}</div>
          </div>
          <button className="ml-auto bg-[#FE2C55] text-white px-4 py-1 rounded-md text-sm font-semibold">
            Follow
          </button>
        </div>

        <p className="text-sm mb-4 line-clamp-2  break-all max-h-20 overflow-y-auto no-scroll">
          {content}
        </p>
      </div>

      <div className="absolute right-4 bottom-10 flex flex-col items-center space-y-4">
        <div className="flex flex-col items-center">
          <FaHeart className="w-8 h-8 mb-1" />
          <span className="text-xs">0</span>
        </div>
        <div className="flex flex-col items-center">
          <FaComment className="w-8 h-8 mb-1" />
          <span className="text-xs">0</span>
        </div>
        <div className="flex flex-col items-center">
          <FaBookmark className="w-8 h-8 mb-1" />
          <span className="text-xs">0</span>
        </div>
        <div className="flex flex-col items-center">
          <FaShare className="w-8 h-8 mb-1" />
          <span className="text-xs">0</span>
        </div>
      </div>
    </div>
  );
};

export default TikTokPreview;
