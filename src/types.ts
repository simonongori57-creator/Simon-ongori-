export interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  duration: string;
  region: string;
  genre: string;
  description?: string;
  downloadUrl?: string; // Mocked for the demo
}

export interface SongFilters {
  query?: string;
  region?: string;
  genre?: string;
}
