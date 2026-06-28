const API_BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000/api";

const IMAGE_BASE_URL = API_BASE_URL.replace(/\/api\/?$/, "") + "/assets/images";

const IMAGE_INDEX = [
  {
    file: "necklace.jpg",
    keywords: ["gold", "necklace", "jewelry", "luxury", "chain", "wedding", "ornate", "traditional", "accessory", "fashion"]
  },
  {
    file: "necklace2.jpg",
    keywords: ["gold", "necklace", "jewelry", "pendant", "luxury", "chain", "display", "boutique", "fashion", "accessory"]
  },
  {
    file: "jwellery set.jpg",
    keywords: ["jewelry", "set", "gold", "necklace", "earrings", "ring", "luxury", "bridal", "collection", "accessory"]
  },
  {
    file: "earrings.jpg",
    keywords: ["earrings", "diamond", "silver", "jewelry", "studs", "luxury", "fashion", "sparkle", "accessory", "gemstone"]
  },
  {
    file: "bracelet.jpg",
    keywords: ["bracelet", "gold", "jewelry", "chain", "luxury", "bangle", "accessory", "fashion", "ornament", "traditional"]
  },
  {
    file: "bangles1.jpg",
    keywords: ["bangles", "gold", "bracelet", "jewelry", "traditional", "stacked", "accessory", "fashion", "ornament", "ethnic"]
  },
  {
    file: "bangles.jpg",
    keywords: ["bangles", "gold", "jewelry", "bracelet", "ornate", "traditional", "accessory", "fashion", "luxury", "ethnic"]
  }
];

const normalizeText = (value) => String(value || "").toLowerCase();

const extractKeywords = (text) =>
  normalizeText(text)
    .split(/[^a-z0-9]+/g)
    .filter(Boolean);

export const imageIndex = IMAGE_INDEX.map((image) => ({
  ...image,
  src: `${IMAGE_BASE_URL}/${encodeURIComponent(image.file)}`
}));

export const getImageByName = (fileName) => imageIndex.find((image) => image.file === fileName) || null;

export const selectBestImage = (query, fallbackIndex = 0) => {
  const queryTokens = new Set(extractKeywords(query));
  let bestImage = imageIndex[fallbackIndex] || imageIndex[0] || null;
  let bestScore = -1;

  for (const image of imageIndex) {
    let score = 0;
    for (const keyword of image.keywords) {
      if (queryTokens.has(keyword)) {
        score += 3;
      } else if ([...queryTokens].some((token) => token.includes(keyword) || keyword.includes(token))) {
        score += 1;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestImage = image;
    }
  }

  return bestImage;
};

export const getImageCollection = (seedKeyword = "jewelry") => {
  const primary = selectBestImage(seedKeyword, 0);
  return {
    hero: primary,
    secondary: getImageByName("earrings.jpg") || imageIndex[0],
    tertiary: getImageByName("bracelet.jpg") || imageIndex[1],
    grid: [
      primary,
      getImageByName("necklace2.jpg") || imageIndex[0],
      getImageByName("bangles1.jpg") || imageIndex[0],
      getImageByName("jwellery set.jpg") || imageIndex[0]
    ]
  };
};
