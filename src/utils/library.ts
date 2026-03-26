import libraryData from '../data/library.json';
import videoUploadDates from '../data/video-upload-dates.json';

export type LibraryBook = {
  abbr: string;
  name: string;
  chapters: number;
  slug: string;
  description?: string;
  videos?: Record<string, string>;
  fullBookVideoId?: string;
  fullbookVideoId?: string;
};

export type LibrarySection = {
  id: string;
  title: string;
  subtitle: string;
  books: LibraryBook[];
};

const THUMB_VERSION = '20260326a';

export function getLibrarySections(): LibrarySection[] {
  return libraryData.sections as LibrarySection[];
}

export function getAllBooksWithSections() {
  return getLibrarySections().flatMap(section =>
    section.books.map(book => ({ book, sectionTitle: section.title }))
  );
}

export function getChapterUrl(bookSlug: string, chapter: number): string {
  return `/library/${bookSlug}/chapter-${chapter}/`;
}

export function getChapterThumbUrl(bookAbbr: string, chapter: number): string {
  return `/thumbs/${bookAbbr}_${chapter}_thumb.webp?v=${THUMB_VERSION}`;
}

export function getFullBookThumbUrl(bookAbbr: string): string {
  return `/thumbs/${bookAbbr}_fullbook_thumb.webp?v=${THUMB_VERSION}`;
}

export function getFullBookVideoId(book: LibraryBook): string | null {
  return book.fullBookVideoId || book.fullbookVideoId || null;
}

export function getChapterVideoId(book: LibraryBook, chapter: number): string | null {
  return book.videos?.[String(chapter)] || null;
}

export function getVideoUploadDate(videoId: string | null): string | null {
  if (!videoId) {
    return null;
  }
  const rawDate = (videoUploadDates as Record<string, string>)[videoId] || null;
  if (!rawDate) {
    return null;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
    return `${rawDate}T00:00:00Z`;
  }

  return rawDate;
}

export function getPlayableChapterSequence(book: LibraryBook, startChapter = 1): Array<{ chapter: number; videoId: string }> {
  const sequence: Array<{ chapter: number; videoId: string }> = [];

  for (let chapter = startChapter; chapter <= book.chapters; chapter += 1) {
    const videoId = getChapterVideoId(book, chapter);
    if (!videoId) {
      break;
    }

    sequence.push({ chapter, videoId });
  }

  return sequence;
}

export function getPlayAllUrl(book: LibraryBook, startChapter = 1): string | null {
  const sequence = getPlayableChapterSequence(book, startChapter);
  if (sequence.length === 0) {
    return null;
  }

  const params = new URLSearchParams({
    flow: '1',
    autoplay: '1',
  });

  return `${getChapterUrl(book.slug, startChapter)}?${params.toString()}`;
}