export enum BrowsercloudPlatformEnum {
  TWITTER = 'TWITTER',
  LINKEDIN = 'LINKEDIN',
  FACEBOOK = 'FACEBOOK',
  THREADS = 'THREADS',
}

export const PlatformDisplayNames: Record<BrowsercloudPlatformEnum, string> = {
  [BrowsercloudPlatformEnum.TWITTER]: 'Twitter/X',
  [BrowsercloudPlatformEnum.LINKEDIN]: 'LinkedIn',
  [BrowsercloudPlatformEnum.FACEBOOK]: 'Facebook',
  [BrowsercloudPlatformEnum.THREADS]: 'Threads',
};
