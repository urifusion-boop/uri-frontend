export enum BrowsercloudPlatformEnum {
  TWITTER = 'TWITTER',
  LINKEDIN = 'LINKEDIN',
  FACEBOOK = 'FACEBOOK',
  THREADS = 'THREADS',
  TIKTOK = 'TIKTOK',
  JOB_BOARDS = 'JOB_BOARDS',
}

export const PlatformDisplayNames: Record<BrowsercloudPlatformEnum, string> = {
  [BrowsercloudPlatformEnum.TWITTER]: 'Twitter/X',
  [BrowsercloudPlatformEnum.LINKEDIN]: 'LinkedIn',
  [BrowsercloudPlatformEnum.FACEBOOK]: 'Facebook',
  [BrowsercloudPlatformEnum.THREADS]: 'Threads',
  [BrowsercloudPlatformEnum.TIKTOK]: 'TikTok',
  [BrowsercloudPlatformEnum.JOB_BOARDS]: 'Job Boards',
};
