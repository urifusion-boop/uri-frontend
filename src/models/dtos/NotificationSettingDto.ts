export interface NotificationSettingDto extends InsightNotificationSettingsDto {
  _id?: string;
  __v?: number;
  isDeleted?: boolean;
  userId?: string;
  generalNotificationSettings?: GeneralNotificationSettingsDto;
  jobNotificationSettings?: JobNotificationSettingsDto;
  otherNotificationSettings?: OtherNotificationSettingsDto;
  createdAt?: string;
  updatedAt?: string;
  description?: string;
}

export interface InsightNotificationSettingsDto {
  keywordTrackingNotificationSettings: SettingDto;
  leadTrackingNotificationSettings: LeadSettingDto;
  accountTrackingNotificationSettings: SettingDto;
  alertNotificationSettings: SettingDto;
}
export interface GeneralNotificationSettingsDto {
  isEmailTurnedOn: boolean;
  isInAppTurnedOn: boolean;
  isPushTurnedOn: boolean;
  _id: string;
}

export interface JobNotificationSettingsDto {
  isJobUpdatesTurnedOn: boolean;
  isBookingUpdatesTurnedOn: boolean;
  isJobApplicationUpdatesTurnedOn: boolean;
  _id: string;
}

export interface OtherNotificationSettingsDto {
  isReviewUpdatesTurnedOn: boolean;
  isTasksUpdatesTurnedOn: boolean;
  isLikesTurnedOn: boolean;
  _id: string;
}

export interface PriorityDto {
  email: boolean;
  inApp: boolean;
}

export interface LeadSettingDto {
  highPriority?: PriorityDto;
  mediumPriority?: PriorityDto;
  lowPriority?: PriorityDto;
  followupReminder?: PriorityDto;
  isPaused?: boolean;
  preferredEmail?: string;
  recurringFrequency?: string;
  dayOfMonth?: number;
  _id?: string;
  trackingType?: string;
}
export interface SettingDto {
  isPaused?: boolean;
  preferredEmail?: string;
  recurringFrequency?: string;
  dayOfMonth?: number;
  _id?: string;
  trackingType?: string;
}
