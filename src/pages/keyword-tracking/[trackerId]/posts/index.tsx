import React, { useState } from "react";
import { GetServerSideProps } from "next";
import path from "path";
import fs from "fs/promises";
import SearchResults from "@/components/atoms/SearchResults";
import SocialMediaPost from "@/components/atoms/SocialMediaPost";

// Define the structure of each search result and social media post
interface SearchResultItem {
  title: string;
  link: string;
  snippet: string;
  htmlTitle: string;
  htmlSnippet: string;
  socialMediaPosts?: SocialMediaPost[];
}

interface SocialMediaPost {
  identifier: string;
  articlebody: string;
  commentcount: string;
  datecreated: Date;
  datepublished: Date;
  url: string;
}

// Props type for the component
interface KeywordPageProps {
  searchResults: SearchResultItem[];
}

const KeywordPage: React.FC<KeywordPageProps> = ({ searchResults }) => {
  const [activeTab, setActiveTab] = useState("webPosts");

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Search and Social Media Posts</h1>

      {/* Tab Navigation */}
      <div style={styles.tabNav}>
        <button
          style={
            activeTab === "webPosts"
              ? { ...styles.tabButton, ...styles.activeTab }
              : styles.tabButton
          }
          onClick={() => setActiveTab("webPosts")}
        >
          Web Posts
        </button>
        <button
          style={
            activeTab === "socialMedia"
              ? { ...styles.tabButton, ...styles.activeTab }
              : styles.tabButton
          }
          onClick={() => setActiveTab("socialMedia")}
        >
          Social Media Posts
        </button>
      </div>

      {/* Content */}
      <div style={styles.tabContent}>
        {activeTab === "webPosts" ? (
          <SearchResults searchResults={searchResults} />
        ) : (
          searchResults
            .filter(
              (item) =>
                item.socialMediaPosts && item.socialMediaPosts.length > 0
            )
            .map((item, index) =>
              item.socialMediaPosts!.map((post, idx) => (
                <SocialMediaPost key={idx} post={post} />
              ))
            )
        )}
      </div>
    </div>
  );
};

// Server-side function to fetch and pass search results and social media posts as props
export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const filePath = path.join(process.cwd(), "public", "search_result.json");
    const jsonData = await fs.readFile(filePath, "utf-8");
    const data = JSON.parse(jsonData);

    const searchResults =
      data.items?.map((item: any) => ({
        title: item.title,
        link: item.link,
        snippet: item.snippet,
        htmlTitle: item.htmlTitle,
        htmlSnippet: item.htmlSnippet,
        socialMediaPosts: item.pagemap?.socialmediaposting
          ? item.pagemap.socialmediaposting.map((post: any) => ({
              identifier: post.identifier || "",
              articlebody: post.articlebody || "",
              commentcount: post.commentcount || "0",
              datecreated: post.datecreated || "",
              url: post.url || "",
            }))
          : null,
      })) || [];

    return {
      props: {
        searchResults,
      },
    };
  } catch (error) {
    console.error("Error loading search data:", error);
    return {
      props: {
        searchResults: [],
      },
    };
  }
};

// Inline styles
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "'Roboto', sans-serif",
  },
  heading: {
    textAlign: "center",
    fontSize: "2.5rem",
    marginBottom: "30px",
    color: "#333",
  },
  tabNav: {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
  },
  tabButton: {
    padding: "10px 20px",
    fontSize: "1.2rem",
    cursor: "pointer",
    border: "none",
    background: "#e0e0e0",
    margin: "0 10px",
    borderRadius: "5px",
  },
  activeTab: {
    backgroundColor: "#0070f3",
    color: "#fff",
  },
  tabContent: {
    marginTop: "20px",
  },
};

export default KeywordPage;
