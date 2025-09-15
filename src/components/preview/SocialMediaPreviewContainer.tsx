import { SocialMediaEnum } from "@/models/enum-models/SocialMediaEnum";
import { EditorState } from "draft-js";
import TwitterPreview from "./platforms/TwitterPreview";
import LinkedInPreview from "./platforms/LinkedInPreview";
import FacebookPreview from "./platforms/FacebookPreview";
import InstagramPreview from "./platforms/InstagramPreview";
import TikTokPreview from "./platforms/TikTokPreview";
import { UserDocDto } from "@/models/dtos/base/UserDocDto";
import { ContentTypeEnum } from "@/models/enum-models/ContentTypeEnum";

interface SocialMediaPreviewContainerProps {
  platform: SocialMediaEnum;
  editorState: EditorState | null;
  attachments: UserDocDto[];
  username: string;
  displayName: string;
  profileImage: string;
  postType: ContentTypeEnum;
  selectedPostTypes?: ContentTypeEnum;
}

const SocialMediaPreviewContainer = ({
  platform,
  editorState,
  attachments,
  username,
  displayName,
  profileImage,
  postType,
}: SocialMediaPreviewContainerProps) => {
  const renderInstagramPreviews = () => {
    return (
      <InstagramPreview
        editorState={editorState}
        attachments={attachments}
        username={username}
        displayName={displayName}
        profileImage={profileImage}
        postType={postType}
      />
    );
  };

  const getPreviewComponent = () => {
    switch (platform) {
      case SocialMediaEnum.TWITTER:
        return (
          <TwitterPreview
            editorState={editorState}
            attachments={attachments}
            profileImage={profileImage}
            username={username}
            displayName={displayName}
          />
        );
      case SocialMediaEnum.LINKEDIN:
        return (
          <LinkedInPreview
            editorState={editorState}
            attachments={attachments}
            profileImage={profileImage}
            username={username}
            displayName={displayName}
          />
        );
      case SocialMediaEnum.FACEBOOK:
        return (
          <FacebookPreview
            editorState={editorState}
            attachments={attachments}
            profileImage={profileImage}
            username={username}
            displayName={displayName}
            postType={postType}
          />
        );
      case SocialMediaEnum.INSTAGRAM:
        return renderInstagramPreviews();
      case SocialMediaEnum.TIKTOK:
        return (
          <TikTokPreview
            editorState={editorState}
            attachments={attachments}
            profileImage={profileImage}
            username={username}
            displayName={displayName}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-[500px] mx-auto bg-white rounded-lg shadow-sm">
      {getPreviewComponent()}
    </div>
  );
};

export default SocialMediaPreviewContainer;
