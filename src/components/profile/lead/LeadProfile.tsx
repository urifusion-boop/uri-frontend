import { LeadDto } from '@/models/dtos/LeadsDto';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import FavoriteIcon from '@mui/icons-material/Favorite';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { Avatar, Box, Card, CardContent, Chip, Divider, Grid, IconButton, Paper, Tab, Tabs, Typography } from '@mui/material';
import React from 'react';

// Example Data
const tags = ['test tag x', 'another tag x', 'test tag x', 'another tag', 'another tag x', 'test tag x', 'another tag x', 'test tag x', 'another tag x'];

const timelineData = [
  {
    month: 'August, 2016',
    items: [
      {
        date: '12 Aug',
        type: 'TASK ADDED',
        text: 'Prepare for a bi-weekly meeting to discuss new features',
        time: '09:30am',
        icon: <AccessTimeIcon sx={{ fontSize: 18, color: '#c1c8d7' }} />,
      },
      {
        date: '10 Aug',
        type: 'DEAL ADDED',
        text: 'Deal for the property in Malibu with Casey Brother Real Estate',
        time: '11:30am',
        icon: <LocalOfferIcon sx={{ fontSize: 18, color: '#c1c8d7' }} />,
      },
      {
        date: '10 Aug',
        type: 'EVENT COMPLETED',
        text: 'Meet with Claudia in the «Caffee Caldo» for Brunch',
        time: '11:30am',
        icon: <EventAvailableIcon sx={{ fontSize: 18, color: '#c1c8d7' }} />,
      },
    ],
  },
  {
    month: 'July, 2016',
    items: [
      {
        date: '12 Aug',
        type: 'TASK ADDED',
        text: 'Prepare for a bi-weekly meeting to discuss new features',
        time: '09:30am',
        icon: <AccessTimeIcon sx={{ fontSize: 18, color: '#c1c8d7' }} />,
      },
      {
        date: '10 Aug',
        type: 'DEAL ADDED',
        text: 'Deal for the property in Malibu with Casey Brother Real Estate',
        time: '11:30am',
        icon: <LocalOfferIcon sx={{ fontSize: 18, color: '#c1c8d7' }} />,
      },
      {
        date: '10 Aug',
        type: 'EVENT COMPLETED',
        text: 'Meet with Claudia in the «Caffee Caldo» for Brunch',
        time: '11:30am',
        icon: <EventAvailableIcon sx={{ fontSize: 18, color: '#c1c8d7' }} />,
      },
    ],
  },
];

// Tabs List
const tabs = ['Timeline', 'Notes', 'Events', 'Tasks', 'Deals', 'Campaigns', 'Web Stats', 'Mail', 'Documents'];

