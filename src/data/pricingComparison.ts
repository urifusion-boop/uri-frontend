export const pricingData = {
  headers: ['Social Listening Free', 'Social Listening Paid', 'Enterprise'],
  prices: ['Free', 'Paid', 'Custom'],
  sections: [
    {
      title: 'Tracking & Monitoring',
      rows: [
        { label: 'Keyword Tracking', values: ['1 Tracker', 'Unlimited', 'Unlimited'] },
        { label: 'Social Accounts', values: ['1 Account', '3 Accounts', 'Unlimited'] },
        { label: 'Hashtag Tracking', values: ['1 Hashtag', 'Unlimited', 'Unlimited'] },
        { label: 'Content Management', values: [true, true, true] },
      ],
    },
    {
      title: 'Reporting',
      rows: [
        { label: 'Reports', values: ['1 / Month', '4 / Month', 'Unlimited'] },
        { label: 'AI Insights', values: [true, true, true] },
      ],
    },
    {
      title: 'Support',
      rows: [
        { label: 'Email Support', values: [true, true, true] },
        { label: 'Advanced Support', values: [false, false, true] },
        { label: 'Team Collaboration', values: [false, false, true] },
      ],
    },
  ],
};
