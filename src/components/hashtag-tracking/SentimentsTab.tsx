import { HashtagTrackResponse, SentimentResponse } from '@/models/dtos/HashTagDto';
import { Box, Checkbox, Skeleton, Typography } from '@mui/material';
import React, { useEffect, useMemo, useState } from 'react';

import { LightThemeColors } from '@/configs/colors.config';
import { ColorHelper } from '@/helpers/ColorHelper';
import { TextHelper } from '@/helpers/TextHelper';
import { SentimentData } from '@/models/dtos/TrackerDto';
import Sentiments from '../atoms/Sentiments';
import FeedsCard from '../atoms/keyword_tracking/FeedsCard';

interface SentimentsTabProps {
  isLoading?: boolean;
  report: SentimentResponse | null | undefined;
  hashtagTracker: HashtagTrackResponse | null | undefined;
}

const SentimentsTab = ({ isLoading, report, hashtagTracker }: SentimentsTabProps) => {
  const [sentimentDataState, setSentimentDataState] = useState<SentimentData[] | null>(null);
  const [selectSentiment, setSelectedSentiment] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  /** ✅ Memoized mock sentiment data */
  const mockSentimentData = useMemo(
    () => ({
      totalFeedback: hashtagTracker?.count ?? 0,
      sentiments: [
        { sentiment: 'Positive', percentage: 0 },
        { sentiment: 'Neutral', percentage: 0 },
        { sentiment: 'Negative', percentage: 0 },
      ],
      pieData: [
        { x: 'Positive', y: report?.sentiment_summary?.positive ?? 0 },
        { x: 'Neutral', y: report?.sentiment_summary?.neutral ?? 0 },
        { x: 'Negative', y: report?.sentiment_summary?.negative ?? 0 },
      ],
    }),
    [report, hashtagTracker]
  );

  const sentiment = ['positive', 'negative', 'neutral'];

  /** ✅ Memoized sentiment data */
  const sentimentData = useMemo(
    () =>
      report?.post_sentiments
        ?.filter((item) => item.text)
        .map((item) => ({
          author: '',
          comment: item.text ?? '',
          timestamp: '',
          image: '',
          website: '',
          sentiment: {
            text: item.text ?? '',
            score: item.score ?? 0,
            magnitude: item.magnitude ?? 0,
            sentiment: item.sentiment ?? '',
          },
        })) ?? [],
    [report]
  );

  /** ✅ Memoized filtered sentiment data */
  const filteredSentimentData = useMemo(() => {
    return selectSentiment.length === 0 ? sentimentData : sentimentData?.filter((item) => selectSentiment.includes(item?.sentiment?.sentiment ?? ''));
  }, [selectSentiment, sentimentData]);

  /** ✅ Updates sentimentDataState only when filteredSentimentData changes */
  useEffect(() => {
    if (JSON.stringify(sentimentDataState) !== JSON.stringify(filteredSentimentData)) {
      setSentimentDataState(filteredSentimentData ?? []);
    }
  }, [filteredSentimentData, sentimentDataState]);

  /** ✅ Function to filter sentiment data */
  const filterBySentiment = (sentiment: string) => {
    setSelectedSentiment((prev) => (prev.includes(sentiment) ? prev.filter((s) => s !== sentiment) : [...prev, sentiment]));
  };

  /** ✅ Memoized scatter data */
  const scatterData = useMemo(
    () =>
      report?.post_sentiments?.map((item, index) => ({
        timestamp: '',
        text: item.text ?? '',
        id: index.toString(),
        sentiment: {
          text: item.text ?? '',
          score: item.score ?? 0,
          magnitude: item.magnitude ?? 0,
          sentiment: item.sentiment ?? '',
        },
      })) ?? [],
    [report]
  );

  return (
    <Box
      sx={{
        width: '100%',
        padding: '20px',
        display: 'grid',
        gap: '20px',
      }}
    >
      {isLoading ? (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            px: 3,
            height: '100%',
          }}
        >
          <Skeleton variant="rectangular" height={300} width="100%" />
        </Box>
      ) : (
        <>
          <Sentiments
            sentimentData={mockSentimentData}
            tags={['Platform Distribution', 'Sentiment Distribution']}
            scatterData={scatterData}
            total={hashtagTracker?.count ?? 0}
            sentimentOverTimeData={[]}
          />

          <Box
            sx={{
              display: 'flex',
              flexDirection: {
                xs: 'column',
                md: 'row',
              },
              gap: '20px',
              width: '100%',
            }}
          >
            <Box
              sx={{
                backgroundColor: '#fff',
                borderRadius: '10px',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.05)',
                py: 3,
                px: 2,
              }}
              width={{
                xs: '100%',
                md: '60%',
              }}
            >
              <Typography
                sx={{
                  color: '#000000',
                  fontSize: '20px',
                  fontWeight: 600,
                  textAlign: 'left',
                  mb: 2,
                }}
              >
                <span style={{ color: LightThemeColors.uriColor }}> Posts </span>
                Sentiments
              </Typography>
              <Box
                display="flex"
                flexDirection="column"
                gap={2}
                sx={{
                  maxHeight: '600px',
                  overflow: 'auto',
                }}
                className="scroll"
                onScroll={(e) => {
                  const bottom = Math.ceil(e.currentTarget.scrollTop + e.currentTarget.clientHeight) >= e.currentTarget.scrollHeight - 1;

                  if (bottom && page * 10 < (sentimentDataState ?? []).length) {
                    setPage(page + 1);
                  }
                }}
              >
                {sentimentDataState && sentimentDataState.length > 0 ? (
                  sentimentDataState?.slice(0, page * 10)?.map((sentiment, index) => <FeedsCard key={index} sentiment={sentiment} tags={['']} />)
                ) : (
                  <Box
                    sx={{
                      backgroundColor: '#fff',
                      borderRadius: '10px',
                      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.05)',
                      padding: '16px',
                      height: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <Typography variant="h6">No Posts found</Typography>
                  </Box>
                )}
              </Box>
            </Box>

            <Box width={{ xs: '100%', md: '40%' }}>
              <Box
                sx={{
                  backgroundColor: '#fff',
                  borderRadius: '10px',
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.05)',
                  padding: '16px',
                }}
              >
                <Typography
                  sx={{
                    color: '#000000',
                    fontSize: '18px',
                    fontWeight: 600,
                    mt: 2.8,
                  }}
                >
                  Sentiments
                </Typography>
                <Box display="grid" gridTemplateColumns="repeat(3,1fr)">
                  {sentiment.map((item, index) => (
                    <Box key={index} display="flex" alignItems="center" gap="6px" mt={2}>
                      <Checkbox checked={selectSentiment.includes(item)} onChange={() => filterBySentiment(item)} />
                      <Typography sx={{ color: ColorHelper.getSentimentColor(item) }}>{TextHelper.capitalize(item)}</Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default React.memo(SentimentsTab);
