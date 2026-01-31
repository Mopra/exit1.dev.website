"use client";

import React from "react";

interface YouTubeVideoProps {
  videoId: string;
  title?: string;
  className?: string;
}

export const YouTubeVideo: React.FC<YouTubeVideoProps> = ({
  videoId,
  title = "YouTube video player",
  className = "",
}) => {
  return (
    <div className={`relative w-full aspect-video rounded-2xl overflow-hidden ${className}`}>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        className="absolute inset-0 w-full h-full border-0"
      />
    </div>
  );
};

export default YouTubeVideo;
