// constants/accountIcons.tsx

import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LanguageIcon from '@mui/icons-material/Language';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PinterestIcon from '@mui/icons-material/Pinterest';
import RedditIcon from '@mui/icons-material/Reddit';
import TelegramIcon from '@mui/icons-material/Telegram';
import TwitterIcon from '@mui/icons-material/Twitter';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import WorkIcon from '@mui/icons-material/Work';
import YouTubeIcon from '@mui/icons-material/YouTube';
import SvgIcon from '@mui/material/SvgIcon';
import { ReactElement } from 'react';

// TikTok and X SVG icons as custom components
const TikTokIcon = (props: any): ReactElement => (
  <SvgIcon {...props} viewBox="0 0 256 256">
    <path
      d="M223.9 80.2c-19.8-3.5-34.6-17.2-38.5-37.1-0.7-3.6-1.1-7.3-1.1-11V32h-33.6v124.5c0 15.2-12.3 27.5-27.5 27.5s-27.5-12.3-27.5-27.5 12.3-27.5 27.5-27.5c2.6 0 5.2 0.4 7.6 1.1V95.5c-2.5-0.3-5-0.5-7.6-0.5-33.6 0-61 27.3-61 61s27.3 61 61 61 61-27.3 61-61V113c13.4 8.7 29.5 13.7 46.9 13.7v-33.5c-5.3 0.1-10.6-0.4-15.8-1.5z"
      fill="#000000"
    />
  </SvgIcon>
);

const XBrandIcon = (props: any): ReactElement => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path d="M20.3 3H17l-4.6 5.6L8.3 3H3.6l6.6 9.3L3 21h3.4l5.1-6.3 4.3 6.3h4.7l-7.1-9.9L20.3 3z" fill="#000000" />
  </SvgIcon>
);

export const accountIcons: Record<string, JSX.Element> = {
  Instagram: <InstagramIcon color="secondary" />,
  Twitter: <TwitterIcon color="secondary" />,
  Facebook: <FacebookIcon color="secondary" />,
  Linkedin: <LinkedInIcon color="secondary" />,
  Reddit: <RedditIcon color="secondary" />,
  YouTube: <YouTubeIcon color="secondary" />,
  Pinterest: <PinterestIcon style={{ color: '#E60023' }} />,
  WhatsApp: <WhatsAppIcon style={{ color: '#25D366' }} />,
  TikTok: <TikTokIcon style={{ color: '#CD1B78' }} />,
  X: <XBrandIcon style={{ color: '#000' }} />,
  Website: <LanguageIcon color="action" />,
  Telegram: <TelegramIcon color="secondary" />,
  // Job Boards
  Jobberman: <WorkIcon style={{ color: '#00A550' }} />,
  LinkedIn_Jobs: <WorkIcon style={{ color: '#0077B5' }} />,
  Indeed: <WorkIcon style={{ color: '#2164F3' }} />,
};
