import { defineMiddleware } from "astro:middleware";

const EPISODES_CACHE_CONTROL =
  "public, s-maxage=60, stale-while-revalidate=300";

export const onRequest = defineMiddleware(async ({ url }, next) => {
  const response = await next();
  const pathname = url.pathname;

  if (
    response.status === 200 &&
    (pathname === "/episodes" ||
      pathname.startsWith("/episodes/") ||
      pathname === "/api/episodes")
  ) {
    response.headers.set("Cache-Control", EPISODES_CACHE_CONTROL);
  }

  return response;
});
