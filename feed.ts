import { promises as fs } from "fs";
import rssParser from "rss-parser";

const DEFAULT_N = 5;

type Entry = {
  title?: string;
  link?: string;
  isoDate?: string;
};

/**
 * Fetches and parses the feed from the provided URL.
 * @param {string} url - The URL of the feed.
 * @returns {Promise<string[]>} An array of formatted feed entries.
 */
const fetchFeed = async (url: string): Promise<string[]> => {
  try {
    const parser = new rssParser();
    const response = await parser.parseURL(url);
    let feeds = [];

    for (const item of response.items) {
      if (item.title && item.link) feeds.push(formatFeedEntry(item));
      if (feeds.length === DEFAULT_N) break;
    }

    return feeds;
  } catch (error) {
    console.error("Error fetching or parsing the feed:", error);
    return [];
  }
};

/**
 * Formats a feed entry into a string.
 * @param {Entry} entry - The feed entry to format.
 * @returns {string} The formatted feed entry.
 */
const formatFeedEntry = ({ title, link, isoDate }: Entry): string => {
  const date = isoDate ? new Date(isoDate).toISOString().slice(0, 10) : "";
  return date ? `[${title}](${link}) - ${date}` : `[${title}](${link})`;
};
