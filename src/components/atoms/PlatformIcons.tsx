import {
  FaFacebook,
  FaInstagramSquare,
  FaLinkedin,
  FaPinterestSquare,
  FaReddit,
  FaTumblrSquare,
  FaYoutube,
} from "react-icons/fa";
import { FaSquareXTwitter, FaTiktok } from "react-icons/fa6";
interface PlatformIconsProps {
  platform: string;
  color?: string;
  size?: number;
  imageIcon?: boolean; // Either an image or an icon
}

const PlatformIcon = ({
  platform,
  color,
  size,
  imageIcon = true,
}: PlatformIconsProps) => {
  const getSocialMediaIcon = (platform: string) => {
    const normalizedPlatform = platform.toLowerCase();

    switch (true) {
      case normalizedPlatform.includes("facebook"):
        return imageIcon ? (
          <img
            src="/assets/icons/facebook.svg"
            height={size ?? 20}
            width={size ?? 20}
            alt="facebook icon"
          />
        ) : (
          <FaFacebook color={color ?? "#1877f2"} size={size ?? 16} />
        );
      case normalizedPlatform.includes("twitter") ||
        normalizedPlatform.includes("x"):
        return imageIcon ? (
          <img
            src="/assets/images/x.png"
            height={size ?? 20}
            width={size ?? 20}
            alt="x icon"
          />
        ) : (
          <FaSquareXTwitter color={color ?? "#1DA1F2"} size={size ?? 16} />
        );
      case normalizedPlatform.includes("instagram"):
        return imageIcon ? (
          <img
            src="/assets/icons/instagram.svg"
            height={size ?? 20}
            width={size ?? 20}
            alt="instagram icon"
          />
        ) : (
          <FaInstagramSquare color={color ?? "#E1306C"} size={size ?? 16} />
        );
      case normalizedPlatform.includes("linkedin"):
        return imageIcon ? (
          <img
            src="/assets/icons/linkedin.svg"
            height={size ?? 20}
            width={size ?? 20}
            alt="linkedin icon"
          />
        ) : (
          <FaLinkedin color={color ?? "#0A66C2"} size={size ?? 16} />
        );
      case normalizedPlatform.includes("youtube"):
        return imageIcon ? (
          <img
            src="/assets/icons/youtube.svg"
            height={size ?? 20}
            width={size ?? 20}
            alt="youtube icon"
          />
        ) : (
          <FaYoutube color={color ?? "#FF0000"} size={size ?? 16} />
        );
      case normalizedPlatform.includes("tiktok"):
        return imageIcon ? (
          <img
            src="/assets/icons/tiktok.svg"
            height={size ?? 20}
            width={size ?? 20}
            alt="tiktok icon"
          />
        ) : (
          <FaTiktok color={color ?? "#000"} size={size ?? 16} />
        );
      case normalizedPlatform.includes("pinterest"):
        return imageIcon ? (
          <img
            src="/assets/icons/pinterest.svg"
            height={size ?? 20}
            width={size ?? 20}
            alt="pinterest icon"
          />
        ) : (
          <FaPinterestSquare color={color ?? "#E60023"} size={size ?? 16} />
        );
      case normalizedPlatform.includes("reddit"):
        return <FaReddit color={color ?? "#FF5700"} size={size ?? 16} />;
      case normalizedPlatform.includes("tumblr"):
        return imageIcon ? (
          <img
            src="/assets/icons/tumblr.svg"
            height={size ?? 20}
            width={size ?? 20}
            alt="tumblr icon"
          />
        ) : (
          <FaTumblrSquare color={color ?? "#001935"} size={size ?? 16} />
        );
      case normalizedPlatform.includes("nairaland"):
        return (
          <img
            src="/assets/images/nairaland.png"
            height={(size ?? 20) - 5}
            width={(size ?? 20) - 5}
            alt="tumblr icon"
          />
        );
      default:
        return (
          <img
            src="/assets/icons/globe.svg"
            height={size ?? 20}
            width={size ?? 20}
            alt="world icon"
          />
        );
    }
  };

  return <>{getSocialMediaIcon(platform)}</>;
};

export default PlatformIcon;
