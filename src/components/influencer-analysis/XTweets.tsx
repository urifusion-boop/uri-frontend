interface Daum {
  created_at: string;
  conversation_id: string;
  reply_settings: string;
  lang: string;
  public_metrics: PublicMetrics2;
  entities?: Entities2;
  id: string;
  referenced_tweets?: ReferencedTweet[];
  text: string;
  in_reply_to_user_id?: string;
  author_id: string;
  edit_history_tweet_ids: string[];
  edit_controls: EditControls;
  attachments?: Attachments;
  context_annotations?: ContextAnnotation[];
}
export interface PublicMetrics2 {
  retweet_count: number;
  reply_count: number;
  like_count: number;
  quote_count: number;
  bookmark_count: number;
  impression_count: number;
}

export interface Entities2 {
  mentions?: Mention[];
  hashtags?: Hashtag[];
  urls?: Url3[];
  annotations?: Annotation[];
}

export interface Mention {
  start: number;
  end: number;
  username: string;
  id: string;
}

export interface Hashtag {
  start: number;
  end: number;
  tag: string;
}

export interface Url3 {
  start: number;
  end: number;
  url: string;
  expanded_url: string;
  display_url: string;
  media_key?: string;
}

export interface Annotation {
  start: number;
  end: number;
  probability: number;
  type: string;
  normalized_text: string;
}

export interface ReferencedTweet {
  type: string;
  id: string;
}

export interface EditControls {
  edits_remaining: number;
  is_edit_eligible: boolean;
  editable_until: string;
}

export interface Attachments {
  media_keys: string[];
  media_source_tweet_id?: string[];
}

export interface ContextAnnotation {
  domain: Domain;
  entity: Entity;
}

export interface Domain {
  id: string;
  name: string;
  description: string;
}

export interface Entity {
  id: string;
  name: string;
  description?: string;
}

export interface Includes {
  users: User[];
}

export interface User {
  username: string;
  id: string;
  entities?: Entities3;
  verified: boolean;
  description: string;
  public_metrics: PublicMetrics3;
  location?: string;
  profile_image_url: string;
  name: string;
  created_at: string;
  url?: string;
  connection_status?: string[];
  pinned_tweet_id?: string;
}

export interface Entities3 {
  description?: Description;
  url?: Url4;
}

export interface Description {
  mentions?: Mention2[];
  hashtags?: Hashtag2[];
}

export interface Mention2 {
  start: number;
  end: number;
  username: string;
}

export interface Hashtag2 {
  start: number;
  end: number;
  tag: string;
}

export interface Url4 {
  urls: Url5[];
}

export interface Url5 {
  start: number;
  end: number;
  url: string;
  expanded_url: string;
  display_url: string;
}

export interface PublicMetrics3 {
  followers_count: number;
  following_count: number;
  tweet_count: number;
  listed_count: number;
  like_count: number;
  media_count: number;
}

export interface Meta {
  next_token: string;
  result_count: number;
  newest_id: string;
  oldest_id: string;
}

interface TweetProps {
  tweet: Daum;
}

const Tweet: React.FC<TweetProps> = ({ tweet }) => {
  return (
    <div
      style={{ border: "1px solid #ccc", margin: "10px 0", padding: "10px" }}
    >
      <UserInfo authorId={tweet.author_id} />
      <p>{tweet.text}</p>
      {/* {tweet.entities?.hashtags && (
        <div>
          {tweet.entities.hashtags.map((hashtag, idx) => (
            <span key={idx} style={{ color: "#1DA1F2", marginRight: "8px" }}>
              #{hashtag.tag}
            </span>
          ))}
        </div>
      )} */}
      <Metrics metrics={tweet.public_metrics} />
    </div>
  );
};

export default Tweet;

interface UserInfoProps {
  authorId: string;
}

const UserInfo: React.FC<UserInfoProps> = ({ authorId }) => {
  // Mock fetch or pass the user data as props if available
  const mockUser: User = {
    username: "mockuser",
    id: authorId,
    verified: false,
    description: "This is a mock user.",
    public_metrics: {
      followers_count: 1000,
      following_count: 200,
      tweet_count: 500,
      listed_count: 10,
      like_count: 100,
      media_count: 50,
    },
    profile_image_url: "https://via.placeholder.com/50",
    name: "Mock User",
    created_at: "2022-01-01",
  };

  return (
    <div
      style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}
    >
      <img
        src={mockUser.profile_image_url}
        alt={mockUser.name}
        style={{ width: "50px", borderRadius: "50%" }}
      />
      <div style={{ marginLeft: "10px" }}>
        <h4>{mockUser.name}</h4>
        <p>@{mockUser.username}</p>
      </div>
    </div>
  );
};

interface MetricsProps {
  metrics: PublicMetrics2;
}

const Metrics: React.FC<MetricsProps> = ({ metrics }) => {
  return (
    <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
      <span>Retweets: {metrics.retweet_count}</span>
      <span>Likes: {metrics.like_count}</span>
      <span>Replies: {metrics.reply_count}</span>
      <span>Quotes: {metrics.quote_count}</span>
      <span>Bookmarks: {metrics.bookmark_count}</span>
    </div>
  );
};
