import React from "react";
import { EditorState } from "draft-js";
import {
  FaRegComment,
  FaRetweet,
  FaRegHeart,
  FaShareSquare,
} from "react-icons/fa";
import { format } from "date-fns";
import { Typography } from "@mui/material";
import { TextHelper } from "@/helpers/TextHelper";
import { UserDocDto } from "@/models/dtos/base/UserDocDto";
import { MediaTypeEnum } from "@/models/enum-models/MediaTypeEnum";
import { MediaHelper } from "@/helpers/MediaHelper";

interface TwitterPreviewProps {
  editorState: EditorState | null;
  attachments: UserDocDto[];
  profileImage: string;
  username: string;
  displayName: string;
}

const TwitterPreview = ({
  editorState,
  attachments,
  profileImage,
  username,
  displayName,
}: TwitterPreviewProps) => {
  const content = editorState?.getCurrentContent().getPlainText() || "";

  const renderImages = () => {
    const imageCount = attachments.length;
    if (imageCount === 0) return null;

    const gridTemplateClass = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-2",
      4: "grid-cols-2",
    }[Math.min(imageCount, 4)];

    return (
      <div
        className={`grid ${gridTemplateClass} gap-0.5 rounded-2xl overflow-hidden mt-3`}
      >
        {attachments.slice(0, 4).map((image, index) => (
          <div
            key={index}
            className={`relative ${
              imageCount === 3 && index === 0 ? "row-Typography-2" : ""
            }`}
          >
            {MediaHelper.getMediaType(image?.docType) ===
            MediaTypeEnum.IMAGE ? (
              <img
                src={TextHelper.setUrl(image?.url)}
                alt={`image ${index + 1}`}
                className="w-full h-full object-cover"
                style={{ aspectRatio: imageCount === 1 ? "16/9" : "1/1" }}
              />
            ) : (
              <video
                src={TextHelper.setUrl(image?.url)}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  borderRadius: "5px",
                  aspectRatio: imageCount === 1 ? "16/9" : "1/1",
                }}
                autoPlay
                muted
                loop
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4">
      <div className="">
        <div className="flex items-center gap-2">
          <img
            src={profileImage}
            alt={displayName}
            className="w-12 h-12 rounded-full"
          />
          <div className="flex items-center">
            <Typography className="font-bold">{displayName}</Typography>
            <Typography className="text-gray-500">@{username}</Typography>
          </div>
        </div>
        <div className="flex-1">
          <div className="mt-1">
            <p className="text-[15px] whitespace-pre-wrap break-all">
              {content}
            </p>
            {renderImages()}
          </div>

          <div className="flex justify-between mt-3 max-w-md text-gray-500">
            <button className="flex items-center space-x-2 hover:text-blue-500">
              <FaRegComment className="w-4 h-4" />
              <Typography>0</Typography>
            </button>
            <button className="flex items-center space-x-2 hover:text-green-500">
              <FaRetweet className="w-4 h-4" />
              <Typography>0</Typography>
            </button>
            <button className="flex items-center space-x-2 hover:text-red-500">
              <FaRegHeart className="w-4 h-4" />
              <Typography>0</Typography>
            </button>
            <button className="flex items-center space-x-2 hover:text-blue-500">
              <FaShareSquare className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwitterPreview;
