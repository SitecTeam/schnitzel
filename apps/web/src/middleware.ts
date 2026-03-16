import { defineMiddleware } from "astro:middleware";

const EPISODES_CACHE_CONTROL =
  "public, s-maxage=60, stale-while-revalidate=300";

export const onRequest = defineMiddleware(async (context, next) => {
  // Inject the CMS service binding as the fetcher so Worker-to-Worker
  // communication goes through Cloudflare's internal network.
  // Falls back to global fetch in local dev where the binding isn't present.
  const cmsFetcher =
    context.locals.runtime?.env?.CMS?.fetch.bind(
      context.locals.runtime.env.CMS
    ) ?? fetch;
  context.locals.cmsFetcher = cmsFetcher;

  const response = await next();
  const pathname = context.url.pathname;

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
