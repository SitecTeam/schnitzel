export const buildPodbeanEmbedUrl = (episodeId: string) => {
  const params = new URLSearchParams({
    from: "embed",
    i: episodeId,
    share: "1",
    download: "1",
    skin: "1C39FF",
    rtl: "0",
    logo_link: "episode_page",
    size: "150",
    "font-color": "auto",
    "btn-skin": "FF62AC",
  });

  return `https://www.podbean.com/player-v2/?${params.toString()}`;
};

export const extractPodbeanEpisodeId = (
  url: string | null | undefined
): string => {
  if (!url?.trim()) return "";

  try {
    const parsed = new URL(url.trim());

    // Player embed URL: https://www.podbean.com/player-v2/?i=pb-xxxx-yyyy
    const fromQuery = parsed.searchParams.get("i");
    if (fromQuery) return fromQuery;

    // Episode page URL: https://www.podbean.com/ew/pb-xxxx-yyyy
    const match = parsed.pathname.match(/\/(pb-[a-z0-9-]+)/i);
    if (match?.[1]) return match[1];
  } catch {
    return "";
  }

  return "";
};
