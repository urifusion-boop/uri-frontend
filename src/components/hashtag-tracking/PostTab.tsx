import { LightThemeColors } from '@/configs/colors.config';
import { TextHelper } from '@/helpers/TextHelper';
import { HashtagTrackPost } from '@/models/dtos/HashTagDto';
import { Box, ListItemText, MenuItem, Select, Skeleton, Typography } from '@mui/material';
import dayjs from 'dayjs';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { BsStack } from 'react-icons/bs';
import { CgHashtag } from 'react-icons/cg';
import { FaCalendarAlt } from 'react-icons/fa';
import EmptyState from '../atoms/EmptyState';
import SelectedPost from '../cards/SelectedCard';
import HashtagPostCard from './HashtagPostCard';

interface PostTabProps {
  posts: HashtagTrackPost[];
  isLoading?: boolean;
}

const PostTab = ({ posts, isLoading }: PostTabProps) => {
  const [selectPost, setSelectedPost] = useState<HashtagTrackPost | null>(null);
  const [page, setPage] = useState(1);
  const [postState, setPostState] = useState<HashtagTrackPost[] | null>(null);
  const [selectDateRange, setSelectDateRange] = useState('Last 30 days');
  const [selectedPlatform, setSelectedPlatform] = useState('Instagram');

  const dateRanges = ['Last 30 days', 'Last 7 days', 'Last 24 hours', 'Clear'];
  const platform = ['Facebook', 'Instagram', 'Web', 'Clear'];

  useEffect(() => {
    if (!selectPost) {
      setSelectedPost(posts[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [posts]);

  const filterByDateRange = (posts: HashtagTrackPost[], range: string): HashtagTrackPost[] => {
    const now = dayjs(); // Current date

    // Calculate the start date based on the range
    let startDate: dayjs.Dayjs;
    switch (range) {
      case 'Last 30 days':
        startDate = now.subtract(30, 'day');
        break;
      case 'Last 7 days':
        startDate = now.subtract(7, 'day');
        break;
      case 'Last 24 hours':
        startDate = now.subtract(1, 'day');
        break;
      default:
        break;
    }

    // Filter posts based on the timestamp
    return posts.filter((post) => dayjs(post.timestamp).isAfter(startDate));
  };

  const handlePlatformChange = (platform: string) => {
    if (platform === 'Clear') {
      return setPostState(posts);
    }

    setSelectedPlatform(platform);

    // Filter posts based on selected platforms
    const filteredPosts = posts.filter((post) => TextHelper.getDomainName(post.permalink).includes(platform.toLowerCase()));

    setPostState(filteredPosts);
  };

  useEffect(() => {
    setPostState(posts);
  }, [posts]);

  useEffect(() => {
    if (postState && selectDateRange) {
      if (selectDateRange === 'Clear') {
        return setPostState(posts);
      }
      const filteredPosts = filterByDateRange(posts, selectDateRange);
      setPostState(filteredPosts);
    }
  }, [selectDateRange]);

  return (
    <Box>
      {/* Filters */}

      <Box
        sx={{
          width: '100%',
          backgroundColor: '#fff',
          padding: '20px',
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: '20px',
        }}
      >
        <Select
          labelId="icon-select-label"
          value={selectDateRange}
          onChange={(e) => {
            setSelectDateRange(e.target.value);
          }}
          sx={{
            '& .MuiSelect-select': {
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
            },
            '& .MuiListItemIcon-root': {
              width: 'fit-content !important',
            },
            backgroundColor: '#F2F2F299',
          }}
          startAdornment={<FaCalendarAlt size={24} />}
          placeholder="Last 30 days"
        >
          {dateRanges.map((dateRange, index) => (
            <MenuItem key={dateRange} value={dateRange}>
              <ListItemText
                primary={dateRange}
                sx={{
                  ml: 1,
                }}
              />
            </MenuItem>
          ))}
        </Select>

        <Select
          labelId="icon-select-label"
          value={selectedPlatform}
          onChange={(e) => {
            handlePlatformChange(e.target.value);
          }}
          sx={{
            '& .MuiSelect-select': {
              display: 'flex',
              gap: '10px',
              alignItems: 'center',
            },
            '& .MuiListItemIcon-root': {
              width: 'fit-content !important',
            },
            backgroundColor: '#F2F2F299',
          }}
          startAdornment={<BsStack size={24} />}
        >
          {platform.map((plat, index) => (
            <MenuItem key={plat} value={plat}>
              <ListItemText
                primary={plat}
                sx={{
                  ml: 1,
                }}
              />
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* Main */}
      <Box
        sx={{
          padding: '16px',
          display: 'flex',
          gap: '29px',
          alignItems: 'flex-start',
        }}
      >
        {/* First */}
        <Box
          sx={{
            backgroundColor: '#fff',
            borderRadius: '10px',
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.05)',
            padding: '26px 20px',
            width: '60%',
          }}
        >
          {/*  Title */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '20px',
            }}
          >
            <Typography
              color="#141416"
              sx={{
                fontSize: '24px',
                fontWeight: 600,
              }}
            >
              Recent Posts
            </Typography>
            <Box
              sx={{
                display: 'flex',
                gap: '20px',
                alignItems: 'center',
              }}
            >
              <Typography>{`Last updated ${moment(posts?.[0]?.timestamp).fromNow()}`}</Typography>
              {/* <Button variant="outlined">Update</Button> */}
            </Box>
          </Box>

          {/*Post  */}
          <Box
            sx={{
              maxHeight: '600px',
              overflowY: 'auto',
            }}
            className="scroll"
            onScroll={(e) => {
              const bottom = Math.ceil(e.currentTarget.scrollTop + e.currentTarget.clientHeight) >= e.currentTarget.scrollHeight;

              if (bottom && page * 10 < posts.length) {
                setPage(page + 1);
              }
            }}
          >
            <Box
              sx={{
                flexDirection: 'column',
                display: 'flex',
                height: '100%',
                gap: '20px',
                mt: '20px',
              }}
            >
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    variant="rectangular"
                    sx={{
                      borderRadius: '5px',
                      height: '150px',
                    }}
                  />
                ))
              ) : postState && postState.length > 0 ? (
                (postState ?? [])
                  .slice(0, page * 10)
                  ?.map((item, index) => <HashtagPostCard key={index} post={item} onSelectPost={(post) => setSelectedPost(post)} isSelected={selectPost?.id === item.id} />)
              ) : (
                <EmptyState heading="No posts found" subtitle="No posts found for the selected filters" actionRequired={false} icon={<CgHashtag color={LightThemeColors.primary} size={40} />} />
              )}
            </Box>
          </Box>
        </Box>

        {/* Second */}
        {isLoading ? (
          <Skeleton
            variant="rectangular"
            sx={{
              borderRadius: '10px',
              width: '40%',
              height: '400px',
            }}
          />
        ) : (
          <SelectedPost selectPost={selectPost ?? {}} maxHeight="680px" />
        )}
      </Box>
    </Box>
  );
};

export default PostTab;
