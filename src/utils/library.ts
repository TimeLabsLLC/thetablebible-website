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

const THUMB_VERSION = '20260321b';

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
  return (videoUploadDates as Record<string, string>)[videoId] || null;
}