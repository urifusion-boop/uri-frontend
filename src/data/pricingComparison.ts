export const pricingData = {
  headers: ['Standard', 'Professional', 'Business', 'Enterprise'],
  prices: ['₦35k', '₦160k', '₦240k', 'Custom'],
  sections: [
    {
      title: '',
      rows: [
        { label: 'Keyword Tracking', values: ['Up to 2 Trackers', 'Up to 3 Trackers', 'Up to 7 Trackers', 'Unlimited'] },
        { label: 'Account Tracking', values: ['Up to 2 Social Accounts', 'Up to 3 Social Accounts', 'Up to 6 Social Accounts', 'Unlimited'] },
        { label: 'Content Management', values: [true, true, true, true] },
        { label: 'Hashtag Tracking', values: ['Up to 2 Hashtags', 'Up to 3 Hashtags', 'Up to 6 Hashtags', 'Unlimited'] },
        { label: 'Lead generation', values: ['70 credits & 1000 Leads', '350 credits & 5000 Leads', '500 credits & 10000 Leads', 'Unlimited'] },
        { label: 'Team collaboration', values: [false, false, true, true] },
      ],
    },
    {
      title: 'Lead Generation Sources',
      rows: [
        { label: 'X (Twitter)', values: [false, false, true, true] },
        { label: 'Instagram', values: [true, true, true, true] },
        { label: 'LinkedIn', values: [true, true, true, true] },
        { label: 'Reddit', values: [true, true, true, true] },
        { label: 'Facebook', values: [true, true, true, true] },
      ],
    },
    {
      title: 'AI Features',
      rows: [
        { label: 'AI Recommendation', values: [false, true, true, true] },
        { label: 'AI Insight Assistant', values: [false, true, true, true] },
      ],
    },
    {
      title: 'Reports and Alerts',
      rows: [
        { label: 'Alerts', values: [false, false, false, true] },
        { label: 'Daily Reports', values: [false, true, true, true] },
        { label: 'Weekly Report', values: [false, false, false, true] },
        { label: 'PDF Reports', values: [false, false, false, true] },
      ],
    },
    {
      title: 'Support and Access',
      rows: [
        { label: 'Email Support', values: [true, true, true, true] },
        { label: 'Advanced Support', values: [false, false, false, true] },
      ],
    },
  ],
};
