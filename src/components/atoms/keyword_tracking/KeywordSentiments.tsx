import { TextHelper } from '@/helpers/TextHelper';
import useTheme from '@/hooks/theme.hook';
import { KeywordTrackerSentimentsDto, SentimentOverTimeDto, SingleSentimentData } from '@/models/dtos/TrackerDto';
import { Box, Checkbox, Divider, Grid, IconButton, Skeleton, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { FaCaretDown } from 'react-icons/fa6';
import { ImHappy2 } from 'react-icons/im';
import CardHeaderDropdown from '../CardHeaderDropdown';
import Sentiments from '../Sentiments';
import FeedsCard from './FeedsCard';

interface FeedsCardProps {
  sentimentData: KeywordTrackerSentimentsDto | null;
  keywords?: string[];
  date?: {
    label: string;
    date: string;
  };
  filterOptions?: {
    label: string;
    onClick: () => void;
  }[];
  loading?: boolean;
  total?: number;
  sentimentOverTimeData?: SentimentOverTimeDto[];
}

export const KeywordSentiments = ({ sentimentData, keywords, date, filterOptions, loading, total, sentimentOverTimeData }: FeedsCardProps) => {
  const [search, setSearch] = useState<string>('');
  const [selectSentiment, setSelectedSentiment] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [sentimentDataState, setSentimentDataState] = useState<KeywordTrackerSentimentsDto | null | undefined>(sentimentData);

  const { themeColors } = useTheme();

  const socialMediaPlatform = ['facebook', 'twitter', 'instagram', 'web', 'youtube', 'linkedIn', 'pinterest', 'reddit', 'tiktok'];

  const mockSentimentData = {
    totalFeedback: sentimentData?.total_results ?? 0,
    sentiments: [
      {
        sentiment: 'Positive',
        percentage: 0,
      },
      {
        sentiment: 'Neutral',
        percentage: 0,
      },
      {
        sentiment: 'Negative',
        percentage: 0,
      },
    ],
    pieData: [
      {
        x: 'Positive',
        y: sentimentData?.overall_sentiment?.positive ?? 0,
      },
      {
        x: 'Neutral',
        y: sentimentData?.overall_sentiment?.neutral ?? 0,
      },
      {
        x: 'Negative',
        y: sentimentData?.overall_sentiment?.negative ?? 0,
      },
    ],
  };

  const filterBySearch = (search: string) => {
    const filteredData = sentimentData?.sentiment?.filter((sentiment) => {
      return sentiment?.comment?.toLowerCase().includes(search.trim().toLowerCase());
    });

    setSentimentDataState({
      ...sentimentData,
      sentiment: filteredData,
    });
  };

  const filterBySentiment = (sentiment: string) => {
    const updatedSentiments = selectSentiment?.includes(sentiment) ? selectSentiment.filter((s) => s !== sentiment) : [...selectSentiment, sentiment];

    setSelectedSentiment(updatedSentiments);

    const filteredData = sentimentData?.sentiment?.filter((item) => {
      if (updatedSentiments.length === 0) return true;
      return updatedSentiments.includes(item?.sentiment?.sentiment ?? '');
    });

    setSentimentDataState({
      ...sentimentDataState,
      sentiment: filteredData,
    });
  };

  const filterByPlatform = (platform: string) => {
    const updatedPlatform = selectedPlatforms?.includes(platform) ? selectedPlatforms.filter((s) => s !== platform) : [...selectedPlatforms, platform];

    setSelectedPlatforms(updatedPlatform);

    const filteredData = sentimentData?.sentiment?.filter((item) => {
      if (updatedPlatform.length === 0) return true;

      return updatedPlatform.includes('web') ? !socialMediaPlatform.includes(TextHelper.getDomainName(item?.website ?? '')) : updatedPlatform.includes(TextHelper.getDomainName(item?.website ?? ''));
    });

    setSentimentDataState({
      ...sentimentDataState,
      sentiment: filteredData,
    });
  };

  const scatterChartSentimentData: SingleSentimentData[] | undefined = sentimentData?.sentiment?.map((item) => ({
    timestamp: item.timestamp ?? '',
    text: item.comment ?? '',
    id: item.timestamp ?? item.comment ?? crypto.randomUUID(),
    sentiment: {
      text: item.sentiment?.text ?? '',
      score: item.sentiment?.score ?? 0,
      magnitude: item.sentiment?.magnitude ?? 0,
      sentiment: item.sentiment?.sentiment ?? '',
    },
  }));

  const sentiments = ['positive', 'neutral', 'negative'];

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive':
        return '#27ae60';
      case 'negative':
        return '#e74c3c';
      case 'neutral':
        return '#f39c12';
      default:
        return '#f39c12';
    }
  };

  useEffect(() => {
    setSentimentDataState(sentimentData);
  }, [sentimentData]);

  return loading ? (
    <Grid container spacing={2} px={{ xs: 2 }}>
      {Array.from({ length: 4 }).map((_, i) => (
        <Grid item xs={12} md={3} key={`skeleton-grid-${i}`}>
          <Skeleton key={`skeleton-${i}`} variant="rectangular" width="100%" height="60px" animation="wave" />
        </Grid>
      ))}
      <Grid item xs={12}>
        <Skeleton variant="rectangular" width="100%" height="200px" animation="wave" />
      </Grid>
    </Grid>
  ) : (
    <Box px={4} pb={4} mt={4} width={'100%'}>
      <Box>
        <Box sx={{ mb: 3 }}>
          <Sentiments
            sentimentData={mockSentimentData}
            tags={['Platform Distribution', 'Sentiment Distribution']}
            scatterData={scatterChartSentimentData}
            total={total}
            sentimentOverTimeData={sentimentOverTimeData}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            mb: 2,
            flexDirection: {
              xs: 'column',
              md: 'row',
            },
            gap: 2,
          }}
        >
          <CardHeaderDropdown
            options={filterOptions ?? []}
            icon={
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: themeColors.primary,
                    fontWeight: 700,
                    ml: {
                      xs: 1,
                      md: 3,
                      lg: 4,
                    },
                  }}
                >
                  {date?.label ?? 'This week'}
                </Typography>
                <IconButton sx={{ color: themeColors.primary, cursor: 'pointer' }}>
                  <FaCaretDown />{' '}
                </IconButton>
              </Box>
            }
          />

          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flexGrow: 1,
              width: '100%',
              justifyContent: 'end',
            }}
          >
            <Box>
              <TextField
                label="Search"
                variant="outlined"
                size="small"
                sx={{
                  borderRadius: '90px',
                  borderColor: themeColors.primary,
                  padding: 0.2,
                  width: 'auto',
                  '& .MuiOutlinedInput-root': {
                    borderColor: themeColors.primary,
                    borderRadius: '90px',
                    boxShadow: 1,
                    fontSize: '10px',
                    height: '40px',
                  },
                }}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  filterBySearch(e.target.value);
                }}
              />
            </Box>
            {/* <Box sx={{ display: "flex" }}>
              <Button
                sx={{
                  color: "green",
                  width: "auto",
                  borderRadius: "90px",
                  p: 1,
                  display: "flex",
                  gap: 1,
                  boxShadow: 1,
                }}
              >
                <PiMicrosoftExcelLogoDuotone />
                Export Feeds
              </Button>
            </Box> */}
          </Box>
        </Box>
      </Box>

      <Divider />

      <Box
        sx={{
          display: 'flex',
          gap: 4,
          flexDirection: {
            xs: 'column',
            md: 'row',
          },
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          gap={2}
          width={{
            xs: '100%',
            md: '70%',
          }}
          sx={{
            maxHeight: '600px',
            overflow: 'auto',
          }}
          className="scroll"
          onScroll={(e) => {
            const bottom = Math.ceil(e.currentTarget.scrollTop + e.currentTarget.clientHeight) >= e.currentTarget.scrollHeight - 1;

            if (bottom && page * 10 < (sentimentDataState?.sentiment ?? []).length) {
              setPage(page + 1);
            }
          }}
        >
          {sentimentDataState?.sentiment && sentimentDataState?.sentiment?.length > 0 ? (
            sentimentDataState?.sentiment?.slice(0, page * 10)?.map((sentiment, index) => <FeedsCard key={index} sentiment={sentiment} tags={keywords ?? ['']} />)
          ) : (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: {
                  xs: '200px',
                  md: '80vh',
                },
                width: '100%',
              }}
            >
              <Typography variant="h6">No feeds found</Typography>
            </Box>
          )}
        </Box>

        <Box
          sx={{
            width: {
              xs: '100%',
              md: '30%',
            },
            borderRadius: 2,
            boxShadow: 2,
            height: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            alignItems: 'start',
            border: '1px solid lightgray',
            justifyContent: 'start',
          }}
        >
          <Box sx={{ display: 'grid', width: '100%' }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                px: 2,
                py: 1,
              }}
            >
              <Typography variant="subtitle1"> FIlters</Typography>
              <Typography variant="caption" color="text.secondary">
                Total feeds:{' '}
                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                  {' '}
                  {sentimentDataState?.total_results}{' '}
                </Typography>
              </Typography>
            </Box>
            <Divider sx={{ border: '1px solid gray' }} />
            <Box sx={{ p: 2, pt: 1 }}>
              <Typography variant="caption"> Sentiments </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                {sentiments.map((sentiment) => (
                  <Box key={sentiment}>
                    <Checkbox checked={selectSentiment.includes(sentiment)} onChange={() => filterBySentiment(sentiment)} />
                    <Typography variant="caption">
                      <ImHappy2 size={20} color={getSentimentColor(sentiment)} />{' '}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
            <Divider sx={{ border: '1px solid gray' }} />
            <Box sx={{ p: 2, pt: 1 }}>
              <Typography variant="caption"> Sources </Typography>
              {socialMediaPlatform.map((platform) => (
                <Box key={platform}>
                  <Checkbox
                    key={platform}
                    checked={selectedPlatforms.includes(platform.toLowerCase())}
                    onChange={() => {
                      filterByPlatform(platform.toLowerCase());
                    }}
                  />
                  <Typography variant="caption">{TextHelper.capitalize(platform)}</Typography>
                </Box>
              ))}
            </Box>
          </Box>
          <Divider />
        </Box>
      </Box>
    </Box>
  );
};
