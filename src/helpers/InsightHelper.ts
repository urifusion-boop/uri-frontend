import { FacebookPageInsightsDto } from "@/models/dtos/FacebookInsightsDto";
import { HashtagTrackPost } from "@/models/dtos/HashTagDto";
import {
  PostTypeCounts,
  SentimentOverTimeDto,
  SingleSentimentData,
} from "@/models/dtos/TrackerDto";
import { parseISO, format } from "date-fns";

type Metric = {
  date: string;
  likes: number;
  comments: number;
  interactions: number;
};

type MediaTypeData = {
  label: string;
  data: Metric[];
};

type AggregatedMetric = {
  date: string;
  likes: number;
  comments: number;
  interactions: number;
};

interface MediaData {
  timestamp: string;
  comments_count: number;
  like_count: number;
}

interface ChartData {
  date: string;
  Mentions: number;
  Engagement: number;
  Likes: number;
  Comments: number;
}

interface AlertCounts {
  total_alerts: number;
  positive_alerts: number;
  negative_alerts: number;
  neutral_alerts: number;
}

export class InsightHelper {
  static filterByMostEngaging<T extends { likes: number; comments: number }>(
    posts: T[]
  ) {
    return posts.sort((a, b) => b.likes + b.comments - (a.likes + a.comments));
  }

  static filterByRecentPost<T extends { date: string }>(posts: T[]) {
    return posts.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }

  static filterByMostFrequentUsers<T extends { followers: number }>(
    users: T[]
  ) {
    return users.sort((a, b) => b.followers - a.followers);
  }

  static filterByMostFrequentEngagements<T extends { avgEngagements: number }>(
    users: T[]
  ) {
    return users.sort((a, b) => b.avgEngagements - a.avgEngagements);
  }

  static prepareBarChartData(
    mediaData: {
      comments_count: number;
      like_count: number;
      media_type: string;
      timestamp: string;
    }[]
  ) {
    // Sort mediaData by timestamp (newest first)
    const sortedMediaData = [...mediaData]
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      )
      .slice(0, 50) // Take only the latest 50 posts
      .reverse(); // Reverse to show Post 1 first

    // Assign sequential numbers as labels (Post 1, Post 2, ...)
    const aggregatedData = sortedMediaData.map((item, index) => ({
      postNumber: `${index + 1}`, // Now it correctly starts at Post 1
      interactions: item.comments_count + item.like_count,
      comments: item.comments_count,
      likes: item.like_count,
    }));

