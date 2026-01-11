import { InfluencerDto } from '@/models/dtos/InfluencerDto';
import { CampaignPlatformEnum } from '@/models/enum-models/PlatformEnum';

export class PlatformHelper {
  // Validate and return the platform
  public static getValidPlatform(socialPlatform: string | undefined | null): CampaignPlatformEnum | null {
    const platform = socialPlatform?.toUpperCase();
    return [CampaignPlatformEnum.INSTAGRAM, CampaignPlatformEnum.FACEBOOK, CampaignPlatformEnum.TIKTOK].includes(platform as CampaignPlatformEnum) ? (platform as CampaignPlatformEnum) : null;
  }

  // Determine the platform icon based on social platform
  public static getPlatformIcon(account: InfluencerDto, accountIcons: Record<'Instagram' | 'X' | 'TikTok' | 'Facebook' | 'Twitter' | 'Linkedin', React.ReactElement>): React.ReactElement | null {
    // Map CampaignPlatformEnum values to accountIcons keys
    const platformIconMap: Record<string, keyof typeof accountIcons> = {
      [CampaignPlatformEnum.INSTAGRAM]: 'Instagram',
      [CampaignPlatformEnum.FACEBOOK]: 'Facebook',
      [CampaignPlatformEnum.TIKTOK]: 'TikTok',
      [CampaignPlatformEnum.X]: 'X',
      [CampaignPlatformEnum.TWITTER]: 'Twitter',
      [CampaignPlatformEnum.LINKEDIN]: 'Linkedin',
    };

    const platform = account.social_platform?.toUpperCase();
    const iconKey = platform ? platformIconMap[platform] : null;

    return iconKey ? accountIcons[iconKey] : null;
  }

  public static getSocialIcon(
    social_platform: string,
    accountIcons: Record<'Instagram' | 'X' | 'TikTok' | 'Facebook' | 'Twitter' | 'Reddit' | 'Linkedin' | 'Jobberman' | 'LinkedIn_Jobs' | 'Indeed', React.ReactElement>
  ): React.ReactElement | null {
    // Map CampaignPlatformEnum values to accountIcons keys
    const platformIconMap: Record<string, keyof typeof accountIcons> = {
      [CampaignPlatformEnum.INSTAGRAM]: 'Instagram',
      [CampaignPlatformEnum.FACEBOOK]: 'Facebook',
      [CampaignPlatformEnum.TIKTOK]: 'TikTok',
      [CampaignPlatformEnum.X]: 'X',
      [CampaignPlatformEnum.TWITTER]: 'Twitter',
      [CampaignPlatformEnum.REDDIT]: 'Reddit',
      [CampaignPlatformEnum.LINKEDIN]: 'Linkedin',
      [CampaignPlatformEnum.JOBBERMAN]: 'Jobberman',
      [CampaignPlatformEnum.LINKEDIN_JOBS]: 'LinkedIn_Jobs',
      [CampaignPlatformEnum.INDEED]: 'Indeed',
    };

    const platform = social_platform?.toUpperCase();
    const iconKey = platform ? platformIconMap[platform] : null;

    return iconKey ? accountIcons[iconKey] : null;
  }

  static getSocialUserDetailsByPlatform(data: InfluencerDto[], platform: string, social_id?: string) {
    const profile = data.find((item) => item.social_platform === platform && item.social_user_id === social_id);

    return {
      username: profile?.social_name,
      profile_pic: profile?.profile_pic,
      display_name: profile?.social_name,
    };
  }

  static hasConnectedPlatform(data: InfluencerDto[] | undefined, platform: string | undefined): boolean {
    if (!data || !platform) return false;
    return data.some((item) => item.social_platform === platform && item.connected);
  }

  static getConnectedPlatform(data: InfluencerDto[] | undefined, platform: string | undefined): InfluencerDto | undefined {
    if (!data || !platform) return undefined;
    return data.find((item) => item.social_platform === platform && item.connected);
  }

  static isConnected(account: InfluencerDto | undefined): boolean {
    return account?.connected ?? false;
  }

  static getPlatformColor(platform: string): string {
    const colors: Record<string, string> = {
      twitter: '#1DA1F2',
      facebook: '#4267B2',
      instagram: '#E1306C',
      linkedin: '#0077B5',
      youtube: '#FF0000',
      tiktok: '#000000',
      default: '#666666',
    };

    return colors[platform.toLowerCase()] || colors.default;
  }

  static formatCount(count: number | undefined): string {
    if (!count) return '0';

    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  }

  static getPlatformFromUrl(url: string): CampaignPlatformEnum {
    if (url.includes('instagram.com')) return CampaignPlatformEnum.INSTAGRAM;
    if (url.includes('facebook.com')) return CampaignPlatformEnum.FACEBOOK;
    if (url.includes('tiktok.com')) return CampaignPlatformEnum.TIKTOK;
    if (url.includes('twitter.com')) return CampaignPlatformEnum.TWITTER;
    // Check for LinkedIn Jobs before regular LinkedIn
    if (url.includes('linkedin.com/jobs')) return CampaignPlatformEnum.LINKEDIN_JOBS;
    if (url.includes('linkedin.com')) return CampaignPlatformEnum.LINKEDIN;
    if (url.includes('reddit.com')) return CampaignPlatformEnum.REDDIT;
    if (url.includes('snapchat.com')) return CampaignPlatformEnum.SNAPCHAT;
    if (url.includes('whatsapp.com')) return CampaignPlatformEnum.WHATSAPP;
    if (url.includes('telegram.org')) return CampaignPlatformEnum.TELEGRAM;
    if (url.includes('discord.com')) return CampaignPlatformEnum.DISCORD;
    if (url.includes('nairaland.com')) return CampaignPlatformEnum.NAIRALAND;
    // Job boards
    if (url.includes('jobberman.com')) return CampaignPlatformEnum.JOBBERMAN;
    if (url.includes('indeed.com')) return CampaignPlatformEnum.INDEED;
    return CampaignPlatformEnum.WEBSITE;
  }
}
