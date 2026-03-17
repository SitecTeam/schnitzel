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

  let normalized = value.trim();

  if (!normalized) {
    return "";
  }

  // Handle full <iframe> HTML pasted from Podbean's "Embed" button.
  // Extract the src attribute value and continue with that URL.
  if (normalized.trimStart().startsWith("<")) {
    const srcMatch = normalized.match(/\bsrc=["']([^"']+)["']/i);
    if (!srcMatch) {
      return "";
    }
    normalized = srcMatch[1];
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

    // e.g. https://www.podbean.com/eas/pb-xyz123-abc456
    const pbPathMatch = parsedUrl.pathname.match(/\/pb-([a-z0-9-]+)/i);
    if (pbPathMatch?.[1]) {
      return pbPathMatch[1];
    }

    // e.g. https://yourshow.podbean.com/e/episode-title-20231105164832/
    // The trailing hash segment is the episode ID used by the player.
    const episodePathMatch = parsedUrl.pathname.match(
      /\/e\/[a-z0-9-]*?(\d{15,})\/?$/i
    );
    if (episodePathMatch?.[1]) {
      return episodePathMatch[1];
    }
  } catch {
    return "";
  }

  return "";
};
