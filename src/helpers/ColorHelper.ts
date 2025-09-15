export class ColorHelper {
  static generateRandomColor = (text?: string): string => {
    if (text) {
      // Convert text to hash
      let hash = 0;
      for (let i = 0; i < text.length; i++) {
        hash = text.charCodeAt(i) + ((hash << 5) - hash);
      }

      // Convert hash to a 6-digit hex color
      let color = "#";
      for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff;
        color += value.toString(16).padStart(2, "0");
      }

      return color;
    }

    // Generate random color if no text is provided
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  static getSocialMediaColor = (socialMedia: string) => {
    const socialMediaColors: Record<string, string> = {
      facebook: "#1877F2", // Facebook Blue
      twitter: "#1DA1F2", // Twitter Blue
      instagram: "#E1306C", // Instagram Pink
      linkedin: "#0077B5", // LinkedIn Blue
      youtube: "#FF0000", // YouTube Red
      whatsapp: "#25D366", // WhatsApp Green
      snapchat: "#FFFC00", // Snapchat Yellow
      tiktok: "#010101", // TikTok Black
      pinterest: "#BD081C", // Pinterest Red
      reddit: "#FF4500", // Reddit Orange
      tumblr: "#36465D", // Tumblr Dark Blue
      medium: "#00AB6C", // Medium Green
      github: "#181717", // GitHub Black
      discord: "#5865F2", // Discord Purple
      slack: "#4A154B", // Slack Purple
      skype: "#00AFF0", // Skype Blue
      telegram: "#0088CC", // Telegram Blue
      wechat: "#09B83E", // WeChat Green
      vimeo: "#1AB7EA", // Vimeo Blue
      flickr: "#FF0084", // Flickr Pink
    };

    return (
      socialMediaColors[socialMedia.toLowerCase()] || this.generateRandomColor()
    );
  };

  static getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "#27ae60";
      case "negative":
        return "#e74c3c";
      case "neutral":
        return "#f39c12";
      default:
        return "#f39c12";
    }
  };
}
