import heroFallback from "../assets/hero.png";

export function getImageSrc(entity) {
  return getActualImageSrc(entity) || heroFallback;
}

export function getActualImageSrc(entity) {
  if (!entity) return heroFallback;

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const normalize = (value) => {
    if (!value || typeof value !== "string") return null;

    const trimmed = value.trim();
    if (!trimmed) return null;

    if (/^(https?:|data:|blob:)/i.test(trimmed)) {
      return trimmed;
    }

    const cleanPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    return new URL(cleanPath, apiBase).toString();
  };

  const fromArray = (value) => {
    if (!Array.isArray(value) || value.length === 0) return null;

    for (const item of value) {
      if (typeof item === "string") {
        const resolved = normalize(item);
        if (resolved) return resolved;
        continue;
      }

      if (item && typeof item === "object") {
        const nested = normalize(
          item.url || item.src || item.image_url || item.imageUrl || item.photo_url || item.photoUrl
        );
        if (nested) return nested;
      }
    }

    return null;
  };

  const candidates = [
    entity.image_url,
    entity.imageUrl,
    entity.image,
    entity.photo_url,
    entity.photoUrl,
    entity.photo,
    entity.thumbnail,
    entity.cover_image,
    entity.images,
    entity.photos,
  ];

  for (const candidate of candidates) {
    const arrayMatch = fromArray(candidate);
    if (arrayMatch) return arrayMatch;

    const stringMatch = normalize(candidate);
    if (stringMatch) return stringMatch;
  }

  // Fallback to checking media object
  if (entity.media && entity.media.image_url) {
    const mediaMatch = normalize(entity.media.image_url);
    if (mediaMatch) return mediaMatch;
  }

  return null;
}

export function getVideoSrc(entity) {
  return getActualVideoSrc(entity);
}

export function getActualVideoSrc(entity) {
  if (!entity) return null;

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const normalize = (value) => {
    if (!value || typeof value !== "string") return null;

    const trimmed = value.trim();
    if (!trimmed) return null;

    if (/^(https?:|data:|blob:)/i.test(trimmed)) {
      return trimmed;
    }

    const cleanPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
    return new URL(cleanPath, apiBase).toString();
  };

  const candidates = [
    entity.video_url,
    entity.videoUrl,
    entity.promo_video,
    entity.promoVideo,
    entity.video,
    entity.trailer,
  ];

  for (const candidate of candidates) {
    if (typeof candidate === "string") {
      const match = normalize(candidate);
      if (match) return match;
    }
  }

  // Fallback to checking media object
  if (entity.media && entity.media.video_url) {
    const mediaMatch = normalize(entity.media.video_url);
    if (mediaMatch) return mediaMatch;
  }

  return null;
}