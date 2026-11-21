import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const readProjectFile = (path) => readFileSync(resolve(process.cwd(), path), "utf8");
const config = JSON.parse(readProjectFile("vercel.json"));
const fallback = config.rewrites.find(({ destination }) => destination === "/index.html");
const matchesFallback = new RegExp(`^${fallback.source}$`);

describe("AI discovery metadata", () => {
  it("publishes real Markdown satisfying the llms.txt audit checks", () => {
    const text = readProjectFile("public/llms.txt");
    expect(text).toMatch(/^\s*#\s+.+/m);
    expect(text).toMatch(/\[.+\]\(.+\)/);
    expect(text.length).toBeGreaterThanOrEqual(50);
    expect(text).not.toMatch(/<!doctype|<html/i);
    expect(readProjectFile("index.html")).toContain('rel="describedby" href="/llms.txt"');
  });

  it("keeps metadata and static files outside the SPA fallback", () => {
    for (const path of [
      "/llms.txt", "/robots.txt", "/sitemap.xml",
      "/.well-known/ai-catalog.json", "/.well-known/ard.json",
      "/ai-catalog.json", "/ard.json",
      "/fonts/geist-latin.woff2", "/assets/app.js", "/projects/modelhub.webp",
    ]) expect(path).not.toMatch(matchesFallback);
    expect("/").toMatch(matchesFallback);
    expect("/home").toMatch(matchesFallback);
  });

  it("does not advertise nonexistent agent manifests", () => {
    const html = readProjectFile("index.html");
    expect(html).not.toMatch(/rel=["'](?:ai-catalog|ard)["']/);
    expect(readProjectFile("public/robots.txt")).not.toMatch(/^\s*Agentmap:/im);
    expect(existsSync(resolve("public/.well-known/ai-catalog.json"))).toBe(false);
    expect(existsSync(resolve("public/.well-known/ard.json"))).toBe(false);
  });
});
