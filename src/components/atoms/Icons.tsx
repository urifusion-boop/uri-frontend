import useCustomTheme from '@/hooks/theme.hook';
import Link from 'next/link';
import React from 'react';

interface IconProps {
  width?: number;
  height?: number;
  removeLink?: boolean;
  href?: string;
}

export const UriLogo: React.FC<IconProps> = ({ width, height, removeLink, href }) => {
  return removeLink ? (
    <img src="/assets/images/logo.png" alt="logo" width={width ?? 50} height={height ?? 30} />
  ) : (
    <Link href={href ?? '/dashboard'}>
      <img src="/assets/images/logo.png" alt="logo" width={width ?? 50} height={height ?? 30} />
    </Link>
  );
};

export const GoogleIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/google-icon.svg" width={width ?? 24} height={height ?? 24} alt="google-icon" />;
};

export const PremiumIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/premium-icon.svg" width={width ?? 24} height={height ?? 24} alt="premium-icon" />;
};

export const PremiumInverseIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/premium-inverse-icon.svg" width={width ?? 76} height={height ?? 54} alt="premium-inverse-icon" />;
};

export const GetStartedIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/get-started-icon.svg" width={width ?? 20} height={height ?? 20} alt="premium-inverse-icon" />;
};
export const PersonalDetailsIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/personal-details-icon.svg" width={width ?? 20} height={height ?? 20} alt="" />;
};
export const PostRoundedIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/post-rounded-icon.svg" width={width ?? 24} height={height ?? 24} alt="" />;
};
export const DownloadIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/download-icon.svg" width={width ?? 36} height={height ?? 32} alt="" />;
};
export const EyesOnIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/eyes-on.svg" width={width ?? 36} height={height ?? 32} alt="" />;
};
export const ExportIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/export.svg" width={width ?? 14} height={height ?? 14} alt="" />;
};
export const FilterIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/filter.svg" width={width ?? 14} height={height ?? 14} alt="" />;
};

export const EnvelopeIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/envelope-icon.svg" width={width ?? 20} height={height ?? 20} alt="" />;
};
export const RocketIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/rocket-icon.svg" width={width ?? 20} height={height ?? 20} alt="" />;
};

export const ChatBotSendIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/chatbot-send-icon.svg" width={width ?? 18} height={height ?? 18} alt="premium-inverse-icon" />;
};

export const ShoppingPremiumIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/shopping-premium-icon.svg" alt="shopping-premium-icon" />;
};

export const SubscriptionCancelledIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/subscription-cancelled-icon.svg" width={width ?? 186} height={height ?? 186} alt="subscription-cancelled-icon" />;
};

export const GooglePlayStoreIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/playstore-icon.svg" width={width ?? 28} height={height ?? 28} alt="playstore-icon" />;
};
export const AppleIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/apple-icon.svg" width={width ?? 28} height={height ?? 28} alt="playstore-icon" />;
};

export const AwardPrimaryIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/award-primary-icon.svg" width={width ?? 24} height={height ?? 24} alt="award-icon" />;
};

export const CautionPrimaryIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/caution-icon-primary.svg" width={width ?? 24} height={height ?? 24} alt="caution-icon" />;
};

export const CrownPrimaryIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/crown-primary-icon.svg" width={width ?? 24} height={height ?? 24} alt="crown-icon" />;
};

export const ForgotPasswordIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/forgot-password-icon.svg" width={width ?? 194} height={height ?? 194} alt="forgot-password-icon" />;
};

export const ResetPasswordIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/reset-password-icon.svg" width={width ?? 194} height={height ?? 194} alt="reset-password-icon" />;
};

export const EmailConfirmedIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/email-confirmed-icon.svg" width={width ?? 194} height={height ?? 194} alt="email-confirmed-icon" />;
};

export const RankIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/rank-icon.svg" width={width ?? 24} height={height ?? 24} alt="rank-icon" />;
};

export const LeaderBoardIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/leaderboard-icon.svg" width={width ?? 24} height={height ?? 24} alt="leaderboard-icon" />;
};

export const ErrorIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/error-icon.svg" width={width ?? 20} height={height ?? 20} alt="error-icon" />;
};

export const ClientIcon: React.FC<IconProps> = ({ width, height }) => {
  const { currentTheme } = useCustomTheme();
  return <img src={currentTheme === 'light' ? '/assets/icons/client-icon.svg' : '/assets/icons/client-dark-icon.svg'} width={width ?? 25} height={height ?? 32} alt="client-icon" />;
};

export const HoveredClientIcon: React.FC<IconProps> = ({ width, height }) => {
  const { currentTheme } = useCustomTheme();
  return <img src={currentTheme === 'light' ? '/assets/icons/client-hover-light-icon.svg' : '/assets/icons/client-hover-dark-icon.svg'} width={width ?? 25} height={height ?? 32} alt="client-icon" />;
};

