import { useState } from "react";
import IntroVideoImg from "@/assets/intro-video.png";
import { Play } from "lucide-react";

interface VideoPlayerProps {
  videoId: string;
  title: string;
}

export default function VideoPlayer({ videoId, title }: VideoPlayerProps) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        className="min-h-0 w-full flex-1"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      aria-label={`Play ${title}`}
      onClick={() => setPlaying(true)}
      className="group relative min-h-0 w-full flex-1 cursor-pointer overflow-hidden"
    >
      <img
        src={IntroVideoImg.src}
        alt={title}
        className="absolute inset-0 h-full w-full object-cover object-[20%_center] brightness-190 grayscale transition-transform duration-300 ease-out group-hover:scale-105"
      />
      {/* Base pink overlay */}
      <span className="absolute inset-0 bg-[#FF62AC]/15" aria-hidden="true" />
      {/* Hover pink overlay */}
      <span
        className="absolute inset-0 bg-[#FF62AC]/30 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden="true"
      />
      {/* Play button overlay */}
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-primary shadow-lg lg:size-16">
          <Play className="size-5 lg:size-7" />
        </span>
      </span>
    </button>
  );
}
