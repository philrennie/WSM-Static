import path from "node:path";
import { load as loadYaml } from "js-yaml";
import markdownIt from "markdown-it";
import { eleventyImageTransformPlugin } from "@11ty/eleventy-img";
import { HtmlBasePlugin } from "@11ty/eleventy";

const md = markdownIt({ html: true, linkify: true, typographer: true });

// "src/categories/ceramics.md" -> "ceramics"
const slugFromPath = (p) => (p ? path.basename(String(p), path.extname(String(p))) : "");

export default function (eleventyConfig) {
  // ── Data ──────────────────────────────────────────────
  eleventyConfig.addDataExtension("yml,yaml", (contents) => loadYaml(contents));

  // ── Static files ─────────────────────────────────────
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ "src/CNAME": "CNAME" });
  eleventyConfig.addPassthroughCopy({
    "node_modules/@fontsource/kalam/files/kalam-latin-700-normal.woff2": "assets/fonts/kalam-700.woff2",
    "node_modules/@fontsource-variable/manrope/files/manrope-latin-wght-normal.woff2": "assets/fonts/manrope.woff2",
  });

  // ── Images: resize + webp every <img> automatically ──
  eleventyConfig.addPlugin(eleventyImageTransformPlugin, {
    formats: ["webp", "auto"],
    widths: [400, 800, 1600],
    failOnError: false, // a missing image shouldn't stop Suzie's update from publishing
    htmlOptions: {
      imgAttributes: { loading: "lazy", decoding: "async", sizes: "(min-width: 800px) 400px, 100vw" },
    },
  });

  // Lets the site work at user.github.io/repo/ as well as on the real domain
  eleventyConfig.addPlugin(HtmlBasePlugin);

  // ── Collections ──────────────────────────────────────
  const visible = (item) => !item.data.hidden && !item.data.draft;

  eleventyConfig.addCollection("categories", (api) =>
    api
      .getFilteredByGlob("src/categories/*.md")
      .filter(visible)
      .sort((a, b) => (a.data.order ?? 99) - (b.data.order ?? 99) || a.data.title.localeCompare(b.data.title))
  );

  eleventyConfig.addCollection("pieces", (api) =>
    api
      .getFilteredByGlob("src/pieces/*.md")
      .filter(visible)
      .sort((a, b) => b.date - a.date)
  );

  // ── Filters ──────────────────────────────────────────
  eleventyConfig.addFilter("md", (s) => (s ? md.render(String(s)) : ""));
  eleventyConfig.addFilter("mdInline", (s) => (s ? md.renderInline(String(s)) : ""));
  eleventyConfig.addFilter("slugFromPath", slugFromPath);
  eleventyConfig.addFilter("inCategory", (pieces, slug) =>
    (pieces || []).filter((p) => slugFromPath(p.data.category) === slug)
  );
  eleventyConfig.addFilter("newIn", (pieces, n = 7) =>
    (pieces || []).filter((p) => p.data.new_in !== false).slice(0, n)
  );
  eleventyConfig.addFilter("year", () => new Date().getFullYear());

  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    markdownTemplateEngine: false, // so text Suzie types is never treated as template code
    htmlTemplateEngine: "njk",
  };
}
