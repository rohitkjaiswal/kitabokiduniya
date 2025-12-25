export async function fetchAuthorFromWikipedia(authorName) {
  const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
    authorName
  )}`;

  try {
    const res = await fetch(searchUrl);
    if (!res.ok) throw new Error("Wiki fetch failed");

    const data = await res.json();

    return {
      bio: data.extract || "Biography not available.",
      photo:
        data.thumbnail?.source ||
        "https://via.placeholder.com/300x400?text=Author",
      wikiUrl: data.content_urls?.desktop?.page,
      wikiTitle: data.title,
    };
  } catch {
    return {
      bio: "Biography not available.",
      photo: "https://via.placeholder.com/300x400?text=Author",
      wikiUrl: `https://en.wikipedia.org/wiki/${encodeURIComponent(authorName)}`,
      wikiTitle: authorName,
    };
  }
}
