import React from "react";

interface YouTubeEmbedProps {
  url: string;
  title?: string;
  width?: string;
  height?: string;
  className?: string;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({
  url,
  title = "YouTube video player",
  width = "100%",
  height = "315",
  className,
}) => {
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;
    const match = RegExp(regExp).exec(url);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const videoId = getYouTubeVideoId(url);

  if (!videoId) return null;

  return (
    <div
      className={`video-responsive my-8 rounded-xl overflow-hidden shadow-lg ${className}`}
    >
      <iframe
        width={width}
        height={height}
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="rounded-xl"
      />
    </div>
  );
};

export default YouTubeEmbed;