const LeadProfile = ({ lead, onClose }: { lead: LeadDto; onClose: () => void }) => {
  const [tab, setTab] = React.useState(0);

  return (
    <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh', p: 2 }}>
      <IconButton onClick={onClose}>
        <CloseIcon />
      </IconButton>
      <Grid container spacing={2}>
        {/* Left Profile Card */}
        <Grid item xs={12} md={3.5}>
          <Card sx={{ borderRadius: 2, boxShadow: '0 2px 16px 0 rgba(145,158,171,.08)' }}>
            <Box sx={{ position: 'relative', bgcolor: '#212f3c', borderRadius: '8px 8px 0 0', p: 1.5, textAlign: 'center' }}>
              <Avatar
                src={lead.picture_url}
                sx={{
                  width: 86,
                  height: 86,
                  margin: 'auto',
                  mt: 2,
                  boxShadow: '0 2px 8px 0 rgba(145,158,171,.20)',
                }}
              />
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600, mt: 2 }}>
                {lead.first_name} {lead.last_name}
              </Typography>
              <Typography sx={{ color: '#c1c8d7', fontSize: 15 }}>
                {lead.job_title} @ {lead.company_name}
              </Typography>
              <Box sx={{ mt: 1, mb: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                <Box>
                  {[...Array(4)].map((_, i) => (
                    <StarIcon key={i} sx={{ color: '#fbc02d', fontSize: 22 }} />
                  ))}
                  <StarBorderIcon sx={{ color: '#fbc02d', fontSize: 22 }} />
                </Box>
                <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor: '#e0e3e8' }} />
                <FavoriteIcon sx={{ color: '#e25d5d', fontSize: 20, mr: 0.5 }} />
                <Typography sx={{ color: '#e25d5d', fontWeight: 600 }}>128</Typography>
              </Box>
            </Box>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, mt: 1 }}>
                Contact Information
              </Typography>
              <Typography sx={{ fontSize: 14, mb: 0.3 }}>Email:</Typography>
              <Typography color="text.secondary" sx={{ mb: 0.5, ml: 1, fontSize: 14 }}>
                {lead.lead_email}
              </Typography>
              <Typography sx={{ fontSize: 14, mb: 0.3 }}>Phone:</Typography>
              <Typography color="text.secondary" sx={{ mb: 0.5, ml: 1, fontSize: 14 }}>
                {lead.phone}
              </Typography>
              <Typography sx={{ fontSize: 14, mb: 0.3 }}>Address:</Typography>
              <Typography color="text.secondary" sx={{ mb: 1, ml: 1, fontSize: 14 }}>
                {lead.location}
              </Typography>

              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Custom Information
              </Typography>
              <Typography sx={{ fontSize: 14, mb: 0.3 }}>Facebook:</Typography>
              <Typography color="text.secondary" sx={{ mb: 0.5, ml: 1, fontSize: 14 }}>
                {lead.facebook_url}
              </Typography>
              <Typography sx={{ fontSize: 14, mb: 0.3 }}>Personal Phone Number:</Typography>
              <Typography color="text.secondary" sx={{ mb: 1, ml: 1, fontSize: 14 }}>
                {lead.phone}
              </Typography>

              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                Tags
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                {lead?.tags?.map((tag, i) => <Chip key={i} label={tag} sx={{ bgcolor: '#f6f6f6', color: '#a6a6a6', fontSize: 13, height: 24 }} />)}
              </Box>
              <Typography sx={{ fontSize: 14, mt: 1, mb: 0.5 }}>
                Owner: <b>Mark Hansen</b>
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Timeline + Widgets */}
        <Grid item xs={12} md={8.5}>
          <Box>
            {/* Tabs Row */}
            <Box sx={{ borderBottom: 1, borderColor: '#e6e9ef', display: 'flex', alignItems: 'center', background: '#f8fafc' }}>
              <Tabs
                value={tab}
                onChange={(_, v) => setTab(v)}
                textColor="primary"
                indicatorColor="primary"
                sx={{
                  minHeight: 40,
                  '& .MuiTabs-indicator': { background: '#507dfc' },
                }}
              >
                {tabs.map((t, i) => (
                  <Tab
                    key={i}
                    label={t}
                    sx={{
                      fontWeight: 500,
                      fontSize: 15,
                      minWidth: 80,
                      color: '#b0b7c4',
                      '&.Mui-selected': { color: '#507dfc' },
                    }}
                  />
                ))}
              </Tabs>
              <Box flex={1} />
              {/* Nav arrows */}
              <IconButton size="small">
                <KeyboardArrowLeftIcon />
              </IconButton>
              <IconButton size="small">
                <KeyboardArrowRightIcon />
              </IconButton>
            </Box>

            {/* Timeline Content */}
            <Paper sx={{ bgcolor: '#fff', mt: 2, p: 3, borderRadius: 2, minHeight: 480, maxHeight: 480, overflowY: 'auto', boxShadow: '0 2px 12px 0 rgba(145,158,171,.04)' }}>
              {/* Timeline structure */}
              {timelineData.map((section, idx) => (
                <Box key={section.month} sx={{ mb: 2 }}>
                  <Typography sx={{ color: '#9ca5b4', fontWeight: 600, fontSize: 15, mb: 2 }}>{section.month}</Typography>
                  <Box>
                    {section.items.map((item, j) => (
                      <Box key={j} sx={{ display: 'flex', alignItems: 'flex-start', mb: 3 }}>
                        <Box sx={{ width: 56, textAlign: 'right', pt: 0.6 }}>
                          <Typography sx={{ color: '#507dfc', fontWeight: 500, fontSize: 15 }}>{item.date}</Typography>
                        </Box>
                        <Box sx={{ pl: 2, pr: 3, minWidth: 24, position: 'relative' }}>
                          <Box
                            sx={{
                              position: 'absolute',
                              left: 11,
                              top: 0,
                              bottom: -18,
                              width: 2,
                              bgcolor: '#e8eaf3',
                              zIndex: 0,
                            }}
                          />
                          <Box
                            sx={{
                              position: 'relative',
                              zIndex: 1,
                              mt: 0.3,
                              mb: 0.3,
                              bgcolor: '#fff',
                              border: '2.5px solid #507dfc',
                              borderRadius: '50%',
                              width: 14,
                              height: 14,
                            }}
                          />
                        </Box>
                        <Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography sx={{ color: '#b0b7c4', fontWeight: 500, fontSize: 13 }}>{item.type}</Typography>
                            {item.icon}
                          </Box>
                          <Typography sx={{ fontWeight: 500, fontSize: 16, mt: 0.3 }}>{item.text}</Typography>
                          <Typography sx={{ color: '#b0b7c4', fontSize: 14, mt: 0.3 }}>{item.time}</Typography>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Box>
              ))}
            </Paper>
            {/* Widgets row */}
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2, boxShadow: '0 2px 8px 0 rgba(145,158,171,.04)' }}>
                  <Avatar sx={{ bgcolor: '#44a2ec', width: 44, height: 44 }}>{/* <SkypeIcon /> */}S</Avatar>
                  <Box>
                    <Typography sx={{ fontWeight: 500, fontSize: 15, mb: 0.3 }}>Phone</Typography>
                    <Typography sx={{ color: '#b0b7c4', fontSize: 15 }}>{lead.phone}</Typography>
                    <Typography sx={{ color: '#507dfc', fontSize: 14 }}>{lead.phone}</Typography>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper sx={{ p: 2, borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2, boxShadow: '0 2px 8px 0 rgba(145,158,171,.04)' }}>
                  <Avatar sx={{ bgcolor: '#0070ba', width: 44, height: 44 }}>{/* <PayPalIcon /> */}P</Avatar>
                  <Box>
                    <Typography sx={{ fontWeight: 500, fontSize: 15, mb: 0.3 }}>Email</Typography>
                    <Typography sx={{ color: '#b0b7c4', fontSize: 15 }}>{lead.lead_email}</Typography>
                    <CheckCircleIcon sx={{ color: '#7bd43d', fontSize: 18, ml: 0.5, verticalAlign: 'middle' }} />
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LeadProfile;
