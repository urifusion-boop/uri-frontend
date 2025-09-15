import { CampaignPlatformEnum } from "@/models/enum-models/PlatformEnum";

export class SocialMessagingHelper {
  static getMessagingSteps(campaignPlatformEnum: string): string[] {
    switch (campaignPlatformEnum) {
      case CampaignPlatformEnum.FACEBOOK:
        return [
          "1. Signup (if needed): Go to www.facebook.com and create an account if you don't have one.",
          "2. Login: Log in to your Facebook account.",
          "3. Search: Use the search bar at the top to find the person's name or username.",
          "4. Profile: Click on their profile.",
          "5. Message Button: Click the 'Message' button, usually located below their profile picture.",
          "6. Compose: Type your message in the text box at the bottom of the chat window.",
          "7. Send: Press Enter or click the send icon.",
        ];
      case CampaignPlatformEnum.INSTAGRAM:
        return [
          "1. Signup (if needed): Download the Instagram app or visit www.instagram.com and create an account.",
          "2. Login: Log in to your Instagram account.",
          "3. Search: Use the search bar at the bottom to find the person's username.",
          "4. Profile: Tap or click on their profile.",
          "5. Message Button: Tap or click the 'Message' button.",
          "6. Compose: Type your message in the text box.",
          "7. Send: Tap or click 'Send'.",
        ];
      case CampaignPlatformEnum.X:
      case CampaignPlatformEnum.TWITTER:
        return [
          "1. Signup (if needed): Go to www.twitter.com or download the X app and create an account.",
          "2. Login: Log in to your X account.",
          "3. Search: Use the search bar at the top to find the person's username.",
          "4. Profile: Click on their profile.",
          "5. Message Icon: If they allow DMs from anyone, click the envelope icon. If not, you may need to follow them first.",
          "6. Compose: Type your message in the text box.",
          "7. Send: Click 'Send'.",
        ];
      case CampaignPlatformEnum.LINKEDIN:
        return [
          "1. Signup (if needed): Go to www.linkedin.com and create an account.",
          "2. Login: Log in to your LinkedIn account.",
          "3. Search: Use the search bar at the top to find the person's name or profile.",
          "4. Profile: Click on their profile.",
          "5. Message Button: Click the 'Message' button.",
          "6. Compose: Type your message in the text box.",
          "7. Send: Click 'Send'.",
        ];
      case CampaignPlatformEnum.SNAPCHAT:
        return [
          "1. Signup (if needed): Download the Snapchat app and create an account.",
          "2. Login: Log in to your Snapchat account.",
          "3. Search: Use the search bar at the top to find the person's username.",
          "4. Profile/Chat: Tap on their username to open their profile or start a chat.",
          "5. Compose: Type your message in the text box.",
          "6. Send: Tap the send arrow.",
        ];
      case CampaignPlatformEnum.WHATSAPP:
        return [
          "1. Signup (if needed): Download the WhatsApp app and register with your phone number.",
          "2. Open Chats: Open the 'Chats' tab.",
          "3. New Chat: Tap the new chat icon (usually a speech bubble or a plus sign).",
          "4. Select Contact: Find and select the person from your contacts list.",
          "5. Compose: Type your message in the text box.",
          "6. Send: Tap the send arrow.",
        ];
      case CampaignPlatformEnum.TELEGRAM:
        return [
          "1. Signup (if needed): Download the Telegram app and register with your phone number.",
          "2. Open Chats: Open the 'Chats' tab.",
          "3. New Chat: Tap the new chat icon (usually a pencil or a plus sign).",
          "4. Select Contact: Find and select the person from your contacts list or search for their username.",
          "5. Compose: Type your message in the text box.",
          "6. Send: Tap the send arrow.",
        ];
      case CampaignPlatformEnum.DISCORD:
        return [
          "1. Signup (if needed): Go to www.discord.com or download the Discord app and create an account.",
          "2. Login: Log in to your Discord account.",
          "3. Search: Use the search bar at the top to find the person's username (including their tag, e.g., 'User#1234').",
          "4. Profile: Click on their profile.",
          "5. Message Button: Click the 'Message' button.",
          "6. Compose: Type your message in the text box.",
          "7. Send: Press Enter.",
        ];
      case CampaignPlatformEnum.TIKTOK:
        return [
          "1. Signup (if needed): Download the TikTok app and create an account.",
          "2. Login: Log in to your TikTok account.",
          "3. Search: Use the search bar at the top to find the person's username.",
          "4. Profile: Tap on their profile.",
          "5. Message Button: Tap the 'Message' button. Note that some users disable direct messages.",
          "6. Compose: Type your message in the text box.",
          "7. Send: Tap the send arrow.",
        ];
      case CampaignPlatformEnum.REDDIT:
        return [
          "1. Signup (if needed): Go to www.reddit.com or download the Reddit app and create an account.",
          "2. Login: Log in to your Reddit account.",
          "3. Search: Use the search bar at the top to find the person's username.",
          "4. Profile: Click on their profile.",
          "5. Start Chat/Send Message: Click 'Start Chat' or 'Send Message' (the wording can vary).",
          "6. Compose: Type your message in the text box.",
          "7. Send: Click 'Send'.",
        ];
      case CampaignPlatformEnum.NAIRALAND:
        return [
          "1. Signup (if needed): Go to www.nairaland.com/ and create an account.",
          "2. Search for the person you want to message on Nairaland.",
          "3. Visit their profile page.",
          "4. Click the 'Follow' button on their profile to send request.",
          "5. The user must accept your follow request before you can message them.",
          "6. Once connected, go back to their profile.",
          "7. Look for the 'Message' or 'PM' (Private Message) button.",
          "8. Click the button to open the chat interface.",
          "9. Type your message and send it.",
        ];
      default:
        return [];
    }
  }
}
