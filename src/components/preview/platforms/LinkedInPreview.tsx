import React from "react";
import { EditorState } from "draft-js";
import { FaRegThumbsUp, FaRegComment, FaShare } from "react-icons/fa";
import { format } from "date-fns";

import { MediaHelper } from "@/helpers/MediaHelper";
import { MediaTypeEnum } from "@/models/enum-models/MediaTypeEnum";
import { TextHelper } from "@/helpers/TextHelper";
import { UserDocDto } from "@/models/dtos/base/UserDocDto";
import { Typography } from "@mui/material";

interface LinkedInPreviewProps {
  editorState: EditorState | null;
  attachments: UserDocDto[];
  profileImage: string;
  username: string;
  displayName: string;
}

const LinkedInPreview = ({
  editorState,
  attachments,
  profileImage,
  username,
  displayName,
}: LinkedInPreviewProps) => {
  const content = editorState?.getCurrentContent().getPlainText() || "";

  const renderImages = () => {
    const imageCount = attachments.length;
    if (imageCount === 0) return null;

    if (imageCount === 1) {
      const media = attachments[0];
      return (
        <div className="mt-3">
          {MediaHelper.getMediaType(media?.docType) === MediaTypeEnum.IMAGE ? (
            <img
              src={TextHelper.setUrl(media?.url)}
              alt="Post media"
              className="w-full rounded-lg"
              style={{ maxHeight: "400px", objectFit: "cover" }}
            />
          ) : (
            <video
              src={TextHelper.setUrl(media?.url)}
              className="w-full rounded-lg"
              style={{ maxHeight: "400px", objectFit: "cover" }}
              autoPlay
              muted
              loop
            />
          )}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-2 gap-1 mt-3">
        {attachments.slice(0, 4).map((media, index) => (
          <div key={index} className="relative aspect-square">
            {MediaHelper.getMediaType(media?.docType) ===
            MediaTypeEnum.IMAGE ? (
              <img
                src={TextHelper.setUrl(media?.url)}
                alt={`Preview ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <video
                src={TextHelper.setUrl(media?.url)}
                className="w-full h-full object-cover rounded-lg"
                autoPlay
                muted
                loop
              />
            )}
            {imageCount > 4 && index === 3 && (
              <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-lg">
                <Typography className="text-white text-xl font-bold">
                  +{imageCount - 4}
                </Typography>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg">
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <img
            src={profileImage}
            alt={displayName}
            className="w-12 h-12 rounded-full"
          />
          <div>
            <div className="flex flex-col">
              <Typography className="font-semibold text-[14px]">
                {displayName}
              </Typography>
              <Typography className="text-gray-500 text-[12px]">
                {username} • {format(new Date(), "MMM d")}
              </Typography>
            </div>
          </div>
        </div>

        <div className="mt-3">
          <p className="text-[14px] whitespace-pre-wrap break-all">{content}</p>
          {renderImages()}
        </div>

        <div className="flex items-center justify-between mt-4 pt-2 border-t">
          <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600">
            <FaRegThumbsUp className="w-5 h-5" />
            <Typography className="text-sm">Like</Typography>
          </button>
          <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600">
            <FaRegComment className="w-5 h-5" />
            <Typography className="text-sm">Comment</Typography>
          </button>
          <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-600">
            <FaShare className="w-5 h-5" />
            <Typography className="text-sm">Share</Typography>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LinkedInPreview;
