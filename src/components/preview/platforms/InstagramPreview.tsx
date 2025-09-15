import React from "react";
import { EditorState } from "draft-js";
import { FaRegHeart, FaRegComment, FaShare, FaBookmark } from "react-icons/fa";
import { MediaHelper } from "@/helpers/MediaHelper";
import { MediaTypeEnum } from "@/models/enum-models/MediaTypeEnum";
import { TextHelper } from "@/helpers/TextHelper";
import { UserDocDto } from "@/models/dtos/base/UserDocDto";
import { ContentTypeEnum } from "@/models/enum-models/ContentTypeEnum";
import { IoMusicalNote } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";

interface InstagramPreviewProps {
  editorState: EditorState | null;
  attachments: UserDocDto[];
  profileImage: string;
  username: string;
  displayName: string;
  postType: ContentTypeEnum;
  selectedPostTypes?: ContentTypeEnum[];
}

const InstagramPreview = ({
  editorState,
  attachments,
  profileImage,
  username,
  displayName,
  postType,
  selectedPostTypes,
}: InstagramPreviewProps) => {
  const content = editorState?.getCurrentContent().getPlainText() || "";

  const renderImages = () => {
    if (attachments.length === 0) return null;

    const containerClassName =
      postType === ContentTypeEnum.STORY
        ? "relative aspect-[9/16] max-w-[320px] mx-auto"
        : postType === ContentTypeEnum.REEL
          ? "relative aspect-[9/16] max-w-[468px]"
          : "relative aspect-square";

    const attachment = attachments[0];
    const isVideo =
      MediaHelper.getMediaType(attachment?.docType) !== MediaTypeEnum.IMAGE;
    const mediaClassName = `w-full h-full object-cover ${
      postType === ContentTypeEnum.STORY ? "rounded-xl" : "rounded-none"
    }`;

    return (
      <div className={containerClassName}>
        {isVideo ? (
          <video
            src={TextHelper.setUrl(attachment?.url)}
            className={mediaClassName}
            autoPlay
            muted
            loop
            controls={postType === ContentTypeEnum.REEL}
          />
        ) : (
          <img
            src={TextHelper.setUrl(attachment?.url)}
            alt="Preview"
            className={mediaClassName}
          />
        )}

        {attachments.length > 1 && (
          <div className="absolute top-0 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center">
            <span className="text-white">+ {attachments.length - 1}</span>
          </div>
        )}
      </div>
    );
  };

  const renderStoryLayout = () => (
    <div className="bg-gradient-to-b from-gray-900/10 to-gray-900 max-w-[320px] mx-auto h-[600px] relative rounded-xl overflow-hidden">
      {renderImages()}
      <div className="absolute top-0 left-0 right-0 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <img
                src={profileImage}
                alt={displayName}
                className="w-8 h-8 rounded-full border-2 border-white"
              />
              <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                +
              </div>
            </div>
            <span className="text-white font-semibold text-sm drop-shadow-lg">
              {username}
            </span>
            <span className="text-white/60 text-xs">3h</span>
          </div>
          <div className="flex space-x-4">
            <button className="text-white">⏸️</button>
            <button className="text-white">
              <BsThreeDots />
            </button>
          </div>
        </div>
      </div>
      {content && (
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
          <p className="text-white text-sm leading-relaxed break-all">
            {content}
          </p>
        </div>
      )}
    </div>
  );

  const renderReelLayout = () => (
    <div className="bg-black max-w-[320px] mx-auto h-[600px] relative rounded-xl overflow-hidden">
      {renderImages()}
      <div className="absolute bottom-0 right-0 flex flex-col items-center space-y-6 p-4">
        <button className="text-white">
          <FaRegHeart className="w-7 h-7" />
          <span className="text-xs mt-1">0k</span>
        </button>
        <button className="text-white">
          <FaRegComment className="w-7 h-7" />
          <span className="text-xs mt-1">0</span>
        </button>
        <button className="text-white">
          <FaShare className="w-7 h-7" />
          <span className="text-xs mt-1">Share</span>
        </button>
        <button className="text-white">
          <FaBookmark className="w-7 h-7" />
          <span className="text-xs mt-1">Save</span>
        </button>
      </div>
      <div className="absolute bottom-0 left-0 right-14 p-4 bg-gradient-to-t from-black/60 to-transparent">
        <div className="flex items-center space-x-2 mb-2">
          <img
            src={profileImage}
            alt={displayName}
            className="w-10 h-10 rounded-full border-2 border-white"
          />
          <span className="text-white font-semibold">{username}</span>
          <button className="bg-white/10 text-white px-4 py-1 rounded-md text-sm">
            Follow
          </button>
        </div>
        {content && (
          <p className="text-white text-sm mb-4 break-all max-h-20 overflow-y-auto no-scroll">
            {content}
          </p>
        )}
        <div className="flex items-center space-x-2">
          <IoMusicalNote className="text-white" />
          <span className="text-white text-sm">
            Original Audio • {username}
          </span>
        </div>
      </div>
    </div>
  );

  const renderPostLayout = () => (
    <div className="bg-white max-w-[468px] mx-auto rounded-xl overflow-hidden border border-gray-200">
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <img
              src={profileImage}
              alt={displayName}
              className="w-8 h-8 rounded-full ring-2 ring-red-500 ring-offset-2"
            />
          </div>
          <div>
            <span className="font-semibold text-sm">{username}</span>
            <div className="text-xs text-gray-500">Original Post</div>
          </div>
        </div>
        <button className="text-gray-800">
          <BsThreeDots />
        </button>
      </div>

      {renderImages()}

      <div className="p-3">
        <div className="flex justify-between items-center mb-2">
          <div className="flex space-x-4">
            <FaRegHeart className="w-6 h-6 hover:text-red-500 transition-colors" />
            <FaRegComment className="w-6 h-6 hover:text-blue-500 transition-colors" />
            <FaShare className="w-6 h-6 hover:text-green-500 transition-colors" />
          </div>
          <FaBookmark className="w-6 h-6 hover:text-yellow-500 transition-colors" />
        </div>

        <div className="text-sm mt-2">
          <span className="font-semibold mr-2">{username}</span>
          <span className="whitespace-pre-wrap break-all">{content}</span>
        </div>

        <div className="text-gray-500 text-xs mt-2 cursor-pointer hover:underline">
          View all 0 comments
        </div>
        <div className="text-gray-400 text-[10px] mt-1 uppercase tracking-wide">
          now
        </div>
      </div>

      <div className="border-t p-3 flex items-center space-x-3">
        <button className="text-gray-400 hover:text-gray-500">😊</button>
        <input
          type="text"
          placeholder="Add a comment..."
          className="flex-1 text-sm outline-none placeholder-gray-400"
        />
        <button className="text-blue-500 font-semibold text-sm opacity-50">
          Post
        </button>
      </div>
    </div>
  );

  if (postType === ContentTypeEnum.STORY) return renderStoryLayout();
  if (postType === ContentTypeEnum.REEL) return renderReelLayout();
  return renderPostLayout();
};

export default InstagramPreview;
