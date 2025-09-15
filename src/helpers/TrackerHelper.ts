import { HashtagTrackPost } from "@/models/dtos/HashTagDto";

export class TrackerHelper {
  static calculateTotalReach(posts: HashtagTrackPost[]): {
    totalLikes: number;
    totalComments: number;
  } {
    return posts.reduce(
      (totals, post) => {
        totals.totalLikes += post.like_count ?? 0;
        totals.totalComments += post.comments_count;
        return totals;
      },
      { totalLikes: 0, totalComments: 0 }
    );
  }
}
