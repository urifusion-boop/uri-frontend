import { LiveTv, Memory, TextSnippet, VideoLibrary } from '@mui/icons-material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Collapse from '@mui/material/Collapse';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import * as React from 'react';

interface WeeklyCampaignCalendar {
  topic: string;
  title: string;
  post: string;
  media_type: string;
  day_of_the_week: string;
  post_time: string;
  hashtags: string[];
  mentions?: string[];
  target_audience_countries?: string[];
  post_justification: string;
}

interface RowProps {
  campaign: WeeklyCampaignCalendar;
}

function CampaignRow({ campaign }: RowProps) {
  const [open, setOpen] = React.useState(false);

  const mediaIcon = React.useMemo(() => {
    switch (campaign.media_type.toLowerCase()) {
      case 'video':
        return <VideoLibrary fontSize="small" color="primary" />;
      case 'image':
        return <img alt="Image post" src="/images/image-post.png" />;
      case 'text post':
        return <TextSnippet fontSize="small" color="action" />;
      case 'live video':
        return <LiveTv fontSize="small" color="error" />;
      default:
        return null;
    }
  }, [campaign.media_type]);

  return (
    <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {campaign.topic}
        </TableCell>
        <TableCell>{campaign.title}</TableCell>
        <TableCell>{campaign.day_of_the_week}</TableCell>
        <TableCell>{campaign.post_time}</TableCell>
        <TableCell>
          <Tooltip title={campaign.media_type} placement="top">
            {mediaIcon || <></>}
          </Tooltip>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Details
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Post:</strong> {campaign.post}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Hashtags:</strong>{' '}
                {campaign.hashtags.map((tag) => (
                  <Chip key={tag} label={tag} variant="outlined" size="small" />
                ))}
              </Typography>
              {campaign.mentions && (
                <Typography variant="body2" gutterBottom>
                  <strong>Mentions:</strong>{' '}
                  {campaign.mentions.map((mention) => (
                    <Chip key={mention} label={mention} variant="outlined" size="small" color="primary" />
                  ))}
                </Typography>
              )}
              {campaign.target_audience_countries && (
                <Typography variant="body2" gutterBottom>
                  <strong>Target Audience Countries:</strong> {campaign.target_audience_countries.join(', ')}
                </Typography>
              )}
              <Typography variant="body2" gutterBottom>
                <strong>Post Justification:</strong> {campaign.post_justification}
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
}

interface CampaignTableProps {
  campaigns: WeeklyCampaignCalendar[];
}

export default function CampaignTable({ campaigns }: CampaignTableProps) {
  return (
    <Box
      sx={{
        paddingTop: 3,
        paddingBottom: 3,
        background: 'linear-gradient(90deg, #e3f2fd, #ffffff)',
        borderRadius: 2,
        boxShadow: 3,
      }}
    >
      <Box sx={{ textAlign: 'center', marginBottom: 3 }}>
        <Typography
          variant="h4"
          mb={2}
          fontWeight="bold"
          align="center" // Center the title
        >
          <Memory fontSize="large" color="primary" sx={{ marginRight: 1 }} />
          AI-Powered Weekly Campaign Calendar
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" marginBottom={2} fontSize={15}>
          Drive smarter campaigns with actionable insights generated by AI.
        </Typography>
        <Divider />
      </Box>
      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2, maxWidth: '100%', overflow: 'auto' }}>
        <Table aria-label="campaign table">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
              <TableCell />
              <TableCell>Topic</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Day of the Week</TableCell>
              <TableCell>Post Time</TableCell>
              <TableCell>Media Type</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>{campaigns?.map((campaign, index) => <CampaignRow key={index} campaign={campaign} />)}</TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
