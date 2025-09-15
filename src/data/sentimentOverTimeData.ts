import { FaAt, FaChartLine, FaLocationDot } from 'react-icons/fa6';
import { IoAtCircle, IoPerson, IoStatsChart } from 'react-icons/io5';
import { TbChartPieFilled, TbClipboardText, TbMessageStar } from 'react-icons/tb';

import { BsChatSquareHeart } from 'react-icons/bs';
import { FaHashtag } from 'react-icons/fa';
import { LiaGripLinesSolid } from 'react-icons/lia';
import { MdOutlineConnectedTv } from 'react-icons/md';
import { PiChartBarFill } from 'react-icons/pi';

export const sentimentOverTimeData = [
  { date: '2024-07-30', positive: 1, negative: 0, neutral: 0 },
  { date: '2024-10-04', positive: 1, negative: 0, neutral: 0 },
  { date: '2024-10-16', positive: 0, negative: 0, neutral: 1 },
  { date: '2024-11-13', positive: 0, negative: 0, neutral: 1 },
  { date: '2024-11-29', positive: 20, negative: 3, neutral: 2 },
];

export const reportGenerationData = {
  keyword: [
    { title: 'Web Post Distribution', icon: TbChartPieFilled },
    { title: 'Top Mentions', icon: IoAtCircle },
    { title: 'Sentiment Analysis Graph', icon: IoStatsChart },
    {
      title: 'Top Hashtag',
      icon: FaHashtag,
    },
    {
      title: 'Top Posts',
      icon: TbClipboardText,
    },
    {
      title: 'Influencers',
      icon: IoPerson,
    },
  ],
  lead: [
    { title: 'Web Post Distribution', icon: TbChartPieFilled },
    { title: 'Top Mentions', icon: IoAtCircle },
    { title: 'Sentiment Analysis Graph', icon: IoStatsChart },
    {
      title: 'Top Hashtag',
      icon: FaHashtag,
    },
    {
      title: 'Top Posts',
      icon: TbClipboardText,
    },
    {
      title: 'Influencers',
      icon: IoPerson,
    },
  ],
  account: [
    { title: 'Engagement Graph', icon: PiChartBarFill },
    { title: 'Audience Location', icon: FaLocationDot },
    { title: 'Latest Posts', icon: MdOutlineConnectedTv },
    {
      title: 'Summary and Achievement',
      icon: LiaGripLinesSolid,
    },
    // {
    //   title: "Activity Overview",
    //   icon: TbClipboardText,
    // },
    {
      title: 'Suggested Improvement',
      icon: TbMessageStar,
    },
  ],
  hashtag: [
    { title: 'Mention and Reach Graph', icon: FaChartLine },
    { title: 'Sentiment Analysis', icon: IoStatsChart },
    { title: 'Recent Posts', icon: MdOutlineConnectedTv },
    { title: 'Hashtag Mentions', icon: FaAt },
    { title: 'Post Type Distribution', icon: TbChartPieFilled },
    { title: 'Related Hashtags', icon: FaHashtag },
    { title: 'Trending Hashtags', icon: FaHashtag },
    { title: 'AI Recommendations', icon: BsChatSquareHeart },
  ],
  alert: [
    { title: 'Total Alerts', icon: TbChartPieFilled },
    { title: 'High Priority Alerts', icon: IoAtCircle },
    { title: 'Negative Alerts', icon: IoStatsChart },
    {
      title: 'Business Health Score',
      icon: FaHashtag,
    },
    {
      title: 'Positive Alerts',
      icon: TbClipboardText,
    },
    {
      title: 'AI Recommendation',
      icon: IoPerson,
    },
    {
      title: 'Trend Analysis',
      icon: TbClipboardText,
    },
    {
      title: 'Sentiment Analysis',
      icon: IoPerson,
    },
  ],
};
