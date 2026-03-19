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
          title="#31 James Mchaffie"
          height="150"
          width="100%"
          style={{
            border: "none",
            minWidth: "min(100%, 430px)",
            height: "150px",
          }}
          scrolling="no"
          data-name="pb-iframe-player"
          src="https://www.podbean.com/player-v2/?from=embed&i=5rjbn-1a356c3-pb&share=1&download=1&fonts=Arial&skin=1&font-color=auto&rtl=0&logo_link=episode_page&btn-skin=7&size=150"
          loading="lazy"
        ></iframe>
      </div>
    </section>
  );
};

export default PodbeanEpisodePlayer;
