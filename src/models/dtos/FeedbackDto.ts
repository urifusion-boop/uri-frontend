export type CreateFeedbackDto = {
  satisfaction?: number;
  favoriteFeatures?: string[];
  thoughts?: string;
  emoji?: string;
  userId?: string;
};

export interface FeedbackDto {
  _id: string;
  isDeleted: boolean;
  userId: string;
  satisfaction: number;
  favoriteFeatures: string[];
  thoughts: string;
  emoji: string;
  feedbackId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
