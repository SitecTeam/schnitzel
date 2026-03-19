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

export const extractPodbeanEpisodeId = (value: string | null | undefined) => {
  if (!value) {
    return "";
  }

  const normalized = value.trim();

  if (!normalized) {
    return "";
  }

  if (/^[a-z0-9]+(?:-[a-z0-9]+)+$/i.test(normalized)) {
    return normalized;
  }

  try {
    const parsedUrl = new URL(normalized);
    const fromQuery = parsedUrl.searchParams.get("i");

    if (fromQuery) {
      return fromQuery;
    }

    const pathMatch = parsedUrl.pathname.match(/\/pb-([a-z0-9-]+)/i);

    if (pathMatch?.[1]) {
      return pathMatch[1];
    }
  } catch {
    return "";
  }

  return "";
};