    return { aggregatedData };
  }

  static prepareChartData(
    mediaData: {
      comments_count: number;
      like_count: number;
      media_type: string;
      timestamp: string | number;
    }[]
  ) {
    const groupedData: Record<
      string,
      { date: string; interactions: number; comments: number; likes: number }[]
    > = {};

    mediaData.forEach((item) => {
      const date = new Date(item.timestamp).toISOString().split("T")[0];
      const interactions = item.comments_count + item.like_count;

      if (!groupedData[item.media_type]) {
        groupedData[item.media_type] = [];
      }

      groupedData[item.media_type].push({
        date,
        interactions,
        comments: item.comments_count,
        likes: item.like_count,
      });
    });

    // Sort data by date in ascending order for each media type
    const timeSeriesData: MediaTypeData[] = Object.entries(groupedData).map(
      ([media_type, data]) => ({
        label: media_type,
        data: data.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        ),
      })
    );

    const mediaTypeCounts: { [mediaType: string]: number } = {};
    mediaData.forEach((item) => {
      mediaTypeCounts[item.media_type] =
        (mediaTypeCounts[item.media_type] || 0) + 1;
    });

    const pieChartData = Object.entries(mediaTypeCounts).map(
      ([mediaType, count]) => ({
        media_type: mediaType,
        count,
      })
    );

    const aggregateTimeSeriesData = this.aggregateMetricsByTime(timeSeriesData);

    return { timeSeriesData, pieChartData, aggregateTimeSeriesData };
  }

  static aggregateMetricsByTime(
    timeSeriesData: MediaTypeData[]
  ): AggregatedMetric[] {
    const aggregatedData: Record<
      string,
      { likes: number; comments: number; interactions: number }
    > = {};

    timeSeriesData.forEach(({ data }) => {
      data.forEach((item) => {
        const { date, likes, comments, interactions } = item;

        if (!aggregatedData[date]) {
          aggregatedData[date] = { likes: 0, comments: 0, interactions: 0 };
        }

        aggregatedData[date].likes += likes;
        aggregatedData[date].comments += comments;
        aggregatedData[date].interactions += interactions;
      });
    });

    // Convert to an array and sort by date in ascending order
    return Object.entries(aggregatedData)
      .map(([date, metrics]) => ({
        date,
        ...metrics,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  static transformCountsToDataArray(counts: PostTypeCounts): any {
    return Object.entries(counts).map(([key, value]) => ({
      post_type: key, // Map key to the x-axis label
      count: value ?? 0, // Map value to the y-axis
    }));
  }

  static getInsightsValues(
    data: FacebookPageInsightsDto[] | undefined,
    name: string
  ) {
    if (!data) return { name: "", period: "", values: [] };

    const insight = data.find((item) => item.name === name);
    return {
      name: insight?.name ?? "",
      period: insight?.period ?? "",
      values: insight?.values ?? [],
    };
  }

  static preparePieChartData(data: Record<string, number>) {
    return Object.entries(data).map(([key, value]) => ({
      x: key.charAt(0).toUpperCase() + key.slice(1),
      y: Math.round(value),
    }));
  }

  static calculateSentimentScore(alerts: AlertCounts): number {
    if (alerts.total_alerts === 0) return 50; // Default to neutral score

    const positiveWeight = 1.0; // Full weight for positive
    const neutralWeight = 0.5; // Partial weight for neutral
    const negativeWeight = 0.2; // Lower weight for negative

    const positivePercentage =
      (alerts.positive_alerts / alerts.total_alerts) * 100;
    const neutralPercentage =
      (alerts.neutral_alerts / alerts.total_alerts) * 100;
    const negativePercentage =
      (alerts.negative_alerts / alerts.total_alerts) * 100;

    // Weighted sentiment score calculation
    const sentimentScore =
      positivePercentage * positiveWeight +
      neutralPercentage * neutralWeight +
      negativePercentage * negativeWeight;

    return Math.round(sentimentScore);
  }

  static readonly prepareHashtagEngagementChartData = (
    posts: HashtagTrackPost[]
  ): ChartData[] => {
    // Aggregate data by date
    const aggregated = posts.reduce(
      (acc, post) => {
        const date = format(parseISO(post.timestamp), "yyyy-MM-dd");

        if (!acc[date]) {
          acc[date] = { Mentions: 0, Engagement: 0, Likes: 0, Comments: 0 };
        }

        acc[date].Mentions += 1; // Increment mentions count for the day
        acc[date].Engagement +=
          (post.comments_count ?? 0) + (post.like_count ?? 0); // Sum likes and comments for engagement
        acc[date].Likes += post.like_count ?? 0; // Sum likes for the day
        acc[date].Comments += post.comments_count ?? 0; // Sum comments for the day

        return acc;
      },
      {} as Record<
        string,
        {
          Mentions: number;
          Engagement: number;
          Likes: number;
          Comments: number;
        }
      >
    );

    // Convert aggregated data to an array
    return Object.entries(aggregated).map(([date, values]) => ({
      date,
      Mentions: values.Mentions,
      Engagement: values.Engagement,
      Likes: values.Likes,
      Comments: values.Comments,
    }));
  };

  static readonly computeSentimentOverTime = (
    data: SingleSentimentData[]
  ): SentimentOverTimeDto[] => {
    const sentimentMap: Record<
      string,
      { positive: number; negative: number; neutral: number }
    > = {};

    data.forEach(({ timestamp, sentiment }) => {
      console.log("Time stamp : ", timestamp);
      const dateObj = new Date(timestamp);

      // Check if date is valid
      if (isNaN(dateObj.getTime())) {
        console.warn("Invalid timestamp detected:", timestamp);
        return; // Skip invalid timestamps
      }

      const date = dateObj.toISOString().split("T")[0]; // Extract YYYY-MM-DD

      if (!sentimentMap[date]) {
        sentimentMap[date] = { positive: 0, negative: 0, neutral: 0 };
      }

      if (sentiment.sentiment === "positive") {
        sentimentMap[date].positive += 1;
      } else if (sentiment.sentiment === "negative") {
        sentimentMap[date].negative += 1;
      } else {
        sentimentMap[date].neutral += 1;
      }
    });

    return Object.entries(sentimentMap).map(([date, counts]) => ({
      date,
      ...counts,
    }));
  };
}
