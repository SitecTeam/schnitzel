import type { APIRoute } from "astro";
import { getEpisodes } from "@/lib/payload";

const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 24;

export const GET: APIRoute = async ({ url, locals }) => {
  try {
    const search = url.searchParams.get("search") ?? undefined;
    const sort = url.searchParams.get("sort") ?? "newest";
    const pageParam = Number.parseInt(url.searchParams.get("page") ?? "1", 10);
    const limitParam = Number.parseInt(
      url.searchParams.get("limit") ?? String(DEFAULT_LIMIT),
      10
    );

    const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
    const limit =
      Number.isFinite(limitParam) && limitParam > 0
        ? Math.min(limitParam, MAX_LIMIT)
        : DEFAULT_LIMIT;

    const result = await getEpisodes(
      { search, sort, page, limit },
      locals.cmsFetcher
    );

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (e) {
    console.error("[api/episodes]", e);
    return new Response(
      JSON.stringify({
        message: "Could not load episodes. Please try again later.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
