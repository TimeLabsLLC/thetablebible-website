import libraryData from '../data/library.json';

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

export function getFullBookVideoId(book: LibraryBook): string | null {
  return book.fullBookVideoId || book.fullbookVideoId || null;
}

export function getChapterVideoId(book: LibraryBook, chapter: number): string | null {
  return book.videos?.[String(chapter)] || null;
}