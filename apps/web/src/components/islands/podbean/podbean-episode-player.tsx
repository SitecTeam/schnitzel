import { useState } from "react";
import Typography from "../../typography";
import PodbeanButtonWrapper from "./podbean-button-wrapper";
import { buildPodbeanEmbedUrl } from "./utils";

type PodbeanEpisodePlayerProps = {
  id: string;
  title: string;
};

const PodbeanEpisodePlayer = ({ id, title }: PodbeanEpisodePlayerProps) => {
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);

  const hasEpisode = Boolean(id);
  const iframeSrc = hasEpisode ? buildPodbeanEmbedUrl(id) : "";

  const handlePlay = () => {
    if (!hasEpisode) {
      return;
    }
    setIsPlayerVisible(true);
  };

  return (
    <section className="flex h-41.5 w-full max-w-225 flex-col justify-center">
      <div className="flex w-full items-center gap-0.5 px-2 sm:px-4">
        <PodbeanButtonWrapper
          handlePlay={handlePlay}
          hasEpisode={hasEpisode}
          isPlayerVisible={isPlayerVisible}
        >
          <svg
            viewBox="0 0 28 28"
            aria-hidden="true"
            className="size-8 shrink-0 fill-white lg:size-14.25"
          >
            <path d="M8 5.5L22.5 14L8 22.5V5.5Z" />
          </svg>
        </PodbeanButtonWrapper>
        <PodbeanButtonWrapper
          handlePlay={handlePlay}
          hasEpisode={hasEpisode}
          isPlayerVisible={isPlayerVisible}
          className="flex-1 truncate"
        >
          <Typography variant="body-xl" className="truncate text-white">
            Episode {title}
          </Typography>
        </PodbeanButtonWrapper>
      </div>

      {isPlayerVisible && hasEpisode && (
        <div className="bg-white p-2 sm:m-2">
          <iframe
            title={title}
            height="150"
            width="100%"
            style={{
              border: "none",
              minWidth: "min(100%, 430px)",
              height: "150",
            }}
            data-name="pb-iframe-player"
            src={iframeSrc}
            loading="lazy"
          />
        </div>
      )}
    </section>
  );
};

export default PodbeanEpisodePlayer;
