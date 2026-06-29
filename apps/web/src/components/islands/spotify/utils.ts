type SpotifyEmbedTarget = {
  type: "episode" | "show";
  id: string;
  params: URLSearchParams;
};

const getSpotifyEmbedTarget = (
  value: string | null | undefined
): SpotifyEmbedTarget | null => {
  if (!value) {
    return null;
  }

  const normalized = value.trim();

  if (!normalized) {
    return null;
  }

  try {
    const parsedUrl = new URL(normalized);
    const hostname = parsedUrl.hostname.toLowerCase();

    if (
      hostname !== "open.spotify.com" &&
      !hostname.endsWith(".open.spotify.com")
    ) {
      return null;
    }

    const parts = parsedUrl.pathname.split("/").filter(Boolean);
    const embedIndex = parts[0] === "embed" ? 1 : parts.indexOf("embed") + 1;
    const typeIndex = embedIndex > 0 ? embedIndex : parts.length - 2;
    const type = parts[typeIndex];
    const id = parts[typeIndex + 1];
    const isEmbedUrl = parts.includes("embed");

    if ((type === "episode" || type === "show") && id) {
      return {
        type,
        id,
        params: isEmbedUrl
          ? new URLSearchParams(parsedUrl.search)
          : new URLSearchParams(),
      };
    }
  } catch {
    return null;
  }

  return null;
};

export const buildSpotifyEmbedUrl = (value: string | null | undefined) => {
  const target = getSpotifyEmbedTarget(value);

  if (!target) {
    return "";
  }

  const params = target.params.toString();

  return `https://open.spotify.com/embed/${target.type}/${target.id}${params ? `?${params}` : ""}`;
};
