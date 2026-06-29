import { buildSpotifyEmbedUrl } from "./utils";

type SpotifyEpisodePlayerProps = {
  url: string;
  title: string;
};

const SpotifyEpisodePlayer = ({ url, title }: SpotifyEpisodePlayerProps) => {
  const iframeSrc = buildSpotifyEmbedUrl(url);

  if (!iframeSrc) {
    return null;
  }

  return (
    <section className="flex h-41.5 w-full max-w-250 flex-col justify-center lg:mt-3.5">
      <div className="bg-white p-2 sm:m-2">
        <div className="h-[150px] overflow-hidden rounded-[5px]">
          <iframe
            title={`Spotify: ${title}`}
            src={iframeSrc}
            className="rounded-[5px]"
            width="100%"
            height="166"
            style={{
              border: "none",
              borderRadius: "5px",
              display: "block",
              height: "166px",
              maxWidth: "none",
              minWidth: "calc(min(100%, 430px) + 16px)",
              transform: "translate(-8px, -8px)",
              width: "calc(100% + 16px)",
            }}
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default SpotifyEpisodePlayer;
