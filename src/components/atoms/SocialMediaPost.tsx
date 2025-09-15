interface SocialMediaPosting {
  identifier: string;
  commentcount: string;
  articlebody: string;
  datecreated: Date;
  datepublished: Date;
  url: string;
}

interface SocialMediaPostProps {
  post: SocialMediaPosting;
}

const SocialMediaPost: React.FC<SocialMediaPostProps> = ({ post }) => {
  return (
    <div style={styles.postContainer}>
      <div style={styles.postHeader}>
        <h2 style={styles.articleBody}>{post.articlebody}</h2>
        <span style={styles.datePublished}>
          {new Date(post.datepublished).toLocaleDateString()}
        </span>
      </div>
      <div style={styles.commentSection}>
        <span style={styles.commentCount}>{post.commentcount} Comments</span>
        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          style={styles.viewPostLink}
        >
          View Post
        </a>
      </div>
    </div>
  );
};

// Inline styles
const styles: { [key: string]: React.CSSProperties } = {
  postContainer: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    padding: "20px",
    marginBottom: "20px",
    maxWidth: "600px",
    margin: "0 auto",
  },
  postHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #e0e0e0",
    paddingBottom: "10px",
    marginBottom: "10px",
  },
  articleBody: {
    fontSize: "1.25rem",
    fontWeight: "500",
    color: "#333",
  },
  datePublished: {
    fontSize: "0.875rem",
    color: "#888",
  },
  commentSection: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  commentCount: {
    fontSize: "1rem",
    color: "#555",
  },
  viewPostLink: {
    fontSize: "1rem",
    color: "#0070f3",
    textDecoration: "none",
  },
};

export default SocialMediaPost;
