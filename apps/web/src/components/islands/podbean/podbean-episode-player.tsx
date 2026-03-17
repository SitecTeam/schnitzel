import { buildPodbeanEmbedUrl } from "./utils";

type PodbeanEpisodePlayerProps = {
  id: string;
  title: string;
};

const PodbeanEpisodePlayer = ({ id, title }: PodbeanEpisodePlayerProps) => {
  const hasEpisode = Boolean(id);
  const iframeSrc = hasEpisode ? buildPodbeanEmbedUrl(id) : "";

  return (
    <section className="flex h-41.5 w-full max-w-250 flex-col justify-center lg:mt-3.5">
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
        />
      </div>
    </section>
  );
};

export default PodbeanEpisodePlayer;
