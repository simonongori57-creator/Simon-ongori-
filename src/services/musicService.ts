import { GoogleGenAI, Type } from "@google/genai";
import { Song } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SONG_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      title: { type: Type.STRING },
      artist: { type: Type.STRING },
      album: { type: Type.STRING },
      coverUrl: { type: Type.STRING },
      duration: { type: Type.STRING },
      region: { type: Type.STRING },
      genre: { type: Type.STRING },
      description: { type: Type.STRING },
    },
    required: ["id", "title", "artist", "album", "coverUrl", "duration", "region", "genre"],
  },
};

export async function searchSongs(query: string): Promise<Song[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Find 8 realistic global songs matching the query: "${query}". 
      Include a mix of popular and niche tracks. 
      For coverUrl, use descriptive keywords that would generate a good placeholder or use Unsplash-style URLs.
      The duration should be in MM:SS format.
      The region should be the country or continent of origin.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: SONG_SCHEMA,
      },
    });

    const songs = JSON.parse(response.text || "[]");
    return songs.map((s: any) => ({
      ...s,
      coverUrl: s.coverUrl.startsWith('http') 
        ? s.coverUrl 
        : `https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop&music=${encodeURIComponent(s.title)}`,
    }));
  } catch (error) {
    console.error("Search failed:", error);
    return [];
  }
}

export async function getTrendingSongs(): Promise<Song[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide 8 currently trending "Sonic World" hits from different regions (e.g., K-pop, Afrobeats, Latin, J-rock, Nordic Folk, etc.).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: SONG_SCHEMA,
      },
    });

    const songs = JSON.parse(response.text || "[]");
    return songs.map((s: any) => ({
      ...s,
      coverUrl: `https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=800&auto=format&fit=crop&music=${encodeURIComponent(s.artist)}`,
    }));
  } catch (error) {
    console.error("Trending fetch failed:", error);
    return [];
  }
}

export async function getPersonalizedRecommendations(history: Song[]): Promise<Song[]> {
  if (history.length === 0) return getTrendingSongs();
  
  try {
    const historyDesc = history.map(s => `${s.title} by ${s.artist} (${s.genre})`).join(", ");
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on this listening history: [${historyDesc}], recommend 8 new global songs. 
      Vary the genres slightly but stay within the general vibe. 
      Focus on international artists.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: SONG_SCHEMA,
      },
    });

    const songs = JSON.parse(response.text || "[]");
    return songs.map((s: any) => ({
      ...s,
      coverUrl: `https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop&music=${encodeURIComponent(s.genre)}`,
    }));
  } catch (error) {
    console.error("Recommendations failed:", error);
    return getTrendingSongs();
  }
}

export async function browseByCategory(category: string, type: 'genre' | 'artist'): Promise<Song[]> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide 8 songs for the ${type}: "${category}". Include a mix of classics and modern hits.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: SONG_SCHEMA,
      },
    });

    const songs = JSON.parse(response.text || "[]");
    return songs.map((s: any) => ({
      ...s,
      coverUrl: `https://images.unsplash.com/photo-1459749411177-042180ce673c?q=80&w=800&auto=format&fit=crop&music=${encodeURIComponent(category)}`,
    }));
  } catch (error) {
    console.error("Category browse failed:", error);
    return [];
  }
}
