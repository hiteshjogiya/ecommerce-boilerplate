export const DEFAULT_BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nNDAwJyBoZWlnaHQ9JzMwMCcgdmlld0JveD0nMCAwIDQwMCAzMDAnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSdnJyB4MT0nMCcgeTE9JzAnIHgyPScxJyB5Mj0nMSc+PHN0b3Agc3RvcC1jb2xvcj0nI2UyZThmMCcgb2Zmc2V0PScwJScvPjxzdG9wIHN0b3AtY29sb3I9JyNjYmQ1ZTEnIG9mZnNldD0nMTAwJScvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSc0MDAnIGhlaWdodD0nMzAwJyBmaWxsPSd1cmwoI2cpJy8+PC9zdmc+";

export function getImageProps(src: string) {
  const hasRemoteSource = src.startsWith("http://") || src.startsWith("https://");

  if (!hasRemoteSource) {
    return {
      quality: 80,
    };
  }

  return {
    quality: 80,
    placeholder: "blur" as const,
    blurDataURL: DEFAULT_BLUR_DATA_URL,
  };
}
