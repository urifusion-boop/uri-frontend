import React from "react";
import { EditorState } from "draft-js";
import { FaRegThumbsUp, FaRegComment, FaShare } from "react-icons/fa";
import { format } from "date-fns";
import { UserDocDto } from "@/models/dtos/base/UserDocDto";
import { TextHelper } from "@/helpers/TextHelper";
import { MediaTypeEnum } from "@/models/enum-models/MediaTypeEnum";
import { MediaHelper } from "@/helpers/MediaHelper";
import { Typography } from "@mui/material";
import { ContentTypeEnum } from "@/models/enum-models/ContentTypeEnum";
import { BsThreeDots } from "react-icons/bs";

interface FacebookPreviewProps {
  editorState: EditorState | null;
  attachments: UserDocDto[];
  profileImage: string;
  username: string;
  displayName: string;
  postType: ContentTypeEnum;
}

const FacebookPreview = ({
  editorState,
  attachments,
  profileImage,
  username,
  displayName,
  postType,
}: FacebookPreviewProps) => {
  const content = editorState?.getCurrentContent().getPlainText() || "";

  const renderImages = () => {
    const imageCount = attachments.length;
    if (imageCount === 0) return null;

    if (imageCount === 1) {
      return (
        <div className="mt-2">
          {MediaHelper.getMediaType(attachments[0]?.docType) ===
          MediaTypeEnum.IMAGE ? (
            <img
              src={TextHelper.setUrl(attachments[0]?.url)}
              alt="Post media"
              className="w-full"
              style={{ maxHeight: "500px", objectFit: "cover" }}
            />
          ) : (
            <video
              src={TextHelper.setUrl(attachments[0]?.url)}
              autoPlay
              muted
              loop
            />
          )}
        </div>
      );
    }

    const gridClass =
      {
        2: "grid-cols-2",
        3: "grid-cols-2",
        4: "grid-cols-2",
      }[Math.min(imageCount, 4)] || "grid-cols-2";

    return (
      <div className={`grid ${gridClass} gap-1 mt-2`}>
        {attachments.slice(0, 4).map((image, index) => (
          <div
            key={index}
            className={`relative ${imageCount === 3 && index === 0 ? "row-span-2" : ""}`}
          >
            {MediaHelper.getMediaType(image?.docType) ===
            MediaTypeEnum.IMAGE ? (
              <img
                src={TextHelper.setUrl(image?.url)}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <video src={TextHelper.setUrl(image?.url)} autoPlay muted loop />
            )}
          </div>
        ))}
      </div>
    );
  };

  const renderReelLayout = () => (
    <div className="bg-black max-w-[380px] mx-auto h-[670px] relative rounded-lg overflow-hidden">
      {attachments.length > 0 && (
        <div className="h-full w-full flex items-center justify-center">
          {MediaHelper.getMediaType(attachments[0]?.docType) ===
          MediaTypeEnum.IMAGE ? (
            <img
              src={TextHelper.setUrl(attachments[0]?.url)}
              alt="Post media"
              className="w-full h-full object-cover"
              style={{ aspectRatio: "9/16" }}
            />
          ) : (
            <video
              src={TextHelper.setUrl(attachments[0]?.url)}
              autoPlay
              muted
              loop
            />
          )}
        </div>
      )}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/60 to-transparent">
        <Typography className="text-white text-lg font-semibold">
          Reels
        </Typography>
      </div>
      <div className="absolute right-4 bottom-20 flex flex-col items-center space-y-6">
        <button className="text-white flex flex-col items-center">
          <div className="w-12 h-12 bg-black/40 rounded-full flex items-center justify-center">
            <FaRegThumbsUp className="w-6 h-6" />
          </div>
          <span className="text-xs mt-2">0</span>
        </button>
        <button className="text-white flex flex-col items-center">
          <div className="w-12 h-12 bg-black/40 rounded-full flex items-center justify-center">
            <FaRegComment className="w-6 h-6" />
          </div>
          <span className="text-xs mt-2">0</span>
        </button>
        <button className="text-white flex flex-col items-center">
          <div className="w-12 h-12 bg-black/40 rounded-full flex items-center justify-center">
            <FaShare className="w-6 h-6" />
          </div>
          <span className="text-xs mt-2">Share</span>
        </button>
      </div>
      <div className="absolute bottom-0 left-0 right-14 p-4 bg-gradient-to-t from-black via-black/60 to-transparent">
        <div className="flex items-center space-x-2 mb-2">
          <img
            src={profileImage}
            alt={displayName}
            className="w-10 h-10 rounded-full border-2 border-white"
          />
          <Typography className="text-white font-semibold">
            {displayName}
          </Typography>
        </div>
        <Typography className="text-white text-sm break-all">
          {content}
        </Typography>
      </div>
    </div>
  );

  const renderPostLayout = () => (
    <div className="bg-white rounded-lg shadow max-w-[500px] mx-auto">
      <div className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img
              src={profileImage}
              alt={displayName}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <Typography className="font-semibold text-[15px]">
                {displayName}
              </Typography>
              <div className="flex items-center space-x-1 text-xs text-gray-500">
                <span>{format(new Date(), "MMM d")}</span>
                <span>•</span>
                <span>🌍</span>
              </div>
            </div>
          </div>
          <BsThreeDots className="text-gray-500" />
        </div>
      </div>

      <div className="px-3 pb-2">
        <Typography className="text-[15px] mb-3 break-all">
          {content}
        </Typography>
      </div>

      {renderImages()}

      <div className="px-3 pt-2">
        <div className="flex justify-between text-gray-500 text-sm pb-2 border-b">
          <div className="flex items-center gap-1">
            <div className="bg-blue-500 rounded-full p-1">
              <FaRegThumbsUp className="w-3 h-3 text-white" />
            </div>
            <span>0</span>
          </div>
          <div className="flex gap-3">
            <span>0 comments</span>
            <span>0 shares</span>
          </div>
        </div>

        <div className="flex justify-between py-1">
          <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-100 rounded">
            <FaRegThumbsUp className="text-gray-500" />
            <span className="text-gray-500">Like</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-100 rounded">
            <FaRegComment className="text-gray-500" />
            <span className="text-gray-500">Comment</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 py-2 hover:bg-gray-100 rounded">
            <FaShare className="text-gray-500" />
            <span className="text-gray-500">Share</span>
          </button>
        </div>
      </div>
    </div>
  );

  switch (postType) {
    case ContentTypeEnum.REEL:
      return renderReelLayout();
    default:
      return renderPostLayout();
  }
};

export default FacebookPreview;
