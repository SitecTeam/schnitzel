export const buildPodbeanEmbedUrl = (episodeId: string) => {
  const params = new URLSearchParams({
    from: "embed",
    i: episodeId,
    share: "1",
    download: "1",
    fonts: "Anton",
    skin: "1C39FF",
    rtl: "0",
    logo_link: "episode_page",
    size: "150",
    "font-color": "auto",
    "btn-skin": "FF62AC",
  });

  return `https://www.podbean.com/player-v2/?${params.toString()}`;
};
