/**
 * Devotional content utilities.
 * Loads aggregated TtB, VotD, Meditation, and Quotes data for Astro pages.
 */
import ttbAll from '../data/ttb-all.json';
import votdAll from '../data/votd-all.json';
import meditationYear1 from '../data/meditation-year1.json';
import meditationYear2 from '../data/meditation-year2.json';
import quotesAll from '../data/quotes-all.json';
import libraryData from '../data/library.json';

// --- Types ---

export type TtbEntry = {
  book: string;
  book_name: string;
  chapter: number;
  start_verse: number;
  end_verse: number;
  title: string;
  topics: string[];
  teaching: string[];
  theologian_name: string;
  theologian_quote: string;
  question: string;
  hook: string;
};

export type VotdEntry = {
  book: string;
  book_name: string;
  chapter: number;
  verse: number;
  text: string;
  topics: string[];
  reflection: string;
  question: string;
  hook: string;
};

export type MeditationEntry = {
  day: number;
  psalm: number;
  start_verse: number;
  end_verse: number;
  title: string;
  topics: string[];
  teaching: string[];
  theologian_name: string;
  theologian_quote: string;
  question: string;
  hook: string;
};

export type QuoteEntry = {
  id: string;
  author: string;
  author_slug: string;
  title?: string;
  quote: string;
  themes?: string[];
  source_title?: string;
  source_url?: string | null;
  source_note?: string;
  episode_angle?: string;
  hook_ideas?: string[];
};

// --- Lookup maps (built once at import time) ---

const bookSlugMap = new Map<string, { abbr: string; name: string; slug: string }>();
const bookAbbrToSlug = new Map<string, string>();
for (const section of libraryData.sections) {
  for (const book of section.books) {
    bookSlugMap.set(book.slug, { abbr: book.abbr, name: book.name, slug: book.slug });
    bookAbbrToSlug.set(book.abbr, book.slug);
  }
}

// --- TtB ---

const ttbBySlug = new Map<string, TtbEntry[]>();
for (const entry of ttbAll as TtbEntry[]) {
  const slug = bookAbbrToSlug.get(entry.book) || entry.book_name.toLowerCase().replace(/ /g, '-');
  const arr = ttbBySlug.get(slug) || [];
  arr.push(entry);
  ttbBySlug.set(slug, arr);
}

export function getAllTtbEntries(): TtbEntry[] {
  return ttbAll as TtbEntry[];
}

export function getTtbByBook(slugOrAbbr: string): TtbEntry[] {
  const slug = bookAbbrToSlug.has(slugOrAbbr)
    ? bookAbbrToSlug.get(slugOrAbbr)!
    : slugOrAbbr;
  return ttbBySlug.get(slug) || [];
}

export function getTtbEntry(slug: string, chapter: number): TtbEntry | undefined {
  return getTtbByBook(slug).find(e => e.chapter === chapter);
}

export function getTtbByTopic(topic: string): TtbEntry[] {
  const lower = topic.toLowerCase();
  return (ttbAll as TtbEntry[]).filter(e =>
    e.topics.some(t => t.toLowerCase() === lower)
  );
}

// --- VotD ---

const votdBySlug = new Map<string, VotdEntry[]>();
for (const entry of votdAll as VotdEntry[]) {
  const slug = bookAbbrToSlug.get(entry.book) || entry.book_name.toLowerCase().replace(/ /g, '-');
  const arr = votdBySlug.get(slug) || [];
  arr.push(entry);
  votdBySlug.set(slug, arr);
}

export function getAllVotdEntries(): VotdEntry[] {
  return votdAll as VotdEntry[];
}

export function getVotdByBook(slugOrAbbr: string): VotdEntry[] {
  const slug = bookAbbrToSlug.has(slugOrAbbr)
    ? bookAbbrToSlug.get(slugOrAbbr)!
    : slugOrAbbr;
  return votdBySlug.get(slug) || [];
}

export function getVotdEntry(slug: string, chapter: number): VotdEntry | undefined {
  return getVotdByBook(slug).find(e => e.chapter === chapter);
}

// --- Meditation ---

export function getMeditationEntries(year: 1 | 2): MeditationEntry[] {
  return (year === 1 ? meditationYear1 : meditationYear2) as MeditationEntry[];
}

export function getMeditationByDay(year: 1 | 2, day: number): MeditationEntry | undefined {
  return getMeditationEntries(year).find(e => e.day === day);
}

// --- Quotes ---

export function getAllQuotes(): QuoteEntry[] {
  return quotesAll as QuoteEntry[];
}

export function getVerifiedQuotes(): QuoteEntry[] {
  return (quotesAll as QuoteEntry[]).filter(q => q.source_url != null);
}

export function getQuotesByAuthor(authorSlug: string): QuoteEntry[] {
  return (quotesAll as QuoteEntry[]).filter(q => q.author_slug === authorSlug);
}

export function getQuotesByTheme(theme: string): QuoteEntry[] {
  const lower = theme.toLowerCase();
  return (quotesAll as QuoteEntry[]).filter(q =>
    q.themes?.some(t => t.toLowerCase() === lower)
  );
}

export function getUniqueAuthors(): { name: string; slug: string; count: number }[] {
  const map = new Map<string, { name: string; slug: string; count: number }>();
  for (const q of quotesAll as QuoteEntry[]) {
    const existing = map.get(q.author_slug);
    if (existing) {
      existing.count++;
    } else {
      map.set(q.author_slug, { name: q.author, slug: q.author_slug, count: 1 });
    }
  }
  return [...map.values()].sort((a, b) => b.count - a.count);
}

export function getUniqueThemes(): string[] {
  const set = new Set<string>();
  for (const q of quotesAll as QuoteEntry[]) {
    for (const t of q.themes || []) {
      set.add(t);
    }
  }
  return [...set].sort();
}

// --- Slug helpers ---

export function getBookSlug(abbr: string): string {
  return bookAbbrToSlug.get(abbr) || abbr.toLowerCase();
}

export function getBookInfo(slug: string) {
  return bookSlugMap.get(slug);
}

export function getDevotionalUrl(slug: string, chapter: number): string {
  return `/devotional/${slug}/${chapter}/`;
}

export function getVotdUrl(slug: string, chapter: number): string {
  return `/verse-of-the-day/${slug}/${chapter}/`;
}

export function getBibleUrl(slug: string, chapter: number, verse?: number): string {
  const base = `/bible/${slug}/${chapter}/`;
  return verse ? `${base}#v${verse}` : base;
}
