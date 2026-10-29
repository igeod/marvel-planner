import { Hono } from "hono";
import { TMDB_REFS } from "../../shared/tmdbRefs";
import { createDb } from "../db/client";
import { getTitleDetails } from "../services/titleDetails";
import type { AppEnv } from "../types";

const SITE_NAME = "Marvel Planner";
// Matches the lang of index.html.
const SEO_LANGUAGE = "it";
const DESCRIPTION_LENGTH = 155;

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function shorten(text: string): string {
  const flat = text.replace(/\s+/g, " ").trim();
  return flat.length <= DESCRIPTION_LENGTH
    ? flat
    : `${flat.slice(0, DESCRIPTION_LENGTH - 1).trimEnd()}…`;
}

export const seoRoutes = new Hono<AppEnv>()
  .get("/robots.txt", (c) =>
    c.text(
      `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /admin\n\nSitemap: ${new URL("/sitemap.xml", c.req.url).href}\n`,
    ),
  )
  .get("/sitemap.xml", (c) => {
    const origin = new URL(c.req.url).origin;
    const paths = ["/", ...Object.keys(TMDB_REFS).map((id) => `/film/${encodeURIComponent(id)}`)];
    const urls = paths
      .map((path) => `  <url><loc>${escapeHtml(origin + path)}</loc></url>`)
      .join("\n");
    c.header("Content-Type", "application/xml; charset=utf-8");
    c.header("Cache-Control", "public, max-age=3600");
    return c.body(
      `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    );
  })
  // The page itself is rendered by the browser; crawlers get a real title and description up front.
  .get("/film/:titleId", async (c) => {
    const titleId = c.req.param("titleId");
    const response = await c.env.ASSETS.fetch(c.req.raw);
    if (
      !Object.hasOwn(TMDB_REFS, titleId) ||
      !response.headers.get("content-type")?.includes("html")
    ) {
      return new Response(response.body, response);
    }

    let name = "";
    let description = "";
    if (c.env.TMDB_TOKEN) {
      try {
        const details = await getTitleDetails(
          createDb(c.env.DB),
          c.env.TMDB_TOKEN,
          titleId,
          TMDB_REFS[titleId],
          SEO_LANGUAGE,
        );
        name = details.name;
        description = shorten(details.synopsis ?? "");
      } catch (error) {
        console.error(error);
      }
    }
    if (!name) return new Response(response.body, response);

    const title = escapeHtml(`${name} · ${SITE_NAME}`);
    const text = escapeHtml(description || `${name}: ${SITE_NAME}`);
    const canonical = escapeHtml(new URL(`/film/${encodeURIComponent(titleId)}`, c.req.url).href);
    const rewritten = new HTMLRewriter()
      .on("title", { element: (element) => void element.setInnerContent(name + " · " + SITE_NAME) })
      .on('meta[name="description"]', {
        element: (element) =>
          void element.setAttribute("content", description || `${name}: ${SITE_NAME}`),
      })
      .on("head", {
        element: (element) =>
          void element.append(
            `<link rel="canonical" href="${canonical}">` +
              `<meta property="og:type" content="website">` +
              `<meta property="og:title" content="${title}">` +
              `<meta property="og:description" content="${text}">` +
              `<meta property="og:url" content="${canonical}">`,
            { html: true },
          ),
      })
      .transform(response);
    c.header("Cache-Control", "public, max-age=3600");
    return new Response(rewritten.body, rewritten);
  });
