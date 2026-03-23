import { defineMiddleware } from "astro:middleware";

const EPISODES_CACHE_CONTROL =
  "public, s-maxage=60, stale-while-revalidate=300";

export const onRequest = defineMiddleware(async (context, next) => {
  // In production, use the Cloudflare service binding (Worker-to-Worker, no
  // public internet hop). In local dev (astro dev), the binding routes through
  // wrangler's virtual dispatch which has no local CMS worker target — always
  // use plain fetch so requests go directly to localhost:3000.
  const cms = !import.meta.env.DEV ? context.locals.runtime?.env?.CMS : null;
  context.locals.cmsFetcher = cms
    ? (input: RequestInfo | URL, init?: RequestInit) =>
        cms.fetch(input as Request, init)
    : fetch;

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