export const NotificationIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/notification-icon.svg" width={width ?? 24} height={height ?? 24} alt="social-icon" />;
};

export const SearchIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/search-icon.svg" width={width ?? 24} height={height ?? 24} alt="search-icon" />;
};

export const ModelAttendeeIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/model-attendee-icon.svg" width={width ?? 24} height={height ?? 24} alt="model-attendee-icon" />;
};

export const PhotographerAttendeeIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/photographer-attendee-icon.svg" width={width ?? 24} height={height ?? 24} alt="photographer-attendee-icon" />;
};

export const ApplicationIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/application-icon.svg" width={width ?? 30} height={height ?? 30} alt="application-icon" />;
};

export const ApprovedIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/approved-icon.svg" width={width ?? 30} height={height ?? 30} alt="approved-icon" />;
};

export const AreaChartIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/area-chart-icon.svg" width={width ?? 30} height={height ?? 30} alt="area-chart-icon" />;
};

export const BotIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/bot-icon.svg" width={width ?? 30} height={height ?? 30} alt="bot-icon" />;
};

export const BusinessIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/business-icon.svg" width={width ?? 30} height={height ?? 30} alt="business-icon" />;
};

export const ClimberIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/climber-icon.svg" width={width ?? 30} height={height ?? 30} alt="climber-icon" />;
};

export const PersonalGrowthIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/personal-growth-icon.svg" width={width ?? 30} height={height ?? 30} alt="personal-growth-icon" />;
};

export const SchedulingIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/scheduling-icon.svg" width={width ?? 30} height={height ?? 30} alt="scheduling-icon" />;
};

export const SirenIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/siren-icon.svg" width={width ?? 30} height={height ?? 30} alt="siren-icon" />;
};

export const SmilingFaceIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/smiling-face-icon.svg" width={width ?? 30} height={height ?? 30} alt="smiling-face-icon" />;
};

export const WebAnalyticsIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/web-analytics-icon.svg" width={width ?? 30} height={height ?? 30} alt="web-analytics-icon" />;
};

export const HelpQuestionIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/help-question-icon.svg" width={width ?? 40} height={height ?? 40} alt="web-analytics-icon" />;
};

export const CollaboratorIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/collaborator-icon.svg" width={width ?? 50} height={height ?? 50} alt="web-analytics-icon" />;
};
export const TargetIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/target-icon.svg" width={width ?? 50} height={height ?? 50} alt="web-analytics-icon" />;
};
export const PeopleIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/people-icon.svg" width={width ?? 50} height={height ?? 50} alt="web-analytics-icon" />;
};
export const BusinessNetworkIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/business-network.svg" width={width ?? 20} height={height ?? 20} alt="icon" />;
};
export const CrowdIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/crowd-icon.svg" width={width ?? 20} height={height ?? 20} alt="icon" />;
};
export const CsvIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/csv-icon.svg" width={width ?? 20} height={height ?? 20} alt="icon" />;
};
export const IncreaseIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/increase-icon.svg" width={width ?? 20} height={height ?? 20} alt="icon" />;
};
export const ComboChartIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/combo-chart.svg" width={width ?? 50} height={height ?? 50} alt="icon" />;
};
export const FinancialGrowthIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/financial-growth.svg" width={width ?? 50} height={height ?? 50} alt="icon" />;
};
export const ELearningIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/e-learning.svg" width={width ?? 50} height={height ?? 50} alt="icon" />;
};
export const PopularWomanIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/popular-woman.svg" width={width ?? 50} height={height ?? 50} alt="icon" />;
};
export const AlertIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/alert.svg" width={width ?? 50} height={height ?? 50} alt="icon" />;
};
export const TaskIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/task-icon.svg" width={width ?? 20} height={height ?? 20} alt="icon" />;
};
export const SixParticularOutlineIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/six-particular-outline.svg" width={width ?? 20} height={height ?? 20} alt="icon" />;
};
export const DashboardComboIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/dashboard-combo.svg" width={width ?? 20} height={height ?? 20} alt="icon" />;
};
export const DashboardNotificationIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/dashboard-notification-icon.svg" width={width ?? 35} height={height ?? 35} alt="icon" />;
};
export const MessageInboxIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/message-icon.svg" width={width ?? 35} height={height ?? 35} alt="icon" />;
};
export const SentimentCommentIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/sentiment-comment.svg" width={width ?? 20} height={height ?? 20} alt="icon" />;
};
export const MentionsCommentIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/mentions-comment.svg" width={width ?? 20} height={height ?? 20} alt="icon" />;
};
export const SyncImportIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/sync-import.svg" width={width ?? 20} height={height ?? 20} alt="icon" />;
};
export const FileImportIcon: React.FC<IconProps> = ({ width, height }) => {
  return <img src="/assets/icons/file-import.svg" width={width ?? 20} height={height ?? 20} alt="icon" />;
};
